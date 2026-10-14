import React, { useState } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { TarotCard } from '../types/cards';
import { QuotaManager } from '../utils/quotaManager';
import { AiDisclaimer } from './AiDisclaimer';

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

      const cardsInfo = cards.map((card, index) => ({
        name: card.nameNL,
        position: positions[index],
        meaning: card.meaningUpright,
        description: card.description,
        extendedDescription: card.extendedDescription,
        loveReading: card.loveReading
      }));

      // Via de eigen backend: de OpenAI-key blijft op de server
      const res = await fetch('/api/tarot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kaarten: cardsInfo, vraag: userMessage, geschiedenis: messages }),
      });
      if (!res.ok) throw new Error(`Chat mislukt (${res.status})`);
      const data = await res.json();

      const aiResponse: string = data.antwoord || '';
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
    <div className="zf-kaart p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-[#F1CB78]" />
        <h3 className="font-medium text-[#FFF3DF] text-xl">
          Persoonlijk Tarot Gesprek
        </h3>
      </div>

      {/* Suggesties */}
      {messages.length === 0 && (
        <div className="mb-6">
          <p className="text-[#CFC2DC] mb-3">Suggesties voor vragen:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="bg-[#2D2040] text-[#F1CB78] px-4 py-2 rounded-full text-sm hover:bg-[#3A2A52] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-[#17112C] rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-[#B9A9CC] text-center py-4">
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
                  <div className="w-8 h-8 rounded-full bg-[#3A2A52] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#F1CB78]" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-[#F1CB78] text-[#1C0D06]'
                      : 'bg-[#2D2040] text-[#E0D5E9]'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#482254] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#F1CB78]" />
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
          className="zf-veld flex-1"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`zf-knop flex items-center gap-2 ${
 loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FFC653]'
 }`}
        >
          <Send className="w-4 h-4" />
          Verstuur
        </button>
      </form>
      <AiDisclaimer />
    </div>
  );
};