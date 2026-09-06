import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { User, UserRole, Student, Company } from '../types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  studentProfile: Student | null;
  companyProfile: Company | null;
  role: UserRole | null;
  loading: boolean;
  needsOnboarding: boolean;
  needsRoleSelection: boolean;
  signInWithGoogle: () => Promise<FirebaseUser>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string, selectedRole?: UserRole) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  completeStudentOnboarding: (data: Partial<Student>) => Promise<void>;
  completeCompanyOnboarding: (data: Partial<Company>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsDemoUser: (demoRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [companyProfile, setCompanyProfile] = useState<Company | null>(null);
  const [role, setRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem('careerai_user_role') as UserRole) || 'student';
  });
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const savedRole = (localStorage.getItem('careerai_user_role') as UserRole) || 'student';
        const appUser: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          role: savedRole,
          createdAt: new Date().toISOString()
        };
        setUser(appUser);
        setRole(savedRole);
        setNeedsRoleSelection(false);
        setNeedsOnboarding(false);
      } else {
        setUser(null);
        setStudentProfile(null);
        setCompanyProfile(null);
        setRole(null);
        setNeedsRoleSelection(false);
        setNeedsOnboarding(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (firebaseUser) {
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: role || 'student',
        createdAt: new Date().toISOString()
      });
    }
  };

  const signInWithGoogle = async (): Promise<FirebaseUser> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user) {
        const savedRole = (localStorage.getItem('careerai_user_role') as UserRole) || 'student';
        const appUser: User = {
          id: cred.user.uid,
          email: cred.user.email || '',
          name: cred.user.displayName || cred.user.email?.split('@')[0] || 'Google User',
          role: savedRole,
          createdAt: new Date().toISOString()
        };
        setUser(appUser);
        setFirebaseUser(cred.user);
        setRole(savedRole);
        setNeedsRoleSelection(false);
        setNeedsOnboarding(false);
        return cred.user;
      }
      throw new Error('Google Sign-In completed without user credentials');
    } catch (err: any) {
      console.error('Firebase Google Sign-In error in AuthContext:', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (cred.user) {
        const savedRole = (localStorage.getItem('careerai_user_role') as UserRole) || 'student';
        const appUser: User = {
          id: cred.user.uid,
          email: cred.user.email || email.trim(),
          name: cred.user.displayName || email.trim().split('@')[0] || 'User',
          role: savedRole,
          createdAt: new Date().toISOString()
        };
        setUser(appUser);
        setFirebaseUser(cred.user);
        setRole(savedRole);
      }
    } catch (err: any) {
      console.error('Firebase signInWithEmail error in AuthContext:', err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string, selectedRole?: UserRole) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const displayName = name?.trim() || email.trim().split('@')[0];
      if (displayName) {
        try {
          await updateProfile(cred.user, { displayName });
        } catch (profileErr) {
          console.warn('Could not update user display name:', profileErr);
        }
      }
      const userRole = selectedRole || 'student';
      localStorage.setItem('careerai_user_role', userRole);
      const appUser: User = {
        id: cred.user.uid,
        email: email.trim(),
        name: displayName,
        role: userRole,
        createdAt: new Date().toISOString()
      };
      setUser(appUser);
      setFirebaseUser(cred.user);
      setRole(userRole);
      setNeedsRoleSelection(false);
      setNeedsOnboarding(false);
    } catch (err: any) {
      console.error('Firebase signUpWithEmail error in AuthContext:', err);
      throw err;
    }
  };

  const selectRole = async (selectedRole: UserRole) => {
    localStorage.setItem('careerai_user_role', selectedRole);
    setRole(selectedRole);
    if (user) {
      setUser({ ...user, role: selectedRole });
    }
    setNeedsRoleSelection(false);
  };

  const completeStudentOnboarding = async (_data: Partial<Student>) => {
    setNeedsOnboarding(false);
  };

  const completeCompanyOnboarding = async (_data: Partial<Company>) => {
    setNeedsOnboarding(false);
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      setFirebaseUser(null);
      setUser(null);
      setStudentProfile(null);
      setCompanyProfile(null);
      setRole(null);
      setNeedsOnboarding(false);
      setNeedsRoleSelection(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const loginAsDemoUser = async (demoRole: UserRole) => {
    const demoEmail =
      demoRole === 'student'
        ? 'student.demo@careerai.dev'
        : demoRole === 'company'
        ? 'recruiter.demo@careerai.dev'
        : 'admin.demo@careerai.dev';
    const demoPass = 'CareerAI@2026';
    const name =
      demoRole === 'student'
        ? 'Demo Student'
        : demoRole === 'company'
        ? 'Vertex AI Labs (Demo)'
        : 'Platform Administrator';

    localStorage.setItem('careerai_user_role', demoRole);

    try {
      const cred = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      if (cred.user) {
        setUser({
          id: cred.user.uid,
          email: demoEmail,
          name: cred.user.displayName || name,
          role: demoRole,
          createdAt: new Date().toISOString()
        });
        setFirebaseUser(cred.user);
        setRole(demoRole);
      }
    } catch (err: any) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-login-credentials'
      ) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
          await updateProfile(cred.user, { displayName: name });
          setUser({
            id: cred.user.uid,
            email: demoEmail,
            name,
            role: demoRole,
            createdAt: new Date().toISOString()
          });
          setFirebaseUser(cred.user);
          setRole(demoRole);
        } catch (createErr: any) {
          if (createErr.code === 'auth/email-already-in-use') {
            try {
              const cred = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
              setUser({
                id: cred.user.uid,
                email: demoEmail,
                name,
                role: demoRole,
                createdAt: new Date().toISOString()
              });
              setFirebaseUser(cred.user);
              setRole(demoRole);
            } catch (retryErr) {
              console.error('Demo login retry failed:', retryErr);
              throw retryErr;
            }
          } else {
            console.error('Error creating demo user account:', createErr);
            throw createErr;
          }
        }
      } else {
        console.error('Demo login failed:', err);
        throw err;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        studentProfile,
        companyProfile,
        role,
        loading,
        needsOnboarding,
        needsRoleSelection,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        selectRole,
        completeStudentOnboarding,
        completeCompanyOnboarding,
        signOut,
        resetPassword,
        refreshProfile,
        loginAsDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


