
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { View } from '../../types';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const data = [
  { name: 'Jan', vulnerabilities: 12 },
  { name: 'Fev', vulnerabilities: 19 },
  { name: 'Mar', vulnerabilities: 8 },
  { name: 'Abr', vulnerabilities: 15 },
  { name: 'Mai', vulnerabilities: 10 },
  { name: 'Jun', vulnerabilities: 21 },
];

const colors = {
  critical: '#EF5350',
  high: '#FFA726',
  medium: '#FFEE58',
  low: '#66BB6A',
};

const KeyMetricCard: React.FC<{ title: string; value: string | number; color: string; icon: React.ReactNode }> = ({ title, value, color, icon }) => (
  <div className="bg-[#2C2C2C] p-6 rounded-lg flex items-center gap-4">
    <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}20`, color: color }}>
      {icon}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <p className="text-sm text-[#9E9E9E]">{title}</p>
    </div>
  </div>
);

const ReportItem: React.FC<{ id: string; status: string; date: string; findings: number }> = ({ id, status, date, findings }) => (
    <div className="flex items-center justify-between p-4 bg-[#2C2C2C] rounded-md hover:bg-[#3a3a3a] transition-colors">
        <div>
            <p className="font-semibold text-white">Relatório #{id}</p>
            <p className="text-sm text-[#9E9E9E]">{date}</p>
        </div>
        <div className="text-right">
            <p className={`font-semibold ${status === 'Completo' ? 'text-[#66BB6A]' : 'text-[#FFEE58]'}`}>{status}</p>
            <p className="text-sm text-[#9E9E9E]">{findings} vulnerabilidades</p>
        </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KeyMetricCard title="Vulnerabilidades Críticas" value={5} color={colors.critical} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>} />
        <KeyMetricCard title="Alta Severidade" value={12} color={colors.high} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>} />
        <KeyMetricCard title="Média de Segurança" value="8/10" color={'#5C6BC0'} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>} />
        <KeyMetricCard title="Análises no Mês" value={7} color={'#8B5CF6'} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#2C2C2C] p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Vulnerabilidades por Mês</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#9E9E9E" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9E9E9E" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(139, 92, 246, 0.1)'}} contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #8B5CF6', borderRadius: '0.5rem' }}/>
                <Bar dataKey="vulnerabilities" radius={[4, 4, 0, 0]}>
                   {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.vulnerabilities > 15 ? '#EF5350' : '#8B5CF6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#2C2C2C] p-6 rounded-lg">
           <h3 className="text-lg font-semibold text-white mb-4">Últimos Relatórios</h3>
           <div className="space-y-3">
               <ReportItem id="A4B1C" status="Completo" date="25 de Jun, 2024" findings={21} />
               <ReportItem id="X8Y7Z" status="Completo" date="23 de Jun, 2024" findings={10} />
               <ReportItem id="M5N6P" status="Completo" date="20 de Jun, 2024" findings={15} />
           </div>
        </div>
      </div>
       <div className="text-center">
            <button onClick={() => onNavigate('Nova Análise')} className="bg-[#8B5CF6] text-white font-semibold py-3 px-8 rounded-lg hover:bg-opacity-80 transition-transform hover:scale-105">
                Iniciar Nova Análise
            </button>
        </div>
    </div>
  );
};
