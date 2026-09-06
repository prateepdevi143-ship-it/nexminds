import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  Building2,
  ShieldCheck,
  TrendingUp,
  Bell,
  RefreshCw,
  X,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Notification } from '../types';

interface NavbarProps {
  user: User | null;
  activeRole: 'student' | 'company' | 'admin';
  onSwitchRole: (role: 'student' | 'company' | 'admin') => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onResetSeed: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeRole,
  onSwitchRole,
  notifications,
  onMarkNotificationRead,
  onResetSeed,
  activeTab,
  onSelectTab,
  onSignOut
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [resetting, setResetting] = useState(false);

  const notifList = notifications || [];
  const unreadCount = notifList.filter(n => !n.read).length;

  const handleReset = async () => {
    if (confirm('Reset platform data back to initial demo state?')) {
      setResetting(true);
      await onResetSeed();
      setResetting(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => onSelectTab(activeRole === 'student' ? 'dashboard' : 'company-dashboard')}
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                CareerAI
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.5">
                Portal
              </span>
            </div>
          </div>
        </div>

        {/* Role Switcher & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persona Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200/80">
            <button
              id="nav-role-student"
              onClick={() => onSwitchRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeRole === 'student'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Student</span>
            </button>
            <button
              id="nav-role-company"
              onClick={() => onSwitchRole('company')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeRole === 'company'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Company</span>
            </button>
            <button
              id="nav-role-admin"
              onClick={() => onSwitchRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeRole === 'admin'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Reset Demo Button */}
          <button
            id="nav-reset-button"
            onClick={handleReset}
            disabled={resetting}
            title="Reset to default demo data"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="nav-notifications-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-lg p-4 z-50"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                    {notifList.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No notifications yet.</p>
                    ) : (
                      notifList.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onMarkNotificationRead(notif.id);
                            if (notif.link) {
                              if (notif.link.includes('applications')) onSelectTab('applications');
                              else if (notif.link.includes('skills-gap')) onSelectTab('skills-gap');
                              else if (notif.link.includes('resume')) onSelectTab('resume');
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                            notif.read
                              ? 'bg-white border-slate-100 text-slate-500'
                              : 'bg-indigo-50/60 border-indigo-100 text-slate-800 hover:bg-indigo-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900">{notif.title}</span>
                            {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1" />}
                          </div>
                          <p className="text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-2 block">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Info & Sign Out */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            {user && (
              <>
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-slate-900 leading-none truncate max-w-[120px]">{user.name}</p>
                  <p className="text-[11px] text-slate-500 capitalize mt-0.5">{user.role}</p>
                </div>
              </>
            )}
            {onSignOut && (
              <button
                id="nav-sign-out-btn"
                onClick={onSignOut}
                title="Sign Out"
                className="flex items-center gap-1.5 px-2.5 py-1.5 ml-1 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
