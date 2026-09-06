import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseAppletConfig) : getApp();

// Firebase Auth
export const auth = getAuth(app);

// NoSQL Real-Time Firestore Database with designated project database ID
export const db = getFirestore(app, firebaseAppletConfig.firestoreDatabaseId);

// Google OAuth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Validate connection to Firestore on initialization
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info('Nexminds Real-Time NoSQL Firestore Database connected successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Nexminds: Firebase client is operating offline. Check network connection.');
    }
  }
}
testConnection();

export default app;
