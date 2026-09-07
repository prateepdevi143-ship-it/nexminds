import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Database,
  Users,
  Building2,
  Briefcase,
  Award,
  Clock,
  TrendingUp,
  Search,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { CertifiedInternshipsAdmin } from './CertifiedInternshipsAdmin';
import { IndustryPortal } from './IndustryPortal';
import { Student, Company, Job, Application } from '../types';

interface AdminPortalProps {
  initialTab?: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [metrics, setMetrics] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [m, s, c, j, a] = await Promise.all([
        api.getAdminMetrics().catch(() => null),
        api.getStudents().catch(() => []),
        api.getCompanies().catch(() => []),
        api.getJobs().catch(() => []),
        api.getApplications().catch(() => [])
      ]);
      setMetrics(m);
      setStudents(s);
      setCompanies(c);
      setJobs(j);
      setApplications(a);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const query = (searchQuery || '').toLowerCase();
  const filteredStudents = students.filter(s =>
    (s.name || '').toLowerCase().includes(query) ||
    (s.college || '').toLowerCase().includes(query) ||
    (s.careerGoal || '').toLowerCase().includes(query)
  );

  const filteredCompanies = companies.filter(c =>
    (c.name || '').toLowerCase().includes(query) ||
    (c.industry || '').toLowerCase().includes(query) ||
    (c.location || '').toLowerCase().includes(query)
  );

  const filteredJobs = jobs.filter(j =>
    (j.title || '').toLowerCase().includes(query) ||
    ((j as any).company || (j as any).companyName || '').toLowerCase().includes(query) ||
    (j.domain || '').toLowerCase().includes(query)
  );

  return (
    <div className="space-y-6" id="admin-portal-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Platform Administration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Governance & Accreditation
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage student cohorts, accredited company partners, certified internship credentials, and system intelligence.
          </p>
        </div>

        <button
          onClick={loadAllAdminData}
          disabled={loading}
          className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh System Data</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          id="admin-tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Platform Overview</span>
        </button>

        <button
          id="admin-tab-certified-internships"
          onClick={() => setActiveTab('certified-internships')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'certified-internships'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certified Internships</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            Major Feature
          </span>
        </button>

        <button
          id="admin-tab-students"
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Students ({students.length})</span>
        </button>

        <button
          id="admin-tab-companies"
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'companies'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Companies ({companies.length})</span>
        </button>

        <button
          id="admin-tab-opportunities"
          onClick={() => setActiveTab('opportunities')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'opportunities'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Opportunities ({jobs.length})</span>
        </button>

        <button
          id="admin-tab-industry-insights"
          onClick={() => setActiveTab('industry-insights')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'industry-insights'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Industry Insights</span>
        </button>
      </div>

      {/* Tab Content: Certified Internships */}
      {activeTab === 'certified-internships' && (
        <div>
          <CertifiedInternshipsAdmin />
        </div>
      )}

      {/* Tab Content: Industry Insights */}
      {activeTab === 'industry-insights' && (
        <div>
          <IndustryPortal />
        </div>
      )}

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Students</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.totalStudents || students.length}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Active profiles</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Companies</span>
              <div className="text-xl font-bold text-indigo-600 mt-1">{metrics.totalCompanies || companies.length}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Verified recruiters</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Open Jobs</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.totalJobs || jobs.length}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Requisitions</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Applications</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.totalApplications || applications.length}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Pipeline volume</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Evidences</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">{metrics.totalEvidences || 12}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Verified proof</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Avg Readiness</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{metrics.avgReadinessScore || 78}%</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Platform average</p>
            </div>
          </div>

          {/* Quick Actions to Admin Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-900 to-indigo-950 text-white shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 uppercase">
                  Flagship Feature
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Certified Internships Management</h3>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                  Oversee certified programs, review applicants, evaluate completed coursework, and issue tamper-proof NextMind AI digital certificates.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('certified-internships')}
                className="mt-4 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white text-indigo-950 hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 self-start cursor-pointer"
              >
                <span>Launch Internship Management</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase">
                  Analytics & Intelligence
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Industry Intelligence Engine</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Real-time market analytics, domain-specific skill demand curves, and emerging technology adoption rates across tech sectors.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('industry-insights')}
                className="mt-4 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors inline-flex items-center gap-1.5 self-start cursor-pointer"
              >
                <span>View Industry Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
                <p className="text-[11px] text-slate-500">React + Tailwind CSS with responsive design and route guarding</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Layer 2: Auth / Data</span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-500">Strict RBAC verification (Student / Company / Admin) & Firebase rules</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Layer 3: Algorithms</span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-500">Deterministic skill gap, one-skill-away, ranking & internship alignment</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Layer 4: AI Engine</span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-500">Server-side intelligence with rule fallbacks & ATS diagnostic parser</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Students */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search students by name, college, career..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
            <span className="text-xs text-slate-500">{filteredStudents.length} students found</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Institution</th>
                    <th className="p-3.5">Target Career</th>
                    <th className="p-3.5">Verified Skills</th>
                    <th className="p-3.5">Readiness Score</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {student.college} (Class of {student.graduationYear})
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">
                        {student.careerGoal || 'Software Engineer'}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-100">
                          {student.skills?.length || 0} skills
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${student.careerReadinessScore || 70}%` }}
                            />
                          </div>
                          <span>{student.careerReadinessScore || 70}%</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Companies */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search companies by name, domain, location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
            <span className="text-xs text-slate-500">{filteredCompanies.length} companies registered</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3.5">Company Name</th>
                    <th className="p-3.5">Industry Sector</th>
                    <th className="p-3.5">Size</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompanies.map(company => (
                    <tr key={company.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{company.name}</div>
                        <div className="text-[11px] text-slate-400">{company.website || 'https://nexminds.dev'}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">
                        {company.industry}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {company.size}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {company.location}
                      </td>
                      <td className="p-3.5">
                        {company.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Verified Partner
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium text-[11px]">
                          Authorized Recruiter
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search job & internship requisitions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
            <span className="text-xs text-slate-500">{filteredJobs.length} requisitions active</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3.5">Role / Requisition</th>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5">Domain</th>
                    <th className="p-3.5">Applicants</th>
                    <th className="p-3.5">Required Skills</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{job.title}</div>
                        <div className="text-[11px] text-slate-400">{job.type} • {job.workMode}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">
                        {job.company}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {job.domain}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {job.applicantCount || 0}
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {job.requiredSkills?.slice(0, 3).map(skill => (
                            <span key={skill} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
