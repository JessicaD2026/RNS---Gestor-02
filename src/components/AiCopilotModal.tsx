import React, { useState } from 'react';
import { Technology, Competency } from '../types';
import {
  Sparkles,
  X,
  Send,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  Bot,
  User,
  ArrowRight
} from 'lucide-react';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  technologies: Technology[];
  competencies: Competency[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sourceContext?: string[];
}

const PRESET_QUESTIONS = [
  'Quais tecnologias estão travadas no mesmo estágio há mais de 180 dias e qual o motivo?',
  'Quais tecnologias dependem do mesmo laboratório para avançar?',
  'Qual é o principal gargalo estrutural da rede neste momento?',
  'Quais tecnologias têm maior maturidade para transferência tecnológica ao setor produtivo?',
  'Onde um investimento de R$ 300.000 geraria o maior avanço de TRL e superação de gargalos?',
];

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  technologies,
  competencies,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou o Copiloto de Inteligência Estratégica da Rede. Analiso o portfólio tecnológico, maturidade multidimensional, evidências, infraestrutura e competências para fornecer diagnósticos orientados à decisão humana. Como posso apoiar a governança hoje?',
      timestamp: 'Agora',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          technologies,
          competencies,
        }),
      });

      const data = await response.json();

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.answer || 'Não foi possível gerar a resposta no momento.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceContext: data.sources || ['Portfólio Tecnológico da Rede', 'Matriz de Competências'],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Desculpe, ocorreu uma instabilidade na consulta. Por favor, repita ou selecione uma das perguntas pré-definidas.',
          timestamp: 'Agora',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Copiloto de Inteligência Estratégica da Rede
              </h2>
              <p className="text-[11px] text-slate-500">
                Diagnóstico preditivo, matching e priorização para governança humana
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ethical Governance Notice */}
        <div className="bg-amber-50/70 border-b border-amber-200/60 px-5 py-2 text-[11px] text-amber-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Governança com Supervisão Humana:</strong> A IA apoia com cruzamento de dados e diagnósticos, mas não aprova TRLs, Gates ou alocações de forma autônoma.
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-lg p-3.5 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100/90 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {m.sourceContext && m.sourceContext.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-600">Fontes Auditadas:</span> {m.sourceContext.join(' · ')}
                  </div>
                )}

                <div className={`text-[10px] mt-1 ${m.role === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                  {m.timestamp}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center text-slate-500 text-xs py-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              </div>
              <span className="italic">Cruzando dados translacionais, gaps e competências da rede...</span>
            </div>
          )}
        </div>

        {/* Preset Questions Chips */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 overflow-x-auto scrollbar-none flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 font-medium shrink-0">Consultas Rápidas:</span>
          {PRESET_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:border-slate-400 text-slate-700 whitespace-nowrap hover:text-slate-900 transition-colors shrink-0"
            >
              {q.length > 45 ? `${q.slice(0, 45)}...` : q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ex: Qual tecnologia tem maior potencial para atrair investimento privado este ano?"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || loading}
            className="p-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
