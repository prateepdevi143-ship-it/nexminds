import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Database
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

export const AdminPortal: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System Administration
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor platform metrics, evidence verification volume, and architectural status.
          </p>
        </div>

        <button
          onClick={loadMetrics}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {metrics && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Students</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.totalStudents}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Active profiles</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Companies</span>
              <div className="text-xl font-bold text-indigo-600 mt-1">{metrics.totalCompanies}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Verified recruiters</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Open Jobs</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.totalJobs}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Requisitions</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Applications</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.totalApplications}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Pipeline volume</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Evidences</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">{metrics.totalEvidences}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Verified proof</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Avg Readiness</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.avgReadinessScore}%</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Platform average</p>
            </div>
          </div>

          {/* System Architecture & Pillar Status */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              Four-Layer Architectural Compliance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Layer 1: UI</span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-500">React + Tailwind CSS with responsive layout</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Layer 2: Auth / Data</span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-500">State mutations, RBAC roles, and persistent models</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Layer 3: Algorithms</span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-500">Deterministic skill gap, one-skill-away, ranking</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Layer 4: AI Engine</span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-500">Server-side intelligence with rule fallbacks</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
