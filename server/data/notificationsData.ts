import { Notification } from '../../src/types';

export const DEMO_NOTIFICATIONS: (Notification & { isDemo?: boolean; demoSeedVersion?: string })[] = [
  {
    id: 'notif_01',
    userId: 'usr_student_01',
    title: 'Technical Round 2 Scheduled',
    message: 'Nexora Technologies has scheduled your Round 2 System Architecture interview for Python & Data Systems on Feb 10 at 3:00 PM IST.',
    type: 'application',
    read: false,
    createdAt: '2026-02-02T11:30:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_02',
    userId: 'usr_student_01',
    title: 'Offer Extended: Machine Learning Intern',
    message: 'Congratulations Arjun! DataForge Analytics has extended an offer for the Machine Learning Intern role with ₹30,000/month stipend.',
    type: 'application',
    read: false,
    createdAt: '2026-02-05T10:00:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_03',
    userId: 'usr_student_01',
    title: 'Skill Evidence Verified: PyTorch & Scikit-learn',
    message: 'Your deep learning project repository "Multimodal Satellite Crop Analyzer" has been verified with 96% confidence.',
    type: 'system',
    read: true,
    createdAt: '2026-01-22T08:00:00.000Z',
    link: '/profile'
  },
  {
    id: 'notif_04',
    userId: 'usr_student_02',
    title: 'Constructive Feedback Received from Nexora Technologies',
    message: 'Nexora HR shared detailed feedback on your Software Engineer application. Skill gap identified: REST API production experience. View Career GPS action plan.',
    type: 'application',
    read: false,
    createdAt: '2026-02-04T15:35:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_05',
    userId: 'usr_student_02',
    title: 'Interview Scheduled: Java Backend Developer',
    message: 'Nexora Technologies invited you to Technical Round 1 for the Java Backend Developer position. Match score: 94%.',
    type: 'application',
    read: false,
    createdAt: '2026-02-03T16:15:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_06',
    userId: 'usr_student_03',
    title: 'Internship Offer Accepted: AppNova Digital',
    message: 'AppNova Digital confirmed your summer joining as Full Stack Development Intern starting June 2026 in Coimbatore.',
    type: 'application',
    read: true,
    createdAt: '2026-02-06T12:30:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_07',
    userId: 'usr_student_03',
    title: 'Full Stack Developer Interview Round 2',
    message: 'AppNova Digital technical panel advanced you to the live collaborative coding round on React & Node.js.',
    type: 'application',
    read: false,
    createdAt: '2026-01-28T14:15:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_08',
    userId: 'usr_student_04',
    title: 'Assessment Feedback: Systems Software Engineer',
    message: 'Your C++ & Systems assessment score was 42% (passing cutoff: 70%). Explore our recommended C++ Systems masterclass to prepare for a retake.',
    type: 'assessment',
    read: false,
    createdAt: '2026-01-28T10:15:00.000Z',
    link: '/skill-assessments'
  },
  {
    id: 'notif_09',
    userId: 'usr_student_04',
    title: 'Application Shortlisted: Data Analyst at DataForge',
    message: 'Great news Vignesh! Your Power BI and SQL portfolio was shortlisted by DataForge Analytics with a 92% match.',
    type: 'application',
    read: false,
    createdAt: '2026-01-27T16:05:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_10',
    userId: 'usr_student_05',
    title: 'SOC Analyst Interview Scheduled',
    message: 'SecureStack Labs invited you to their SOC Incident Simulation round for Cybersecurity Analyst on Feb 12.',
    type: 'application',
    read: false,
    createdAt: '2026-02-04T14:15:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_11',
    userId: 'usr_student_06',
    title: 'Application Under Review: AppNova Digital',
    message: 'Your Android Mobile Developer application is currently under review by the mobile engineering lead.',
    type: 'application',
    read: true,
    createdAt: '2026-01-30T15:10:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_12',
    userId: 'usr_student_07',
    title: 'Final VP Interview Scheduled: Nexora Technologies',
    message: 'Hari Prasad, you scored 98% in Systems Architecture. Your final discussion with the VP of Engineering is scheduled for Feb 9.',
    type: 'application',
    read: false,
    createdAt: '2026-02-01T16:30:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_13',
    userId: 'usr_student_08',
    title: 'Shortlisted for NLP Research Associate',
    message: 'DataForge Analytics research team reviewed your IndicBERT paper draft and shortlisted your application.',
    type: 'application',
    read: false,
    createdAt: '2026-01-29T11:15:00.000Z',
    link: '/applications'
  },
  {
    id: 'notif_14',
    userId: 'usr_company_01',
    title: 'New High-Match Applications Received',
    message: 'Hari Prasad (98% match) and Arjun Kumar (94% match) applied to Software Engineering and Systems roles.',
    type: 'system',
    read: false,
    createdAt: '2026-02-02T10:00:00.000Z',
    link: '/company/applicants'
  },
  {
    id: 'notif_15',
    userId: 'usr_admin',
    title: 'NextMind Platform Health & Sync Status',
    message: 'Firestore real-time sync healthy. 10 students, 5 companies, 17 job listings, and 18 applications synchronized.',
    type: 'system',
    read: true,
    createdAt: '2026-02-06T09:00:00.000Z',
    link: '/admin'
  }
];
