import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Briefcase,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Zap,
  Target,
  Clock,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { Student, Job, SkillEvidence, CareerGoal, CertifiedInternship } from '../types';
import { api } from '../services/api';

interface StudentDashboardProps {
  student: Student;
  evidences: SkillEvidence[];
  targetCareer: CareerGoal;
  jobs: Array<Job & { matchResult?: any }>;
  onSelectTab: (tab: string) => void;
  onApplyJob: (jobId: string) => void;
  onTakeAssessment: (skillName: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  evidences,
  targetCareer,
  jobs,
  onSelectTab,
  onApplyJob,
  onTakeAssessment
}) => {
  const studentSkills = student?.skills || [];
  const readiness = student?.careerReadinessScore || 75;
  const verifiedSkillsCount = studentSkills.filter(s => s.confidence >= 0.8).length;

  const [certifiedInternships, setCertifiedInternships] = useState<CertifiedInternship[]>([]);

  useEffect(() => {
    api.getCertifiedInternships().then(data => {
      if (data && data.length > 0) {
        setCertifiedInternships(data.filter(i => i.status === 'PUBLISHED'));
      }
    }).catch(e => console.warn('Certified internships load note:', e));
  }, []);

  // Safe skill name helper
  const getSkillNameSafe = (s: any): string => {
    if (!s) return '';
    if (typeof s === 'string') return s;
    return s.name || s.skill || '';
  };

  // Dynamic ranking based on Student Skills, Skill Gaps, and Career Goal
  const careerGoalLower = (student?.careerGoal || targetCareer?.title || '').toLowerCase();
  const studentSkillSet = new Set(
    (studentSkills || []).map(s => getSkillNameSafe(s).toLowerCase()).filter(Boolean)
  );

  const recommendedInternships = [...certifiedInternships].map(ci => {
    const ciSkills = (ci.skills || []).map(s => (typeof s === 'string' ? s : (s as any)?.name || '')).filter(Boolean);
    const matched = ciSkills.filter(s => studentSkillSet.has(s.toLowerCase()));
    const missing = ciSkills.filter(s => !studentSkillSet.has(s.toLowerCase()));

    // Calculate real dynamic skill alignment percentage
    const ciDomainLower = (ci.domain || '').toLowerCase();
    const ciTitleLower = (ci.title || '').toLowerCase();
    const matchScore = Math.round(
      (matched.length / Math.max(ciSkills.length, 1)) * 55 +
      ((ciDomainLower && careerGoalLower.includes(ciDomainLower)) || (ciTitleLower && ciTitleLower.includes(careerGoalLower)) ? 35 : 18)
    );
    const clampedScore = Math.min(Math.max(matchScore, 48), 96);

    let dynamicReason = '';
    if (matched.length > 0 && missing.length > 0) {
      dynamicReason = `Aligns with your ${matched.slice(0, 2).join(' and ')} evidence and strengthens your ${missing.slice(0, 2).join(' and ')} capability.`;
    } else if (matched.length > 0) {
      dynamicReason = `Builds on your ${matched.slice(0, 2).join(' and ')} knowledge to achieve certified production-grade proficiency.`;
    } else {
      dynamicReason = `Fills critical foundational gaps in ${(ci.skills || []).slice(0, 2).join(' & ')} required for ${student?.careerGoal || 'Software Engineering'}.`;
    }

    return {
      ...ci,
      calculatedScore: clampedScore,
      matchedSkills: matched,
      missingSkills: missing,
      dynamicReason
    };
  }).sort((a, b) => b.calculatedScore - a.calculatedScore).slice(0, 3);

  // Top recommended jobs sorted by match score
  const recommendedJobs = [...(jobs || [])]
    .filter(j => j.status === 'published')
    .sort((a, b) => (b.matchResult?.matchScore || 0) - (a.matchResult?.matchScore || 0))
    .slice(0, 3);

  // Target career missing skills
  const studentSkillNames = (studentSkills || [])
    .map(s => getSkillNameSafe(s).toLowerCase())
    .filter(Boolean);
  const urgentGaps = (targetCareer?.requiredSkills || ['Docker', 'FastAPI'])
    .map(getSkillNameSafe)
    .filter(Boolean)
    .filter(reqName => !studentSkillNames.includes(reqName.toLowerCase()))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left info */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Target: {student.careerGoal || 'AI Engineer'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                {student.college} • Class of {student.graduationYear}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {student.name}
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Your skills and readiness are evaluated against active job requirements.
                Complete short skill assessments to improve your profile match score.
              </p>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                id="dash-upload-resume-btn"
                onClick={() => onSelectTab('resume')}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                Upload / Review Resume
              </button>
              <button
                id="dash-view-gaps-btn"
                onClick={() => onSelectTab('skills-gap')}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-xs flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                Explore Skill Gaps
              </button>
              <button
                id="dash-career-doctor-btn"
                onClick={() => onSelectTab('career-doctor')}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Career Advice
              </button>
            </div>
          </div>

          {/* Right Readiness Meter */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-indigo-600 transition-all duration-700 ease-out"
                  strokeWidth="8"
                  strokeDasharray={`${(readiness / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{readiness}%</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Readiness</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-800 mt-2">
              Role Match Index
            </p>
            <p className="text-[11px] text-slate-500">
              Target: {targetCareer?.title || 'AI Engineer'}
            </p>

            {/* Profile completeness progress */}
            <div className="w-full mt-3 pt-3 border-t border-slate-200/70">
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Profile Complete</span>
                <span className="text-slate-900 font-semibold">{student.profileCompletion}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${student.profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={() => onSelectTab('skills-graph')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Verified Skills</span>
            <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{studentSkills.length}</span>
            <span className="text-xs text-emerald-600 font-medium">({verifiedSkillsCount} high conf)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Backed by test & project proof</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={() => onSelectTab('skills-graph')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Proof Items</span>
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{evidences.length}</span>
            <span className="text-xs text-slate-500">artifacts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Projects, tests & certifications</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={() => onSelectTab('applications')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Applications</span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">2</span>
            <span className="text-xs text-indigo-600 font-medium">In Pipeline</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">1 Interview • 1 Under Review</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          onClick={() => onSelectTab('resume')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">ATS Match Score</span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{student.resumeScore || 85}%</span>
            <span className="text-xs text-emerald-600 font-medium">High Match</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{student.resumeFileName || 'Resume uploaded'}</p>
        </motion.div>
      </div>

      {/* 🎓 Certified Internships Recommendation Section */}
      <div id="student-dash-certified-internships" className="rounded-xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-indigo-800/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🎓</span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Certified Internships
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wide">
                  100% Free Tuition
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed max-w-2xl">
                “Build verified experience. Learn real skills. Earn a NextMind AI certificate — at no cost.”
              </p>
            </div>
            <button
              id="dash-explore-certified-internships-btn"
              onClick={() => onSelectTab('certified-internships')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-indigo-950 transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <span>Explore Certified Internships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {recommendedInternships.length === 0 ? (
              <div className="col-span-3 py-8 text-center text-xs text-indigo-300">
                Loading certified opportunity matches...
              </div>
            ) : (
              recommendedInternships.map(internship => (
                <div
                  key={internship.id}
                  className="bg-white/5 hover:bg-white/[0.08] border border-indigo-500/30 hover:border-indigo-400/60 rounded-xl p-4.5 flex flex-col justify-between transition-all duration-200 backdrop-blur-sm"
                >
                  <div className="space-y-3">
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                        NEXTMIND AI CERTIFIED
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                        FREE
                      </span>
                    </div>

                    {/* Title & Domain */}
                    <div>
                      <h3 className="font-bold text-sm text-white leading-snug line-clamp-2">
                        {internship.title}
                      </h3>
                      <p className="text-[11px] text-indigo-300/80 mt-0.5 flex items-center gap-2">
                        <span>{internship.domain}</span>
                        <span>•</span>
                        <span>{internship.duration}</span>
                        <span>•</span>
                        <span>{internship.workMode}</span>
                      </p>
                    </div>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1">
                      {internship.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                      {internship.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                          +{internship.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Dynamic Match & Reason */}
                    <div className="bg-indigo-950/60 border border-indigo-800/50 rounded-lg p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-indigo-300">Skill Alignment</span>
                        <span className="text-xs font-bold text-emerald-400">{internship.calculatedScore}%</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {internship.dynamicReason}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-3 border-t border-indigo-800/30 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      NextMind AI Certificate
                    </span>
                    <button
                      onClick={() => onSelectTab('certified-internships')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Skill Gaps & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Urgent Gaps & Verified Skills */}
        <div className="lg:col-span-5 space-y-6">
          {/* Urgent Gaps Card */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-sm text-slate-900">Top Missing Skills</h3>
              </div>
              <button
                onClick={() => onSelectTab('skills-gap')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                View Gaps <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Learning or verifying these competencies will most quickly increase your job match rate:
            </p>

            <div className="space-y-2.5">
              {urgentGaps.map(skill => (
                <div
                  key={skill}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{skill}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                        Missing
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">+12% target career match</p>
                  </div>
                  <button
                    onClick={() => onTakeAssessment(skill)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors shadow-xs"
                  >
                    Take Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Verified Skills Card */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-sm text-slate-900">Current Verified Skills</h3>
              </div>
              <button
                onClick={() => onSelectTab('skills-graph')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                All ({studentSkills.length}) <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {studentSkills.slice(0, 4).map(skill => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">
                        {skill.evidenceCount} proof items
                      </span>
                      <span className="text-xs font-semibold text-slate-700">{skill.level}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Jobs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Recommended Jobs</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Positions matching your verified skills
                </p>
              </div>
              <button
                onClick={() => onSelectTab('jobs')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                Browse All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recommendedJobs.map(job => {
                const matchScore = job.matchResult?.matchScore || 85;
                const matched = job.matchResult?.matchedSkills || [];
                const missing = job.matchResult?.missingSkills || [];

                return (
                  <motion.div
                    key={job.id}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.12 }}
                    className="p-4 rounded-lg bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-slate-900">
                            {job.title}
                          </h4>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 capitalize">
                            {job.workMode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {job.companyName} • {job.location} • <span className="text-slate-700 font-medium">{job.salaryRange}</span>
                        </p>
                      </div>

                      {/* Match Score Badge */}
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Zap className="w-3 h-3 text-emerald-600" />
                          <span>{matchScore}% Match</span>
                        </div>
                      </div>
                    </div>

                    {/* Matched vs Missing Skills */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {matched.map((s: string) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
                        >
                          ✓ {s}
                        </span>
                      ))}
                      {missing.map((s: string) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600"
                        >
                          ✕ {s}
                        </span>
                      ))}
                    </div>

                    {/* Action */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {job.applicantCount} applicant{job.applicantCount === 1 ? '' : 's'}
                      </span>
                      <button
                        id={`job-apply-btn-${job.id}`}
                        onClick={() => onApplyJob(job.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
