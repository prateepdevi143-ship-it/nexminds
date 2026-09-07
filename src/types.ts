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
  name?: string;
  title?: string;
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
  provider?: string;
  issuer?: string;
  issueDate?: string;
  date?: string;
  credentialUrl?: string;
  verificationUrl?: string;
}

export interface StudentSkill {
  id?: string;
  skillId?: string;
  name: string;
  level?: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  verified?: boolean;
  lastDemonstrated: string; // ISO date
  evidenceCount: number;
  freshness?: 'recent' | 'needs_refresh' | 'stale';
}

export interface Hackathon {
  id: string;
  name: string;
  project: string;
  rank?: string;
  technologies: string[];
  date: string;
  credentialUrl?: string;
  description?: string;
}

export interface FreelanceWork {
  id: string;
  clientOrProjectType: string;
  workPerformed: string;
  technologies: string[];
  duration: string;
  resultMetrics?: string;
  evidenceUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'Competition' | 'Academic' | 'Open Source' | 'Leadership' | 'Other';
  date: string;
  credentialUrl?: string;
}

export interface ExternalProfiles {
  githubUsername?: string;
  leetcodeUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubData?: {
    publicRepos: number;
    topLanguages: Array<{ language: string; count: number; percentage: number }>;
    totalStars: number;
    contributionLevel: 'Active' | 'Consistent' | 'High Impact';
  };
  leetcodeData?: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking?: number;
    contestRating?: number;
  };
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
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
  careerGoal?: string; // e.g. "AI Engineer"
  targetCareerId?: string;
  profileCompletion?: number; // 0 - 100
  careerReadinessScore?: number; // 0 - 100
  skills?: StudentSkill[];
  education?: Education[];
  projects?: Project[];
  experience?: Experience[];
  certifications?: Certification[];
  hackathons?: Hackathon[];
  freelanceWork?: FreelanceWork[];
  achievements?: Achievement[];
  externalProfiles?: ExternalProfiles;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeScore?: number;
  updatedAt?: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  email: string;
  industry: string;
  location: string;
  website: string;
  size?: string;
  employeeCount?: number | string;
  description: string;
  logo?: string;
  logoUrl?: string;
  verified: boolean;
  createdAt?: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName?: string;
  companyLogo?: string;
  title: string;
  department?: string;
  description: string;
  type?: string;
  opportunityType?: 'job' | 'internship';
  employmentType?: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | string;
  location: string;
  workMode?: 'Remote' | 'Hybrid' | 'On-site' | string;
  salary?: string;
  salaryRange?: string;
  stipend?: string;
  duration?: string; // For internships e.g. "3 months", "6 months"
  internshipType?: 'Summer' | 'Winter' | 'Part-time' | 'Full-time';
  conversionPossibility?: boolean; // PPO available
  openings?: number;
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior' | 'Lead' | string;
  educationRequirement?: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  skillWeights?: Record<string, number>;
  deadline?: string;
  // Assessment requirements
  assessmentRequired?: boolean;
  assessmentSkills?: string[];
  minimumAssessmentScore?: number;
  allowRetake?: boolean;
  maxAttempts?: number;
  status: 'published' | 'draft' | 'closed' | 'open' | string;
  applicantCount?: number;
  createdAt: string;
}

export type Opportunity = Job;

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'rejected'
  | 'withdrawn'
  | 'interviewing'
  | 'accepted'
  | 'reviewing'
  | string;

export interface ApplicationTimelineEvent {
  status: ApplicationStatus;
  date: string;
  note?: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  studentCollege?: string;
  studentDegree?: string;
  jobId: string;
  jobTitle?: string;
  opportunityType?: 'job' | 'internship';
  companyId?: string;
  companyName?: string;
  resumeId?: string;
  resumeFileName?: string;
  matchScoreAtApplication?: number;
  candidateScore?: number;
  matchScore?: number;
  assessmentScore?: number;
  assessmentPassed?: boolean;
  evidenceStrength?: number;
  notes?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
  timeline?: ApplicationTimelineEvent[];
  // Rejection & Feedback Fields (strictly separate student vs internal)
  rejectionReason?: string;
  skillGapsIdentified?: string[];
  studentFeedback?: string;
  internalHRNotes?: string;
  feedbackAt?: string;
}

export interface RecruiterFeedback {
  id: string;
  applicationId: string;
  studentId: string;
  companyId?: string;
  companyName?: string;
  jobId?: string;
  opportunityId?: string;
  jobTitle?: string;
  opportunityType?: 'job' | 'internship';
  status: ApplicationStatus;
  primaryReason: string;
  skillGapsIdentified: string[];
  studentFeedback: string;
  internalHRNotes?: string;
  createdAt: string;
}

