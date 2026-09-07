import { auth } from '../lib/firebase';
import {
  saveApplicationToFirestore,
  updateApplicationStatusInFirestore,
  saveJobToFirestore,
  saveEvidenceToFirestore,
  saveStudentToFirestore,
  markNotificationReadInFirestore
} from './firestoreService';
import {
  User,
  Student,
  Company,
  Job,
  Application,
  SkillEvidence,
  CareerGoal,
  Course,
  Assessment,
  Notification,
  ResumeAnalysisResult,
  SkillGapAnalysis,
  OneSkillAwaySimulation,
  CandidateRankItem,
  CertifiedInternship,
  CertificateRecord,
  InternshipApplication,
  ResumeBulletOptimization,
  MicroTrial,
  MicroTrialSubmission,
  MicroTrialEvaluation
} from '../types';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  try {
    const savedSession = localStorage.getItem('careerai_demo_session');
    if (savedSession) {
      const u = JSON.parse(savedSession);
      if (u.id) headers['x-user-id'] = u.id;
      if (u.email) headers['x-user-email'] = u.email;
      if (u.name) headers['x-user-name'] = encodeURIComponent(u.name);
      if (u.role) headers['x-user-role'] = u.role;
    }
  } catch {}

  if (!headers['x-user-id']) {
    const savedId = localStorage.getItem('careerai_user_id');
    const savedEmail = localStorage.getItem('careerai_user_email');
    const savedName = localStorage.getItem('careerai_user_name');
    const savedRole = localStorage.getItem('careerai_user_role');
    if (savedId) headers['x-user-id'] = savedId;
    if (savedEmail) headers['x-user-email'] = savedEmail;
    if (savedName) headers['x-user-name'] = encodeURIComponent(savedName);
    if (savedRole) headers['x-user-role'] = savedRole;
  }

  const currentUser = auth.currentUser;
  if (!headers['x-user-id'] && currentUser) {
    headers['x-user-id'] = currentUser.uid;
    headers['x-user-email'] = currentUser.email || '';
    if (currentUser.displayName) {
      headers['x-user-name'] = encodeURIComponent(currentUser.displayName);
    }
  }

  const savedRole = localStorage.getItem('careerai_user_role');
  if (savedRole && !headers['x-user-role']) {
    headers['x-user-role'] = savedRole;
  }

  const savedStudentId = localStorage.getItem('careerai_student_id');
  if (savedStudentId && !headers['x-student-id']) {
    headers['x-student-id'] = savedStudentId;
  }

  return headers;
}

