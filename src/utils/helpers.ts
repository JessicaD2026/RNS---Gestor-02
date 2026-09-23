import { MultidimensionalReadiness, TranslationalStage, Technology, Competency, CompetencyMatchResult } from '../types';

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getStageBadgeColor(stage: TranslationalStage): { bg: string; text: string; border: string } {
  switch (stage) {
    case 'E1':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'E2':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
    case 'E3':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'E4':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'E5':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'E6':
      return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export function getReadinessColor(score: number, isTRL: boolean = false): { bg: string; text: string } {
  if (isTRL) {
    if (score >= 7) return { bg: 'bg-emerald-600', text: 'text-white' };
    if (score >= 5) return { bg: 'bg-emerald-500', text: 'text-white' };
    if (score >= 4) return { bg: 'bg-amber-500', text: 'text-white' };
    if (score >= 3) return { bg: 'bg-amber-400', text: 'text-slate-900' };
    return { bg: 'bg-slate-200', text: 'text-slate-700' };
  }

  // 0 to 5 scale
  switch (score) {
    case 5:
      return { bg: 'bg-emerald-600', text: 'text-white' };
    case 4:
      return { bg: 'bg-emerald-400', text: 'text-slate-900' };
    case 3:
      return { bg: 'bg-amber-400', text: 'text-slate-900' };
    case 2:
      return { bg: 'bg-amber-200', text: 'text-amber-900' };
    case 1:
      return { bg: 'bg-slate-200', text: 'text-slate-700' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-400' };
  }
}

export function getReadinessLabel(score: number): string {
  switch (score) {
    case 0:
      return '0 - Não avaliado';
    case 1:
      return '1 - Conceitual';
    case 2:
      return '2 - Planejado';
    case 3:
      return '3 - Demonstrado';
    case 4:
      return '4 - Validado';
    case 5:
      return '5 - Operacional';
    default:
      return `${score}`;
  }
}

export function computeCompetencyMatches(
  technology: Technology,
  competencies: Competency[]
): CompetencyMatchResult[] {
  const matches: CompetencyMatchResult[] = [];

  const neededTerms = [
    technology.primaryBottleneck.toLowerCase(),
    technology.bottleneckDetail.toLowerCase(),
    technology.techClass.toLowerCase(),
    technology.applicationArea.toLowerCase(),
  ];

  for (const comp of competencies) {
    let techniqueCoverage = 30;
    let infrastructureFit = false;
    let certificationFit = false;
    let stageFit = comp.stagesSupported.includes(technology.stage);
    let availabilityScore = comp.availability === 'Imediata' ? 95 : comp.availability.includes('Moderada') ? 70 : 40;

    const compText = `${comp.name} ${comp.technique} ${comp.methodology} ${comp.category} ${comp.equipments.join(' ')} ${comp.certifications.join(' ')}`.toLowerCase();

    // Check technique coverage
    if (neededTerms.some(t => compText.includes(t))) {
      techniqueCoverage += 45;
    }
    if (compText.includes('bpl') || compText.includes('glp') || compText.includes('17025') || compText.includes('anvisa')) {
      certificationFit = true;
      techniqueCoverage += 15;
    }
    if (comp.equipments.length > 2) {
      infrastructureFit = true;
    }

    techniqueCoverage = Math.min(100, techniqueCoverage);

    // Weighted composite match
    const compositeScore = Math.round(
      techniqueCoverage * 0.45 +
      (infrastructureFit ? 20 : 5) +
      (certificationFit ? 15 : 0) +
      (stageFit ? 15 : 5) +
      (availabilityScore * 0.05)
    );

    let matchLevel: 'Alto' | 'Médio' | 'Baixo' = 'Baixo';
    if (compositeScore >= 75) matchLevel = 'Alto';
    else if (compositeScore >= 55) matchLevel = 'Médio';

    let explanation = `O laboratório ${comp.labName} atende à técnica requerida (${comp.technique}) com equipe experiente (${comp.experienceYears} anos).`;
    if (certificationFit) {
      explanation += ` Possui certificações formais alinhadas: ${comp.certifications.join(', ')}.`;
    }
    if (stageFit) {
      explanation += ` Já possui histórico de atuação no estágio ${technology.stage}.`;
    }

    matches.push({
      technologyId: technology.id,
      gapIdentified: technology.bottleneckDetail,
      requiredCompetency: comp.name,
      matchedLabId: comp.labId,
      matchedLabName: comp.labName,
      institutionName: comp.institutionName,
      matchScore: compositeScore,
      matchLevel,
      criteriaBreakdown: {
        techniqueCoverage,
        infrastructureFit,
        certificationFit,
        stageFit,
        availabilityScore,
      },
      explanation,
      recommendedAction: compositeScore >= 75
        ? 'Emitir Termo de Cooperação / Solicitação de Ensaio Prioritário'
        : 'Agendar reunião técnica de alinhamento com coordenador do laboratório',
    });
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
