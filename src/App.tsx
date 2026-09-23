import React, { useState } from 'react';
import {
  INITIAL_NETWORKS,
  INITIAL_TECHNOLOGIES,
  INITIAL_COMPETENCIES,
  INITIAL_EVIDENCES,
  INITIAL_VALIDATIONS,
  INITIAL_EQUIPMENTS,
  INITIAL_SERVICES,
  INITIAL_DECISIONS,
  INITIAL_IMPACT,
} from './data/mockData';
import {
  Technology,
  Evidence,
  Competency,
  GovernanceDecision,
  SaaSNetworkConfig,
  UserRole,
} from './types';
import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { PortfolioView } from './components/PortfolioView';
import { TechnologyDetailModal } from './components/TechnologyDetailModal';
import { HeatmapBottlenecksView } from './components/HeatmapBottlenecksView';
import { CompetencyMatchingView } from './components/CompetencyMatchingView';
import { EvidenceTraceabilityView } from './components/EvidenceTraceabilityView';
import { ValidationStudiesView } from './components/ValidationStudiesView';
import { InfrastructureServicesView } from './components/InfrastructureServicesView';
import { StrategicAllocationView } from './components/StrategicAllocationView';
import { NetworkImpactView } from './components/NetworkImpactView';
import { AiCopilotModal } from './components/AiCopilotModal';
import { SaaSConfigModal } from './components/SaaSConfigModal';
import { NewTechnologyModal } from './components/NewTechnologyModal';
import { NewEvidenceModal } from './components/NewEvidenceModal';