export const api = {
  // Auth
  async getMe(): Promise<{ user: User; profile: any }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/auth/me', { headers });
    return res.json();
  },

  async switchDemo(role?: 'student' | 'company' | 'admin', email?: string, studentId?: string): Promise<{ user: User; profile: any }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/auth/switch-demo', {
      method: 'POST',
      headers,
      body: JSON.stringify({ role, email, studentId })
    });
    const data = await res.json();
    if (data.user) {
      localStorage.setItem('careerai_user_id', data.user.id);
      localStorage.setItem('careerai_user_email', data.user.email);
      localStorage.setItem('careerai_user_name', data.user.name);
      localStorage.setItem('careerai_user_role', data.user.role);
      localStorage.setItem('careerai_demo_session', JSON.stringify(data.user));
      if (data.profile?.id && data.user.role === 'student') {
        localStorage.setItem('careerai_student_id', data.profile.id);
      }
    }
    return data;
  },

  async switchStudent(studentId: string): Promise<{ user: User; profile: Student }> {
    localStorage.setItem('careerai_student_id', studentId);
    const headers = await getAuthHeaders();
    headers['x-student-id'] = studentId;
    const res = await fetch('/api/auth/switch-demo', {
      method: 'POST',
      headers,
      body: JSON.stringify({ role: 'student', studentId })
    });
    const data = await res.json();
    if (data.user) {
      localStorage.setItem('careerai_user_id', data.user.id);
      localStorage.setItem('careerai_user_email', data.user.email);
      localStorage.setItem('careerai_user_name', data.user.name);
      localStorage.setItem('careerai_user_role', 'student');
      localStorage.setItem('careerai_demo_session', JSON.stringify(data.user));
    }
    return data;
  },

  async getStudents(): Promise<Student[]> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/students', { headers });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch students', e);
    }
    return [];
  },

  async getStudentById(id: string): Promise<{ student: Student; evidences: SkillEvidence[]; targetCareer: CareerGoal }> {
    const headers = await getAuthHeaders();
    headers['x-student-id'] = id;
    const res = await fetch(`/api/students/${id}`, { headers });
    return res.json();
  },

  async login(email: string): Promise<{ user: User; profile: any }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    if (data.user) {
      localStorage.setItem('careerai_user_id', data.user.id);
      localStorage.setItem('careerai_user_email', data.user.email);
      localStorage.setItem('careerai_user_name', data.user.name);
      localStorage.setItem('careerai_user_role', data.user.role);
      localStorage.setItem('careerai_demo_session', JSON.stringify(data.user));
      if (data.profile?.id && data.user.role === 'student') {
        localStorage.setItem('careerai_student_id', data.profile.id);
      }
    }
    return data;
  },

  // Student Profile
  async getStudentProfile(studentId?: string): Promise<{ student: Student; evidences: SkillEvidence[]; targetCareer: CareerGoal }> {
    try {
      const headers = await getAuthHeaders();
      if (studentId) {
        headers['x-student-id'] = studentId;
      }
      const res = await fetch('/api/students/profile', { headers });
      if (res.ok) {
        return await res.json();
      }
      console.warn('Student profile endpoint returned status:', res.status);
    } catch (e) {
      console.warn('Network or server error fetching student profile:', e);
    }

    const currentUserId = localStorage.getItem('careerai_user_id') || 'usr_student';
    const currentUserName = localStorage.getItem('careerai_user_name') || 'Student Member';
    const currentUserEmail = localStorage.getItem('careerai_user_email') || 'student@nexminds.dev';

    return {
      student: {
        id: `std_${currentUserId.replace(/[^a-zA-Z0-9]/g, '_')}`,
        userId: currentUserId,
        name: currentUserName,
        email: currentUserEmail,
        college: 'Campus Technical Institute',
        degree: 'B.Tech in Computer Science',
        graduationYear: 2026,
        cgpa: 8.5,
        careerGoal: 'AI Engineer',
        targetCareerId: 'career_ai_eng',
        profileCompletion: 50,
        careerReadinessScore: 60,
        skills: [
          { skillId: 'sk_py', name: 'Python', level: 75, confidence: 0.8, lastDemonstrated: new Date().toISOString(), evidenceCount: 1, freshness: 'recent' },
          { skillId: 'sk_ml', name: 'Machine Learning', level: 70, confidence: 0.75, lastDemonstrated: new Date().toISOString(), evidenceCount: 1, freshness: 'recent' }
        ],
        education: [],
        projects: [],
        experience: [],
        certifications: [],
        updatedAt: new Date().toISOString()
      },
      evidences: [],
      targetCareer: {
        id: 'career_ai_eng',
        title: 'AI Engineer',
        description: 'Design, build, and deploy production machine learning architectures.',
        domain: 'Artificial Intelligence',
        avgSalary: '₹14,00,000 - ₹22,00,000 / yr',
        growthRate: '+38% YoY',
        requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'SQL']
      }
    };
  },

  async getEvidences(): Promise<SkillEvidence[]> {
    const profile = await this.getStudentProfile();
    return profile.evidences || [];
  },

  async getTargetCareer(): Promise<CareerGoal> {
    const profile = await this.getStudentProfile();
    return profile.targetCareer;
  },

  async resetDemoData(): Promise<void> {
    return this.resetSeed();
  },

  async parseJobDescription(rawText: string): Promise<any> {
    return this.extractJobWithAI(rawText);
  },

  async updateStudentProfile(updates: Partial<Student>): Promise<Student> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/students/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (data && data.id) {
      saveStudentToFirestore(data).catch(e => console.warn('Firestore sync note:', e));
    }
    return data;
  },

  async getCompanyProfile(): Promise<Company> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/company/profile', { headers });
    if (!res.ok) throw new Error('Failed to fetch company profile');
    return res.json();
  },

  async updateCompanyProfile(updates: Partial<Company>): Promise<Company> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/company/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update company profile');
    return res.json();
  },

  async uploadResume(
    resumeText: string,
    fileName?: string,
    targetJobId?: string,
    jobDescription?: string
  ): Promise<{ success: boolean; analysis: ResumeAnalysisResult }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/students/resume/upload', {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, fileName, targetJobId, jobDescription })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload resume');
    }
    return res.json();
  },

  async optimizeResumeBullet(bulletText: string, targetRole?: string): Promise<ResumeBulletOptimization> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/students/resume/optimize-bullet', {
      method: 'POST',
      headers,
      body: JSON.stringify({ bulletText, targetRole })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to optimize bullet');
    }
    return res.json();
  },

  async getGapAnalysis(): Promise<{ analysis: SkillGapAnalysis; targetCareer: CareerGoal }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/students/gap-analysis', { headers });
    return res.json();
  },

  async getCareers(): Promise<CareerGoal[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/careers', { headers });
    if (!res.ok) return [];
    return res.json();
  },

  async getOneSkillAway(): Promise<OneSkillAwaySimulation[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/students/one-skill-away', { headers });
    return res.json();
  },

  async addEvidence(data: {
    skill: string;
    sourceType: string;
    sourceTitle: string;
    details?: string;
    confidence?: number;
  }): Promise<{ success: boolean; evidence: SkillEvidence }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/students/evidence/add', {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result && result.evidence) {
      saveEvidenceToFirestore(result.evidence).catch(e => console.warn('Firestore sync note:', e));
    }
    return result;
  },

  // Jobs
  async getJobs(options?: { companyOnly?: boolean; companyId?: string; type?: string }): Promise<Array<Job & { matchResult?: any }>> {
    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (options?.companyOnly) params.append('companyOnly', 'true');
    if (options?.companyId) params.append('companyId', options.companyId);
    if (options?.type) params.append('type', options.type);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/jobs${queryString}`, { headers });
    return res.json();
  },

  async getJob(id: string): Promise<{ job: Job; matchResult?: any }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/jobs/${id}`, { headers });
    return res.json();
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/jobs/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(jobData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create job');
    }
    const job = await res.json();
    if (job && job.id) {
      saveJobToFirestore(job).catch(e => console.warn('Firestore sync note:', e));
    }
    return job;
  },

  async applyToJob(jobId: string): Promise<{ success: boolean; application: Application }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: 'POST',
      headers
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to apply');
    }
    const result = await res.json();
    if (result && result.application) {
      saveApplicationToFirestore(result.application).catch(e => console.warn('Firestore sync note:', e));
    }
    return result;
  },

  async applyJob(jobId: string): Promise<{ success: boolean; application: Application }> {
    return this.applyToJob(jobId);
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/applications', { headers });
    return res.json();
  },

  async updateApplicationStatus(appId: string, status: string, note?: string): Promise<Application> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/applications/${appId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status, note })
    });
    const updated = await res.json();
    updateApplicationStatusInFirestore(appId, status as any, note).catch(e => console.warn('Firestore sync note:', e));
    return updated;
  },

  // Mandatory Opportunity Assessment
  async getOpportunityAssessment(id: string): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/opportunities/${id}/assessment`, { headers });
    if (!res.ok) throw new Error('Failed to fetch opportunity assessment');
    return res.json();
  },

  async submitOpportunityAssessment(id: string, answers: Record<string, number>): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/opportunities/${id}/assessment-attempt`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answers })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit assessment attempt');
    }
    return res.json();
  },

  // Recruiter Feedback & Evaluation Loop
  async submitApplicationFeedback(appId: string, feedback: {
    status: string;
    primaryReason?: string;
    skillGapsIdentified?: string[];
    internalHRNotes?: string;
    studentFeedback?: string;
  }): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/applications/${appId}/feedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify(feedback)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit evaluation feedback');
    }
    const result = await res.json();
    updateApplicationStatusInFirestore(
      appId,
      feedback.status as any,
      feedback.internalHRNotes,
      feedback as any
    ).catch(e => console.warn('Firestore sync note:', e));
    return result;
  },

  async getApplicationImprovementPlan(appId: string): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/applications/${appId}/improvement-plan`, { headers });
    if (!res.ok) throw new Error('Failed to fetch improvement plan');
    return res.json();
  },

  async getRecruitmentAnalytics(): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/recruitment-analytics', { headers });
    if (!res.ok) throw new Error('Failed to fetch recruitment analytics');
    return res.json();
  },

  // Company Candidate Ranking
  async getJobCandidates(jobId: string): Promise<CandidateRankItem[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/company/jobs/${jobId}/candidates`, { headers });
    return res.json();
  },

  async getCompanies(): Promise<Company[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/companies', { headers });
    if (!res.ok) return [];
    return res.json();
  },

  // Courses & Learning
  async getCourses(): Promise<Course[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/courses', { headers });
    return res.json();
  },

  async getLearningProgress(): Promise<any[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/learning/progress', { headers });
    return res.json();
  },

  // Assessments
  async getAssessments(): Promise<any[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/assessments', { headers });
    return res.json();
  },

  async getAssessment(id: string): Promise<Assessment> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/assessments/${id}`, { headers });
    return res.json();
  },

  async submitAssessment(
    id: string,
    answers: Record<string, number>,
    metadata?: {
      timeUsedSeconds?: number;
      isProctored?: boolean;
      tabSwitchCount?: number;
      fullscreenExitCount?: number;
      cameraInterruptions?: number;
      microphoneInterruptions?: number;
      integrityEvents?: any[];
    }
  ): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/assessments/${id}/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answers, ...(metadata || {}) })
    });
    return res.json();
  },

  // AI
  async extractJobWithAI(rawText: string): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai/job-extract', {
      method: 'POST',
      headers,
      body: JSON.stringify({ rawText })
    });
    return res.json();
  },

  async getCareerDoctor(): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai/career-doctor', { headers });
    return res.json();
  },

  async sendChatMessage(
    messages: Array<{ role: string; content: string }>,
    options?: { taskMode?: 'general' | 'fast' | 'complex'; roleType?: string }
  ): Promise<{ message: string; modelUsed?: string; taskMode?: string }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        taskMode: options?.taskMode || 'general',
        roleType: options?.roleType || 'advisor'
      })
    });
    const data = await res.json();
    return {
      message: data.message || 'No response from AI copilot.',
      modelUsed: data.modelUsed,
      taskMode: data.taskMode
    };
  },

  async generateCoverLetter(jobId: string, customNotes?: string): Promise<string> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai/cover-letter', {
      method: 'POST',
      headers,
      body: JSON.stringify({ jobId, customNotes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate cover letter');
    }
    const data = await res.json();
    return data.coverLetter;
  },

  // Industry Insights
  async getIndustryInsights(): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/industry/insights', { headers });
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/notifications', { headers });
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    await fetch(`/api/notifications/${id}/read`, { method: 'POST', headers });
    markNotificationReadInFirestore(id).catch(e => console.warn('Firestore sync note:', e));
  },

  // Admin
  async getAdminMetrics(): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/metrics', { headers });
    return res.json();
  },

  async getAdminIndustries(): Promise<any[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/industries', { headers });
    return res.json();
  },

  async addAdminIndustry(industry: any): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/industries', {
      method: 'POST',
      headers,
      body: JSON.stringify(industry)
    });
    return res.json();
  },

  async updateAdminIndustry(id: string, industry: any): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/industries/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(industry)
    });
    return res.json();
  },

  async deleteAdminIndustry(id: string): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/industries/${id}`, {
      method: 'DELETE',
      headers
    });
    return res.json();
  },

  async getCertifiedInternships(): Promise<CertifiedInternship[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/certified-internships', { headers });
    if (!res.ok) throw new Error('Failed to fetch certified internships');
    return res.json();
  },

  async getCertifiedInternship(id: string): Promise<CertifiedInternship> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/certified-internships/${id}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch certified internship');
    return res.json();
  },

  async applyCertifiedInternship(id: string): Promise<{ success: boolean; application: InternshipApplication }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/certified-internships/${id}/apply`, {
      method: 'POST',
      headers
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to apply for certified internship');
    }
    return res.json();
  },

  async getCertifiedInternshipApplications(): Promise<InternshipApplication[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/certified-internships/applications', { headers });
    if (!res.ok) throw new Error('Failed to fetch internship applications');
    return res.json();
  },

  async updateCertifiedInternshipAppStatus(
    id: string,
    status: string,
    assessmentScore?: number,
    notes?: string
  ): Promise<{ success: boolean; application: InternshipApplication; certificate?: CertificateRecord }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/certified-internships/applications/${id}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status, assessmentScore, notes })
    });
    if (!res.ok) throw new Error('Failed to update application status');
    return res.json();
  },

  async createCertifiedInternship(data: Partial<CertifiedInternship>): Promise<CertifiedInternship> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/certified-internships', {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create certified internship');
    return res.json();
  },

  async updateCertifiedInternship(id: string, data: Partial<CertifiedInternship>): Promise<CertifiedInternship> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/certified-internships/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update certified internship');
    return res.json();
  },

  async verifyCertificate(certificateId: string): Promise<{ verified: boolean; certificate: CertificateRecord; internship: any }> {
    const res = await fetch(`/api/certificates/verify/${encodeURIComponent(certificateId)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Certificate not found or invalid');
    }
    return res.json();
  },

  async getCertifiedInternshipsAnalytics(): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/certified-internships-analytics', { headers });
    if (!res.ok) throw new Error('Failed to fetch certified internship analytics');
    return res.json();
  },

  // Micro-Trial Hiring Engine APIs
  async getMicroTrials(params?: { jobId?: string; companyId?: string; type?: string; status?: string }): Promise<MicroTrial[]> {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams();
    if (params?.jobId) query.set('jobId', params.jobId);
    if (params?.companyId) query.set('companyId', params.companyId);
    if (params?.type) query.set('type', params.type);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    const res = await fetch(`/api/micro-trials${qs ? `?${qs}` : ''}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch micro-trials');
    return res.json();
  },

  async getMicroTrial(id: string): Promise<{ trial: MicroTrial; userContext: any }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/micro-trials/${encodeURIComponent(id)}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch micro-trial');
    return res.json();
  },

  async createMicroTrial(trialData: Partial<MicroTrial>): Promise<{ success: boolean; microTrial: MicroTrial }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/micro-trials/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(trialData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create micro-trial');
    }
    return res.json();
  },

  async updateMicroTrial(id: string, updates: Partial<MicroTrial>): Promise<{ success: boolean; microTrial: MicroTrial }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/micro-trials/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update micro-trial');
    return res.json();
  },

  async deleteMicroTrial(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/micro-trials/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) throw new Error('Failed to delete micro-trial');
  },

  async startMicroTrial(id: string): Promise<{ success: boolean; attemptNumber: number; timeLimitMinutes: number; startedAt: string; trial: MicroTrial }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/micro-trials/${encodeURIComponent(id)}/start`, {
      method: 'POST',
      headers
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to start micro-trial');
    }
    return res.json();
  },

  async submitMicroTrial(
    id: string,
    submissionData: {
      content: string;
      repositoryUrl?: string;
      submissionType?: 'code' | 'repository' | 'file_bundle';
      executionTimeSeconds?: number;
      integritySignals?: any;
    }
  ): Promise<{
    success: boolean;
    submission: MicroTrialSubmission;
    evaluation: MicroTrialEvaluation;
    matchImprovement: { matchBefore: number; matchAfter: number; improvement: number; strengthenedSkills: any[] };
  }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/micro-trials/${encodeURIComponent(id)}/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(submissionData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit micro-trial');
    }
    return res.json();
  },

  async getTrialSubmissions(trialId: string): Promise<any[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/micro-trials/${encodeURIComponent(trialId)}/submissions`, { headers });
    if (!res.ok) throw new Error('Failed to fetch submissions');
    return res.json();
  },

  async getTrialSubmissionEvaluation(id: string): Promise<{ evaluation: MicroTrialEvaluation; submission: MicroTrialSubmission; trial: MicroTrial }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/micro-trials/submissions/${encodeURIComponent(id)}/evaluation`, { headers });
    if (!res.ok) throw new Error('Failed to fetch submission evaluation');
    return res.json();
  },

  async reviewTrialSubmission(id: string, reviewData: { decision: string; notes?: string; candidateFeedback?: string }): Promise<{ success: boolean; evaluation: MicroTrialEvaluation }> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/micro-trials/submissions/${encodeURIComponent(id)}/review`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  async generateMicroTrialWithAI(specs: { jobTitle: string; jobDescription?: string; requiredSkills: string[] }): Promise<{ success: boolean; draftTrial: Partial<MicroTrial> }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai/micro-trial/generate', {
      method: 'POST',
      headers,
      body: JSON.stringify(specs)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate trial');
    }
    return res.json();
  },

  async getMicroTrialAnalytics(): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/micro-trials/analytics', { headers });
    if (!res.ok) throw new Error('Failed to fetch micro-trial analytics');
    return res.json();
  },

  async resetSeed(): Promise<void> {
    const headers = await getAuthHeaders();
    await fetch('/api/system/reset-seed', { method: 'POST', headers });
  }
};
