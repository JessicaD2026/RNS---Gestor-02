import React, { useState } from 'react';
import { ValidationStudy } from '../types';
import {
  GitCompare,
  CheckCircle2,
  Award,
  ChevronRight,
  TrendingDown,
  Building
} from 'lucide-react';

interface ValidationStudiesViewProps {
  studies: ValidationStudy[];
}

export const ValidationStudiesView: React.FC<ValidationStudiesViewProps> = ({ studies }) => {
  const [selectedStudy, setSelectedStudy] = useState<ValidationStudy>(studies[0]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-indigo-600" />
            <span>Validação Multi-Institucional & Estudos Interlaboratoriais</span>
          </h2>
          <p className="text-xs text-slate-500">
            Garantia de robustez e reprodutibilidade: múltiplos laboratórios independentes testando o mesmo protocolo com controle estatístico.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold">
            Meta da Rede: CV Interlaboratorial &lt; 5.0%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Studies List (Left) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Estudos Interlaboratoriais ({studies.length})
          </h3>

          <div className="space-y-2">
            {studies.map((study) => (
              <div
                key={study.id}
                onClick={() => setSelectedStudy(study)}
                className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedStudy.id === study.id
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-700">{study.code}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    study.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' :
                    study.status === 'Em Execução' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {study.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 leading-snug">{study.title}</h4>
                <div className="text-slate-500 text-[11px] mt-1">
                  {study.technologyName} · {study.participatingLabs.length} Laboratórios
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">CV Interlab: <strong className="text-emerald-700">{study.variabilityCVPercent}%</strong></span>
                  <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                    Detalhes <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Study Deep-Dive */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedStudy.code}
                  </span>
                  <span className="text-xs text-slate-500">Tipo: <strong>{selectedStudy.type}</strong></span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedStudy.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tecnologia: {selectedStudy.technologyName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CV% Interlaboratorial</span>
                <span className="text-2xl font-bold text-emerald-700">{selectedStudy.variabilityCVPercent}%</span>
              </div>
            </div>

            {/* Participating Labs Results Comparison */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Comparação de Dados Interlaboratoriais
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                    <tr>
                      <th className="px-3 py-2">Laboratório Executor</th>
                      <th className="px-3 py-2">Operador & Equipamento</th>
                      <th className="px-3 py-2">Lote</th>
                      <th className="px-3 py-2">Média</th>
                      <th className="px-3 py-2">Desvio (SD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedStudy.participatingLabs.map((lab, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2.5 font-medium text-slate-900">
                          <div>{lab.labName}</div>
                          <div className="text-[10px] text-slate-400">{lab.institution}</div>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">
                          <div>{lab.operator}</div>
                          <div className="text-[10px] text-slate-400">{lab.equipment}</div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-700">{lab.lotNumber}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-800 font-bold">
                          {lab.meanResult} {lab.unit}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-600">
                          ± {lab.standardDeviation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statistical & Consistence Assessment */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Protocolo Comum & Análise Estatística:</span>
              </div>
              <div className="text-slate-700">
                <span className="font-semibold text-slate-800">Protocolo:</span> {selectedStudy.commonProtocol}
              </div>
              <div className="text-slate-700">
                <span className="font-semibold text-slate-800">Estatística:</span> {selectedStudy.statisticalAnalysis}
              </div>
              <div className="text-slate-700">
                <span className="font-semibold text-slate-800">Conclusão:</span> {selectedStudy.conclusion}
              </div>
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-slate-500 text-[11px]">
                <span>Data do Estudo: {selectedStudy.date}</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Laudo Interlaboratorial Homologado
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
