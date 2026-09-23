import React, { useState, useMemo } from 'react';
import { Competency, Technology, CompetencyMatchResult } from '../types';
import { computeCompetencyMatches } from '../utils/helpers';
import {
  Network,
  Search,
  CheckCircle2,
  Building,
  Wrench,
  Award,
  Clock,
  Sparkles,
  Send,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface CompetencyMatchingViewProps {
  competencies: Competency[];
  technologies: Technology[];
  onRequestCollaboration: (tech: Technology, labName: string) => void;
}

export const CompetencyMatchingView: React.FC<CompetencyMatchingViewProps> = ({
  competencies,
  technologies,
  onRequestCollaboration,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'matching'>('matching');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTechForMatch, setSelectedTechForMatch] = useState<string>(technologies[0]?.id || '');
  const [selectedCollabSuccess, setSelectedCollabSuccess] = useState<string | null>(null);

  // Filter competencies in the Map view
  const filteredCompetencies = useMemo(() => {
    return competencies.filter((c) => {
      const matchText =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.technique.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.methodology.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.equipments.some((eq) => eq.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.certifications.some((cert) => cert.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
      return matchText && matchCategory;
    });
  }, [competencies, searchTerm, selectedCategory]);

  const categories = Array.from(new Set(competencies.map((c) => c.category)));

  // Selected technology for Matching engine
  const activeTechnology = technologies.find((t) => t.id === selectedTechForMatch) || technologies[0];

  const matchResults: CompetencyMatchResult[] = useMemo(() => {
    if (!activeTechnology) return [];
    return computeCompetencyMatches(activeTechnology, competencies);
  }, [activeTechnology, competencies]);

  const handleSendCollaboration = (labName: string) => {
    if (activeTechnology) {
      onRequestCollaboration(activeTechnology, labName);
      setSelectedCollabSuccess(`Solicitação de colaboração enviada com sucesso para ${labName}!`);
      setTimeout(() => setSelectedCollabSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600" />
            <span>Mapa de Competências & Matching Inteligente de Parcerias</span>
          </h2>
          <p className="text-xs text-slate-500">
            Conecte as necessidades e gargalos dos projetos com laboratórios, equipamentos e metodologias credenciadas da Rede.
          </p>
        </div>

        {/* SubTab switcher */}
        <div className="inline-flex rounded-md p-0.5 bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('matching')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              activeSubTab === 'matching' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Matching Tecnologia ↔ Competência
          </button>
          <button
            onClick={() => setActiveSubTab('map')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              activeSubTab === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Catálogo Completo da Rede ({competencies.length} Labs)
          </button>
        </div>
      </div>

      {selectedCollabSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{selectedCollabSuccess}</span>
        </div>
      )}

      {/* SUBTAB 1: MATCHING ENGINE */}
      {activeSubTab === 'matching' && (
        <div className="space-y-6">
          
          {/* Technology Selector & Gap Context Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <label htmlFor="select-tech-matching" className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Selecione a Tecnologia para Análise de Match:
                </label>
                <select
                  id="select-tech-matching"
                  aria-label="Selecione a Tecnologia para Análise de Match"
                  value={selectedTechForMatch}
                  onChange={(e) => setSelectedTechForMatch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {technologies.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.code}] {t.name} (Estágio {t.stage}, TRL {t.trl})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Status Operacional</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  activeTechnology.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeTechnology.status === 'blocked' ? `Bloqueado (${activeTechnology.primaryBottleneck})` : 'Avançando'}
                </span>
              </div>
            </div>

            {/* Gap Analysis Flow */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs">
              <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Cadeia de Resolução do Gargalo:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-slate-700">
                <div className="bg-white border border-slate-200 rounded p-2">
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase">1. Gap Identificado</span>
                  <span className="font-medium text-red-700">{activeTechnology.bottleneckDetail}</span>
                </div>
                <div className="bg-white border border-slate-200 rounded p-2">
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase">2. Competência Necessária</span>
                  <span className="font-medium text-slate-900">
                    {activeTechnology.primaryBottleneck === 'Regulatório' ? 'Toxicologia BPL / Ensaios OECD' :
                     activeTechnology.primaryBottleneck === 'Validação' ? 'Ensaio Interlaboratorial / Multicêntrico' :
                     activeTechnology.primaryBottleneck === 'Infraestrutura' ? 'Microfabricação / Sala Limpa' : 'Caracterização Avançada'}
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded p-2">
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase">3. Busca na Rede</span>
                  <span className="font-medium text-slate-900">{competencies.length} Laboratórios Auditados</span>
                </div>
                <div className="bg-white border border-slate-200 rounded p-2">
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase">4. Decisão</span>
                  <span className="font-medium text-emerald-700">Humana (Comitê / Coordenador)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Laboratórios Compatíveis Encontrados na Rede ({matchResults.length})
            </h3>

            <div className="space-y-3">
              {matchResults.map((match, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        match.matchLevel === 'Alto' ? 'bg-emerald-100 text-emerald-800' :
                        match.matchLevel === 'Médio' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        Match {match.matchLevel} ({match.matchScore}%)
                      </span>
                      <span className="font-bold text-sm text-slate-900">{match.matchedLabName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-medium">{match.institutionName}</span>
                    </div>

                    <div className="font-semibold text-slate-800">
                      Competência: {match.requiredCompetency}
                    </div>

                    <p className="text-slate-600 leading-relaxed">
                      {match.explanation}
                    </p>

                    {/* Criteria Breakdown */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>Técnica: <strong>{match.criteriaBreakdown.techniqueCoverage}%</strong></span>
                      <span>Infraestrutura: <strong>{match.criteriaBreakdown.infrastructureFit ? 'Total' : 'Parcial'}</strong></span>
                      <span>Certificação: <strong>{match.criteriaBreakdown.certificationFit ? 'Atende' : 'Pendente'}</strong></span>
                      <span>Estágio {activeTechnology.stage}: <strong>{match.criteriaBreakdown.stageFit ? 'Compatível' : 'Novo'}</strong></span>
                    </div>

                    <div className="text-indigo-700 font-semibold text-[11px]">
                      Ação Recomendada: {match.recommendedAction}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleSendCollaboration(match.matchedLabName)}
                      className="px-4 py-2 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs shadow-xs whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Solicitar Colaboração</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: COMPLETE COMPETENCY MAP */}
      {activeSubTab === 'map' && (
        <div className="space-y-4">
          
          {/* Search and Category Filter */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center gap-3 text-xs">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Exemplo: Microscopia eletrônica, Validação pré-clínica, BPL, 17025..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Categoria:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs focus:outline-none"
              >
                <option value="ALL">Todas as Categorias</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-slate-400 text-xs ml-auto">
              {filteredCompetencies.length} laboratórios encontrados
            </div>
          </div>

          {/* Competency Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompetencies.map((comp) => (
              <div
                key={comp.id}
                className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-500">{comp.institutionName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {comp.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {comp.name}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-700 mt-0.5">
                    {comp.labName} (Coord: {comp.responsible} · {comp.teamSize} pesquisadores)
                  </div>

                  <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-700">Técnica & Metodologia:</span> {comp.technique}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Equipamentos Principais:</span> {comp.equipments.join(', ')}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Capacidade Operacional:</span> {comp.capacityDescription}
                    </div>
                  </div>

                  {/* Certifications & Badges */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {comp.certifications.map((cert, i) => (
                      <span key={i} className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" />
                        {cert}
                      </span>
                    ))}
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      Estágios: {comp.stagesSupported.join(', ')}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      TRLs: {comp.trlsSupported[0]}-{comp.trlsSupported[comp.trlsSupported.length - 1]}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Disponibilidade: <strong className="text-slate-700">{comp.availability}</strong>
                  </span>
                  <span>{comp.experienceYears} anos de experiência</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
