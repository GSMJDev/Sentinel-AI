import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { AIBotIcon } from './icons/AIBotIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
}

interface Message {
    from: 'user' | 'ai';
    text: string;
}

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', text: 'Olá! Como posso ajudar com sua análise de segurança?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && apiKey && !chatRef.current) {
        try {
            const ai = new GoogleGenAI({ apiKey });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'Você é um assistente de IA especializado em cibersegurança. Responda de forma concisa e útil às perguntas do usuário sobre os resultados da análise de segurança ou conceitos gerais de segurança.',
                },
            });
        } catch (error) {
            console.error("Failed to initialize chat:", error);
            setMessages(prev => [...prev, { from: 'ai', text: 'Erro ao iniciar o chat. Verifique sua chave de API.'}]);
        }
    }
  }, [isOpen, apiKey]);
  
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (input.trim() && !isLoading && chatRef.current) {
      const newUserMessage: Message = { from: 'user', text: input };
      setMessages(prev => [...prev, newUserMessage]);
      setInput('');
      setIsLoading(true);
      
      try {
        const responseStream = await chatRef.current.sendMessageStream({ message: input });
        
        let aiResponseText = '';
        setMessages(prev => [...prev, { from: 'ai', text: '' }]); // Add placeholder for streaming

        for await (const chunk of responseStream) {
            aiResponseText += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { from: 'ai', text: aiResponseText };
                return newMessages;
            });
        }
        
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [...prev, { from: 'ai', text: 'Desculpe, ocorreu um erro ao processar sua mensagem.' }]);
      } finally {
        setIsLoading(false);
      }
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
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.from === 'ai' ? 'bg-[#1A1A1A] text-[#E0E0E0]' : 'bg-[#8B5CF6] text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}{isLoading && msg.from === 'ai' && index === messages.length -1 ? '...' : ''}</p>
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
            disabled={isLoading || !apiKey}
            className="flex-1 bg-[#1A1A1A] border border-[#1A1A1A] rounded-md px-3 py-2 text-sm text-[#E0E0E0] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !apiKey}
            className="bg-[#8B5CF6] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-80 transition-colors disabled:bg-[#9E9E9E] disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};