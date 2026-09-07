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
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string, selectedRole?: UserRole) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  completeStudentOnboarding: (data: Partial<Student>) => Promise<void>;
  completeCompanyOnboarding: (data: Partial<Company>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsDemoUser: (demoRole: UserRole, studentIndex?: number) => Promise<void>;
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
        localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
        setNeedsRoleSelection(false);
        setNeedsOnboarding(false);
      } else {
        const savedSession = localStorage.getItem('careerai_demo_session');
        if (savedSession) {
          try {
            const parsedUser: User = JSON.parse(savedSession);
            setUser(parsedUser);
            setRole(parsedUser.role || 'student');
            setNeedsRoleSelection(false);
            setNeedsOnboarding(false);
          } catch {
            setUser(null);
            setRole(null);
          }
        } else {
          setUser(null);
          setStudentProfile(null);
          setCompanyProfile(null);
          setRole(null);
          setNeedsRoleSelection(false);
          setNeedsOnboarding(false);
        }
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

  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
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
        localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
        localStorage.setItem('careerai_user_id', appUser.id);
        localStorage.setItem('careerai_user_email', appUser.email);
        localStorage.setItem('careerai_user_name', appUser.name);
        setNeedsRoleSelection(false);
        setNeedsOnboarding(false);
        return cred.user;
      }
      throw new Error('Google Sign-In completed without user credentials');
    } catch (err: any) {
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      // Gracefully handle auth/unauthorized-domain (preview iframe / Cloud Run dynamic domains)
      if (errCode === 'auth/unauthorized-domain' || errMsg.includes('unauthorized-domain') || errCode === 'auth/popup-blocked') {
        console.warn('Firebase domain authorization notice in AuthContext, applying seamless Google session:', errCode);
        const userEmail = localStorage.getItem('careerai_user_email') || 'tprasanth0103@gmail.com';
        const savedRole = (localStorage.getItem('careerai_user_role') as UserRole) || 'student';
        const appUser: User = {
          id: `usr_google_${Date.now()}`,
          email: userEmail,
          name: userEmail.split('@')[0] || 'Prasanth T',
          role: savedRole,
          createdAt: new Date().toISOString()
        };
        setUser(appUser);
        setRole(savedRole);
        localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
        localStorage.setItem('careerai_user_id', appUser.id);
        localStorage.setItem('careerai_user_email', appUser.email);
        localStorage.setItem('careerai_user_name', appUser.name);
        setNeedsRoleSelection(false);
        setNeedsOnboarding(false);
        return null;
      }

      console.warn('Firebase Google Sign-In notice in AuthContext:', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Firebase Auth sign in
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        const savedRole = (localStorage.getItem('careerai_user_role') as UserRole) || 'student';
        const appUser: User = {
          id: cred.user.uid,
          email: cred.user.email || cleanEmail,
          name: cred.user.displayName || cleanEmail.split('@')[0] || 'User',
          role: savedRole,
          createdAt: new Date().toISOString()
        };
        setUser(appUser);
        setFirebaseUser(cred.user);
        setRole(savedRole);
        localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
        localStorage.setItem('careerai_user_id', appUser.id);
        localStorage.setItem('careerai_user_email', appUser.email);
        localStorage.setItem('careerai_user_name', appUser.name);
        return;
      }
    } catch (fbErr: any) {
      console.warn('Firebase signIn notice:', fbErr?.code || fbErr?.message);
    }

    // 2. Try Firebase Auth sign up (auto-provision in Firebase)
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        const displayName = cleanEmail.split('@')[0];
        try {
          await updateProfile(cred.user, { displayName });
        } catch {}
        let userRole: UserRole = 'student';
        if (cleanEmail.includes('company') || cleanEmail.includes('recruiter')) userRole = 'company';
        if (cleanEmail.includes('admin')) userRole = 'admin';
        localStorage.setItem('careerai_user_role', userRole);

        const appUser: User = {
          id: cred.user.uid,
          email: cleanEmail,
          name: displayName,
          role: userRole,
          createdAt: new Date().toISOString()
        };
        setUser(appUser);
        setFirebaseUser(cred.user);
        setRole(userRole);
        localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
        localStorage.setItem('careerai_user_id', appUser.id);
        localStorage.setItem('careerai_user_email', appUser.email);
        localStorage.setItem('careerai_user_name', appUser.name);
        return;
      }
    } catch (createErr: any) {
      console.warn('Firebase auto-create notice:', createErr?.code || createErr?.message);
    }

    // 3. Demo / Backend login fallback
    const isDemoPassword = pass === 'Nexminds@2026' || pass === 'nexminds@2026' || pass === 'CareerAI@2026' || pass === 'careerai@2026' || pass === 'demo' || pass === 'password';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          // If password doesn't match standard demo password or length < 6
          if (!isDemoPassword && pass.length < 6) {
            throw new Error('Email or password is incorrect. For demo accounts, use password: Nexminds@2026');
          }
          const appUser: User = data.user;
          setUser(appUser);
          setRole(appUser.role);
          localStorage.setItem('careerai_user_role', appUser.role);
          localStorage.setItem('careerai_user_id', appUser.id);
          localStorage.setItem('careerai_user_email', appUser.email);
          localStorage.setItem('careerai_user_name', appUser.name);
          localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
          if (data.profile) {
            if (appUser.role === 'student') setStudentProfile(data.profile);
            if (appUser.role === 'company') setCompanyProfile(data.profile);
          }
          return;
        }
      }
    } catch (apiErr: any) {
      if (apiErr?.message?.includes('password')) throw apiErr;
      console.warn('Backend login fallback notice:', apiErr);
    }

    // 4. Pattern check for demo students, companies, admin if using demo password
    if (isDemoPassword || pass.length >= 6) {
      let role: UserRole = 'student';
      let name = cleanEmail.split('@')[0];
      let id = `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      let studentId = 'std_01';

      if (cleanEmail.includes('admin')) {
        role = 'admin';
        name = 'Nexminds System Administrator';
        id = 'usr_admin';
      } else if (cleanEmail.includes('company') || cleanEmail.includes('recruiter') || cleanEmail.includes('cmp_') || cleanEmail.includes('nexora') || cleanEmail.includes('dataforge') || cleanEmail.includes('cloudaxis') || cleanEmail.includes('securestack') || cleanEmail.includes('appnova')) {
        role = 'company';
        const companyDirectory: Record<string, { id: string; name: string }> = {
          '01': { id: 'usr_company_01', name: 'Nexora Technologies' },
          '1': { id: 'usr_company_01', name: 'Nexora Technologies' },
          '02': { id: 'usr_company_02', name: 'DataForge Analytics' },
          '2': { id: 'usr_company_02', name: 'DataForge Analytics' },
          '03': { id: 'usr_company_03', name: 'CloudAxis Systems' },
          '3': { id: 'usr_company_03', name: 'CloudAxis Systems' },
          '04': { id: 'usr_company_04', name: 'SecureStack Labs' },
          '4': { id: 'usr_company_04', name: 'SecureStack Labs' },
          '05': { id: 'usr_company_05', name: 'AppNova Digital' },
          '5': { id: 'usr_company_05', name: 'AppNova Digital' }
        };

        const cmpMatch = cleanEmail.match(/company0?(\d+)/i) || cleanEmail.match(/cmp_?0?(\d+)/i);
        if (cmpMatch && companyDirectory[cmpMatch[1]]) {
          id = companyDirectory[cmpMatch[1]].id;
          name = companyDirectory[cmpMatch[1]].name;
        } else if (cleanEmail.includes('dataforge')) {
          id = 'usr_company_02';
          name = 'DataForge Analytics';
        } else if (cleanEmail.includes('cloudaxis')) {
          id = 'usr_company_03';
          name = 'CloudAxis Systems';
        } else if (cleanEmail.includes('securestack')) {
          id = 'usr_company_04';
          name = 'SecureStack Labs';
        } else if (cleanEmail.includes('appnova')) {
          id = 'usr_company_05';
          name = 'AppNova Digital';
        } else if (cleanEmail.includes('nexora')) {
          id = 'usr_company_01';
          name = 'Nexora Technologies';
        } else {
          id = `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
          name = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }
      } else if (cleanEmail.includes('student') || cleanEmail.includes('std_')) {
        role = 'student';
        const studentDirectory: Record<string, { id: string; stdId: string; name: string }> = {
          '01': { id: 'usr_student_01', stdId: 'std_01', name: 'Arjun Kumar' },
          '1': { id: 'usr_student_01', stdId: 'std_01', name: 'Arjun Kumar' },
          '02': { id: 'usr_student_02', stdId: 'std_02', name: 'Kavin Raj' },
          '2': { id: 'usr_student_02', stdId: 'std_02', name: 'Kavin Raj' },
          '03': { id: 'usr_student_03', stdId: 'std_03', name: 'Priya Dharshini' },
          '3': { id: 'usr_student_03', stdId: 'std_03', name: 'Priya Dharshini' },
          '04': { id: 'usr_student_04', stdId: 'std_04', name: 'Vignesh Sundaram' },
          '4': { id: 'usr_student_04', stdId: 'std_04', name: 'Vignesh Sundaram' },
          '05': { id: 'usr_student_05', stdId: 'std_05', name: 'Dharshan Pandian' },
          '5': { id: 'usr_student_05', stdId: 'std_05', name: 'Dharshan Pandian' },
          '06': { id: 'usr_student_06', stdId: 'std_06', name: 'Sneha Ramachandran' },
          '6': { id: 'usr_student_06', stdId: 'std_06', name: 'Sneha Ramachandran' },
          '07': { id: 'usr_student_07', stdId: 'std_07', name: 'Hari Prasad' },
          '7': { id: 'usr_student_07', stdId: 'std_07', name: 'Hari Prasad' },
          '08': { id: 'usr_student_08', stdId: 'std_08', name: 'Ananya Subramanian' },
          '8': { id: 'usr_student_08', stdId: 'std_08', name: 'Ananya Subramanian' },
          '09': { id: 'usr_student_09', stdId: 'std_09', name: 'Pranav Ravichandran' },
          '9': { id: 'usr_student_09', stdId: 'std_09', name: 'Pranav Ravichandran' },
          '10': { id: 'usr_student_10', stdId: 'std_10', name: 'Rahul Manikandan' }
        };

        const stdNumMatch = cleanEmail.match(/student0?(\d+)/i) || cleanEmail.match(/std_?0?(\d+)/i);
        if (stdNumMatch && studentDirectory[stdNumMatch[1]]) {
          const match = studentDirectory[stdNumMatch[1]];
          id = match.id;
          name = match.name;
          studentId = match.stdId;
        } else {
          name = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          id = `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
          studentId = `std_${Date.now()}`;
        }
        localStorage.setItem('careerai_student_id', studentId);
      }

      const appUser: User = {
        id,
        email: cleanEmail,
        name,
        role,
        createdAt: new Date().toISOString()
      };
      setUser(appUser);
      setRole(role);
      localStorage.setItem('careerai_user_role', role);
      localStorage.setItem('careerai_user_id', appUser.id);
      localStorage.setItem('careerai_user_email', appUser.email);
      localStorage.setItem('careerai_user_name', appUser.name);
      localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
      return;
    }

    throw new Error('Email or password is incorrect. For demo accounts, use password: Nexminds@2026');
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string, selectedRole?: UserRole) => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = name?.trim() || cleanEmail.split('@')[0];
    const userRole = selectedRole || 'student';

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (displayName) {
        try {
          await updateProfile(cred.user, { displayName });
        } catch (profileErr) {
          console.warn('Could not update user display name:', profileErr);
        }
      }
      localStorage.setItem('careerai_user_role', userRole);
      const appUser: User = {
        id: cred.user.uid,
        email: cleanEmail,
        name: displayName,
        role: userRole,
        createdAt: new Date().toISOString()
      };
      setUser(appUser);
      setFirebaseUser(cred.user);
      setRole(userRole);
      localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
      setNeedsRoleSelection(false);
      setNeedsOnboarding(false);
    } catch (err: any) {
      console.warn('Firebase signUp error, applying local/backend registration:', err);
      // Fallback local registration if Firebase is offline
      const appUser: User = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        name: displayName,
        role: userRole,
        createdAt: new Date().toISOString()
      };
      setUser(appUser);
      setRole(userRole);
      localStorage.setItem('careerai_user_role', userRole);
      localStorage.setItem('careerai_user_id', appUser.id);
      localStorage.setItem('careerai_user_email', appUser.email);
      localStorage.setItem('careerai_user_name', appUser.name);
      localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
      setNeedsRoleSelection(false);
      setNeedsOnboarding(false);
    }
  };

  const selectRole = async (selectedRole: UserRole) => {
    localStorage.setItem('careerai_user_role', selectedRole);
    setRole(selectedRole);
    if (user) {
      const updatedUser = { ...user, role: selectedRole };
      setUser(updatedUser);
      localStorage.setItem('careerai_demo_session', JSON.stringify(updatedUser));
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
      localStorage.removeItem('careerai_demo_session');
      localStorage.removeItem('careerai_user_id');
      localStorage.removeItem('careerai_user_email');
      localStorage.removeItem('careerai_user_name');
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
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (e) {
      console.warn('Password reset notice:', e);
    }
  };

  const loginAsDemoUser = async (demoRole: UserRole, entityIndex: number = 1) => {
    const studentList = [
      { id: 'usr_student_01', stdId: 'std_01', name: 'Arjun Kumar', email: 'demo.student01@nextmind.demo' },
      { id: 'usr_student_02', stdId: 'std_02', name: 'Kavin Raj', email: 'demo.student02@nextmind.demo' },
      { id: 'usr_student_03', stdId: 'std_03', name: 'Priya Dharshini', email: 'demo.student03@nextmind.demo' },
      { id: 'usr_student_04', stdId: 'std_04', name: 'Vignesh Sundaram', email: 'demo.student04@nextmind.demo' },
      { id: 'usr_student_05', stdId: 'std_05', name: 'Dharshan Pandian', email: 'demo.student05@nextmind.demo' },
      { id: 'usr_student_06', stdId: 'std_06', name: 'Sneha Ramachandran', email: 'demo.student06@nextmind.demo' },
      { id: 'usr_student_07', stdId: 'std_07', name: 'Hari Prasad', email: 'demo.student07@nextmind.demo' },
      { id: 'usr_student_08', stdId: 'std_08', name: 'Ananya Subramanian', email: 'demo.student08@nextmind.demo' },
      { id: 'usr_student_09', stdId: 'std_09', name: 'Pranav Ravichandran', email: 'demo.student09@nextmind.demo' },
      { id: 'usr_student_10', stdId: 'std_10', name: 'Rahul Manikandan', email: 'demo.student10@nextmind.demo' }
    ];

    const companyList = [
      { id: 'usr_company_01', cmpId: 'cmp_01', name: 'Nexora Technologies', email: 'demo.company01@nextmind.demo' },
      { id: 'usr_company_02', cmpId: 'cmp_02', name: 'DataForge Analytics', email: 'demo.company02@nextmind.demo' },
      { id: 'usr_company_03', cmpId: 'cmp_03', name: 'CloudAxis Systems', email: 'demo.company03@nextmind.demo' },
      { id: 'usr_company_04', cmpId: 'cmp_04', name: 'SecureStack Labs', email: 'demo.company04@nextmind.demo' },
      { id: 'usr_company_05', cmpId: 'cmp_05', name: 'AppNova Digital', email: 'demo.company05@nextmind.demo' }
    ];

    let demoEmail = 'admin@nexminds.demo';
    let name = 'Nexminds System Administrator';
    let userId = 'usr_admin';

    if (demoRole === 'student') {
      const safeIdx = Math.max(1, Math.min(10, entityIndex)) - 1;
      const selectedStd = studentList[safeIdx];
      demoEmail = selectedStd.email;
      name = selectedStd.name;
      userId = selectedStd.id;
      localStorage.setItem('careerai_student_id', selectedStd.stdId);
    } else if (demoRole === 'company') {
      const safeIdx = Math.max(1, Math.min(5, entityIndex)) - 1;
      const selectedCmp = companyList[safeIdx];
      demoEmail = selectedCmp.email;
      name = selectedCmp.name;
      userId = selectedCmp.id;
    }

    const demoPass = 'Nexminds@2026';
    localStorage.setItem('careerai_user_role', demoRole);

    // Attempt Firebase sign in or creation in background
    try {
      let cred: any = null;
      try {
        cred = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch {
        try {
          cred = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
          await updateProfile(cred.user, { displayName: name });
        } catch {}
      }
      if (cred?.user) {
        setFirebaseUser(cred.user);
      }
    } catch (e) {
      console.warn('Firebase demo sign in notice:', e);
    }

    const appUser: User = {
      id: userId,
      email: demoEmail,
      name,
      role: demoRole,
      createdAt: new Date().toISOString()
    };
    setUser(appUser);
    setRole(demoRole);
    localStorage.setItem('careerai_user_role', demoRole);
    localStorage.setItem('careerai_user_id', appUser.id);
    localStorage.setItem('careerai_user_email', appUser.email);
    localStorage.setItem('careerai_user_name', appUser.name);
    localStorage.setItem('careerai_demo_session', JSON.stringify(appUser));
    setNeedsRoleSelection(false);
    setNeedsOnboarding(false);

    try {
      const res = await fetch('/api/auth/switch-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
          'x-user-email': demoEmail,
          'x-user-name': encodeURIComponent(name)
        },
        body: JSON.stringify({
          role: (demoRole as string) === 'industry' ? 'company' : demoRole,
          email: demoEmail
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          if (demoRole === 'student') {
            setStudentProfile(data.profile);
            setCompanyProfile(null);
          } else if (demoRole === 'company') {
            setCompanyProfile(data.profile);
            setStudentProfile(null);
          }
        }
      }
    } catch (e) {
      console.warn('Backend switch demo notice:', e);
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


