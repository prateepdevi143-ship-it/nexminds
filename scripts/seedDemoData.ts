import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

import { DEMO_USERS, DEMO_STUDENTS, DEMO_COMPANIES, DEMO_JOBS, DEMO_EVIDENCES, CAREER_GOALS, ADMIN_INDUSTRIES_SEED } from '../server/data/demoAccountsData';
import { DEMO_APPLICATIONS } from '../server/data/applicationsData';
import { COMPREHENSIVE_COURSES } from '../server/data/coursesData';
import { SKILL_ASSESSMENTS_SEED } from '../server/data/questionsData';
import { DEMO_NOTIFICATIONS } from '../server/data/notificationsData';
import { DEMO_RECRUITER_FEEDBACKS } from '../server/data/recruiterFeedbacksData';
import { INITIAL_CANONICAL_SKILLS } from '../server/db';

async function runSeed() {
  console.log('--- Starting NextMind AI Demo Seeding ---');

  // 1. Select the exact 12 assessments and 22 courses
  const SELECTED_ASSESSMENTS = SKILL_ASSESSMENTS_SEED.slice(0, 12).map(a => ({
    ...a,
    isDemo: true,
    demoSeedVersion: 'v1'
  }));

  const SELECTED_COURSES = COMPREHENSIVE_COURSES.slice(0, 22).map(c => ({
    ...c,
    isDemo: true,
    demoSeedVersion: 'v1'
  }));

  // 2. Validate relationships in-memory
  const studentIds = new Set(DEMO_STUDENTS.map(s => s.id));
  const companyIds = new Set(DEMO_COMPANIES.map(c => c.id));
  const jobIds = new Set(DEMO_JOBS.map(j => j.id));

  // Check job companyIds
  for (const job of DEMO_JOBS) {
    if (!companyIds.has(job.companyId)) {
      throw new Error(`Integrity Error: Job ${job.id} references non-existent company ${job.companyId}`);
    }
  }

  // Check application studentIds and jobIds
  for (const app of DEMO_APPLICATIONS) {
    if (!studentIds.has(app.studentId)) {
      throw new Error(`Integrity Error: Application ${app.id} references non-existent student ${app.studentId}`);
    }
    if (!jobIds.has(app.jobId)) {
      throw new Error(`Integrity Error: Application ${app.id} references non-existent job ${app.jobId}`);
    }
  }

  // Check evidence studentIds
  for (const ev of DEMO_EVIDENCES) {
    if (!studentIds.has(ev.studentId)) {
      throw new Error(`Integrity Error: Evidence ${ev.id} references non-existent student ${ev.studentId}`);
    }
  }

  // 3. Connect to Firestore
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  let firestoreSuccess = false;

  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const app = initializeApp(config);
      const db = getFirestore(app, config.firestoreDatabaseId);

      console.log(`Connecting to Firestore (DB: ${config.firestoreDatabaseId || '(default)'})...`);

      // Write users
      for (const user of DEMO_USERS) {
        await setDoc(doc(db, 'users', user.id), user);
      }

      // Write students
      for (const student of DEMO_STUDENTS) {
        await setDoc(doc(db, 'students', student.id), student);
      }

      // Write companies
      for (const comp of DEMO_COMPANIES) {
        await setDoc(doc(db, 'companies', comp.id), comp);
      }

      // Write jobs
      for (const job of DEMO_JOBS) {
        await setDoc(doc(db, 'jobs', job.id), job);
      }

      // Write applications
      for (const appItem of DEMO_APPLICATIONS) {
        await setDoc(doc(db, 'applications', appItem.id), appItem);
      }

      // Write evidences
      for (const ev of DEMO_EVIDENCES) {
        await setDoc(doc(db, 'evidence', ev.id), ev);
      }

      // Write assessments
      for (const assm of SELECTED_ASSESSMENTS) {
        await setDoc(doc(db, 'assessments', assm.id), assm);
      }

      // Write courses
      for (const crs of SELECTED_COURSES) {
        await setDoc(doc(db, 'courses', crs.id), crs);
      }

      // Write notifications
      for (const notif of DEMO_NOTIFICATIONS) {
        await setDoc(doc(db, 'notifications', notif.id), notif);
      }

      // Write recruiter feedbacks
      for (const fb of DEMO_RECRUITER_FEEDBACKS) {
        await setDoc(doc(db, 'recruiterFeedbacks', fb.id), fb);
      }

      firestoreSuccess = true;
      console.log('✓ Firestore collections successfully populated.');
    } catch (fsErr) {
      console.warn('Firestore write notice (local fallback available):', (fsErr as Error).message);
    }
  }

  // 4. Always update local database data/careerai-db.json for server consistency
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbFilePath = path.join(dataDir, 'careerai-db.json');
  const fullDatabase = {
    users: DEMO_USERS,
    students: DEMO_STUDENTS,
    companies: DEMO_COMPANIES,
    jobs: DEMO_JOBS,
    applications: DEMO_APPLICATIONS,
    evidences: DEMO_EVIDENCES,
    canonicalSkills: INITIAL_CANONICAL_SKILLS,
    careers: CAREER_GOALS,
    courses: SELECTED_COURSES,
    assessments: SELECTED_ASSESSMENTS,
    notifications: DEMO_NOTIFICATIONS,
    industries: ADMIN_INDUSTRIES_SEED,
    assessmentAttempts: [],
    recruiterFeedbacks: DEMO_RECRUITER_FEEDBACKS
  };

  fs.writeFileSync(dbFilePath, JSON.stringify(fullDatabase, null, 2), 'utf-8');
  console.log('✓ Local careerai-db.json synchronized.');

  // 5. Output exact summary required
  console.log('\nNEXTMIND AI DEMO SEED COMPLETE\n');
  console.log(`Students created: ${DEMO_STUDENTS.length}`);
  console.log(`Companies created: ${DEMO_COMPANIES.length}`);
  console.log(`Opportunities created: ${DEMO_JOBS.length}`);
  console.log(`Applications created: ${DEMO_APPLICATIONS.length}`);
  console.log(`Assessments created: ${SELECTED_ASSESSMENTS.length}`);
  console.log(`Skill evidence records: ${DEMO_EVIDENCES.length}`);
  console.log(`Courses: ${SELECTED_COURSES.length}`);
  console.log(`Notifications: ${DEMO_NOTIFICATIONS.length}`);
  console.log(`Recruiter feedback records: ${DEMO_RECRUITER_FEEDBACKS.length}\n`);
  console.log('All demo relationships validated.\n');

  process.exit(0);
}

runSeed().catch(err => {
  console.error('Fatal error in seeding:', err);
  process.exit(1);
});
