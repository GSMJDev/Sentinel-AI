
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { AnalysisResult, Vulnerability } from '../../types';
import { Severity } from '../../types';
import { AIBotIcon } from '../icons/AIBotIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

const severityConfig = {
  [Severity.Critical]: { text: 'Crítica', color: '#EF5350', bg: 'bg-[#EF5350]' },
  [Severity.High]: { text: 'Alta', color: '#FFA726', bg: 'bg-[#FFA726]' },
  [Severity.Medium]: { text: 'Média', color: '#FFEE58', bg: 'bg-[#FFEE58]' },
  [Severity.Low]: { text: 'Baixa', color: '#66BB6A', bg: 'bg-[#66BB6A]' },
};

const VulnerabilityItem: React.FC<{ vulnerability: Vulnerability }> = ({ vulnerability }) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = severityConfig[vulnerability.severity];

  return (
    <div className="bg-[#2C2C2C] rounded-lg overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex items-center gap-4 flex-1">
          <div className={`p-1 rounded-full ${config.bg}/20`}>
             <div className={`w-3 h-3 rounded-full ${config.bg}`}></div>
          </div>
          <span className={`font-semibold w-20`} style={{ color: config.color }}>{config.text}</span>
          <span className="text-[#9E9E9E] w-48 font-mono text-sm">{vulnerability.location}</span>
          <span className="text-[#E0E0E0] flex-1">{vulnerability.description}</span>
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-[#9E9E9E] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-[#1A1A1A] bg-[#1A1A1A]">
          {vulnerability.cve && <p className="text-sm text-[#E0E0E0] mb-2"><strong className="text-[#9E9E9E]">CVE:</strong> {vulnerability.cve}</p>}
          <p className="text-sm text-[#E0E0E0]"><strong className="text-[#9E9E9E]">Sugestão de Correção:</strong> {vulnerability.remediation}</p>
        </div>
      )}
    </div>
  );
};

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onNewAnalysis }) => {
  const chartData = [
    { name: 'Crítica', value: result.summary.critical, color: severityConfig.Critical.color },
    { name: 'Alta', value: result.summary.high, color: severityConfig.High.color },
    { name: 'Média', value: result.summary.medium, color: severityConfig.Medium.color },
    { name: 'Baixa', value: result.summary.low, color: severityConfig.Low.color },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Resultados da Análise</h1>
        <button onClick={onNewAnalysis} className="bg-[#5C6BC0] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-80 transition-colors">
            Nova Análise
        </button>
      </div>

      <div className="bg-[#2C2C2C] p-6 rounded-lg flex items-start gap-4 border-l-4 border-[#8B5CF6]">
        <AIBotIcon className="h-8 w-8 text-[#8B5CF6] mt-1 shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-white">Resumo da IA</h3>
          <p className="text-[#E0E0E0] mt-1">{result.summary.aiSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold text-white">Lista de Vulnerabilidades</h3>
          <div className="space-y-2">
            {result.vulnerabilities.map(v => <VulnerabilityItem key={v.id} vulnerability={v} />)}
          </div>
        </div>
        <div className="space-y-6">
            <div className="bg-[#2C2C2C] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Distribuição por Severidade</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                             <Legend iconType="circle" formatter={(value, entry) => <span className="text-[#E0E0E0]">{value} ({entry.payload.value})</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="bg-[#2C2C2C] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Recomendações Gerais da IA</h3>
                <ul className="space-y-2 list-disc list-inside text-[#E0E0E0]">
                    {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};
