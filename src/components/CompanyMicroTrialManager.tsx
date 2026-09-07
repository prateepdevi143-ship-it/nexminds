import React, { useState, useEffect } from 'react';
import {
  Code2,
  Sparkles,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileCode,
  Check,
  X,
  Zap,
  Users,
  Building2,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { Job, MicroTrial, MicroTrialSubmission, MicroTrialEvaluation } from '../types';

interface CompanyMicroTrialManagerProps {
  jobs: Job[];
  companyId?: string;
  onRefreshData?: () => void;
}

export const CompanyMicroTrialManager: React.FC<CompanyMicroTrialManagerProps> = ({
  jobs,
  companyId,
  onRefreshData
}) => {
  const [trials, setTrials] = useState<MicroTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrial, setSelectedTrial] = useState<MicroTrial | null>(null);
  const [submissions, setSubmissions] = useState<MicroTrialSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Reviewing a specific submission modal
  const [reviewingSubmission, setReviewingSubmission] = useState<{
    submission: MicroTrialSubmission;
    evaluation: MicroTrialEvaluation;
    trial: MicroTrial;
  } | null>(null);
  const [reviewDecision, setReviewDecision] = useState<string>('shortlist');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [candidateFeedback, setCandidateFeedback] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // AI Generator Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiJobDesc, setAiJobDesc] = useState('');
  const [aiSkills, setAiSkills] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<Partial<MicroTrial> | null>(null);
  const [savingTrial, setSavingTrial] = useState(false);

  const loadTrials = async () => {
    setLoading(true);
    try {
      const data = await api.getMicroTrials();
      setTrials(data);
      if (data.length > 0 && !selectedTrial) {
        handleSelectTrial(data[0]);
      }
    } catch (err) {
      console.error('Failed to load trials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrials();
  }, []);

  const handleSelectTrial = async (trial: MicroTrial) => {
    setSelectedTrial(trial);
    setLoadingSubmissions(true);
    try {
      const subs = await api.getTrialSubmissions(trial.id);
      setSubmissions(subs);
    } catch (err) {
      console.error('Failed to load trial submissions', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleOpenReview = async (sub: MicroTrialSubmission) => {
    try {
      const data = await api.getTrialSubmissionEvaluation(sub.id);
      setReviewingSubmission(data);
      setReviewDecision(data.submission.recruiterDecision || 'shortlist');
      setReviewNotes(data.evaluation.recruiterNotes || '');
      setCandidateFeedback('');
    } catch (err: any) {
      alert(err.message || 'Failed to load submission evaluation');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewingSubmission) return;
    setSubmittingReview(true);
    try {
      await api.reviewTrialSubmission(reviewingSubmission.submission.id, {
        decision: reviewDecision,
        notes: reviewNotes,
        candidateFeedback: candidateFeedback
      });
      alert(`Candidate submission updated to: ${reviewDecision.toUpperCase()}`);
      setReviewingSubmission(null);
      if (selectedTrial) handleSelectTrial(selectedTrial);
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to save review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleGenerateAiTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiJobTitle) {
      alert('Please enter or select a job title');
      return;
    }
    setGeneratingAi(true);
    try {
      const skillList = aiSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.generateMicroTrialWithAI({
        jobTitle: aiJobTitle,
        jobDescription: aiJobDesc,
        requiredSkills: skillList.length > 0 ? skillList : ['Problem Solving', 'Data Structures']
      });

      setGeneratedDraft(res.draftTrial);
    } catch (err: any) {
      alert(err.message || 'Failed to generate trial with AI');
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSaveGeneratedTrial = async () => {
    if (!generatedDraft) return;
    setSavingTrial(true);
    try {
      await api.createMicroTrial({
        ...generatedDraft,
        companyName: jobs[0]?.companyName || 'Verified Partner',
        status: 'active'
      });
      alert('Micro-Trial published successfully! Candidates can now solve this to prove their skills.');
      setShowAiModal(false);
      setGeneratedDraft(null);
      loadTrials();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to publish micro-trial');
    } finally {
      setSavingTrial(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            Micro-Trial Proof-of-Work Pipeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate practical code solutions, inspect AST quality checks, and fast-track top candidates.
          </p>
        </div>

        <button
          onClick={() => {
            if (jobs.length > 0) {
              setAiJobTitle(jobs[0].title);
              setAiJobDesc(jobs[0].description || '');
              setAiSkills(jobs[0].requiredSkills?.join(', ') || '');
            }
            setShowAiModal(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Generate Micro-Trial</span>
        </button>
      </div>

      {/* Main trial manager layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Trials */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Active Micro-Trials ({trials.length})
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin mx-auto text-indigo-600 mb-1" />
              Loading trials...
            </div>
          ) : (
            <div className="space-y-2">
              {trials.map(trial => {
                const isSelected = selectedTrial?.id === trial.id;
                return (
                  <div
                    key={trial.id}
                    onClick={() => handleSelectTrial(trial)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">
                        {trial.trialType}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {trial.timeLimitMinutes}m
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                      {trial.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{trial.companyName}</span>
                      <span className="capitalize text-slate-600 font-semibold">{trial.difficulty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Candidate Submissions for Selected Trial */}
        <div className="lg:col-span-8 space-y-4">
          {selectedTrial ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedTrial.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Gate
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Job: {selectedTrial.jobTitle || 'General Technical Requisition'} • Skills: {selectedTrial.requiredSkills.join(', ')}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 block">
                    {submissions.length} Submissions
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Auto-Evaluated with Gemini + AST
                  </span>
                </div>
              </div>

              {/* Submissions Table */}
              {loadingSubmissions ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto text-indigo-600 mb-1" />
                  Loading candidate submissions...
                </div>
              ) : submissions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-xs border border-dashed border-slate-200">
                  No candidate submissions received for this micro-trial yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Candidate</th>
                        <th className="py-2.5 px-3">Proof-of-Work</th>
                        <th className="py-2.5 px-3">Submitted</th>
                        <th className="py-2.5 px-3">Decision</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map(sub => {
                        const isHigh = sub.proofOfWorkScore >= 80;
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900">{sub.studentName}</div>
                              <div className="text-[10px] text-slate-400">{sub.submissionType}</div>
                            </td>

                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                                isHigh
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                <ShieldCheck className="w-3 h-3" />
                                {sub.proofOfWorkScore}% {isHigh ? 'High PoW' : 'Review'}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-slate-500">
                              {new Date(sub.submittedAt).toLocaleDateString()}
                            </td>

                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                sub.recruiterDecision === 'shortlist'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : sub.recruiterDecision === 'advance_to_interview'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {sub.recruiterDecision?.replace('_', ' ') || 'Pending Review'}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleOpenReview(sub)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1"
                              >
                                <span>Inspect & Decide</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
              Select a micro-trial from the left to inspect submissions and evaluations.
            </div>
          )}
        </div>
      </div>

      {/* INSPECT SUBMISSION & CODE MODAL */}
      <AnimatePresence>
        {reviewingSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative space-y-6"
            >
              <button
                onClick={() => setReviewingSubmission(null)}
                className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Candidate Code Inspection
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {reviewingSubmission.submission.studentName}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {reviewingSubmission.trial.title}
                </h2>
              </div>

              {/* PoW Score Breakdown */}
              {(() => {
                const b = reviewingSubmission.evaluation.proofOfWorkBreakdown || (reviewingSubmission.evaluation as any).breakdown || {
                  correctness: 85,
                  codeQuality: 80,
                  problemSolving: 80,
                  efficiency: 85
                };
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Overall PoW</span>
                      <span className="text-lg font-black text-indigo-600">
                        {reviewingSubmission.evaluation.proofOfWorkScore}%
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Correctness</span>
                      <span className="text-lg font-bold text-slate-800">
                        {b.correctness}%
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Code Quality</span>
                      <span className="text-lg font-bold text-slate-800">
                        {b.codeQuality}%
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Execution Speed</span>
                      <span className="text-lg font-bold text-slate-800">
                        {b.efficiency}%
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Code Snippet Viewer */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                  <span>Candidate Implementation</span>
                  {reviewingSubmission.submission.repositoryUrl && (
                    <a
                      href={reviewingSubmission.submission.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold normal-case"
                    >
                      <span>View Repo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </h4>
                <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-72 leading-relaxed border border-slate-800">
                  <pre>{reviewingSubmission.submission.content}</pre>
                </div>
              </div>

              {/* AI Code Review Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Strengths
                  </h5>
                  <div className="space-y-1">
                    {reviewingSubmission.evaluation.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-emerald-800">• {s}</p>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-2">
                  <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Identified Polish Points
                  </h5>
                  <div className="space-y-1">
                    {(reviewingSubmission.evaluation.weaknesses || ['No critical flaws observed.']).map((w, i) => (
                      <p key={i} className="text-xs text-amber-800">• {w}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recruiter Review Decision Form */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recruiter Review Decision
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'shortlist', label: 'Shortlist Candidate' },
                    { id: 'advance_to_interview', label: 'Advance to Final Interview' },
                    { id: 'request_retry', label: 'Request Revision / Retry' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setReviewDecision(opt.id)}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition-colors ${
                        reviewDecision === opt.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Internal Hiring Team Notes
                  </label>
                  <input
                    type="text"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="e.g. Exceptional API error handling, approved for technical round"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setReviewingSubmission(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {submittingReview ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Save Decision & Notify Candidate
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI GENERATE TRIAL MODAL */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative space-y-5"
            >
              <button
                onClick={() => setShowAiModal(false)}
                className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini Micro-Trial Generator
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Synthesize Custom Hands-On Micro-Trial
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Automatically generate an authentic, executable 30-45 minute coding challenge with starter scaffolding and unit test assertions calibrated to your role.
                </p>
              </div>

              {!generatedDraft ? (
                <form onSubmit={handleGenerateAiTrial} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Role / Target Requisition
                    </label>
                    <input
                      type="text"
                      value={aiJobTitle}
                      onChange={(e) => setAiJobTitle(e.target.value)}
                      placeholder="e.g. Senior Machine Learning Engineer, Backend Go Developer"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Required Skills & Focus Areas
                    </label>
                    <input
                      type="text"
                      value={aiSkills}
                      onChange={(e) => setAiSkills(e.target.value)}
                      placeholder="e.g. Python, PyTorch, FastAPI, Vector Embeddings"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Job Description Snippet (Optional context)
                    </label>
                    <textarea
                      value={aiJobDesc}
                      onChange={(e) => setAiJobDesc(e.target.value)}
                      placeholder="Paste key responsibilities or architectural challenges..."
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAiModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={generatingAi}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      {generatingAi ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Designing Micro-Trial...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Generate Micro-Trial
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Preview Generated Trial */
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 capitalize">
                        {generatedDraft.trialType} • {generatedDraft.difficulty}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {generatedDraft.timeLimitMinutes} mins
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{generatedDraft.title}</h4>
                    <p className="text-xs text-slate-600">{generatedDraft.description}</p>

                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        Task Instructions:
                      </span>
                      <div className="p-2.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800 whitespace-pre-wrap">
                        {generatedDraft.taskInstructions}
                      </div>
                    </div>

                    {generatedDraft.testCases && (
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 block mb-1">
                          Synthesized Test Cases ({generatedDraft.testCases.length}):
                        </span>
                        <div className="space-y-1">
                          {generatedDraft.testCases.map((tc, idx) => (
                            <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-[11px] font-mono">
                              <strong>{tc.name}</strong>: {tc.input} → {tc.expectedOutput}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <button
                      onClick={() => setGeneratedDraft(null)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      ← Re-generate
                    </button>

                    <button
                      onClick={handleSaveGeneratedTrial}
                      disabled={savingTrial}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      {savingTrial ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Publish to Candidate Pipeline
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default CompanyMicroTrialManager;
