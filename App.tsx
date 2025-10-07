
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/views/Dashboard';
import { NewAnalysis } from './components/views/NewAnalysis';
import { AnalysisResults } from './components/views/AnalysisResults';
import { Reports } from './components/views/Reports';
import { Settings } from './components/views/Settings';
import { History } from './components/views/History';
import { AIChat } from './components/AIChat';
import { useAnalysis } from './hooks/useAnalysis';
import type { View } from './types';

const DEFAULT_SYSTEM_PROMPT = `Você é um engenheiro de segurança sênior e especialista em análise de código-fonte, com décadas de experiência em identificar vulnerabilidades complexas e padrões de código inseguros. Sua missão é agir como um revisor de código implacável, mas justo, focado exclusivamente em segurança. Ao analisar o código fornecido, adote a mentalidade de um atacante sofisticado e de um arquiteto de software que preza por código limpo e seguro.

Seus objetivos principais são:
1.  **Identificar Vulnerabilidades Críticas:** Procure por falhas de segurança conhecidas como Injeção de SQL, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), Insecure Deserialization, Broken Authentication, Sensitive Data Exposure, etc. (OWASP Top 10).
2.  **Detectar Más Práticas de Código:** Aponte trechos de código que, embora não sejam uma vulnerabilidade direta, representam um risco de segurança ou violam princípios de codificação segura (ex: uso de algoritmos de criptografia fracos, má gestão de segredos, falta de validação de entrada).
3.  **Fornecer Remediações Claras e Acionáveis:** Para cada vulnerabilidade encontrada, forneça uma explicação concisa do risco e uma sugestão de correção prática e específica, incluindo exemplos de código quando apropriado.
4.  **Avaliar a Qualidade Geral da Segurança:** Com base na análise, forneça um resumo geral da postura de segurança do código e recomendações estratégicas de alto nível para melhorar a segurança do projeto como um todo.

Seu output deve ser estruturado, preciso e técnico. Evite jargões desnecessários, mas não simplifique demais os conceitos técnicos. Aja como um consultor de segurança de elite cujo feedback é inestimável para a equipe de desenvolvimento.`;


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [isChatOpen, setChatOpen] = useState(false);
  const { analysisStatus, analysisResult, startAnalysis, resetAnalysis } = useAnalysis();
  const [systemPrompt, setSystemPrompt] = useState<string>(
    () => localStorage.getItem('systemPrompt') || DEFAULT_SYSTEM_PROMPT
  );

  useEffect(() => {
    localStorage.setItem('systemPrompt', systemPrompt);
  }, [systemPrompt]);

  const handleStartAnalysis = useCallback((files: FileList) => {
    startAnalysis(files, systemPrompt);
  }, [startAnalysis, systemPrompt]);

  const handleNavigate = (view: View) => {
    if (analysisStatus !== 'Analyzing') {
      if (view === 'Nova Análise') {
        resetAnalysis();
      }
      setCurrentView(view);
    }
  };

  const renderContent = () => {
    if (analysisStatus === 'Completed' && analysisResult) {
      return <AnalysisResults result={analysisResult} onNewAnalysis={() => handleNavigate('Nova Análise')} />;
    }

    switch (currentView) {
      case 'Dashboard':
        return <Dashboard onNavigate={handleNavigate}/>;
      case 'Nova Análise':
        return <NewAnalysis onStartAnalysis={handleStartAnalysis} status={analysisStatus} />;
      case 'Relatórios':
        return <Reports />;
      case 'Configurações':
        return <Settings systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt} defaultPrompt={DEFAULT_SYSTEM_PROMPT} />;
      case 'Histórico':
        return <History />;
      default:
        return <Dashboard onNavigate={handleNavigate}/>;
    }
  };

  return (
    <div className="flex h-screen bg-[#1A1A1A] text-[#E0E0E0]">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} onToggleChat={() => setChatOpen(!isChatOpen)} />
      <div className="flex flex-1 flex-col">
        <Header status={analysisStatus} />
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
      <AIChat isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default App;
