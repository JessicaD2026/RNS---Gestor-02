import React, { useState } from 'react';
import { Evidence, Technology } from '../types';
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ShieldAlert,
  ArrowRight,
  Hash,
  Download,
  Calendar,
  Building
} from 'lucide-react';

interface EvidenceTraceabilityViewProps {
  evidences: Evidence[];
  technologies: Technology[];
  onApproveEvidence: (evidenceId: string, status: 'Aprovado' | 'Rejeitado', comment: string) => void;
  onOpenNewEvidence: () => void;
}

export const EvidenceTraceabilityView: React.FC<EvidenceTraceabilityViewProps> = ({
  evidences,
  technologies,
  onApproveEvidence,
  onOpenNewEvidence,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [reviewerComment, setReviewerComment] = useState('');

  const filteredEvidences = evidences.filter((ev) => {
    const matchSearch =
      ev.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.technologyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.laboratoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.responsible.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || ev.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleReviewAction = (status: 'Aprovado' | 'Rejeitado') => {
    if (selectedEvidence) {
      onApproveEvidence(selectedEvidence.id, status, reviewerComment || 'Análise técnica concluída pelo comitê avaliador.');
      setSelectedEvidence(null);
      setReviewerComment('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <span>Gestão de Evidências & Rastreabilidade Translacional</span>
          </h2>
          <p className="text-xs text-slate-500">
            Nenhum avanço de TRL ou Gate é admitido sem evidências científicas auditáveis, laudos técnicos e validação formal.
          </p>
        </div>

        <button
          onClick={onOpenNewEvidence}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Registrar Nova Evidência</span>
        </button>
      </div>

      {/* Traceability Chain Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Cadeia de Custódia & Rastreabilidade de Evidências
        </span>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-medium text-slate-700">
          {[
            'Requisito Técnico',
            'Experimento & Protocolo',
            'Equipamento & Calibração',
            'Dados Brutos & Laudo',
            'Parecer do Laboratório',
            'Validação por Pares',
            'Decisão no Gate',
            'Delta Readiness Homologado',
          ].map((step, idx, arr) => (
            <React.Fragment key={step}>
              <span className="px-2 py-1 rounded bg-white border border-slate-200 shadow-2xs whitespace-nowrap">
                {step}
              </span>
              {idx < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, tecnologia, requisito, laboratório ou responsável..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-medium">Status de Auditoria:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2 text-xs focus:outline-none"
          >
            <option value="ALL">Todos os Status</option>
            <option value="Aprovado">Aprovados</option>
            <option value="Em Análise">Em Análise Técnica</option>
            <option value="Requer Revisão">Requer Revisão / Reensaio</option>
            <option value="Rejeitado">Rejeitados</option>
          </select>
        </div>

        <div className="text-slate-400 text-xs ml-auto">
          {filteredEvidences.length} evidências registradas
        </div>
      </div>

      {/* Evidences Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-3 py-2.5">Código & Data</th>
                <th className="px-3 py-2.5">Tecnologia & Estágio</th>
                <th className="px-3 py-2.5">Requisito & Protocolo</th>
                <th className="px-3 py-2.5">Resultado Obtido</th>
                <th className="px-3 py-2.5">Laboratório Executor</th>
                <th className="px-3 py-2.5">Dimensão</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvidences.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900">{ev.code}</div>
                    <div className="text-[10px] text-slate-400">{ev.date}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-slate-900 truncate max-w-xs">{ev.technologyName}</div>
                    <div className="text-[10px] text-slate-500">Estágio {ev.stage} · {ev.technologyCode}</div>
                  </td>
                  <td className="px-3 py-3 max-w-xs">
                    <div className="font-medium text-slate-800 line-clamp-1">{ev.requirement}</div>
                    <div className="text-[10px] text-slate-400 truncate">{ev.protocol}</div>
                  </td>
                  <td className="px-3 py-3 max-w-xs">
                    <div className="text-slate-700 line-clamp-2">{ev.result}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{ev.laboratoryName}</div>
                    <div className="text-[10px] text-slate-400">{ev.responsible}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-700">
                      {ev.readinessDimension}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ev.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800' :
                      ev.status === 'Em Análise' ? 'bg-amber-100 text-amber-800' :
                      ev.status === 'Pendente' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedEvidence(ev)}
                      className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
                    >
                      Auditar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit & Verification Drawer/Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 text-xs space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedEvidence.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Auditoria de Evidência Científica
                </h3>
                <p className="text-slate-500 text-xs">
                  Tecnologia: {selectedEvidence.technologyName} (Estágio {selectedEvidence.stage})
                </p>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div>
                <span className="font-bold text-slate-700 block">Requisito Testado:</span>
                <span className="text-slate-800">{selectedEvidence.requirement}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Protocolo & Metodologia:</span>
                <span className="text-slate-800">{selectedEvidence.protocol}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Resultado Obtido:</span>
                <span className="text-slate-800 font-medium">{selectedEvidence.result}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Critério de Aceitação Mandatório:</span>
                <span className="text-slate-800">{selectedEvidence.acceptanceCriteria}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-600">
                <div>Laboratório: <strong>{selectedEvidence.laboratoryName}</strong></div>
                <div>Executor: <strong>{selectedEvidence.responsible}</strong></div>
                <div>Dimensão: <strong>{selectedEvidence.readinessDimension}</strong></div>
                <div>Arquivo: <strong className="font-mono text-indigo-600">{selectedEvidence.fileName}</strong></div>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Parecer Técnico do Avaliador / Comitê:
              </label>
              <textarea
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                placeholder="Insira as observações sobre a conformidade do ensaio, desvios experimentais e recomendação para o Gate..."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-slate-500">Status atual: <strong>{selectedEvidence.status}</strong></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReviewAction('Rejeitado')}
                  className="px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50 font-semibold"
                >
                  Reprovar / Reteste
                </button>
                <button
                  onClick={() => handleReviewAction('Aprovado')}
                  className="px-4 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 font-semibold shadow-xs"
                >
                  Homologar Evidência
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
