import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
import { Severity } from '../types';

const analysisResultSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        critical: { type: Type.INTEGER, description: "Número de vulnerabilidades críticas." },
        high: { type: Type.INTEGER, description: "Número de vulnerabilidades de alta severidade." },
        medium: { type: Type.INTEGER, description: "Número de vulnerabilidades de média severidade." },
        low: { type: Type.INTEGER, description: "Número de vulnerabilidades de baixa severidade." },
        securityScore: { type: Type.INTEGER, description: "Pontuação de segurança geral de 0 a 10." },
        aiSummary: { type: Type.STRING, description: "Um resumo conciso gerado pela IA sobre a postura de segurança do código." },
      },
      required: ['critical', 'high', 'medium', 'low', 'securityScore', 'aiSummary'],
    },
    vulnerabilities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Um identificador único para a vulnerabilidade, ex: 'vuln-1'." },
          severity: { type: Type.STRING, description: "A severidade da vulnerabilidade (Critical, High, Medium, Low)." },
          location: { type: Type.STRING, description: "O arquivo e linha onde a vulnerabilidade foi encontrada, ex: 'auth/login.js:42'." },
          description: { type: Type.STRING, description: "Uma descrição clara e concisa da vulnerabilidade." },
          cve: { type: Type.STRING, description: "O identificador CVE, se aplicável." },
          remediation: { type: Type.STRING, description: "Uma sugestão detalhada de como corrigir a vulnerabilidade." },
        },
        required: ['id', 'severity', 'location', 'description', 'remediation'],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      description: "Uma lista de recomendações estratégicas de alto nível.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ['summary', 'vulnerabilities', 'recommendations'],
};


export const generateAnalysisResult = async (code: string, systemPrompt: string, apiKey: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key não fornecida.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const model = "gemini-2.5-flash";
  const userPrompt = `
    Por favor, analise o seguinte código-fonte para vulnerabilidades de segurança.
    Fornesça a resposta estritamente no formato JSON definido.

    Código para analisar:
    ---
    ${code}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: analysisResultSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResult;
    
    // Ensure all severities are valid enum values
    result.vulnerabilities = result.vulnerabilities.map(v => ({
        ...v,
        severity: Object.values(Severity).includes(v.severity) ? v.severity : Severity.Medium,
    }));
    
    return result;

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error("Chave de API inválida. Por favor, verifique sua chave nas configurações.");
        }
    }
    throw new Error("Não foi possível obter a análise da IA.");
  }
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) {
    return false;
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    // This validation call is now structured to be very similar to the main analysis call.
    // By requesting a JSON response with a schema, we force a more comprehensive
    // check on the API key's validity and permissions, making it much more reliable.
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Validate this key.",
      config: {
        systemInstruction: "You are a key validator. Respond with a simple JSON object.",
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                status: { type: Type.STRING }
            },
            required: ['status']
        }
      }
    });
    return true;
  } catch (error) {
    console.error("API Key validation failed:", error);
    // Any error during this more stringent check indicates an invalid or unusable key.
    // The Gemini API typically throws specific errors for invalid keys, which will be caught here.
    return false;
  }
};