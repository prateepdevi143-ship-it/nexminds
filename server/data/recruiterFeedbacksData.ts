export interface RecruiterFeedbackRecord {
  id: string;
  applicationId: string;
  jobId: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  status: 'rejected' | 'interview' | 'shortlisted';
  reason?: string;
  studentFeedback: string;
  internalHRNotes: string;
  skillGapsIdentified: string[];
  recommendedCourses?: string[];
  recommendedProjects?: string[];
  createdAt: string;
  isDemo?: boolean;
  demoSeedVersion?: string;
}

export const DEMO_RECRUITER_FEEDBACKS: RecruiterFeedbackRecord[] = [
  {
    id: 'fb_01',
    applicationId: 'app_04',
    jobId: 'job_01',
    companyId: 'cmp_01',
    companyName: 'Nexora Technologies — Demo',
    studentId: 'std_02',
    studentName: 'Kavin Raj',
    status: 'rejected',
    reason: 'Insufficient REST API production experience',
    studentFeedback: 'Strong core Java and algorithm fundamentals demonstrated in your submission. For this specific backend systems role, our team requires proven production experience designing REST API contracts, API rate-limiting, and OpenAPI schemas. We encourage you to complete practical REST API projects and re-apply in 90 days.',
    internalHRNotes: 'Candidate demonstrated 94% DSA skills on LeetCode, but struggled with RESTful architectural trade-offs in Section 3. Recommended for re-evaluation once candidate submits REST API proof.',
    skillGapsIdentified: ['REST API'],
    recommendedCourses: ['crs_rest_api_mastery', 'crs_node_adv'],
    recommendedProjects: ['Production RESTful E-Commerce Gateway with Swagger & Rate Limiting'],
    createdAt: '2026-02-04T15:30:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v1'
  },
  {
    id: 'fb_02',
    applicationId: 'app_08',
    jobId: 'job_02',
    companyId: 'cmp_01',
    companyName: 'Nexora Technologies — Demo',
    studentId: 'std_04',
    studentName: 'Vignesh Sundaram',
    status: 'rejected',
    reason: 'Mandatory C++ & Systems Assessment Below Required 70% Cutoff',
    studentFeedback: 'Thank you for your application. This position requires deep hands-on expertise in C++20 concurrency, low-level memory allocators, and Linux system calls. Your assessment score of 42% was below the required 70% threshold. We recommend focusing on C++ systems courses and retaking the assessment.',
    internalHRNotes: 'Candidate background is focused in Data Analytics / Power BI. Not aligned with low-level systems C++ requirements.',
    skillGapsIdentified: ['C++', 'DSA', 'Linux'],
    recommendedCourses: ['crs_cpp_systems_eng', 'crs_linux_internals'],
    recommendedProjects: ['Lock-Free High Throughput Ring Buffer in Modern C++'],
    createdAt: '2026-01-28T10:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v1'
  },
  {
    id: 'fb_03',
    applicationId: 'app_01',
    jobId: 'job_01',
    companyId: 'cmp_01',
    companyName: 'Nexora Technologies — Demo',
    studentId: 'std_01',
    studentName: 'Arjun Kumar',
    status: 'interview',
    studentFeedback: 'Exceptional performance in algorithm optimization and Python memory profiling. Commended for clear whiteboard communication and clean idiomatic code.',
    internalHRNotes: 'Advanced to Round 2 with Principal Architect. Strong candidate for fast-track offer.',
    skillGapsIdentified: [],
    createdAt: '2026-02-02T12:00:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v1'
  },
  {
    id: 'fb_04',
    applicationId: 'app_13',
    jobId: 'job_02',
    companyId: 'cmp_01',
    companyName: 'Nexora Technologies — Demo',
    studentId: 'std_07',
    studentName: 'Hari Prasad',
    status: 'interview',
    studentFeedback: 'Brilliant understanding of lock-free ring buffers, cache-line bouncing, and epoll reactor patterns. Easily top 1% of campus talent assessed this year.',
    internalHRNotes: 'Prepare offer package for VP sign-off.',
    skillGapsIdentified: [],
    createdAt: '2026-02-01T17:30:00.000Z',
    isDemo: true,
    demoSeedVersion: 'v1'
  }
];
