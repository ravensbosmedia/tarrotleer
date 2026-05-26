import React from 'react';
import OpenAI from 'openai';
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

        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        });

        const cardsInfo = cards.map((card, index) => ({
          name: card.nameNL,
          position: positions[index],
          meaning: card.meaningUpright,
          description: card.description,
          extendedDescription: card.extendedDescription,
          loveReading: card.loveReading
        }));

        const baseSystemPrompt = `Je bent een ervaren Nederlandse tarotlezer met een warme, empathische benadering. 
        Geef een gebalanceerde interpretatie waarbij je evenveel aandacht besteedt aan elke kaart en positie.
        Gebruik concrete voorbeelden en praktische adviezen.
        ${quotaCheck.isPaid ? '\nDit is een betaalde legging, geef daarom extra diepgaande en gedetailleerde inzichten.' : ''}`;

        let interpretations: string[] = [];

        if (readingType === 'celtic') {
          // Eerste deel: Kaarten 1-5
          const firstHalfPrompt = `${baseSystemPrompt}
          
          Analyseer de eerste vijf kaarten van het Keltisch Kruis:
          ${JSON.stringify(cardsInfo.slice(0, 5))}
          
          Geef een diepgaande interpretatie met focus op:
          1. De centrale situatie (kaart 1)
            - Wat is de kern van de vraag of situatie?
            - Welke energie is hier dominant?
          
          2. De uitdaging (kaart 2)
            - Welke invloed kruist de situatie?
            - Hoe werkt deze kracht voor of tegen?
          
          3. De basis (kaart 3)
            - Welke fundamenten zijn aanwezig?
            - Wat uit het verleden is nog relevant?
          
          4. Het recente verleden (kaart 4)
            - Welke gebeurtenissen hebben geleid tot nu?
            - Welke lessen kunnen hieruit getrokken worden?
          
          5. Mogelijke uitkomst (kaart 5)
            - Welk potentieel is aanwezig?
            - Wat is het beste scenario?
          
          Leg ook uit hoe deze kaarten met elkaar samenhangen en elkaar beïnvloeden.
          Geef praktische inzichten en concrete adviezen waar mogelijk.`;

          const firstResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: firstHalfPrompt },
              { role: "user", content: vraagstelling || "Wat vertellen deze kaarten over de situatie?" }
            ],
            temperature: 0.7,
            max_tokens: 3500
          });

          interpretations.push(firstResponse.choices[0].message.content || '');

          // Tweede deel: Kaarten 6-10
          const secondHalfPrompt = `${baseSystemPrompt}
          
          Analyseer de laatste vijf kaarten van het Keltisch Kruis:
          ${JSON.stringify(cardsInfo.slice(5))}
          
          Geef een diepgaande interpretatie met focus op:
          1. De nabije toekomst (kaart 6)
            - Welke energie komt eraan?
            - Hoe kun je je hierop voorbereiden?
          
          2. Je eigen houding (kaart 7)
            - Hoe sta je zelf in de situatie?
            - Welke aanpassingen zijn helpend?
          
          3. Externe invloeden (kaart 8)
            - Welke omgevingsfactoren spelen mee?
            - Hoe kun je hier het beste mee omgaan?
          
          4. Hoop en vrees (kaart 9)
            - Welke verwachtingen leven er?
            - Hoe beïnvloeden deze de situatie?
          
          5. Uiteindelijke uitkomst (kaart 10)
            - Wat is het meest waarschijnlijke resultaat?
            - Welke acties kunnen dit positief beïnvloeden?
          
          Verbind deze interpretatie met de eerder gegeven inzichten.
          Geef concrete adviezen voor de weg vooruit.`;

          const secondResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: secondHalfPrompt },
              { role: "user", content: vraagstelling || "Wat vertellen deze kaarten over de situatie?" }
            ],
            temperature: 0.7,
            max_tokens: 3500
          });

          interpretations.push(secondResponse.choices[0].message.content || '');
        } else {
          // Voor andere leggingen: één interpretatie
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: baseSystemPrompt },
              { 
                role: "user", 
                content: `Geef een interpretatie van deze tarotlegging:
                ${vraagstelling ? `\nVraag: ${vraagstelling}` : ''}
                \nKaarten: ${JSON.stringify(cardsInfo)}`
              }
            ],
            temperature: 0.7,
            max_tokens: quotaCheck.tokens
          });

          interpretations.push(response.choices[0].message.content || '');
        }

        setInterpretation(interpretations);
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