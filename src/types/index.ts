export type TranslationalStage = 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6' | 'MERCADO';

export interface StageDefinition {
  id: TranslationalStage;
  code: string;
  name: string;
  shortName: string;
  description: string;
  subTracks: string[];
  keyGateRequirements: string[];
  color: string;
}

export interface MultidimensionalReadiness {
  TRL: number; // 1-9
  PRL: number; // 0-5 Product Readiness
  MRL: number; // 0-5 Manufacturing Readiness
  RRL: number; // 0-5 Regulatory Readiness
  QRL: number; // 0-5 Quality Readiness
  VRL: number; // 0-5 Validation Readiness
  CRL: number; // 0-5 Clinical/Application Readiness
  IPRL: number; // 0-5 Intellectual Property Readiness
  Partnership: number; // 0-5 Partnership Readiness
  FRL: number; // 0-5 Financial Readiness
}

export type BottleneckCategory =
  | 'Científico'
  | 'Tecnológico'
  | 'Experimental'
  | 'Validação'
  | 'Regulatório'
  | 'Qualidade'
  | 'Clínico'
  | 'Manufatura'
  | 'Infraestrutura'
  | 'Financeiro'
  | 'Propriedade Intelectual'
  | 'Parceria';

export interface JourneyMilestone {
  id: string;
  year: number;
  month?: string;
  title: string;
  description: string;
  trlAchieved: number;
  stageAchieved: TranslationalStage;
  institutionsInvolved: string[];
  investmentsReceivedBRL: number;
  evidenceIds: string[];
  patentsReferenced?: string[];
  publicationsReferenced?: string[];
}

export interface TechnologyDevelopmentPlan {
  currentState: string;
  nextMilestone: string;
  targetDate: string;
  identifiedGaps: string[];
  keyRequirements: string[];
  activities: {
    id: string;
    title: string;
    assignedLab: string;
    partnerInstitution: string;
    estimatedCostBRL: number;
    timelineWeeks: number;
    status: 'Concluído' | 'Em Andamento' | 'Pendente' | 'Bloqueado';
    deliverable: string;
  }[];
  budgetEstimatedTotalBRL: number;
  budgetSecuredBRL: number;
  gateCriteria: string[];
  gateStatus: 'Pendente' | 'Agendado' | 'Aprovado' | 'Retido com Condições';
}

export interface Technology {
  id: string;
  code: string; // e.g. "TEC-2024-001"
  name: string;
  description: string;
  leader: string;
  leaderRole: string;
  leadInstitution: string;
  participatingInstitutions: string[];
  thematicProjectId: string;
  thematicProjectName: string;
  techClass: 'Biomaterial' | 'Dispositivo Médico' | 'Terapia Avançada' | 'Fármaco / Molécula' | 'Diagnóstico In Vitro' | 'Software Médico / SaMD' | 'Nanotecnologia';
  applicationArea: 'Oncologia' | 'Cardiologia' | 'Ortopedia / Regeneração' | 'Infectologia' | 'Neurologia' | 'Odontologia' | 'Dermatologia';
  intendedUse: string;
  targetUser: string; // e.g., "Cirurgiões ortopédicos e hospitais terciários"
  application: string;
  problemStatement: string;
  version: string;
  trl: number; // 1-9
  stage: TranslationalStage;
  multidimensionalReadiness: MultidimensionalReadiness;
  initialReadiness: {
    entryYear: number;
    TRL: number;
    RRL: number;
    VRL: number;
    MRL: number;
  };
  ipStatus: 'Patente Concedida' | 'Pedido Depositado' | 'Em Redação' | 'Segredo Industrial' | 'Domínio Público / Open Science';
  patentNumbers?: string[];
  fundingReceivedBRL: number;
  fundingGapBRL: number;
  partners: string[];
  documentsCount: number;
  evidenceCount: number;
  risks: {
    level: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
    description: string;
    mitigation: string;
  }[];
  primaryBottleneck: BottleneckCategory;
  bottleneckDetail: string;
  daysWithoutProgress: number;
  status: 'advancing' | 'blocked' | 'review_gate' | 'graduated';
  nextMilestone: string;
  nextMilestoneDate: string;
  developmentPlan: TechnologyDevelopmentPlan;
  journey: JourneyMilestone[];
}

export interface Evidence {
  id: string;
  code: string; // e.g. "EVD-049"
  technologyId: string;
  technologyCode: string;
  technologyName: string;
  applicationId: string;
  stage: TranslationalStage;
  readinessDimension: keyof MultidimensionalReadiness;
  requirement: string; // e.g., "Avaliação de citotoxicidade segundo ISO 10993-5"
  protocol: string; // e.g., "POP-BIO-044 v2: Ensaio de MTT com linhagem L929"
  experiment: string; // e.g., "Extração 24h a 37°C com meio DMEM + 10% SFB"
  result: string; // e.g., "Viabilidade celular de 94.2% ± 3.1% (> 70% threshold de aprovação)"
  acceptanceCriteria: string; // e.g., "Viabilidade celular >= 70% sem alteração morfológica"
  laboratoryId: string;
  laboratoryName: string;
  responsible: string;
  date: string;
  fileName: string;
  fileSize?: string;
  status: 'Pendente' | 'Em Análise' | 'Aprovado' | 'Rejeitado';
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
}

export interface ValidationStudy {
  id: string;
  code: string;
  technologyId: string;
  technologyName: string;
  type: 'Internal' | 'External' | 'Interlaboratory' | 'Multicenter';
  title: string;
  participatingLabs: {
    labName: string;
    institution: string;
    operator: string;
    equipment: string;
    lotNumber: string;
    meanResult: number;
    unit: string;
    standardDeviation: number;
  }[];
  commonProtocol: string;
  variabilityCVPercent: number; // Coeficiente de Variação
  deviationsReported: string;
  statisticalAnalysis: string; // e.g., "ANOVA one-way p = 0.42 (sem diferença estatística significante)"
  conclusion: string;
  date: string;
  status: 'Concluído' | 'Em Execução' | 'Planejado';
}

