import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  Briefcase,
  Award,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

export const IndustryPortal: React.FC = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await api.getIndustryInsights();
      setInsights(data);
    } catch (err) {
      console.error('Failed to load industry insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = (insights?.topInDemandSkills || []).filter((s: any) => {
    if (searchQuery && !s.skill.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredDomains = (insights?.domainBreakdown || []).filter((d: any) => {
    if (filterDomain !== 'all' && d.domain !== filterDomain) return false;
    return true;
  });

  const domainsList = Array.from(new Set((insights?.domainBreakdown || []).map((d: any) => d.domain))) as string[];

  return (
    <div className="space-y-6" id="industry-portal-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Market Intelligence & Workforce Demographics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Industry Alliance Observatory
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time cross-company talent demand, skill deficit matrices, and workforce readiness benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            id="industry-refresh-btn"
            onClick={loadInsights}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {insights && (
        <div className="space-y-6">
          {/* Top Level Benchmark Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs" id="kpi-open-roles">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Open Positions</span>
                <Briefcase className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{insights.summary.totalJobs}</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Across 5 Verified Employers</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs" id="kpi-partner-corps">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Hiring Partners</span>
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{insights.summary.totalCompanies}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">100% Industry Verified</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs" id="kpi-candidate-pool">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Candidate Pipeline</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{insights.summary.totalCandidates}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Assessed Students</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs" id="kpi-readiness-index">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Market Readiness</span>
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{insights.summary.marketReadinessScore}%</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Above Target Index</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs col-span-2 sm:col-span-1" id="kpi-credential-rate">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Evidence Verification</span>
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{insights.summary.verifiedCredentialRate}%</div>
              <p className="text-[11px] text-purple-600 font-medium mt-0.5">Proof-Backed Profiles</p>
            </div>
          </div>

          {/* Emerging Technologies Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Priority Hiring Technologies</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Fastest-growing technical competencies required across published enterprise positions.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(insights.topEmergingSkills || []).map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-white text-xs font-medium tracking-wide flex items-center gap-1"
                  >
                    <span>{skill}</span>
                    <ArrowUpRight className="w-3 h-3 text-indigo-300" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Demand vs Supply Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="skill-matrix-section">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Talent Demand vs Supply Matrix</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between job requirements and verified student capabilities across all registered profiles.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="skill-search-input"
                  type="text"
                  placeholder="Filter skill matrix..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-medium">
                    <th className="py-3 px-4">Skill Name</th>
                    <th className="py-3 px-4 text-center">Required (Jobs)</th>
                    <th className="py-3 px-4 text-center">Preferred (Jobs)</th>
                    <th className="py-3 px-4 text-center">Talent Supply</th>
                    <th className="py-3 px-4">Market Coverage</th>
                    <th className="py-3 px-4 text-right">Deficit Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSkills.map((row: any) => (
                    <tr key={row.skill} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        {row.skill}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-800">
                        {row.requiredInJobs}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500">
                        {row.preferredInJobs}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {row.talentSupplyCount} Candidates
                        </span>
                      </td>
                      <td className="py-3 px-4 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                row.readinessCoverage >= 80 ? 'bg-emerald-500' : row.readinessCoverage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(12, row.readinessCoverage))}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-600 w-9 text-right">
                            {row.readinessCoverage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {row.deficit > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>+{row.deficit} Needed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Covered</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Domain Readiness & Openings */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5" id="domain-readiness-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Career Domain Readiness & Compensation</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Industry salary benchmarks, growth projections, and average candidate readiness by career track.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterDomain('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filterDomain === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Domains
                </button>
                {domainsList.map(domain => (
                  <button
                    key={domain}
                    onClick={() => setFilterDomain(domain)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      filterDomain === domain
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDomains.map((d: any) => (
                <div
                  key={d.careerTitle}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 transition-all bg-slate-50/50 hover:bg-white shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                        {d.domain}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{d.careerTitle}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {d.growthRate}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Average Salary:</span>
                      <span className="font-semibold text-slate-800">{d.avgSalary}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Active Postings:</span>
                      <span className="font-semibold text-slate-800">{d.activeOpenings} openings</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Candidate Pool:</span>
                      <span className="font-semibold text-slate-800">{d.candidatePoolCount} students</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">Pool Readiness:</span>
                      <span className="font-bold text-slate-900">{d.averageReadiness}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${Math.max(10, d.averageReadiness)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
