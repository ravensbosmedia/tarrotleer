import { getQuota, setQuota, incrementQuotaField } from '../config/localDB';

interface ReadingLimits {
  tokens: number;
  isPaid: boolean;
}

const READING_LIMITS: Record<string, ReadingLimits> = {
  daily: { tokens: 800, isPaid: false },
  three: { tokens: 1200, isPaid: false },
  celtic: { tokens: 4000, isPaid: false },
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

  private static getDailyQuota() {
    const date = this.getTodayKey();
    const quota = getQuota(date);
    if (!quota) {
      const newQuota = { date, interpretations: 0, chatMessages: 0, paidReadings: 0 };
      setQuota(date, newQuota);
      return newQuota;
    }
    return quota;
  }

  static async canUseInterpretation(readingType: string = 'three'): Promise<{
    canUse: boolean;
    isPaid: boolean;
    tokens: number;
  }> {
    const quota = this.getDailyQuota();
    const limits = READING_LIMITS[readingType] || { tokens: 800, isPaid: false };

    return {
      canUse: quota.interpretations < DAILY_LIMITS.interpretations,
      isPaid: false,
      tokens: limits.tokens
    };
  }

  static async canSendChatMessage(): Promise<boolean> {
    const quota = this.getDailyQuota();
    return quota.chatMessages < DAILY_LIMITS.chatMessages;
  }

  static async incrementInterpretation(_isPaid: boolean = false) {
    incrementQuotaField(this.getTodayKey(), 'interpretations');
  }

  static async incrementChatMessage() {
    incrementQuotaField(this.getTodayKey(), 'chatMessages');
  }
}
