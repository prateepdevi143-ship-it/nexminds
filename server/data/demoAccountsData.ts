import {
  User,
  Student,
  Company,
  Job,
  SkillEvidence,
  CareerGoal
} from '../../src/types';

export interface AdminIndustryData {
  id: string;
  name: string;
  category: string;
  activeHiringPartners: number;
  openOpportunities: number;
  avgStartingCtc: string;
  topDemandedSkills: string[];
}

// 1. All Platform Users (10 Students + 5 Companies + 1 Admin)
export const DEMO_USERS: User[] = [
  // 10 Students
  { id: 'usr_student_01', email: 'demo.student01@nextmind.demo', name: 'Arjun Kumar', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_student_02', email: 'demo.student02@nextmind.demo', name: 'Kavin Raj', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_student_03', email: 'demo.student03@nextmind.demo', name: 'Priya Dharshini', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_student_04', email: 'demo.student04@nextmind.demo', name: 'Vignesh Sundaram', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_student_05', email: 'demo.student05@nextmind.demo', name: 'Dharshan Pandian', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_student_06', email: 'demo.student06@nextmind.demo', name: 'Sneha Ramachandran', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_student_07', email: 'demo.student07@nextmind.demo', name: 'Hari Prasad', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_student_08', email: 'demo.student08@nextmind.demo', name: 'Ananya Subramanian', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_student_09', email: 'demo.student09@nextmind.demo', name: 'Pranav Ravichandran', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_student_10', email: 'demo.student10@nextmind.demo', name: 'Rahul Manikandan', role: 'student', createdAt: '2026-01-01T00:00:00.000Z' },

  // 5 Companies
  { id: 'usr_company_01', email: 'demo.company01@nextmind.demo', name: 'Nexora Technologies — Demo', role: 'company', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_company_02', email: 'demo.company02@nextmind.demo', name: 'DataForge Analytics — Demo', role: 'company', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_company_03', email: 'demo.company03@nextmind.demo', name: 'CloudAxis Systems — Demo', role: 'company', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_company_04', email: 'demo.company04@nextmind.demo', name: 'SecureStack Labs — Demo', role: 'company', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr_company_05', email: 'demo.company05@nextmind.demo', name: 'AppNova Digital — Demo', role: 'company', createdAt: '2026-01-01T00:00:00.000Z' },

  // Admin
  { id: 'usr_admin', email: 'demo.admin@nextmind.demo', name: 'NextMind Platform Administrator', role: 'admin', createdAt: '2026-01-01T00:00:00.000Z' }
];

// Career Goals Catalog
export const CAREER_GOALS: CareerGoal[] = [
  {
    id: 'cg_ai_eng',
    title: 'AI / Machine Learning Engineer',
    domain: 'Artificial Intelligence',
    avgSalary: '₹14,00,000 / yr',
    growthRate: '+38% YoY',
    demandLevel: 'High',
    requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Data Science'],
    description: 'Design and deploy deep learning models, transformer fine-tuning, and scalable ML inference pipelines.'
  },
  {
    id: 'cg_backend',
    title: 'Backend Software Developer',
    domain: 'Software Engineering',
    avgSalary: '₹11,50,000 / yr',
    growthRate: '+28% YoY',
    demandLevel: 'High',
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'REST API', 'DSA'],
    description: 'Build enterprise microservices, transactional database systems, and low-latency APIs.'
  },
  {
    id: 'cg_fullstack',
    title: 'Full Stack Web Developer',
    domain: 'Web Development',
    avgSalary: '₹12,00,000 / yr',
    growthRate: '+30% YoY',
    demandLevel: 'High',
    requiredSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'REST API'],
    description: 'Architect modern responsive interfaces and scalable Node.js/Express server backends.'
  },
  {
    id: 'cg_data_analyst',
    title: 'Data Analyst & BI Specialist',
    domain: 'Business Analytics',
    avgSalary: '₹9,00,000 / yr',
    growthRate: '+24% YoY',
    demandLevel: 'High',
    requiredSkills: ['Python', 'Data Science', 'SQL', 'Power BI', 'Pandas'],
    description: 'Transform complex datasets into actionable business intelligence dashboards and KPI models.'
  },
  {
    id: 'cg_cybersecurity',
    title: 'Cybersecurity Analyst',
    domain: 'Information Security',
    avgSalary: '₹11,00,000 / yr',
    growthRate: '+34% YoY',
    demandLevel: 'High',
    requiredSkills: ['Cybersecurity', 'Networking', 'Linux', 'Python', 'OWASP'],
    description: 'Defend organizational attack surfaces, conduct penetration testing, and manage SOC workflows.'
  },
  {
    id: 'cg_cloud_devops',
    title: 'Cloud & DevOps Engineer',
    domain: 'Cloud Architecture',
    avgSalary: '₹13,50,000 / yr',
    growthRate: '+36% YoY',
    demandLevel: 'High',
    requiredSkills: ['Linux', 'Docker', 'AWS', 'Kubernetes', 'CI/CD', 'Git'],
    description: 'Automate release pipelines, configure container clusters, and manage resilient cloud infrastructure.'
  },
  {
    id: 'cg_mobile',
    title: 'Mobile Application Developer',
    domain: 'Mobile Engineering',
    avgSalary: '₹10,50,000 / yr',
    growthRate: '+22% YoY',
    demandLevel: 'Medium',
    requiredSkills: ['Java', 'Android', 'Firebase', 'REST API', 'JavaScript'],
    description: 'Build native and responsive mobile applications with cloud syncing and push notifications.'
  },
  {
    id: 'cg_systems',
    title: 'Systems & Core Software Engineer',
    domain: 'Low-Level Systems',
    avgSalary: '₹15,00,000 / yr',
    growthRate: '+26% YoY',
    demandLevel: 'High',
    requiredSkills: ['C++', 'DSA', 'Linux', 'SQL', 'Git'],
    description: 'Engineer high-throughput systems, custom memory allocators, and concurrency engines.'
  }
];

