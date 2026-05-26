import { collection, doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

interface DailyQuota {
  date: string;
  interpretations: number;
  chatMessages: number;
  paidReadings: number;
}

interface ReadingLimits {
  tokens: number;
  isPaid: boolean;
}

const READING_LIMITS: Record<string, ReadingLimits> = {
  daily: { tokens: 800, isPaid: false },
  three: { tokens: 1200, isPaid: false },
  celtic: { tokens: 4000, isPaid: false }, // Aangepast naar 4000 tokens
  relationship: { tokens: 1500, isPaid: false },
  career: { tokens: 1200, isPaid: false }
};

const DAILY_LIMITS = {
  interpretations: 100,
  chatMessages: 500,
  paidReadings: 50
};

export class QuotaManager {
  private static getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }

  private static async getDailyQuota(): Promise<DailyQuota> {
    const quotaRef = doc(db, 'quotas', this.getTodayKey());
    const quotaDoc = await getDoc(quotaRef);
    
    if (!quotaDoc.exists()) {
      const newQuota: DailyQuota = {
        date: this.getTodayKey(),
        interpretations: 0,
        chatMessages: 0,
        paidReadings: 0
      };
      await setDoc(quotaRef, newQuota);
      return newQuota;
    }
    
    return quotaDoc.data() as DailyQuota;
  }

  static async canUseInterpretation(readingType: string = 'three'): Promise<{
    canUse: boolean;
    isPaid: boolean;
    tokens: number;
  }> {
    const quota = await this.getDailyQuota();
    const limits = READING_LIMITS[readingType] || { tokens: 800, isPaid: false };

    // Alle leggingen zijn nu gratis
    return {
      canUse: quota.interpretations < DAILY_LIMITS.interpretations,
      isPaid: false,
      tokens: limits.tokens
    };
  }

  static async canSendChatMessage(): Promise<boolean> {
    const quota = await this.getDailyQuota();
    return quota.chatMessages < DAILY_LIMITS.chatMessages;
  }

  static async incrementInterpretation(isPaid: boolean = false) {
    const quotaRef = doc(db, 'quotas', this.getTodayKey());
    await setDoc(quotaRef, {
      interpretations: increment(1)
    }, { merge: true });
  }

  static async incrementChatMessage() {
    const quotaRef = doc(db, 'quotas', this.getTodayKey());
    await setDoc(quotaRef, {
      chatMessages: increment(1)
    }, { merge: true });
  }
}