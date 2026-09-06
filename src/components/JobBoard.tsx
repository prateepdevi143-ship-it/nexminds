import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { Job, Student } from '../types';
import { api } from '../services/api';

interface JobBoardProps {
  jobs: Array<Job & { matchResult?: any }>;
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
  const [workModeFilter, setWorkModeFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<(Job & { matchResult?: any }) | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState<string | null>(null);
  const [customLetterNotes, setCustomLetterNotes] = useState('');
  const [copiedLetter, setCopiedLetter] = useState(false);

  const jobList = jobs || [];
  const filteredJobs = jobList.filter(job => {
    const matchesSearch =
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.requiredSkills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesWorkMode =
      workModeFilter === 'all' || (job.workMode || '').toLowerCase() === workModeFilter.toLowerCase();

    return matchesSearch && matchesWorkMode;
  });

  const handleApply = async (jobId: string) => {
    setApplyingJobId(jobId);
    try {
      await onApplyJob(jobId);
      setApplySuccessMsg('Application submitted successfully!');
      setTimeout(() => setApplySuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to apply');
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Job Board
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Browse roles ranked according to how closely your verified skills match company requirements.
        </p>
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
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{applySuccessMsg} Your profile has been submitted to the employer.</span>
          </div>
          <button
            onClick={() => onSelectTab('applications')}
            className="font-medium text-emerald-700 underline hover:text-emerald-900 ml-2"
          >
            View Applications →
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map(job => {
          const matchScore = job.matchResult?.matchScore || 85;
          const matched = job.matchResult?.matchedSkills || [];
          const missing = job.matchResult?.missingSkills || [];

          return (
            <motion.div
              key={job.id}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.12 }}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600">
                      {job.companyName}
                    </span>
                    <h3 className="font-semibold text-base text-slate-900 mt-0.5">
                      {job.title}
                    </h3>
                  </div>

                  {/* Match Badge */}
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Zap className="w-3 h-3 text-emerald-600" />
                      {matchScore}% Match
                    </span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{job.workMode}</span>
                  <span>•</span>
                  <span className="text-slate-800 font-medium">{job.salaryRange}</span>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    Skill Match:
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

              {/* Bottom bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setCoverLetterText(null);
                    setCustomLetterNotes('');
                    setSelectedJob(job);
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  View Details
                </button>
                <button
                  id={`btn-apply-job-${job.id}`}
                  onClick={() => handleApply(job.id)}
                  disabled={applyingJobId === job.id}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <span>{applyingJobId === job.id ? 'Submitting...' : 'Apply'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-2xl rounded-xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-600">
                  {selectedJob.companyName}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedJob.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1.5">
                  <span>{selectedJob.location} ({selectedJob.workMode})</span>
                  <span>•</span>
                  <span className="text-slate-900 font-medium">{selectedJob.salaryRange}</span>
                  <span>•</span>
                  <span>{selectedJob.employmentType}</span>
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
                  About the Role
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

              {selectedJob.preferredSkills?.length > 0 && (
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

              <div>
                <h4 className="font-semibold text-slate-900 text-xs mb-1">
                  Education & Experience
                </h4>
                <p>{selectedJob.educationRequirement} • {selectedJob.experienceLevel}</p>
              </div>

              {/* AI Tailored Cover Letter Generator */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <h4 className="font-semibold text-slate-900 text-xs">
                      AI Cover Letter Assistant
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
                    placeholder="Optional prompt note (e.g. emphasize PyTorch projects or fast learning)..."
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
              <button
                onClick={() => {
                  handleApply(selectedJob.id);
                  setSelectedJob(null);
                }}
                className="px-5 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
              >
                Submit Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
