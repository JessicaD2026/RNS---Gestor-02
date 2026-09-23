import React, { useState } from 'react';
import { Technology, Evidence, Competency } from '../types';
import { STAGE_DEFINITIONS } from '../data/mockData';
import { formatBRL, getStageBadgeColor, getReadinessLabel, computeCompetencyMatches } from '../utils/helpers';
import {
  X,
  FileCheck2,
  Calendar,
  AlertTriangle,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Send,
  Building,
  Users,
  FileText
} from 'lucide-react';

interface TechnologyDetailModalProps {
  technology: Technology | null;
  onClose: () => void;
  evidences: Evidence[];
  competencies: Competency[];
  onOpenNewEvidenceForTech: (tech: Technology) => void;
  onRequestCollaboration: (tech: Technology, labName: string) => void;
}

export const TechnologyDetailModal: React.FC<TechnologyDetailModalProps> = ({
  technology,
  onClose,
  evidences,
  competencies,
  onOpenNewEvidenceForTech,
  onRequestCollaboration,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'readiness' | 'devplan' | 'journey' | 'evidences' | 'matching'
  >('overview');

  if (!technology) return null;

  const techEvidences = evidences.filter((e) => e.technologyId === technology.id);
  const stageDef = STAGE_DEFINITIONS.find((s) => s.id === technology.stage);
  const stageStyle = getStageBadgeColor(technology.stage);
  const matches = computeCompetencyMatches(technology, competencies).slice(0, 3);

  // Delta calculations
  const deltaTRL = technology.trl - technology.initialReadiness.TRL;
  const deltaRRL = technology.multidimensionalReadiness.RRL - technology.initialReadiness.RRL;
  const deltaVRL = technology.multidimensionalReadiness.VRL - technology.initialReadiness.VRL;
  const deltaMRL = technology.multidimensionalReadiness.MRL - technology.initialReadiness.MRL;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                {technology.code}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${stageStyle.bg} ${stageStyle.text} border ${stageStyle.border}`}>
                {technology.stage}: {stageDef?.name}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                TRL {technology.trl} / 9
              </span>
              {technology.status === 'blocked' && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Gargalo {technology.primaryBottleneck}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {technology.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Líder: {technology.leader} · Instituição: {technology.leadInstitution} · Projeto: {technology.thematicProjectName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'overview', label: '1. Visão Geral & Lógica Translacional' },
            { id: 'readiness', label: '2. Readiness Multidimensional' },
            { id: 'devplan', label: '3. Plano de Desenvolvimento & Gate' },
            { id: 'evidences', label: `4. Evidências Científicas (${techEvidences.length})` },
            { id: 'matching', label: '5. Matching de Competências' },
            { id: 'journey', label: '6. Technology Journey & Impacto' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">

          {/* TAB 1: OVERVIEW & TRANSLATIONAL ATTRIBUTES */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Core Translational Questions Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Diagnóstico Translacional Estruturado
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-slate-700">1. Onde está a tecnologia?</span>
                    <p className="text-slate-600 mt-0.5">
                      No estágio <strong>{technology.stage} ({stageDef?.name})</strong> com maturidade técnica <strong>TRL {technology.trl}</strong> e versão <em>{technology.version}</em>.
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">2. Por que ela está nesse estágio?</span>
                    <p className="text-slate-600 mt-0.5">
                      {technology.developmentPlan.currentState}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">3. O que está impedindo seu avanço?</span>
                    <p className="text-slate-600 mt-0.5 text-red-700 font-medium">
                      Gargalo Primário: {technology.primaryBottleneck} — {technology.bottleneckDetail}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">4. Qual é o próximo Gate e Milestone?</span>
                    <p className="text-slate-600 mt-0.5">
                      {technology.nextMilestone} (Previsão: {technology.nextMilestoneDate}).
                    </p>
                  </div>
                </div>
              </div>

              {/* 27 Standard Attributes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <span className="font-bold text-slate-800 border-b border-slate-100 pb-1 block">
                    Escopo & Aplicação
                  </span>
                  <div>
                    <span className="text-slate-500 block">Classe Tecnológica:</span>
                    <span className="font-medium text-slate-800">{technology.techClass}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Área de Aplicação:</span>
                    <span className="font-medium text-slate-800">{technology.applicationArea}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Intended Use (Uso Pretendido):</span>
                    <span className="text-slate-700">{technology.intendedUse}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Usuário Alvo:</span>
                    <span className="text-slate-700">{technology.targetUser}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Problema Resolvido:</span>
                    <span className="text-slate-700">{technology.problemStatement}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <span className="font-bold text-slate-800 border-b border-slate-100 pb-1 block">
                    Governança & Rede
                  </span>
                  <div>
                    <span className="text-slate-500 block">Instituição Líder:</span>
                    <span className="font-medium text-slate-800">{technology.leadInstitution}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Instituições Participantes:</span>
                    <span className="text-slate-700">{technology.participatingInstitutions.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Parceiros Estratégicos / Indústria:</span>
                    <span className="text-slate-700">{technology.partners.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tempo sem avanço de Gate:</span>
                    <span className={`font-semibold ${technology.daysWithoutProgress > 180 ? 'text-red-600' : 'text-slate-700'}`}>
                      {technology.daysWithoutProgress} dias
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <span className="font-bold text-slate-800 border-b border-slate-100 pb-1 block">
                    Propriedade Intelectual & Financiamento
                  </span>
                  <div>
                    <span className="text-slate-500 block">Status da PI:</span>
                    <span className="font-semibold text-emerald-700">{technology.ipStatus}</span>
                  </div>
                  {technology.patentNumbers && (
                    <div>
                      <span className="text-slate-500 block">Patentes Registradas:</span>
                      <span className="font-mono text-slate-700">{technology.patentNumbers.join(' · ')}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block">Recursos Captados:</span>
                    <span className="font-medium text-slate-800">{formatBRL(technology.fundingReceivedBRL)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Funding Gap Necessário:</span>
                    <span className="font-bold text-amber-800">{formatBRL(technology.fundingGapBRL)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Documentos & Evidências:</span>
                    <span className="text-slate-700">{technology.documentsCount} docs · {technology.evidenceCount} evidências</span>
                  </div>
                </div>

              </div>

              {/* Identified Risks */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-bold text-slate-800 mb-2">Matriz de Riscos & Plano de Mitigação</h4>
                <div className="space-y-2">
                  {technology.risks.map((risk, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded p-2.5 flex items-start gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        risk.level === 'Crítico' ? 'bg-red-200 text-red-900' :
                        risk.level === 'Alto' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {risk.level}
                      </span>
                      <div className="space-y-0.5 flex-1">
                        <div className="font-medium text-slate-800">{risk.description}</div>
                        <div className="text-slate-600 text-[11px]"><span className="font-semibold text-slate-700">Mitigação:</span> {risk.mitigation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MULTIDIMENSIONAL READINESS */}
          {activeTab === 'readiness' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="font-bold text-slate-800 mb-1">
                  Maturidade Multidimensional (0 a 5 / TRL 1 a 9)
                </h3>
                <p className="text-slate-500 text-xs">
                  A plataforma abandona a dependência exclusiva do TRL, mensurando as 10 dimensões críticas para a translacionalidade efetiva.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'TRL', name: 'TRL - Technology Readiness', val: technology.multidimensionalReadiness.TRL, max: 9, desc: 'Prontidão tecnológica da bancada ao ambiente relevante' },
                  { key: 'PRL', name: 'PRL - Product Readiness', val: technology.multidimensionalReadiness.PRL, max: 5, desc: 'Especificação técnica, Design History File e usabilidade' },
                  { key: 'MRL', name: 'MRL - Manufacturing Readiness', val: technology.multidimensionalReadiness.MRL, max: 5, desc: 'Capacidade de produção escalonada e conformidade BPF/GMP' },
                  { key: 'RRL', name: 'RRL - Regulatory Readiness', val: technology.multidimensionalReadiness.RRL, max: 5, desc: 'Estratégia e conformidade regulatória ANVISA / FDA' },
                  { key: 'QRL', name: 'QRL - Quality Readiness', val: technology.multidimensionalReadiness.QRL, max: 5, desc: 'Sistema de garantia da qualidade, esterilidade e rastreabilidade' },
                  { key: 'VRL', name: 'VRL - Validation Readiness', val: technology.multidimensionalReadiness.VRL, max: 5, desc: 'Validação interlaboratorial e multicêntrica independente' },
                  { key: 'CRL', name: 'CRL - Clinical Readiness', val: technology.multidimensionalReadiness.CRL, max: 5, desc: 'Ensaios com tecidos humanos e protocolo clínico fase I/II' },
                  { key: 'IPRL', name: 'IPRL - Intellectual Property Readiness', val: technology.multidimensionalReadiness.IPRL, max: 5, desc: 'Depósito, concessão e análise de liberdade de operação (FTO)' },
                  { key: 'Partnership', name: 'Partnership Readiness', val: technology.multidimensionalReadiness.Partnership, max: 5, desc: 'Parceiros industriais, hospitais de validação e coinvestidores' },
                  { key: 'FRL', name: 'FRL - Financial Readiness', val: technology.multidimensionalReadiness.FRL, max: 5, desc: 'Estruturação orçamentária e sustentabilidade financeira' },
                ].map((dim) => {
                  const pct = (dim.val / dim.max) * 100;
                  return (
                    <div key={dim.key} className="border border-slate-200 rounded-lg p-3 bg-white">
                      <div className="flex items-center justify-between font-medium text-slate-800 mb-1">
                        <span>{dim.name}</span>
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {dim.val} / {dim.max}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                        <div
                          className={`h-full rounded-full ${
                            pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-slate-300'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {dim.desc} · <span className="font-semibold text-slate-700">{getReadinessLabel(dim.val)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delta Readiness Panel */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Delta Readiness (Evolução Longitudinal desde a Entrada na Rede)</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-white border border-slate-200 rounded p-2">
                    <span className="text-[10px] text-slate-500 uppercase block">Δ TRL</span>
                    <span className="text-base font-bold text-emerald-600">
                      +{deltaTRL} (TRL {technology.initialReadiness.TRL} → {technology.trl})
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2">
                    <span className="text-[10px] text-slate-500 uppercase block">Δ RRL (Regulatório)</span>
                    <span className="text-base font-bold text-indigo-600">
                      +{deltaRRL} (RRL {technology.initialReadiness.RRL} → {technology.multidimensionalReadiness.RRL})
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2">
                    <span className="text-[10px] text-slate-500 uppercase block">Δ VRL (Validação)</span>
                    <span className="text-base font-bold text-indigo-600">
                      +{deltaVRL} (VRL {technology.initialReadiness.VRL} → {technology.multidimensionalReadiness.VRL})
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded p-2">
                    <span className="text-[10px] text-slate-500 uppercase block">Δ MRL (Manufatura)</span>
                    <span className="text-base font-bold text-indigo-600">
                      +{deltaMRL} (MRL {technology.initialReadiness.MRL} → {technology.multidimensionalReadiness.MRL})
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: TECHNOLOGY DEVELOPMENT PLAN */}
          {activeTab === 'devplan' && (
            <div className="space-y-6">
              
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Technology Development Plan (TDP)
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                    Gate Status: {technology.developmentPlan.gateStatus}
                  </span>
                </div>
                <p className="text-slate-600 text-xs">
                  Próximo marco: <strong>{technology.developmentPlan.nextMilestone}</strong> (Meta: {technology.developmentPlan.targetDate})
                </p>
              </div>

              {/* Identified Gaps */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Gaps Identificados</h4>
                <div className="space-y-1.5">
                  {technology.developmentPlan.identifiedGaps.map((gap, i) => (
                    <div key={i} className="flex items-start gap-2 bg-red-50/70 border border-red-100 rounded p-2 text-slate-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities Table */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Atividades Operacionais & Laboratórios Alocados</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                      <tr>
                        <th className="px-3 py-2">Atividade</th>
                        <th className="px-3 py-2">Laboratório Designado</th>
                        <th className="px-3 py-2">Prazo</th>
                        <th className="px-3 py-2">Custo</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {technology.developmentPlan.activities.map((act) => (
                        <tr key={act.id}>
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-slate-800">{act.title}</div>
                            <div className="text-[11px] text-slate-400">{act.deliverable}</div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-700 font-medium">
                            {act.assignedLab}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                            {act.timelineWeeks} semanas
                          </td>
                          <td className="px-3 py-2.5 font-mono text-slate-800 whitespace-nowrap">
                            {formatBRL(act.estimatedCostBRL)}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              act.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' :
                              act.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gate Pass Criteria */}
              <div className="border border-slate-200 rounded-lg p-4 bg-purple-50/50 border-purple-100">
                <h4 className="font-bold text-purple-900 mb-2">Critérios Mandatórios para Aprovação do Gate</h4>
                <div className="space-y-1.5">
                  {technology.developmentPlan.gateCriteria.map((crit, i) => (
                    <div key={i} className="flex items-center gap-2 text-purple-900">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SCIENTIFIC EVIDENCES */}
          {activeTab === 'evidences' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Cadeia de Evidências Rastreáveis ({techEvidences.length})
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Requisito → Experimento → Resultado → Evidência → Gate
                  </p>
                </div>
                <button
                  onClick={() => onOpenNewEvidenceForTech(technology)}
                  className="px-3 py-1.5 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>+ Adicionar Evidência</span>
                </button>
              </div>

              {techEvidences.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg text-slate-400">
                  Nenhuma evidência registrada para esta tecnologia ainda.
                </div>
              ) : (
                <div className="space-y-3">
                  {techEvidences.map((evd) => (
                    <div key={evd.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{evd.code}</span>
                          <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                            {evd.stage} · {evd.readinessDimension}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          evd.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800' :
                          evd.status === 'Em Análise' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {evd.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="font-semibold text-slate-700">Requisito:</span> {evd.requirement}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Protocolo:</span> {evd.protocol}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Resultado:</span> {evd.result}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Critério de Aceitação:</span> {evd.acceptanceCriteria}
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Lab: {evd.laboratoryName} ({evd.responsible}) · {evd.date}</span>
                        <span className="font-medium text-slate-700 underline cursor-pointer">
                          {evd.fileName} ({evd.fileSize || '1.5 MB'})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: COMPETENCY MATCHING */}
          {activeTab === 'matching' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="font-bold text-slate-900 mb-1">
                  Matching Automático com Competências da Rede
                </h3>
                <p className="text-slate-500 text-xs">
                  Cruzamento inteligente entre o gargalo atual (<em>{technology.bottleneckDetail}</em>) e os laboratórios credenciados da rede.
                </p>
              </div>

              <div className="space-y-3">
                {matches.map((m, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          m.matchLevel === 'Alto' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Match {m.matchLevel} ({m.matchScore}%)
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{m.matchedLabName}</span>
                      </div>
                      <div className="text-slate-700 text-xs font-medium">
                        {m.requiredCompetency} ({m.institutionName})
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {m.explanation}
                      </p>
                      <div className="text-[11px] text-indigo-700 font-semibold pt-1">
                        Ação Recomendada: {m.recommendedAction}
                      </div>
                    </div>

                    <button
                      onClick={() => onRequestCollaboration(technology, m.matchedLabName)}
                      className="px-3 py-1.5 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Solicitar Colaboração</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TECHNOLOGY JOURNEY */}
          {activeTab === 'journey' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="font-bold text-slate-900 mb-1">
                  Technology Journey (Linha do Tempo Longitudinal)
                </h3>
                <p className="text-slate-500 text-xs">
                  Rastreabilidade histórica da trajetória de maturação na Rede.
                </p>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 ml-3">
                {technology.journey.map((item, idx) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                    <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">
                          {item.year}: {item.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-700">TRL {item.trlAchieved}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-semibold text-slate-600">{item.stageAchieved}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs mb-2">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                        <span>Instituições: {item.institutionsInvolved.join(', ')}</span>
                        <span>Investimento: {formatBRL(item.investmentsReceivedBRL)}</span>
                        {item.patentsReferenced && (
                          <span className="text-emerald-700 font-medium">Patente: {item.patentsReferenced.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Última atualização cadastrada: <strong>Hoje</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
