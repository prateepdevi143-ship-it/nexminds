import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { Student } from '../types';
import { api } from '../services/api';

interface AIChatAssistantProps {
  student: Student;
  onSelectTab: (tab: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  student,
  onSelectTab
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${student?.name || 'there'}! I am your Career Advisor. I have context on your target career (${student?.careerGoal || 'AI Engineer'}), your ${(student?.skills || []).length} verified skills, and active applications. What would you like to discuss today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newMsgs: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const reply = await api.sendChatMessage(newMsgs);
      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue retrieving guidance. Please try again or rephrase your question.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I maximize my chance of getting hired at Vertex AI Labs?',
    'What single skill should I prioritize learning this week?',
    'How should I prepare for a Machine Learning technical interview?'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Career Assistant
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Ask questions about job matches, interview preparation, or skill prioritization.
        </p>
      </div>

      {/* Chat Container */}
      <div className="rounded-xl bg-white border border-slate-200 flex flex-col h-[540px] overflow-hidden shadow-xs">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-xl p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-slate-900 text-white font-normal rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                }`}
              >
                {m.content}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Formulating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="px-5 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50 px-2.5 py-1 rounded-md border border-slate-200 whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
        >
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about opportunities, interview prep, or skills..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
