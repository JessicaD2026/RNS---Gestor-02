import React from 'react';
import {
  Technology,
  StageDefinition,
  GovernanceDecision,
  NetworkImpactMetrics,
} from '../types';
import { STAGE_DEFINITIONS } from '../data/mockData';
import { formatBRL, getStageBadgeColor } from '../utils/helpers';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Coins,
  CheckCircle2,
  Clock,
  Sparkles,
  GitPullRequest
} from 'lucide-react';

interface ExecutiveDashboardProps {
  technologies: Technology[];
  governanceMode: 'strategic' | 'operational';
  onSelectTechnology: (tech: Technology) => void;
  onNavigateToTab: (tabId: any) => void;
  decisions: GovernanceDecision[];
  impact: NetworkImpactMetrics;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  technologies,
  governanceMode,
  onSelectTechnology,
  onNavigateToTab,
  decisions,
  impact,
}) => {
  const totalTechs = technologies.length;
  const avgTRL = (
    technologies.reduce((acc, t) => acc + t.trl, 0) / (totalTechs || 1)
  ).toFixed(1);
  const blockedTechs = technologies.filter((t) => t.status === 'blocked');
  const advancingTechs = technologies.filter((t) => t.status === 'advancing');
  const totalFundingGap = technologies.reduce((acc, t) => acc + t.fundingGapBRL, 0);
  const totalFundingSecured = technologies.reduce((acc, t) => acc + t.fundingReceivedBRL, 0);

  // Group technologies by Stage E1-E6
  const stageDistribution = STAGE_DEFINITIONS.map((stage) => ({
    stage,
    techs: technologies.filter((t) => t.stage === stage.id),
  }));

  // Average Multidimensional Readiness for the network
  const avgReadiness = {
    TRL: Number(avgTRL),
    PRL: (technologies.reduce((acc, t) => acc + t.multidimensionalReadiness.PRL, 0) / (totalTechs || 1)).toFixed(1),
    MRL: (technologies.reduce((acc, t) => acc + t.multidimensionalReadiness.MRL, 0) / (totalTechs || 1)).toFixed(1),
    RRL: (technologies.reduce((acc, t) => acc + t.multidimensionalReadiness.RRL, 0) / (totalTechs || 1)).toFixed(1),
    QRL: (technologies.reduce((acc, t) => acc + t.multidimensionalReadiness.QRL, 0) / (totalTechs || 1)).toFixed(1),
    VRL: (technologies.reduce((acc, t) => acc + t.multidimensionalReadiness.VRL, 0) / (totalTechs || 1)).toFixed(1),
    CRL: (technologies.reduce((acc, t) => acc + t.multidimensionalReadiness.CRL, 0) / (totalTechs || 1)).toFixed(1),
    IPRL: (technologies.reduce((acc, t) => acc + t.multidimensionalReadiness.IPRL, 0) / (totalTechs || 1)).toFixed(1),
    Partnership: (technologies.reduce((acc, t) => acc + t.multidimensionalReadiness.Partnership, 0) / (totalTechs || 1)).toFixed(1),
    FRL: (technologies.reduce((acc, t) => acc + t.multidimensionalReadiness.FRL, 0) / (totalTechs || 1)).toFixed(1),
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Translational Paradigm Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
          <div>
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Paradigma de Gestão Translacional da Rede
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Da Necessidade ao Mercado: Cadeia Orientada a Evidências e Stage-Gates
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-2.5 py-1">
            <span className="font-semibold text-emerald-700">Substitui:</span>
            <span>Laboratório → Projeto → Publicação</span>
          </div>
        </div>

        {/* 14-Step Translational Lifecycle Bar */}
        <div className="overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center gap-1 min-w-[850px] text-[11px] font-medium text-slate-700">
            {[
              'Desafio / Necessidade',
              'Tecnologia',
              'Produto',
              'Aplicação',
              'Estágio E1-E6',
              'Maturidade (TRL+)',
              'Gaps Mapeados',
              'Competências',
              'Labs da Rede',
              'Atividades',
              'Recursos',
              'Evidências',
              'Gate Decisório',
              'Próximo Estágio',
            ].map((step, idx, arr) => (
              <React.Fragment key={step}>
                <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-center whitespace-nowrap shadow-2xs">
                  {step}
                </span>
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Top Executive Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="text-xs text-slate-500 font-medium">Total de Tecnologias</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalTechs}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>{advancingTechs.length} em avanço ativo</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="text-xs text-slate-500 font-medium">TRL Médio da Rede</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{avgTRL} <span className="text-xs font-normal text-slate-400">/ 9</span></div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>ΔTRL longitudinal: +{impact.outcomes.averageDeltaTRL}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="text-xs text-slate-500 font-medium">Tecnologias com Gargalo</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{blockedTechs.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Gargalos: Regulatório, VRL, Infra
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="text-xs text-slate-500 font-medium">Funding Gap do Portfólio</div>
          <div className="text-xl font-bold text-amber-700 mt-1">{formatBRL(totalFundingGap)}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Captado: {formatBRL(totalFundingSecured)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="text-xs text-slate-500 font-medium">Validações Interlab</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{impact.outcomes.interlabValidationsCompleted}</div>
          <div className="text-[11px] text-indigo-600 mt-1">
            CV médio inter-lab &lt; 5%
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="text-xs text-slate-500 font-medium">Gates Agendados</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">3</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ciclo médio: {impact.outcomes.averageMonthsBetweenGates} meses
          </div>
        </div>
      </div>

      {/* Stage-Gate Pipeline: E1 to E6 simultaneous with TRL */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pipeline Translacional Stage-Gate (E1 a E6) × TRL (1 a 9)
            </h3>
            <p className="text-xs text-slate-500">
              Visualização simultânea de Estágio Científico-Translacional e Nível de Maturidade Tecnológica. Clique em um card para detalhar.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('portfolio')}
            className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
          >
            <span>Ver Tabela Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stageDistribution.map(({ stage, techs }) => {
            return (
              <div
                key={stage.id}
                className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2">
                    <span className="text-xs font-bold text-slate-900">{stage.code}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {techs.length} {techs.length === 1 ? 'tec' : 'tecs'}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-800 line-clamp-1 mb-1">
                    {stage.name}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight mb-3 line-clamp-2">
                    {stage.description}
                  </p>

                  {/* Technology Cards inside the Stage */}
                  <div className="space-y-2">
                    {techs.length === 0 ? (
                      <div className="text-[11px] text-slate-400 italic py-4 text-center border border-dashed border-slate-200 rounded">
                        Sem tecnologias
                      </div>
                    ) : (
                      techs.map((tech) => (
                        <div
                          key={tech.id}
                          onClick={() => onSelectTechnology(tech)}
                          className="bg-white border border-slate-200 rounded p-2 text-left hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                            <span className="font-mono font-bold text-slate-700">{tech.code}</span>
                            <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1">
                              TRL {tech.trl}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 line-clamp-2 leading-tight">
                            {tech.name}
                          </div>
                          
                          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 truncate max-w-[90px]">{tech.leadInstitution.split('/')[0]}</span>
                            {tech.status === 'blocked' ? (
                              <span className="text-red-600 font-medium flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                {tech.primaryBottleneck}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Avançando
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-slate-500">
                  <span className="font-medium text-slate-700">Sub-vias:</span> {stage.subTracks.slice(0, 2).join(', ')}...
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Multidimensional Readiness Profile & Immediate Attention Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Multidimensional Readiness Aggregate */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Perfil de Maturidade Multidimensional da Rede
              </h3>
              <p className="text-xs text-slate-500">
                Médias consolidadas nas 10 dimensões de maturidade translacional
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('heatmap')}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <span>Ver Matriz Heatmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'TRL - Technology Readiness Level', key: 'TRL', val: avgReadiness.TRL, max: 9, note: 'Maturidade Tecnológica de Laboratório a Mercado' },
              { label: 'PRL - Product Readiness Level', key: 'PRL', val: Number(avgReadiness.PRL), max: 5, note: 'Arquitetura de produto, DHF e usabilidade' },
              { label: 'MRL - Manufacturing Readiness Level', key: 'MRL', val: Number(avgReadiness.MRL), max: 5, note: 'Scale-up, reprodutibilidade e BPF/GMP' },
              { label: 'RRL - Regulatory Readiness Level', key: 'RRL', val: Number(avgReadiness.RRL), max: 5, note: 'Conformidade normativa (ANVISA/FDA/CE)' },
              { label: 'QRL - Quality Readiness Level', key: 'QRL', val: Number(avgReadiness.QRL), max: 5, note: 'Garantia da qualidade e esterilidade' },
              { label: 'VRL - Validation Readiness Level', key: 'VRL', val: Number(avgReadiness.VRL), max: 5, note: 'Validação multicêntrica e interlaboratorial' },
              { label: 'CRL - Clinical/Application Readiness', key: 'CRL', val: Number(avgReadiness.CRL), max: 5, note: 'Ensaios com tecidos e modelos humanos' },
              { label: 'IPRL - Intellectual Property Readiness', key: 'IPRL', val: Number(avgReadiness.IPRL), max: 5, note: 'Patentes, liberdade de operação (FTO)' },
              { label: 'Partnership Readiness Level', key: 'Partnership', val: Number(avgReadiness.Partnership), max: 5, note: 'Parceiros industriais e hospitalares' },
              { label: 'FRL - Financial Readiness Level', key: 'FRL', val: Number(avgReadiness.FRL), max: 5, note: 'Captação, sustentabilidade e co-funding' },
            ].map((dim) => {
              const percent = Math.min(100, (dim.val / dim.max) * 100);
              return (
                <div key={dim.key} className="text-xs">
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>{dim.label}</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {dim.val} / {dim.max}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percent >= 70 ? 'bg-emerald-500' : percent >= 45 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Bottlenecks & Governance Alerts */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Gargalos Críticos & Ações Recomendadas
                </h3>
                <p className="text-xs text-slate-500">
                  Tecnologias que demandam atenção imediata do Comitê Gestor
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-semibold">
                {blockedTechs.length} bloqueios
              </span>
            </div>

            <div className="space-y-3">
              {blockedTechs.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => onSelectTechnology(tech)}
                  className="border border-red-100 bg-red-50/40 rounded-lg p-3 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-slate-900">{tech.code}</span>
                    <span className="text-[11px] font-semibold text-red-700 bg-red-100/80 px-1.5 py-0.5 rounded">
                      Gargalo {tech.primaryBottleneck}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{tech.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {tech.bottleneckDetail}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-red-100/80 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {tech.daysWithoutProgress} dias sem avanço de Gate
                    </span>
                    <span className="font-semibold text-amber-800">
                      Gap: {formatBRL(tech.fundingGapBRL)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Última decisão do Comitê: <strong>{decisions[0]?.decisionMade}</strong> ({decisions[0]?.technologyCode})
            </span>
            <button
              onClick={() => onNavigateToTab('allocation')}
              className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
            >
              <span>Ver Decisões & Alocação</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
