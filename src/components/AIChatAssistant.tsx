import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Copy,
  Check,
  Zap,
  BrainCircuit,
  Compass,
  FileCheck2,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from '../types';
import { api } from '../services/api';

interface AIChatAssistantProps {
  student: Student;
  onSelectTab: (tab: string) => void;
}

type TaskMode = 'general' | 'fast' | 'complex';
type RoleType = 'advisor' | 'fast' | 'interviewer' | 'resume_coach' | 'skill_gps';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  mode?: TaskMode;
}

interface CopilotRoleOption {
  id: RoleType;
  label: string;
  taskMode: TaskMode;
  modelBadge: string;
  modelDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  tagline: string;
  welcomeMessage: string;
  samplePrompts: string[];
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  student,
  onSelectTab
}) => {
  const roleOptions: CopilotRoleOption[] = [
    {
      id: 'advisor',
      label: 'Career Advisor',
      taskMode: 'general',
      modelBadge: 'gemini-3.5-flash',
      modelDescription: 'Strategic Career Optimization',
      icon: Compass,
      accentColor: 'indigo',
      tagline: '24/7 Strategic career navigator',
      welcomeMessage: `Hello ${student?.name || 'there'}! I am your AI Career Advisor powered by Gemini 3.5 Flash. I have full context on your target career (${student?.careerGoal || 'AI Engineer'}), your ${(student?.skills || []).length} verified skills, and active readiness score (${student?.careerReadinessScore || 78}/100). How can I guide your job strategy today?`,
      samplePrompts: [
        'How do I maximize my chance of getting hired at Vertex AI Labs?',
        'What single skill will unlock the most openings for me?',
        'How do I raise my career readiness score above 90%?'
      ]
    },
    {
      id: 'fast',
      label: 'Fast Q&A & Pitch',
      taskMode: 'fast',
      modelBadge: 'gemini-3.1-flash-lite',
      modelDescription: 'Sub-second Instant Responses',
      icon: Zap,
      accentColor: 'amber',
      tagline: 'High-speed answers & elevator pitches',
      welcomeMessage: `Hi ${student?.name || 'there'}! Quick Q&A mode is active with Gemini 3.1 Flash-Lite for sub-second responses. Ask quick interview questions, salary ranges, or request instant elevator pitch feedback!`,
      samplePrompts: [
        'Give me a 30-second elevator pitch for an AI Engineer role',
        'What are 3 hard questions to ask an engineering recruiter?',
        'Summarize the difference between PyTorch DDP and FSDP in 2 sentences'
      ]
    },
    {
      id: 'interviewer',
      label: 'Technical Mock Interview',
      taskMode: 'complex',
      modelBadge: 'gemini-3.1-pro-preview',
      modelDescription: 'Deep Technical & Algorithmic Reasoning',
      icon: BrainCircuit,
      accentColor: 'purple',
      tagline: 'Rigorous interactive technical interviewer',
      welcomeMessage: `Welcome to the Technical Mock Interview simulator powered by Gemini 3.1 Pro Preview. I will conduct a realistic technical assessment for ${student?.careerGoal || 'AI Engineer'}, evaluate your solutions, and probe edge cases. Ready to begin? Reply "Start interview" or specify a topic (System Design, Algorithms, or ML Ops).`,
      samplePrompts: [
        'Start technical mock interview for Machine Learning Engineer',
        'Ask me a tough system design question about real-time search',
        'Test my knowledge on Python concurrency and memory management'
      ]
    },
    {
      id: 'resume_coach',
      label: 'ATS Resume Coach',
      taskMode: 'general',
      modelBadge: 'gemini-3.5-flash',
      modelDescription: 'Action Verb & Metric Bullet Optimizer',
      icon: FileCheck2,
      accentColor: 'emerald',
      tagline: 'Keyword density & bullet point refiner',
      welcomeMessage: `Hello! I am your ATS Resume Coach. Paste any bullet point from your resume, and I will rewrite it using the high-impact formula: [Action Verb] + [Specific Problem/Scope] + [Tech Stack] + [Quantifiable Metric].`,
      samplePrompts: [
        'Rewrite this bullet: "Built an AI app with Python and Flask"',
        'What keywords are missing from my profile for an AI Engineer?',
        'How can I highlight my hackathon project effectively?'
      ]
    }
  ];

  const [activeRole, setActiveRole] = useState<CopilotRoleOption>(roleOptions[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: roleOptions[0].welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: roleOptions[0].modelBadge,
      mode: roleOptions[0].taskMode
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSwitchRole = (newRole: CopilotRoleOption) => {
    setActiveRole(newRole);
    setMessages(prev => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        role: 'assistant',
        content: newRole.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: newRole.modelBadge,
        mode: newRole.taskMode
      }
    ]);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `fresh-${Date.now()}`,
        role: 'assistant',
        content: activeRole.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: activeRole.modelBadge,
        mode: activeRole.taskMode
      }
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMsgs = [...messages, userMessage];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Format multi-turn conversation array for API
      const historyPayload = newMsgs.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.sendChatMessage(historyPayload, {
        taskMode: activeRole.taskMode,
        roleType: activeRole.id
      });

      const assistantMessage: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: res.modelUsed || activeRole.modelBadge,
        mode: activeRole.taskMode
      };

      setMessages([...newMsgs, assistantMessage]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'I encountered an issue generating advice. Please check your connection or try rephrasing.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'Fallback Engine'
        }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header & Role Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  AI Copilot & Advisor
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                  Gemini Multi-Turn Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Multi-turn career intelligence grounded in your verified skills, readiness score, and target vacancies.
              </p>
            </div>
          </div>

          {/* Profile Status Badge */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 px-3 py-2 rounded-xl text-xs shrink-0">
            <div className="text-right">
              <div className="font-semibold text-slate-800">{student?.name || 'Candidate'}</div>
              <div className="text-[11px] text-slate-500">
                Target: <span className="font-medium text-indigo-600">{student?.careerGoal || 'AI Engineer'}</span>
              </div>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div className="text-center px-1">
              <div className="text-sm font-bold text-indigo-600">{student?.careerReadinessScore || 78}%</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Readiness</div>
            </div>
          </div>
        </div>

        {/* Mode & Persona Selector Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Copilot Role:
          </span>
          {roleOptions.map(role => {
            const Icon = role.icon;
            const isSelected = activeRole.id === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleSwitchRole(role)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{role.label}</span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected
                      ? 'bg-slate-800 text-indigo-300'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {role.modelBadge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Thread Container */}
      <div className="rounded-2xl bg-white border border-slate-200/80 flex flex-col h-[580px] overflow-hidden shadow-xs">
        {/* Chat Thread Header Bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">{activeRole.label}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">{activeRole.modelDescription}</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100">
              {activeRole.modelBadge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 border border-transparent hover:border-rose-100"
              title="Clear conversation history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Thread</span>
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl text-xs sm:text-sm leading-relaxed p-4 shadow-xs relative group ${
                  m.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none font-normal'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                }`}
              >
                {/* Content Rendering */}
                <div className="whitespace-pre-line space-y-2">
                  {m.content}
                </div>

                {/* Footer Meta & Copy */}
                <div
                  className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10.5px] ${
                    m.role === 'user'
                      ? 'border-slate-800 text-slate-400'
                      : 'border-slate-200/70 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{m.timestamp}</span>
                    {m.modelUsed && (
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-200/60 text-slate-600">
                        {m.modelUsed}
                      </span>
                    )}
                  </div>

                  {m.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(m.content, m.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-indigo-600 transition-opacity flex items-center gap-1 text-[11px]"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-3">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <div className="space-y-0.5">
                  <p className="font-medium text-slate-800">
                    {activeRole.taskMode === 'complex'
                      ? 'Gemini 3.1 Pro is performing deep technical reasoning...'
                      : activeRole.taskMode === 'fast'
                        ? 'Gemini 3.1 Flash-Lite is generating instant answer...'
                        : 'Gemini 3.5 Flash is analyzing your candidate context...'}
                  </p>
                  <p className="text-[10px] text-slate-400">Grounded in your verified skill graph & target vacancies</p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Suggested:
          </span>
          {activeRole.samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="text-[11px] font-medium text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50/60 px-3 py-1.5 rounded-lg border border-slate-200/80 hover:border-indigo-200 whitespace-nowrap transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
            >
              <span>{p}</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>

        {/* Interactive Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-slate-100 bg-white flex items-center gap-2.5"
        >
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={
              activeRole.taskMode === 'complex'
                ? 'Ask an advanced technical question or type "Start interview"...'
                : activeRole.taskMode === 'fast'
                  ? 'Ask a quick question for instant response...'
                  : 'Ask about career strategy, job match optimization, or skill priority...'
            }
            className="flex-1 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-medium text-xs sm:text-sm transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Action Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onSelectTab('skills-gap')}
          className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
            <span>Skill Gap Engine</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-[11px] text-slate-500">
            See your high-ROI missing skills and One-Skill-Away simulator.
          </p>
        </button>

        <button
          onClick={() => onSelectTab('resume')}
          className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
            <span>Resume ATS Audit</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-[11px] text-slate-500">
            Upload updated PDF and run 9-factor ATS scoring breakdown.
          </p>
        </button>

        <button
          onClick={() => onSelectTab('assessments')}
          className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
            <span>Proctored Assessments</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-[11px] text-slate-500">
            Take verified tests to raise your skill confidence to 0.95.
          </p>
        </button>
      </div>
    </div>
  );
};
