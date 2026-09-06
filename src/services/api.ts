import { auth } from '../lib/firebase';
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

  async switchDemo(role?: 'student' | 'company' | 'admin', email?: string): Promise<{ user: User; profile: any }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/auth/switch-demo', {
      method: 'POST',
      headers,
      body: JSON.stringify({ role, email })
    });
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
    return res.json();
  },

  // Student Profile
  async getStudentProfile(): Promise<{ student: Student; evidences: SkillEvidence[]; targetCareer: CareerGoal }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/students/profile', { headers });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
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
    return res.json();
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
    return res.json();
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
    return res.json();
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
    return res.json();
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
