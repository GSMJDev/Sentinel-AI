import React, { useState, useEffect } from 'react';
import { validateApiKey } from '../../services/geminiService';

interface SettingsProps {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  defaultPrompt: string;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ systemPrompt, setSystemPrompt, defaultPrompt, apiKey, setApiKey }) => {
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [promptSaveStatus, setPromptSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [keyStatus, setKeyStatus] = useState<'idle' | 'validating' | 'saved' | 'invalid'>('idle');

  useEffect(() => {
    setLocalPrompt(systemPrompt);
  }, [systemPrompt]);
  
  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  // Reset status if user starts typing a new key
  useEffect(() => {
    if (localApiKey !== apiKey) {
        setKeyStatus('idle');
    }
  }, [localApiKey, apiKey]);


  const handleSavePrompt = () => {
    setSystemPrompt(localPrompt);
    setPromptSaveStatus('saved');
    setTimeout(() => setPromptSaveStatus('idle'), 2000);
  };

  const handleRestorePrompt = () => {
    setLocalPrompt(defaultPrompt);
  };
  
  const handleSaveKey = async () => {
    if (!localApiKey.trim()) {
        setKeyStatus('invalid');
        return;
    }
    setKeyStatus('validating');
    const isValid = await validateApiKey(localApiKey);
    if (isValid) {
        setApiKey(localApiKey);
        setKeyStatus('saved');
        setTimeout(() => setKeyStatus('idle'), 2000);
    } else {
        setKeyStatus('invalid');
    }
  };
  
  const getKeyButtonState = () => {
    switch (keyStatus) {
      case 'validating':
        return {
          text: 'Validando...',
          className: 'bg-gray-500 text-white cursor-wait',
          icon: <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
        };
      case 'saved':
        return {
          text: 'Chave Salva!',
          className: 'bg-[#66BB6A] text-white',
          icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
        };
      case 'invalid':
        return {
          text: 'Tentar Novamente',
          className: 'bg-[#EF5350] text-white hover:bg-opacity-80',
          icon: null,
        };
      case 'idle':
      default:
        return {
          text: 'Salvar Chave',
          className: 'bg-[#8B5CF6] text-white hover:bg-opacity-80',
          icon: null,
        };
    }
  };
  
  const keyButtonState = getKeyButtonState();


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Configurações</h1>
      
      <div className="bg-[#2C2C2C] p-8 rounded-lg">
        <h2 className="text-xl font-semibold text-white">Configuração do Prompt da IA</h2>
        <p className="text-[#9E9E9E] mt-2 mb-6">
          Personalize o prompt do sistema para instruir a IA sobre como analisar seu código.
          Um bom prompt pode melhorar significativamente a qualidade e o foco dos resultados.
        </p>

        <div>
          <label htmlFor="system-prompt" className="block text-sm font-medium text-[#E0E0E0] mb-2">
            Prompt do Sistema
          </label>
          <textarea
            id="system-prompt"
            rows={15}
            className="w-full bg-[#1A1A1A] border border-[#1A1A1A] rounded-md px-3 py-2 text-sm text-[#E0E0E0] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-shadow"
            value={localPrompt}
            onChange={(e) => setLocalPrompt(e.target.value)}
            aria-label="System Prompt for AI"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            onClick={handleRestorePrompt}
            className="text-sm font-semibold text-[#9E9E9E] hover:text-white transition-colors"
          >
            Restaurar Padrão
          </button>
          <button
            onClick={handleSavePrompt}
            className={`font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2 ${
              promptSaveStatus === 'saved'
                ? 'bg-[#66BB6A] text-white'
                : 'bg-[#8B5CF6] text-white hover:bg-opacity-80'
            }`}
          >
            {promptSaveStatus === 'saved' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Salvo!
              </>
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </div>
      </div>

      <div className="bg-[#2C2C2C] p-8 rounded-lg">
        <h2 className="text-xl font-semibold text-white">Configuração da API</h2>
         <p className="text-[#9E9E9E] mt-2 mb-4">
          Insira sua chave de API do Google Gemini para habilitar as funcionalidades de IA.
          Sua chave é armazenada localmente no seu navegador e não é enviada para nossos servidores.
        </p>
        <div className="flex items-start gap-4">
            <div className="flex-1">
                <input
                    type="password"
                    placeholder="Cole sua chave de API aqui"
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    className={`w-full bg-[#1A1A1A] rounded-md px-3 py-2 text-sm text-[#E0E0E0] placeholder-[#9E9E9E] focus:outline-none focus:ring-2 transition-shadow ${
                        keyStatus === 'invalid' ? 'border-red-500 ring-2 ring-red-500/50' : 'border border-[#1A1A1A] focus:ring-[#8B5CF6]'
                    }`}
                    aria-label="Google Gemini API Key"
                />
                 {keyStatus === 'invalid' && (
                    <p className="text-red-500 text-sm mt-2">
                        Chave de API inválida. Por favor, verifique a chave e tente novamente.
                    </p>
                )}
            </div>
            <button
                onClick={handleSaveKey}
                disabled={keyStatus === 'validating'}
                className={`font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2 ${keyButtonState.className}`}
            >
            {keyButtonState.icon}
            {keyButtonState.text}
            </button>
        </div>
      </div>
    </div>
  );
};