
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { HelpIcon } from './icons/HelpIcon';
import type { AnalysisStatus } from '../types';

interface HeaderProps {
    status: AnalysisStatus;
}

const statusConfig: Record<AnalysisStatus, { text: string; color: string }> = {
    Idle: { text: 'Aguardando', color: 'bg-gray-500' },
    Analyzing: { text: 'Analisando...', color: 'bg-[#5C6BC0]' },
    Completed: { text: 'Ativo', color: 'bg-[#66BB6A]' },
    Error: { text: 'Erro', color: 'bg-[#EF5350]' },
};

export const Header: React.FC<HeaderProps> = ({ status }) => {
    const currentStatus = statusConfig[status];

    return (
        <header className="flex h-16 items-center justify-between border-b border-[#2C2C2C] bg-[#1A1A1A] px-8 py-2 shrink-0">
            <div className="flex items-center gap-4">
                <LogoIcon className="h-8 w-8 text-[#8B5CF6]" />
                <h1 className="text-xl font-semibold text-white">Sentinel AI</h1>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${currentStatus.color}`}></div>
                    <span className="text-sm text-[#9E9E9E]">{currentStatus.text}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-[#9E9E9E] hover:text-[#E0E0E0] transition-colors">
                        <SettingsIcon className="h-5 w-5" />
                    </button>
                    <button className="text-[#9E9E9E] hover:text-[#E0E0E0] transition-colors">
                        <HelpIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};
