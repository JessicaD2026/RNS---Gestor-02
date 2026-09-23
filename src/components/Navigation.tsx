import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  Grid3X3,
  Network,
  FileCheck2,
  GitCompare,
  Cpu,
  Coins,
  TrendingUp,
} from 'lucide-react';

export type TabId =
  | 'dashboard'
  | 'portfolio'
  | 'heatmap'
  | 'competency'
  | 'evidence'
  | 'validation'
  | 'infrastructure'
  | 'allocation'
  | 'impact';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  blockedCount: number;
  pendingGateCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  blockedCount,
  pendingGateCount,
}) => {
  const tabs = [
    { id: 'dashboard' as TabId, label: 'Painel Executivo', icon: LayoutDashboard },
    { id: 'portfolio' as TabId, label: 'Portfólio Tecnológico', icon: Boxes },
    { id: 'heatmap' as TabId, label: 'Heatmap & Gargalos', icon: Grid3X3 },
    { id: 'competency' as TabId, label: 'Competências & Matching', icon: Network },
    { id: 'evidence' as TabId, label: 'Gestão de Evidências', icon: FileCheck2 },
    { id: 'validation' as TabId, label: 'Validação Interlaboratorial', icon: GitCompare },
    { id: 'infrastructure' as TabId, label: 'Infraestrutura & Serviços', icon: Cpu },
    { id: 'allocation' as TabId, label: 'Alocação de Recursos & Decisões', icon: Coins },
    { id: 'impact' as TabId, label: 'Impacto & Delta Readiness', icon: TrendingUp },
  ];

  return (
    <nav className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto scrollbar-none py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.id === 'portfolio' && blockedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                    {blockedCount} com gargalo
                  </span>
                )}
                {tab.id === 'allocation' && pendingGateCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                    {pendingGateCount} Gates
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
