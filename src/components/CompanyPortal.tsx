import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Users,
  Briefcase,
  Sparkles,
  Zap,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { Job, Application, ApplicationStatus } from '../types';
import { api } from '../services/api';

interface CompanyPortalProps {
  onRefreshData: () => void;
}

export const CompanyPortal: React.FC<CompanyPortalProps> = ({ onRefreshData }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('job_1');
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Job Form
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobLocation, setJobLocation] = useState('San Francisco, CA');
  const [jobWorkMode, setJobWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [jobSalary, setJobSalary] = useState('$130,000 - $160,000');
  const [jobSkills, setJobSkills] = useState('Python, PyTorch, Docker, FastAPI');
  const [jobDesc, setJobDesc] = useState('');
  const [isAiExtracting, setIsAiExtracting] = useState(false);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        api.getJobs(),
        api.getApplications()
      ]);
      setJobs(jobsData || []);
      setApplications(appsData || []);
    } catch (err) {
      console.error('Failed to load company portal data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    const note = prompt(`Enter optional feedback note for candidate:`, `Status updated to ${newStatus}`);
    try {
      await api.updateApplicationStatus(appId, newStatus, note || undefined);
      await loadCompanyData();
      onRefreshData();
    } catch (err) {
      alert('Failed to update application status');
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
        employmentType: 'Full-time',
        experienceLevel: 'Entry Level',
        educationRequirement: "Bachelor's in CS or AI/ML",
        salaryRange: jobSalary,
        requiredSkills: skillsArr,
        preferredSkills: ['Kubernetes', 'FastAPI'],
        description: jobDesc || `${jobTitle} joining our high-performance AI infrastructure team.`
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
  const jobApplications = appList.filter(a => !selectedJobId || a.jobId === selectedJobId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Recruiter Portal — Vertex AI Labs
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review candidate applications ranked by objective verified competencies.
          </p>
        </div>

        <button
          id="btn-post-job-modal"
          onClick={() => setShowPostJobModal(true)}
          className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post New Job Spec</span>
        </button>
      </div>

      {/* Recruiter Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Open Requisitions</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{jobs.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active postings</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Applicants</span>
          <div className="text-xl font-bold text-indigo-600 mt-1">{applications.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Pre-screened candidates</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Avg Candidate Match</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">87%</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Objective skill match</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">In Interview</span>
          <div className="text-xl font-bold text-purple-600 mt-1">1</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active stage</p>
        </div>
      </div>

      {/* Candidate Pipeline Table */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            Candidate Pipeline
          </h3>

          {/* Job filter dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Role:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">Match Score</th>
                <th className="py-2.5 px-3">Score Breakdown</th>
                <th className="py-2.5 px-3">Applied Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Recruiter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobApplications.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div>{app.studentName}</div>
                    <span className="text-[10px] font-normal text-slate-400">Stanford AI • 2026</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <Zap className="w-3 h-3 text-indigo-600" />
                      {app.matchScoreAtApplication}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-500">
                    <div>Skill: <span className="text-slate-800 font-medium">90%</span> (wt 50%)</div>
                    <div>Evidence: <span className="text-slate-800 font-medium">88%</span> (wt 20%)</div>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${
                        app.status === 'interview'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : app.status === 'shortlisted'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                        className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'interview')}
                        className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 transition-colors"
                      >
                        Interview
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'selected')}
                        className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors"
                      >
                        Offer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white border border-slate-200 p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Post Job Specification
              </h3>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">Raw Description / Spec</label>
                  <button
                    type="button"
                    onClick={handleAiExtract}
                    disabled={isAiExtracting}
                    className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Parse Requirements</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste unstructured job description or role requirements..."
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. AI Research Engineer"
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Department</label>
                  <input
                    type="text"
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Location</label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Work Mode</label>
                  <select
                    value={jobWorkMode}
                    onChange={(e: any) => setJobWorkMode(e.target.value)}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  placeholder="Python, PyTorch, Docker, FastAPI"
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Salary Range</label>
                <input
                  type="text"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                >
                  {isSubmittingJob ? 'Publishing...' : 'Publish Job Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
