import { User, Student, Company, Job, SkillEvidence, CareerGoal } from '../types';

export const DEMO_PASSWORD = 'CareerAI@2026';

// 1. Users list: 15 Students, 5 Companies, 1 Admin (ONLY 3 ROLES: student, company, admin)
export const DEMO_USERS: User[] = [
  // 15 Students
  { id: 'usr_student_01', email: 'student01@careerai.demo', role: 'student', name: 'Arjun Kumar', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 'usr_student_02', email: 'student02@careerai.demo', role: 'student', name: 'Kavin Raj', createdAt: '2026-01-12T08:00:00.000Z' },
  { id: 'usr_student_03', email: 'student03@careerai.demo', role: 'student', name: 'Sanjay Kumar', createdAt: '2026-01-14T08:00:00.000Z' },
  { id: 'usr_student_04', email: 'student04@careerai.demo', role: 'student', name: 'Vignesh S', createdAt: '2026-01-15T08:00:00.000Z' },
  { id: 'usr_student_05', email: 'student05@careerai.demo', role: 'student', name: 'Dharshan P', createdAt: '2026-01-16T08:00:00.000Z' },
  { id: 'usr_student_06', email: 'student06@careerai.demo', role: 'student', name: 'Rahul M', createdAt: '2026-01-18T08:00:00.000Z' },
  { id: 'usr_student_07', email: 'student07@careerai.demo', role: 'student', name: 'Hari Prasad', createdAt: '2026-01-20T08:00:00.000Z' },
  { id: 'usr_student_08', email: 'student08@careerai.demo', role: 'student', name: 'Ajay Kumar', createdAt: '2026-01-22T08:00:00.000Z' },
  { id: 'usr_student_09', email: 'student09@careerai.demo', role: 'student', name: 'Pranav R', createdAt: '2026-01-24T08:00:00.000Z' },
  { id: 'usr_student_10', email: 'student10@careerai.demo', role: 'student', name: 'Sathish K', createdAt: '2026-01-25T08:00:00.000Z' },
  { id: 'usr_student_11', email: 'student11@careerai.demo', role: 'student', name: 'Mohanraj V', createdAt: '2026-01-26T08:00:00.000Z' },
  { id: 'usr_student_12', email: 'student12@careerai.demo', role: 'student', name: 'Ashwin T', createdAt: '2026-01-27T08:00:00.000Z' },
  { id: 'usr_student_13', email: 'student13@careerai.demo', role: 'student', name: 'Gokul S', createdAt: '2026-01-28T08:00:00.000Z' },
  { id: 'usr_student_14', email: 'student14@careerai.demo', role: 'student', name: 'Manoj R', createdAt: '2026-01-29T08:00:00.000Z' },
  { id: 'usr_student_15', email: 'student15@careerai.demo', role: 'student', name: 'Vijay S', createdAt: '2026-01-30T08:00:00.000Z' },

  // 5 Companies
  { id: 'usr_company_01', email: 'company01@careerai.demo', role: 'company', name: 'Chennai AI Labs', createdAt: '2025-12-01T08:00:00.000Z' },
  { id: 'usr_company_02', email: 'company02@careerai.demo', role: 'company', name: 'Coimbatore TechWorks', createdAt: '2025-12-05T08:00:00.000Z' },
  { id: 'usr_company_03', email: 'company03@careerai.demo', role: 'company', name: 'Madurai Data Systems', createdAt: '2025-12-10T08:00:00.000Z' },
  { id: 'usr_company_04', email: 'company04@careerai.demo', role: 'company', name: 'Tamil Cloud Technologies', createdAt: '2025-12-12T08:00:00.000Z' },
  { id: 'usr_company_05', email: 'company05@careerai.demo', role: 'company', name: 'South India Cyber Labs', createdAt: '2025-12-15T08:00:00.000Z' },

  // 1 Admin
  { id: 'usr_admin', email: 'admin@careerai.demo', role: 'admin', name: 'CareerAI System Administrator', createdAt: '2025-11-01T08:00:00.000Z' }
];

// 2. Career Goals Definitions
export const CAREER_GOALS: CareerGoal[] = [
  {
    id: 'cg_ai_eng',
    title: 'AI Engineer',
    domain: 'Artificial Intelligence',
    avgSalary: '₹14,50,000 / yr',
    growthRate: '+34% YoY',
    demandLevel: 'High',
    requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'SQL', 'FastAPI'],
    description: 'Design and deploy production-grade machine learning and deep learning pipelines and inference services.'
  },
  {
    id: 'cg_fullstack',
    title: 'Full Stack Developer',
    domain: 'Software Engineering',
    avgSalary: '₹11,80,000 / yr',
    growthRate: '+26% YoY',
    demandLevel: 'High',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git'],
    description: 'Architect and develop responsive user interfaces coupled with scalable backend microservices and databases.'
  },
  {
    id: 'cg_data_scientist',
    title: 'Data Scientist',
    domain: 'Data Science & Analytics',
    avgSalary: '₹13,20,000 / yr',
    growthRate: '+29% YoY',
    demandLevel: 'High',
    requiredSkills: ['Python', 'Data Science', 'Pandas', 'NumPy', 'Machine Learning', 'SQL', 'Statistics'],
    description: 'Transform enterprise data into actionable statistical insights, predictive models, and executive dashboards.'
  },
  {
    id: 'cg_backend',
    title: 'Backend Developer',
    domain: 'Systems & Backend',
    avgSalary: '₹11,00,000 / yr',
    growthRate: '+22% YoY',
    demandLevel: 'High',
    requiredSkills: ['Node.js', 'Express.js', 'Python', 'SQL', 'PostgreSQL', 'Redis', 'Docker'],
    description: 'Build high-throughput, low-latency APIs, event-driven message architectures, and database persistence layers.'
  },
  {
    id: 'cg_cybersecurity',
    title: 'Cybersecurity Analyst',
    domain: 'Security & Defense',
    avgSalary: '₹12,40,000 / yr',
    growthRate: '+38% YoY',
    demandLevel: 'High',
    requiredSkills: ['Cybersecurity', 'Networking', 'Linux', 'OWASP', 'Bash/Shell', 'Python'],
    description: 'Monitor enterprise attack surfaces, hunt threats, audit application vulnerabilities, and lead incident triage.'
  },
  {
    id: 'cg_cloud',
    title: 'Cloud Engineer',
    domain: 'Cloud Architecture',
    avgSalary: '₹13,00,000 / yr',
    growthRate: '+31% YoY',
    demandLevel: 'High',
    requiredSkills: ['AWS', 'Google Cloud', 'Cloud Computing', 'Docker', 'Linux', 'DevOps'],
    description: 'Architect, configure, and maintain resilient multi-zone cloud infrastructure and automated deployment pipelines.'
  },
  {
    id: 'cg_devops',
    title: 'DevOps Engineer',
    domain: 'DevOps & Site Reliability',
    avgSalary: '₹13,80,000 / yr',
    growthRate: '+32% YoY',
    demandLevel: 'High',
    requiredSkills: ['CI/CD', 'Docker', 'Kubernetes', 'Linux', 'Git', 'AWS', 'Bash/Shell'],
    description: 'Empower continuous delivery via automated release pipelines, container orchestration, and real-time observability.'
  },
  {
    id: 'cg_frontend',
    title: 'Frontend Developer',
    domain: 'Web & UI Engineering',
    avgSalary: '₹9,80,000 / yr',
    growthRate: '+21% YoY',
    demandLevel: 'Medium',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS', 'Git'],
    description: 'Craft high-performance, accessible, and responsive user experiences with modern component architectures.'
  },
  {
    id: 'cg_ml_eng',
    title: 'Machine Learning Engineer',
    domain: 'Machine Learning',
    avgSalary: '₹14,00,000 / yr',
    growthRate: '+35% YoY',
    demandLevel: 'High',
    requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Docker', 'FastAPI'],
    description: 'Optimize, containerize, and serve ML models at scale with continuous retraining and monitoring pipelines.'
  },
  {
    id: 'cg_data_analyst',
    title: 'Data Analyst',
    domain: 'Business Intelligence',
    avgSalary: '₹8,50,000 / yr',
    growthRate: '+19% YoY',
    demandLevel: 'Medium',
    requiredSkills: ['SQL', 'Data Science', 'Power BI', 'Excel', 'Statistics', 'Python'],
    description: 'Perform exploratory data analysis, data storytelling, and build business intelligence KPI dashboards.'
  },
  {
    id: 'cg_mobile',
    title: 'Mobile App Developer',
    domain: 'Mobile Engineering',
    avgSalary: '₹10,50,000 / yr',
    growthRate: '+24% YoY',
    demandLevel: 'Medium',
    requiredSkills: ['Flutter', 'Dart', 'JavaScript', 'REST API', 'Git'],
    description: 'Build native-speed, responsive cross-platform mobile apps for iOS and Android devices.'
  },
  {
    id: 'cg_uiux',
    title: 'UI/UX Developer',
    domain: 'Design Engineering',
    avgSalary: '₹10,00,000 / yr',
    growthRate: '+25% YoY',
    demandLevel: 'Medium',
    requiredSkills: ['UI Design', 'Figma', 'CSS', 'Tailwind CSS', 'React', 'JavaScript'],
    description: 'Bridge the gap between design tokens and production React components with accessible interaction design.'
  }
];

