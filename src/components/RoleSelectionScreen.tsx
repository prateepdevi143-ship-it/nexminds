import React, { useState } from 'react';
import { Sparkles, BrainCircuit, UserCheck, Building2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const RoleSelectionScreen: React.FC = () => {
  const { firebaseUser, selectRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await selectRole(selectedRole);
    } catch (err) {
      console.error('Failed to select role', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-indigo-500/25">
            <BrainCircuit className="w-8 h-8 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-white"></span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Nex<span className="text-indigo-600">minds</span>, {firebaseUser?.displayName || 'there'}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            How will you use the platform? Choose your primary role:
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {/* Student Role */}
          <div
            onClick={() => setSelectedRole('student')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
              selectedRole === 'student'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">Student / Candidate</span>
                {selectedRole === 'student' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Build your verified skill graph, analyze your resume, get matched to high-fit job opportunities, and receive AI career coaching.
              </p>
            </div>
          </div>

          {/* Company Role */}
          <div
            onClick={() => setSelectedRole('company')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
              selectedRole === 'company'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">Company / Recruiter</span>
                {selectedRole === 'company' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Publish positions, calibrate required skill benchmarks, and review candidates ranked algorithmically by verified evidence.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
        >
          <span>{submitting ? 'Setting up...' : 'Continue to Onboarding'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
