import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  FileCheck,
  Layers,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CertifiedInternship, InternshipApplication, CertificateRecord, Student } from '../types';
import { api } from '../services/api';

interface CertifiedInternshipsStudentProps {
  student: Student;
  onNavigateToAssessments?: (skill: string) => void;
  onViewCertificateVerification?: (certId: string) => void;
}

export const CertifiedInternshipsStudent: React.FC<CertifiedInternshipsStudentProps> = ({
  student,
  onNavigateToAssessments,
  onViewCertificateVerification
}) => {
  const [internships, setInternships] = useState<CertifiedInternship[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState<CertifiedInternship | null>(null);
  const [activeFilterDomain, setActiveFilterDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<CertificateRecord | null>(null);

  useEffect(() => {
    loadData();
  }, [student?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [internshipsData, appsData] = await Promise.all([
        api.getCertifiedInternships().catch(() => []),
        api.getCertifiedInternshipApplications().catch(() => [])
      ]);
      setInternships(internshipsData || []);
      setApplications(appsData || []);
    } catch (err) {
      console.error('Failed to load certified internships', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internshipId: string) => {
    setIsApplying(true);
    try {
      const res = await api.applyCertifiedInternship(internshipId);
      if (res.success) {
        await loadData();
        if (selectedInternship && selectedInternship.id === internshipId) {
          setSelectedInternship(prev => prev ? {
            ...prev,
            applied: true,
            applicationStatus: 'Applied',
            applicationId: res.application.id
          } : null);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  const handleViewCertificate = async (certId: string) => {
    try {
      const res = await api.verifyCertificate(certId);
      if (res.verified && res.certificate) {
        setActiveCertificate(res.certificate);
      } else if (onViewCertificateVerification) {
        onViewCertificateVerification(certId);
      }
    } catch {
      if (onViewCertificateVerification) {
        onViewCertificateVerification(certId);
      }
    }
  };

  const domains = ['all', 'AI/ML', 'Web Development', 'Data Science', 'Cybersecurity', 'Java Backend', 'Cloud & DevOps', 'Data Analytics'];

  const filteredInternships = internships.filter(item => {
    const matchesDomain = activeFilterDomain === 'all' || item.domain === activeFilterDomain;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const studentAppsMap = new Map<string, InternshipApplication>();
  applications.forEach(app => studentAppsMap.set(app.internshipId, app));

  const completedCerts = applications.filter(a => a.status === 'Certificate Issued' && a.certificateId);

  return (
    <div id="certified-internships-student-view" className="space-y-8">
      {/* Banner / Value Proposition */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-indigo-950/40 border border-emerald-500/30 p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> NextMind AI Official Certified Program
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            NextMind AI Certified Free Internships
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            Admin-curated, skill-based, 100% free virtual internships designed to bridge academic theory and industry engineering deliverables. Complete real-world capstone projects, validate production competencies, and receive verifiable digital credentials.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <span className="text-xs text-slate-400 block font-medium">Cost</span>
              <span className="text-emerald-400 font-bold text-lg">100% Free</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <span className="text-xs text-slate-400 block font-medium">Certification</span>
              <span className="text-indigo-300 font-bold text-lg">Verified Credential</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <span className="text-xs text-slate-400 block font-medium">Curriculum</span>
              <span className="text-amber-300 font-bold text-lg">Project-Based</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <span className="text-xs text-slate-400 block font-medium">Your Certifications</span>
              <span className="text-teal-300 font-bold text-lg">{completedCerts.length} Issued</span>
            </div>
          </div>
        </div>
      </div>

      {/* Issued Certificates Section if any */}
      {completedCerts.length > 0 && (
        <div className="bg-slate-900/80 border border-teal-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Your Earned NextMind AI Certificates</h2>
                <p className="text-xs text-slate-400">Verifiable credentials issued upon successful internship defense</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedCerts.map(certApp => (
              <div
                key={certApp.id}
                className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Official Certificate Issued
                    </span>
                    <h3 className="text-base font-bold text-white">{certApp.internshipTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Certificate ID: <code className="text-emerald-300">{certApp.certificateId}</code></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleViewCertificate(certApp.certificateId!)}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" /> View Certificate
                  </button>
                  {onViewCertificateVerification && (
                    <button
                      onClick={() => onViewCertificateVerification(certApp.certificateId!)}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Public Link
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setActiveFilterDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilterDomain === dom
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {dom === 'all' ? 'All Domains' : dom}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search internships & skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Internship Cards Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading certified internships...</p>
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Certified Internships Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try selecting another domain or clearing your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map(internship => {
            const studentApp = studentAppsMap.get(internship.id);
            const statusFlow = studentApp ? studentApp.status : 'Available';
            const matchScore = (internship as any).matchScore || 80;
            const whyThis = (internship as any).whyThisInternship || 'Structured curriculum with verified certification.';

            return (
              <motion.div
                key={internship.id}
                layout
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-lg hover:shadow-emerald-900/10"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      ✓ NEXTMIND AI CERTIFIED
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      FREE
                    </span>
                  </div>

                  {/* Title & Domain */}
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {internship.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="text-indigo-400 font-medium">{internship.domain}</span>
                    <span>•</span>
                    <span>{internship.duration}</span>
                    <span>•</span>
                    <span>{internship.workMode}</span>
                  </div>

                  {/* Why this internship (Personalized AI alignment) */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" /> Why this internship?
                      </span>
                      <span className="text-emerald-400 font-bold">{matchScore}% Match</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {whyThis}
                    </p>
                  </div>

                  {/* Skills Chips */}
                  <div className="mt-4">
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
                      Target Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {internship.skills.slice(0, 4).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {internship.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-800/50 text-slate-400 text-xs">
                          +{internship.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta Details */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{internship.numberOfSeats} Seats</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Deadline: {internship.applicationDeadline}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions & Status Flow */}
                <div className="mt-6 pt-4 border-t border-slate-800">
                  {studentApp ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Status:</span>
                        <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                          statusFlow === 'Certificate Issued'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : statusFlow === 'Completed'
                            ? 'bg-blue-500/20 text-blue-300'
                            : statusFlow === 'In Progress'
                            ? 'bg-purple-500/20 text-purple-300'
                            : statusFlow === 'Accepted'
                            ? 'bg-teal-500/20 text-teal-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {statusFlow}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedInternship(internship)}
                          className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                        >
                          View Details
                        </button>
                        {statusFlow === 'Certificate Issued' && studentApp.certificateId && (
                          <button
                            onClick={() => handleViewCertificate(studentApp.certificateId!)}
                            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" /> Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInternship(internship)}
                        className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Program Details
                      </button>
                      <button
                        onClick={() => handleApply(internship.id)}
                        disabled={isApplying}
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                      >
                        Apply Free <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Program Details Modal */}
      <AnimatePresence>
        {selectedInternship && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      ✓ NEXTMIND AI CERTIFIED
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-teal-500/20 text-teal-300">
                      100% FREE
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedInternship.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedInternship.domain} • {selectedInternship.duration} • {selectedInternship.workMode}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
                {/* Overview */}
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Program Overview</h4>
                  <p className="text-slate-300 leading-relaxed">{selectedInternship.description}</p>
                </div>

                {/* What You'll Learn */}
                {selectedInternship.learningOutcomes && (
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">What You'll Learn</h4>
                    <ul className="space-y-1.5">
                      {selectedInternship.learningOutcomes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Required Skills & Eligibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInternship.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Eligibility</h4>
                    <p className="text-xs text-slate-300">{selectedInternship.eligibility}</p>
                  </div>
                </div>

                {/* Capstone Projects */}
                {selectedInternship.projects && selectedInternship.projects.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Hands-On Projects</h4>
                    <div className="space-y-3">
                      {selectedInternship.projects.map((proj, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="font-semibold text-white text-xs block">{proj.title}</span>
                          <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                          <span className="text-[11px] text-teal-400 block mt-1">Deliverable: {proj.deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Program Facts */}
                <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Cost</span>
                    <span className="text-emerald-400 font-bold text-sm">FREE</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Seats</span>
                    <span className="text-white font-bold text-sm">{selectedInternship.numberOfSeats}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Certificate</span>
                    <span className="text-indigo-400 font-bold text-sm">Verified</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Close
                </button>

                {studentAppsMap.has(selectedInternship.id) ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Already Enrolled ({studentAppsMap.get(selectedInternship.id)?.status})
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(selectedInternship.id)}
                    disabled={isApplying}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                  >
                    Confirm & Apply Now <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Certificate Viewer Modal */}
      <AnimatePresence>
        {activeCertificate && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border-2 border-emerald-500/60 max-w-xl w-full rounded-2xl p-8 shadow-2xl relative text-center"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setActiveCertificate(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-8 h-8" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
                OFFICIAL CERTIFICATE OF COMPLETION
              </span>

              <h2 className="text-2xl font-black text-white mt-2">NextMind AI Certified Internship</h2>
              <p className="text-xs text-slate-400">This is to certify that</p>

              <h3 className="text-2xl font-bold text-emerald-300 my-3 font-serif underline decoration-emerald-500/40">
                {activeCertificate.studentName}
              </h3>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully defended and completed the 8-week structured industry curriculum for
                <span className="text-white font-semibold block mt-1 text-sm">{activeCertificate.internshipTitle}</span>
              </p>

              <div className="my-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-around items-center text-xs">
                <div>
                  <span className="text-slate-500 block">Certificate ID</span>
                  <code className="text-emerald-400 font-mono font-bold">{activeCertificate.certificateId}</code>
                </div>
                <div>
                  <span className="text-slate-500 block">Issued On</span>
                  <span className="text-slate-200 font-medium">{activeCertificate.issueDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className="text-teal-400 font-bold">✓ VERIFIED</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.origin + `/certificates/verify/${activeCertificate.certificateId}`);
                    alert('Certificate verification link copied to clipboard!');
                  }}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  Copy Verification Link
                </button>
                {onViewCertificateVerification && (
                  <button
                    onClick={() => {
                      const id = activeCertificate.certificateId;
                      setActiveCertificate(null);
                      onViewCertificateVerification(id);
                    }}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    Open Public Verifier <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
