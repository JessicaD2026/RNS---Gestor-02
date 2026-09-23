import React, { useState } from 'react';
import { InfrastructureEquipment, TechnologicalService, Technology } from '../types';
import {
  Cpu,
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck2,
  Send,
  Building
} from 'lucide-react';

interface InfrastructureServicesViewProps {
  equipments: InfrastructureEquipment[];
  services: TechnologicalService[];
  technologies: Technology[];
}

export const InfrastructureServicesView: React.FC<InfrastructureServicesViewProps> = ({
  equipments,
  services,
  technologies,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'services' | 'equipments'>('services');
  const [requestModalService, setRequestModalService] = useState<TechnologicalService | null>(null);
  const [selectedTechId, setSelectedTechId] = useState(technologies[0]?.id || '');
  const [serviceRequestSuccess, setServiceRequestSuccess] = useState<string | null>(null);

  const handleConfirmServiceRequest = () => {
    if (requestModalService) {
      setServiceRequestSuccess(`Solicitação de serviço "${requestModalService.name}" enviada para o laboratório ${requestModalService.labName}!`);
      setRequestModalService(null);
      setTimeout(() => setServiceRequestSuccess(null), 5000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <span>Infraestrutura Compartilhada & Catálogo de Serviços Tecnológicos</span>
          </h2>
          <p className="text-xs text-slate-500">
            Acesso integrado a parques de equipamentos multiusuários, salas limpas e serviços especializados de ensaios translacionais.
          </p>
        </div>

        <div className="inline-flex rounded-md p-0.5 bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('services')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              activeSubTab === 'services' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Catálogo de Serviços ({services.length})
          </button>
          <button
            onClick={() => setActiveSubTab('equipments')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              activeSubTab === 'equipments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Equipamentos Multiusuários ({equipments.length})
          </button>
        </div>
      </div>

      {serviceRequestSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{serviceRequestSuccess}</span>
        </div>
      )}

      {/* SUBTAB 1: SERVICES CATALOG */}
      {activeSubTab === 'services' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold">{srv.category}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-medium text-slate-700">
                      {srv.turnaroundDays} dias úteis
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {srv.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 bg-slate-50 rounded p-2 border border-slate-100">
                    <div><span className="font-semibold text-slate-700">Lab Executor:</span> {srv.labName}</div>
                    <div><span className="font-semibold text-slate-700">Instituição:</span> {srv.institution}</div>
                    <div><span className="font-semibold text-slate-700">Procedimento (POP):</span> {srv.standardOperatingProcedure}</div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      Estágios: {srv.applicableStages.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                    <span className="font-bold text-emerald-700">{srv.status}</span>
                  </div>

                  <button
                    onClick={() => setRequestModalService(srv)}
                    className="px-3 py-1.5 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Solicitar Serviço</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: MULTIUSER EQUIPMENTS */}
      {activeSubTab === 'equipments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipments.map((eq) => (
              <div key={eq.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {eq.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{eq.name}</h3>
                    <div className="text-xs text-slate-500 font-medium">
                      {eq.model} ({eq.manufacturer}) · {eq.labName} ({eq.institution})
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    eq.availability === 'Disponível' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {eq.availability}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 border border-slate-100 rounded p-2.5">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Responsável Científico</span>
                    <span className="font-medium text-slate-800">{eq.responsibleScientist}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Capacidade Operacional</span>
                    <span className="font-semibold text-slate-800">{eq.capacity}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Aplicações:</span> {eq.applications.join(', ')}
                </div>

                {eq.technologiesDependingOnIt.length > 0 && (
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Tecnologias Dependentes:</span>{' '}
                    <span className="font-mono text-indigo-700 font-semibold">{eq.technologiesDependingOnIt.join(' · ')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Certificações: <strong>{eq.certifications.join(', ')}</strong></span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Ver Agenda Multiusuário</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Request Modal */}
      {requestModalService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 text-xs space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Solicitação de Serviço Tecnológico
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Serviço: {requestModalService.name}
                </p>
              </div>
              <button
                onClick={() => setRequestModalService(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Selecione a Tecnologia Demandante:
                </label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs font-medium focus:outline-none"
                >
                  {technologies.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.code}] {t.name} (TRL {t.trl})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                <div>Lab Provedor: <strong>{requestModalService.labName}</strong> ({requestModalService.institution})</div>
                <div>Prazo Estimado: <strong>{requestModalService.turnaroundDays} dias úteis</strong></div>
                <div>Procedimento Operacional: <strong>{requestModalService.standardOperatingProcedure}</strong></div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Especificações da Amostra / Lote / Desafio:
                </label>
                <textarea
                  rows={3}
                  defaultValue="Amostras de formulação preparadas conforme POP para realização de ensaios analíticos credenciados."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setRequestModalService(null)}
                className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmServiceRequest}
                className="px-4 py-1.5 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 shadow-xs"
              >
                Confirmar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
