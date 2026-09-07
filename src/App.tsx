import React, { useState, useEffect } from 'react';
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
  Building2,
  Users,
  RefreshCw,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { RoleSelectionScreen } from './components/RoleSelectionScreen';
import { StudentOnboarding } from './components/StudentOnboarding';
import { CompanyOnboarding } from './components/CompanyOnboarding';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { ResumeIntelligence } from './components/ResumeIntelligence';
import { SkillsEvidenceGraph } from './components/SkillsEvidenceGraph';
import { SkillGapEngine } from './components/SkillGapEngine';
import { JobBoard } from './components/JobBoard';
import { ApplicationsTracker } from './components/ApplicationsTracker';
import { AssessmentsHub } from './components/AssessmentsHub';
import { CoursesAndLearning } from './components/CoursesAndLearning';
import { CareerDoctor } from './components/CareerDoctor';
import { AIChatAssistant } from './components/AIChatAssistant';
import { CompanyPortal } from './components/CompanyPortal';
import { AdminPortal } from './components/AdminPortal';
import { Student, SkillEvidence, CareerGoal, Job, Application, Notification, User, UserRole } from './types';
import { api } from './services/api';
import {
  subscribeToRealtimeJobs,
  subscribeToRealtimeApplications,
  subscribeToRealtimeNotifications,
  subscribeToRealtimeEvidences,
  initializeFirestoreDatabase
} from './services/firestoreService';

