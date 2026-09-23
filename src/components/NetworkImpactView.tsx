import React from 'react';
import { NetworkImpactMetrics, Technology } from '../types';
import { formatBRL } from '../utils/helpers';
import {
  TrendingUp,
  FileCheck2,
  Award,
  DollarSign,
  Building2,
  Layers,
  ArrowUpRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface NetworkImpactViewProps {
  impact: NetworkImpactMetrics;
  technologies: Technology[];
}

export const NetworkImpactView: React.FC<NetworkImpactViewProps> = ({ impact, technologies }) => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Impacto da Rede & Delta Readiness Longitudinal</span>
          </h2>
          <p className="text-xs text-slate-500">
            A mensuração definitiva: <strong>Qual foi a contribuição real e auditada da Rede para a maturação de cada tecnologia?</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold">
            ΔTRL Médio Global: +{impact.outcomes.averageDeltaTRL} níveis
          </span>
        </div>
      </div>

      {/* PARADIGM SHIFT: OUTPUT vs OUTCOME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* OUTPUT CARD (Scientific & Academic Production) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              Métricas Tradicionais
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              OUTPUTS da Rede (Produção Acadêmica e Científica)
            </h3>
            <p className="text-xs text-slate-500">
              Indicadores de esforço e divulgação do conhecimento gerado.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-slate-500 block text-[11px]">Artigos e Publicações</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{impact.outputs.scientificPublications}</span>
              <span className="text-[10px] text-slate-400">Em periódicos indexados de alto impacto</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-slate-500 block text-[11px]">Pesquisadores e Pós-Graduados</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{impact.outputs.personnelTrained}</span>
              <span className="text-[10px] text-slate-400">Formados em ambiente translacional</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-slate-500 block text-[11px]">Patentes Depositadas</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{impact.outputs.patentsFiled}</span>
              <span className="text-[10px] text-slate-400">INPI, PCT e escritórios internacionais</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-slate-500 block text-[11px]">Protocolos & Serviços</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{impact.outputs.developedProtocols}</span>
              <span className="text-[10px] text-slate-400">POPs padronizados e validados</span>
            </div>
          </div>
        </div>

        {/* OUTCOME CARD (Translational Maturity & Market Entry) */}
        <div className="bg-white border-2 border-indigo-200 bg-indigo-50/20 rounded-lg p-5 space-y-4">
          <div className="border-b border-indigo-100 pb-2">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide block">
              Foco Translacional (Mandatório)
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              OUTCOMES da Rede (Resultados e Efetividade no Mundo Real)
            </h3>
            <p className="text-xs text-slate-500">
              Maturidade tecnológica, transferência para a indústria e impacto clínico/social.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white border border-indigo-100 rounded-lg p-3 shadow-2xs">
              <span className="text-slate-500 block text-[11px]">Delta TRL Médio</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">+{impact.outcomes.averageDeltaTRL}</span>
              <span className="text-[10px] text-emerald-700 font-medium">Avanço efetivo comprovado</span>
            </div>

            <div className="bg-white border border-indigo-100 rounded-lg p-3 shadow-2xs">
              <span className="text-slate-500 block text-[11px]">Tecnologias Transferidas</span>
              <span className="text-2xl font-bold text-indigo-700 mt-1 block">{impact.outcomes.technologyTransferAgreements}</span>
              <span className="text-[10px] text-indigo-800 font-medium">Licenciamentos e contratos</span>
            </div>

            <div className="bg-white border border-indigo-100 rounded-lg p-3 shadow-2xs">
              <span className="text-slate-500 block text-[11px]">Dossiês Regulatórios ANVISA</span>
              <span className="text-2xl font-bold text-purple-700 mt-1 block">{impact.outcomes.regulatoryFilesSubmitted}</span>
              <span className="text-[10px] text-purple-800 font-medium">Submissões homologadas</span>
            </div>

            <div className="bg-white border border-indigo-100 rounded-lg p-3 shadow-2xs">
              <span className="text-slate-500 block text-[11px]">Recursos Alavancados</span>
              <span className="text-xl font-bold text-emerald-700 mt-1 block">{formatBRL(impact.outcomes.fundsLeveragedBRL)}</span>
              <span className="text-[10px] text-emerald-800 font-medium">Fomento & contrapartida privada</span>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded p-2.5 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Tempo Médio entre Gates: <strong>{impact.outcomes.averageMonthsBetweenGates} meses</strong>
            </span>
            <span className="font-semibold text-indigo-800">
              {impact.outcomes.interlabValidationsCompleted} Validações Interlab Concluídas
            </span>
          </div>
        </div>

      </div>

      {/* DELTA READINESS PER TECHNOLOGY TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Delta Readiness Individual (Estado Inicial vs Estado Atual)
            </h3>
            <p className="text-xs text-slate-500">
              Registro longitudinal comparando o nível no momento de acolhimento na Rede contra os avanços homologados.
            </p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="px-3 py-2.5">Código & Nome</th>
                <th className="px-3 py-2.5">Instituição</th>
                <th className="px-3 py-2.5">TRL Inicial</th>
                <th className="px-3 py-2.5">TRL Atual</th>
                <th className="px-3 py-2.5">Δ TRL</th>
                <th className="px-3 py-2.5">Δ Regulatório (RRL)</th>
                <th className="px-3 py-2.5">Δ Validação (VRL)</th>
                <th className="px-3 py-2.5">Δ Manufatura (MRL)</th>
                <th className="px-3 py-2.5 text-right">Evidências Auditadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {technologies.map((tech) => {
                const dTRL = tech.trl - tech.initialReadiness.TRL;
                const dRRL = tech.multidimensionalReadiness.RRL - tech.initialReadiness.RRL;
                const dVRL = tech.multidimensionalReadiness.VRL - tech.initialReadiness.VRL;
                const dMRL = tech.multidimensionalReadiness.MRL - tech.initialReadiness.MRL;
                return (
                  <tr key={tech.id} className="hover:bg-slate-50/70">
                    <td className="px-3 py-3">
                      <div className="font-mono font-bold text-slate-900">{tech.code}</div>
                      <div className="font-semibold text-slate-800 truncate max-w-xs">{tech.name}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                      {tech.leadInstitution.split('/')[0]}
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-500 whitespace-nowrap">
                      TRL {tech.initialReadiness.TRL}
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      TRL {tech.trl}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        +{dTRL}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-slate-700">
                      +{dRRL} ({tech.initialReadiness.RRL} → {tech.multidimensionalReadiness.RRL})
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-slate-700">
                      +{dVRL} ({tech.initialReadiness.VRL} → {tech.multidimensionalReadiness.VRL})
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-slate-700">
                      +{dMRL} ({tech.initialReadiness.MRL} → {tech.multidimensionalReadiness.MRL})
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-slate-900 whitespace-nowrap">
                      {tech.evidenceCount} laudos
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
