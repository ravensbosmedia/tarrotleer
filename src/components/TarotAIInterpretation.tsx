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
}

export const TarotAIInterpretation: React.FC<Props> = ({ 
  cards, 
  positions, 
  isLoading, 
  error,
  vraagstelling,
  readingType = 'three'
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

  if (error || aiError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>{error || aiError}</p>
        </div>
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="bg-purple-50 rounded-lg p-6 mt-6">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <p className="text-purple-600">Je persoonlijke interpretatie wordt voorbereid...</p>
        </div>
      </div>
    );
  }

  if (!interpretation.length) return null;

  return (
    <div className="bg-purple-50 rounded-lg p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        {isPaidReading && <Lock className="w-5 h-5 text-purple-600" />}
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-purple-700">
          {isPaidReading ? 'Premium Tarot Interpretatie' : 'Jouw Persoonlijke Tarot Interpretatie'}
        </h3>
      </div>
      <div className="prose prose-purple max-w-none">
        {interpretation.map((part, index) => (
          <div key={index} className="whitespace-pre-line text-gray-700 mb-6">
            {index > 0 && <hr className="my-6" />}
            {part}
          </div>
        ))}
      </div>
    </div>
  );
};