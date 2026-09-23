import React, { useState } from 'react';
import { Evidence, Technology } from '../types';
import { FileCheck2, X, Upload } from 'lucide-react';

interface NewEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  technologies: Technology[];
  selectedTechDefault?: Technology | null;
  onSaveEvidence: (newEvidence: Evidence) => void;
}

export const NewEvidenceModal: React.FC<NewEvidenceModalProps> = ({
  isOpen,
  onClose,
  technologies,
  selectedTechDefault,
  onSaveEvidence,
}) => {
  const [techId, setTechId] = useState(selectedTechDefault?.id || technologies[0]?.id || '');
  const [requirement, setRequirement] = useState('');
  const [protocol, setProtocol] = useState('');
  const [result, setResult] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [laboratoryName, setLaboratoryName] = useState('');
  const [responsible, setResponsible] = useState('');
  const [readinessDimension, setReadinessDimension] = useState<Evidence['readinessDimension']>('RRL');
  const [fileName, setFileName] = useState('Laudo_Tecnico_Validado.pdf');

  if (!isOpen) return null;

  const activeTech = technologies.find((t) => t.id === techId) || technologies[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirement || !protocol || !result || !laboratoryName) {
      alert('Preencha os campos obrigatórios da evidência.');
      return;
    }

    const newEv: Evidence = {
      id: `ev-${Date.now()}`,
      code: `EVD-${Math.floor(100 + Math.random() * 900)}`,
      technologyId: activeTech.id,
      technologyCode: activeTech.code,
      technologyName: activeTech.name,
      applicationId: 'app-default',
      stage: activeTech.stage,
      readinessDimension,
      requirement,
      protocol,
      experiment: 'Ensaio analítico e determinação quantitativa sob POP padronizado.',
      result,
      acceptanceCriteria,
      laboratoryId: 'lab-gen',
      laboratoryName,
      responsible: responsible || 'Pesquisador Responsável',
      date: new Date().toLocaleDateString('pt-BR'),
      fileName,
      fileSize: '2.4 MB',
      status: 'Em Análise',
    };

    onSaveEvidence(newEv);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in">
        
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Registrar Nova Evidência Científica / Experimental
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Tecnologia Vinculada:</label>
            <select
              value={techId}
              onChange={(e) => setTechId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold focus:outline-none"
            >
              {technologies.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.code}] {t.name} (Estágio {t.stage}, TRL {t.trl})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Dimensão de Prontidão:</label>
              <select
                value={readinessDimension}
                onChange={(e) => setReadinessDimension(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              >
                <option value="TRL">TRL (Tecnológico)</option>
                <option value="RRL">RRL (Regulatório)</option>
                <option value="VRL">VRL (Validação Interlab)</option>
                <option value="MRL">MRL (Manufatura)</option>
                <option value="QRL">QRL (Qualidade)</option>
                <option value="CRL">CRL (Clínico)</option>
                <option value="PRL">PRL (Produto)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Laboratório Executor:</label>
              <input
                type="text"
                value={laboratoryName}
                onChange={(e) => setLaboratoryName(e.target.value)}
                placeholder="Ex: Lab de Citotoxicidade / FMRP"
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Requisito Técnico a Comprovar:</label>
            <input
              type="text"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Ex: Determinação de estabilidade térmica por 90 dias a 4°C e 25°C"
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Protocolo / Norma / Metodologia:</label>
            <input
              type="text"
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              placeholder="Ex: Protocolo ISO 10993-5 / Ensaio MTT de viabilidade celular"
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Resultado Obtido (Dados Quantitativos):</label>
            <textarea
              rows={2}
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Ex: Viabilidade celular superior a 94.2% ± 1.8% em concentrações até 500 ug/mL..."
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Critério de Aceitação Mandatório:</label>
            <input
              type="text"
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="Ex: Viabilidade celular >= 80% e ausência de precipitação"
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Responsável pelo Ensaio:</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Ex: Dr. Lucas Nogueira"
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nome do Arquivo / Laudo:</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 shadow-xs"
            >
              Submeter Evidência para Auditoria
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