// 3. 15 Real Tamil Nadu Students
export const DEMO_STUDENTS: Student[] = [
  // Student 1: Arjun Kumar (Chennai, AI Engineer)
  {
    id: 'std_01',
    userId: 'usr_student_01',
    name: 'Arjun Kumar',
    email: 'student01@careerai.demo',
    phone: '+91 98401 23456',
    location: 'Chennai, Tamil Nadu',
    college: 'Anna University, CEG Campus, Chennai',
    degree: 'B.Tech in Artificial Intelligence & Data Science',
    graduationYear: 2026,
    cgpa: 8.92,
    bio: 'Aspiring AI Engineer passionate about Deep Learning, PyTorch, and NLP architectures. Experienced in building computer vision models and generative AI systems.',
    targetCareerId: 'cg_ai_eng',
    skills: [
      { id: 's01_1', name: 'Python', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 4 },
      { id: 's01_2', name: 'Machine Learning', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 3 },
      { id: 's01_3', name: 'Deep Learning', confidence: 0.84, verified: true, lastDemonstrated: '2026-01-28', evidenceCount: 2 },
      { id: 's01_4', name: 'PyTorch', confidence: 0.82, verified: true, lastDemonstrated: '2026-01-20', evidenceCount: 2 },
      { id: 's01_5', name: 'SQL', confidence: 0.74, verified: false, lastDemonstrated: '2025-11-15', evidenceCount: 1 },
      { id: 's01_6', name: 'FastAPI', confidence: 0.68, verified: false, lastDemonstrated: '2025-10-10', evidenceCount: 1 }
    ],
    careerReadinessScore: 86,
    projects: [
      {
        id: 'p01_1',
        title: 'Tamil Speech-to-Text Acoustic Model',
        description: 'Trained a fine-tuned Whisper model on Tamil dialects, achieving 14.2% Word Error Rate (WER). Served via FastAPI backend.',
        technologies: ['Python', 'PyTorch', 'Deep Learning', 'FastAPI'],
        githubUrl: 'https://github.com/arjunkumar-dev/tamil-whisper-asr'
      },
      {
        id: 'p01_2',
        title: 'Healthcare Chest X-Ray Pneumonia Classifier',
        description: 'Implemented ResNet-50 transfer learning on 5,800 medical scans with Grad-CAM visual interpretability.',
        technologies: ['Python', 'PyTorch', 'Computer Vision'],
        githubUrl: 'https://github.com/arjunkumar-dev/xray-pneumonia-vision'
      }
    ],
    experience: [
      {
        id: 'e01_1',
        company: 'IIT Madras Research Park',
        role: 'AI Research Intern',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        description: 'Benchmarked transformer tokenizers on South Indian languages and sped up inference latency by 32%.'
      }
    ],
    certifications: [
      { id: 'c01_1', name: 'Deep Learning Specialization (DeepLearning.AI)', issuer: 'Coursera', date: '2025-09-15', verificationUrl: 'https://coursera.org/verify/DL-ARJUN-2025' }
    ]
  },

  // Student 2: Kavin Raj (Coimbatore, Full Stack Developer)
  {
    id: 'std_02',
    userId: 'usr_student_02',
    name: 'Kavin Raj',
    email: 'student02@careerai.demo',
    phone: '+91 98422 34567',
    location: 'Coimbatore, Tamil Nadu',
    college: 'PSG College of Technology, Coimbatore',
    degree: 'B.E. in Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.78,
    bio: 'Full Stack Engineer with strong foundations in React, TypeScript, Node.js, and PostgreSQL. Loves building clean UI/UX with solid microservice architectures.',
    targetCareerId: 'cg_fullstack',
    skills: [
      { id: 's02_1', name: 'React', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 4 },
      { id: 's02_2', name: 'JavaScript', confidence: 0.91, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 },
      { id: 's02_3', name: 'TypeScript', confidence: 0.85, verified: true, lastDemonstrated: '2026-02-05', evidenceCount: 3 },
      { id: 's02_4', name: 'Node.js', confidence: 0.86, verified: true, lastDemonstrated: '2026-01-30', evidenceCount: 3 },
      { id: 's02_5', name: 'PostgreSQL', confidence: 0.78, verified: true, lastDemonstrated: '2026-01-15', evidenceCount: 2 },
      { id: 's02_6', name: 'Tailwind CSS', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 3 },
      { id: 's02_7', name: 'Git', confidence: 0.85, verified: true, lastDemonstrated: '2026-02-22', evidenceCount: 3 }
    ],
    careerReadinessScore: 89,
    projects: [
      {
        id: 'p02_1',
        title: 'AgriCommerce - Direct Farmer Marketplace',
        description: 'Engineered a real-time marketplace enabling farmers in western Tamil Nadu to sell directly to wholesale buyers without middlemen.',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        githubUrl: 'https://github.com/kavinraj-dev/agri-commerce-portal'
      }
    ],
    experience: [
      {
        id: 'e02_1',
        company: 'Kovai Software Systems',
        role: 'Full Stack Web Intern',
        startDate: '2025-05-15',
        endDate: '2025-07-31',
        description: 'Developed responsive client portals and optimized PostgreSQL query execution times by 40%.'
      }
    ],
    certifications: [
      { id: 'c02_1', name: 'Meta Front-End Developer Professional Certificate', issuer: 'Coursera', date: '2025-08-20' }
    ]
  },

  // Student 3: Sanjay Kumar (Madurai, Data Scientist)
  {
    id: 'std_03',
    userId: 'usr_student_03',
    name: 'Sanjay Kumar',
    email: 'student03@careerai.demo',
    phone: '+91 94433 45678',
    location: 'Madurai, Tamil Nadu',
    college: 'Thiagarajar College of Engineering, Madurai',
    degree: 'B.Tech in Information Technology',
    graduationYear: 2026,
    cgpa: 8.65,
    bio: 'Data Scientist focused on predictive analytics, statistical hypothesis testing, and machine learning models in Python and SQL.',
    targetCareerId: 'cg_data_scientist',
    skills: [
      { id: 's03_1', name: 'Python', confidence: 0.89, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 3 },
      { id: 's03_2', name: 'Data Science', confidence: 0.86, verified: true, lastDemonstrated: '2026-02-08', evidenceCount: 3 },
      { id: 's03_3', name: 'Pandas', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 },
      { id: 's03_4', name: 'SQL', confidence: 0.85, verified: true, lastDemonstrated: '2026-01-25', evidenceCount: 2 },
      { id: 's03_5', name: 'Machine Learning', confidence: 0.80, verified: true, lastDemonstrated: '2026-01-20', evidenceCount: 2 },
      { id: 's03_6', name: 'Statistics', confidence: 0.82, verified: true, lastDemonstrated: '2026-01-10', evidenceCount: 2 }
    ],
    careerReadinessScore: 85,
    projects: [
      {
        id: 'p03_1',
        title: 'Retail Demand Forecasting Engine',
        description: 'Analyzed 2 years of retail sales across 15 Tamil Nadu districts, utilizing ARIMA and XGBoost for inventory optimization.',
        technologies: ['Python', 'Pandas', 'Machine Learning', 'SQL'],
        githubUrl: 'https://github.com/sanjaykumar-ds/retail-demand-forecast'
      }
    ],
    experience: [],
    certifications: [
      { id: 'c03_1', name: 'IBM Data Science Professional Certificate', issuer: 'Coursera', date: '2025-10-10' }
    ]
  },

  // Student 4: Vignesh S (Salem, Backend Developer)
  {
    id: 'std_04',
    userId: 'usr_student_04',
    name: 'Vignesh S',
    email: 'student04@careerai.demo',
    phone: '+91 97894 56789',
    location: 'Salem, Tamil Nadu',
    college: 'Government College of Engineering, Salem',
    degree: 'B.E. in Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.45,
    bio: 'Backend enthusiast specializing in Node.js microservices, Express, PostgreSQL, Redis caching, and containerized Docker environments.',
    targetCareerId: 'cg_backend',
    skills: [
      { id: 's04_1', name: 'Node.js', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 3 },
      { id: 's04_2', name: 'Express.js', confidence: 0.86, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 3 },
      { id: 's04_3', name: 'SQL', confidence: 0.82, verified: true, lastDemonstrated: '2026-01-22', evidenceCount: 2 },
      { id: 's04_4', name: 'PostgreSQL', confidence: 0.80, verified: true, lastDemonstrated: '2026-01-20', evidenceCount: 2 },
      { id: 's04_5', name: 'Redis', confidence: 0.72, verified: false, lastDemonstrated: '2025-12-10', evidenceCount: 1 },
      { id: 's04_6', name: 'Docker', confidence: 0.70, verified: false, lastDemonstrated: '2025-11-20', evidenceCount: 1 }
    ],
    careerReadinessScore: 81,
    projects: [
      {
        id: 'p04_1',
        title: 'High-Throughput Order Processing API',
        description: 'Architected an asynchronous checkout pipeline capable of processing 1,200 orders/sec with Redis queue concurrency.',
        technologies: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis'],
        githubUrl: 'https://github.com/vignesh-backend/order-pipeline-engine'
      }
    ],
    experience: [],
    certifications: []
  },

  // Student 5: Dharshan P (Tiruchirappalli, Cybersecurity Analyst)
  {
    id: 'std_05',
    userId: 'usr_student_05',
    name: 'Dharshan P',
    email: 'student05@careerai.demo',
    phone: '+91 94885 67890',
    location: 'Tiruchirappalli, Tamil Nadu',
    college: 'National Institute of Technology, Tiruchirappalli (NITT)',
    degree: 'B.Tech in Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 9.10,
    bio: 'Security researcher with expertise in vulnerability assessment, OWASP Top 10 mitigation, Wireshark packet analysis, and Linux hardening.',
    targetCareerId: 'cg_cybersecurity',
    skills: [
      { id: 's05_1', name: 'Cybersecurity', confidence: 0.94, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 4 },
      { id: 's05_2', name: 'Networking', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 3 },
      { id: 's05_3', name: 'Linux', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 },
      { id: 's05_4', name: 'OWASP', confidence: 0.88, verified: true, lastDemonstrated: '2026-01-30', evidenceCount: 3 },
      { id: 's05_5', name: 'Bash/Shell', confidence: 0.85, verified: true, lastDemonstrated: '2026-01-20', evidenceCount: 2 },
      { id: 's05_6', name: 'Python', confidence: 0.80, verified: true, lastDemonstrated: '2026-01-15', evidenceCount: 2 }
    ],
    careerReadinessScore: 92,
    projects: [
      {
        id: 'p05_1',
        title: 'Automated Web Vulnerability Scanner',
        description: 'Developed an asynchronous scanner in Python testing for SQLi, XSS, CSRF, and SSL configuration weaknesses.',
        technologies: ['Python', 'Cybersecurity', 'OWASP', 'Linux'],
        githubUrl: 'https://github.com/dharshan-sec/auto-vuln-scanner'
      }
    ],
    experience: [
      {
        id: 'e05_1',
        company: 'Trichy Cyber Defense Cell',
        role: 'SOC Analyst Trainee',
        startDate: '2025-05-01',
        endDate: '2025-07-15',
        description: 'Triaged 140+ network security alerts, mapped indicators of compromise (IoC), and audited server firewalls.'
      }
    ],
    certifications: [
      { id: 'c05_1', name: 'CompTIA Security+ (SY0-701)', issuer: 'CompTIA', date: '2025-09-01' }
    ]
  },

  // Student 6: Rahul M (Tirunelveli, Cloud Engineer)
  {
    id: 'std_06',
    userId: 'usr_student_06',
    name: 'Rahul M',
    email: 'student06@careerai.demo',
    phone: '+91 98946 78901',
    location: 'Tirunelveli, Tamil Nadu',
    college: 'Government College of Engineering, Tirunelveli',
    degree: 'B.E. in Electronics & Communication Engineering',
    graduationYear: 2026,
    cgpa: 8.32,
    bio: 'Cloud architecture enthusiast focusing on AWS, Google Cloud, Docker, and infrastructure automation.',
    targetCareerId: 'cg_cloud',
    skills: [
      { id: 's06_1', name: 'AWS', confidence: 0.84, verified: true, lastDemonstrated: '2026-02-11', evidenceCount: 3 },
      { id: 's06_2', name: 'Google Cloud', confidence: 0.80, verified: true, lastDemonstrated: '2026-02-05', evidenceCount: 2 },
      { id: 's06_3', name: 'Cloud Computing', confidence: 0.86, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 3 },
      { id: 's06_4', name: 'Docker', confidence: 0.78, verified: true, lastDemonstrated: '2026-01-20', evidenceCount: 2 },
      { id: 's06_5', name: 'Linux', confidence: 0.82, verified: true, lastDemonstrated: '2026-01-25', evidenceCount: 2 }
    ],
    careerReadinessScore: 82,
    projects: [
      {
        id: 'p06_1',
        title: 'Multi-Region Serverless Microservices on AWS',
        description: 'Configured AWS Lambda, API Gateway, and DynamoDB Global Tables with CloudFront CDN integration.',
        technologies: ['AWS', 'Docker', 'Cloud Computing'],
        githubUrl: 'https://github.com/rahulm-cloud/aws-serverless-architecture'
      }
    ],
    experience: [],
    certifications: [
      { id: 'c06_1', name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', date: '2025-11-20' }
    ]
  },

  // Student 7: Hari Prasad (Hosur, DevOps Engineer)
  {
    id: 'std_07',
    userId: 'usr_student_07',
    name: 'Hari Prasad',
    email: 'student07@careerai.demo',
    phone: '+91 94447 89012',
    location: 'Hosur, Tamil Nadu',
    college: 'Adhiyamaan College of Engineering, Hosur',
    degree: 'B.Tech in Information Technology',
    graduationYear: 2026,
    cgpa: 8.50,
    bio: 'DevOps practitioner automating build pipelines, Kubernetes clusters, Docker containers, and GitHub Actions workflows.',
    targetCareerId: 'cg_devops',
    skills: [
      { id: 's07_1', name: 'CI/CD', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-16', evidenceCount: 3 },
      { id: 's07_2', name: 'Docker', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 3 },
      { id: 's07_3', name: 'Kubernetes', confidence: 0.80, verified: true, lastDemonstrated: '2026-01-25', evidenceCount: 2 },
      { id: 's07_4', name: 'Linux', confidence: 0.86, verified: true, lastDemonstrated: '2026-02-02', evidenceCount: 3 },
      { id: 's07_5', name: 'Git', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 }
    ],
    careerReadinessScore: 87,
    projects: [
      {
        id: 'p07_1',
        title: 'GitOps Continuous Delivery Pipeline',
        description: 'Built an ArgoCD GitOps pipeline deploying microservices to an EKS Kubernetes cluster with automated rollback.',
        technologies: ['Kubernetes', 'Docker', 'CI/CD', 'Git'],
        githubUrl: 'https://github.com/hariprasad-devops/gitops-k8s-delivery'
      }
    ],
    experience: [],
    certifications: []
  },

  // Student 8: Ajay Kumar (Erode, Frontend Developer)
  {
    id: 'std_08',
    userId: 'usr_student_08',
    name: 'Ajay Kumar',
    email: 'student08@careerai.demo',
    phone: '+91 97888 90123',
    location: 'Erode, Tamil Nadu',
    college: 'Kongu Engineering College, Perundurai, Erode',
    degree: 'B.E. in Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.40,
    bio: 'Frontend developer dedicated to creating accessible web apps using React, Tailwind CSS, TypeScript, and responsive modern layouts.',
    targetCareerId: 'cg_frontend',
    skills: [
      { id: 's08_1', name: 'React', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-17', evidenceCount: 3 },
      { id: 's08_2', name: 'JavaScript', confidence: 0.87, verified: true, lastDemonstrated: '2026-02-19', evidenceCount: 3 },
      { id: 's08_3', name: 'Tailwind CSS', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-21', evidenceCount: 4 },
      { id: 's08_4', name: 'TypeScript', confidence: 0.78, verified: true, lastDemonstrated: '2026-01-28', evidenceCount: 2 },
      { id: 's08_5', name: 'HTML', confidence: 0.95, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 },
      { id: 's08_6', name: 'CSS', confidence: 0.94, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 }
    ],
    careerReadinessScore: 88,
    projects: [
      {
        id: 'p08_1',
        title: 'Textile Artisan Showcase & Catalog',
        description: 'Responsive e-commerce showcase highlighting handloom weavers of Erode with instant search filtering.',
        technologies: ['React', 'Tailwind CSS', 'TypeScript'],
        githubUrl: 'https://github.com/ajaykumar-fe/erode-textile-showcase'
      }
    ],
    experience: [],
    certifications: []
  },

  // Student 9: Pranav R (Vellore, Machine Learning Engineer)
  {
    id: 'std_09',
    userId: 'usr_student_09',
    name: 'Pranav R',
    email: 'student09@careerai.demo',
    phone: '+91 94459 01234',
    location: 'Vellore, Tamil Nadu',
    college: 'Vellore Institute of Technology (VIT), Vellore',
    degree: 'B.Tech in Computer Science and Engineering (Data Science)',
    graduationYear: 2026,
    cgpa: 9.04,
    bio: 'ML Engineer specializing in model training, PyTorch optimization, Docker containerization, and low-latency inference endpoints.',
    targetCareerId: 'cg_ml_eng',
    skills: [
      { id: 's09_1', name: 'Python', confidence: 0.91, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 4 },
      { id: 's09_2', name: 'Machine Learning', confidence: 0.89, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 3 },
      { id: 's09_3', name: 'Deep Learning', confidence: 0.86, verified: true, lastDemonstrated: '2026-01-30', evidenceCount: 3 },
      { id: 's09_4', name: 'PyTorch', confidence: 0.85, verified: true, lastDemonstrated: '2026-02-04', evidenceCount: 3 },
      { id: 's09_5', name: 'FastAPI', confidence: 0.80, verified: true, lastDemonstrated: '2026-01-22', evidenceCount: 2 }
    ],
    careerReadinessScore: 89,
    projects: [
      {
        id: 'p09_1',
        title: 'Real-Time Edge Traffic Density Estimation',
        description: 'Deployed a quantized YOLO model on edge video streams, counting vehicles with sub-30ms latency.',
        technologies: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
        githubUrl: 'https://github.com/pranavr-ml/edge-traffic-vision'
      }
    ],
    experience: [
      {
        id: 'e09_1',
        company: 'VIT AI Research Lab',
        role: 'Student ML Fellow',
        startDate: '2025-07-01',
        endDate: '2025-12-15',
        description: 'Assisted in training self-supervised medical image representations.'
      }
    ],
    certifications: []
  },

  // Student 10: Sathish K (Thanjavur, Data Analyst)
  {
    id: 'std_10',
    userId: 'usr_student_10',
    name: 'Sathish K',
    email: 'student10@careerai.demo',
    phone: '+91 98410 12345',
    location: 'Thanjavur, Tamil Nadu',
    college: 'SASTRA Deemed University, Thanjavur',
    degree: 'B.Tech in Information and Communication Technology',
    graduationYear: 2026,
    cgpa: 8.55,
    bio: 'Data Analyst adept at SQL data extraction, Power BI dashboard design, statistical reporting, and exploratory Python analysis.',
    targetCareerId: 'cg_data_analyst',
    skills: [
      { id: 's10_1', name: 'SQL', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 3 },
      { id: 's10_2', name: 'Power BI', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 },
      { id: 's10_3', name: 'Data Science', confidence: 0.82, verified: true, lastDemonstrated: '2026-02-08', evidenceCount: 2 },
      { id: 's10_4', name: 'Excel', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 },
      { id: 's10_5', name: 'Statistics', confidence: 0.84, verified: true, lastDemonstrated: '2026-01-25', evidenceCount: 2 }
    ],
    careerReadinessScore: 87,
    projects: [
      {
        id: 'p10_1',
        title: 'Cauvery Delta Agriculture Yield Analytics',
        description: 'Aggregated 5 years of rainfall, soil moisture, and crop yield data into an interactive Power BI dashboard for delta farmers.',
        technologies: ['SQL', 'Power BI', 'Excel', 'Statistics'],
        githubUrl: 'https://github.com/sathishk-analytics/cauvery-crop-bi'
      }
    ],
    experience: [],
    certifications: [
      { id: 'c10_1', name: 'Microsoft Certified: Power BI Data Analyst Associate', issuer: 'Microsoft', date: '2025-10-30' }
    ]
  },

  // Student 11: Mohanraj V (Tiruppur, Mobile App Developer)
  {
    id: 'std_11',
    userId: 'usr_student_11',
    name: 'Mohanraj V',
    email: 'student11@careerai.demo',
    phone: '+91 97911 23456',
    location: 'Tiruppur, Tamil Nadu',
    college: 'Bannari Amman Institute of Technology, Sathyamangalam',
    degree: 'B.E. in Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.35,
    bio: 'Mobile App Developer experienced in Flutter and Dart, building clean cross-platform apps with offline SQLite sync and REST APIs.',
    targetCareerId: 'cg_mobile',
    skills: [
      { id: 's11_1', name: 'Flutter', confidence: 0.91, verified: true, lastDemonstrated: '2026-02-17', evidenceCount: 4 },
      { id: 's11_2', name: 'Dart', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-17', evidenceCount: 3 },
      { id: 's11_3', name: 'JavaScript', confidence: 0.80, verified: true, lastDemonstrated: '2026-01-20', evidenceCount: 2 },
      { id: 's11_4', name: 'REST API', confidence: 0.85, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 3 },
      { id: 's11_5', name: 'Git', confidence: 0.84, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 2 }
    ],
    careerReadinessScore: 86,
    projects: [
      {
        id: 'p11_1',
        title: 'Tiruppur Garment Logistics Mobile Suite',
        description: 'Built a Flutter app for tracking textile shipment dispatches with barcode scanning and offline sync.',
        technologies: ['Flutter', 'Dart', 'REST API'],
        githubUrl: 'https://github.com/mohanraj-mobile/garment-logistics-flutter'
      }
    ],
    experience: [],
    certifications: []
  },

  // Student 12: Ashwin T (Kanchipuram, AI/ML Developer)
  {
    id: 'std_12',
    userId: 'usr_student_12',
    name: 'Ashwin T',
    email: 'student12@careerai.demo',
    phone: '+91 98402 34567',
    location: 'Kanchipuram, Tamil Nadu',
    college: 'SSN College of Engineering, Kalavakkam, Chennai',
    degree: 'B.Tech in Information Technology',
    graduationYear: 2026,
    cgpa: 8.85,
    bio: 'AI/ML developer focusing on NLP embeddings, Scikit-Learn pipelines, Python data processing, and conversational systems.',
    targetCareerId: 'cg_ai_eng',
    skills: [
      { id: 's12_1', name: 'Python', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 },
      { id: 's12_2', name: 'Machine Learning', confidence: 0.85, verified: true, lastDemonstrated: '2026-02-08', evidenceCount: 3 },
      { id: 's12_3', name: 'Deep Learning', confidence: 0.78, verified: true, lastDemonstrated: '2026-01-25', evidenceCount: 2 },
      { id: 's12_4', name: 'SQL', confidence: 0.80, verified: true, lastDemonstrated: '2026-01-18', evidenceCount: 2 },
      { id: 's12_5', name: 'FastAPI', confidence: 0.75, verified: false, lastDemonstrated: '2025-12-10', evidenceCount: 1 }
    ],
    careerReadinessScore: 83,
    projects: [
      {
        id: 'p12_1',
        title: 'Document Q&A RAG Pipeline',
        description: 'Developed a Retrieval-Augmented Generation (RAG) system in Python using ChromaDB vector database and sentence transformers.',
        technologies: ['Python', 'Machine Learning', 'FastAPI'],
        githubUrl: 'https://github.com/ashwint-ml/doc-rag-pipeline'
      }
    ],
    experience: [],
    certifications: []
  },

  // Student 13: Gokul S (Chengalpattu, Software Developer)
  {
    id: 'std_13',
    userId: 'usr_student_13',
    name: 'Gokul S',
    email: 'student13@careerai.demo',
    phone: '+91 94453 45678',
    location: 'Chengalpattu, Tamil Nadu',
    college: 'SRM Institute of Science and Technology, Kattankulathur',
    degree: 'B.Tech in Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.70,
    bio: 'Software engineer with solid foundations in Java, OOP principles, Data Structures & Algorithms, and relational database systems.',
    targetCareerId: 'cg_backend',
    skills: [
      { id: 's13_1', name: 'Java', confidence: 0.91, verified: true, lastDemonstrated: '2026-02-16', evidenceCount: 4 },
      { id: 's13_2', name: 'SQL', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 3 },
      { id: 's13_3', name: 'OOP', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 4 },
      { id: 's13_4', name: 'DSA', confidence: 0.89, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 3 },
      { id: 's13_5', name: 'Spring Boot', confidence: 0.78, verified: true, lastDemonstrated: '2026-01-25', evidenceCount: 2 }
    ],
    careerReadinessScore: 86,
    projects: [
      {
        id: 'p13_1',
        title: 'Banking Ledger Transaction Engine',
        description: 'Implemented an ACID-compliant multithreaded double-entry financial ledger service in Java with HikariCP connection pooling.',
        technologies: ['Java', 'SQL', 'OOP', 'Spring Boot'],
        githubUrl: 'https://github.com/gokuls-dev/banking-ledger-core'
      }
    ],
    experience: [],
    certifications: []
  },

  // Student 14: Manoj R (Dindigul, UI/UX + Frontend Developer)
  {
    id: 'std_14',
    userId: 'usr_student_14',
    name: 'Manoj R',
    email: 'student14@careerai.demo',
    phone: '+91 97894 12345',
    location: 'Dindigul, Tamil Nadu',
    college: 'PSNA College of Engineering and Technology, Dindigul',
    degree: 'B.E. in Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.42,
    bio: 'UI/UX enthusiast combining Figma auto-layout design systems with clean React, Tailwind CSS, and micro-animations.',
    targetCareerId: 'cg_uiux',
    skills: [
      { id: 's14_1', name: 'UI Design', confidence: 0.93, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 4 },
      { id: 's14_2', name: 'Figma', confidence: 0.94, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 },
      { id: 's14_3', name: 'React', confidence: 0.82, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 3 },
      { id: 's14_4', name: 'Tailwind CSS', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-16', evidenceCount: 3 },
      { id: 's14_5', name: 'CSS', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 3 }
    ],
    careerReadinessScore: 87,
    projects: [
      {
        id: 'p14_1',
        title: 'Locksmith Craft Enterprise Design System',
        description: 'Complete Figma design system with 200+ accessible components, tokens, and React Tailwind implementation.',
        technologies: ['UI Design', 'Figma', 'React', 'Tailwind CSS'],
        githubUrl: 'https://github.com/manojr-ui/craft-design-system'
      }
    ],
    experience: [],
    certifications: []
  },

  // Student 15: Vijay S (Thoothukudi, Cloud + Backend Developer)
  {
    id: 'std_15',
    userId: 'usr_student_15',
    name: 'Vijay S',
    email: 'student15@careerai.demo',
    phone: '+91 98425 67890',
    location: 'Thoothukudi, Tamil Nadu',
    college: 'National Engineering College, Kovilpatti',
    degree: 'B.Tech in Information Technology',
    graduationYear: 2026,
    cgpa: 8.52,
    bio: 'Backend & Cloud engineer focused on building Docker microservices, AWS deployment, Node.js APIs, and SQL database tuning.',
    targetCareerId: 'cg_backend',
    skills: [
      { id: 's15_1', name: 'Node.js', confidence: 0.87, verified: true, lastDemonstrated: '2026-02-17', evidenceCount: 3 },
      { id: 's15_2', name: 'AWS', confidence: 0.82, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 2 },
      { id: 's15_3', name: 'Docker', confidence: 0.85, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 3 },
      { id: 's15_4', name: 'SQL', confidence: 0.83, verified: true, lastDemonstrated: '2026-01-26', evidenceCount: 2 },
      { id: 's15_5', name: 'Linux', confidence: 0.84, verified: true, lastDemonstrated: '2026-02-05', evidenceCount: 2 }
    ],
    careerReadinessScore: 84,
    projects: [
      {
        id: 'p15_1',
        title: 'Port Cargo Dispatch Telemetry Service',
        description: 'Containerized microservice receiving ship cargo telemetry data with AWS ECS Fargate deployment.',
        technologies: ['Node.js', 'Docker', 'AWS', 'SQL'],
        githubUrl: 'https://github.com/vijays-backend/port-cargo-telemetry'
      }
    ],
    experience: [],
    certifications: []
  }
];

// 4. 5 Real Tamil Nadu Companies & 15 Real Jobs
export const DEMO_COMPANIES: Company[] = [
  // Company 1: Chennai AI Labs
  {
    id: 'cmp_01',
    userId: 'usr_company_01',
    name: 'Chennai AI Labs',
    email: 'company01@careerai.demo',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    website: 'https://chennaiailabs.example.com',
    location: 'Tidel Park, Taramani, Chennai, Tamil Nadu',
    industry: 'Artificial Intelligence & Software',
    description: 'Premier AI research and product development center building deep learning, computer vision, and NLP intelligence solutions for global enterprises.',
    employeeCount: '50-150',
    verified: true
  },
  // Company 2: Coimbatore TechWorks
  {
    id: 'cmp_02',
    userId: 'usr_company_02',
    name: 'Coimbatore TechWorks',
    email: 'company02@careerai.demo',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    website: 'https://coimbatoretechworks.example.com',
    location: 'CHIL SEZ, Saravanampatti, Coimbatore, Tamil Nadu',
    industry: 'Full Stack & Enterprise Software',
    description: 'Leading digital engineering firm architecting modern cloud-native web applications, TypeScript microservices, and React design systems.',
    employeeCount: '150-300',
    verified: true
  },
  // Company 3: Madurai Data Systems
  {
    id: 'cmp_03',
    userId: 'usr_company_03',
    name: 'Madurai Data Systems',
    email: 'company03@careerai.demo',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80',
    website: 'https://maduraidatasystems.example.com',
    location: 'ELCOT IT Park, Vadapalanji, Madurai, Tamil Nadu',
    industry: 'Data Science & Business Analytics',
    description: 'Specialized data science and BI engineering agency delivering predictive analytics, ETL pipelines, and machine learning models.',
    employeeCount: '80-200',
    verified: true
  },
  // Company 4: Tamil Cloud Technologies
  {
    id: 'cmp_04',
    userId: 'usr_company_04',
    name: 'Tamil Cloud Technologies',
    email: 'company04@careerai.demo',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop&q=80',
    website: 'https://tamilcloudtech.example.com',
    location: 'SIPCOT Industrial Park, Hosur, Tamil Nadu',
    industry: 'Cloud Infrastructure & DevOps',
    description: 'Cloud acceleration partner helping enterprises migrate, automate, and secure mission-critical workloads across AWS and Google Cloud.',
    employeeCount: '100-250',
    verified: true
  },
  // Company 5: South India Cyber Labs
  {
    id: 'cmp_05',
    userId: 'usr_company_05',
    name: 'South India Cyber Labs',
    email: 'company05@careerai.demo',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80',
    website: 'https://southindiacyber.example.com',
    location: 'DLF Cybercity, Manapakkam, Chennai, Tamil Nadu',
    industry: 'Cybersecurity & Defense Operations',
    description: 'Elite cybersecurity operations and auditing firm providing SOC defense, penetration testing, and Zero Trust identity architectures.',
    employeeCount: '40-120',
    verified: true
  }
];

// 5. 15 Published Jobs across the 5 Companies
export const DEMO_JOBS: Job[] = [
  // Jobs for Chennai AI Labs
  {
    id: 'job_01',
    companyId: 'cmp_01',
    title: 'AI Engineer',
    department: 'Research & Intelligence',
    location: 'Chennai, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level / Graduate',
    salary: '₹12,00,000 - ₹16,00,000 / yr',
    description: 'Design and deploy deep learning models, transformer fine-tuning, and scalable FastAPI inference pipelines.',
    requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch'],
    preferredSkills: ['FastAPI', 'Docker', 'SQL'],
    status: 'open',
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'job_02',
    companyId: 'cmp_01',
    title: 'Machine Learning Intern',
    department: 'Machine Learning',
    location: 'Chennai, Tamil Nadu (On-site)',
    type: 'Internship',
    experienceLevel: 'Student / Intern',
    salary: '₹35,000 / month',
    description: 'Assist the core AI research team in data collection, cleaning, baseline model benchmarking, and hyperparameter tuning.',
    requiredSkills: ['Python', 'Machine Learning', 'Pandas'],
    preferredSkills: ['Deep Learning', 'PyTorch'],
    status: 'open',
    createdAt: '2026-01-20T10:00:00.000Z'
  },
  {
    id: 'job_03',
    companyId: 'cmp_01',
    title: 'Data Science Intern',
    department: 'Data Analytics',
    location: 'Chennai, Tamil Nadu (Hybrid)',
    type: 'Internship',
    experienceLevel: 'Student / Intern',
    salary: '₹30,000 / month',
    description: 'Perform exploratory data analysis on enterprise datasets, write statistical summaries, and build initial classification prototypes.',
    requiredSkills: ['Python', 'Data Science', 'SQL'],
    preferredSkills: ['Pandas', 'Statistics'],
    status: 'open',
    createdAt: '2026-01-25T10:00:00.000Z'
  },

  // Jobs for Coimbatore TechWorks
  {
    id: 'job_04',
    companyId: 'cmp_02',
    title: 'Full Stack Developer',
    department: 'Core Product Engineering',
    location: 'Coimbatore, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level / 0-2 yrs',
    salary: '₹9,00,000 - ₹13,00,000 / yr',
    description: 'Build responsive web apps using React, TypeScript, and Node.js. Design efficient PostgreSQL schemas and REST APIs.',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
    preferredSkills: ['PostgreSQL', 'Tailwind CSS', 'Git'],
    status: 'open',
    createdAt: '2026-01-12T10:00:00.000Z'
  },
  {
    id: 'job_05',
    companyId: 'cmp_02',
    title: 'Frontend Developer',
    department: 'UI/UX Engineering',
    location: 'Coimbatore, Tamil Nadu (Remote)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level',
    salary: '₹8,00,000 - ₹11,00,000 / yr',
    description: 'Translate Figma prototypes into accessible, responsive React components using Tailwind CSS and modern state patterns.',
    requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML'],
    preferredSkills: ['TypeScript', 'CSS', 'Git'],
    status: 'open',
    createdAt: '2026-01-18T10:00:00.000Z'
  },
  {
    id: 'job_06',
    companyId: 'cmp_02',
    title: 'Backend Developer',
    department: 'Platform Systems',
    location: 'Coimbatore, Tamil Nadu (On-site)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level',
    salary: '₹8,50,000 - ₹12,00,000 / yr',
    description: 'Develop high-throughput REST APIs with Node.js and Express. Ensure robust authentication, rate limiting, and SQL database queries.',
    requiredSkills: ['Node.js', 'Express.js', 'SQL', 'JavaScript'],
    preferredSkills: ['PostgreSQL', 'Docker', 'Git'],
    status: 'open',
    createdAt: '2026-01-22T10:00:00.000Z'
  },

  // Jobs for Madurai Data Systems
  {
    id: 'job_07',
    companyId: 'cmp_03',
    title: 'Data Analyst',
    department: 'Business Intelligence',
    location: 'Madurai, Tamil Nadu (On-site)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level',
    salary: '₹6,50,000 - ₹9,50,000 / yr',
    description: 'Query relational databases, build executive Power BI KPI dashboards, and deliver statistical summaries to client stakeholders.',
    requiredSkills: ['SQL', 'Power BI', 'Excel', 'Statistics'],
    preferredSkills: ['Python', 'Data Science'],
    status: 'open',
    createdAt: '2026-01-14T10:00:00.000Z'
  },
  {
    id: 'job_08',
    companyId: 'cmp_03',
    title: 'Data Scientist',
    department: 'Advanced Analytics',
    location: 'Madurai, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level / 1-2 yrs',
    salary: '₹10,00,000 - ₹14,00,000 / yr',
    description: 'Develop predictive models, customer segmentation algorithms, and regression forecasting pipelines using Python and Scikit-Learn.',
    requiredSkills: ['Python', 'Data Science', 'Pandas', 'Machine Learning'],
    preferredSkills: ['SQL', 'Statistics', 'Deep Learning'],
    status: 'open',
    createdAt: '2026-01-19T10:00:00.000Z'
  },
  {
    id: 'job_09',
    companyId: 'cmp_03',
    title: 'Python Developer',
    department: 'Data Engineering',
    location: 'Madurai, Tamil Nadu (On-site)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level',
    salary: '₹7,50,000 - ₹11,00,000 / yr',
    description: 'Write robust Python ETL data ingestion scripts, clean messy data streams, and populate PostgreSQL analytical data warehouses.',
    requiredSkills: ['Python', 'SQL', 'Pandas'],
    preferredSkills: ['FastAPI', 'Docker', 'Git'],
    status: 'open',
    createdAt: '2026-01-24T10:00:00.000Z'
  },

  // Jobs for Tamil Cloud Technologies
  {
    id: 'job_10',
    companyId: 'cmp_04',
    title: 'Cloud Engineer',
    department: 'Cloud Infrastructure',
    location: 'Hosur, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level',
    salary: '₹10,00,000 - ₹14,50,000 / yr',
    description: 'Provision and maintain multi-tier AWS infrastructure, configure VPC subnets, manage S3 storage, and automate serverless Lambda functions.',
    requiredSkills: ['AWS', 'Cloud Computing', 'Docker', 'Linux'],
    preferredSkills: ['CI/CD', 'Git', 'Google Cloud'],
    status: 'open',
    createdAt: '2026-01-16T10:00:00.000Z'
  },
  {
    id: 'job_11',
    companyId: 'cmp_04',
    title: 'DevOps Intern',
    department: 'Site Reliability Engineering',
    location: 'Hosur, Tamil Nadu (On-site)',
    type: 'Internship',
    experienceLevel: 'Student / Intern',
    salary: '₹28,000 / month',
    description: 'Assist DevOps architects in building automated GitHub Actions CI/CD pipelines, containerizing services, and tracking Prometheus alerts.',
    requiredSkills: ['Docker', 'Linux', 'Git'],
    preferredSkills: ['CI/CD', 'Kubernetes', 'AWS'],
    status: 'open',
    createdAt: '2026-01-21T10:00:00.000Z'
  },
  {
    id: 'job_12',
    companyId: 'cmp_04',
    title: 'Backend Engineer',
    department: 'Platform Engineering',
    location: 'Hosur, Tamil Nadu (Remote)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level / 0-2 yrs',
    salary: '₹9,00,000 - ₹13,00,000 / yr',
    description: 'Engineer scalable cloud backend APIs in Node.js or Java, integrate message queues, and deploy containers cleanly to AWS ECS.',
    requiredSkills: ['Node.js', 'SQL', 'Docker', 'Linux'],
    preferredSkills: ['AWS', 'Redis', 'Git'],
    status: 'open',
    createdAt: '2026-01-26T10:00:00.000Z'
  },

  // Jobs for South India Cyber Labs
  {
    id: 'job_13',
    companyId: 'cmp_05',
    title: 'Cybersecurity Analyst',
    department: 'Security Operations Center',
    location: 'Chennai, Tamil Nadu (On-site)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level / 0-2 yrs',
    salary: '₹10,50,000 - ₹15,00,000 / yr',
    description: 'Monitor enterprise SIEM security alerts, analyze suspicious network packet captures, and harden Linux servers against attacks.',
    requiredSkills: ['Cybersecurity', 'Networking', 'Linux', 'OWASP'],
    preferredSkills: ['Bash/Shell', 'Python'],
    status: 'open',
    createdAt: '2026-01-13T10:00:00.000Z'
  },
  {
    id: 'job_14',
    companyId: 'cmp_05',
    title: 'Security Intern',
    department: 'Threat Intelligence',
    location: 'Chennai, Tamil Nadu (On-site)',
    type: 'Internship',
    experienceLevel: 'Student / Intern',
    salary: '₹30,000 / month',
    description: 'Perform web application vulnerability scanning, test for OWASP Top 10 vulnerabilities, and write technical audit reports.',
    requiredSkills: ['Cybersecurity', 'Networking', 'Linux'],
    preferredSkills: ['OWASP', 'Python'],
    status: 'open',
    createdAt: '2026-01-17T10:00:00.000Z'
  },
  {
    id: 'job_15',
    companyId: 'cmp_05',
    title: 'SOC Analyst',
    department: 'Incident Response',
    location: 'Chennai, Tamil Nadu (Rotational Shifts)',
    type: 'Full-time',
    experienceLevel: 'Entry-Level',
    salary: '₹9,50,000 - ₹13,50,000 / yr',
    description: 'Perform 24/7 security event triage, investigate intrusion attempts, and document post-incident remediation procedures.',
    requiredSkills: ['Cybersecurity', 'Networking', 'Linux'],
    preferredSkills: ['OWASP', 'Bash/Shell'],
    status: 'open',
    createdAt: '2026-01-23T10:00:00.000Z'
  }
];

// 6. Realistic Evidences for the Students
export const DEMO_EVIDENCES: SkillEvidence[] = [
  // Arjun Kumar evidences
  {
    id: 'evi_01_1',
    studentId: 'std_01',
    skillName: 'Python',
    sourceType: 'github',
    title: 'Tamil Speech Recognition Model',
    verified: true,
    verificationScore: 92,
    confidenceBoost: 0.15,
    dateDemonstrated: '2026-02-15',
    url: 'https://github.com/arjunkumar-dev/tamil-whisper-asr',
    metadata: { stars: 18, linesOfCode: 2400, commitsCount: 42 }
  },
  {
    id: 'evi_01_2',
    studentId: 'std_01',
    skillName: 'PyTorch',
    sourceType: 'github',
    title: 'X-Ray ResNet-50 Classifier',
    verified: true,
    verificationScore: 88,
    confidenceBoost: 0.12,
    dateDemonstrated: '2026-01-28',
    url: 'https://github.com/arjunkumar-dev/xray-pneumonia-vision',
    metadata: { stars: 9, linesOfCode: 1200 }
  },
  {
    id: 'evi_01_3',
    studentId: 'std_01',
    skillName: 'Machine Learning',
    sourceType: 'certification',
    title: 'Deep Learning Specialization',
    verified: true,
    verificationScore: 95,
    confidenceBoost: 0.18,
    dateDemonstrated: '2025-09-15',
    url: 'https://coursera.org/verify/DL-ARJUN-2025'
  },

  // Kavin Raj evidences
  {
    id: 'evi_02_1',
    studentId: 'std_02',
    skillName: 'React',
    sourceType: 'github',
    title: 'AgriCommerce Direct Marketplace',
    verified: true,
    verificationScore: 94,
    confidenceBoost: 0.16,
    dateDemonstrated: '2026-02-18',
    url: 'https://github.com/kavinraj-dev/agri-commerce-portal',
    metadata: { stars: 24, linesOfCode: 4800 }
  },
  {
    id: 'evi_02_2',
    studentId: 'std_02',
    skillName: 'Node.js',
    sourceType: 'project',
    title: 'AgriCommerce API & Order Gateway',
    verified: true,
    verificationScore: 89,
    confidenceBoost: 0.14,
    dateDemonstrated: '2026-01-30'
  },

  // Dharshan P evidences
  {
    id: 'evi_05_1',
    studentId: 'std_05',
    skillName: 'Cybersecurity',
    sourceType: 'certification',
    title: 'CompTIA Security+ Certification',
    verified: true,
    verificationScore: 96,
    confidenceBoost: 0.20,
    dateDemonstrated: '2025-09-01'
  },
  {
    id: 'evi_05_2',
    studentId: 'std_05',
    skillName: 'OWASP',
    sourceType: 'github',
    title: 'Automated Web Vulnerability Scanner',
    verified: true,
    verificationScore: 90,
    confidenceBoost: 0.15,
    dateDemonstrated: '2026-01-30',
    url: 'https://github.com/dharshan-sec/auto-vuln-scanner'
  }
];

// 7. Industry Data for Admin Management
export interface AdminIndustryData {
  id: string;
  name: string;
  sector: string;
  region: string;
  totalCompanies: number;
  openJobsCount: number;
  avgSalary: string;
  growthRate: string;
  talentDemandScore: number;
  inDemandSkills: string[];
  keySkillGaps: string[];
  description: string;
}

export const ADMIN_INDUSTRIES_SEED: AdminIndustryData[] = [
  {
    id: 'ind_ai_software',
    name: 'Artificial Intelligence & Software',
    sector: 'Software & Technology',
    region: 'Chennai & Coimbatore, Tamil Nadu',
    totalCompanies: 28,
    openJobsCount: 142,
    avgSalary: '₹14,20,000 / yr',
    growthRate: '+34% YoY',
    talentDemandScore: 96,
    inDemandSkills: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'FastAPI'],
    keySkillGaps: ['Distributed Training', 'Quantization (ONNX)', 'Vector Databases'],
    description: 'High-growth sector focused on deep learning model fine-tuning, computer vision, and generative intelligence APIs.'
  },
  {
    id: 'ind_saas_cloud',
    name: 'SaaS & Enterprise Cloud',
    sector: 'Cloud Infrastructure',
    region: 'Hosur & Chennai, Tamil Nadu',
    totalCompanies: 35,
    openJobsCount: 185,
    avgSalary: '₹13,50,000 / yr',
    growthRate: '+29% YoY',
    talentDemandScore: 92,
    inDemandSkills: ['AWS', 'Docker', 'Kubernetes', 'Node.js', 'CI/CD'],
    keySkillGaps: ['Terraform IaC', 'Multi-region failover', 'Prometheus monitoring'],
    description: 'Enterprises modernizing on-premise infrastructure into scalable AWS, GCP, and Kubernetes cloud-native architectures.'
  },
  {
    id: 'ind_analytics_fintech',
    name: 'Data Science & FinTech Analytics',
    sector: 'Data & Financial Technology',
    region: 'Madurai & Chennai, Tamil Nadu',
    totalCompanies: 22,
    openJobsCount: 110,
    avgSalary: '₹12,80,000 / yr',
    growthRate: '+27% YoY',
    talentDemandScore: 88,
    inDemandSkills: ['SQL', 'Python', 'Pandas', 'Power BI', 'Statistics'],
    keySkillGaps: ['Data Warehousing (Snowflake)', 'Streaming ETL', 'Feature Stores'],
    description: 'Financial institutions and analytics bureaus engineering real-time fraud detection and customer segmentation pipelines.'
  },
  {
    id: 'ind_cybersec',
    name: 'Cybersecurity & Defense Operations',
    sector: 'Information Security',
    region: 'Chennai & Tiruchirappalli, Tamil Nadu',
    totalCompanies: 18,
    openJobsCount: 95,
    avgSalary: '₹13,10,000 / yr',
    growthRate: '+38% YoY',
    talentDemandScore: 94,
    inDemandSkills: ['Cybersecurity', 'Networking', 'Linux', 'OWASP', 'Wireshark'],
    keySkillGaps: ['Threat Hunting', 'SIEM Rule Authoring', 'Cloud IAM Auditing'],
    description: 'Critical infrastructure security, SOC defense monitoring, web application penetration testing, and zero trust protocols.'
  },
  {
    id: 'ind_mobile_iot',
    name: 'Mobile Engineering & Industrial IoT',
    sector: 'Mobile & Hardware Integration',
    region: 'Coimbatore, Tiruppur & Salem, Tamil Nadu',
    totalCompanies: 20,
    openJobsCount: 88,
    avgSalary: '₹10,50,000 / yr',
    growthRate: '+23% YoY',
    talentDemandScore: 84,
    inDemandSkills: ['Flutter', 'Dart', 'React', 'REST API', 'JavaScript'],
    keySkillGaps: ['Offline Sync Architecture', 'Bluetooth Low Energy (BLE)', 'State Management (BLoC)'],
    description: 'Industrial mobile telemetry and supply chain dispatch suites for manufacturing and textiles hubs across western Tamil Nadu.'
  }
];
