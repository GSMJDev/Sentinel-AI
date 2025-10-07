
import React, { useState, useEffect } from 'react';

interface SettingsProps {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  defaultPrompt: string;
}

export const Settings: React.FC<SettingsProps> = ({ systemPrompt, setSystemPrompt, defaultPrompt }) => {
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    setLocalPrompt(systemPrompt);
  }, [systemPrompt]);

  const handleSave = () => {
    setSystemPrompt(localPrompt);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleRestore = () => {
    setLocalPrompt(defaultPrompt);
  };

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
            onClick={handleRestore}
            className="text-sm font-semibold text-[#9E9E9E] hover:text-white transition-colors"
          >
            Restaurar Padrão
          </button>
          <button
            onClick={handleSave}
            className={`font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2 ${
              saveStatus === 'saved'
                ? 'bg-[#66BB6A] text-white'
                : 'bg-[#8B5CF6] text-white hover:bg-opacity-80'
            }`}
          >
            {saveStatus === 'saved' ? (
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
         <p className="text-[#9E9E9E] mt-2">
          A chave da API do Google Gemini é gerenciada através de variáveis de ambiente no servidor 
          e não pode ser configurada através desta interface por motivos de segurança.
        </p>
      </div>
    </div>
  );
};
