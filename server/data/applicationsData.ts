import { Application } from '../types';

export const DEMO_APPLICATIONS: Application[] = [
  // Student 1 (Arjun Kumar)
  {
    id: 'app_01',
    jobId: 'job_01',
    studentId: 'std_01',
    status: 'interviewing',
    appliedAt: '2026-01-18T14:30:00.000Z',
    matchScore: 94,
    notes: 'Exceptional deep learning and PyTorch project evidence with Tamil Whisper model. Scheduled for Technical Round 2.'
  },
  {
    id: 'app_02',
    jobId: 'job_02',
    studentId: 'std_01',
    status: 'accepted',
    appliedAt: '2026-01-22T09:15:00.000Z',
    matchScore: 96,
    notes: 'Offer letter released. Joining date confirmed for June 2026.'
  },
  {
    id: 'app_03',
    jobId: 'job_08',
    studentId: 'std_01',
    status: 'reviewing',
    appliedAt: '2026-01-26T11:20:00.000Z',
    matchScore: 82,
    notes: 'Resume under review by the Advanced Analytics hiring manager.'
  },

  // Student 2 (Kavin Raj)
  {
    id: 'app_04',
    jobId: 'job_04',
    studentId: 'std_02',
    status: 'interviewing',
    appliedAt: '2026-01-14T16:00:00.000Z',
    matchScore: 92,
    notes: 'Live coding assessment completed with 95% score on React & TypeScript. System design interview scheduled.'
  },
  {
    id: 'app_05',
    jobId: 'job_05',
    studentId: 'std_02',
    status: 'shortlisted',
    appliedAt: '2026-01-19T10:45:00.000Z',
    matchScore: 90,
    notes: 'Selected for initial hiring manager conversation.'
  },
  {
    id: 'app_06',
    jobId: 'job_06',
    studentId: 'std_02',
    status: 'applied',
    appliedAt: '2026-01-24T18:10:00.000Z',
    matchScore: 84
  },

  // Student 3 (Sanjay Kumar)
  {
    id: 'app_07',
    jobId: 'job_08',
    studentId: 'std_03',
    status: 'shortlisted',
    appliedAt: '2026-01-21T13:30:00.000Z',
    matchScore: 91,
    notes: 'Strong alignment with retail demand forecasting domain. Take-home data challenge sent.'
  },
  {
    id: 'app_08',
    jobId: 'job_07',
    studentId: 'std_03',
    status: 'reviewing',
    appliedAt: '2026-01-25T11:00:00.000Z',
    matchScore: 86
  },
  {
    id: 'app_09',
    jobId: 'job_03',
    studentId: 'std_03',
    status: 'interviewing',
    appliedAt: '2026-01-27T15:45:00.000Z',
    matchScore: 88,
    notes: 'Passed initial screening. Screening call with Lead Data Scientist scheduled.'
  },

  // Student 4 (Vignesh S)
  {
    id: 'app_10',
    jobId: 'job_06',
    studentId: 'std_04',
    status: 'interviewing',
    appliedAt: '2026-01-23T09:00:00.000Z',
    matchScore: 89,
    notes: 'Impressive backend order processing pipeline demonstration. Round 1 technical completed.'
  },
  {
    id: 'app_11',
    jobId: 'job_12',
    studentId: 'std_04',
    status: 'shortlisted',
    appliedAt: '2026-01-28T14:15:00.000Z',
    matchScore: 85
  },

  // Student 5 (Dharshan P)
  {
    id: 'app_12',
    jobId: 'job_13',
    studentId: 'std_05',
    status: 'interviewing',
    appliedAt: '2026-01-16T12:00:00.000Z',
    matchScore: 95,
    notes: 'Top candidate in SOC packet triage and OWASP Top 10 remediation. VP Security interview next.'
  },
  {
    id: 'app_13',
    jobId: 'job_14',
    studentId: 'std_05',
    status: 'accepted',
    appliedAt: '2026-01-18T16:30:00.000Z',
    matchScore: 98,
    notes: 'Direct internship offer issued with ₹30,000 stipend. Student accepted.'
  },
  {
    id: 'app_14',
    jobId: 'job_15',
    studentId: 'std_05',
    status: 'shortlisted',
    appliedAt: '2026-01-24T17:00:00.000Z',
    matchScore: 93
  },

  // Student 6 (Rahul M)
  {
    id: 'app_15',
    jobId: 'job_10',
    studentId: 'std_06',
    status: 'interviewing',
    appliedAt: '2026-01-18T10:15:00.000Z',
    matchScore: 90,
    notes: 'AWS Certified Solutions Architect verification confirmed. Cloud architecture panel interview scheduled.'
  },
  {
    id: 'app_16',
    jobId: 'job_11',
    studentId: 'std_06',
    status: 'applied',
    appliedAt: '2026-01-23T11:45:00.000Z',
    matchScore: 82
  },

  // Student 7 (Hari Prasad)
  {
    id: 'app_17',
    jobId: 'job_11',
    studentId: 'std_07',
    status: 'accepted',
    appliedAt: '2026-01-22T14:00:00.000Z',
    matchScore: 94,
    notes: 'Hands-on ArgoCD GitOps project highly rated. Offer letter signed.'
  },
  {
    id: 'app_18',
    jobId: 'job_10',
    studentId: 'std_07',
    status: 'reviewing',
    appliedAt: '2026-01-25T16:20:00.000Z',
    matchScore: 85
  },

  // Student 8 (Ajay Kumar)
  {
    id: 'app_19',
    jobId: 'job_05',
    studentId: 'std_08',
    status: 'interviewing',
    appliedAt: '2026-01-20T11:10:00.000Z',
    matchScore: 94,
    notes: 'Clean Tailwind CSS code styling and responsive design skills. Portfolio review completed.'
  },
  {
    id: 'app_20',
    jobId: 'job_04',
    studentId: 'std_08',
    status: 'applied',
    appliedAt: '2026-01-26T15:30:00.000Z',
    matchScore: 76
  },

  // Student 9 (Pranav R)
  {
    id: 'app_21',
    jobId: 'job_01',
    studentId: 'std_09',
    status: 'shortlisted',
    appliedAt: '2026-01-17T09:45:00.000Z',
    matchScore: 89,
    notes: 'Strong edge video inference background. Shortlisted for technical round.'
  },
  {
    id: 'app_22',
    jobId: 'job_02',
    studentId: 'std_09',
    status: 'interviewing',
    appliedAt: '2026-01-22T12:00:00.000Z',
    matchScore: 93,
    notes: 'Completed live coding round. Final interview scheduled with Lead ML Architect.'
  },

  // Student 10 (Sathish K)
  {
    id: 'app_23',
    jobId: 'job_07',
    studentId: 'std_10',
    status: 'accepted',
    appliedAt: '2026-01-16T15:00:00.000Z',
    matchScore: 94,
    notes: 'Power BI portfolio and DAX proficiency evaluated. Selected for Full-time Data Analyst role.'
  },
  {
    id: 'app_24',
    jobId: 'job_03',
    studentId: 'std_10',
    status: 'reviewing',
    appliedAt: '2026-01-27T10:30:00.000Z',
    matchScore: 80
  },

  // Student 11 (Mohanraj V)
  {
    id: 'app_25',
    jobId: 'job_04',
    studentId: 'std_11',
    status: 'applied',
    appliedAt: '2026-01-28T16:00:00.000Z',
    matchScore: 68
  },

  // Student 12 (Ashwin T)
  {
    id: 'app_26',
    jobId: 'job_02',
    studentId: 'std_12',
    status: 'shortlisted',
    appliedAt: '2026-01-23T14:40:00.000Z',
    matchScore: 88,
    notes: 'RAG pipeline project well-aligned with enterprise customer support AI initiative.'
  },
  {
    id: 'app_27',
    jobId: 'job_09',
    studentId: 'std_12',
    status: 'reviewing',
    appliedAt: '2026-01-27T11:15:00.000Z',
    matchScore: 87
  },

  // Student 13 (Gokul S)
  {
    id: 'app_28',
    jobId: 'job_06',
    studentId: 'std_13',
    status: 'applied',
    appliedAt: '2026-01-25T13:00:00.000Z',
    matchScore: 81
  },
  {
    id: 'app_29',
    jobId: 'job_12',
    studentId: 'std_13',
    status: 'shortlisted',
    appliedAt: '2026-01-28T15:20:00.000Z',
    matchScore: 80,
    notes: 'Strong multithreading and database transactional integrity skills.'
  },

  // Student 14 (Manoj R)
  {
    id: 'app_30',
    jobId: 'job_05',
    studentId: 'std_14',
    status: 'interviewing',
    appliedAt: '2026-01-20T10:30:00.000Z',
    matchScore: 89,
    notes: 'Excellent design systems craft in Figma. Prototype walkthrough scheduled.'
  },

  // Student 15 (Vijay S)
  {
    id: 'app_31',
    jobId: 'job_10',
    studentId: 'std_15',
    status: 'reviewing',
    appliedAt: '2026-01-22T09:30:00.000Z',
    matchScore: 86
  },
  {
    id: 'app_32',
    jobId: 'job_12',
    studentId: 'std_15',
    status: 'shortlisted',
    appliedAt: '2026-01-27T14:10:00.000Z',
    matchScore: 88,
    notes: 'Docker containerization and telemetry experience matches platform requirements.'
  },

  // Additional cross-applications
  {
    id: 'app_33',
    jobId: 'job_09',
    studentId: 'std_01',
    status: 'applied',
    appliedAt: '2026-01-29T16:45:00.000Z',
    matchScore: 92
  },
  {
    id: 'app_34',
    jobId: 'job_03',
    studentId: 'std_09',
    status: 'applied',
    appliedAt: '2026-01-29T17:15:00.000Z',
    matchScore: 90
  },
  {
    id: 'app_35',
    jobId: 'job_14',
    studentId: 'std_04',
    status: 'rejected',
    appliedAt: '2026-01-20T11:00:00.000Z',
    matchScore: 62,
    notes: 'Candidate profile oriented around backend development rather than security operations.'
  },
  {
    id: 'app_36',
    jobId: 'job_05',
    studentId: 'std_11',
    status: 'applied',
    appliedAt: '2026-01-29T18:00:00.000Z',
    matchScore: 71
  }
];
