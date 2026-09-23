import React, { useState } from 'react';
import { Technology, TranslationalStage, BottleneckCategory } from '../types';
import { STAGE_DEFINITIONS } from '../data/mockData';
import { PlusCircle, X, CheckCircle2 } from 'lucide-react';

interface NewTechnologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTechnology: (newTech: Technology) => void;
}

export const NewTechnologyModal: React.FC<NewTechnologyModalProps> = ({
  isOpen,
  onClose,
  onSaveTechnology,
}) => {
  const [code, setCode] = useState('TEC-2026-005');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leader, setLeader] = useState('');
  const [leadInstitution, setLeadInstitution] = useState('');
  const [techClass, setTechClass] = useState<Technology['techClass']>('Nanotecnologia');
  const [applicationArea, setApplicationArea] = useState<Technology['applicationArea']>('Oncologia');
  const [intendedUse, setIntendedUse] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [stage, setStage] = useState<TranslationalStage>('E1');
  const [trl, setTrl] = useState(3);
  const [primaryBottleneck, setPrimaryBottleneck] = useState<BottleneckCategory>('Regulatório');
  const [bottleneckDetail, setBottleneckDetail] = useState('');
  const [fundingGapBRL, setFundingGapBRL] = useState(250000);
  const [nextMilestone, setNextMilestone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !leader || !leadInstitution) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const newTech: Technology = {
      id: `tech-${Date.now()}`,
      code,
      name,
      description,
      leader,
      leaderRole: 'Pesquisador Principal',
      leadInstitution,
      participatingInstitutions: [leadInstitution],
      thematicProjectId: 'proj-trans-01',
      thematicProjectName: 'Inovação e Desenvolvimento Translacional',
      techClass,
      applicationArea,
      intendedUse: intendedUse || 'Uso diagnóstico ou terapêutico avançado.',
      targetUser: targetUser || 'Especialistas clínicos e hospitais de referência.',
      application: 'Saúde Humana e Medicina de Precisão',
      problemStatement: problemStatement || 'Baixa eficácia e efeitos adversos de terapias convencionais.',
      version: 'v1.0-alpha',
      trl,
      stage,
      status: bottleneckDetail ? 'blocked' : 'advancing',
      multidimensionalReadiness: {
        TRL: trl,
        PRL: 1,
        MRL: 1,
        RRL: 1,
        QRL: 1,
        VRL: 1,
        CRL: 1,
        IPRL: 2,
        Partnership: 2,
        FRL: 1,
      },
      initialReadiness: {
        entryYear: 2026,
        TRL: trl,
        RRL: 1,
        VRL: 1,
        MRL: 1,
      },
      ipStatus: 'Pedido Depositado',
      patentNumbers: ['BR 10 2026 000999-0'],
      fundingReceivedBRL: 100000,
      fundingGapBRL: Number(fundingGapBRL),
      partners: ['Polo de Inovação', 'Hospital Universitário'],
      documentsCount: 4,
      evidenceCount: 1,
      risks: [
        {
          level: 'Médio',
          description: 'Desafio na escalabilidade de síntese',
          mitigation: 'Apoio de planta piloto e laboratório parceiro da rede',
        },
      ],
      nextMilestone: nextMilestone || 'Conclusão dos ensaios de citotoxicidade',
      nextMilestoneDate: '30/11/2026',
      daysWithoutProgress: 15,
      primaryBottleneck,
      bottleneckDetail: bottleneckDetail || 'Aguardando agendamento de ensaios de citotoxicidade.',
      developmentPlan: {
        currentState: 'Em validação inicial de síntese e funcionalização.',
        nextMilestone: nextMilestone || 'Ensaio de citotoxicidade',
        targetDate: '30/11/2026',
        identifiedGaps: [bottleneckDetail || 'Ensaios analíticos complementares'],
        keyRequirements: ['Ausência de toxicidade aguda em concentrações terapêuticas'],
        activities: [],
        budgetEstimatedTotalBRL: Number(fundingGapBRL) + 100000,
        budgetSecuredBRL: 100000,
        gateCriteria: ['Ausência de toxicidade aguda e viabilidade > 70%'],
        gateStatus: 'Agendado',
      },
      journey: [
        {
          id: `j-${Date.now()}`,
          year: 2026,
          title: 'Ingresso no Portfólio da Rede',
          description: 'Cadastro formal e início do mapeamento de maturidade multidimensional.',
          trlAchieved: trl,
          stageAchieved: stage,
          institutionsInvolved: [leadInstitution],
          investmentsReceivedBRL: 100000,
          evidenceIds: ['EVD-INIT-01'],
        },
      ],
    };

    onSaveTechnology(newTech);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in">
        
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Cadastrar Nova Tecnologia no Portfólio
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Código ID:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono font-bold"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Nome da Tecnologia / Produto:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Nanocápsulas Poliméricas para..."
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Descrição Técnica & Inovação:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o princípio científico e a inovação tecnológica..."
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pesquisador / Responsável:</label>
              <input
                type="text"
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
                placeholder="Ex: Dra. Mariana Costa"
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Instituição Líder:</label>
              <input
                type="text"
                value={leadInstitution}
                onChange={(e) => setLeadInstitution(e.target.value)}
                placeholder="Ex: USP / FCFRP"
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Estágio Translacional:</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              >
                {STAGE_DEFINITIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.shortName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">TRL Atual (1 a 9):</label>
              <input
                type="number"
                min={1}
                max={9}
                value={trl}
                onChange={(e) => setTrl(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Classe Tecnológica:</label>
              <select
                value={techClass}
                onChange={(e) => setTechClass(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              >
                <option value="Nanotecnologia">Nanotecnologia</option>
                <option value="Biomaterial">Biomaterial</option>
                <option value="Dispositivo Médico">Dispositivo Médico</option>
                <option value="Diagnóstico In Vitro">Diagnóstico In Vitro</option>
                <option value="Terapia Avançada">Terapia Avançada</option>
                <option value="Fármaco / Molécula">Fármaco / Molécula</option>
                <option value="Software Médico / SaMD">Software Médico / SaMD</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Área de Aplicação:</label>
              <select
                value={applicationArea}
                onChange={(e) => setApplicationArea(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              >
                <option value="Oncologia">Oncologia</option>
                <option value="Cardiologia">Cardiologia</option>
                <option value="Ortopedia / Regeneração">Ortopedia / Regeneração</option>
                <option value="Infectologia">Infectologia</option>
                <option value="Neurologia">Neurologia</option>
                <option value="Odontologia">Odontologia</option>
                <option value="Dermatologia">Dermatologia</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Gargalo Primário:</label>
              <select
                value={primaryBottleneck}
                onChange={(e) => setPrimaryBottleneck(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
              >
                <option value="Regulatório">Regulatório</option>
                <option value="Validação">Validação</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Experimental">Experimental</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Manufatura">Manufatura</option>
                <option value="Clínico">Clínico</option>
                <option value="Qualidade">Qualidade</option>
                <option value="Propriedade Intelectual">Propriedade Intelectual</option>
                <option value="Parceria">Parceria</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Funding Gap (R$):</label>
              <input
                type="number"
                step={10000}
                value={fundingGapBRL}
                onChange={(e) => setFundingGapBRL(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Detalhamento do Gargalo:</label>
            <input
              type="text"
              value={bottleneckDetail}
              onChange={(e) => setBottleneckDetail(e.target.value)}
              placeholder="Ex: Necessidade de estudo de toxicologia em laboratório BPL..."
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Próximo Marco / Milestone:</label>
            <input
              type="text"
              value={nextMilestone}
              onChange={(e) => setNextMilestone(e.target.value)}
              placeholder="Ex: Conclusão do lote piloto sob Boas Práticas..."
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
              Cadastrar no Portfólio
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
