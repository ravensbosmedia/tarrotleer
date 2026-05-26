import React, { useState } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import OpenAI from 'openai';
import { TarotCard } from '../types/cards';
import { QuotaManager } from '../utils/quotaManager';

interface Props {
  cards: TarotCard[];
  positions: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const TarotChat: React.FC<Props> = ({ cards, positions }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions] = useState([
    "Wat betekent deze combinatie van kaarten voor mijn persoonlijke groei?",
    "Hoe kan ik het beste omgaan met de uitdagingen die de kaarten laten zien?",
    "Welke kansen zie je voor mij in deze legging?",
    "Wat is de belangrijkste boodschap die ik hieruit kan meenemen?"
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    try {
      const canSend = await QuotaManager.canSendChatMessage();
      if (!canSend) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Het dagelijks limiet voor chat berichten is bereikt. Probeer het morgen opnieuw.'
        }]);
        return;
      }

      const userMessage = input.trim();
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setLoading(true);

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

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Je bent een ervaren Nederlandse tarotlezer met een warme, empathische benadering.
            Geef persoonlijke, inzichtelijke antwoorden die hoop en begrip bieden.
            Gebruik een vriendelijke, toegankelijke taal en spreek de persoon direct aan.
            Focus op praktische adviezen en positieve groeimogelijkheden.`
          },
          {
            role: "user",
            content: `Tarotlegging: ${JSON.stringify(cardsInfo)}
            Vraag van de bezoeker: ${userMessage}
            
            Geef een persoonlijk, behulpzaam antwoord dat:
            - Direct ingaat op de specifieke vraag
            - De relevante kaarten betrekt
            - Praktische inzichten biedt
            - Bemoedigend en opbouwend is`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const aiResponse = response.choices[0].message.content || '';
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      await QuotaManager.incrementChatMessage();
    } catch (err) {
      console.error('Error in chat:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Er is een fout opgetreden. Probeer het later opnieuw.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-purple-700">
          Persoonlijk Tarot Gesprek
        </h3>
      </div>

      {/* Suggesties */}
      {messages.length === 0 && (
        <div className="mb-6">
          <p className="text-gray-600 mb-3">Suggesties voor vragen:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm hover:bg-purple-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            Stel een vraag over je tarotlegging en ontvang persoonlijk inzicht.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Stel je vraag over de legging..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-lg bg-purple-600 text-white flex items-center gap-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
          }`}
        >
          <Send className="w-4 h-4" />
          Verstuur
        </button>
      </form>
    </div>
  );
};