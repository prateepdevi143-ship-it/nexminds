import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import {
  Application,
  Job,
  Notification,
  SkillEvidence,
  Student,
  Company,
  ApplicationStatus,
  RecruiterFeedback
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };

  const isPermissionError = errMsg.includes('permission') || errMsg.includes('PERMISSION_DENIED');
  const isOfflineOrUnavailable = errMsg.includes('unavailable') || errMsg.includes('offline') || (error as any)?.code === 'unavailable';

  if (isPermissionError) {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else if (isOfflineOrUnavailable) {
    console.warn(`Firestore Real-Time Notice [${operationType} on ${path}]: Operating in offline mode.`, errMsg);
  } else {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  }
}

// REAL-TIME FIRESTORE SUBSCRIPTION MANAGERS

/**
 * Real-time listener for all jobs or company-specific jobs
 */
export function subscribeToRealtimeJobs(
  onUpdate: (jobs: Job[]) => void,
  companyId?: string
): Unsubscribe {
  const path = 'jobs';
  try {
    const jobsRef = collection(db, path);
    const q = companyId ? query(jobsRef, where('companyId', '==', companyId)) : jobsRef;

    return onSnapshot(
      q,
      snapshot => {
        const jobs: Job[] = [];
        snapshot.forEach(docSnap => {
          jobs.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onUpdate(jobs);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

/**
 * Real-time listener for applications (synchronizes candidate pipeline between student and company)
 */
export function subscribeToRealtimeApplications(
  onUpdate: (apps: Application[]) => void,
  filters?: { studentId?: string; companyId?: string; role?: string }
): Unsubscribe {
  // Only attempt Firestore subscription if authenticated with Firebase Auth
  if (!auth.currentUser) {
    return () => {};
  }

  const path = 'applications';
  try {
    const appsRef = collection(db, path);
    let q;

    if (filters?.studentId) {
      q = query(appsRef, where('studentId', '==', filters.studentId));
    } else if (filters?.companyId) {
      q = query(appsRef, where('companyId', '==', filters.companyId));
    } else if (filters?.role === 'company') {
      q = query(appsRef, where('companyId', '==', auth.currentUser.uid));
    } else {
      // Default to student's own applications to satisfy Firestore security rules
      q = query(appsRef, where('studentId', '==', auth.currentUser.uid));
    }

    return onSnapshot(
      q,
      snapshot => {
        const apps: Application[] = [];
        snapshot.forEach(docSnap => {
          apps.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onUpdate(apps);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

/**
 * Real-time listener for user notifications
 */
export function subscribeToRealtimeNotifications(
  userId: string,
  onUpdate: (notifs: Notification[]) => void
): Unsubscribe {
  // Only attempt Firestore subscription if authenticated with Firebase Auth
  if (!auth.currentUser) {
    return () => {};
  }

  const targetUid = auth.currentUser.uid || userId;
  const path = 'notifications';
  try {
    const notifsRef = collection(db, path);
    const q = query(notifsRef, where('userId', '==', targetUid));

    return onSnapshot(
      q,
      snapshot => {
        const notifs: Notification[] = [];
        snapshot.forEach(docSnap => {
          notifs.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        // Sort descending by creation date
        notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(notifs);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

/**
 * Real-time listener for verified skill evidence artifacts
 */
export function subscribeToRealtimeEvidences(
  studentId: string,
  onUpdate: (evidences: SkillEvidence[]) => void
): Unsubscribe {
  // Only attempt Firestore subscription if authenticated with Firebase Auth
  if (!auth.currentUser) {
    return () => {};
  }

  const path = 'evidence';
  try {
    const evRef = collection(db, path);
    const q = query(evRef, where('studentId', '==', studentId));

    return onSnapshot(
      q,
      snapshot => {
        const list: SkillEvidence[] = [];
        snapshot.forEach(docSnap => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onUpdate(list);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

/**
 * Real-time listener for student capability profile
 */
export function subscribeToRealtimeStudent(
  studentId: string,
  onUpdate: (student: Student | null) => void
): Unsubscribe {
  // Only attempt Firestore subscription if authenticated with Firebase Auth
  if (!auth.currentUser) {
    return () => {};
  }

  const path = `students/${studentId}`;
  try {
    const studentDocRef = doc(db, 'students', studentId);
    return onSnapshot(
      studentDocRef,
      snapshot => {
        if (snapshot.exists()) {
          onUpdate({ id: snapshot.id, ...(snapshot.data() as any) });
        } else {
          onUpdate(null);
        }
      },
      error => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

// REAL-TIME MUTATION APIS (Direct Cloud Firestore Storage)

/**
 * Store or submit a new job application to Firestore in real time
 */
export async function saveApplicationToFirestore(application: Application): Promise<void> {
  const path = `applications/${application.id}`;
  try {
    await setDoc(doc(db, 'applications', application.id), {
      ...application,
      updatedAt: new Date().toISOString()
    });

    // Also write a real-time notification for the recruiter/company
    const notifId = `notif_app_${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: application.companyId,
      title: `New Candidate Application Received`,
      message: `${application.studentName} applied for the position with verified match score ${application.candidateScore}%.`,
      type: 'application',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/company-dashboard'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update candidate status in the real-time pipeline (shortlisted, interview, selected, rejected)
 */
export async function updateApplicationStatusInFirestore(
  applicationId: string,
  newStatus: ApplicationStatus,
  recruiterNotes?: string,
  feedback?: RecruiterFeedback
): Promise<void> {
  const path = `applications/${applicationId}`;
  try {
    const appRef = doc(db, 'applications', applicationId);
    const snap = await getDoc(appRef);
    if (!snap.exists()) {
      throw new Error(`Application ${applicationId} not found in Firestore`);
    }

    const currentData = snap.data() as Application;
    const now = new Date().toISOString();
    const newEvent = {
      id: `evt_${Date.now()}`,
      status: newStatus,
      date: now,
      note: recruiterNotes || `Status advanced to ${newStatus.replace('_', ' ')}.`
    };

    const updatePayload: any = {
      status: newStatus,
      updatedAt: now,
      timeline: [...(currentData.timeline || []), newEvent]
    };

    if (recruiterNotes) {
      updatePayload.internalHRNotes = recruiterNotes;
    }

    if (feedback) {
      updatePayload.recruiterFeedback = feedback;
    }

    await updateDoc(appRef, updatePayload);

    // Alert the student in real time via Firestore notification
    const notifId = `notif_status_${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: currentData.studentId,
      title: `Application Update: ${newStatus.toUpperCase()}`,
      message: `Your application status for job ID ${currentData.jobId} has progressed to ${newStatus.replace('_', ' ')}.`,
      type: 'application',
      read: false,
      createdAt: now,
      link: '/applications'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Post a new job or update existing opening in real-time Firestore database
 */
export async function saveJobToFirestore(job: Job): Promise<void> {
  const path = `jobs/${job.id}`;
  try {
    await setDoc(doc(db, 'jobs', job.id), {
      ...job,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Add or update verified skill evidence artifact in Firestore
 */
export async function saveEvidenceToFirestore(evidence: SkillEvidence): Promise<void> {
  const path = `evidence/${evidence.id}`;
  try {
    await setDoc(doc(db, 'evidence', evidence.id), {
      ...evidence,
      createdAt: evidence.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save or update student profile in Firestore
 */
export async function saveStudentToFirestore(student: Student): Promise<void> {
  const path = `students/${student.id}`;
  try {
    await setDoc(doc(db, 'students', student.id), {
      ...student,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Mark notification as read in Firestore
 */
export async function markNotificationReadInFirestore(notificationId: string): Promise<void> {
  const path = `notifications/${notificationId}`;
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Initialize / bootstrap Firestore with rich platform dataset if collections are initially empty
 */
export async function initializeFirestoreDatabase(seedData: {
  jobs?: Job[];
  students?: Student[];
  companies?: Company[];
  applications?: Application[];
  evidences?: SkillEvidence[];
  notifications?: Notification[];
}): Promise<void> {
  try {
    // Check if jobs exist
    const jobsSnap = await getDocs(collection(db, 'jobs'));
    if (jobsSnap.empty && seedData.jobs && seedData.jobs.length > 0) {
      console.info('Seeding Firestore jobs collection with initial openings...');
      for (const job of seedData.jobs) {
        await setDoc(doc(db, 'jobs', job.id), job);
      }
    }

    // Check if students exist
    const studentsSnap = await getDocs(collection(db, 'students'));
    if (studentsSnap.empty && seedData.students && seedData.students.length > 0) {
      console.info('Seeding Firestore students collection with initial profiles...');
      for (const std of seedData.students) {
        await setDoc(doc(db, 'students', std.id), std);
      }
    }

    // Check if companies exist
    const companiesSnap = await getDocs(collection(db, 'companies'));
    if (companiesSnap.empty && seedData.companies && seedData.companies.length > 0) {
      console.info('Seeding Firestore companies collection with registered employers...');
      for (const comp of seedData.companies) {
        await setDoc(doc(db, 'companies', comp.id), comp);
      }
    }

    // Check if applications exist
    const appsSnap = await getDocs(collection(db, 'applications'));
    if (appsSnap.empty && seedData.applications && seedData.applications.length > 0) {
      console.info('Seeding Firestore applications collection with pipeline data...');
      for (const app of seedData.applications) {
        await setDoc(doc(db, 'applications', app.id), app);
      }
    }

    // Check if evidence exists
    const evSnap = await getDocs(collection(db, 'evidence'));
    if (evSnap.empty && seedData.evidences && seedData.evidences.length > 0) {
      console.info('Seeding Firestore evidence collection with verified artifacts...');
      for (const ev of seedData.evidences) {
        await setDoc(doc(db, 'evidence', ev.id), ev);
      }
    }

    // Check if notifications exist
    const notifsSnap = await getDocs(collection(db, 'notifications'));
    if (notifsSnap.empty && seedData.notifications && seedData.notifications.length > 0) {
      console.info('Seeding Firestore notifications collection with initial alerts...');
      for (const notif of seedData.notifications) {
        await setDoc(doc(db, 'notifications', notif.id), notif);
      }
    }
  } catch (error) {
    console.warn('Non-blocking Firestore initialization note:', error);
  }
}
