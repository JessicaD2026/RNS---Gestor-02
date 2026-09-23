import React, { useState } from 'react';
import { Technology, BottleneckCategory } from '../types';
import { getReadinessColor, getReadinessLabel } from '../utils/helpers';
import {
  Grid3X3,
  AlertTriangle,
  Flame,
  ArrowRight,
  Info
} from 'lucide-react';

interface HeatmapBottlenecksViewProps {
  technologies: Technology[];
  onSelectTechnology: (tech: Technology) => void;
}

const BOTTLENECK_CATEGORIES: { name: BottleneckCategory; desc: string }[] = [
  { name: 'Regulatório', desc: 'Adequação a normas ANVISA/FDA/CE, BPL ou dossiê de desenvolvimento' },
  { name: 'Validação', desc: 'Estudos interlaboratoriais, ensaios multicêntricos e reprodutibilidade' },
  { name: 'Infraestrutura', desc: 'Disponibilidade de equipamentos de alta precisão ou plantas piloto' },
  { name: 'Experimental', desc: 'Acesso a amostras biológicas, linhagens celulares ou modelos animais' },
  { name: 'Financeiro', desc: 'Funding gap para contratação de CRO, lote piloto ou ensaios estendidos' },
  { name: 'Manufatura', desc: 'Scale-up de processos, consistência de lotes e conformidade BPF/GMP' },
  { name: 'Clínico', desc: 'Aprovação CEP/CONEP e recrutamento de pacientes em centros hospitalares' },
  { name: 'Qualidade', desc: 'Sistemas de gestão da qualidade ISO 13485 e testes de esterilidade' },
  { name: 'Propriedade Intelectual', desc: 'Depósito de patentes, relatório de busca ou liberdade de operação' },
  { name: 'Parceria', desc: 'Acordos de transferência de tecnologia ou coinvestimento industrial' },
  { name: 'Tecnológico', desc: 'Gargalo de formulação, síntese de nanomateriais ou estabilidade' },
  { name: 'Científico', desc: 'Compreensão de mecanismo de ação biológico ou biofísico fundamental' },
];

const DIMENSIONS: { key: keyof Technology['multidimensionalReadiness']; label: string; isTRL: boolean }[] = [
  { key: 'TRL', label: 'TRL (1-9)', isTRL: true },
  { key: 'PRL', label: 'PRL (Prod)', isTRL: false },
  { key: 'MRL', label: 'MRL (Manuf)', isTRL: false },
  { key: 'RRL', label: 'RRL (Regulat)', isTRL: false },
  { key: 'QRL', label: 'QRL (Qualid)', isTRL: false },
  { key: 'VRL', label: 'VRL (Valid)', isTRL: false },
  { key: 'CRL', label: 'CRL (Clínico)', isTRL: false },
  { key: 'IPRL', label: 'IPRL (PI)', isTRL: false },
  { key: 'Partnership', label: 'Partnership', isTRL: false },
  { key: 'FRL', label: 'FRL (Financ)', isTRL: false },
];

export const HeatmapBottlenecksView: React.FC<HeatmapBottlenecksViewProps> = ({
  technologies,
  onSelectTechnology,
}) => {
  const [selectedBottleneckFilter, setSelectedBottleneckFilter] = useState<string>('ALL');

  // Count bottlenecks
  const bottleneckCounts = BOTTLENECK_CATEGORIES.map((cat) => {
    const matchingTechs = technologies.filter((t) => t.primaryBottleneck === cat.name);
    return {
      ...cat,
      count: matchingTechs.length,
      technologies: matchingTechs,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-indigo-600" />
            <span>Matriz Heatmap & Mapa de Gargalos Estruturais</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cruze o portfólio completo com as dimensões de maturidade para identificar pontos cegos e bloqueios translacionais.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-600 rounded" />
            <span className="text-slate-600">4-5 (Avançado)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-400 rounded" />
            <span className="text-slate-600">3 (Demonstrado)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-200 rounded" />
            <span className="text-slate-600">2 (Planejado)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-200 rounded" />
            <span className="text-slate-600">0-1 (Crítico/Gargalo)</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: PORTFOLIO HEATMAP MATRIX */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Matriz: Tecnologias × Dimensões de Maturidade
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Níveis de 0 a 5 para as dimensões translacionais e 1 a 9 para o TRL. Clique em uma célula para detalhar o projeto.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 bg-slate-50">
                <th className="p-2.5 font-bold uppercase text-[10px] w-56">Tecnologia / Produto</th>
                <th className="p-2.5 font-bold uppercase text-[10px] text-center">Estágio</th>
                {DIMENSIONS.map((dim) => (
                  <th key={dim.key} className="p-2.5 font-bold uppercase text-[10px] text-center">
                    {dim.label}
                  </th>
                ))}
                <th className="p-2.5 font-bold uppercase text-[10px] text-right">Gargalo Primário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {technologies.map((tech) => (
                <tr
                  key={tech.id}
                  onClick={() => onSelectTechnology(tech)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="p-2.5">
                    <div className="font-mono font-bold text-[11px] text-slate-800">{tech.code}</div>
                    <div className="font-semibold text-slate-900 truncate max-w-xs">{tech.name}</div>
                  </td>
                  <td className="p-2.5 text-center whitespace-nowrap">
                    <span className="font-bold text-slate-800 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                      {tech.stage}
                    </span>
                  </td>

                  {/* 10 Readiness dimensions heatmap cells */}
                  {DIMENSIONS.map((dim) => {
                    const val = tech.multidimensionalReadiness[dim.key];
                    const colorStyle = getReadinessColor(val, dim.isTRL);
                    return (
                      <td key={dim.key} className="p-1.5 text-center">
                        <div
                          title={`${tech.name} - ${dim.label}: ${val} (${getReadinessLabel(val)})`}
                          className={`w-10 h-7 mx-auto rounded flex items-center justify-center font-mono font-bold text-xs shadow-2xs ${colorStyle.bg} ${colorStyle.text}`}
                        >
                          {val}
                        </div>
                      </td>
                    );
                  })}

                  <td className="p-2.5 text-right whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tech.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tech.primaryBottleneck}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: TECHNOLOGY BOTTLENECK MAP */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Technology Bottleneck Map (Distribuição dos 12 Gargalos Estruturais)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Quantificação das principais barreiras que impedem o avanço translacional das tecnologias da rede.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {bottleneckCounts.map((cat) => {
            const hasTechs = cat.count > 0;
            return (
              <div
                key={cat.name}
                className={`border rounded-lg p-3 transition-all ${
                  hasTechs
                    ? 'border-red-200 bg-red-50/40 hover:bg-red-50'
                    : 'border-slate-200 bg-slate-50/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">{cat.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    hasTechs ? 'bg-red-200 text-red-900' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.count} {cat.count === 1 ? 'tec' : 'tecs'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight mb-2">
                  {cat.desc}
                </p>

                {hasTechs && (
                  <div className="space-y-1 pt-1 border-t border-red-100">
                    {cat.technologies.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTechnology(t)}
                        className="text-[11px] text-slate-800 font-medium hover:text-indigo-600 cursor-pointer flex items-center justify-between truncate"
                      >
                        <span className="truncate">{t.code} - {t.name}</span>
                        <ArrowRight className="w-3 h-3 shrink-0 text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
