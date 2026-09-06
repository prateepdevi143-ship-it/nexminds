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
  CandidateRankItem
} from '../types';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  const currentUser = auth.currentUser;
  if (currentUser) {
    headers['x-user-id'] = currentUser.uid;
    headers['x-user-email'] = currentUser.email || '';
    if (currentUser.displayName) {
      headers['x-user-name'] = encodeURIComponent(currentUser.displayName);
    }
  } else {
    try {
      const savedSession = localStorage.getItem('careerai_demo_session');
      if (savedSession) {
        const u = JSON.parse(savedSession);
        if (u.id) headers['x-user-id'] = u.id;
        if (u.email) headers['x-user-email'] = u.email;
        if (u.name) headers['x-user-name'] = encodeURIComponent(u.name);
      } else {
        const savedId = localStorage.getItem('careerai_user_id');
        const savedEmail = localStorage.getItem('careerai_user_email');
        const savedName = localStorage.getItem('careerai_user_name');
        if (savedId) headers['x-user-id'] = savedId;
        if (savedEmail) headers['x-user-email'] = savedEmail;
        if (savedName) headers['x-user-name'] = encodeURIComponent(savedName);
      }
    } catch {}
  }

  const savedStudentId = localStorage.getItem('careerai_student_id');
  if (savedStudentId) {
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

    // Safe fallback profile to keep app running smoothly
    return {
      student: {
        id: 'std_01',
        userId: 'usr_student_01',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@campus.edu',
        college: 'Indian Institute of Information Technology',
        degree: 'B.Tech in Computer Science and Engineering',
        graduationYear: 2026,
        cgpa: 8.7,
        careerGoal: 'AI Engineer',
        targetCareerId: 'career_ai_eng',
        profileCompletion: 85,
        careerReadinessScore: 78,
        skills: [
          { name: 'Python', level: 90, confidence: 0.9, verified: true, evidenceCount: 3, freshness: 'recent', lastDemonstrated: new Date().toISOString() },
          { name: 'Machine Learning', level: 85, confidence: 0.85, verified: true, evidenceCount: 2, freshness: 'recent', lastDemonstrated: new Date().toISOString() },
          { name: 'PyTorch', level: 75, confidence: 0.75, verified: false, evidenceCount: 1, freshness: 'recent', lastDemonstrated: new Date().toISOString() }
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

  async uploadResume(resumeText: string, fileName?: string): Promise<{ success: boolean; analysis: ResumeAnalysisResult }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/students/resume/upload', {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, fileName })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload resume');
    }
    return res.json();
  },

  async getGapAnalysis(): Promise<{ analysis: SkillGapAnalysis; targetCareer: CareerGoal }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/students/gap-analysis', { headers });
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
  async getJobs(): Promise<Array<Job & { matchResult?: any }>> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/jobs', { headers });
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

  async submitAssessment(id: string, answers: Record<string, number>): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/assessments/${id}/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answers })
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

  async sendChatMessage(messages: Array<{ role: string; content: string }>): Promise<string> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages })
    });
    const data = await res.json();
    return data.message;
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

  async resetSeed(): Promise<void> {
    const headers = await getAuthHeaders();
    await fetch('/api/system/reset-seed', { method: 'POST', headers });
  }
};
