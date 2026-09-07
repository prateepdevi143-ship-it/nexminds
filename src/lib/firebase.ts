import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseAppletConfig) : getApp();

// Firebase Auth
export const auth = getAuth(app);

// NoSQL Real-Time Firestore Database with designated project database ID and auto long-polling
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true
  }, firebaseAppletConfig.firestoreDatabaseId);
} catch {
  firestoreDb = getFirestore(app, firebaseAppletConfig.firestoreDatabaseId);
}
export const db = firestoreDb;

// Google OAuth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Validate connection to Firestore on initialization
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info('Nexminds Real-Time NoSQL Firestore Database connected successfully.');
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorCode = error?.code || '';
    if (
      errorMsg.includes('the client is offline') ||
      errorMsg.includes('unavailable') ||
      errorCode === 'unavailable'
    ) {
      console.warn('Nexminds: Firebase client is operating with offline persistence/long-polling:', errorMsg);
    } else {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export default app;
