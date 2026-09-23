import React, { useState, useMemo } from 'react';
import { Technology, TranslationalStage } from '../types';
import { STAGE_DEFINITIONS } from '../data/mockData';
import { formatBRL, getStageBadgeColor } from '../utils/helpers';
import {
  Search,
  Filter,
  Layers,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

interface PortfolioViewProps {
  technologies: Technology[];
  onSelectTechnology: (tech: Technology) => void;
  onOpenNewTech: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  technologies,
  onSelectTechnology,
  onOpenNewTech,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredTechnologies = useMemo(() => {
    return technologies.filter((tech) => {
      const matchSearch =
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.leadInstitution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.applicationArea.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStage = selectedStage === 'ALL' || tech.stage === selectedStage;
      const matchStatus = selectedStatus === 'ALL' || tech.status === selectedStatus;
      const matchClass = selectedClass === 'ALL' || tech.techClass === selectedClass;

      return matchSearch && matchStage && matchStatus && matchClass;
    });
  }, [technologies, searchTerm, selectedStage, selectedStatus, selectedClass]);

  const classes = Array.from(new Set(technologies.map((t) => t.techClass)));

  return (
    <div className="space-y-4 pb-12">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Portfólio de Tecnologias & Produtos Translacionais
          </h2>
          <p className="text-xs text-slate-500">
            Mapeamento abrangente de maturidade multidimensional, gaps de desenvolvimento e prontidão regulatória
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="inline-flex rounded-md p-0.5 bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tabela
            </button>
          </div>

          <button
            onClick={onOpenNewTech}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Cadastrar Tecnologia</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, nome, responsável, instituição ou área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Stage filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-medium">Estágio:</span>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs focus:outline-none"
          >
            <option value="ALL">Todos os Estágios (E1-E6)</option>
            {STAGE_DEFINITIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}: {s.shortName}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs focus:outline-none"
          >
            <option value="ALL">Todos os Status</option>
            <option value="advancing">Avançando Ativamente</option>
            <option value="blocked">Bloqueado / Com Gargalo</option>
          </select>
        </div>

        {/* Tech Class filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-medium">Classe:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs focus:outline-none"
          >
            <option value="ALL">Todas as Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-400 text-xs ml-auto">
          Exibindo <strong>{filteredTechnologies.length}</strong> de {technologies.length} tecnologias
        </div>
      </div>

      {/* Cards View Mode */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechnologies.map((tech) => {
            const stageStyle = getStageBadgeColor(tech.stage);
            return (
              <div
                key={tech.id}
                onClick={() => onSelectTechnology(tech)}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Code, TRL, Stage */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-slate-800 text-xs">{tech.code}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${stageStyle.bg} ${stageStyle.text} border ${stageStyle.border}`}>
                        {tech.stage}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        TRL {tech.trl}
                      </span>
                    </div>
                  </div>

                  {/* Title and Short Description */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tech.description}
                  </p>

                  {/* Metadata Chips: Class, Area, Lead Institution */}
                  <div className="mt-3 flex flex-wrap gap-1 text-[11px] text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {tech.techClass}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {tech.applicationArea}
                    </span>
                    <span className="text-slate-400 self-center">·</span>
                    <span className="truncate max-w-[140px] text-slate-500">
                      {tech.leadInstitution.split('/')[0]}
                    </span>
                  </div>

                  {/* Multidimensional Readiness Mini Radar Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Readiness Multidimensional:</span>
                      <span className="font-mono font-semibold text-slate-700">
                        RRL {tech.multidimensionalReadiness.RRL} · VRL {tech.multidimensionalReadiness.VRL} · MRL {tech.multidimensionalReadiness.MRL}
                      </span>
                    </div>
                    <div className="grid grid-cols-10 gap-0.5 h-1.5 bg-slate-100 rounded overflow-hidden">
                      {Object.entries(tech.multidimensionalReadiness).map(([key, val]) => {
                        const isTRL = key === 'TRL';
                        const pct = isTRL ? (val / 9) * 100 : (val / 5) * 100;
                        return (
                          <div
                            key={key}
                            title={`${key}: ${val}`}
                            className={`h-full ${
                              pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-slate-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottleneck / Status Note */}
                  {tech.status === 'blocked' ? (
                    <div className="mt-3 text-[11px] bg-red-50 border border-red-100 text-red-800 rounded p-2 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <span className="font-bold">Gargalo {tech.primaryBottleneck}:</span> {tech.bottleneckDetail}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-[11px] bg-emerald-50 border border-emerald-100 text-emerald-800 rounded p-2 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <span className="font-bold">Próximo Milestone:</span> {tech.nextMilestone} ({tech.nextMilestoneDate})
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Footer: Funding & Evidences Count */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{tech.evidenceCount} evidências registradas</span>
                  <span className="font-semibold text-slate-700">
                    Gap: {formatBRL(tech.fundingGapBRL)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View Mode */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Código</th>
                  <th className="px-3 py-2.5">Tecnologia / Produto</th>
                  <th className="px-3 py-2.5">Estágio</th>
                  <th className="px-3 py-2.5">TRL</th>
                  <th className="px-3 py-2.5">Classe & Área</th>
                  <th className="px-3 py-2.5">Instituição Líder</th>
                  <th className="px-3 py-2.5">Readiness (RRL/VRL/MRL)</th>
                  <th className="px-3 py-2.5">Status & Gargalo</th>
                  <th className="px-3 py-2.5">Funding Gap</th>
                  <th className="px-3 py-2.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTechnologies.map((tech) => {
                  const stageStyle = getStageBadgeColor(tech.stage);
                  return (
                    <tr
                      key={tech.id}
                      onClick={() => onSelectTechnology(tech)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {tech.code}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-semibold text-slate-900 max-w-xs truncate">
                          {tech.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {tech.leader}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${stageStyle.bg} ${stageStyle.text} border ${stageStyle.border}`}>
                          {tech.stage}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap font-bold text-indigo-700">
                        TRL {tech.trl}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div>{tech.techClass}</div>
                        <div className="text-[10px] text-slate-400">{tech.applicationArea}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-slate-700">
                        {tech.leadInstitution.split('/')[0]}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap font-mono text-[11px]">
                        R:{tech.multidimensionalReadiness.RRL} / V:{tech.multidimensionalReadiness.VRL} / M:{tech.multidimensionalReadiness.MRL}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {tech.status === 'blocked' ? (
                          <span className="text-red-700 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {tech.primaryBottleneck}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Avançando
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap font-medium text-slate-900">
                        {formatBRL(tech.fundingGapBRL)}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <button className="text-slate-400 hover:text-slate-900 p-1">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
