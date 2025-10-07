
import React from 'react';
import type { View } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { ScanIcon } from './icons/ScanIcon';
import { ReportIcon } from './icons/ReportIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { AIBotIcon } from './icons/AIBotIcon';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onToggleChat: () => void;
}

const navItems: { view: View; label: string; icon: React.ElementType }[] = [
  { view: 'Dashboard', label: 'Dashboard', icon: DashboardIcon },
  { view: 'Nova Análise', label: 'Nova Análise', icon: ScanIcon },
  { view: 'Relatórios', label: 'Relatórios', icon: ReportIcon },
  { view: 'Histórico', label: 'Histórico', icon: HistoryIcon },
  { view: 'Configurações', label: 'Configurações', icon: SettingsIcon },
];

const NavItem: React.FC<{
  item: { view: View; label: string; icon: React.ElementType };
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        isActive
          ? 'bg-[#8B5CF6] text-white'
          : 'text-[#9E9E9E] hover:bg-[#2C2C2C] hover:text-[#E0E0E0]'
      }`}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.label}</span>
    </button>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onToggleChat }) => {
  return (
    <aside className="flex w-64 flex-col border-r border-[#2C2C2C] bg-[#1A1A1A] p-4">
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.view}
              item={item}
              isActive={currentView === item.view}
              onClick={() => onNavigate(item.view)}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <button
          onClick={onToggleChat}
          className="flex w-full items-center gap-3 rounded-md bg-[#2C2C2C] px-3 py-3 text-sm text-[#E0E0E0] hover:bg-[#8B5CF6] hover:text-white transition-colors"
        >
          <AIBotIcon className="h-6 w-6" />
          <span>Converse com a IA</span>
        </button>
      </div>
    </aside>
  );
};
