import { useState, useCallback } from 'react';
import { generateAnalysisResult } from '../services/geminiService';
import type { AnalysisStatus, AnalysisResult } from '../types';

export const useAnalysis = () => {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('Idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const startAnalysis = useCallback(async (files: FileList, systemPrompt: string, apiKey: string) => {
    if (files.length === 0) return;
    if (!apiKey) {
      alert('Por favor, configure sua chave de API do Google Gemini na página de Configurações.');
      setAnalysisStatus('Error');
      return;
    }
    
    setAnalysisStatus('Analyzing');
    setAnalysisResult(null);
    try {
      const fileContentsPromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
           const reader = new FileReader();
           reader.onload = (event) => resolve(event.target?.result as string);
           reader.onerror = (error) => reject(error);
           reader.readAsText(file);
        });
      });
      
      const fileContents = await Promise.all(fileContentsPromises);
      const codeToAnalyze = fileContents.map((content, index) => 
        `Arquivo: ${files[index].name}\n\n${content}`
      ).join('\n\n---\n\n');

      const result = await generateAnalysisResult(codeToAnalyze, systemPrompt, apiKey);
      setAnalysisResult(result);
      setAnalysisStatus('Completed');
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(`A análise falhou: ${error instanceof Error ? error.message : String(error)}`);
      setAnalysisStatus('Error');
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysisStatus('Idle');
    setAnalysisResult(null);
  }, []);

  return { analysisStatus, analysisResult, startAnalysis, resetAnalysis };
};