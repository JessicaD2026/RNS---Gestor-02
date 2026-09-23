import React from 'react';
import {
  Network,
  Shield,
  Layers,
  Sparkles,
  Settings,
  PlusCircle,
  FileText,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { SaaSNetworkConfig, UserRole } from '../types';

interface HeaderProps {
  currentNetwork: SaaSNetworkConfig;
  allNetworks: SaaSNetworkConfig[];
  onSelectNetwork: (network: SaaSNetworkConfig) => void;
  governanceMode: 'strategic' | 'operational';
  onToggleGovernanceMode: (mode: 'strategic' | 'operational') => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onOpenAiCopilot: () => void;
  onOpenConfig: () => void;
  onOpenNewTech: () => void;
  onOpenNewEvidence: () => void;
}

const ROLES: UserRole[] = [
  'Administrador da Rede',
  'Coordenação',
  'Comitê Gestor',
  'Comitê Técnico',
  'Coordenador de Projeto',
  'Pesquisador',
  'Laboratório',
  'Startup',
  'Avaliador'
];

export const Header: React.FC<HeaderProps> = ({
  currentNetwork,
  allNetworks,
  onSelectNetwork,
  governanceMode,
  onToggleGovernanceMode,
  userRole,
  onChangeUserRole,
  onOpenAiCopilot,
  onOpenConfig,
  onOpenNewTech,
  onOpenNewEvidence,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      {/* Top Banner with White-label / Tenant switcher and System Profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Organization Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {currentNetwork.acronym.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-900 tracking-tight">
                  {currentNetwork.name}
                </span>
                <span className="text-xs text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">
                  {currentNetwork.organizationType}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md">
                Âncora: {currentNetwork.anchorInstitution} · Coord: {currentNetwork.leadCoordinator}
              </p>
            </div>
          </div>

          {/* Controls: Network Switcher, Profile Switcher, Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* White-Label Network Selector */}
            <div className="relative inline-block text-left">
              <select
                aria-label="Selecionar Rede ou Hub Tecnológico"
                value={currentNetwork.networkId}
                onChange={(e) => {
                  const found = allNetworks.find(n => n.networkId === e.target.value);
                  if (found) onSelectNetwork(found);
                }}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-2.5 pr-7 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                {allNetworks.map((net) => (
                  <option key={net.networkId} value={net.networkId}>
                    {net.acronym} - {net.organizationType}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile / Role Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <select
                aria-label="Perfil de Usuário Ativo"
                value={userRole}
                onChange={(e) => onChangeUserRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Copilot Trigger */}
            <button
              onClick={onOpenAiCopilot}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              title="Abrir Copiloto de Inteligência Estratégica da Rede"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Copiloto IA</span>
            </button>

            {/* Fast Actions: New Tech / New Evidence */}
            <button
              onClick={onOpenNewEvidence}
              className="hidden sm:flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Registrar nova evidência científica/experimental"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>+ Evidência</span>
            </button>

            <button
              onClick={onOpenNewTech}
              className="hidden md:flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Cadastrar nova tecnologia no portfólio"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>+ Tecnologia</span>
            </button>

            {/* SaaS Config */}
            <button
              onClick={onOpenConfig}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="Configurações da Rede e Governança White-Label"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Second Level: Mode Switcher (Strategic Governance vs Technical-Operational Management) */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Nível de Governança:</span>
            <div className="inline-flex rounded-md p-0.5 bg-slate-100 border border-slate-200">
              <button
                onClick={() => onToggleGovernanceMode('strategic')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  governanceMode === 'strategic'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Governança Estratégica</span>
              </button>
              <button
                onClick={() => onToggleGovernanceMode('operational')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  governanceMode === 'operational'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gestão Técnico-Operacional</span>
              </button>
            </div>
          </div>

          <div className="text-slate-500 flex items-center gap-3">
            {governanceMode === 'strategic' ? (
              <span>Foco: Portfólio, Prioridades, Funding Gap, Riscos e Gates Decisórios</span>
            ) : (
              <span>Foco: Atividades, Protocolos, Experimentos, Evidências e Entregas</span>
            )}
            <span className="text-slate-300">|</span>
            <span>{currentNetwork.activeLaboratoriesCount} Labs Credenciados</span>
          </div>
        </div>

      </div>
    </header>
  );
};
