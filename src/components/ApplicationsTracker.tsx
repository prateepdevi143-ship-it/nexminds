import React, { useState } from 'react';
import {
  Clock,
  Building2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Application, ApplicationStatus } from '../types';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Applications Pipeline
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Track employer review progress and feedback for your active applications.
        </p>
      </div>

      {appList.length === 0 ? (
        <div className="p-10 rounded-xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
          <Building2 className="w-9 h-9 text-slate-400 mx-auto" />
          <h3 className="font-semibold text-base text-slate-900">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse matched job openings on the platform and submit your verified capability profile.
          </p>
          <button
            onClick={() => onSelectTab('jobs')}
            className="mt-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
          >
            Explore Job Openings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Applications List */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-semibold text-slate-700 block pb-1 border-b border-slate-100">
              Submitted Applications ({appList.length})
            </span>

            <div className="space-y-2.5">
              {appList.map(app => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <motion.div
                    key={app.id}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => setSelectedApp(app)}
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
                        <p className="text-xs text-slate-400 mt-1">
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                        <div className="mt-1.5 flex items-center justify-end gap-1 text-xs text-emerald-700 font-medium">
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

          {/* Right Column: Detailed Application Audit Log & Pipeline */}
          <div className="lg:col-span-6 space-y-4">
            {selectedApp ? (
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
                <div>
                  <span className="text-xs font-semibold text-indigo-600">
                    Application Review
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedApp.jobTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedApp.companyName} • Application ID: {selectedApp.id}
                  </p>
                </div>

                {/* Visual Pipeline Progress */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700">Funnel Progression</span>
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

                {/* Audit History Timeline */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">Timeline Events</span>
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
              <p className="text-xs text-slate-400 text-center py-6">Select an application to view timeline</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
