import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Zap,
  CheckCircle2,
  ArrowRight,
  X,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Clock,
  Award,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  FileCheck2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Job, Student } from '../types';
import { api } from '../services/api';

interface JobBoardProps {
  jobs: Array<Job & { matchResult?: any; opportunityMatch?: any; assessmentAttempt?: any }>;
  student: Student | null;
  onApplyJob: (jobId: string) => Promise<void>;
  onSelectTab: (tab: string) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({
  jobs,
  student,
  onApplyJob,
  onSelectTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'job' | 'internship'>('all');
  const [workModeFilter, setWorkModeFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<(Job & { matchResult?: any; opportunityMatch?: any; assessmentAttempt?: any }) | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState<string | null>(null);
  const [customLetterNotes, setCustomLetterNotes] = useState('');
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [expandedBreakdownId, setExpandedBreakdownId] = useState<string | null>(null);

  // Mandatory Assessment Runner State
  const [assessmentModalJob, setAssessmentModalJob] = useState<Job | null>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [assessmentSubmitting, setAssessmentSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const jobList = jobs || [];
  const filteredJobs = jobList.filter(job => {
    const oppType = (job.opportunityType || (job.type === 'Internship' ? 'internship' : 'job')).toLowerCase();
    const matchesType = typeFilter === 'all' || oppType === typeFilter;

    const matchesSearch =
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.requiredSkills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesWorkMode =
      workModeFilter === 'all' || (job.workMode || '').toLowerCase() === workModeFilter.toLowerCase();

    return matchesType && matchesSearch && matchesWorkMode;
  });

  const jobsCount = jobList.filter(j => (j.opportunityType || (j.type === 'Internship' ? 'internship' : 'job')).toLowerCase() === 'job').length;
  const internshipsCount = jobList.filter(j => (j.opportunityType || (j.type === 'Internship' ? 'internship' : 'job')).toLowerCase() === 'internship').length;

  const handleStartAssessment = async (job: Job) => {
    setAssessmentModalJob(job);
    setAssessmentLoading(true);
    setAssessmentResult(null);
    setAssessmentAnswers({});
    try {
      const data = await api.getOpportunityAssessment(job.id);
      setAssessmentData(data);
    } catch (err: any) {
      alert(err.message || 'Failed to load assessment');
      setAssessmentModalJob(null);
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!assessmentModalJob || !assessmentData) return;
    const answeredCount = Object.keys(assessmentAnswers).length;
    if (answeredCount < assessmentData.questions.length) {
      if (!confirm(`You have answered ${answeredCount} of ${assessmentData.questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    setAssessmentSubmitting(true);
    try {
      const res = await api.submitOpportunityAssessment(assessmentModalJob.id, assessmentAnswers);
      setAssessmentResult(res);
      // Refresh selected job attempt if open
      if (selectedJob && selectedJob.id === assessmentModalJob.id) {
        setSelectedJob({
          ...selectedJob,
          assessmentAttempt: res.attempt
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit assessment');
    } finally {
      setAssessmentSubmitting(false);
    }
  };

  const handleApply = async (job: Job & { assessmentAttempt?: any }) => {
    // If assessment required and not passed, launch assessment modal
    if (job.assessmentRequired && !job.assessmentAttempt?.passed) {
      handleStartAssessment(job);
      return;
    }

    setApplyingJobId(job.id);
    try {
      await onApplyJob(job.id);
      setApplySuccessMsg(`Application for ${job.title} at ${job.companyName} submitted successfully!`);
      setTimeout(() => setApplySuccessMsg(null), 5000);
      if (selectedJob) setSelectedJob(null);
    } catch (err: any) {
      alert(err.message || 'Failed to apply');
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Opportunities & Evidence-Based Matching
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Discover verified jobs and internships with transparent 7-factor competency scoring.
          </p>
        </div>

        {/* Opportunity Type Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          <button
            id="tab-opp-all"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Roles ({jobList.length})
          </button>
          <button
            id="tab-opp-jobs"
            onClick={() => setTypeFilter('job')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'job'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full-Time Jobs ({jobsCount})
          </button>
          <button
            id="tab-opp-internships"
            onClick={() => setTypeFilter('internship')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              typeFilter === 'internship'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Internships ({internshipsCount})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="job-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles, companies, or skills..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Work Mode:</span>
          <select
            id="job-filter-workmode"
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:border-indigo-500 focus:bg-white"
          >
            <option value="all">All Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>
        </div>
      </div>

      {applySuccessMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{applySuccessMsg}</span>
          </div>
          <button
            onClick={() => onSelectTab('applications')}
            className="font-medium text-emerald-700 underline hover:text-emerald-900 ml-2 shrink-0"
          >
            View Applications Pipeline →
          </button>
        </div>
      )}

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map(job => {
          const isInternship = (job.opportunityType || (job.type === 'Internship' ? 'internship' : 'job')).toLowerCase() === 'internship';
          const matchBreakdown = job.opportunityMatch;
          const matchScore = matchBreakdown?.overallMatch || job.matchResult?.matchScore || 85;
          const matched = job.matchResult?.matchedSkills || [];
          const missing = job.matchResult?.missingSkills || [];
          const assessmentAttempt = job.assessmentAttempt;
          const assessmentPassed = assessmentAttempt?.passed;
          const isBreakdownExpanded = expandedBreakdownId === job.id;

          return (
            <motion.div
              key={job.id}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.12 }}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Top badges & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-600">
                        {job.companyName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isInternship
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {isInternship ? 'Internship' : 'Full-time'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-base text-slate-900 mt-1">
                      {job.title}
                    </h3>
                  </div>

                  {/* Match Score Badge */}
                  <div className="shrink-0 text-right">
                    <button
                      type="button"
                      onClick={() => setExpandedBreakdownId(isBreakdownExpanded ? null : job.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      title="Click to view transparent 7-factor match breakdown"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{matchScore}% Match</span>
                      {isBreakdownExpanded ? (
                        <ChevronUp className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-emerald-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Transparent 7-Factor Match Breakdown Drawer */}
                <AnimatePresence>
                  {isBreakdownExpanded && matchBreakdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-700 font-semibold text-[11px] pb-1 border-b border-slate-200">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                          Transparent Capability Match Breakdown
                        </span>
                        <span className="text-emerald-700 font-bold">{matchScore}% Overall</span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-600">
                        <div className="flex justify-between">
                          <span>Skills Match (35%):</span>
                          <span className="font-semibold text-slate-800">{matchBreakdown.factors.skillMatch}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Evidence Confidence (20%):</span>
                          <span className="font-semibold text-slate-800">{matchBreakdown.factors.evidenceConfidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Role Assessment (15%):</span>
                          <span className="font-semibold text-slate-800">{matchBreakdown.factors.assessmentScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Projects & Hackathons (10%):</span>
                          <span className="font-semibold text-slate-800">{matchBreakdown.factors.projectRelevance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Career Alignment (10%):</span>
                          <span className="font-semibold text-slate-800">{matchBreakdown.factors.careerAlignment}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Experience & Education (10%):</span>
                          <span className="font-semibold text-slate-800">
                            {Math.round((matchBreakdown.factors.experienceYears + matchBreakdown.factors.educationMatch) / 2)}%
                          </span>
                        </div>
                      </div>

                      {matchBreakdown.reasoning && (
                        <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 italic">
                          {matchBreakdown.reasoning}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{job.workMode}</span>
                  <span>•</span>
                  <span className="text-slate-800 font-semibold">
                    {isInternship ? (job.stipend || job.salaryRange || '₹25,000 / mo') : (job.salaryRange || '₹10,00,000 / yr')}
                  </span>
                  {isInternship && job.duration && (
                    <>
                      <span>•</span>
                      <span className="text-purple-700 font-medium">Duration: {job.duration}</span>
                    </>
                  )}
                  {isInternship && job.conversionPossibility && (
                    <>
                      <span>•</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        PPO / Full-time Conversion
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Mandatory Assessment Gate Banner */}
                {job.assessmentRequired && (
                  <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                    assessmentPassed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50/80 border-amber-200 text-amber-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {assessmentPassed ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold block text-[11px]">
                          {assessmentPassed
                            ? `Mandatory Role Assessment Passed: ${assessmentAttempt.score}% ✓`
                            : `Mandatory Technical Assessment Required (${job.minimumAssessmentScore || 60}% to unlock)`}
                        </span>
                        <span className="text-[10px] opacity-80">
                          {assessmentPassed
                            ? 'Verified platform skill confidence attached to this application'
                            : `Assesses: ${(job.assessmentSkills || job.requiredSkills || []).slice(0, 3).join(', ')}`}
                        </span>
                      </div>
                    </div>

                    {!assessmentPassed && (
                      <button
                        type="button"
                        onClick={() => handleStartAssessment(job)}
                        className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0 shadow-2xs"
                      >
                        Take Assessment
                      </button>
                    )}
                  </div>
                )}

                {/* Skills tags */}
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    Skill Match & Gaps:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {matched.map((s: string) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {missing.map((s: string) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600"
                      >
                        ✕ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom action bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setCoverLetterText(null);
                    setCustomLetterNotes('');
                    setSelectedJob(job);
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  View Full Spec
                </button>

                {job.assessmentRequired && !assessmentPassed ? (
                  <button
                    id={`btn-unlock-assessment-${job.id}`}
                    onClick={() => handleStartAssessment(job)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Take Assessment to Unlock</span>
                  </button>
                ) : (
                  <button
                    id={`btn-apply-job-${job.id}`}
                    onClick={() => handleApply(job)}
                    disabled={applyingJobId === job.id}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <span>{applyingJobId === job.id ? 'Submitting...' : 'Apply Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mandatory Technical Skill Assessment Runner Modal */}
      {assessmentModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-600">
                  Mandatory Skill Assessment • {assessmentModalJob.companyName}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {assessmentModalJob.title} Technical Gate
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Passing score: {assessmentModalJob.minimumAssessmentScore || 60}% • Objective competency verification
                </p>
              </div>
              <button
                onClick={() => {
                  setAssessmentModalJob(null);
                  setAssessmentResult(null);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {assessmentLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500">Loading verified technical challenge questions...</p>
              </div>
            ) : assessmentResult ? (
              /* Assessment Result View */
              <div className="space-y-6 text-center py-4">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                  assessmentResult.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {assessmentResult.passed ? (
                    <Award className="w-8 h-8" />
                  ) : (
                    <AlertCircle className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    {assessmentResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Not Passed'}
                  </h4>
                  <p className="text-sm font-semibold mt-1 text-slate-700">
                    You scored <span className={assessmentResult.passed ? 'text-emerald-700' : 'text-rose-600'}>{assessmentResult.score}%</span> (Minimum Required: {assessmentResult.passingScore}%)
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    {assessmentResult.message}
                  </p>
                </div>

                {/* Skill Breakdown */}
                {assessmentResult.attempt?.breakdown && (
                  <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
                    <span className="text-xs font-semibold text-slate-700 block">Performance by Skill:</span>
                    {assessmentResult.attempt.breakdown.map((b: any) => (
                      <div key={b.skill} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{b.skill}</span>
                        <span className={`font-semibold ${b.passed ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {b.score}% {b.passed ? '✓' : '✕'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 pt-2">
                  {assessmentResult.passed ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleApply({
                          ...assessmentModalJob,
                          assessmentAttempt: assessmentResult.attempt
                        });
                        setAssessmentModalJob(null);
                      }}
                      className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Submit Application Now</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAssessmentResult(null);
                          setAssessmentAnswers({});
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                      >
                        Retake Assessment
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAssessmentModalJob(null);
                          onSelectTab('courses');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        Review Courses to Prepare
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : assessmentData ? (
              /* Active Assessment Questions View */
              <div className="space-y-6">
                <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200/60 text-indigo-900 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Standard Technical Screening • {assessmentData.questions.length} Questions
                  </span>
                  <span className="font-semibold text-indigo-700">
                    Target: {assessmentData.passingScore}%
                  </span>
                </div>

                <div className="space-y-6">
                  {assessmentData.questions.map((q: any, qIndex: number) => {
                    const selectedIdx = assessmentAnswers[q.id];
                    return (
                      <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-semibold text-xs text-slate-900">
                            {qIndex + 1}. {q.question}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 shrink-0">
                            {q.skill}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {q.options.map((opt: string, optIdx: number) => {
                            const isChosen = selectedIdx === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                                className={`w-full p-2.5 rounded-lg text-left text-xs transition-all border flex items-center gap-2.5 ${
                                  isChosen
                                    ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                                  isChosen ? 'border-white bg-white text-indigo-600 font-bold' : 'border-slate-300 text-slate-400'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {Object.keys(assessmentAnswers).length} of {assessmentData.questions.length} answered
                  </span>

                  <button
                    type="button"
                    onClick={handleSubmitAssessment}
                    disabled={assessmentSubmitting}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs disabled:opacity-50 flex items-center gap-2"
                  >
                    <span>{assessmentSubmitting ? 'Grading Challenge...' : 'Submit Assessment'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}

      {/* Full Spec Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-indigo-600">
                    {selectedJob.companyName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {selectedJob.opportunityType || selectedJob.employmentType}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedJob.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1.5">
                  <span>{selectedJob.location} ({selectedJob.workMode})</span>
                  <span>•</span>
                  <span className="text-slate-900 font-semibold">{selectedJob.salaryRange || selectedJob.stipend}</span>
                  {selectedJob.duration && (
                    <>
                      <span>•</span>
                      <span className="text-purple-700 font-medium">Duration: {selectedJob.duration}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-semibold text-slate-900 text-xs mb-1">
                  About the Role & Team
                </h4>
                <p>{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-xs mb-1">
                  Required Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedJob.requiredSkills.map(sk => (
                    <span
                      key={sk}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {selectedJob.preferredSkills && selectedJob.preferredSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs mb-1">
                    Preferred Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedJob.preferredSkills.map(sk => (
                      <span
                        key={sk}
                        className="px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assessment Status Notice */}
              {selectedJob.assessmentRequired && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 text-xs mb-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Mandatory Technical Assessment Policy
                  </h4>
                  <p className="text-slate-500 text-xs">
                    This role requires a verified score of {selectedJob.minimumAssessmentScore || 60}% or higher before your application can be reviewed by hiring managers.
                  </p>
                </div>
              )}

              {/* AI Tailored Cover Letter Generator */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <h4 className="font-semibold text-slate-900 text-xs">
                      AI Evidence-Backed Cover Letter Assistant
                    </h4>
                  </div>
                  {!coverLetterText ? (
                    <button
                      type="button"
                      id="btn-draft-cover-letter"
                      onClick={async () => {
                        setGeneratingLetter(true);
                        try {
                          const letter = await api.generateCoverLetter(selectedJob.id, customLetterNotes);
                          setCoverLetterText(letter);
                        } catch (e: any) {
                          alert(e.message || 'Failed to generate cover letter');
                        } finally {
                          setGeneratingLetter(false);
                        }
                      }}
                      disabled={generatingLetter}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${generatingLetter ? 'animate-spin' : ''}`} />
                      <span>{generatingLetter ? 'Drafting with Gemini...' : 'Draft Tailored Letter'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id="btn-copy-cover-letter"
                        onClick={() => {
                          navigator.clipboard.writeText(coverLetterText);
                          setCopiedLetter(true);
                          setTimeout(() => setCopiedLetter(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                      >
                        {copiedLetter ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLetter ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverLetterText(null)}
                        className="text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>

                {!coverLetterText && (
                  <input
                    id="cover-letter-notes-input"
                    type="text"
                    placeholder="Optional focus note (e.g. highlight PyTorch projects or hackathon awards)..."
                    value={customLetterNotes}
                    onChange={e => setCustomLetterNotes(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 mb-1"
                  />
                )}

                {coverLetterText && (
                  <div className="relative mt-2">
                    <textarea
                      id="cover-letter-output"
                      value={coverLetterText}
                      onChange={e => setCoverLetterText(e.target.value)}
                      rows={6}
                      className="w-full p-3 text-xs bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-mono leading-relaxed resize-y focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Deadline: {selectedJob.deadline}
              </span>

              {selectedJob.assessmentRequired && !selectedJob.assessmentAttempt?.passed ? (
                <button
                  onClick={() => {
                    handleStartAssessment(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs"
                >
                  Take Assessment to Unlock
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleApply(selectedJob);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
                >
                  Submit Application
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
