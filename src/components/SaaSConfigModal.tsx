import React, { useState } from 'react';
import { SaaSNetworkConfig } from '../types';
import { Settings, X, CheckCircle2, Shield, Building } from 'lucide-react';

interface SaaSConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SaaSNetworkConfig;
  onSaveConfig: (updated: SaaSNetworkConfig) => void;
}

export const SaaSConfigModal: React.FC<SaaSConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<SaaSNetworkConfig>({ ...config });
  const [committeeInput, setCommitteeInput] = useState(config.governanceCommittees.join(', '));
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SaaSNetworkConfig = {
      ...formData,
      governanceCommittees: committeeInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onSaveConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 text-xs space-y-4 animate-in fade-in">
        
        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Configuração SaaS White-Label da Rede
              </h3>
              <p className="text-slate-500 text-xs">
                Personalização de estrutura, governança, nomenclatura e instituição âncora
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configurações da rede atualizadas com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Nome da Organização / Rede:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Sigla:</label>
              <input
                type="text"
                value={formData.acronym}
                onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono font-bold focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tagline / Descrição Institucional:</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tipo de Organização:</label>
              <select
                value={formData.organizationType}
                onChange={(e) => setFormData({ ...formData, organizationType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:outline-none"
              >
                <option value="INCT">INCT (Instituto Nacional de C&T)</option>
                <option value="Rede Temática">Rede Temática de Pesquisa</option>
                <option value="ICT / Universidade">ICT / Universidade</option>
                <option value="Hub / Consórcio DeepTech">Hub / Consórcio DeepTech</option>
                <option value="Aceleradora / HealthTech">Aceleradora / HealthTech</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Instituição Âncora / Líder:</label>
              <input
                type="text"
                value={formData.anchorInstitution}
                onChange={(e) => setFormData({ ...formData, anchorInstitution: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Coordenador Geral da Rede:</label>
            <input
              type="text"
              value={formData.leadCoordinator}
              onChange={(e) => setFormData({ ...formData, leadCoordinator: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Comitês de Governança (separados por vírgula):
            </label>
            <input
              type="text"
              value={committeeInput}
              onChange={(e) => setCommitteeInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
            />
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
              Salvar Alterações
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
