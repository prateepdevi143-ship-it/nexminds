export type UserRole = 'student' | 'company' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
  status?: 'active' | 'suspended';
  isDemo?: boolean;
}

export interface Industry {
  id: string;
  name: string;
  sector: string;
  region: string;
  description?: string;
  activeCompaniesCount?: number;
  inDemandSkills?: string[];
  growthRate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  department: string;
  startYear: number;
  graduationYear: number;
  cgpa: number;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface StudentSkill {
  skillId: string;
  name: string;
  level: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  lastDemonstrated: string; // ISO date
  evidenceCount: number;
  freshness: 'recent' | 'needs_refresh' | 'stale';
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  college: string;
  degree: string;
  graduationYear: number;
  cgpa: number;
  bio?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  careerGoal: string; // e.g. "AI Engineer"
  targetCareerId?: string;
  profileCompletion: number; // 0 - 100
  careerReadinessScore: number; // 0 - 100
  skills: StudentSkill[];
  education: Education[];
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
  resumeUrl?: string;
  resumeFileName?: string;
  resumeScore?: number;
  updatedAt: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  email: string;
  industry: string;
  location: string;
  website: string;
  size: string;
  description: string;
  logoUrl?: string;
  verified: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  salaryRange: string;
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior' | 'Lead';
  educationRequirement: string;
  requiredSkills: string[];
  preferredSkills: string[];
  skillWeights?: Record<string, number>;
  deadline: string;
  status: 'published' | 'draft' | 'closed';
  applicantCount: number;
  createdAt: string;
}

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'rejected'
  | 'withdrawn';

export interface ApplicationTimelineEvent {
  status: ApplicationStatus;
  date: string;
  note?: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentDegree: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  resumeId?: string;
  resumeFileName?: string;
  matchScoreAtApplication: number;
  candidateScore: number;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  timeline: ApplicationTimelineEvent[];
}

export interface SkillEvidence {
  id: string;
  studentId: string;
  skill: string;
  sourceType: 'resume' | 'project' | 'assessment' | 'course' | 'github' | 'experience';
  sourceId?: string;
  sourceTitle: string;
  confidence: number;
  date: string;
  details?: string;
}

export interface CanonicalSkill {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  relatedSkills: string[];
  description?: string;
}

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  domain: string;
  avgSalary: string;
  growthRate: string;
  requiredSkills: string[];
  preferredSkills: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  provider: string;
  url: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  category: string;
  rating: number;
  totalLessons: number;
}

export interface LearningProgress {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  progress: number; // 0 - 100
  completed: boolean;
  startedAt: string;
  lastActivity: string;
  completedLessons: number;
  totalLessons: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number; // e.g. 70
  questions: AssessmentQuestion[];
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  assessmentId: string;
  skillId: string;
  skillName: string;
  score: number;
  passed: boolean;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job' | 'application' | 'course' | 'assessment' | 'evidence' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ResumeAnalysisResult {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    college?: string;
    degree?: string;
    graduationYear?: number;
    cgpa?: number;
  };
  skills: Array<{
    name: string;
    confidence: number;
    category?: string;
  }>;
  projects: Array<{
    name: string;
    technologies: string[];
    description: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration?: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year?: string;
  }>;
  resumeScore: number;
  atsCompatibility: number;
  strengths: string[];
  improvements: string[];
  careerSignals: string[];
}

export interface SkillGapAnalysis {
  targetCareer: string;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: Array<{
    skill: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    priorityScore: number;
    careerRelevance: number;
    opportunityImpact: number;
    learningEffort: 'Low' | 'Medium' | 'High';
  }>;
  overallMatchScore: number;
}

export interface OneSkillAwaySimulation {
  skill: string;
  originalScore: number;
  simulatedScore: number;
  scoreGain: number;
  unlockedJobsCount: number;
  careerImpact: string;
}

export interface CandidateRankItem {
  application: Application;
  student: Student;
  skillMatch: number;
  evidenceConfidence: number;
  experienceYears: number;
  assessmentScore: number;
  overallCandidateScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}
