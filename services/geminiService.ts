
import type { AnalysisResult, Vulnerability } from '../types';
import { Severity } from '../types';

// This is a mock service. In a real application, you would use @google/genai.
// import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-1',
    severity: Severity.Critical,
    location: 'auth/login.js:42',
    description: 'Injeção SQL potencial no método \'loginUser\'.',
    cve: 'CVE-2021-44228',
    remediation: 'Utilize prepared statements e ORMs para evitar a concatenação direta de strings em queries SQL. Valide e sanitize todas as entradas do usuário.',
  },
  {
    id: 'vuln-2',
    severity: Severity.High,
    location: 'api/userController.js:101',
    description: 'Cross-Site Scripting (XSS) em campo de perfil de usuário.',
    cve: 'CVE-2022-29072',
    remediation: 'Implemente a codificação de saída (output encoding) para todos os dados dinâmicos renderizados na UI. Use uma biblioteca como DOMPurify no frontend.',
  },
  {
    id: 'vuln-3',
    severity: Severity.Medium,
    location: 'package.json',
    description: 'Dependência "express" desatualizada (v4.17.1).',
    remediation: 'Atualize o pacote para a versão mais recente para corrigir vulnerabilidades conhecidas. Execute `npm update express`.',
  },
    {
    id: 'vuln-4',
    severity: Severity.Low,
    location: 'config/cors.js:8',
    description: 'Configuração de CORS excessivamente permissiva.',
    remediation: 'Restrinja a política de CORS para permitir apenas origens confiáveis e específicas em vez de usar um curinga (*).',
  },
    {
    id: 'vuln-5',
    severity: Severity.Medium,
    location: 'utils/fileUpload.js:25',
    description: 'Validação de tipo de arquivo inadequada.',
    remediation: 'Valide o tipo MIME do arquivo no servidor, não confie apenas na extensão do arquivo fornecida pelo cliente.',
  },
];

export const generateAnalysisResult = (systemPrompt?: string): AnalysisResult => {
  // This function simulates a Gemini API call that would analyze code and return structured data.
  // In a real implementation, the systemPrompt would be used like this:
  /*
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Analyze this code...',
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      // responseSchema for AnalysisResult would be defined here
    },
  });
  // return JSON.parse(response.text);
  */

  const critical = mockVulnerabilities.filter(v => v.severity === Severity.Critical).length;
  const high = mockVulnerabilities.filter(v => v.severity === Severity.High).length;
  const medium = mockVulnerabilities.filter(v => v.severity === Severity.Medium).length;
  const low = mockVulnerabilities.filter(v => v.severity === Severity.Low).length;

  return {
    summary: {
      critical,
      high,
      medium,
      low,
      securityScore: 7,
      aiSummary: "Olá! Sua análise foi concluída. Encontramos 1 vulnerabilidade crítica e 1 de alta severidade. O foco principal deve ser a correção da Injeção SQL no módulo de autenticação.",
    },
    vulnerabilities: mockVulnerabilities,
    recommendations: [
      'Implementar um pipeline de CI/CD com verificação de segurança automatizada.',
      'Revisar as políticas de gerenciamento de senhas para usuários.',
      'Realizar treinamentos de segurança para a equipe de desenvolvimento.',
    ],
  };
};
