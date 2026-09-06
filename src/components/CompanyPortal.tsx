import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Users,
  Briefcase,
  Sparkles,
  Zap,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Filter,
  BarChart3,
  Award,
  ChevronDown,
  Lock,
  MessageSquare,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Job, Application, ApplicationStatus, CandidateRankItem } from '../types';
import { api } from '../services/api';

interface CompanyPortalProps {
  onRefreshData: () => void;
}

export const CompanyPortal: React.FC<CompanyPortalProps> = ({ onRefreshData }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<CandidateRankItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics'>('pipeline');

  // Evaluation / Feedback Modal
  const [evaluatingApp, setEvaluatingApp] = useState<Application | null>(null);
  const [evalStatus, setEvalStatus] = useState<ApplicationStatus>('shortlisted');
  const [evalReason, setEvalReason] = useState<string>('missing_skills');
  const [evalSkillGaps, setEvalSkillGaps] = useState<string[]>([]);
  const [evalInternalNotes, setEvalInternalNotes] = useState('');
  const [evalStudentFeedback, setEvalStudentFeedback] = useState('');
  const [isSubmittingEval, setIsSubmittingEval] = useState(false);

  // New Job / Internship Form
  const [oppType, setOppType] = useState<'job' | 'internship'>('job');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobLocation, setJobLocation] = useState('San Francisco, CA');
  const [jobWorkMode, setJobWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [jobSalary, setJobSalary] = useState('₹18,00,000 - ₹24,00,000 / yr');
  const [jobStipend, setJobStipend] = useState('₹40,000 / month');
  const [jobDuration, setJobDuration] = useState('6 months');
  const [jobInternshipType, setJobInternshipType] = useState<'summer' | 'winter' | 'full_year' | 'semester'>('summer');
  const [jobConversionPossibility, setJobConversionPossibility] = useState(true);
  const [jobSkills, setJobSkills] = useState('Python, PyTorch, Docker, FastAPI');
  const [jobDesc, setJobDesc] = useState('');
  const [assessmentRequired, setAssessmentRequired] = useState(true);
  const [minAssessmentScore, setMinAssessmentScore] = useState(65);
  const [isAiExtracting, setIsAiExtracting] = useState(false);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  useEffect(() => {
    loadCompanyData();
  }, [selectedJobId]);

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData, analyticsData] = await Promise.all([
        api.getJobs(),
        api.getApplications(),
        api.getRecruitmentAnalytics().catch(() => null)
      ]);
      setJobs(jobsData || []);
      setApplications(appsData || []);
      setAnalytics(analyticsData);

      // If specific job is selected, load ranked candidates
      if (selectedJobId && selectedJobId !== 'all') {
        const rankedCandidates = await api.getJobCandidates(selectedJobId).catch(() => []);
        setCandidates(rankedCandidates);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      console.error('Failed to load company portal data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEvaluation = (app: Application) => {
    setEvaluatingApp(app);
    setEvalStatus(app.status || 'shortlisted');
    setEvalReason(app.rejectionReason || 'missing_skills');
    setEvalSkillGaps(app.skillGapsIdentified || []);
    setEvalInternalNotes(app.internalHRNotes || '');
    setEvalStudentFeedback(app.studentFeedback || '');
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingApp) return;

    setIsSubmittingEval(true);
    try {
      await api.submitApplicationFeedback(evaluatingApp.id, {
        status: evalStatus,
        primaryReason: evalStatus === 'rejected' ? evalReason : undefined,
        skillGapsIdentified: evalSkillGaps,
        internalHRNotes: evalInternalNotes,
        studentFeedback: evalStudentFeedback
      });

      setEvaluatingApp(null);
      await loadCompanyData();
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit evaluation feedback');
    } finally {
      setIsSubmittingEval(false);
    }
  };

  const handleAiExtract = async () => {
    if (!jobDesc.trim()) {
      alert('Please enter a raw job description first.');
      return;
    }
    setIsAiExtracting(true);
    try {
      const res = await api.parseJobDescription(jobDesc);
      if (res.title && !jobTitle) setJobTitle(res.title);
      if (res.requiredSkills?.length) setJobSkills(res.requiredSkills.join(', '));
    } catch (err) {
      console.error('Failed to extract job structure', err);
    } finally {
      setIsAiExtracting(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setIsSubmittingJob(true);
    try {
      const skillsArr = jobSkills.split(',').map(s => s.trim()).filter(Boolean);
      await api.createJob({
        title: jobTitle,
        location: jobLocation,
        workMode: jobWorkMode,
        opportunityType: oppType,
        employmentType: oppType === 'internship' ? 'Internship' : 'Full-time',
        experienceLevel: oppType === 'internship' ? 'Internship' : 'Entry Level',
        educationRequirement: "Bachelor's in CS or related technical discipline",
        salaryRange: oppType === 'internship' ? jobStipend : jobSalary,
        stipend: oppType === 'internship' ? jobStipend : undefined,
        duration: oppType === 'internship' ? jobDuration : undefined,
        internshipType: oppType === 'internship' ? jobInternshipType : undefined,
        conversionPossibility: oppType === 'internship' ? jobConversionPossibility : undefined,
        requiredSkills: skillsArr,
        preferredSkills: ['Docker', 'Git', 'CI/CD'],
        assessmentRequired,
        minimumAssessmentScore: assessmentRequired ? minAssessmentScore : 0,
        assessmentSkills: skillsArr.slice(0, 4),
        description: jobDesc || `${jobTitle} joining our high-performance technical engineering team.`
      });

      setShowPostJobModal(false);
      setJobTitle('');
      setJobDesc('');
      await loadCompanyData();
      onRefreshData();
    } catch (err) {
      alert('Failed to create job');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const appList = applications || [];
  const filteredApps = appList.filter(a => selectedJobId === 'all' || a.jobId === selectedJobId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Recruiter & Talent Portal
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Evidence-based applicant screening with verified competencies and structured HR feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pipeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Candidates Pipeline
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'analytics' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Recruitment Funnel</span>
            </button>
          </div>

          <button
            id="btn-post-job-modal"
            onClick={() => setShowPostJobModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Opportunity</span>
          </button>
        </div>
      </div>

      {/* Recruiter KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active Requisitions</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{jobs.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Jobs & Internships</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Applicants</span>
          <div className="text-xl font-bold text-indigo-600 mt-1">{applications.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Screened with evidence</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Assessment Pass Rate</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {analytics?.assessmentPassRate ? `${analytics.assessmentPassRate}%` : '80%'}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Technical screening gate</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Avg Candidate Match</span>
          <div className="text-xl font-bold text-purple-600 mt-1">
            {analytics?.avgMatchScore ? `${analytics.avgMatchScore}%` : '85%'}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">7-factor weighted score</p>
        </div>
      </div>

      {activeTab === 'analytics' && analytics && (
        /* Recruitment Analytics Funnel & Insights */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Hiring Funnel Progression
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Conversion stages from application submission to verified offer selection.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(analytics.funnel || {}).map(([stage, count]: [string, any]) => (
                <div key={stage} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                    {stage.replace('_', ' ')}
                  </span>
                  <div className="text-2xl font-black text-slate-900">{count}</div>
                  <span className="text-[10px] text-slate-400">candidates</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Most Frequent Skill Gaps in Rejected Candidates
                </h4>
                <div className="space-y-2">
                  {(analytics.topSkillGaps || []).map((gap: any) => (
                    <div key={gap.skill} className="flex items-center justify-between text-xs p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                      <span className="font-semibold text-rose-900">{gap.skill}</span>
                      <span className="text-rose-700 font-bold">{gap.count} candidates affected</span>
                    </div>
                  ))}
                  {(!analytics.topSkillGaps || analytics.topSkillGaps.length === 0) && (
                    <p className="text-xs text-slate-400">No skill gaps recorded yet.</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Primary Rejection Causes
                </h4>
                <div className="space-y-2">
                  {Object.entries(analytics.rejectionReasons || {}).map(([reason, count]: [string, any]) => (
                    <div key={reason} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="capitalize text-slate-700">{reason.replace('_', ' ')}</span>
                      <span className="font-semibold text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        /* Candidate Pipeline Table */
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Candidate Pipeline
            </h3>

            {/* Requisition filter dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Requisition:</span>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Requisitions ({applications.length})</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} ({j.companyName})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">Opportunity</th>
                  <th className="py-2.5 px-3">Overall Match</th>
                  <th className="py-2.5 px-3">Assessment Gate</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Recruiter Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map(app => {
                  const job = jobs.find(j => j.id === app.jobId);
                  const isInternship = job?.opportunityType === 'internship';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{app.studentName}</div>
                        <div className="text-[10px] text-slate-400">
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{app.jobTitle}</div>
                        <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                          isInternship ? 'bg-purple-50 text-purple-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {isInternship ? 'Internship' : 'Job'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Zap className="w-3 h-3 text-emerald-600" />
                          {app.matchScoreAtApplication}%
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {app.assessmentScore !== undefined ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            app.assessmentPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            <ShieldCheck className="w-3 h-3" />
                            {app.assessmentScore}% {app.assessmentPassed ? 'Passed' : 'Failed'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not required</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            app.status === 'selected'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'interview'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : app.status === 'shortlisted'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : app.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleOpenEvaluation(app)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-2xs inline-flex items-center gap-1"
                        >
                          <span>Review & Evaluate</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recruiter Evaluation & Feedback Modal */}
      {evaluatingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-600">
                  Application Assessment & Decision
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {evaluatingApp.studentName} — {evaluatingApp.jobTitle}
                </h3>
              </div>
              <button
                onClick={() => setEvaluatingApp(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              {/* Status Decision Selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Candidate Pipeline Decision</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['shortlisted', 'interview', 'selected', 'rejected'] as ApplicationStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEvalStatus(st)}
                      className={`py-2 px-2.5 rounded-xl font-semibold capitalize border transition-all text-center ${
                        evalStatus === st
                          ? st === 'selected'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : st === 'rejected'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* If Rejected: Rejection Reasons & Skill Gap Tags */}
              {evalStatus === 'rejected' && (
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-rose-900 block">Primary Rejection Cause</label>
                    <select
                      value={evalReason}
                      onChange={(e) => setEvalReason(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 text-slate-800 focus:outline-none"
                    >
                      <option value="missing_skills">Missing critical job requirements</option>
                      <option value="assessment_failed">Assessment score below minimum threshold</option>
                      <option value="insufficient_evidence">Insufficient verified project / production evidence</option>
                      <option value="competition">High candidate competition for limited slots</option>
                      <option value="other">Other reason</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-rose-900 block">
                      Specific Skill Gaps Identified (Triggers improvement plan for student)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Python', 'PyTorch', 'Docker', 'FastAPI', 'SQL', 'Git', 'Kubernetes', 'System Design'].map(sk => {
                        const isSelected = evalSkillGaps.includes(sk);
                        return (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setEvalSkillGaps(evalSkillGaps.filter(g => g !== sk));
                              } else {
                                setEvalSkillGaps([...evalSkillGaps, sk]);
                              }
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all border ${
                              isSelected
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-white text-slate-700 border-rose-200 hover:border-rose-300'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '} {sk}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Private HR Notes (Strictly Hidden From Student) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Internal HR Notes (Strictly Confidential — Hidden from Candidate)
                  </label>
                  <span className="text-[10px] text-slate-400">Recruiter eyes only</span>
                </div>
                <textarea
                  rows={2}
                  value={evalInternalNotes}
                  onChange={(e) => setEvalInternalNotes(e.target.value)}
                  placeholder="Private hiring panel notes, salary budget notes, or recruiter assessment..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Constructive Candidate Feedback (Seen by Student) */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Constructive Feedback for Student (Visible in Student Tracker)
                </label>
                <textarea
                  rows={3}
                  value={evalStudentFeedback}
                  onChange={(e) => setEvalStudentFeedback(e.target.value)}
                  placeholder="Provide constructive guidance (e.g. recommend building end-to-end containerized projects or refining asynchronous Python)..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEvaluatingApp(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEval}
                  className="px-5 py-2 rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
                >
                  {isSubmittingEval ? 'Saving Decision...' : 'Save Decision & Send Feedback'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Post Job or Internship Requisition
              </h3>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-3.5 text-xs">
              {/* Opportunity Type Switcher */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setOppType('job')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    oppType === 'job' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Full-Time Job
                </button>
                <button
                  type="button"
                  onClick={() => setOppType('internship')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    oppType === 'internship' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Internship
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-slate-700">Raw Description / Spec</label>
                  <button
                    type="button"
                    onClick={handleAiExtract}
                    disabled={isAiExtracting}
                    className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Parse Spec</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste unstructured role requirements or spec..."
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={oppType === 'internship' ? 'e.g. AI Engineering Intern' : 'e.g. AI Systems Engineer'}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Department</label>
                  <input
                    type="text"
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Location</label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Work Mode</label>
                  <select
                    value={jobWorkMode}
                    onChange={(e: any) => setJobWorkMode(e.target.value)}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              {oppType === 'internship' ? (
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Stipend</label>
                    <input
                      type="text"
                      value={jobStipend}
                      onChange={(e) => setJobStipend(e.target.value)}
                      placeholder="e.g. ₹35,000 / mo"
                      className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Duration</label>
                    <input
                      type="text"
                      value={jobDuration}
                      onChange={(e) => setJobDuration(e.target.value)}
                      placeholder="e.g. 6 months"
                      className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700">Type</label>
                    <select
                      value={jobInternshipType}
                      onChange={(e: any) => setJobInternshipType(e.target.value)}
                      className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="summer">Summer</option>
                      <option value="winter">Winter</option>
                      <option value="semester">Semester</option>
                      <option value="full_year">Full Year</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Salary Range</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Required Competencies (Comma separated)</label>
                <input
                  type="text"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  placeholder="Python, PyTorch, Docker, FastAPI"
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Mandatory Assessment Setting */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assessmentRequired}
                    onChange={(e) => setAssessmentRequired(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-slate-800">
                    Require Mandatory Technical Assessment before application
                  </span>
                </label>

                {assessmentRequired && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Minimum passing threshold:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={50}
                        max={95}
                        value={minAssessmentScore}
                        onChange={(e) => setMinAssessmentScore(Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded bg-white border border-slate-200 text-center font-bold text-indigo-600"
                      />
                      <span>%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="px-4 py-1.5 rounded-lg font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                >
                  {isSubmittingJob ? 'Publishing...' : 'Publish Requisition'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
