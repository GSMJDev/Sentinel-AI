
import React, { useState } from 'react';
import { AIBotIcon } from './icons/AIBotIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Olá! Como posso ajudar com sua análise de segurança?' },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input }]);
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { from: 'ai', text: 'Estou processando sua pergunta...' }]);
      }, 1000);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-[#2C2C2C] rounded-lg shadow-2xl flex flex-col transition-transform duration-300 z-50">
      <header className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-t-lg">
        <div className="flex items-center gap-3">
          <AIBotIcon className="h-6 w-6 text-[#8B5CF6]" />
          <h3 className="font-semibold text-white">Assistente IA</h3>
        </div>
        <button onClick={onClose} className="text-[#9E9E9E] hover:text-white">
          <ChevronDownIcon className="h-5 w-5" />
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.from === 'ai' ? 'bg-[#1A1A1A] text-[#E0E0E0]' : 'bg-[#8B5CF6] text-white'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[#1A1A1A]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre os resultados..."
            className="flex-1 bg-[#1A1A1A] border border-[#1A1A1A] rounded-md px-3 py-2 text-sm text-[#E0E0E0] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
          />
          <button
            onClick={handleSend}
            className="bg-[#8B5CF6] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-80 transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
