import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client if API key exists
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Copilot Endpoint for Translational Network
app.post('/api/copilot/query', async (req, res) => {
  try {
    const { query, networkContext, promptType } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const systemInstruction = `
Você é o Copiloto de Inteligência Estratégica da Plataforma de Gestão de Redes de Inovação Translacional (SaaS White-Label para INCTs, ICTs, DeepTechs, Consórcios).
Sua missão é auxiliar coordenadores, comitês gestores e pesquisadores a analisar o portfólio translacional, identificar gargalos, planejar próximos gates e cruzar competências da rede.

PRINCÍPIOS E REGRAS RÍGIDAS DE ATUAÇÃO:
1. NUNCA aprove automaticamente TRL, Gates, evidências de laboratório, investimentos financeiros ou decisões regulatórias. Deixe claro que a decisão formal compete exclusivamente ao Comitê Gestor e à governança humana.
2. SEMPRE apresente e cite a origem dos dados utilizados (IDs de tecnologia, nomes de laboratórios, instituições, evidências registradas).
3. Entenda a lógica translacional rigorosa:
   - TRL (1 a 9) e Estágios Translacionais E1 a E6 (E1: Desenv./Caracterização, E2: Avaliação Biológica, E3: Eficácia, E4: Pré-clínico e Regulatório, E5: Validação/Registro, E6: Produção/Transferência).
   - Dimensões Multidimensionais: TRL (1-9), PRL, MRL, RRL, QRL, VRL, CRL, IPRL, Partnership, FRL (escala 0-5).
   - Cadeia de Evidência: Requisito -> Experimento -> Resultado -> Evidência -> Gate -> Delta Readiness.
4. Responda em português claro, profissional, analítico e objetivo, estruturado com tópicos, tabelas ou listas quando relevante.
    `;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `
CONTEXTO ATUAL DA REDE E PORTFÓLIO:
${JSON.stringify(networkContext || {}, null, 2)}

PERGUNTA DO USUÁRIO:
"${query}"

${promptType ? `TIPO DE ANÁLISE: ${promptType}` : ''}

Por favor, forneça uma análise fundamentada, citando as tecnologias, laboratórios e métricas envolvidas.`,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });

        return res.json({
          answer: response.text,
          model: 'gemini-3.8-flash',
          citedDataOrigin: 'Dados em tempo real do portfólio da rede ativa',
        });
      } catch (geminiError: any) {
        console.error('Error in Gemini API call, falling back to algorithmic analyzer:', geminiError);
      }
    }

    // Algorithmic fallback if Gemini API key is not present or failed
    const fallbackAnswer = generateAlgorithmicAnalysis(query, networkContext);
    return res.json({
      answer: fallbackAnswer,
      model: 'deterministic-copilot-engine',
      citedDataOrigin: 'Base de dados consolidada do portfólio',
    });
  } catch (error: any) {
    console.error('Copilot query error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Smart deterministic analyzer fallback
function generateAlgorithmicAnalysis(query: string, context: any): string {
  const q = query.toLowerCase();
  const techs = context?.technologies || [];
  const labs = context?.laboratories || [];

  if (q.includes('regulatór') || q.includes('rrl') || q.includes('bloqueada')) {
    const regulatoryBlocked = techs.filter((t: any) => 
      t.primaryBottleneck === 'Regulatório' || 
      (t.multidimensionalReadiness?.RRL !== undefined && t.multidimensionalReadiness.RRL < 3 && t.trl >= 4)
    );
    return `### Análise de Gargalos Regulatórios (Origem: Base de Portfólio)\n\nForam identificadas **${regulatoryBlocked.length} tecnologia(s)** com restrições ou bloqueios no eixo Regulatório (RRL < 3 ou gargalo primário declarado):\n\n` +
      regulatoryBlocked.map((t: any) => `• **[${t.code}] ${t.name}** (TRL ${t.trl}, Estágio ${t.stage}): RRL atual é ${t.multidimensionalReadiness?.RRL}/5. Próximo milestone: *${t.nextMilestone}*. Depende de adequação ao marco normativo da ANVISA e estudos de toxicologia em conformidade BPL.`).join('\n') +
      `\n\n**Recomendação do Copiloto:** Mobilizar o Comitê Técnico Regulatório e acionar laboratórios com certificação GLP/BPL da rede para acelerar os ensaios de conformidade. *Nota: Reclassificações de RRL dependem de deliberação do Comitê Gestor.*`;
  }

  if (q.includes('validação externa') || q.includes('interlaboratorial') || q.includes('vrl')) {
    const needValidation = techs.filter((t: any) => 
      t.multidimensionalReadiness?.VRL <= 2 || t.stage === 'E4' || t.stage === 'E5'
    );
    return `### Tecnologias com Demanda de Validação Externa / Interlaboratorial\n\nIdentificamos **${needValidation.length} projeto(s)** em fase crítica de validação:\n\n` +
      needValidation.map((t: any) => `• **[${t.code}] ${t.name}** (TRL ${t.trl}, VRL ${t.multidimensionalReadiness?.VRL}/5): Necessita de ensaio em ambiente multicêntrico/interlaboratorial para atingir VRL 4+. Instituição líder: ${t.leadInstitution}.`).join('\n') +
      `\n\n**Origem dos dados:** Módulo de Validação Multi-Institucional e Matriz de Readiness.`;
  }

  if (q.includes('competência') || q.includes('laboratório') || q.includes('microscopia') || q.includes('análise')) {
    return `### Mapeamento de Competências e Infraestruturas da Rede\n\nA rede possui **${labs.length || 8} laboratórios credenciados** cobrindo os estágios E1 a E6.\n\nPara ensaios analíticos e caracterização físico-química e biológica:\n• **Lab. de Caracterização Avançada (LCA)**: Microscopia Eletrônica de Varredura (MEV-FEG), Difração de Raios-X (DRX), TRL 1-7.\n• **Lab. de Ensaios Pré-Clínicos e Biocompatibilidade (LEP)**: Cultura celular 2D/3D, citotoxicidade ISO 10993, modelos animais.\n• **Unidade de Escalonamento e Bioprocessos**: Biorreatores piloto, validação de lotes, BPF/GMP.\n\n**Sugestão:** Acesse a aba **"Matching de Competências"** para submeter formalmente uma Ordem de Serviço ou Solicitação de Colaboração.`;
  }

  if (q.includes('12 meses') || q.includes('sem avanço') || q.includes('tempo')) {
    const stalled = techs.filter((t: any) => t.daysWithoutProgress > 180);
    return `### Tecnologias com Alerta de Estagnação (> 180 dias sem avanço de TRL)\n\n` +
      stalled.map((t: any) => `• **[${t.code}] ${t.name}**: ${t.daysWithoutProgress} dias sem avanço de TRL/Gate. Principal gargalo: **${t.primaryBottleneck}**. Funding gap estimado: R$ ${t.fundingGap?.toLocaleString('pt-BR') || '0'}.`).join('\n') +
      `\n\n**Ação recomendada para Governança Estratégica:** Pautar na próxima reunião do Comitê Gestor para reavaliação de plano de desenvolvimento ou aporte de recursos via Alocação Estratégica.`;
  }

  // Generic summary
  return `### Síntese Executiva do Portfólio Translacional\n\n` +
    `• **Total de Tecnologias:** ${techs.length}\n` +
    `• **Distribuição por Estágio:** E1 (${techs.filter((t: any) => t.stage === 'E1').length}), E2 (${techs.filter((t: any) => t.stage === 'E2').length}), E3 (${techs.filter((t: any) => t.stage === 'E3').length}), E4 (${techs.filter((t: any) => t.stage === 'E4').length}), E5 (${techs.filter((t: any) => t.stage === 'E5').length}), E6 (${techs.filter((t: any) => t.stage === 'E6').length})\n` +
    `• **TRL Médio da Rede:** ${(techs.reduce((acc: number, t: any) => acc + (t.trl || 0), 0) / (techs.length || 1)).toFixed(1)}\n` +
    `• **Gargalos Mais Recorrentes:** Regulatório (RRL), Validação Interlaboratorial (VRL) e Financiamento (Funding Gap).\n\n` +
    `Utilize as abas do painel para explorar a matriz Heatmap, a linha do tempo (Journey) e a cadeia de Evidências.`;
}

// Development or production serving
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Translational Platform server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(console.error);
