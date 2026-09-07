import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

interface AccessDeniedScreenProps {
  currentRole: UserRole;
  attemptedArea: string;
  onReturnToDashboard: () => void;
  onSignOut: () => void;
}

export const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({
  currentRole,
  attemptedArea,
  onReturnToDashboard,
  onSignOut
}) => {
  const roleDisplay = currentRole === 'admin' ? 'Administrator' : currentRole === 'company' ? 'Company Recruiter' : 'Student';
  const dashboardName = currentRole === 'admin' ? 'Admin Dashboard' : currentRole === 'company' ? 'Company Dashboard' : 'Student Dashboard';

  return (
    <div id="access-denied-screen" className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-slate-800/90 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Access Denied
        </h1>

        <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-slate-300 leading-relaxed">
            You are signed in as a <span className="font-semibold text-red-300 capitalize">{roleDisplay}</span>.
          </p>
          <p className="text-sm text-slate-400 mt-1">
            This area (<code className="text-xs bg-slate-900 px-2 py-0.5 rounded text-red-300">{attemptedArea}</code>) is available only to authorized users.
          </p>
        </div>

        <div className="space-y-3">
          <button
            id="btn-return-authorized-dashboard"
            onClick={onReturnToDashboard}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to {dashboardName}
          </button>

          <button
            id="btn-access-denied-signout"
            onClick={onSignOut}
            className="w-full py-3 px-4 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-600/50"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="mt-6 text-xs text-slate-500 text-center">
          NextMind AI Strict Role-Based Access Enforcement
        </div>
      </motion.div>
    </div>
  );
};
