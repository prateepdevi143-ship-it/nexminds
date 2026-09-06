import React, { useState } from 'react';
import {
  Clock,
  Building2,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  BookOpen,
  FolderGit2,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { Application, ApplicationStatus } from '../types';
import { api } from '../services/api';

interface ApplicationsTrackerProps {
  applications: Application[];
  onSelectTab: (tab: string) => void;
}

const STATUS_ORDER: ApplicationStatus[] = [
  'applied',
  'under_review',
  'shortlisted',
  'interview',
  'selected'
];

export const ApplicationsTracker: React.FC<ApplicationsTrackerProps> = ({
  applications,
  onSelectTab
}) => {
  const appList = applications || [];
  const [selectedApp, setSelectedApp] = useState<Application | null>(appList[0] || null);
  const [improvementPlan, setImprovementPlan] = useState<any | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'interview':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'shortlisted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'selected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleFetchImprovementPlan = async (appId: string) => {
    setLoadingPlan(true);
    try {
      const plan = await api.getApplicationImprovementPlan(appId);
      setImprovementPlan(plan);
    } catch (err: any) {
      alert(err.message || 'Failed to generate improvement plan');
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Applications Pipeline & Feedback Loop
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Track employer review stages, verified match metrics, and actionable skill feedback.
        </p>
      </div>

      {appList.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
          <Building2 className="w-9 h-9 text-slate-400 mx-auto" />
          <h3 className="font-semibold text-base text-slate-900">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse matched opportunities on the platform and apply with your verified capability evidence.
          </p>
          <button
            onClick={() => onSelectTab('jobs')}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
          >
            Explore Matched Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Applications List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-semibold text-slate-700 block pb-1 border-b border-slate-100">
              Active Applications ({appList.length})
            </span>

            <div className="space-y-2.5">
              {appList.map(app => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <motion.div
                    key={app.id}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => {
                      setSelectedApp(app);
                      setImprovementPlan(null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/50 border-indigo-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-indigo-600">
                          {app.companyName}
                        </span>
                        <h4 className="font-semibold text-sm text-slate-900 mt-0.5">{app.jobTitle}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                        <div className="mt-1.5 flex items-center justify-end gap-1 text-xs text-emerald-700 font-bold">
                          <Zap className="w-3 h-3 text-emerald-600" />
                          <span>{app.matchScoreAtApplication}% Match</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Application Audit Log & Feedback */}
          <div className="lg:col-span-7 space-y-4">
            {selectedApp ? (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600">
                      Application Status Details
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedApp.jobTitle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedApp.companyName} • Application #{selectedApp.id}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                        selectedApp.status
                      )}`}
                    >
                      {selectedApp.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Funnel Progress (if not rejected) */}
                {selectedApp.status !== 'rejected' ? (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-700">Recruitment Funnel Progress</span>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      {['Applied', 'Under Review', 'Shortlisted', 'Interview'].map((stage, i) => {
                        const activeIndex = STATUS_ORDER.indexOf(selectedApp.status);
                        const isCompleted = activeIndex >= i;
                        const isCurrent = activeIndex === i;

                        return (
                          <div key={stage} className="space-y-1">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                isCompleted
                                  ? isCurrent
                                    ? 'bg-indigo-600'
                                    : 'bg-indigo-400'
                                  : 'bg-slate-100'
                              }`}
                            />
                            <span
                              className={`text-[10px] block font-medium ${
                                isCompleted ? 'text-slate-800' : 'text-slate-400'
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Rejection Banner & Constructive Feedback */
                  <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs text-rose-900">
                          Application Outcome: Not Moving Forward
                        </h4>
                        <p className="text-xs text-rose-700 mt-0.5">
                          {selectedApp.rejectionReason
                            ? `Primary factor: ${selectedApp.rejectionReason.replace('_', ' ')}`
                            : 'This requisition has concluded.'}
                        </p>
                      </div>
                    </div>

                    {/* Student Feedback from Employer */}
                    {selectedApp.studentFeedback && (
                      <div className="p-3 rounded-lg bg-white border border-rose-200/80 space-y-1">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                          💬 Hiring Team Constructive Feedback:
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          "{selectedApp.studentFeedback}"
                        </p>
                      </div>
                    )}

                    {/* Skill Gaps identified */}
                    {selectedApp.skillGapsIdentified && selectedApp.skillGapsIdentified.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-rose-900">
                          Key Competencies to Strengthen:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedApp.skillGapsIdentified.map((gap: string) => (
                            <span
                              key={gap}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-rose-200 text-rose-800"
                            >
                              {gap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Personalized Improvement Plan Generator */}
                    <div className="pt-2">
                      {!improvementPlan ? (
                        <button
                          type="button"
                          onClick={() => handleFetchImprovementPlan(selectedApp.id)}
                          disabled={loadingPlan}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-900 hover:bg-rose-800 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{loadingPlan ? 'Generating Custom Plan...' : 'View Personalized Improvement Plan'}</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Personalized Improvement Plan Display */}
                {improvementPlan && (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <h4 className="font-bold text-xs text-slate-900">
                          Personalized Skill Improvement Plan
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400">Tailored to this rejection</span>
                    </div>

                    {/* Recommended Courses */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        Targeted Upskilling Courses:
                      </span>
                      <div className="space-y-1.5">
                        {(improvementPlan.recommendedCourses || []).map((c: any) => (
                          <div
                            key={c.id}
                            className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="font-semibold text-xs text-slate-900">{c.title}</div>
                              <div className="text-[10px] text-slate-400">
                                {c.provider} • {c.duration} • {c.skillsTaught.join(', ')}
                              </div>
                            </div>
                            <button
                              onClick={() => onSelectTab('courses')}
                              className="px-2.5 py-1 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors shrink-0"
                            >
                              Enroll
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Portfolio Projects */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                        Evidence-Building Projects:
                      </span>
                      <div className="space-y-1.5">
                        {(improvementPlan.recommendedProjects || []).map((p: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1"
                          >
                            <div className="font-semibold text-xs text-slate-900">{p.title}</div>
                            <p className="text-[11px] text-slate-500">{p.description}</p>
                            <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                              Produces Evidence for: {p.skills.join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectTab('evidence')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>Add Verified Evidence to Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Audit History Timeline */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">Timeline & Activity Log</span>
                  <div className="space-y-3 pl-2 border-l-2 border-slate-200">
                    {(selectedApp.timeline || []).map((event, idx) => (
                      <div key={idx} className="relative pl-3.5 space-y-0.5">
                        <div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-indigo-600" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                            {event.status.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        {event.note && (
                          <p className="text-xs text-slate-600 leading-relaxed">{event.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">Select an application to view details</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
