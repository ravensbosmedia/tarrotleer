import React from 'react';
import { Sparkles, AlertCircle, Lock } from 'lucide-react';
import { TarotCard } from '../types/cards';
import { QuotaManager } from '../utils/quotaManager';

interface Props {
  cards: TarotCard[];
  positions: string[];
  isLoading?: boolean;
  error?: string;
  vraagstelling?: string;
  readingType?: string;
  /** krijgt de duiding per kaart zodra die binnen is (bv. om de legging te bewaren) */
  onInterpretatie?: (teksten: string[]) => void;
}

export const TarotAIInterpretation: React.FC<Props> = ({ 
  cards, 
  positions, 
  isLoading, 
  error,
  vraagstelling,
  readingType = 'three',
  onInterpretatie,
}) => {
  const [interpretation, setInterpretation] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string>('');
  const [isPaidReading, setIsPaidReading] = React.useState(false);

  React.useEffect(() => {
    const generateInterpretation = async () => {
      if (!cards.length || loading) return;

      try {
        const quotaCheck = await QuotaManager.canUseInterpretation(readingType);
        if (!quotaCheck.canUse) {
          if (quotaCheck.isPaid) {
            setAiError('Deze legging is alleen beschikbaar als betaalde dienst. Neem contact op voor meer informatie.');
          } else {
            setAiError('Het dagelijks limiet voor gratis interpretaties is bereikt. Probeer het morgen opnieuw of kies voor een betaalde legging.');
          }
          return;
        }

        setIsPaidReading(quotaCheck.isPaid);
        setLoading(true);
        setAiError('');

        const cardsInfo = cards.map((card, index) => ({
          nameNL: card.nameNL,
          position: positions[index],
          meaningUpright: card.meaningUpright,
          description: card.description,
        }));

        const resp = await fetch('/api/tarot/interpretatie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cards: cardsInfo, positions, vraagstelling, readingType }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error || `Server fout ${resp.status}`);
        }

        const data = await resp.json() as { interpretaties: string[] };
        setInterpretation(data.interpretaties);
        onInterpretatie?.(data.interpretaties);
        await QuotaManager.incrementInterpretation(quotaCheck.isPaid);
      } catch (err) {
        console.error('Error generating interpretation:', err);
        setAiError('Er is een fout opgetreden bij het genereren van de interpretatie. Probeer het later opnieuw.');
      } finally {
        setLoading(false);
      }
    };

    generateInterpretation();
  }, [cards, positions, vraagstelling, readingType]);

  // Opmaak gelijk aan de duiding bij Lenormand (Zen Flow-paneel)
  const paneel: React.CSSProperties = { background: '#20162F', border: '0.5px solid rgba(239,180,255,0.38)', borderRadius: 12, padding: '1.6rem 1.7rem', marginTop: '1.5rem' };
  const label: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.12em', color: '#F1CB78', textTransform: 'uppercase' };

  if (error || aiError) {
    return (
      <div style={{ ...paneel, borderColor: 'rgba(240,165,150,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F0A596', fontSize: 14 }}>
          <AlertCircle className="w-5 h-5" />
          <p style={{ margin: 0 }}>{error || aiError}</p>
        </div>
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div style={{ ...paneel, fontSize: 14, color: '#B9A9CC', fontStyle: 'italic' }}>
        De kaarten worden geduid…
      </div>
    );
  }

  if (!interpretation.length) return null;

  return (
    <div style={paneel}>
      <div style={{ ...label, display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
        {isPaidReading ? <Lock className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        Duiding van de legging
      </div>
      {interpretation.map((part, index) => (
        <div key={index} style={{ paddingTop: index ? '1.1rem' : 0, marginTop: index ? '1.1rem' : 0, borderTop: index ? '0.5px solid rgba(239,180,255,0.22)' : 'none' }}>
          {positions[index] && (
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#FFF3DF', marginBottom: 4 }}>
              {positions[index]}{cards[index] ? <span style={{ color: '#B9A9CC', fontSize: 15 }}> · {cards[index].nameNL}</span> : null}
            </div>
          )}
          <div style={{ fontSize: 15.5, color: '#E0D5E9', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{part}</div>
        </div>
      ))}
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: '#B9A9CC', marginTop: '1rem', letterSpacing: '0.05em' }}>
        Op basis van onze kaartbetekenissen
      </div>
    </div>
  );
};
