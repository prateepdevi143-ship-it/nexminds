import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7WYP8ML5hLeXWtm1lfvUTtb8pi0iHIs8",
  authDomain: "nexminds.firebaseapp.com",
  projectId: "nexminds",
  storageBucket: "nexminds.firebasestorage.app",
  messagingSenderId: "154313751407",
  appId: "1:154313751407:web:0f5a267bf20abab717469a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export default app;

