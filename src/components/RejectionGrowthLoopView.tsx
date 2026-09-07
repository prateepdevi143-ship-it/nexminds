import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
  ExternalLink,
  Award,
  Layers,
  FileCheck,
  Send,
  Zap,
  Target,
  RefreshCw,
  Clock,
  ShieldCheck,
  HelpCircle,
  X
} from 'lucide-react';
import { Application, RejectionSkillGap, ImprovementEvidenceRecord, StructuredRecruiterRatings } from '../types';
import { api } from '../services/api';

interface RejectionGrowthLoopViewProps {
  application: Application;
  onClose?: () => void;
  onReapplied?: () => void;
}

export const RejectionGrowthLoopView: React.FC<RejectionGrowthLoopViewProps> = ({
  application,
  onClose,
  onReapplied
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'submit-evidence' | 'timeline'>('overview');
  const [selectedGap, setSelectedGap] = useState<RejectionSkillGap | null>(
    application.aiAnalysis?.skillGaps?.[0] || null
  );

  // Evidence submission state
  const [evidenceType, setEvidenceType] = useState<string>('github_repo');
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceDetails, setEvidenceDetails] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [testScore, setTestScore] = useState<string>('88');
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [recentReassessment, setRecentReassessment] = useState<{
    skill: string;
    previousScore: number;
    newScore: number;
    scoreDelta: number;
    previousMatchScore: number;
    newMatchScore: number;
    notes: string;
    confidence: number;
  } | null>(null);

  // Re-apply state
  const [isReapplying, setIsReapplying] = useState(false);
  const [hasReapplied, setHasReapplied] = useState(application.status !== 'rejected');

  const gaps: RejectionSkillGap[] = application.aiAnalysis?.skillGaps || [];
  const ratings: StructuredRecruiterRatings | undefined = application.structuredRatings;
  const matchScore = application.matchScore || application.matchScoreAtApplication || 60;
  const initialMatch = application.matchScoreAtApplication || 60;

  // Preset fill for demo speed and delight
  const fillDemoEvidence = (type: 'dsa' | 'project') => {
    if (type === 'dsa') {
      const dsaGap = gaps.find(g => g.skill.toLowerCase().includes('problem') || g.skill.toLowerCase().includes('dsa')) || gaps[0];
      if (dsaGap) setSelectedGap(dsaGap);
      setEvidenceType('assessment');
      setEvidenceTitle('35 Solved DSA LeetCode Challenges & Benchmark Assessment');
      setEvidenceDetails('Completed 20 beginner array/string and 15 intermediate graph/DP challenges. Achieved 88% on timed algorithmic assessment.');
      setEvidenceUrl('https://leetcode.com/u/demo_candidate');
      setTestScore('88');
    } else {
      const projGap = gaps.find(g => g.skill.toLowerCase().includes('project') || g.skill.toLowerCase().includes('production')) || gaps[0];
      if (projGap) setSelectedGap(projGap);
      setEvidenceType('deployed_app');
      setEvidenceTitle('Full-Stack Distributed Analytics Cloud Service');
      setEvidenceDetails('Built and deployed a production containerized service on Cloud Run with PostgreSQL, Redis cache, JWT auth, and automated CI/CD.');
      setEvidenceUrl('https://github.com/candidate/production-cloud-service');
      setTestScore('92');
    }
  };

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGap) return;
    if (!evidenceTitle.trim()) {
      alert('Please provide an evidence title.');
      return;
    }

    setIsSubmittingEvidence(true);
    try {
      const res = await api.submitImprovementEvidence(application.id, {
        skill: selectedGap.skill,
        evidenceType,
        title: evidenceTitle,
        details: evidenceDetails,
        evidenceUrl,
        testScore: testScore ? Number(testScore) : undefined
      });

      setRecentReassessment({
        skill: selectedGap.skill,
        previousScore: res.previousScore,
        newScore: res.newScore,
        scoreDelta: res.scoreDelta,
        previousMatchScore: res.previousMatchScore,
        newMatchScore: res.newMatchScore,
        notes: res.reassessment?.aiReassessmentNotes || 'Skill competence verified.',
        confidence: Math.round((res.reassessment?.verifiedConfidence || 0.92) * 100)
      });

      // Update gap status locally
      selectedGap.status = 'BRIDGED';
      selectedGap.currentScore = res.newScore;
      selectedGap.currentLevel = `Verified (${res.newScore}%)`;

      setActiveTab('overview');
    } catch (err: any) {
      alert(err.message || 'Failed to submit evidence');
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const handleReapply = async () => {
    setIsReapplying(true);
    try {
      await api.reapplyToApplication(application.id);
      setHasReapplied(true);
      if (onReapplied) onReapplied();
    } catch (err: any) {
      alert(err.message || 'Failed to re-apply');
    } finally {
      setIsReapplying(false);
    }
  };

  const bridgedCount = gaps.filter(g => g.status === 'BRIDGED').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl max-w-4xl mx-auto text-slate-800">
      {/* Top Banner: Not an End, but an Intelligent Career Growth Loop */}
      <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Career Growth Loop: Rejection → Feedback → Skill Gap → Improvement</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {application.jobTitle}
            </h2>
            <p className="text-sm text-slate-300">
              {application.companyName} • Application outcome transformed into actionable career data
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 5-Step Process Pipeline Visualization */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { step: '1', title: 'HR Feedback', desc: 'Constructive input', done: true },
            { step: '2', title: 'Gap Analysis', desc: 'AI skill mapping', done: true },
            { step: '3', title: 'Action Plan', desc: 'Prioritized tasks', done: true },
            { step: '4', title: 'Reassessment', desc: 'Evidence proof', done: bridgedCount > 0 },
            { step: '5', title: 'Re-Apply', desc: 'Boosted match', done: hasReapplied }
          ].map((s) => (
            <div
              key={s.step}
              className={`p-2.5 rounded-xl border transition-all ${
                s.done
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-0.5">
                <span>Step {s.step}</span>
                {s.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3 h-3 text-slate-500" />}
              </div>
              <div className="font-semibold text-white">{s.title}</div>
              <div className="text-[10px] text-slate-300 opacity-80">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reassessment Congratulatory Banner (if just completed) */}
      <AnimatePresence>
        {recentReassessment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-50 border-b border-emerald-200 p-4 px-6 flex items-start gap-3"
          >
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1 text-xs">
              <div className="font-bold text-emerald-950 text-sm flex items-center justify-between">
                <span>Skill Reassessment Verified! Score Upgraded: {recentReassessment.skill}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[11px] font-bold">
                  {recentReassessment.confidence}% AI Confidence
                </span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                {recentReassessment.notes}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 font-semibold text-emerald-900">
                <span>Skill Rating: <strong className="text-slate-500 line-through mr-1">{recentReassessment.previousScore}%</strong> ➔ <strong className="text-emerald-700 text-sm">{recentReassessment.newScore}% (+{recentReassessment.scoreDelta} pts)</strong></span>
                <span>Job Match Score: <strong className="text-slate-500 line-through mr-1">{recentReassessment.previousMatchScore}%</strong> ➔ <strong className="text-emerald-700 text-sm">{recentReassessment.newMatchScore}%</strong></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex items-center gap-3 px-6 border-b border-slate-200 bg-slate-50/50 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-2 border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Skill Gaps & Action Plan ({gaps.length})
        </button>
        <button
          onClick={() => setActiveTab('submit-evidence')}
          className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'submit-evidence'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Submit Evidence & Reassess</span>
          {bridgedCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {bridgedCount} Bridged
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-3 px-2 border-b-2 transition-all ${
            activeTab === 'timeline'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Career Growth Timeline
        </button>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 1. Recruiter Feedback & AI Diagnosis Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Recruiter Feedback & Decision Context
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Evaluated on {application.feedbackAt ? new Date(application.feedbackAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>

              {/* Feedback Quote */}
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="text-indigo-600 font-bold">HR Hiring Team:</span>
                  <span className="text-slate-700 italic">
                    "{application.studentFeedback || 'Constructive feedback recorded for technical screening.'}"
                  </span>
                </div>
                {application.rejectionReason && (
                  <div className="text-[11px] text-slate-500">
                    Primary rejection factor: <span className="font-semibold text-slate-700">{application.rejectionReason}</span>
                  </div>
                )}
              </div>

              {/* Structured Competency Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Problem Solving</span>
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{ratings?.problemSolving || application.aiAnalysis?.problemSolvingLevel || 'Weak'}</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Project Depth</span>
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{ratings?.projectsQuality || application.aiAnalysis?.projectsLevel || 'Needs Improvement'}</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Communication</span>
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{ratings?.communication || application.aiAnalysis?.communicationLevel || 'Good'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Core Language</span>
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Good</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              {/* AI Constructive Explanation */}
              {application.aiAnalysis?.constructiveExplanation && (
                <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Career Coach Analysis:</span>
                  </div>
                  <p>{application.aiAnalysis.constructiveExplanation}</p>
                </div>
              )}
            </div>

            {/* 2. Prioritized Skill Gaps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Prioritized Skill Gaps to Bridge
                  </h3>
                  <p className="text-xs text-slate-500">
                    Targeted based on employer requirements & HR feedback
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  {bridgedCount} of {gaps.length} Gaps Bridged
                </div>
              </div>

              <div className="space-y-3">
                {gaps.map((gap, idx) => {
                  const isBridged = gap.status === 'BRIDGED';
                  return (
                    <div
                      key={gap.id || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isBridged
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : gap.priority === 'HIGH'
                          ? 'bg-white border-rose-200 shadow-xs'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              gap.priority === 'HIGH'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {gap.priority} PRIORITY
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">{gap.skill}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            Current: <strong>{gap.currentScore || 40}%</strong> ➔ Required: <strong>{gap.requiredScore || 80}%</strong>
                          </span>
                          {isBridged ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Bridged
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedGap(gap);
                                setActiveTab('submit-evidence');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Bridge Gap</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {gap.explanation}
                      </p>

                      {/* 5 Concrete Action Steps */}
                      {gap.recommendedActions && gap.recommendedActions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            Recommended Improvement Roadmap:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                            {gap.recommendedActions.map((action, aIdx) => (
                              <div
                                key={aIdx}
                                className="flex items-start gap-1.5 p-1.5 rounded-md bg-slate-50 border border-slate-100"
                              >
                                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {aIdx + 1}
                                </span>
                                <span className="leading-tight">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Recalculated Match & Re-Application Action */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                    Live Opportunity Match Recalculator
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {bridgedCount > 0 ? 'Re-Application Ready!' : 'Submit Evidence to Unlock Re-Application'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Unlike ordinary portals, improving verified skills directly upgrades your candidate score for this role.
                  </p>
                </div>

                {/* Match Comparison */}
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-300 block uppercase">Original Match</span>
                    <span className="text-lg font-bold text-slate-400">{initialMatch}%</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <div className="text-center">
                    <span className="text-[10px] text-emerald-300 block uppercase font-bold">Updated Match</span>
                    <span className="text-2xl font-black text-emerald-400">{matchScore}%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-300">
                  {hasReapplied ? (
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Application re-submitted with improved profile. Recruiter has been notified!
                    </span>
                  ) : bridgedCount > 0 ? (
                    <span>
                      You have bridged <strong>{bridgedCount}</strong> skill gap(s). Your match score is now <strong>{matchScore}%</strong>.
                    </span>
                  ) : (
                    <span>Complete learning tasks and submit proof to bridge your gaps.</span>
                  )}
                </div>

                {!hasReapplied && (
                  <button
                    type="button"
                    onClick={handleReapply}
                    disabled={isReapplying || bridgedCount === 0}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 ${
                      bridgedCount > 0
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>{isReapplying ? 'Submitting...' : 'Re-Apply With Upgraded Profile'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Evidence Submission & Reassessment Engine */}
        {activeTab === 'submit-evidence' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Evidence-Based Skill Reassessment
                </h3>
                <p className="text-xs text-slate-500">
                  Submit proof of completed work. AI evaluates authenticity and updates your verified skill scores.
                </p>
              </div>

              {/* Quick Demo Fill Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Quick Demo Preset:</span>
                <button
                  type="button"
                  onClick={() => fillDemoEvidence('dsa')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
                >
                  ⚡ LeetCode 35 DSA
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoEvidence('project')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                >
                  ⚡ Full-Stack Project
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitEvidence} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              {/* Skill Gap to Address */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">
                  Select Skill Gap to Reassess
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gaps.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGap(g)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        selectedGap?.id === g.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold">{g.skill}</div>
                      <div className={`text-[11px] mt-0.5 ${selectedGap?.id === g.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                        Current: {g.currentScore || 40}% • Target: {g.requiredScore || 80}% • Priority: {g.priority}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">Evidence Classification</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'assessment', label: 'Assessment / Coding Score', icon: Code2 },
                    { id: 'github_repo', label: 'GitHub Repository', icon: Layers },
                    { id: 'deployed_app', label: 'Live Deployed App', icon: ExternalLink },
                    { id: 'certification', label: 'Course / Certificate', icon: Award }
                  ].map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setEvidenceType(t.id)}
                        className={`p-2.5 rounded-xl font-semibold border flex items-center gap-2 transition-all ${
                          evidenceType === t.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evidence Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Evidence Title & Summary</label>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="e.g. 35 Solved DSA Challenges on LeetCode with Benchmark Score"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Details */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Demonstration Details</label>
                <textarea
                  rows={3}
                  value={evidenceDetails}
                  onChange={(e) => setEvidenceDetails(e.target.value)}
                  placeholder="Describe your solution architecture, solved challenge topics (Arrays, HashMaps, Two-Pointers), or production features implemented..."
                  className="w-full p-3 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* URL and Optional Score */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-800 block">Verifiable Proof Link (URL)</label>
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="https://github.com/username/project or https://leetcode.com/u/handle"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Score / Percentile (if any)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={testScore}
                    onChange={(e) => setTestScore(e.target.value)}
                    placeholder="85"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="submit"
                  disabled={isSubmittingEvidence || !selectedGap}
                  className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isSubmittingEvidence ? 'Evaluating Evidence with AI...' : 'Submit Evidence & Run AI Reassessment'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Career Growth Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Career Transformation Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Demonstrates how application feedback transformed into verified capability upgrades.
              </p>
            </div>

            <div className="relative pl-6 border-l-2 border-indigo-200 space-y-5 text-xs">
              {/* Event 1: Application Rejection & Feedback */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-rose-500 border-2 border-white ring-2 ring-rose-200" />
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">Application Outcome & HR Feedback</span>
                    <span className="text-slate-400 text-[10px]">
                      {application.feedbackAt ? new Date(application.feedbackAt).toLocaleDateString() : 'Phase 1'}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    "{application.studentFeedback || 'Constructive feedback received.'}"
                  </p>
                </div>
              </div>

              {/* Event 2: AI Skill Gap Prioritization */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white ring-2 ring-indigo-200" />
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900">AI Gap Mapping & Action Roadmap Generated</span>
                    <span className="text-slate-400 text-[10px]">Phase 2</span>
                  </div>
                  <p className="text-slate-600">
                    Identified {gaps.length} critical gaps: {gaps.map(g => `${g.skill} (${g.priority})`).join(', ')}.
                  </p>
                </div>
              </div>

              {/* Event 3: Bridged Gaps & Evidence */}
              {bridgedCount > 0 && (
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200" />
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950">Verified Evidence Submitted & AI Reassessed</span>
                      <span className="text-emerald-700 text-[10px] font-bold">Phase 3</span>
                    </div>
                    <p className="text-emerald-800">
                      Successfully bridged {bridgedCount} gap(s). Skill competencies elevated to verified benchmarks.
                    </p>
                  </div>
                </div>
              )}

              {/* Event 4: Re-application */}
              {hasReapplied && (
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-300" />
                  <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950">Re-Application Submitted to {application.companyName} 🚀</span>
                      <span className="text-emerald-800 text-[10px] font-bold">Active</span>
                    </div>
                    <p className="text-emerald-900 font-medium">
                      Candidate match score upgraded from {initialMatch}% to {matchScore}%. Advanced back to active recruiter review.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