// 2. 10 Synthetic Students
export const DEMO_STUDENTS: (Student & { isDemo?: boolean; demoSeedVersion?: string })[] = [
  // Student 01: Arjun Kumar (Python + ML + Pandas + NumPy + Scikit-Learn)
  {
    id: 'std_01',
    userId: 'usr_student_01',
    name: 'Arjun Kumar',
    email: 'demo.student01@nextmind.demo',
    phone: '+91 98401 23456',
    location: 'Chennai, Tamil Nadu',
    college: 'Chennai Institute of Technology — Demo Profile',
    degree: 'B.Tech Artificial Intelligence & Data Science',
    graduationYear: 2026,
    cgpa: 8.8,
    bio: 'AI & Data Science student with deep hands-on expertise in Python, Scikit-learn, Pandas, and machine learning pipelines. Winner at Campus Innovation Challenge.',
    careerGoal: 'AI / Machine Learning Engineer',
    targetCareerId: 'cg_ai_eng',
    profileCompletion: 95,
    careerReadinessScore: 92,
    resumeFileName: 'Arjun_Kumar_Resume_AI.pdf',
    resumeScore: 94,
    skills: [
      { id: 's01_1', name: 'Python', confidence: 0.95, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 5 },
      { id: 's01_2', name: 'Machine Learning', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 4 },
      { id: 's01_3', name: 'Pandas', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 },
      { id: 's01_4', name: 'NumPy', confidence: 0.86, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 3 },
      { id: 's01_5', name: 'Scikit-learn', confidence: 0.85, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 3 },
      { id: 's01_6', name: 'DSA', confidence: 0.82, verified: true, lastDemonstrated: '2026-01-25', evidenceCount: 2 }
    ],
    projects: [
      {
        id: 'p01_1',
        title: 'Student Performance & Dropout Prediction Engine',
        description: 'Engineered an ML classification model using Pandas, NumPy, and Scikit-learn on 12,000 academic records achieving 91.4% recall.',
        technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
        githubUrl: 'https://github.com/arjun-ai-demo/student-performance-prediction'
      },
      {
        id: 'p01_2',
        title: 'Smart Resume ATS Analyzer & Skill Extractor',
        description: 'Extracted technical skill vectors from resumes using Python text pipelines, benchmarking match scores against job descriptions.',
        technologies: ['Python', 'Machine Learning', 'Pandas'],
        githubUrl: 'https://github.com/arjun-ai-demo/smart-resume-analyzer'
      }
    ],
    experience: [
      {
        id: 'e01_1',
        company: 'Nexora Technologies (Demo)',
        role: 'AI Developer Intern',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        description: 'Optimized tabular ML pipelines and automated data preprocessing workflows for enterprise clients.'
      }
    ],
    hackathons: [
      {
        id: 'h01_1',
        name: 'Campus Innovation Challenge 2026',
        project: 'Smart Campus Assistant',
        rank: 'Winner — 1st Place',
        technologies: ['Python', 'Machine Learning', 'Pandas'],
        date: '2026-01-20',
        description: 'Built an intelligent student advising engine using predictive ML models.'
      }
    ],
    certifications: [
      { id: 'c01_1', name: 'Python for Data Science Professional', issuer: 'IBM / Coursera', date: '2025-09-15' },
      { id: 'c01_2', name: 'Machine Learning Foundations Specialization', issuer: 'DeepLearning.AI', date: '2025-11-10' }
    ],
    externalProfiles: {
      githubUsername: 'arjun-ai-demo',
      leetcodeUsername: 'arjun_dev_demo',
      githubData: {
        publicRepos: 18,
        topLanguages: [
          { language: 'Python', count: 14, percentage: 78 },
          { language: 'Jupyter', count: 3, percentage: 17 },
          { language: 'Shell', count: 1, percentage: 5 }
        ],
        totalStars: 54,
        contributionLevel: 'High Impact'
      },
      leetcodeData: {
        totalSolved: 180,
        easySolved: 80,
        mediumSolved: 85,
        hardSolved: 15,
        ranking: 52000,
        contestRating: 1680
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Student 02: Kavin Raj (Java + DSA + SQL + Spring Boot)
  {
    id: 'std_02',
    userId: 'usr_student_02',
    name: 'Kavin Raj',
    email: 'demo.student02@nextmind.demo',
    phone: '+91 98402 34567',
    location: 'Coimbatore, Tamil Nadu',
    college: 'Coimbatore Institute of Engineering — Demo Profile',
    degree: 'B.E. Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.4,
    bio: 'Backend specialist with high proficiency in Java, Spring Boot microservices, relational database modeling, and complex algorithms (320+ LeetCode problems).',
    careerGoal: 'Backend Software Developer',
    targetCareerId: 'cg_backend',
    profileCompletion: 92,
    careerReadinessScore: 89,
    resumeFileName: 'Kavin_Raj_Java_Backend.pdf',
    resumeScore: 91,
    skills: [
      { id: 's02_1', name: 'Java', confidence: 0.94, verified: true, lastDemonstrated: '2026-02-22', evidenceCount: 5 },
      { id: 's02_2', name: 'DSA', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 },
      { id: 's02_3', name: 'SQL', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 3 },
      { id: 's02_4', name: 'Spring Boot', confidence: 0.86, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 3 }
    ],
    projects: [
      {
        id: 'p02_1',
        title: 'Enterprise Banking Microservices Core',
        description: 'Architected a distributed ledger and transaction processing service in Java 21, Spring Boot, and PostgreSQL with ACID compliance.',
        technologies: ['Java', 'Spring Boot', 'SQL', 'PostgreSQL'],
        githubUrl: 'https://github.com/kavin-java-demo/banking-microservices'
      },
      {
        id: 'p02_2',
        title: 'AgriSupply Chain Order Tracker',
        description: 'Built high-throughput REST API endpoints for agricultural supply chain logistics with Redis caching.',
        technologies: ['Java', 'SQL', 'REST API'],
        githubUrl: 'https://github.com/kavin-java-demo/agri-supply-chain'
      }
    ],
    experience: [
      {
        id: 'e02_1',
        company: 'DataForge Analytics (Demo)',
        role: 'Java Backend Intern',
        startDate: '2025-05-15',
        endDate: '2025-07-31',
        description: 'Developed backend ingestion services handling 50k transaction events per minute.'
      }
    ],
    hackathons: [
      {
        id: 'h02_1',
        name: 'Kovai Smart City Hackathon 2025',
        project: 'Automated Municipal Parking Grid',
        rank: 'Backend Lead — 2nd Place',
        technologies: ['Java', 'Spring Boot', 'SQL'],
        date: '2025-10-14'
      }
    ],
    certifications: [
      { id: 'c02_1', name: 'Oracle Certified Associate Java Programmer', issuer: 'Oracle', date: '2025-08-10' }
    ],
    externalProfiles: {
      githubUsername: 'kavin-java-demo',
      leetcodeUsername: 'kavin_dsa_demo',
      githubData: {
        publicRepos: 22,
        topLanguages: [{ language: 'Java', count: 18, percentage: 82 }, { language: 'SQL', count: 4, percentage: 18 }],
        totalStars: 42,
        contributionLevel: 'High Impact'
      },
      leetcodeData: {
        totalSolved: 320,
        easySolved: 110,
        mediumSolved: 175,
        hardSolved: 35,
        ranking: 24100,
        contestRating: 1845
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Student 03: Priya Dharshini (React + JavaScript + Node.js + MongoDB)
  {
    id: 'std_03',
    userId: 'usr_student_03',
    name: 'Priya Dharshini',
    email: 'demo.student03@nextmind.demo',
    phone: '+91 98403 45678',
    location: 'Tiruchirappalli, Tamil Nadu',
    college: 'Tamil Nadu Institute of Technology — Demo Profile',
    degree: 'B.Tech Information Technology',
    graduationYear: 2026,
    cgpa: 8.9,
    bio: 'Full Stack MERN engineer specializing in accessible frontend architectures with React, scalable Node.js microservices, and MongoDB document schemas.',
    careerGoal: 'Full Stack Web Developer',
    targetCareerId: 'cg_fullstack',
    profileCompletion: 94,
    careerReadinessScore: 91,
    resumeFileName: 'Priya_Dharshini_FullStack.pdf',
    resumeScore: 93,
    skills: [
      { id: 's03_1', name: 'React', confidence: 0.94, verified: true, lastDemonstrated: '2026-02-24', evidenceCount: 5 },
      { id: 's03_2', name: 'JavaScript', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 },
      { id: 's03_3', name: 'Node.js', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 },
      { id: 's03_4', name: 'MongoDB', confidence: 0.86, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 3 },
      { id: 's03_5', name: 'REST API', confidence: 0.87, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 3 }
    ],
    projects: [
      {
        id: 'p03_1',
        title: 'Campus Recruitment & Interview Portal',
        description: 'Built a full-stack portal with React 19, Node.js, and MongoDB featuring real-time interview room scheduling.',
        technologies: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
        githubUrl: 'https://github.com/priya-fullstack-demo/recruitment-portal'
      },
      {
        id: 'p03_2',
        title: 'Collaborative Kanban Sprint Board',
        description: 'Real-time drag-and-drop task board with responsive design, optimistic UI updates, and MongoDB persistence.',
        technologies: ['React', 'Node.js', 'REST API'],
        githubUrl: 'https://github.com/priya-fullstack-demo/kanban-board'
      }
    ],
    experience: [
      {
        id: 'e03_1',
        company: 'AppNova Digital (Demo)',
        role: 'Full Stack Intern',
        startDate: '2025-06-01',
        endDate: '2025-08-15',
        description: 'Contributed to client web applications using React component libraries and REST APIs.'
      }
    ],
    hackathons: [
      {
        id: 'h03_1',
        name: 'HackTrichy 2025',
        project: 'Citizen Grievance Resolution Hub',
        rank: '1st Runner Up — Full Stack Lead',
        technologies: ['React', 'Node.js', 'MongoDB'],
        date: '2025-09-22'
      }
    ],
    certifications: [
      { id: 'c03_1', name: 'Meta Front-End Developer Certificate', issuer: 'Meta', date: '2025-07-20' }
    ],
    externalProfiles: {
      githubUsername: 'priya-fullstack-demo',
      leetcodeUsername: 'priya_web_demo',
      githubData: {
        publicRepos: 25,
        topLanguages: [{ language: 'JavaScript', count: 16, percentage: 64 }, { language: 'TypeScript', count: 7, percentage: 28 }],
        totalStars: 48,
        contributionLevel: 'High Impact'
      },
      leetcodeData: {
        totalSolved: 140,
        easySolved: 85,
        mediumSolved: 50,
        hardSolved: 5,
        ranking: 85000,
        contestRating: 1520
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Student 04: Vignesh Sundaram (Python + Data Science + SQL + Power BI)
  {
    id: 'std_04',
    userId: 'usr_student_04',
    name: 'Vignesh Sundaram',
    email: 'demo.student04@nextmind.demo',
    phone: '+91 98404 56789',
    location: 'Madurai, Tamil Nadu',
    college: 'Madurai Institute of Engineering & Technology — Demo Profile',
    degree: 'B.Tech Data Science',
    graduationYear: 2026,
    cgpa: 8.1,
    bio: 'Data Analyst passionate about finding stories in numbers. Expert in SQL querying, Python analytics, Pandas data wrangling, and Power BI executive dashboards.',
    careerGoal: 'Data Analyst & BI Specialist',
    targetCareerId: 'cg_data_analyst',
    profileCompletion: 90,
    careerReadinessScore: 87,
    resumeFileName: 'Vignesh_Sundaram_Data_Analyst.pdf',
    resumeScore: 88,
    skills: [
      { id: 's04_1', name: 'Python', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 4 },
      { id: 's04_2', name: 'Data Science', confidence: 0.86, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 },
      { id: 's04_3', name: 'SQL', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-22', evidenceCount: 4 },
      { id: 's04_4', name: 'Power BI', confidence: 0.89, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 3 },
      { id: 's04_5', name: 'Pandas', confidence: 0.85, verified: true, lastDemonstrated: '2026-02-08', evidenceCount: 3 }
    ],
    projects: [
      {
        id: 'p04_1',
        title: 'Healthcare Patient Analytics & KPI Dashboard',
        description: 'Processed 50,000 anonymized hospital records using SQL & Python, generating interactive Power BI visual dashboards for bed occupancy.',
        technologies: ['Python', 'SQL', 'Power BI', 'Pandas'],
        githubUrl: 'https://github.com/vignesh-data-demo/healthcare-analytics'
      },
      {
        id: 'p04_2',
        title: 'Retail Demand Forecasting & Inventory Optimization',
        description: 'Analyzed weekly supermarket sales with Pandas and SQL window functions to model seasonal inventory reorders.',
        technologies: ['Python', 'Data Science', 'SQL'],
        githubUrl: 'https://github.com/vignesh-data-demo/retail-demand-forecasting'
      }
    ],
    experience: [
      {
        id: 'e04_1',
        company: 'DataForge Analytics (Demo)',
        role: 'Data Analytics Intern',
        startDate: '2025-06-15',
        endDate: '2025-08-15',
        description: 'Wrote automated SQL extraction scripts and designed client reporting dashboards in Power BI.'
      }
    ],
    hackathons: [
      {
        id: 'h04_1',
        name: 'Madurai DataThon 2025',
        project: 'Public Transit Passenger Flow Visualizer',
        rank: 'Best Data Visualization Award',
        technologies: ['Python', 'Power BI', 'SQL'],
        date: '2025-11-05'
      }
    ],
    certifications: [
      { id: 'c04_1', name: 'Google Data Analytics Professional', issuer: 'Google / Coursera', date: '2025-08-30' }
    ],
    externalProfiles: {
      githubUsername: 'vignesh-data-demo',
      leetcodeUsername: 'vignesh_sql_demo',
      githubData: {
        publicRepos: 15,
        topLanguages: [{ language: 'Python', count: 9, percentage: 60 }, { language: 'SQL', count: 6, percentage: 40 }],
        totalStars: 28,
        contributionLevel: 'Active'
      },
      leetcodeData: {
        totalSolved: 90,
        easySolved: 50,
        mediumSolved: 38,
        hardSolved: 2,
        ranking: 120000
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Student 05: Dharshan Pandian (Cybersecurity + Networking + Linux + Python)
  {
    id: 'std_05',
    userId: 'usr_student_05',
    name: 'Dharshan Pandian',
    email: 'demo.student05@nextmind.demo',
    phone: '+91 98405 67890',
    location: 'Tirunelveli, Tamil Nadu',
    college: 'South Tamil Nadu Engineering College — Demo Profile',
    degree: 'B.E. Computer Science (Cybersecurity Specialization)',
    graduationYear: 2026,
    cgpa: 7.9,
    bio: 'Security researcher focused on offensive and defensive security operations, Linux kernel hardening, TCP/IP network packet analysis, and OWASP mitigation.',
    careerGoal: 'Cybersecurity Analyst',
    targetCareerId: 'cg_cybersecurity',
    profileCompletion: 88,
    careerReadinessScore: 84,
    resumeFileName: 'Dharshan_Pandian_Cybersecurity.pdf',
    resumeScore: 86,
    skills: [
      { id: 's05_1', name: 'Cybersecurity', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-21', evidenceCount: 4 },
      { id: 's05_2', name: 'Networking', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 3 },
      { id: 's05_3', name: 'Linux', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-23', evidenceCount: 4 },
      { id: 's05_4', name: 'Python', confidence: 0.82, verified: true, lastDemonstrated: '2026-02-10', evidenceCount: 3 },
      { id: 's05_5', name: 'OWASP', confidence: 0.84, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 2 }
    ],
    projects: [
      {
        id: 'p05_1',
        title: 'Automated Network Vulnerability & Port Scanner',
        description: 'Multi-threaded Python network scanner with banner grabbing, CVE cross-referencing, and HTML audit report generator.',
        technologies: ['Python', 'Networking', 'Linux'],
        githubUrl: 'https://github.com/dharshan-sec-demo/network-vulnerability-scanner'
      },
      {
        id: 'p05_2',
        title: 'SSH Honeypot Intrusion Detection System',
        description: 'Deployed a decoy Linux server capturing attacker keystrokes, IP origins, and brute-force wordlists.',
        technologies: ['Linux', 'Cybersecurity', 'Python'],
        githubUrl: 'https://github.com/dharshan-sec-demo/ssh-honeypot'
      }
    ],
    experience: [
      {
        id: 'e05_1',
        company: 'SecureStack Labs (Demo)',
        role: 'Security Intern',
        startDate: '2025-06-01',
        endDate: '2025-07-31',
        description: 'Assisted in triage of firewall events and conducted OWASP Top 10 vulnerability checks on staging web apps.'
      }
    ],
    hackathons: [
      {
        id: 'h05_1',
        name: 'CyberDefense Challenge 2025',
        project: 'Blue Team Network Defense',
        rank: 'Top 5 Finalist',
        technologies: ['Linux', 'Networking', 'Cybersecurity'],
        date: '2025-10-28'
      }
    ],
    certifications: [
      { id: 'c05_1', name: 'CompTIA Security+ (Demo Verified)', issuer: 'CompTIA', date: '2025-09-12' }
    ],
    externalProfiles: {
      githubUsername: 'dharshan-sec-demo',
      leetcodeUsername: 'dharshan_net_demo',
      githubData: {
        publicRepos: 12,
        topLanguages: [{ language: 'Python', count: 8, percentage: 66 }, { language: 'Shell', count: 4, percentage: 34 }],
        totalStars: 31,
        contributionLevel: 'Active'
      },
      leetcodeData: {
        totalSolved: 65,
        easySolved: 45,
        mediumSolved: 20,
        hardSolved: 0,
        ranking: 160000
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Student 06: Sneha Ramachandran (Java + Android + Firebase + Kotlin)
  {
    id: 'std_06',
    userId: 'usr_student_06',
    name: 'Sneha Ramachandran',
    email: 'demo.student06@nextmind.demo',
    phone: '+91 98406 78901',
    location: 'Salem, Tamil Nadu',
    college: 'Salem College of Engineering & Technology — Demo Profile',
    degree: 'B.Tech Information Technology',
    graduationYear: 2026,
    cgpa: 8.6,
    bio: 'Mobile software developer dedicated to crafting responsive Android applications in Java and Kotlin, backed by Firebase real-time databases and REST APIs.',
    careerGoal: 'Mobile Application Developer',
    targetCareerId: 'cg_mobile',
    profileCompletion: 91,
    careerReadinessScore: 88,
    resumeFileName: 'Sneha_Ramachandran_Android.pdf',
    resumeScore: 90,
    skills: [
      { id: 's06_1', name: 'Java', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 },
      { id: 's06_2', name: 'Android', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-23', evidenceCount: 4 },
      { id: 's06_3', name: 'Firebase', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 },
      { id: 's06_4', name: 'REST API', confidence: 0.84, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 3 }
    ],
    projects: [
      {
        id: 'p06_1',
        title: 'MediConnect Patient Telehealth App',
        description: 'Native Android application linking rural clinics with specialist doctors using Firebase Authentication, Firestore, and video API.',
        technologies: ['Android', 'Java', 'Firebase'],
        githubUrl: 'https://github.com/sneha-android-demo/mediconnect-app'
      },
      {
        id: 'p06_2',
        title: 'Tamil Nadu Regional Bus Transit Tracker',
        description: 'Real-time GPS bus location tracking app using Google Maps API and Firestore live listeners.',
        technologies: ['Android', 'Java', 'REST API'],
        githubUrl: 'https://github.com/sneha-android-demo/transit-bus-tracker'
      }
    ],
    experience: [
      {
        id: 'e06_1',
        company: 'AppNova Digital (Demo)',
        role: 'Mobile Developer Intern',
        startDate: '2025-05-15',
        endDate: '2025-07-15',
        description: 'Built customer-facing UI screens and integrated push notification handlers in Android.'
      }
    ],
    hackathons: [
      {
        id: 'h06_1',
        name: 'Salem AppCon 2025',
        project: 'Farmer Direct Produce Marketplace App',
        rank: 'Winner — Best Mobile UX',
        technologies: ['Android', 'Java', 'Firebase'],
        date: '2025-10-18'
      }
    ],
    certifications: [
      { id: 'c06_1', name: 'Associate Android Developer (Demo Preparation)', issuer: 'Google Developers', date: '2025-09-01' }
    ],
    externalProfiles: {
      githubUsername: 'sneha-android-demo',
      leetcodeUsername: 'sneha_mobile_demo',
      githubData: {
        publicRepos: 16,
        topLanguages: [{ language: 'Java', count: 12, percentage: 75 }, { language: 'Kotlin', count: 4, percentage: 25 }],
        totalStars: 39,
        contributionLevel: 'Active'
      },
      leetcodeData: {
        totalSolved: 120,
        easySolved: 75,
        mediumSolved: 42,
        hardSolved: 3,
        ranking: 98000
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Student 07: Hari Prasad (C++ + DSA + Competitive Programming + Low-level Systems)
  {
    id: 'std_07',
    userId: 'usr_student_07',
    name: 'Hari Prasad',
    email: 'demo.student07@nextmind.demo',
    phone: '+91 98407 89012',
    location: 'Coimbatore, Tamil Nadu',
    college: 'Government College of Technology — Demo Profile',
    degree: 'B.E. Computer Science',
    graduationYear: 2026,
    cgpa: 9.2,
    bio: 'Competitive programmer (540+ LeetCode problems, rating 2150) and low-level systems enthusiast with strong mastery of C++, multithreading, and cache memory models.',
    careerGoal: 'Systems & Core Software Engineer',
    targetCareerId: 'cg_systems',
    profileCompletion: 96,
    careerReadinessScore: 95,
    resumeFileName: 'Hari_Prasad_Systems_Cpp.pdf',
    resumeScore: 96,
    skills: [
      { id: 's07_1', name: 'C++', confidence: 0.96, verified: true, lastDemonstrated: '2026-02-25', evidenceCount: 5 },
      { id: 's07_2', name: 'DSA', confidence: 0.98, verified: true, lastDemonstrated: '2026-02-25', evidenceCount: 5 },
      { id: 's07_3', name: 'Linux', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 3 },
      { id: 's07_4', name: 'SQL', confidence: 0.84, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 3 },
      { id: 's07_5', name: 'Git', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 }
    ],
    projects: [
      {
        id: 'p07_1',
        title: 'High Performance Thread-Safe In-Memory Cache Engine',
        description: 'Implemented LRU/LFU cache policies in modern C++20 with atomic locks, zero heap fragmentation, and 1.8 million ops/sec benchmark.',
        technologies: ['C++', 'DSA', 'Linux'],
        githubUrl: 'https://github.com/hariprasad-cpp-demo/fast-cache-engine'
      },
      {
        id: 'p07_2',
        title: 'User-Space Memory Allocator & Garbage Tracker',
        description: 'Designed custom buddy memory allocation engine overriding malloc/free with buffer overflow boundary protection.',
        technologies: ['C++', 'Linux'],
        githubUrl: 'https://github.com/hariprasad-cpp-demo/custom-allocator'
      }
    ],
    experience: [
      {
        id: 'e07_1',
        company: 'Nexora Technologies (Demo)',
        role: 'Systems Engineering Intern',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        description: 'Benchmarked memory bottlenecks in telemetry processing engine and reduced latency by 28%.'
      }
    ],
    hackathons: [
      {
        id: 'h07_1',
        name: 'CodeSprint Tamil Nadu 2025',
        project: 'Distributed Lock Free Queue',
        rank: 'Rank 3 (Statewide)',
        technologies: ['C++', 'DSA'],
        date: '2025-11-15'
      }
    ],
    certifications: [
      { id: 'c07_1', name: 'Advanced C++ Concurrency & Architecture', issuer: 'Udemy / Professional', date: '2025-08-20' }
    ],
    externalProfiles: {
      githubUsername: 'hariprasad-cpp-demo',
      leetcodeUsername: 'hari_cp_demo',
      githubData: {
        publicRepos: 20,
        topLanguages: [{ language: 'C++', count: 18, percentage: 90 }, { language: 'C', count: 2, percentage: 10 }],
        totalStars: 68,
        contributionLevel: 'High Impact'
      },
      leetcodeData: {
        totalSolved: 540,
        easySolved: 160,
        mediumSolved: 280,
        hardSolved: 100,
        ranking: 4200,
        contestRating: 2150
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Student 08: Ananya Subramanian (Machine Learning + NLP + Python + Transformers)
  {
    id: 'std_08',
    userId: 'usr_student_08',
    name: 'Ananya Subramanian',
    email: 'demo.student08@nextmind.demo',
    phone: '+91 98408 90123',
    location: 'Vellore, Tamil Nadu',
    college: 'Vellore Technical Institute — Demo Profile',
    degree: 'B.Tech AI & Data Science',
    graduationYear: 2026,
    cgpa: 8.7,
    bio: 'AI researcher and NLP practitioner passionate about transformer architectures, multilingual sentiment analysis (Tamil-English code-switching), and PyTorch models.',
    careerGoal: 'AI / Machine Learning Engineer',
    targetCareerId: 'cg_ai_eng',
    profileCompletion: 93,
    careerReadinessScore: 90,
    resumeFileName: 'Ananya_Subramanian_NLP_AI.pdf',
    resumeScore: 92,
    skills: [
      { id: 's08_1', name: 'Python', confidence: 0.94, verified: true, lastDemonstrated: '2026-02-23', evidenceCount: 5 },
      { id: 's08_2', name: 'Machine Learning', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 },
      { id: 's08_3', name: 'NLP', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-22', evidenceCount: 4 },
      { id: 's08_4', name: 'Pandas', confidence: 0.86, verified: true, lastDemonstrated: '2026-02-12', evidenceCount: 3 },
      { id: 's08_5', name: 'Deep Learning', confidence: 0.85, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 }
    ],
    projects: [
      {
        id: 'p08_1',
        title: 'Multilingual Sentiment Analyzer for Tamil & English Code-Mixing',
        description: 'Fine-tuned IndicBERT transformer model on 25,000 social media comments achieving 89.2% F1-score.',
        technologies: ['Python', 'NLP', 'Machine Learning'],
        githubUrl: 'https://github.com/ananya-nlp-demo/indic-sentiment'
      },
      {
        id: 'p08_2',
        title: 'Clinical Case Summarizer with Open Source LLM',
        description: 'Built an abstractive medical clinical notes summarizer with hallucination reduction guardrails.',
        technologies: ['Python', 'Machine Learning', 'NLP'],
        githubUrl: 'https://github.com/ananya-nlp-demo/clinical-summarizer'
      }
    ],
    experience: [
      {
        id: 'e08_1',
        company: 'DataForge Analytics (Demo)',
        role: 'NLP Research Intern',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        description: 'Implemented automated document classification pipelines reducing manual review time by 60%.'
      }
    ],
    hackathons: [
      {
        id: 'h08_1',
        name: 'AI for Indic Languages 2025',
        project: 'Tamil Voice Translation Pipeline',
        rank: 'Special Recognition Award',
        technologies: ['Python', 'NLP', 'Machine Learning'],
        date: '2025-10-05'
      }
    ],
    certifications: [
      { id: 'c08_1', name: 'Natural Language Processing Specialization', issuer: 'DeepLearning.AI', date: '2025-09-18' }
    ],
    externalProfiles: {
      githubUsername: 'ananya-nlp-demo',
      leetcodeUsername: 'ananya_ai_demo',
      githubData: {
        publicRepos: 17,
        topLanguages: [{ language: 'Python', count: 15, percentage: 88 }, { language: 'Jupyter', count: 2, percentage: 12 }],
        totalStars: 44,
        contributionLevel: 'High Impact'
      },
      leetcodeData: {
        totalSolved: 150,
        easySolved: 80,
        mediumSolved: 62,
        hardSolved: 8,
        ranking: 72000
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Student 09: Pranav Ravichandran (Cloud + DevOps + Linux + Docker + Kubernetes + CI/CD)
  {
    id: 'std_09',
    userId: 'usr_student_09',
    name: 'Pranav Ravichandran',
    email: 'demo.student09@nextmind.demo',
    phone: '+91 98409 01234',
    location: 'Erode, Tamil Nadu',
    college: 'Erode Sengunthar Engineering College — Demo Profile',
    degree: 'B.E. Computer Science',
    graduationYear: 2026,
    cgpa: 8.0,
    bio: 'DevOps engineer focused on infrastructure-as-code, Docker containerization, Kubernetes cluster management, Linux kernel tuning, and automated CI/CD deployment pipelines.',
    careerGoal: 'Cloud & DevOps Engineer',
    targetCareerId: 'cg_cloud_devops',
    profileCompletion: 89,
    careerReadinessScore: 86,
    resumeFileName: 'Pranav_Ravichandran_DevOps.pdf',
    resumeScore: 88,
    skills: [
      { id: 's09_1', name: 'Linux', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-24', evidenceCount: 4 },
      { id: 's09_2', name: 'Docker', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-21', evidenceCount: 4 },
      { id: 's09_3', name: 'AWS', confidence: 0.84, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 3 },
      { id: 's09_4', name: 'Kubernetes', confidence: 0.82, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 3 },
      { id: 's09_5', name: 'CI/CD', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 3 }
    ],
    projects: [
      {
        id: 'p09_1',
        title: 'Automated Microservices GitOps Pipeline',
        description: 'Built continuous delivery workflow with GitHub Actions, Docker multi-stage builds, and automated blue-green Kubernetes deployments.',
        technologies: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        githubUrl: 'https://github.com/pranav-devops-demo/gitops-pipeline'
      },
      {
        id: 'p09_2',
        title: 'Multi-Tier Cloud Infrastructure Automation',
        description: 'Automated VPC, EC2 autoscaling, and RDS provisioning on AWS with Terraform and Bash scripts.',
        technologies: ['AWS', 'Linux', 'Docker'],
        githubUrl: 'https://github.com/pranav-devops-demo/aws-infra-automation'
      }
    ],
    experience: [
      {
        id: 'e09_1',
        company: 'CloudAxis Systems (Demo)',
        role: 'Cloud Operations Intern',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        description: 'Maintained staging Docker environments and configured Prometheus/Grafana monitoring alerts.'
      }
    ],
    hackathons: [
      {
        id: 'h09_1',
        name: 'DevOps Days Chennai 2025',
        project: 'Self-Healing Kubernetes Node Operator',
        rank: 'Student Track Winner',
        technologies: ['Kubernetes', 'Docker', 'Linux'],
        date: '2025-11-25'
      }
    ],
    certifications: [
      { id: 'c09_1', name: 'AWS Certified Solutions Architect Associate (Demo)', issuer: 'Amazon Web Services', date: '2025-08-14' }
    ],
    externalProfiles: {
      githubUsername: 'pranav-devops-demo',
      leetcodeUsername: 'pranav_cloud_demo',
      githubData: {
        publicRepos: 19,
        topLanguages: [{ language: 'Shell', count: 9, percentage: 48 }, { language: 'Dockerfile', count: 6, percentage: 32 }, { language: 'HCL', count: 4, percentage: 20 }],
        totalStars: 35,
        contributionLevel: 'Active'
      },
      leetcodeData: {
        totalSolved: 75,
        easySolved: 50,
        mediumSolved: 23,
        hardSolved: 2,
        ranking: 155000
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Student 10: Rahul Manikandan (Full Stack Development + React + Node.js + PostgreSQL + Tailwind CSS)
  {
    id: 'std_10',
    userId: 'usr_student_10',
    name: 'Rahul Manikandan',
    email: 'demo.student10@nextmind.demo',
    phone: '+91 98410 12345',
    location: 'Thanjavur, Tamil Nadu',
    college: 'Thanjavur Institute of Technology — Demo Profile',
    degree: 'B.Tech Computer Science',
    graduationYear: 2026,
    cgpa: 8.3,
    bio: 'Full Stack engineer skilled in TypeScript, React, Tailwind CSS, Node.js, and relational database schemas with PostgreSQL. Passionate about clean code and modern developer tooling.',
    careerGoal: 'Full Stack Web Developer',
    targetCareerId: 'cg_fullstack',
    profileCompletion: 92,
    careerReadinessScore: 89,
    resumeFileName: 'Rahul_Manikandan_FullStack.pdf',
    resumeScore: 91,
    skills: [
      { id: 's10_1', name: 'React', confidence: 0.92, verified: true, lastDemonstrated: '2026-02-23', evidenceCount: 5 },
      { id: 's10_2', name: 'Node.js', confidence: 0.89, verified: true, lastDemonstrated: '2026-02-20', evidenceCount: 4 },
      { id: 's10_3', name: 'SQL', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-18', evidenceCount: 3 },
      { id: 's10_4', name: 'JavaScript', confidence: 0.90, verified: true, lastDemonstrated: '2026-02-15', evidenceCount: 4 },
      { id: 's10_5', name: 'REST API', confidence: 0.88, verified: true, lastDemonstrated: '2026-02-14', evidenceCount: 3 }
    ],
    projects: [
      {
        id: 'p10_1',
        title: 'Multi-Tenant SaaS Invoicing & Billing Engine',
        description: 'Complete billing software with React frontend, Node.js backend, and PostgreSQL relational database with Stripe webhook reconciliation.',
        technologies: ['React', 'Node.js', 'SQL', 'REST API'],
        githubUrl: 'https://github.com/rahul-fs-demo/saas-invoicing'
      },
      {
        id: 'p10_2',
        title: 'Real-Time Collaborative Classroom Whiteboard',
        description: 'Interactive canvas whiteboard using React, HTML5 Canvas, WebSockets, and Node.js.',
        technologies: ['React', 'JavaScript', 'Node.js'],
        githubUrl: 'https://github.com/rahul-fs-demo/classroom-whiteboard'
      }
    ],
    experience: [
      {
        id: 'e10_1',
        company: 'AppNova Digital (Demo)',
        role: 'Full Stack Intern',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        description: 'Developed responsive dashboard modules and wrote PostgreSQL migration scripts.'
      }
    ],
    hackathons: [
      {
        id: 'h10_1',
        name: 'DeltaHacks South 2025',
        project: 'Campus Carbon Footprint Tracker',
        rank: 'Top 10 Finalist',
        technologies: ['React', 'Node.js', 'SQL'],
        date: '2025-10-12'
      }
    ],
    certifications: [
      { id: 'c10_1', name: 'Full Stack Web Development with PostgreSQL', issuer: 'Coursera / Vanderbilt', date: '2025-07-28' }
    ],
    externalProfiles: {
      githubUsername: 'rahul-fs-demo',
      leetcodeUsername: 'rahul_fs_demo',
      githubData: {
        publicRepos: 21,
        topLanguages: [{ language: 'TypeScript', count: 11, percentage: 52 }, { language: 'JavaScript', count: 7, percentage: 33 }, { language: 'SQL', count: 3, percentage: 15 }],
        totalStars: 38,
        contributionLevel: 'Active'
      },
      leetcodeData: {
        totalSolved: 175,
        easySolved: 95,
        mediumSolved: 70,
        hardSolved: 10,
        ranking: 65000
      }
    },
    isDemo: true,
    demoSeedVersion: 'v2'
  }
];

// 3. 5 Synthetic Companies
export const DEMO_COMPANIES: (Company & { isDemo?: boolean; demoSeedVersion?: string })[] = [
  // Company 01: Nexora Technologies — Demo (Chennai)
  {
    id: 'cmp_01',
    userId: 'usr_company_01',
    name: 'Nexora Technologies — Demo',
    email: 'demo.company01@nextmind.demo',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    website: 'https://nexora.example.com',
    location: 'Tidel Park, Taramani, Chennai, Tamil Nadu',
    industry: 'Software Development & Systems',
    description: 'Tier-1 enterprise engineering partner specializing in high-throughput backend microservices, core systems engineering, Python automation, and digital transformation.',
    employeeCount: '250-500',
    verified: true,
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  // Company 02: DataForge Analytics — Demo (Coimbatore)
  {
    id: 'cmp_02',
    userId: 'usr_company_02',
    name: 'DataForge Analytics — Demo',
    email: 'demo.company02@nextmind.demo',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80',
    website: 'https://dataforge.example.com',
    location: 'CHIL SEZ, Saravanampatti, Coimbatore, Tamil Nadu',
    industry: 'Data Science & AI',
    description: 'Premier data engineering and applied AI consultancy delivering predictive algorithms, automated machine learning pipelines, and executive intelligence dashboards.',
    employeeCount: '150-300',
    verified: true,
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  // Company 03: CloudAxis Systems — Demo (Hosur)
  {
    id: 'cmp_03',
    userId: 'usr_company_03',
    name: 'CloudAxis Systems — Demo',
    email: 'demo.company03@nextmind.demo',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop&q=80',
    website: 'https://cloudaxis.example.com',
    location: 'SIPCOT Industrial Area, Hosur, Tamil Nadu',
    industry: 'Cloud Infrastructure & DevOps',
    description: 'Specialist cloud architecture firm providing container orchestration, automated CI/CD pipelines, site reliability engineering, and secure AWS/GCP deployments.',
    employeeCount: '100-250',
    verified: true,
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  // Company 04: SecureStack Labs — Demo (Chennai)
  {
    id: 'cmp_04',
    userId: 'usr_company_04',
    name: 'SecureStack Labs — Demo',
    email: 'demo.company04@nextmind.demo',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80',
    website: 'https://securestack.example.com',
    location: 'DLF Cybercity, Manapakkam, Chennai, Tamil Nadu',
    industry: 'Cybersecurity & Defense Operations',
    description: 'Cybersecurity intelligence firm providing 24/7 SOC monitoring, penetration testing, Zero Trust network audits, and application vulnerability remediation.',
    employeeCount: '80-180',
    verified: true,
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  // Company 05: AppNova Digital — Demo (Madurai)
  {
    id: 'cmp_05',
    userId: 'usr_company_05',
    name: 'AppNova Digital — Demo',
    email: 'demo.company05@nextmind.demo',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    website: 'https://appnova.example.com',
    location: 'ELCOT IT Park, Vadapalanji, Madurai, Tamil Nadu',
    industry: 'Web & Mobile Development',
    description: 'Modern product studio building full-stack web platforms and native mobile apps using React, Node.js, Android, and cloud databases.',
    employeeCount: '120-220',
    verified: true,
    isDemo: true,
    demoSeedVersion: 'v2'
  }
];

// 4. 17 Opportunities (Jobs and Internships across 5 Companies)
export const DEMO_JOBS: (Job & { isDemo?: boolean; demoSeedVersion?: string })[] = [
  // Company 01: Nexora Technologies (4 opportunities)
  {
    id: 'job_01',
    companyId: 'cmp_01',
    companyName: 'Nexora Technologies — Demo',
    title: 'Software Engineer (Python & Data Systems)',
    department: 'Software Engineering',
    location: 'Chennai, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹10,00,000 - ₹14,00,000 / yr',
    salaryRange: '₹10,00,000 - ₹14,00,000 / yr',
    description: 'Develop high-scale backend services in Python, write optimized SQL queries, and design robust REST APIs with automated testing.',
    requiredSkills: ['Python', 'DSA', 'SQL', 'REST API'],
    preferredSkills: ['FastAPI', 'Docker', 'Git'],
    assessmentRequired: true,
    assessmentSkills: ['Python', 'DSA'],
    minimumAssessmentScore: 60,
    allowRetake: true,
    maxAttempts: 3,
    status: 'published',
    applicantCount: 5,
    createdAt: '2026-01-10T10:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_02',
    companyId: 'cmp_01',
    companyName: 'Nexora Technologies — Demo',
    title: 'Systems Software Engineer (C++)',
    department: 'Core Systems',
    location: 'Chennai, Tamil Nadu (On-site)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹14,00,000 - ₹18,00,000 / yr',
    salaryRange: '₹14,00,000 - ₹18,00,000 / yr',
    description: 'Architect low-latency concurrency engines, custom memory allocators, and multithreaded network queues in modern C++.',
    requiredSkills: ['C++', 'DSA', 'Linux'],
    preferredSkills: ['SQL', 'Git'],
    assessmentRequired: true,
    assessmentSkills: ['C++', 'DSA'],
    minimumAssessmentScore: 70,
    allowRetake: true,
    maxAttempts: 2,
    status: 'published',
    applicantCount: 3,
    createdAt: '2026-01-12T11:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_03',
    companyId: 'cmp_01',
    companyName: 'Nexora Technologies — Demo',
    title: 'Python Development Intern',
    department: 'Software Engineering',
    location: 'Chennai, Tamil Nadu (Hybrid)',
    type: 'Internship',
    opportunityType: 'internship',
    internshipType: 'Summer',
    duration: '6 months',
    stipend: '₹28,000 / month',
    conversionPossibility: true,
    experienceLevel: 'Entry Level',
    description: 'Work directly with senior backend engineers to build automated Python data scraping and API ingestion services.',
    requiredSkills: ['Python', 'REST API', 'SQL'],
    preferredSkills: ['Git', 'Pandas'],
    assessmentRequired: true,
    assessmentSkills: ['Python'],
    minimumAssessmentScore: 60,
    status: 'published',
    applicantCount: 7,
    createdAt: '2026-01-15T09:30:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_04',
    companyId: 'cmp_01',
    companyName: 'Nexora Technologies — Demo',
    title: 'Java Backend Developer',
    department: 'Enterprise Platforms',
    location: 'Chennai, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹11,00,000 - ₹15,00,000 / yr',
    salaryRange: '₹11,00,000 - ₹15,00,000 / yr',
    description: 'Build enterprise microservices using Java 21, Spring Boot, and PostgreSQL with high throughput and data integrity.',
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'REST API'],
    preferredSkills: ['Docker', 'DSA'],
    assessmentRequired: true,
    assessmentSkills: ['Java', 'SQL'],
    minimumAssessmentScore: 65,
    status: 'published',
    applicantCount: 4,
    createdAt: '2026-01-18T14:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Company 02: DataForge Analytics (4 opportunities)
  {
    id: 'job_05',
    companyId: 'cmp_02',
    companyName: 'DataForge Analytics — Demo',
    title: 'Machine Learning Engineer',
    department: 'Applied AI',
    location: 'Coimbatore, Tamil Nadu (On-site)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹13,00,000 - ₹17,00,000 / yr',
    salaryRange: '₹13,00,000 - ₹17,00,000 / yr',
    description: 'Train, evaluate, and containerize machine learning models in Python using Pandas, NumPy, and Scikit-learn for enterprise forecasting.',
    requiredSkills: ['Python', 'Machine Learning', 'NumPy', 'Pandas', 'Scikit-learn'],
    preferredSkills: ['Deep Learning', 'SQL'],
    assessmentRequired: true,
    assessmentSkills: ['Python', 'Machine Learning'],
    minimumAssessmentScore: 65,
    status: 'published',
    applicantCount: 6,
    createdAt: '2026-01-11T10:30:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_06',
    companyId: 'cmp_02',
    companyName: 'DataForge Analytics — Demo',
    title: 'Data Analyst',
    department: 'Analytics & BI',
    location: 'Coimbatore, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹8,50,000 - ₹11,50,000 / yr',
    salaryRange: '₹8,50,000 - ₹11,50,000 / yr',
    description: 'Design executive Power BI KPI dashboards, write complex SQL analytical queries, and present data-backed strategic insights.',
    requiredSkills: ['Python', 'SQL', 'Pandas', 'Power BI', 'Data Science'],
    preferredSkills: ['Excel', 'Statistics'],
    assessmentRequired: true,
    assessmentSkills: ['SQL', 'Data Science'],
    minimumAssessmentScore: 60,
    status: 'published',
    applicantCount: 5,
    createdAt: '2026-01-14T12:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_07',
    companyId: 'cmp_02',
    companyName: 'DataForge Analytics — Demo',
    title: 'Machine Learning Intern',
    department: 'Applied AI',
    location: 'Coimbatore, Tamil Nadu (On-site)',
    type: 'Internship',
    opportunityType: 'internship',
    internshipType: 'Summer',
    duration: '6 months',
    stipend: '₹30,000 / month',
    conversionPossibility: true,
    experienceLevel: 'Entry Level',
    description: 'Collaborate with lead data scientists to benchmark tabular prediction models and build automated ML feature engineering pipelines.',
    requiredSkills: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
    preferredSkills: ['Scikit-learn'],
    assessmentRequired: true,
    assessmentSkills: ['Python', 'Machine Learning'],
    minimumAssessmentScore: 60,
    status: 'published',
    applicantCount: 8,
    createdAt: '2026-01-16T15:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_08',
    companyId: 'cmp_02',
    companyName: 'DataForge Analytics — Demo',
    title: 'NLP Research Associate',
    department: 'AI Research',
    location: 'Coimbatore, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹14,00,000 - ₹18,00,000 / yr',
    salaryRange: '₹14,00,000 - ₹18,00,000 / yr',
    description: 'Fine-tune open-source transformer architectures for multilingual text classification and clinical medical document summarization.',
    requiredSkills: ['Python', 'NLP', 'Machine Learning', 'Deep Learning'],
    preferredSkills: ['PyTorch', 'Pandas'],
    assessmentRequired: true,
    assessmentSkills: ['Python', 'NLP'],
    minimumAssessmentScore: 70,
    status: 'published',
    applicantCount: 3,
    createdAt: '2026-01-20T11:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Company 03: CloudAxis Systems (3 opportunities)
  {
    id: 'job_09',
    companyId: 'cmp_03',
    companyName: 'CloudAxis Systems — Demo',
    title: 'Cloud & DevOps Engineer',
    department: 'Infrastructure',
    location: 'Hosur, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹12,50,000 - ₹16,50,000 / yr',
    salaryRange: '₹12,50,000 - ₹16,50,000 / yr',
    description: 'Automate deployment pipelines using GitHub Actions, manage Docker containers on AWS, and maintain Kubernetes cluster health.',
    requiredSkills: ['Linux', 'Docker', 'AWS', 'CI/CD', 'Kubernetes'],
    preferredSkills: ['Git', 'Python'],
    assessmentRequired: true,
    assessmentSkills: ['Linux', 'Docker'],
    minimumAssessmentScore: 60,
    status: 'published',
    applicantCount: 4,
    createdAt: '2026-01-13T10:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_10',
    companyId: 'cmp_03',
    companyName: 'CloudAxis Systems — Demo',
    title: 'Site Reliability Engineer',
    department: 'Reliability Engineering',
    location: 'Hosur, Tamil Nadu (On-site)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹13,00,000 - ₹17,00,000 / yr',
    salaryRange: '₹13,00,000 - ₹17,00,000 / yr',
    description: 'Ensure 99.99% uptime for cloud infrastructure, instrument distributed tracing, and automate incident response runbooks.',
    requiredSkills: ['Linux', 'Python', 'Docker', 'Networking'],
    preferredSkills: ['AWS', 'Kubernetes'],
    assessmentRequired: true,
    assessmentSkills: ['Linux'],
    minimumAssessmentScore: 65,
    status: 'published',
    applicantCount: 2,
    createdAt: '2026-01-17T14:30:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_11',
    companyId: 'cmp_03',
    companyName: 'CloudAxis Systems — Demo',
    title: 'Cloud Operations Intern',
    department: 'Infrastructure',
    location: 'Hosur, Tamil Nadu (Hybrid)',
    type: 'Internship',
    opportunityType: 'internship',
    internshipType: 'Summer',
    duration: '6 months',
    stipend: '₹25,000 / month',
    conversionPossibility: true,
    experienceLevel: 'Entry Level',
    description: 'Gain hands-on experience in Linux system administration, Dockerizing web services, and managing cloud security groups.',
    requiredSkills: ['Linux', 'Docker', 'Git', 'Cloud Computing'],
    preferredSkills: ['AWS'],
    assessmentRequired: true,
    assessmentSkills: ['Linux'],
    minimumAssessmentScore: 55,
    status: 'published',
    applicantCount: 6,
    createdAt: '2026-01-19T09:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Company 04: SecureStack Labs (3 opportunities)
  {
    id: 'job_12',
    companyId: 'cmp_04',
    companyName: 'SecureStack Labs — Demo',
    title: 'Cybersecurity Analyst',
    department: 'Security Operations',
    location: 'Chennai, Tamil Nadu (On-site)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹10,50,000 - ₹14,50,000 / yr',
    salaryRange: '₹10,50,000 - ₹14,50,000 / yr',
    description: 'Monitor enterprise attack surfaces, hunt threats, audit application vulnerabilities, and lead incident triage.',
    requiredSkills: ['Cybersecurity', 'Networking', 'Linux', 'OWASP', 'Python'],
    preferredSkills: ['Git', 'Bash/Shell'],
    assessmentRequired: true,
    assessmentSkills: ['Cybersecurity', 'Networking'],
    minimumAssessmentScore: 65,
    status: 'published',
    applicantCount: 4,
    createdAt: '2026-01-12T13:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_13',
    companyId: 'cmp_04',
    companyName: 'SecureStack Labs — Demo',
    title: 'SOC Security Intern',
    department: 'Security Operations',
    location: 'Chennai, Tamil Nadu (On-site)',
    type: 'Internship',
    opportunityType: 'internship',
    internshipType: 'Summer',
    duration: '6 months',
    stipend: '₹26,000 / month',
    conversionPossibility: true,
    experienceLevel: 'Entry Level',
    description: 'Learn enterprise SIEM log analysis, network packet captures, and vulnerability scanning with senior analysts.',
    requiredSkills: ['Linux', 'Networking', 'Python', 'Cybersecurity'],
    preferredSkills: ['OWASP'],
    assessmentRequired: true,
    assessmentSkills: ['Cybersecurity'],
    minimumAssessmentScore: 60,
    status: 'published',
    applicantCount: 5,
    createdAt: '2026-01-15T16:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_14',
    companyId: 'cmp_04',
    companyName: 'SecureStack Labs — Demo',
    title: 'Application Security Engineer',
    department: 'AppSec',
    location: 'Chennai, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹12,00,000 - ₹16,00,000 / yr',
    salaryRange: '₹12,00,000 - ₹16,00,000 / yr',
    description: 'Embed security into SDLC pipelines, conduct code audits for OWASP Top 10 vulnerabilities, and test REST API endpoints.',
    requiredSkills: ['Python', 'OWASP', 'REST API', 'Linux', 'Cybersecurity'],
    preferredSkills: ['JavaScript', 'Git'],
    assessmentRequired: true,
    assessmentSkills: ['Cybersecurity', 'Python'],
    minimumAssessmentScore: 70,
    status: 'published',
    applicantCount: 3,
    createdAt: '2026-01-21T10:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },

  // Company 05: AppNova Digital (3 opportunities)
  {
    id: 'job_15',
    companyId: 'cmp_05',
    companyName: 'AppNova Digital — Demo',
    title: 'Full Stack Developer',
    department: 'Web Engineering',
    location: 'Madurai, Tamil Nadu (Hybrid)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹11,00,000 - ₹15,00,000 / yr',
    salaryRange: '₹11,00,000 - ₹15,00,000 / yr',
    description: 'Build modern responsive web applications using React, Node.js, and MongoDB with clean architecture and REST APIs.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST API', 'JavaScript'],
    preferredSkills: ['TypeScript', 'SQL'],
    assessmentRequired: true,
    assessmentSkills: ['React', 'JavaScript'],
    minimumAssessmentScore: 65,
    status: 'published',
    applicantCount: 6,
    createdAt: '2026-01-10T12:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_16',
    companyId: 'cmp_05',
    companyName: 'AppNova Digital — Demo',
    title: 'Android Mobile Developer',
    department: 'Mobile Engineering',
    location: 'Madurai, Tamil Nadu (On-site)',
    type: 'Full-time',
    opportunityType: 'job',
    experienceLevel: 'Entry Level',
    salary: '₹10,00,000 - ₹13,50,000 / yr',
    salaryRange: '₹10,00,000 - ₹13,50,000 / yr',
    description: 'Develop performant Android apps in Java and Kotlin integrating Firebase cloud backends and REST APIs.',
    requiredSkills: ['Java', 'Android', 'Firebase', 'REST API'],
    preferredSkills: ['JavaScript', 'Git'],
    assessmentRequired: true,
    assessmentSkills: ['Java', 'Android'],
    minimumAssessmentScore: 60,
    status: 'published',
    applicantCount: 4,
    createdAt: '2026-01-14T11:30:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  },
  {
    id: 'job_17',
    companyId: 'cmp_05',
    companyName: 'AppNova Digital — Demo',
    title: 'Full Stack Development Intern',
    department: 'Web Engineering',
    location: 'Madurai, Tamil Nadu (Hybrid)',
    type: 'Internship',
    opportunityType: 'internship',
    internshipType: 'Summer',
    duration: '6 months',
    stipend: '₹27,000 / month',
    conversionPossibility: true,
    experienceLevel: 'Entry Level',
    description: 'Hands-on role building React UI components, integrating Node.js microservices, and writing unit tests.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    preferredSkills: ['REST API'],
    assessmentRequired: true,
    assessmentSkills: ['React'],
    minimumAssessmentScore: 60,
    status: 'published',
    applicantCount: 7,
    createdAt: '2026-01-18T10:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v2'
  }
];

// 5. Skill Evidences for Students
export const DEMO_EVIDENCES: (SkillEvidence & { isDemo?: boolean; demoSeedVersion?: string })[] = [
  // Student 01: Arjun Kumar Evidences
  { id: 'ev_01_1', studentId: 'std_01', skillName: 'Python', type: 'project', title: 'Student Performance Predictor', verificationScore: 95, verified: true, verifiedAt: '2026-01-15T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-15T00:00:00.000Z' },
  { id: 'ev_01_2', studentId: 'std_01', skillName: 'Machine Learning', type: 'certification', title: 'Machine Learning Foundations', verificationScore: 92, verified: true, verifiedAt: '2025-11-10T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-11-10T00:00:00.000Z' },
  { id: 'ev_01_3', studentId: 'std_01', skillName: 'Pandas', type: 'work_experience', title: 'AI Developer Intern at Nexora', verificationScore: 90, verified: true, verifiedAt: '2025-08-30T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-30T00:00:00.000Z' },
  { id: 'ev_01_4', studentId: 'std_01', skillName: 'NumPy', type: 'github', title: 'NumPy Mathematical Vector Engine', verificationScore: 88, verified: true, verifiedAt: '2026-01-10T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-10T00:00:00.000Z' },
  { id: 'ev_01_5', studentId: 'std_01', skillName: 'Scikit-learn', type: 'assessment', title: 'NextMind Verified ML Assessment', verificationScore: 88, verified: true, verifiedAt: '2026-02-01T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 'ev_01_6', studentId: 'std_01', skillName: 'PyTorch', type: 'github', title: 'Multimodal Satellite Crop Health Classifier', verificationScore: 94, verified: true, verifiedAt: '2026-01-18T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-18T00:00:00.000Z' },

  // Student 02: Kavin Raj Evidences
  { id: 'ev_02_1', studentId: 'std_02', skillName: 'Java', type: 'certification', title: 'Oracle Certified Java Associate', verificationScore: 95, verified: true, verifiedAt: '2025-08-10T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-10T00:00:00.000Z' },
  { id: 'ev_02_2', studentId: 'std_02', skillName: 'DSA', type: 'project', title: 'LeetCode 320 Solved Problems Profile', verificationScore: 94, verified: true, verifiedAt: '2026-02-15T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-15T00:00:00.000Z' },
  { id: 'ev_02_3', studentId: 'std_02', skillName: 'Spring Boot', type: 'project', title: 'Enterprise Banking Microservices Core', verificationScore: 90, verified: true, verifiedAt: '2026-01-20T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-20T00:00:00.000Z' },
  { id: 'ev_02_4', studentId: 'std_02', skillName: 'SQL', type: 'work_experience', title: 'Java Backend Intern at DataForge', verificationScore: 89, verified: true, verifiedAt: '2025-07-31T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-07-31T00:00:00.000Z' },
  { id: 'ev_02_5', studentId: 'std_02', skillName: 'REST API', type: 'project', title: 'Payment Webhook Processing Microservice', verificationScore: 78, verified: true, verifiedAt: '2026-01-25T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-25T00:00:00.000Z' },

  // Student 03: Priya Dharshini Evidences
  { id: 'ev_03_1', studentId: 'std_03', skillName: 'React', type: 'project', title: 'Campus Recruitment Portal', verificationScore: 95, verified: true, verifiedAt: '2026-01-22T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-22T00:00:00.000Z' },
  { id: 'ev_03_2', studentId: 'std_03', skillName: 'JavaScript', type: 'certification', title: 'Meta Front-End Developer Certificate', verificationScore: 93, verified: true, verifiedAt: '2025-07-20T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-07-20T00:00:00.000Z' },
  { id: 'ev_03_3', studentId: 'std_03', skillName: 'Node.js', type: 'work_experience', title: 'Full Stack Intern at AppNova', verificationScore: 89, verified: true, verifiedAt: '2025-08-15T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-15T00:00:00.000Z' },
  { id: 'ev_03_4', studentId: 'std_03', skillName: 'MongoDB', type: 'project', title: 'Collaborative Kanban Sprint Board', verificationScore: 87, verified: true, verifiedAt: '2026-02-05T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-05T00:00:00.000Z' },
  { id: 'ev_03_5', studentId: 'std_03', skillName: 'TypeScript', type: 'github', title: 'Type-Safe React Design System Component Library', verificationScore: 92, verified: true, verifiedAt: '2026-01-28T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-28T00:00:00.000Z' },

  // Student 04: Vignesh Sundaram Evidences
  { id: 'ev_04_1', studentId: 'std_04', skillName: 'SQL', type: 'work_experience', title: 'Data Analytics Intern at DataForge', verificationScore: 92, verified: true, verifiedAt: '2025-08-15T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-15T00:00:00.000Z' },
  { id: 'ev_04_2', studentId: 'std_04', skillName: 'Power BI', type: 'certification', title: 'Google Data Analytics Professional', verificationScore: 90, verified: true, verifiedAt: '2025-08-30T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-30T00:00:00.000Z' },
  { id: 'ev_04_3', studentId: 'std_04', skillName: 'Python', type: 'project', title: 'Healthcare Patient Analytics Dashboard', verificationScore: 88, verified: true, verifiedAt: '2026-01-25T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-25T00:00:00.000Z' },
  { id: 'ev_04_4', studentId: 'std_04', skillName: 'Data Science', type: 'assessment', title: 'Verified Data Science Assessment', verificationScore: 87, verified: true, verifiedAt: '2026-02-10T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-10T00:00:00.000Z' },
  { id: 'ev_04_5', studentId: 'std_04', skillName: 'Pandas', type: 'project', title: 'Hospital Resource Utilization Forecast', verificationScore: 89, verified: true, verifiedAt: '2026-01-29T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-29T00:00:00.000Z' },

  // Student 05: Dharshan Pandian Evidences
  { id: 'ev_05_1', studentId: 'std_05', skillName: 'Linux', type: 'project', title: 'SSH Honeypot Intrusion Detection System', verificationScore: 93, verified: true, verifiedAt: '2026-01-18T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-18T00:00:00.000Z' },
  { id: 'ev_05_2', studentId: 'std_05', skillName: 'Cybersecurity', type: 'certification', title: 'CompTIA Security+ Certified', verificationScore: 91, verified: true, verifiedAt: '2025-09-12T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-09-12T00:00:00.000Z' },
  { id: 'ev_05_3', studentId: 'std_05', skillName: 'Networking', type: 'project', title: 'Automated Network Vulnerability Scanner', verificationScore: 89, verified: true, verifiedAt: '2026-02-05T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-05T00:00:00.000Z' },
  { id: 'ev_05_4', studentId: 'std_05', skillName: 'OWASP', type: 'project', title: 'Automated OWASP Top 10 Web Vulnerability Scanner', verificationScore: 90, verified: true, verifiedAt: '2026-01-22T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-22T00:00:00.000Z' },
  { id: 'ev_05_5', studentId: 'std_05', skillName: 'Python', type: 'github', title: 'Packet Sniffer & Flow Protocol Analyzer', verificationScore: 91, verified: true, verifiedAt: '2026-01-26T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-26T00:00:00.000Z' },

  // Student 06: Sneha Ramachandran Evidences
  { id: 'ev_06_1', studentId: 'std_06', skillName: 'Android', type: 'project', title: 'MediConnect Patient Telehealth App', verificationScore: 93, verified: true, verifiedAt: '2026-01-20T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-20T00:00:00.000Z' },
  { id: 'ev_06_2', studentId: 'std_06', skillName: 'Java', type: 'work_experience', title: 'Mobile Developer Intern at AppNova', verificationScore: 91, verified: true, verifiedAt: '2025-07-15T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-07-15T00:00:00.000Z' },
  { id: 'ev_06_3', studentId: 'std_06', skillName: 'Firebase', type: 'project', title: 'Transit Real-Time GPS Tracking App', verificationScore: 88, verified: true, verifiedAt: '2026-02-08T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-08T00:00:00.000Z' },
  { id: 'ev_06_4', studentId: 'std_06', skillName: 'REST API', type: 'project', title: 'Clinician Patient Telehealth API Client', verificationScore: 86, verified: true, verifiedAt: '2026-01-25T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-25T00:00:00.000Z' },
  { id: 'ev_06_5', studentId: 'std_06', skillName: 'Kotlin', type: 'certification', title: 'Android App Development with Kotlin', verificationScore: 90, verified: true, verifiedAt: '2025-08-20T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-20T00:00:00.000Z' },

  // Student 07: Hari Prasad Evidences
  { id: 'ev_07_1', studentId: 'std_07', skillName: 'C++', type: 'project', title: 'Thread-Safe In-Memory Cache Engine', verificationScore: 98, verified: true, verifiedAt: '2026-01-28T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-28T00:00:00.000Z' },
  { id: 'ev_07_2', studentId: 'std_07', skillName: 'DSA', type: 'github', title: 'LeetCode 540 Problems Guardian Profile', verificationScore: 99, verified: true, verifiedAt: '2026-02-20T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-20T00:00:00.000Z' },
  { id: 'ev_07_3', studentId: 'std_07', skillName: 'Linux', type: 'work_experience', title: 'Systems Engineering Intern at Nexora', verificationScore: 92, verified: true, verifiedAt: '2025-08-31T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-31T00:00:00.000Z' },
  { id: 'ev_07_4', studentId: 'std_07', skillName: 'Python', type: 'project', title: 'High-Performance Profiling Scripts for Cache Engine', verificationScore: 92, verified: true, verifiedAt: '2026-02-02T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-02T00:00:00.000Z' },

  // Student 08: Ananya Subramanian Evidences
  { id: 'ev_08_1', studentId: 'std_08', skillName: 'NLP', type: 'project', title: 'Multilingual Sentiment Analyzer (Tamil-English)', verificationScore: 94, verified: true, verifiedAt: '2026-01-24T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-24T00:00:00.000Z' },
  { id: 'ev_08_2', studentId: 'std_08', skillName: 'Python', type: 'certification', title: 'NLP Specialization - DeepLearning.AI', verificationScore: 93, verified: true, verifiedAt: '2025-09-18T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-09-18T00:00:00.000Z' },
  { id: 'ev_08_3', studentId: 'std_08', skillName: 'Machine Learning', type: 'work_experience', title: 'NLP Research Intern at DataForge', verificationScore: 91, verified: true, verifiedAt: '2025-08-31T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-31T00:00:00.000Z' },
  { id: 'ev_08_4', studentId: 'std_08', skillName: 'Deep Learning', type: 'project', title: 'Transformer Cross-Attention Weights Visualizer', verificationScore: 93, verified: true, verifiedAt: '2026-01-20T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-20T00:00:00.000Z' },
  { id: 'ev_08_5', studentId: 'std_08', skillName: 'PyTorch', type: 'github', title: 'Indic Language Pretrained Model Checkpoints', verificationScore: 94, verified: true, verifiedAt: '2026-01-22T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-22T00:00:00.000Z' },

  // Student 09: Pranav Ravichandran Evidences
  { id: 'ev_09_1', studentId: 'std_09', skillName: 'Linux', type: 'work_experience', title: 'Cloud Operations Intern at CloudAxis', verificationScore: 93, verified: true, verifiedAt: '2025-08-31T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-31T00:00:00.000Z' },
  { id: 'ev_09_2', studentId: 'std_09', skillName: 'Docker', type: 'project', title: 'Automated Microservices GitOps Pipeline', verificationScore: 91, verified: true, verifiedAt: '2026-01-30T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-30T00:00:00.000Z' },
  { id: 'ev_09_3', studentId: 'std_09', skillName: 'AWS', type: 'certification', title: 'AWS Solutions Architect Associate', verificationScore: 89, verified: true, verifiedAt: '2025-08-14T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-14T00:00:00.000Z' },
  { id: 'ev_09_4', studentId: 'std_09', skillName: 'CI/CD', type: 'github', title: 'Zero-Downtime Blue-Green Helm Deployment Pipeline', verificationScore: 90, verified: true, verifiedAt: '2026-02-01T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-01T00:00:00.000Z' },

  // Student 10: Rahul Manikandan Evidences
  { id: 'ev_10_1', studentId: 'std_10', skillName: 'React', type: 'project', title: 'Multi-Tenant SaaS Invoicing Billing Engine', verificationScore: 93, verified: true, verifiedAt: '2026-01-26T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-01-26T00:00:00.000Z' },
  { id: 'ev_10_2', studentId: 'std_10', skillName: 'Node.js', type: 'work_experience', title: 'Full Stack Intern at AppNova', verificationScore: 90, verified: true, verifiedAt: '2025-08-31T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-08-31T00:00:00.000Z' },
  { id: 'ev_10_3', studentId: 'std_10', skillName: 'SQL', type: 'certification', title: 'Full Stack Web with PostgreSQL', verificationScore: 89, verified: true, verifiedAt: '2025-07-28T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2025-07-28T00:00:00.000Z' },
  { id: 'ev_10_4', studentId: 'std_10', skillName: 'MongoDB', type: 'project', title: 'Aggregated Invoicing Timeseries Database', verificationScore: 88, verified: true, verifiedAt: '2026-02-03T00:00:00.000Z', isDemo: true, demoSeedVersion: 'v2', createdAt: '2026-02-03T00:00:00.000Z' }
];

// Admin Industry Seed
export const ADMIN_INDUSTRIES_SEED: AdminIndustryData[] = [
  {
    id: 'ind_soft_sys',
    name: 'Software Development & Systems',
    category: 'Engineering & Core Tech',
    activeHiringPartners: 42,
    openOpportunities: 185,
    avgStartingCtc: '₹10,50,000 / yr',
    topDemandedSkills: ['Python', 'Java', 'C++', 'DSA', 'SQL']
  },
  {
    id: 'ind_ai_data',
    name: 'Artificial Intelligence & Data Science',
    category: 'Advanced Analytics',
    activeHiringPartners: 36,
    openOpportunities: 140,
    avgStartingCtc: '₹13,80,000 / yr',
    topDemandedSkills: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn']
  },
  {
    id: 'ind_cloud_devops',
    name: 'Cloud Infrastructure & DevOps',
    category: 'Cloud Engineering',
    activeHiringPartners: 28,
    openOpportunities: 110,
    avgStartingCtc: '₹12,80,000 / yr',
    topDemandedSkills: ['Linux', 'Docker', 'AWS', 'Kubernetes', 'CI/CD']
  },
  {
    id: 'ind_cybersec',
    name: 'Cybersecurity & Defense',
    category: 'Information Security',
    activeHiringPartners: 20,
    openOpportunities: 75,
    avgStartingCtc: '₹11,50,000 / yr',
    topDemandedSkills: ['Cybersecurity', 'Networking', 'Linux', 'Python', 'OWASP']
  },
  {
    id: 'ind_web_mob',
    name: 'Web & Mobile Applications',
    category: 'Digital Product Engineering',
    activeHiringPartners: 48,
    openOpportunities: 210,
    avgStartingCtc: '₹11,00,000 / yr',
    topDemandedSkills: ['React', 'JavaScript', 'Node.js', 'Android', 'MongoDB']
  }
];