export interface Competency {
  id: string;
  institutionId: string;
  institutionName: string;
  labId: string;
  labName: string;
  responsible: string;
  teamSize: number;
  name: string; // Nome da competência
  category: 'Caracterização Físico-Química' | 'Ensaios Biológicos & Celulares' | 'Modelos In Vivo & Pré-Clínicos' | 'Validação Analítica & Metrologia' | 'Escalonamento & Bioprocesso' | 'Regulatório & Qualidade' | 'Design & Engenharia de Dispositivos';
  technique: string;
  methodology: string;
  equipments: string[];
  infrastructureDescription: string;
  capacityDescription: string; // e.g., "120 análises/mês"
  certifications: string[]; // e.g., "ISO/IEC 17025", "BPL / GLP Reconhecido Cgcre/Inmetro", "ANVISA REBLAS"
  experienceYears: number;
  sampleApplications: string[];
  servicesOffered: string[];
  availability: 'Imediata' | 'Moderada (2-4 semanas)' | 'Fila de Espera (> 60 dias)';
  trlsSupported: number[]; // e.g., [1, 2, 3, 4, 5]
  stagesSupported: TranslationalStage[]; // e.g., ['E1', 'E2', 'E3']
}

export interface CompetencyMatchResult {
  technologyId: string;
  gapIdentified: string;
  requiredCompetency: string;
  matchedLabId: string;
  matchedLabName: string;
  institutionName: string;
  matchScore: number; // 0-100
  matchLevel: 'Alto' | 'Médio' | 'Baixo';
  criteriaBreakdown: {
    techniqueCoverage: number; // %
    infrastructureFit: boolean;
    certificationFit: boolean;
    stageFit: boolean;
    availabilityScore: number;
  };
  explanation: string;
  recommendedAction: string;
}

export interface InfrastructureEquipment {
  id: string;
  name: string;
  labName: string;
  institution: string;
  model: string;
  manufacturer: string;
  capacity: string;
  availability: 'Disponível' | 'Manutenção' | 'Alta Demanda / Reservado';
  responsibleScientist: string;
  certifications: string[];
  applications: string[];
  technologiesDependingOnIt: string[];
}

export interface TechnologicalService {
  id: string;
  name: string;
  category: string;
  labName: string;
  institution: string;
  description: string;
  turnaroundDays: number;
  standardOperatingProcedure: string;
  applicableStages: TranslationalStage[];
  status: 'Ativo' | 'Sob Consulta';
}

export interface StrategicResourceAllocation {
  id: string;
  technologyId: string;
  technologyName: string;
  technologyCode: string;
  gap: string;
  proposedActivity: string;
  costBRL: number;
  infrastructureNeeded: string;
  timelineMonths: number;
  expectedDeltaTRL: string; // e.g., "TRL 4 -> 6"
  expectedDeltaReadiness: string; // e.g., "RRL 1 -> 3, VRL 2 -> 4"
  impactScore: number; // 1-10
  feasibilityScore: number; // 1-10
  priorityRecommendation: 'Prioridade Máxima' | 'Alta Prioridade' | 'Investimento Condicionado' | 'Reavaliação';
  rationale: string;
}

export interface GovernanceDecision {
  id: string;
  technologyId: string;
  technologyCode: string;
  technologyName: string;
  date: string;
  topic: string;
  analyzedData: string;
  identifiedRisks: string;
  technicalRecommendation: string;
  decisionMade: 'Aprovado para Próximo Gate' | 'Aprovado com Condicionantes' | 'Manter em Maturação' | 'Reorientação Estratégica' | 'Descontinuação / Pivot';
  responsibleCommittee: 'Comitê Gestor' | 'Comitê Técnico Científico' | 'Coordenação Executiva';
  committeeMembers: string[];
  approvedBudgetBRL: number;
  conditionsImposed: string[];
  reviewDeadline: string;
}

export interface NetworkImpactMetrics {
  outputs: {
    technologiesRegistered: number;
    developedProtocols: number;
    patentsFiled: number;
    scientificPublications: number;
    personnelTrained: number;
    technologicalServicesRendered: number;
    startupsAssociated: number;
    strategicPartnershipsSigned: number;
  };
  outcomes: {
    technologiesAdvancedStage: number;
    interlabValidationsCompleted: number;
    averageDeltaTRL: number;
    averageDeltaReadiness: number;
    averageMonthsBetweenGates: number;
    regulatoryFilesSubmitted: number;
    technologyTransferAgreements: number;
    fundsLeveragedBRL: number;
    fundsAppliedBRL: number;
  };
}

export interface SaaSNetworkConfig {
  networkId: string;
  name: string;
  acronym: string;
  tagline: string;
  organizationType: 'INCT' | 'Rede Temática' | 'ICT / Universidade' | 'Hub / Consórcio DeepTech' | 'Aceleradora / HealthTech';
  anchorInstitution: string;
  leadCoordinator: string;
  participatingInstitutionsCount: number;
  activeLaboratoriesCount: number;
  themeColor: string;
  governanceCommittees: string[];
  customStagesCount: number;
}

export type UserRole =
  | 'Administrador da Rede'
  | 'Coordenação'
  | 'Comitê Gestor'
  | 'Comitê Técnico'
  | 'Coordenador de Projeto'
  | 'Pesquisador'
  | 'Laboratório'
  | 'Startup'
  | 'Avaliador';
