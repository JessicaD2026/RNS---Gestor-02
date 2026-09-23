import React, { useState } from 'react';
import { Technology, GovernanceDecision, StrategicResourceAllocation } from '../types';
import { formatBRL } from '../utils/helpers';
import {
  Coins,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  History,
  Calculator,
  ArrowRight
} from 'lucide-react';

interface StrategicAllocationViewProps {
  technologies: Technology[];
  decisions: GovernanceDecision[];
  onRecordDecision: (decision: GovernanceDecision) => void;
}

const DECISION_OPTIONS: GovernanceDecision['decisionMade'][] = [
  'Aprovado para Próximo Gate',
  'Aprovado com Condicionantes',
  'Manter em Maturação',
  'Reorientação Estratégica',
  'Descontinuação / Pivot',
];

export const StrategicAllocationView: React.FC<StrategicAllocationViewProps> = ({
  technologies,
  decisions,
  onRecordDecision,
}) => {
  const [selectedTechId, setSelectedTechId] = useState(technologies[0]?.id || '');
  const [selectedDecision, setSelectedDecision] = useState<GovernanceDecision['decisionMade']>('Aprovado para Próximo Gate');
  const [allocatedBudget, setAllocatedBudget] = useState(250000);
  const [topic, setTopic] = useState('Apreciação de Passagem de Gate Translacional');
  const [analyzedData, setAnalyzedData] = useState('');
  const [identifiedRisks, setIdentifiedRisks] = useState('');
  const [conditionsImposed, setConditionsImposed] = useState('');
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);

  const selectedTech = technologies.find((t) => t.id === selectedTechId) || technologies[0];

  const handleSaveDecision = () => {
    if (!analyzedData) {
      alert('Por favor, informe os dados e evidências analisadas para fundamentar a deliberação.');
      return;
    }

    const newDecision: GovernanceDecision = {
      id: `dec-${Date.now()}`,
      technologyId: selectedTech.id,
      technologyCode: selectedTech.code,
      technologyName: selectedTech.name,
      date: new Date().toLocaleDateString('pt-BR'),
      topic: topic || 'Deliberação de Gate Translacional',
      analyzedData,
      identifiedRisks: identifiedRisks || 'Risco de conformidade técnica monitorado pelo comitê.',
      technicalRecommendation: 'Aprovação condicionada à validação dos laudos pelo laboratório credenciado.',
      decisionMade: selectedDecision,
      responsibleCommittee: 'Comitê Gestor',
      committeeMembers: ['Coordenador Geral', 'Representante ICT Âncora', 'Especialista em Regulação'],
      approvedBudgetBRL: allocatedBudget,
      conditionsImposed: conditionsImposed ? [conditionsImposed] : [],
      reviewDeadline: '6 meses',
    };

    onRecordDecision(newDecision);
    setDecisionSuccess(`Decisão homologada com sucesso para ${selectedTech.code}!`);
    setAnalyzedData('');
    setConditionsImposed('');
    setTimeout(() => setDecisionSuccess(null), 4000);
  };

  // Strategic ROI calculation
  const rankedTechnologiesByROI = [...technologies].map((t) => {
    const isBlocked = t.status === 'blocked';
    const impactFactor = isBlocked ? 1.8 : 1.2;
    const efficiency = ((t.fundingGapBRL > 0 ? (100000 / t.fundingGapBRL) : 1) * impactFactor * (10 - t.trl)).toFixed(1);
    return {
      tech: t,
      impactScore: Number(efficiency),
      unblocksGate: isBlocked,
    };
  }).sort((a, b) => b.impactScore - a.impactScore);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-600" />
            <span>Alocação Estratégica de Recursos & Tomada de Decisão</span>
          </h2>
          <p className="text-xs text-slate-500">
            Apoio ao Comitê Gestor para responder: <strong>Qual investimento gera o maior avanço translacional na Rede?</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-semibold text-slate-700">
            Governança Ativa da Rede
          </span>
        </div>
      </div>

      {decisionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{decisionSuccess}</span>
        </div>
      )}

      {/* TWO COLUMNS: DECISION FORM & SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FORM: FORMALIZE GATE DECISION */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Apreciação de Gate & Deliberação Formal</span>
            </h3>
            <p className="text-xs text-slate-500">
              Decisão deliberada com base nas evidências científicas submetidas e auditadas.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tecnologia sob Avaliação:
              </label>
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                {technologies.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.code}] {t.name} (Estágio {t.stage}, TRL {t.trl}, Gap: {formatBRL(t.fundingGapBRL)})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-1 text-[11px]">
              <div>Gargalo Atual: <strong className="text-red-700">{selectedTech.primaryBottleneck}</strong> — {selectedTech.bottleneckDetail}</div>
              <div>Próximo Milestone: <strong>{selectedTech.nextMilestone}</strong> ({selectedTech.nextMilestoneDate})</div>
              <div>Funding Gap Mapeado: <strong className="text-amber-800">{formatBRL(selectedTech.fundingGapBRL)}</strong></div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Veredito do Gate:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DECISION_OPTIONS.map((dec) => (
                  <button
                    key={dec}
                    type="button"
                    onClick={() => setSelectedDecision(dec)}
                    className={`p-2 rounded text-left border transition-all text-xs font-medium ${
                      selectedDecision === dec
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {dec}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Recursos Alocados para a Próxima Fase:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step={10000}
                  value={allocatedBudget}
                  onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                  className="w-48 bg-slate-50 border border-slate-200 rounded-md p-1.5 text-xs font-mono font-bold"
                />
                <span className="text-slate-500 font-medium">{formatBRL(allocatedBudget)}</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Dados e Evidências Analisadas:
              </label>
              <textarea
                rows={2}
                value={analyzedData}
                onChange={(e) => setAnalyzedData(e.target.value)}
                placeholder="Ex: Laudo de estabilidade físico-química e relatório de citotoxicidade..."
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Condicionantes / Requisitos Adicionais:
              </label>
              <input
                type="text"
                value={conditionsImposed}
                onChange={(e) => setConditionsImposed(e.target.value)}
                placeholder="Ex: Apresentar validação interlaboratorial em 90 dias..."
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={handleSaveDecision}
              className="w-full py-2.5 rounded-md bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              Homologar e Publicar Decisão no Log da Rede
            </button>
          </div>
        </div>

        {/* SIMULATOR: HIGHEST TRANSLATIONAL ADVANCEMENT */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Simulador de Retorno Translacional (ROI)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Priorização por destravamento de gargalos estruturais e avanço de TRL por real investido.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              {rankedTechnologiesByROI.slice(0, 4).map((item, idx) => (
                <div
                  key={item.tech.id}
                  className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">#{idx + 1} [{item.tech.code}]</span>
                      <span className="font-semibold text-slate-800 truncate max-w-xs">{item.tech.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Gargalo: <span className="font-medium text-red-700">{item.tech.primaryBottleneck}</span> · Estágio {item.tech.stage} (TRL {item.tech.trl})
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Custo para destravar Gate: <strong>{formatBRL(item.tech.fundingGapBRL)}</strong>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Eficiência Translacional</span>
                    <span className="font-mono font-bold text-base text-emerald-700">
                      {item.impactScore} pts
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {item.unblocksGate ? 'Destrava Bloqueio' : 'Acelera Ciclo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3.5 text-xs text-indigo-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Recomendação Algorítmica de Alocação:</span>
              </div>
              <p className="leading-relaxed">
                Investir na superação do gargalo regulatório de <em>{technologies[0]?.name}</em> ({formatBRL(technologies[0]?.fundingGapBRL)}) e no ensaio interlaboratorial de <em>{technologies[1]?.name}</em> ({formatBRL(technologies[1]?.fundingGapBRL)}) garante a elevação rápida de 2 TRLs e destrava o avanço nos próximos 180 dias.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* DECISIONS LOG HISTORY */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
          <History className="w-4 h-4 text-slate-500" />
          <span>Histórico de Deliberações e Decisões dos Comitês</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Livro de registro auditável de todas as decisões tomadas sobre as tecnologias da Rede.
        </p>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="px-3 py-2.5">Data & Comitê</th>
                <th className="px-3 py-2.5">Tecnologia</th>
                <th className="px-3 py-2.5">Tópico / Avaliação</th>
                <th className="px-3 py-2.5">Decisão Homologada</th>
                <th className="px-3 py-2.5">Orçamento</th>
                <th className="px-3 py-2.5">Evidências / Condicionantes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {decisions.map((dec) => (
                <tr key={dec.id} className="hover:bg-slate-50/70">
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{dec.date}</div>
                    <div className="text-[10px] text-slate-400">{dec.responsibleCommittee}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900">{dec.technologyCode}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-xs">{dec.technologyName}</div>
                  </td>
                  <td className="px-3 py-3 text-slate-700 max-w-xs truncate">
                    {dec.topic}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dec.decisionMade.includes('Aprovado') ? 'bg-emerald-100 text-emerald-800' :
                      dec.decisionMade.includes('Manter') ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {dec.decisionMade}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap font-mono font-medium text-slate-900">
                    {formatBRL(dec.approvedBudgetBRL)}
                  </td>
                  <td className="px-3 py-3 max-w-xs">
                    <div className="text-slate-700 line-clamp-1">{dec.analyzedData}</div>
                    {dec.conditionsImposed.length > 0 && (
                      <div className="text-[10px] text-slate-500 italic truncate">
                        Condição: {dec.conditionsImposed.join(', ')}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
