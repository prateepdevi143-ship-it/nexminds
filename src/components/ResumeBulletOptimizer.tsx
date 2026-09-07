import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Info,
  Sliders,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeBulletOptimization } from '../types';
import { api } from '../services/api';

interface ResumeBulletOptimizerProps {
  defaultRole?: string;
}

const ACTION_VERBS = [
  'Architected',
  'Engineered',
  'Benchmarked',
  'Optimized',
  'Fine-Tuned',
  'Deployed',
  'Containerized',
  'Automated',
  'Streamlined'
];

const SAMPLE_BULLETS = [
  {
    label: 'ML Pipeline',
    text: 'Made a machine learning project for classifying text documents with pytorch'
  },
  {
    label: 'Backend API',
    text: 'Built backend rest apis with python and postgresql for user management'
  },
  {
    label: 'Frontend Speed',
    text: 'Improved web app performance by lazy loading and caching data'
  }
];

export const ResumeBulletOptimizer: React.FC<ResumeBulletOptimizerProps> = ({
  defaultRole = 'AI / Software Engineer'
}) => {
  const [bulletText, setBulletText] = useState('');
  const [targetRole, setTargetRole] = useState(defaultRole);
  const [isLoading, setIsLoading] = useState(false);
  const [optimization, setOptimization] = useState<ResumeBulletOptimization | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!bulletText.trim()) {
      setErrorMsg('Please enter a bullet point or select an example above.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.optimizeResumeBullet(bulletText.trim(), targetRole);
      setOptimization(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to optimize bullet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!optimization?.optimized) return;
    navigator.clipboard.writeText(optimization.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertVerb = (verb: string) => {
    if (!bulletText) {
      setBulletText(`${verb} `);
    } else {
      setBulletText(`${verb} ${bulletText.replace(/^\w+\s+/, '')}`);
    }
  };

  return (
    <div id="resume-bullet-optimizer" className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
      {/* Header & Formula Explanation */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Resume Bullet Optimizer
          </h3>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            Action + Task + Tech + Outcome
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Convert basic descriptions into high-impact, ATS-optimized accomplishment statements using proven engineering formulas.
        </p>
      </div>

      {/* Formula Pills Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px]">
        <div className="space-y-0.5">
          <span className="font-bold text-indigo-600 block">1. Action Verb</span>
          <span className="text-slate-500 text-[10px]">Engineered, Architected</span>
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-blue-600 block">2. Task & Scope</span>
          <span className="text-slate-500 text-[10px]">Inference microservice</span>
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-purple-600 block">3. Technology</span>
          <span className="text-slate-500 text-[10px]">PyTorch, Docker, FastAPI</span>
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-emerald-600 block">4. Quantifiable Metric</span>
          <span className="text-slate-500 text-[10px]">-35% latency, 10k req/s</span>
        </div>
      </div>

      {/* Sample Quick-Pick Buttons */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span>Try quick example:</span>
          <div className="flex items-center gap-1.5">
            {SAMPLE_BULLETS.map(sample => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setBulletText(sample.text);
                  setErrorMsg(null);
                }}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-2">
        <textarea
          id="bullet-optimizer-input"
          rows={3}
          value={bulletText}
          onChange={(e) => setBulletText(e.target.value)}
          placeholder="Paste an existing resume bullet point or rough description..."
          className="w-full rounded-lg bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 text-xs text-slate-800 resize-none font-sans"
        />

        {/* Action Verb Quick Inserters */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] text-slate-400 mr-1">Prepend verb:</span>
          {ACTION_VERBS.slice(0, 6).map(verb => (
            <button
              key={verb}
              type="button"
              onClick={() => handleInsertVerb(verb)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
            >
              +{verb}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Submit Button */}
      <button
        id="btn-optimize-bullet"
        onClick={handleOptimize}
        disabled={isLoading || !bulletText.trim()}
        className="w-full py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Formulating High-Impact Bullet...</span>
          </>
        ) : (
          <>
            <Zap className="w-3.5 h-3.5 text-indigo-200" />
            <span>Transform into High-Impact Bullet</span>
          </>
        )}
      </button>

      {/* Optimization Result Display */}
      <AnimatePresence>
        {optimization && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-4 border-t border-slate-100 space-y-3.5"
          >
            <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Optimized Bullet (Ready for Resume)
                </span>
                <button
                  id="btn-copy-optimized-bullet"
                  onClick={handleCopy}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Bullet</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded border border-emerald-100/60 font-sans">
                • {optimization.optimized}
              </p>
            </div>

            {/* Formula Breakdown Breakdown Badges */}
            {optimization.formulaBreakdown && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Formula Component Breakdown:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 block">Action</span>
                    <span className="text-slate-800 font-medium text-xs">{optimization.formulaBreakdown.action}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-blue-600 block">Task / Scope</span>
                    <span className="text-slate-800 font-medium text-xs">{optimization.formulaBreakdown.task}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-purple-600 block">Technology Stack</span>
                    <span className="text-slate-800 font-medium text-xs">{optimization.formulaBreakdown.technology}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 block">Quantified Outcome</span>
                    <span className="text-slate-800 font-medium text-xs">{optimization.formulaBreakdown.outcome}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Improvements checklist */}
            {optimization.improvements?.length > 0 && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Key Enhancements Applied:
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {optimization.improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-800">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Truthfulness Guideline:</strong> Only include metrics and technologies that you can truthfully demonstrate in code reviews and technical interviews.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
