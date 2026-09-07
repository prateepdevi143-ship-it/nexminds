import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Calendar,
  Users,
  Plus,
  Edit2,
  Eye,
  Check,
  X,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CertifiedInternship, InternshipApplication, CertificateRecord } from '../types';
import { api } from '../services/api';

export const CertifiedInternshipsAdmin: React.FC = () => {
  const [internships, setInternships] = useState<CertifiedInternship[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'programs' | 'applications'>('programs');
  const [selectedInternship, setSelectedInternship] = useState<CertifiedInternship | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState<CertifiedInternship | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDomain, setFormDomain] = useState('AI/ML');
  const [formDuration, setFormDuration] = useState('8 Weeks');
  const [formSeats, setFormSeats] = useState(50);
  const [formWorkMode, setFormWorkMode] = useState<'Online' | 'Remote' | 'Hybrid'>('Online');
  const [formSkills, setFormSkills] = useState('Python, Machine Learning, Git');
  const [formDesc, setFormDesc] = useState('');
  const [formDeadline, setFormDeadline] = useState('2026-10-15');
  const [formStatus, setFormStatus] = useState<'PUBLISHED' | 'DRAFT' | 'REVIEW' | 'CLOSED'>('PUBLISHED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [internshipsData, appsData, analyticsData] = await Promise.all([
        api.getCertifiedInternships().catch(() => []),
        api.getCertifiedInternshipApplications().catch(() => []),
        api.getCertifiedInternshipsAnalytics().catch(() => null)
      ]);
      setInternships(internshipsData || []);
      setApplications(appsData || []);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load admin certified internships data', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (internship: CertifiedInternship) => {
    const nextStatus = internship.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.updateCertifiedInternship(internship.id, { status: nextStatus });
      await loadAdminData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCloseApplications = async (internship: CertifiedInternship) => {
    try {
      await api.updateCertifiedInternship(internship.id, { status: 'CLOSED' });
      await loadAdminData();
    } catch (err) {
      alert('Failed to close applications');
    }
  };

  const handleUpdateAppStatus = async (appId: string, nextStatus: string, score: number = 92) => {
    try {
      await api.updateCertifiedInternshipAppStatus(appId, nextStatus, score);
      await loadAdminData();
    } catch (err) {
      alert('Failed to update student application status');
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const skillsArray = formSkills.split(',').map(s => s.trim()).filter(Boolean);
      const payload: Partial<CertifiedInternship> = {
        title: formTitle,
        domain: formDomain,
        duration: formDuration,
        numberOfSeats: Number(formSeats),
        workMode: formWorkMode,
        skills: skillsArray,
        description: formDesc || `Industry-curated 8-week structured internship program in ${formDomain}.`,
        applicationDeadline: formDeadline,
        status: formStatus
      };

      if (editingInternship) {
        await api.updateCertifiedInternship(editingInternship.id, payload);
      } else {
        await api.createCertifiedInternship(payload);
      }
      setShowCreateModal(false);
      setEditingInternship(null);
      resetForm();
      await loadAdminData();
    } catch (err) {
      alert('Failed to save internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item: CertifiedInternship) => {
    setEditingInternship(item);
    setFormTitle(item.title);
    setFormDomain(item.domain);
    setFormDuration(item.duration);
    setFormSeats(item.numberOfSeats);
    setFormWorkMode(item.workMode as any);
    setFormSkills(item.skills.join(', '));
    setFormDesc(item.description);
    setFormDeadline(item.applicationDeadline);
    setFormStatus(item.status as any);
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDomain('AI/ML');
    setFormDuration('8 Weeks');
    setFormSeats(50);
    setFormWorkMode('Online');
    setFormSkills('Python, Machine Learning, Git');
    setFormDesc('');
    setFormDeadline('2026-10-15');
    setFormStatus('PUBLISHED');
  };

  const totalPublished = internships.filter(i => i.status === 'PUBLISHED').length;
  const totalDraft = internships.filter(i => i.status === 'DRAFT' || i.status === 'REVIEW').length;
  const totalClosed = internships.filter(i => i.status === 'CLOSED').length;
  const totalEnrolled = applications.filter(a => ['Accepted', 'In Progress', 'Completed', 'Certificate Issued'].includes(a.status)).length;
  const totalCertificatesIssued = applications.filter(a => a.status === 'Certificate Issued').length;

  return (
    <div id="certified-internships-admin-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" /> NextMind AI Platform Operations
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Certified Free Internships Administration</h1>
          <p className="text-xs text-slate-400 mt-1">Manage official certified curriculum, enrollment pipelines, and issue digital certificates</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              resetForm();
              setEditingInternship(null);
              setShowCreateModal(true);
            }}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Certified Internship
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Total Programs</span>
          <span className="text-xl font-bold text-white block mt-1">{internships.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-emerald-400 font-medium">Active (Published)</span>
          <span className="text-xl font-bold text-emerald-400 block mt-1">{totalPublished}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-amber-400 font-medium">Draft / Review</span>
          <span className="text-xl font-bold text-amber-400 block mt-1">{totalDraft}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Closed</span>
          <span className="text-xl font-bold text-slate-300 block mt-1">{totalClosed}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-indigo-400 font-medium">Students Enrolled</span>
          <span className="text-xl font-bold text-indigo-300 block mt-1">{totalEnrolled}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-teal-400 font-medium">Certificates Issued</span>
          <span className="text-xl font-bold text-teal-300 block mt-1">{totalCertificatesIssued}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('programs')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'programs'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Curriculum & Programs ({internships.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'applications'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Candidate Enrollment & Certifications ({applications.length})
        </button>
      </div>

      {/* Programs Tab Content */}
      {activeTab === 'programs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Internship Program</th>
                  <th className="p-4">Domain</th>
                  <th className="p-4">Duration & Mode</th>
                  <th className="p-4">Seats</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Enrolled / Certified</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {internships.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div>{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        Skills: {item.skills.slice(0, 3).join(', ')}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-medium text-[11px]">
                        {item.domain}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {item.duration} • {item.workMode}
                    </td>
                    <td className="p-4 font-mono font-medium">{item.numberOfSeats}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : item.status === 'CLOSED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      <span className="text-white font-semibold">{item.enrolledCount || 0}</span> enrolled •{' '}
                      <span className="text-teal-400 font-semibold">{item.certificatesIssuedCount || 0}</span> certs
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit Internship"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handlePublishToggle(item)}
                          title={item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.status === 'PUBLISHED'
                              ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                              : 'bg-amber-600/20 text-amber-300 hover:bg-amber-600/30'
                          }`}
                        >
                          {item.status === 'PUBLISHED' ? <Check className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        {item.status !== 'CLOSED' && (
                          <button
                            onClick={() => handleCloseApplications(item)}
                            title="Close Applications"
                            className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applications Tab Content */}
      {activeTab === 'applications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Review candidate progress and issue verified NextMind AI completion certificates</span>
            <span className="font-semibold text-emerald-400">{applications.length} Student Candidates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Student Candidate</th>
                  <th className="p-4">Internship Program</th>
                  <th className="p-4">Match Score</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Certificate ID</th>
                  <th className="p-4">Certification Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div>{app.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{app.studentEmail}</div>
                    </td>
                    <td className="p-4 text-indigo-300 font-medium">
                      {app.internshipTitle}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-400">{app.matchScore}%</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        app.status === 'Certificate Issued'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : app.status === 'Completed'
                          ? 'bg-blue-500/20 text-blue-300'
                          : app.status === 'In Progress'
                          ? 'bg-purple-500/20 text-purple-300'
                          : app.status === 'Accepted'
                          ? 'bg-teal-500/20 text-teal-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-emerald-400">
                      {app.certificateId || '—'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {app.status === 'Applied' && (
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'Accepted')}
                            className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                          >
                            Accept
                          </button>
                        )}
                        {app.status === 'Accepted' && (
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'In Progress')}
                            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                          >
                            Start
                          </button>
                        )}
                        {app.status === 'In Progress' && (
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'Completed')}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                          >
                            Complete
                          </button>
                        )}
                        {app.status === 'Completed' && (
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'Certificate Issued')}
                            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-600/20"
                          >
                            <Award className="w-3.5 h-3.5" /> Issue Certificate
                          </button>
                        )}
                        {app.status === 'Certificate Issued' && (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 max-w-xl w-full rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingInternship ? 'Edit Certified Internship' : 'Create New Certified Internship'}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Internship Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Python & AI Development Internship"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Domain</label>
                    <select
                      value={formDomain}
                      onChange={e => setFormDomain(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="AI/ML">AI/ML</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Java Backend">Java Backend</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Data Analytics">Data Analytics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                    <input
                      type="text"
                      value={formDuration}
                      onChange={e => setFormDuration(e.target.value)}
                      placeholder="e.g. 8 Weeks"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Total Seats</label>
                    <input
                      type="number"
                      value={formSeats}
                      onChange={e => setFormSeats(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Work Mode</label>
                    <select
                      value={formWorkMode}
                      onChange={e => setFormWorkMode(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Online">Online</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="REVIEW">REVIEW</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Skills (comma separated)</label>
                  <input
                    type="text"
                    value={formSkills}
                    onChange={e => setFormSkills(e.target.value)}
                    placeholder="Python, NumPy, Pandas, Machine Learning"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={e => setFormDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description & Overview</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    placeholder="Detailed program description, deliverables, and learning outcomes..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30"
                  >
                    {isSubmitting ? 'Saving...' : editingInternship ? 'Update Program' : 'Create Program'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
