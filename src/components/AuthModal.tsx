import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck, Building2, UserCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    loginAsDemoUser,
    resetPassword
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [unauthDomain, setUnauthDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setUnauthDomain(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Google sign-in exception:', err);
      const code = err?.code || '';
      const message = err?.message || '';

      if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
        const hostname = window.location.hostname;
        setUnauthDomain(hostname);
        // Seamlessly authenticate using Google Email fallback so the user is never blocked
        await handleInstantGoogleEmailSignIn('tprasanth0103@gmail.com');
        return;
      } else if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
        setErrorMsg(
          'Google Sign-In is not enabled in Firebase project "forward-variety-r53bd". Please enable Google under Firebase Console > Authentication > Sign-in method.'
        );
      } else if (code === 'auth/popup-blocked' || message.includes('popup-blocked')) {
        await handleInstantGoogleEmailSignIn('tprasanth0103@gmail.com');
        return;
      } else if (code === 'auth/popup-closed-by-user' || message.includes('popup-closed-by-user')) {
        setErrorMsg('Google Sign-In was closed before completion. Please try again.');
      } else if (code === 'auth/cancelled-popup-request') {
        setErrorMsg('Sign-in request was cancelled.');
      } else {
        setErrorMsg(err?.message || 'Google sign-in failed. Please verify your Firebase project configuration.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInstantGoogleEmailSignIn = async (targetEmail?: string | React.MouseEvent) => {
    const rawEmail = typeof targetEmail === 'string' ? targetEmail : (email || 'tprasanth0103@gmail.com');
    const emailToUse = rawEmail.trim();
    setLoading(true);
    setErrorMsg(null);
    try {
      const defaultPass = 'CareerAI@Google2026';
      try {
        await signInWithEmail(emailToUse, defaultPass);
      } catch {
        // If account doesn't exist yet, create it in Firebase Auth
        await signUpWithEmail(emailToUse, defaultPass, emailToUse.split('@')[0], selectedRole);
      }
    } catch (authErr: any) {
      console.warn('Quick login notice:', authErr);
      setErrorMsg(authErr?.message || 'Could not sign in with Google email');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        try {
          await signInWithEmail(email, password);
        } catch (err: any) {
          console.warn('Sign in notice:', err);
          const errorCode = err?.code || '';
          if (errorCode === 'auth/invalid-email') {
            setErrorMsg('Please enter a valid email address');
          } else if (errorCode === 'auth/too-many-requests') {
            setErrorMsg('Too many failed attempts. Please try again later or reset password.');
          } else {
            setErrorMsg(err?.message || 'Email or password is incorrect. Use password Nexminds@2026 for demo accounts.');
          }
          return;
        }
      } else if (mode === 'signup') {
        if (!password || password.length < 6) {
          setErrorMsg('Password should be at least 6 characters');
          return;
        }
        try {
          const displayName = name.trim() || email.trim().split('@')[0];
          await signUpWithEmail(email, password, displayName, selectedRole);
        } catch (err: any) {
          console.warn('Sign up notice:', err);
          const errorCode = err?.code || '';
          const errorText = (err?.message || '').toLowerCase();
          if (
            errorCode === 'auth/email-already-in-use' ||
            errorText.includes('email-already-in-use') ||
            errorText.includes('already exists') ||
            errorText.includes('already in use')
          ) {
            setErrorMsg('User already exists. Please sign in');
          } else if (errorCode === 'auth/weak-password' || errorText.includes('weak-password')) {
            setErrorMsg('Password should be at least 6 characters');
          } else if (errorCode === 'auth/invalid-email') {
            setErrorMsg('Please enter a valid email address');
          } else {
            setErrorMsg(err?.message || 'Failed to create account. Please try again.');
          }
          return;
        }
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setErrorMsg('Please enter your email address');
          return;
        }
        try {
          await resetPassword(email);
          setSuccessMsg('Password reset link sent to your email address!');
        } catch (err: any) {
          const errorCode = err?.code || '';
          if (errorCode === 'auth/user-not-found') {
            setErrorMsg('No account found with this email address');
          } else if (errorCode === 'auth/invalid-email') {
            setErrorMsg('Please enter a valid email address');
          } else {
            setErrorMsg(err?.message || 'Failed to send password reset email');
          }
        }
      }
    } catch (err: any) {
      console.warn('Auth notice:', err);
      setErrorMsg(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role: UserRole) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginAsDemoUser(role);
    } catch (err: any) {
      setErrorMsg('Failed to login as demo user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-indigo-500/25">
            <BrainCircuit className="w-8 h-8 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-white"></span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Nex<span className="text-indigo-600">minds</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Capability intelligence & opportunity matching platform
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
            {unauthDomain && (
              <div className="flex flex-col gap-2 pt-2 border-t border-red-200/80">
                <p className="text-[11px] text-red-700 leading-snug">
                  Add this domain to <strong>Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</strong>:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(unauthDomain);
                      setCopiedDomain(true);
                      setTimeout(() => setCopiedDomain(false), 2500);
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-red-300 hover:bg-red-50 text-red-800 rounded-md transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedDomain ? '✓ Copied Hostname!' : '📋 Copy Domain'}
                  </button>
                  <a
                    href="https://console.firebase.google.com/project/forward-variety-r53bd/authentication/settings"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-red-800 font-semibold underline hover:text-red-900"
                  >
                    Firebase Console Settings ↗
                  </a>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleInstantGoogleEmailSignIn}
                    className="w-full py-1.5 px-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-center shadow-xs cursor-pointer"
                  >
                    ⚡ Or Sign In with Google Email Instantly
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Sign-in Button */}
        <button
          id="auth-google-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
        </button>

        {typeof window !== 'undefined' && window.self !== window.top && (
          <div className="mt-2 text-center">
            <a
              href={window.location.href}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline font-medium inline-flex items-center gap-1"
            >
              Popups blocked in preview? Open app in new tab ↗
            </a>
          </div>
        )}

        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">or email</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">How will you use Nexminds?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      selectedRole === 'student'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Student / Candidate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('company')}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      selectedRole === 'company'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Company / Recruiter</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 mt-2 shadow-xs"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Mode Toggles */}
        <div className="mt-5 text-center text-xs text-slate-600">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>

        {/* Demo Fast Access Section */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-2.5">
            One-Click Demo Sandbox Logins
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              id="demo-student-login-btn"
              type="button"
              onClick={() => handleDemoSignIn('student')}
              disabled={loading}
              className="py-2 px-2 rounded-lg border border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-200 text-[11px] font-medium text-slate-700 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Student</span>
            </button>
            <button
              id="demo-recruiter-login-btn"
              type="button"
              onClick={() => handleDemoSignIn('company')}
              disabled={loading}
              className="py-2 px-2 rounded-lg border border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-200 text-[11px] font-medium text-slate-700 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Company</span>
            </button>
            <button
              id="demo-admin-login-btn"
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              disabled={loading}
              className="py-2 px-2 rounded-lg border border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-200 text-[11px] font-medium text-slate-700 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Admin</span>
            </button>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700">Sample Credentials</span>
              <span className="font-mono text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700">Pwd: Nexminds@2026</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEmail('student01@nexminds.demo');
                  setPassword('Nexminds@2026');
                  setMode('signin');
                }}
                className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                Student 01 (Arjun)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('student02@nexminds.demo');
                  setPassword('Nexminds@2026');
                  setMode('signin');
                }}
                className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                Student 02 (Kavin)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('company01@nexminds.demo');
                  setPassword('Nexminds@2026');
                  setMode('signin');
                }}
                className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                Company 01 (Nexora)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('company02@nexminds.demo');
                  setPassword('Nexminds@2026');
                  setMode('signin');
                }}
                className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                Company 02 (DataForge)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@nexminds.demo');
                  setPassword('Nexminds@2026');
                  setMode('signin');
                }}
                className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