export default function App() {
  const {
    firebaseUser,
    user: authUser,
    role: authRole,
    studentProfile: authStudentProfile,
    companyProfile: authCompanyProfile,
    loading: authLoading,
    needsRoleSelection,
    needsOnboarding,
    signOut
  } = useAuth();

  const [activeRole, setActiveRole] = useState<'student' | 'company' | 'admin'>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [student, setStudent] = useState<Student | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [evidences, setEvidences] = useState<SkillEvidence[]>([]);
  const [targetCareer, setTargetCareer] = useState<CareerGoal | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [assessmentTargetSkill, setAssessmentTargetSkill] = useState<string | undefined>(undefined);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync activeRole with authRole when user logs in or role changes
  useEffect(() => {
    if (authRole) {
      const role = authRole === 'admin' ? 'admin' : authRole === 'company' ? 'company' : 'student';
      setActiveRole(role);
      if (role === 'student') setActiveTab('dashboard');
      else if (role === 'company') setActiveTab('company-dashboard');
      else if (role === 'admin') setActiveTab('admin-portal');
    }
  }, [authRole]);

  // Load data whenever user changes or user completes onboarding
  useEffect(() => {
    if ((firebaseUser || authUser) && !needsRoleSelection && !needsOnboarding) {
      loadAllData();
    } else if (!firebaseUser && !authUser && !authLoading) {
      setLoading(false);
    }
  }, [firebaseUser, authUser, needsRoleSelection, needsOnboarding, authLoading]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getStudentProfile(),
        api.getJobs(),
        api.getApplications(),
        api.getNotifications(),
        api.getStudents()
      ]);

      if (results[0].status === 'fulfilled' && results[0].value) {
        const profileData = results[0].value;
        if (profileData.student) {
          setStudent(profileData.student);
          setEvidences(profileData.evidences || []);
          setTargetCareer(profileData.targetCareer || null);
        }
      }

      if (results[1].status === 'fulfilled' && results[1].value) {
        setJobs(results[1].value || []);
      }

      if (results[2].status === 'fulfilled' && results[2].value) {
        setApplications(results[2].value || []);
      }

      if (results[3].status === 'fulfilled' && results[3].value) {
        setNotifications(results[3].value || []);
      }

      if (results[4].status === 'fulfilled' && results[4].value) {
        setAllStudents(results[4].value || []);
      }

      // Initialize / sync Firestore NoSQL real-time collections with initial dataset if empty
      initializeFirestoreDatabase({
        jobs: results[1].status === 'fulfilled' ? results[1].value : undefined,
        students: results[4].status === 'fulfilled' && results[4].value?.length ? results[4].value : (results[0].status === 'fulfilled' && results[0].value?.student ? [results[0].value.student] : undefined),
        applications: results[2].status === 'fulfilled' ? results[2].value : undefined,
        evidences: results[0].status === 'fulfilled' && results[0].value?.evidences ? results[0].value.evidences : undefined,
        notifications: results[3].status === 'fulfilled' ? results[3].value : undefined
      }).catch(err => console.warn('Firestore database initialization note:', err));
    } catch (err) {
      console.warn('Notice during data synchronization:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real-Time NoSQL Database Subscriptions (Firebase Firestore)
  useEffect(() => {
    let unsubJobs: (() => void) | undefined;
    let unsubApps: (() => void) | undefined;
    let unsubNotifs: (() => void) | undefined;
    let unsubEvidences: (() => void) | undefined;

    try {
      // Real-time synchronization of published jobs
      unsubJobs = subscribeToRealtimeJobs(realtimeJobs => {
        if (realtimeJobs && realtimeJobs.length > 0) {
          setJobs(realtimeJobs);
        }
      });

      // Real-time synchronization of candidate application pipeline
      unsubApps = subscribeToRealtimeApplications(realtimeApps => {
        if (realtimeApps && realtimeApps.length > 0) {
          setApplications(realtimeApps);
        }
      });

      // Real-time synchronization of verified skill artifacts
      if (student?.id) {
        unsubEvidences = subscribeToRealtimeEvidences(student.id, realtimeEvs => {
          if (realtimeEvs && realtimeEvs.length > 0) {
            setEvidences(realtimeEvs);
          }
        });
      }

      // Real-time notifications listener
      const currentUid = firebaseUser?.uid || (authUser?.id || 'usr_student_01');
      unsubNotifs = subscribeToRealtimeNotifications(currentUid, realtimeNotifs => {
        if (realtimeNotifs) {
          setNotifications(realtimeNotifs);
        }
      });
    } catch (e) {
      console.warn('Real-time database subscription notice:', e);
    }

    return () => {
      if (unsubJobs) unsubJobs();
      if (unsubApps) unsubApps();
      if (unsubNotifs) unsubNotifs();
      if (unsubEvidences) unsubEvidences();
    };
  }, [student?.id, firebaseUser?.uid, authUser?.id]);

  const handleRoleSwitch = async (role: 'student' | 'company' | 'admin') => {
    setActiveRole(role);
    try {
      await api.switchDemo(role);
    } catch (e) {
      console.error('Failed to switch demo role on backend', e);
    }
    if (role === 'student') setActiveTab('dashboard');
    else if (role === 'company') setActiveTab('company-dashboard');
    else if (role === 'admin') setActiveTab('admin-portal');
  };

  const handleApplyJob = async (jobId: string) => {
    await api.applyJob(jobId);
    await loadAllData();
  };

  const handleTakeAssessment = (skillName: string) => {
    setAssessmentTargetSkill(skillName);
    setActiveTab('assessments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetSeed = async () => {
    await api.resetDemoData();
    await loadAllData();
    setActiveTab('dashboard');
  };

  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Check auth states first
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-600">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center animate-pulse mb-3 shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Checking credentials...</p>
        <p className="text-xs text-slate-500 mt-1">Authenticating with Nexminds platform</p>
      </div>
    );
  }

  // Not signed in -> Show Auth Modal
  if (!firebaseUser && !authUser) {
    return <AuthModal />;
  }

  // Signed in but role not selected yet -> Show Role Selection
  if (needsRoleSelection) {
    return <RoleSelectionScreen />;
  }

  // Signed in, role selected, but onboarding not completed -> Show Onboarding
  if (needsOnboarding) {
    if (authRole === 'company') {
      return <CompanyOnboarding />;
    }
    return <StudentOnboarding />;
  }

  const currentUser: User = authUser || (firebaseUser ? {
    id: firebaseUser.uid,
    email: firebaseUser.email || 'user@nexminds.dev',
    name: firebaseUser.displayName || 'Nexminds Member',
    role: activeRole,
    createdAt: new Date().toISOString()
  } : {
    id: 'usr_student_01',
    email: 'student01@nexminds.demo',
    name: 'Nexminds Student',
    role: activeRole,
    createdAt: new Date().toISOString()
  });

  interface TabItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const studentTabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume & ATS', icon: FileText },
    { id: 'skills-graph', label: 'Skills & Evidence', icon: ShieldCheck, badge: evidences.length },
    { id: 'skills-gap', label: 'Skill Gap & GPS', icon: Compass },
    { id: 'jobs', label: 'Job Matching', icon: Briefcase, badge: jobs.length },
    { id: 'applications', label: 'Applications', icon: Clock, badge: applications.length },
    { id: 'assessments', label: 'Assessments', icon: Award },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'career-doctor', label: 'Career Doctor', icon: Activity },
    { id: 'chat', label: 'AI Advisor', icon: MessageSquare }
  ];

  const companyTabs: TabItem[] = [
    { id: 'company-dashboard', label: 'Candidate Pipeline', icon: Users },
    { id: 'jobs', label: 'All Jobs', icon: Briefcase }
  ];

  const adminTabs: TabItem[] = [
    { id: 'admin-portal', label: 'Administration & Insights', icon: ShieldCheck }
  ];

  const currentTabs =
    activeRole === 'student'
      ? studentTabs
      : activeRole === 'company'
      ? companyTabs
      : adminTabs;

  if (loading && !student && activeRole === 'student') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-600">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center animate-pulse mb-3 shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Loading Career Portal...</p>
        <p className="text-xs text-slate-500 mt-1">Preparing your real profile and job matches</p>
      </div>
    );
  }

  // Active student fallback if student object is still resolving
  const fallbackUserId = firebaseUser?.uid || currentUser?.id || 'usr_student_01';
  const currentStudent: Student = student || {
    id: `std_${fallbackUserId.substring(0, 10)}`,
    userId: fallbackUserId,
    name: firebaseUser?.displayName || currentUser?.name || 'Nexminds Student',
    email: firebaseUser?.email || currentUser?.email || 'student@nexminds.dev',
    college: authStudentProfile?.college || 'University Partner',
    degree: authStudentProfile?.degree || 'Bachelor of Science',
    graduationYear: authStudentProfile?.graduationYear || 2026,
    careerGoal: authStudentProfile?.careerGoal || 'AI Engineer',
    targetCareerId: authStudentProfile?.targetCareerId || 'car_ai_eng',
    skills: authStudentProfile?.skills || [],
    projects: authStudentProfile?.projects || [],
    careerReadinessScore: authStudentProfile?.careerReadinessScore || 70,
    resumeScore: authStudentProfile?.resumeScore || 75,
    lastActive: new Date().toISOString()
  };

  const currentCareerGoal: CareerGoal = targetCareer || {
    id: 'car_ai_eng',
    title: currentStudent.careerGoal || 'AI Engineer',
    description: 'Design and deploy scalable machine learning architectures and generative models.',
    requiredSkills: ['Python', 'PyTorch', 'Machine Learning', 'API Development', 'Docker'],
    preferredSkills: ['Kubernetes', 'FastAPI', 'MLOps'],
    averageSalary: '$135,000 / yr',
    demandLevel: 'high'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Global Navigation */}
      <Navbar
        user={currentUser}
        activeRole={activeRole}
        onSwitchRole={handleRoleSwitch}
        currentStudent={currentStudent}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onResetSeed={handleResetSeed}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSignOut={signOut}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Workspace: Features Arranged Vertically on Left Side */}
      <div className="flex-1 flex w-full">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeRole={activeRole}
          student={currentStudent}
          targetCareer={currentCareerGoal}
          currentUser={currentUser}
          jobsCount={jobs.length}
          evidencesCount={evidences.length}
          applicationsCount={applications.length}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main View Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {activeRole === 'student' && (
              <>
                {activeTab === 'dashboard' && (
                  <StudentDashboard
                    student={currentStudent}
                    evidences={evidences}
                    targetCareer={currentCareerGoal}
                    jobs={jobs}
                    onSelectTab={setActiveTab}
                    onApplyJob={handleApplyJob}
                    onTakeAssessment={handleTakeAssessment}
                  />
                )}
                {activeTab === 'resume' && (
                  <ResumeIntelligence
                    student={currentStudent}
                    onRefreshProfile={loadAllData}
                  />
                )}
                {activeTab === 'skills-graph' && (
                  <SkillsEvidenceGraph
                    student={currentStudent}
                    evidences={evidences}
                    onRefreshProfile={loadAllData}
                    onTakeAssessment={handleTakeAssessment}
                  />
                )}
                {activeTab === 'skills-gap' && (
                  <SkillGapEngine
                    student={currentStudent}
                    targetCareer={currentCareerGoal}
                    onTakeAssessment={handleTakeAssessment}
                    onSelectTab={setActiveTab}
                  />
                )}
                {activeTab === 'jobs' && (
                  <JobBoard
                    jobs={jobs}
                    student={currentStudent}
                    onApplyJob={handleApplyJob}
                    onSelectTab={setActiveTab}
                  />
                )}
                {activeTab === 'applications' && (
                  <ApplicationsTracker
                    applications={applications}
                    onSelectTab={setActiveTab}
                  />
                )}
                {activeTab === 'assessments' && (
                  <AssessmentsHub
                    initialSkill={assessmentTargetSkill}
                    onRefreshProfile={loadAllData}
                    onSelectTab={setActiveTab}
                  />
                )}
                {activeTab === 'courses' && (
                  <CoursesAndLearning
                    student={currentStudent}
                    onRefreshProfile={loadAllData}
                    onSelectTab={setActiveTab}
                  />
                )}
                {activeTab === 'career-doctor' && (
                  <CareerDoctor
                    student={currentStudent}
                    onTakeAssessment={handleTakeAssessment}
                    onSelectTab={setActiveTab}
                  />
                )}
                {activeTab === 'chat' && (
                  <AIChatAssistant
                    student={currentStudent}
                    onSelectTab={setActiveTab}
                  />
                )}
              </>
            )}

            {activeRole === 'company' && (
              <>
                {activeTab === 'company-dashboard' && (
                  <CompanyPortal onRefreshData={loadAllData} />
                )}
                {activeTab === 'jobs' && (
                  <JobBoard
                    jobs={jobs}
                    student={currentStudent}
                    onApplyJob={handleApplyJob}
                    onSelectTab={setActiveTab}
                  />
                )}
              </>
            )}

            {activeRole === 'admin' && (
              <AdminPortal />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Nexminds. All rights reserved. Capability intelligence & career readiness platform.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Verified Skills Evaluation</span>
            <span>•</span>
            <span>AI Career Guidance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
