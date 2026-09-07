import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Compass,
  Briefcase,
  Clock,
  Award,
  BookOpen,
  Activity,
  MessageSquare,
  Users,
  Target,
  Sparkles,
  X,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, CareerGoal, User } from '../types';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: 'indigo' | 'emerald' | 'amber';
  category?: string;
  description?: string;
}

export interface SidebarGroup {
  group: string;
  items: TabItem[];
}

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  activeRole: 'student' | 'company' | 'admin';
  student?: Student | null;
  targetCareer?: CareerGoal | null;
  currentUser?: User | null;
  jobsCount?: number;
  evidencesCount?: number;
  applicationsCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeRole,
  student,
  targetCareer,
  currentUser,
  jobsCount = 0,
  evidencesCount = 0,
  applicationsCount = 0,
  isOpenMobile,
  onCloseMobile
}) => {
  // Prevent background scrolling on mobile when drawer is open
  useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCloseMobile();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpenMobile, onCloseMobile]);

  // Student Feature Groups
  const studentGroups: SidebarGroup[] = [
    {
      group: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          description: 'Readiness & capability summary'
        }
      ]
    },
    {
      group: 'Capability & Verification',
      items: [
        {
          id: 'resume',
          label: 'Resume & ATS Score',
          icon: FileText,
          badge: student?.resumeScore ? `${student.resumeScore}%` : undefined,
          badgeColor: 'emerald',
          description: 'AI parser & target role match'
        },
        {
          id: 'skills-graph',
          label: 'Skills & Evidence',
          icon: ShieldCheck,
          badge: evidencesCount > 0 ? evidencesCount : undefined,
          badgeColor: 'indigo',
          description: 'Proof artifacts & GitHub/certifications'
        },
        {
          id: 'skills-gap',
          label: 'Skill Gap & GPS',
          icon: Compass,
          description: 'Career pathway simulator'
        },
        {
          id: 'assessments',
          label: 'Skill Assessments',
          icon: Award,
          description: 'Interactive adaptive benchmark tests'
        }
      ]
    },
    {
      group: 'Career & Opportunities',
      items: [
        {
          id: 'certified-internships',
          label: 'Certified Internships',
          icon: Award,
          badge: 'FREE',
          badgeColor: 'emerald',
          description: 'Official skill-based programs & certificates'
        },
        {
          id: 'jobs',
          label: 'Job Matching',
          icon: Briefcase,
          badge: jobsCount > 0 ? jobsCount : undefined,
          badgeColor: 'indigo',
          description: 'Smart algorithm ranked positions'
        },
        {
          id: 'applications',
          label: 'Applications Tracker',
          icon: Clock,
          badge: applicationsCount > 0 ? applicationsCount : undefined,
          badgeColor: 'amber',
          description: 'Pipeline & interview feedback'
        },
        {
          id: 'courses',
          label: 'Courses & Learning',
          icon: BookOpen,
          description: 'Targeted upskilling resources'
        },
        {
          id: 'career-doctor',
          label: 'Career Doctor',
          icon: Activity,
          description: 'Diagnostic readiness prescription'
        }
      ]
    },
    {
      group: 'AI Copilot',
      items: [
        {
          id: 'chat',
          label: 'AI Advisor',
          icon: MessageSquare,
          description: 'Personal 24/7 career strategist'
        }
      ]
    }
  ];

  // Company Feature Groups
  const companyGroups: SidebarGroup[] = [
    {
      group: 'Talent Acquisition',
      items: [
        {
          id: 'company-dashboard',
          label: 'Candidate Pipeline',
          icon: Users,
          description: 'Verified applicants & evaluation'
        },
        {
          id: 'jobs',
          label: 'Job Postings & Matches',
          icon: Briefcase,
          badge: jobsCount > 0 ? jobsCount : undefined,
          badgeColor: 'indigo',
          description: 'Manage openings & requirements'
        }
      ]
    }
  ];

  // Admin Feature Groups
  const adminGroups: SidebarGroup[] = [
    {
      group: 'Platform Governance',
      items: [
        {
          id: 'admin-portal',
          label: 'Administration & Insights',
          icon: ShieldCheck,
          description: 'Ecosystem health & placement metrics'
        }
      ]
    }
  ];

  const currentGroups =
    activeRole === 'student'
      ? studentGroups
      : activeRole === 'company'
      ? companyGroups
      : adminGroups;

  const readiness = student?.careerReadinessScore || 78;

  const renderBadge = (badge: string | number, isActive: boolean, color?: string) => {
    if (isActive) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-indigo-700 shadow-2xs">
          {badge}
        </span>
      );
    }

    if (color === 'emerald') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {badge}
        </span>
      );
    }

    if (color === 'amber') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {badge}
        </span>
      );
    }

    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
        {badge}
      </span>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Sidebar Header with Workspace Badge & Mobile Close Button */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
            {activeRole === 'student' ? (
              <Target className="w-4 h-4" />
            ) : activeRole === 'company' ? (
              <Building2 className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 capitalize">
                {activeRole} Space
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60" title="Connected to Firestore NoSQL real-time database">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                NoSQL Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Feature Navigation
            </p>
          </div>
        </div>

        {/* Mobile Close Button - minimum 44px touch area */}
        <button
          onClick={onCloseMobile}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all"
          aria-label="Close navigation sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Vertically Arranged Feature Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
        {currentGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {/* Group Label */}
            <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>{group.group}</span>
              <span className="text-[10px] font-semibold text-slate-300">
                {group.items.length}
              </span>
            </div>

            {/* Vertical Nav Buttons */}
            <div className="space-y-1">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    id={`sidebar-feature-${item.id}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full group relative flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-medium transition-all duration-150 text-left cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
                    }`}
                  >
                    {/* Active Left Pill Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-pill-indicator"
                        className="absolute left-1 top-2.5 bottom-2.5 w-1 bg-white rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className="flex items-center gap-3 min-w-0 pl-1">
                      {/* Icon container */}
                      <div
                        className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Labels & Micro-description */}
                      <div className="truncate">
                        <div className="truncate text-xs font-medium leading-tight">
                          {item.label}
                        </div>
                        {item.description && (
                          <div
                            className={`text-[10px] truncate leading-tight mt-0.5 ${
                              isActive ? 'text-indigo-100 font-normal' : 'text-slate-400 font-normal'
                            }`}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Badge & Chevron indicator */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                      {item.badge !== undefined &&
                        renderBadge(item.badge, isActive, item.badgeColor)}
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Context: Student Capability Card or Platform Status */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/80">
        {activeRole === 'student' && student ? (
          <div
            id="sidebar-career-readiness-card"
            onClick={() => {
              onSelectTab('skills-gap');
              onCloseMobile();
            }}
            className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
                <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate max-w-[130px]">
                  {student.careerGoal || targetCareer?.title || 'AI Engineer'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                {readiness}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${readiness}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                Readiness Score
              </span>
              <span className="text-indigo-600 font-medium group-hover:underline flex items-center gap-0.5">
                Simulate <Sparkles className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        ) : activeRole === 'company' ? (
          <div
            id="sidebar-company-status-card"
            onClick={() => {
              onSelectTab('company-dashboard');
              onCloseMobile();
            }}
            className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-900">
                Company Hiring Portal
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {jobsCount} active opening{jobsCount === 1 ? '' : 's'} accepting applications.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Platform Core Online</span>
            </div>
            <p className="text-[11px] text-slate-500">
              All intelligence & match engines active.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Vertical Left Sidebar */}
      <aside
        id="desktop-vertical-sidebar"
        className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-20 shadow-xs"
        aria-label="Main Navigation"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Slide-out Drawer */}
            <motion.aside
              id="mobile-vertical-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-xs bg-white shadow-2xl overflow-hidden flex flex-col z-10"
              aria-label="Mobile Navigation Drawer"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
