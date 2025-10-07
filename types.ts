
export type View = 'Dashboard' | 'Nova Análise' | 'Relatórios' | 'Configurações' | 'Histórico';

export enum Severity {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface Vulnerability {
  id: string;
  severity: Severity;
  location: string;
  description: string;
  cve?: string;
  remediation: string;
}

export interface AnalysisResult {
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    securityScore: number;
    aiSummary: string;
  };
  vulnerabilities: Vulnerability[];
  recommendations: string[];
}

export type AnalysisStatus = 'Idle' | 'Analyzing' | 'Completed' | 'Error';