export default function App() {
  // SaaS and Network config state
  const [currentNetwork, setCurrentNetwork] = useState<SaaSNetworkConfig>(INITIAL_NETWORKS[0]);
  const [allNetworks, setAllNetworks] = useState<SaaSNetworkConfig[]>(INITIAL_NETWORKS);

  // Governance mode & active profile
  const [governanceMode, setGovernanceMode] = useState<'strategic' | 'operational'>('strategic');
  const [userRole, setUserRole] = useState<UserRole>('Administrador da Rede');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Domain data state
  const [technologies, setTechnologies] = useState<Technology[]>(INITIAL_TECHNOLOGIES);
  const [competencies, setCompetencies] = useState<Competency[]>(INITIAL_COMPETENCIES);
  const [evidences, setEvidences] = useState<Evidence[]>(INITIAL_EVIDENCES);
  const [validationStudies, setValidationStudies] = useState(INITIAL_VALIDATIONS);
  const [sharedEquipments, setSharedEquipments] = useState(INITIAL_EQUIPMENTS);
  const [technologicalServices, setTechnologicalServices] = useState(INITIAL_SERVICES);
  const [decisions, setDecisions] = useState<GovernanceDecision[]>(INITIAL_DECISIONS);
  const [impactMetrics, setImpactMetrics] = useState(INITIAL_IMPACT);

  // Modals state
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isNewTechOpen, setIsNewTechOpen] = useState(false);
  const [isNewEvidenceOpen, setIsNewEvidenceOpen] = useState(false);
  const [evidenceTechDefault, setEvidenceTechDefault] = useState<Technology | null>(null);

  // Handlers
  const handleSaveNewTechnology = (newTech: Technology) => {
    setTechnologies((prev) => [newTech, ...prev]);
    setSelectedTechnology(newTech);
  };

  const handleSaveNewEvidence = (newEv: Evidence) => {
    setEvidences((prev) => [newEv, ...prev]);
    // update technology evidence count
    setTechnologies((prev) =>
      prev.map((t) =>
        t.id === newEv.technologyId ? { ...t, evidenceCount: t.evidenceCount + 1 } : t
      )
    );
  };

  const handleApproveEvidence = (
    evidenceId: string,
    status: 'Aprovado' | 'Rejeitado',
    comment: string
  ) => {
    setEvidences((prev) =>
      prev.map((ev) =>
        ev.id === evidenceId ? { ...ev, status, rejectionReason: status === 'Rejeitado' ? comment : undefined } : ev
      )
    );
  };

  const handleRecordDecision = (newDecision: GovernanceDecision) => {
    setDecisions((prev) => [newDecision, ...prev]);

    // If decision is advancing stage, increment TRL of technology
    if (newDecision.decisionMade === 'Aprovado para Próximo Gate' && newDecision.technologyId) {
      setTechnologies((prev) =>
        prev.map((t) => {
          if (t.id === newDecision.technologyId) {
            const nextTrl = Math.min(9, t.trl + 1);
            return {
              ...t,
              trl: nextTrl,
              status: 'advancing',
              daysWithoutProgress: 0,
              multidimensionalReadiness: {
                ...t.multidimensionalReadiness,
                TRL: nextTrl,
              },
            };
          }
          return t;
        })
      );
    }
  };

  const handleRequestCollaboration = (tech: Technology, labName: string) => {
    console.log(`Solicitação de colaboração: ${tech.name} -> ${labName}`);
  };

  const handleOpenEvidenceForTech = (tech: Technology) => {
    setEvidenceTechDefault(tech);
    setIsNewEvidenceOpen(true);
  };

  const handleUpdateNetworkConfig = (updated: SaaSNetworkConfig) => {
    setCurrentNetwork(updated);
    setAllNetworks((prev) =>
      prev.map((n) => (n.networkId === updated.networkId ? updated : n))
    );
  };

  const blockedCount = technologies.filter((t) => t.status === 'blocked').length;

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Application Header */}
      <Header
        currentNetwork={currentNetwork}
        allNetworks={allNetworks}
        onSelectNetwork={setCurrentNetwork}
        governanceMode={governanceMode}
        onToggleGovernanceMode={setGovernanceMode}
        userRole={userRole}
        onChangeUserRole={setUserRole}
        onOpenAiCopilot={() => setIsCopilotOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenNewTech={() => setIsNewTechOpen(true)}
        onOpenNewEvidence={() => {
          setEvidenceTechDefault(null);
          setIsNewEvidenceOpen(true);
        }}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        blockedCount={blockedCount}
        pendingGateCount={3}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            technologies={technologies}
            governanceMode={governanceMode}
            onSelectTechnology={setSelectedTechnology}
            onNavigateToTab={setActiveTab}
            decisions={decisions}
            impact={impactMetrics}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView
            technologies={technologies}
            onSelectTechnology={setSelectedTechnology}
            onOpenNewTech={() => setIsNewTechOpen(true)}
          />
        )}

        {activeTab === 'heatmap' && (
          <HeatmapBottlenecksView
            technologies={technologies}
            onSelectTechnology={setSelectedTechnology}
          />
        )}

        {activeTab === 'competency' && (
          <CompetencyMatchingView
            competencies={competencies}
            technologies={technologies}
            onRequestCollaboration={handleRequestCollaboration}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceTraceabilityView
            evidences={evidences}
            technologies={technologies}
            onApproveEvidence={handleApproveEvidence}
            onOpenNewEvidence={() => {
              setEvidenceTechDefault(null);
              setIsNewEvidenceOpen(true);
            }}
          />
        )}

        {activeTab === 'validation' && (
          <ValidationStudiesView studies={validationStudies} />
        )}

        {activeTab === 'infrastructure' && (
          <InfrastructureServicesView
            equipments={sharedEquipments}
            services={technologicalServices}
            technologies={technologies}
          />
        )}

        {activeTab === 'allocation' && (
          <StrategicAllocationView
            technologies={technologies}
            decisions={decisions}
            onRecordDecision={handleRecordDecision}
          />
        )}

        {activeTab === 'impact' && (
          <NetworkImpactView impact={impactMetrics} technologies={technologies} />
        )}
      </main>

      {/* Footer with Anti-AI Slop & System Identity Compliance */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <strong>{currentNetwork.name} ({currentNetwork.acronym})</strong> · Plataforma SaaS de Gestão Translacional
          </div>
          <div className="flex items-center gap-3">
            <span>Instituição Âncora: {currentNetwork.anchorInstitution}</span>
            <span>·</span>
            <span>Estágios E1 a E6 · TRL 1 a 9 · Readiness Multidimensional</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Technology Detail Modal */}
      {selectedTechnology && (
        <TechnologyDetailModal
          technology={selectedTechnology}
          onClose={() => setSelectedTechnology(null)}
          evidences={evidences}
          competencies={competencies}
          onOpenNewEvidenceForTech={handleOpenEvidenceForTech}
          onRequestCollaboration={handleRequestCollaboration}
        />
      )}

      {/* 2. AI Copilot Strategic Modal */}
      <AiCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        technologies={technologies}
        competencies={competencies}
      />

      {/* 3. SaaS White-label Configuration Modal */}
      <SaaSConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={currentNetwork}
        onSaveConfig={handleUpdateNetworkConfig}
      />

      {/* 4. New Technology Modal */}
      <NewTechnologyModal
        isOpen={isNewTechOpen}
        onClose={() => setIsNewTechOpen(false)}
        onSaveTechnology={handleSaveNewTechnology}
      />

      {/* 5. New Evidence Modal */}
      <NewEvidenceModal
        isOpen={isNewEvidenceOpen}
        onClose={() => setIsNewEvidenceOpen(false)}
        technologies={technologies}
        selectedTechDefault={evidenceTechDefault}
        onSaveEvidence={handleSaveNewEvidence}
      />

    </div>
  );
}