export interface MandatoryAssessmentAttempt {
  id: string;
  studentId: string;
  opportunityId: string;
  opportunityTitle?: string;
  skills?: string[];
  totalQuestions?: number;
  correctAnswers?: number;
  score: number;
  passed: boolean;
  attemptNumber?: number;
  date?: string;
  minimumScoreRequired?: number;
  timeSpentSeconds?: number;
  skillBreakdown?: Record<string, { total: number; correct: number; percentage: number }>;
  breakdown?: any[];
  completedAt?: string;
}

export interface TransparentMatchBreakdown {
  overallMatch: number; // 0 - 100
  skillMatch: number; // 35% weight
  evidenceScore: number; // 20% weight
  assessmentScore: number; // 15% weight
  projectScore: number; // 10% weight
  careerAlignment: number; // 10% weight
  experienceScore: number; // 5% weight
  educationScore: number; // 5% weight
  matchedSkills: string[];
  missingSkills: string[];
  weakSkills: string[];
  explanations: string[];
}

export interface PersonalizedImprovementPlan {
  id?: string;
  studentId?: string;
  applicationId: string;
  opportunityTitle?: string;
  targetRole?: string;
  companyName?: string;
  rejectionReason?: string;
  identifiedGaps?: string[];
  studentFeedback?: string;
  recommendedCourses?: any[];
  recommendedProjects?: any[];
  practiceAssessments?: any[];
  generatedAt?: string;
  skillGaps?: Array<{
    skill: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'identified' | 'in_progress' | 'verified';
    recommendedProject: {
      title: string;
      description: string;
      technologies: string[];
      difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    };
    recommendedCourse: {
      title: string;
      provider: string;
      url: string;
      duration: string;
    };
    assessmentSkill: string;
  }>;
  aiGuidance?: string;
  createdAt?: string;
}

export interface SkillEvidence {
  id: string;
  studentId: string;
  skill?: string;
  skillName?: string;
  verified?: boolean;
  verificationScore?: number;
  confidenceBoost?: number;
  dateDemonstrated?: string;
  url?: string;
  metadata?: any;
  sourceType?: 'resume' | 'project' | 'assessment' | 'course' | 'github' | 'experience' | string;
  type?: 'resume' | 'project' | 'assessment' | 'course' | 'github' | 'experience' | 'certification' | 'work_experience' | string;
  verifiedAt?: string;
  sourceId?: string;
  title?: string;
  sourceTitle?: string;
  confidence?: number;
  date?: string;
  details?: string;
  createdAt?: string;
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
  demandLevel?: string;
  requiredSkills: string[];
  preferredSkills?: string[];
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

export interface CertifiedInternshipProject {
  title: string;
  description: string;
  deliverable: string;
}

export interface CertifiedInternship {
  id: string;
  title: string;
  description: string;
  internshipType: string;
  domain: 'AI/ML' | 'Web Development' | 'Data Science' | 'Cybersecurity' | 'Java Backend' | 'Cloud & DevOps' | 'Data Analytics' | string;
  skills: string[];
  learningOutcomes: string[];
  duration: string;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  eligibility: string;
  education: string;
  experience: string;
  location: string;
  workMode: 'Online' | 'Remote' | 'Hybrid' | 'On-site';
  cost: 'FREE' | string;
  currency: string;
  stipend?: string;
  certificate: string;
  certificateIssuer: string;
  numberOfSeats: number;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isCertified: boolean;
  isFree: boolean;
  assessmentRequired?: boolean;
  assessmentSkill?: string;
  minAssessmentScore?: number;
  enrolledCount?: number;
  completedCount?: number;
  certificatesIssuedCount?: number;
  projects?: CertifiedInternshipProject[];
}

export type InternshipAppStatus =
  | 'Available'
  | 'Applied'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Certificate Issued'
  | 'Rejected';

export interface InternshipApplication {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  internshipId: string;
  internshipTitle: string;
  opportunityType: 'INTERNSHIP';
  isCertified: boolean;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  appliedAt: string;
  status: InternshipAppStatus;
  assessmentScore?: number;
  certificateId?: string;
  completedAt?: string;
  certificateIssuedAt?: string;
  enrolledAt?: string;
  updatedAt?: string;
  notes?: string;
}

export interface CertificateRecord {
  id: string;
  certificateId: string; // e.g. "NMAI-CERT-2026-00001"
  studentId: string;
  internshipId: string;
  studentName: string;
  internshipTitle: string;
  domain: string;
  skills: string[];
  issueDate: string;
  issuer: string;
  verificationCode: string;
  status: 'VALID' | 'REVOKED';
  gradeOrScore?: string;
}

