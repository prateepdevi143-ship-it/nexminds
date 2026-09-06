import fs from 'fs';
import path from 'path';
import { User, Student, Company, Job, Application, SkillEvidence, CanonicalSkill, CareerGoal, Course, Assessment, Notification } from '../src/types';
import { DEMO_USERS, DEMO_STUDENTS, DEMO_COMPANIES, DEMO_JOBS, DEMO_EVIDENCES, CAREER_GOALS, ADMIN_INDUSTRIES_SEED, AdminIndustryData } from './data/demoAccountsData';
import { DEMO_APPLICATIONS } from './data/applicationsData';
import { COMPREHENSIVE_COURSES } from './data/coursesData';
import { SKILL_ASSESSMENTS_SEED } from './data/questionsData';

export interface DatabaseSchema {
  users: User[];
  students: Student[];
  companies: Company[];
  jobs: Job[];
  applications: Application[];
  evidences: SkillEvidence[];
  canonicalSkills: CanonicalSkill[];
  careers: CareerGoal[];
  courses: Course[];
  assessments: Assessment[];
  notifications: Notification[];
  industries: AdminIndustryData[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'careerai-db.json');

export const INITIAL_CANONICAL_SKILLS: CanonicalSkill[] = [
  { id: 'sk_py', name: 'Python', aliases: ['py', 'python3'], category: 'Programming Languages', relatedSkills: ['FastAPI', 'Pandas', 'NumPy', 'Machine Learning'] },
  { id: 'sk_ml', name: 'Machine Learning', aliases: ['ml'], category: 'AI & Data Science', relatedSkills: ['Deep Learning', 'Scikit-Learn', 'Python'] },
  { id: 'sk_pytorch', name: 'PyTorch', aliases: ['torch'], category: 'AI & Data Science', relatedSkills: ['Deep Learning', 'Computer Vision', 'Python'] },
  { id: 'sk_dl', name: 'Deep Learning', aliases: ['dl', 'neural networks'], category: 'AI & Data Science', relatedSkills: ['PyTorch', 'TensorFlow', 'Python'] },
  { id: 'sk_nlp', name: 'Natural Language Processing', aliases: ['nlp', 'transformers'], category: 'AI & Data Science', relatedSkills: ['PyTorch', 'Python'] },
  { id: 'sk_react', name: 'React', aliases: ['reactjs', 'react.js'], category: 'Frontend', relatedSkills: ['TypeScript', 'JavaScript', 'Tailwind CSS'] },
  { id: 'sk_ts', name: 'TypeScript', aliases: ['ts'], category: 'Programming Languages', relatedSkills: ['JavaScript', 'React', 'Node.js'] },
  { id: 'sk_js', name: 'JavaScript', aliases: ['js', 'es6', 'es2024'], category: 'Programming Languages', relatedSkills: ['TypeScript', 'React', 'HTML', 'CSS'] },
  { id: 'sk_node', name: 'Node.js', aliases: ['nodejs', 'node'], category: 'Backend', relatedSkills: ['Express.js', 'TypeScript', 'REST API', 'JavaScript'] },
  { id: 'sk_mongo', name: 'MongoDB', aliases: ['nosql', 'mongo'], category: 'Database', relatedSkills: ['Node.js', 'Express.js', 'Database'] },
  { id: 'sk_sql', name: 'SQL', aliases: ['postgres', 'postgresql', 'mysql'], category: 'Database', relatedSkills: ['PostgreSQL', 'Data Science', 'Database'] },
  { id: 'sk_ds', name: 'Data Science', aliases: ['ds', 'data analytics'], category: 'AI & Data Science', relatedSkills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Statistics'] },
  { id: 'sk_sec', name: 'Cybersecurity', aliases: ['security', 'infosec', 'cyber'], category: 'Security', relatedSkills: ['Linux', 'Networking', 'OWASP'] },
  { id: 'sk_cloud', name: 'Cloud Computing', aliases: ['cloud', 'gcp', 'google cloud'], category: 'DevOps & Cloud', relatedSkills: ['AWS', 'Docker', 'Linux'] },
  { id: 'sk_aws', name: 'AWS', aliases: ['amazon web services'], category: 'DevOps & Cloud', relatedSkills: ['Cloud Computing', 'Docker', 'Linux'] },
  { id: 'sk_docker', name: 'Docker', aliases: ['containerization', 'containers'], category: 'DevOps & Cloud', relatedSkills: ['Kubernetes', 'CI/CD', 'Linux'] },
  { id: 'sk_devops', name: 'DevOps', aliases: ['sre'], category: 'DevOps & Cloud', relatedSkills: ['Docker', 'CI/CD', 'Linux', 'Kubernetes'] },
  { id: 'sk_git', name: 'Git', aliases: ['github', 'version control'], category: 'Tools & Workflows', relatedSkills: ['CI/CD', 'Linux'] },
  { id: 'sk_ui', name: 'UI Design', aliases: ['ui/ux', 'ux design', 'figma'], category: 'Design & Frontend', relatedSkills: ['Figma', 'CSS', 'Tailwind CSS', 'React'] },
  { id: 'sk_flutter', name: 'Flutter', aliases: ['dart/flutter'], category: 'Mobile', relatedSkills: ['Dart', 'REST API'] },
  { id: 'sk_java', name: 'Java', aliases: ['jdk', 'core java'], category: 'Programming Languages', relatedSkills: ['Spring Boot', 'SQL', 'OOP', 'DSA'] },
  { id: 'sk_spring', name: 'Spring Boot', aliases: ['spring', 'spring framework'], category: 'Backend', relatedSkills: ['Java', 'SQL', 'REST API'] }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_01',
    userId: 'usr_student_01',
    title: 'Interview Scheduled with Chennai AI Labs',
    message: 'Your application for AI Engineer has progressed to Technical Round 2. Verified PyTorch match placed you in the top 5% of candidates.',
    type: 'application',
    read: false,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    link: '/applications'
  },
  {
    id: 'notif_02',
    userId: 'usr_student_01',
    title: 'Offer Extended: Machine Learning Intern',
    message: 'Congratulations! Chennai AI Labs has extended an offer for the Machine Learning Intern role with ₹35,000/month stipend.',
    type: 'application',
    read: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    link: '/applications'
  },
  {
    id: 'notif_03',
    userId: 'usr_student_02',
    title: 'Shortlisted by Coimbatore TechWorks',
    message: 'Your Full Stack Developer application was shortlisted based on your AgriCommerce React & TypeScript project.',
    type: 'application',
    read: false,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    link: '/applications'
  },
  {
    id: 'notif_04',
    userId: 'usr_student_05',
    title: 'Internship Offer Accepted',
    message: 'South India Cyber Labs confirmed your joining as Security Intern in Chennai.',
    type: 'application',
    read: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    link: '/applications'
  }
];

export const INITIAL_SEED: DatabaseSchema = {
  users: DEMO_USERS,
  students: DEMO_STUDENTS,
  companies: DEMO_COMPANIES,
  jobs: DEMO_JOBS,
  applications: DEMO_APPLICATIONS,
  evidences: DEMO_EVIDENCES,
  canonicalSkills: INITIAL_CANONICAL_SKILLS,
  careers: CAREER_GOALS,
  courses: COMPREHENSIVE_COURSES,
  assessments: SKILL_ASSESSMENTS_SEED as any,
  notifications: INITIAL_NOTIFICATIONS,
  industries: ADMIN_INDUSTRIES_SEED
};

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        // Verify database is populated with the updated Tamil Nadu 15-student seed
        if (parsed.users && parsed.users.some((u: any) => u.id === 'usr_student_01')) {
          return {
            users: parsed.users || INITIAL_SEED.users,
            students: parsed.students || INITIAL_SEED.students,
            companies: parsed.companies || INITIAL_SEED.companies,
            jobs: parsed.jobs || INITIAL_SEED.jobs,
            applications: parsed.applications || INITIAL_SEED.applications,
            evidences: parsed.evidences || INITIAL_SEED.evidences,
            canonicalSkills: parsed.canonicalSkills || INITIAL_SEED.canonicalSkills,
            careers: parsed.careers || INITIAL_SEED.careers,
            courses: parsed.courses || INITIAL_SEED.courses,
            assessments: parsed.assessments || INITIAL_SEED.assessments,
            notifications: parsed.notifications || INITIAL_SEED.notifications,
            industries: parsed.industries || INITIAL_SEED.industries
          };
        }
      }
    } catch (err) {
      console.warn('Could not read existing db.json, re-seeding:', err);
    }
    this.saveData(INITIAL_SEED);
    return INITIAL_SEED;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    return this.data[collection];
  }

  public update<K extends keyof DatabaseSchema>(collection: K, updater: (items: DatabaseSchema[K]) => DatabaseSchema[K]) {
    this.data[collection] = updater(this.data[collection]);
    this.saveData(this.data);
  }

  public resetToSeed() {
    this.data = JSON.parse(JSON.stringify(INITIAL_SEED));
    this.saveData(this.data);
  }
}

export const db = new DatabaseStore();
