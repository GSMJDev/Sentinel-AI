
import { useState, useCallback } from 'react';
import { generateAnalysisResult } from '../services/geminiService';
import type { AnalysisStatus, AnalysisResult } from '../types';

export const useAnalysis = () => {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('Idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const startAnalysis = useCallback(async (files: FileList, systemPrompt: string) => {
    if (files.length === 0) return;
    setAnalysisStatus('Analyzing');
    setAnalysisResult(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      const result = generateAnalysisResult(systemPrompt);
      setAnalysisResult(result);
      setAnalysisStatus('Completed');
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisStatus('Error');
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysisStatus('Idle');
    setAnalysisResult(null);
  }, []);

  return { analysisStatus, analysisResult, startAnalysis, resetAnalysis };
};
