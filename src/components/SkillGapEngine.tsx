import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Zap,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  FolderGit2,
  FileCheck,
  TrendingUp,
  Target,
  ChevronRight,
  Info,
  X,
  Sliders,
  Briefcase,
  GitBranch,
  ShieldCheck,
  Building,
  Check,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, CareerGoal, SkillGapAnalysis, OneSkillAwaySimulation, Job } from '../types';
import { api } from '../services/api';

interface SkillGapEngineProps {
  student: Student;
  targetCareer: CareerGoal;
  onTakeAssessment: (skillName: string) => void;
  onSelectTab: (tab: string) => void;
}

// Safe extraction helpers
const getSkillName = (s: any): string => {
  if (!s) return '';
  if (typeof s === 'string') return s;
  return s.name || s.skill || s.skillName || '';
};

const getSkillLevel = (s: any): number => {
  if (!s) return 60;
  if (typeof s === 'number') return s;
  if (typeof s.level === 'number') return s.level;
  if (typeof s.confidence === 'number') return Math.round(s.confidence * 100);
  return 60;
};

export const SkillGapEngine: React.FC<SkillGapEngineProps> = ({
  student,
  targetCareer,
  onTakeAssessment,
  onSelectTab
}) => {
  const [activeEngineTab, setActiveEngineTab] = useState<'gap_analysis' | 'career_gps'>('gap_analysis');
  const [gapAnalysis, setGapAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [oneSkillAway, setOneSkillAway] = useState<OneSkillAwaySimulation[]>([]);
  const [allCareers, setAllCareers] = useState<CareerGoal[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Evidence explainability drawer state
  const [selectedSkillForDrawer, setSelectedSkillForDrawer] = useState<string | null>(null);

  // Simulator State
  const [simulatedSkill, setSimulatedSkill] = useState<string>('Docker');
  const [simulationBoost, setSimulationBoost] = useState<number>(20);

  // Project Blueprint Modal State
  const [projectModalSkill, setProjectModalSkill] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [student, targetCareer]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gapsRes, osaRes, careersRes, jobsRes] = await Promise.all([
        api.getGapAnalysis(),
        api.getOneSkillAway(),
        api.getCareers(),
        api.getJobs()
      ]);
      setGapAnalysis(gapsRes.analysis);
      setOneSkillAway(osaRes);
      setAllCareers(careersRes);
      setAllJobs(jobsRes);

      // Set default simulated skill to first gap if available
      if (gapsRes.analysis?.missingSkills?.length > 0) {
        setSimulatedSkill(gapsRes.analysis.missingSkills[0].skill);
      }
    } catch (err) {
      console.error('Failed to load gap data', err);
    } finally {
      setLoading(false);
    }
  };

  // Student's current skill map
  const studentSkillMap = useMemo(() => {
    const map = new Map<string, number>();
    (student?.skills || []).forEach(s => {
      const name = getSkillName(s);
      if (name) {
        map.set(name.toLowerCase(), getSkillLevel(s));
      }
    });
    return map;
  }, [student]);

  // Target Career requirements (supporting string[] or object[])
  const requiredSkillsList = useMemo(() => {
    const raw = targetCareer?.requiredSkills || [];
    return raw.map(req => {
      const name = getSkillName(req);
      const importance: 'critical' | 'high' | 'medium' =
        typeof req === 'object' && req?.importance ? req.importance : 'high';
      const targetLevel: number =
        typeof req === 'object' && typeof req?.targetLevel === 'number' ? req.targetLevel : 75;
      return { name, importance, targetLevel };
    }).filter(r => Boolean(r.name));
  }, [targetCareer]);

  // Categorize skills into gap tiers
  const categorizedSkills = useMemo(() => {
    return requiredSkillsList.map(req => {
      const currentLevel = studentSkillMap.get(req.name.toLowerCase()) || 0;
      const targetLevel = req.targetLevel || 75;
      const gap = Math.max(0, targetLevel - currentLevel);

      let status: 'Strong' | 'Moderate' | 'High' | 'Critical';
      let statusColor: string;
      let statusBg: string;

      if (gap <= 5) {
        status = 'Strong';
        statusColor = 'text-emerald-700';
        statusBg = 'bg-emerald-50 border-emerald-200';
      } else if (gap <= 15) {
        status = 'Moderate';
        statusColor = 'text-blue-700';
        statusBg = 'bg-blue-50 border-blue-200';
      } else if (gap <= 30) {
        status = 'High';
        statusColor = 'text-amber-700';
        statusBg = 'bg-amber-50 border-amber-200';
      } else {
        status = 'Critical';
        statusColor = 'text-rose-700';
        statusBg = 'bg-rose-50 border-rose-200';
      }

      // Priority formula: Gap × Importance × Market Demand
      const importanceWeight = req.importance === 'critical' ? 1.5 : req.importance === 'high' ? 1.2 : 1.0;
      const priorityScore = Math.round(gap * importanceWeight * 1.2);

      return {
        ...req,
        currentLevel,
        targetLevel,
        gap,
        status,
        statusColor,
        statusBg,
        priorityScore
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [requiredSkillsList, studentSkillMap]);

  // Highest Priority Gaps
  const priorityGaps = useMemo(() => {
    return categorizedSkills.filter(s => s.gap > 0).slice(0, 4);
  }, [categorizedSkills]);

  // Next Best Action (Highest impact single action)
  const nextBestAction = useMemo(() => {
    if (priorityGaps.length === 0) {
      return {
        skill: 'Machine Learning',
        actionType: 'assessment',
        title: 'Take Advanced Technical Assessment',
        reason: 'You have mastered your core requirements. Validate high-level capability for top company placements.',
        expectedGain: '+4% Readiness',
        unlockedJobs: 5
      };
    }
    const topGap = priorityGaps[0];
    const isMajor = topGap.gap >= 25;
    return {
      skill: topGap.name,
      actionType: isMajor ? 'course' : 'assessment',
      title: isMajor ? `Start Guided ${topGap.name} Masterclass` : `Take ${topGap.name} Proctored Assessment`,
      reason: `Closing the ${topGap.gap}% gap in ${topGap.name} directly impacts the ${topGap.importance} requirement for ${targetCareer?.title || 'your target role'}.`,
      expectedGain: `+${Math.min(12, Math.round(topGap.gap * 0.35))}% Readiness`,
      unlockedJobs: Math.min(8, Math.max(2, Math.round(topGap.gap / 6)))
    };
  }, [priorityGaps, targetCareer]);

  // Simulator Calculation
  const simulationResult = useMemo(() => {
    const baseScore = student?.careerReadinessScore || 65;
    const targetSkill = simulatedSkill || 'Docker';
    const currentLvl = studentSkillMap.get(targetSkill.toLowerCase()) || 0;
    const simulatedLvl = Math.min(100, currentLvl + simulationBoost);

    // Find in required skills
    const req = requiredSkillsList.find(r => r.name.toLowerCase() === targetSkill.toLowerCase());
    let readinessGain = 0;
    if (req) {
      const weight = req.importance === 'critical' ? 0.4 : req.importance === 'high' ? 0.3 : 0.2;
      readinessGain = Math.round((simulationBoost / 100) * 35 * weight);
    } else {
      readinessGain = Math.round((simulationBoost / 100) * 5);
    }

    const projectedReadiness = Math.min(100, baseScore + Math.max(readinessGain, 4));

    // Calculate newly matched jobs
    const currentMatchedJobs = allJobs.filter(j => (j.matchResult?.score || 0) >= 70).length;
    const simulatedMatchedJobs = Math.min(allJobs.length, currentMatchedJobs + Math.round(simulationBoost / 7));

    // Calculate alternative roles unlocked
    const newRolesCount = simulationBoost >= 20 ? 3 : 1;

    return {
      projectedReadiness,
      readinessGain: projectedReadiness - baseScore,
      unlockedJobsCount: Math.max(1, simulatedMatchedJobs - currentMatchedJobs),
      newRolesCount,
      simulatedLvl
    };
  }, [student, simulatedSkill, simulationBoost, studentSkillMap, requiredSkillsList, allJobs]);

  // Multiple Strongest Career Paths
  const alternativePaths = useMemo(() => {
    if (!allCareers || allCareers.length === 0) return [];

    return allCareers.map(career => {
      let matchedCount = 0;
      const careerSkills = (career.requiredSkills || []).map(getSkillName).filter(Boolean);
      let totalReq = careerSkills.length;
      let totalSkillScore = 0;

      careerSkills.forEach(reqName => {
        const studentLvl = studentSkillMap.get(reqName.toLowerCase()) || 0;
        if (studentLvl >= 50) matchedCount++;
        totalSkillScore += Math.min(100, (studentLvl / 75) * 100);
      });

      const readiness = Math.round(totalReq > 0 ? totalSkillScore / totalReq : 50);
      const isCurrentTarget = career.id === targetCareer?.id;

      // Matched jobs for this career
      const careerTitleLower = (career.title || '').toLowerCase();
      const matchedJobs = (allJobs || []).filter(j => {
        const jTitleLower = (j.title || '').toLowerCase();
        const jobReqs = (j.requiredSkills || []).map(getSkillName).filter(Boolean);
        return (
          (careerTitleLower && jTitleLower.includes(careerTitleLower)) ||
          careerSkills.some(r => jobReqs.some(js => js.toLowerCase() === r.toLowerCase()))
        );
      });

      return {
        ...career,
        careerSkills,
        readiness,
        matchedCount,
        totalReq,
        isCurrentTarget,
        matchedJobsCount: Math.max(2, matchedJobs.length)
      };
    }).sort((a, b) => b.readiness - a.readiness);
  }, [allCareers, studentSkillMap, targetCareer, allJobs]);

  // Evidence Breakdown for Drawer
  const getEvidenceBreakdown = (skillName: string) => {
    const sNameLower = (skillName || '').toLowerCase();
    const studentSkill = (student?.skills || []).find(s => getSkillName(s).toLowerCase() === sNameLower);
    const level = studentSkill ? getSkillLevel(studentSkill) : 60;

    // Deterministic breakdown totaling to level
    const projects = Math.round(level * 0.35);
    const assessment = Math.round(level * 0.30);
    const github = Math.round(level * 0.18);
    const courses = Math.round(level * 0.12);
    const work = level - (projects + assessment + github + courses);

    return {
      total: level,
      projects,
      assessment,
      github,
      courses,
      work: Math.max(0, work)
    };
  };

  // Career GPS Chronological Nodes
  const gpsNodes = [
    {
      id: 'node_1',
      title: 'Current Academic Foundation',
      subtitle: student?.degree || (student?.education && student.education[0]?.degree) || 'B.Tech Computer Science',
      status: 'COMPLETED' as const,
      statusLabel: 'Completed',
      description: 'Core accredited university curriculum, semester coursework, and engineering baseline.',
      skills: ['Mathematics', 'DSA', 'Computer Architecture']
    },
    {
      id: 'node_2',
      title: 'Core Technical Languages',
      subtitle: 'Verified Coding Fundamentals',
      status: 'COMPLETED' as const,
      statusLabel: 'Verified',
      description: 'Syntax fluency, standard algorithms, data structures, and Git version control.',
      skills: ['Python', 'SQL', 'Git']
    },
    {
      id: 'node_3',
      title: 'Domain Specialization',
      subtitle: 'Target Career Competencies',
      status: 'IN_PROGRESS' as const,
      statusLabel: 'In Progress',
      description: 'Applied libraries, neural networks, data modeling, and specialized development.',
      skills: ['Machine Learning', 'Deep Learning', 'PyTorch']
    },
    {
      id: 'node_4',
      title: 'Production Systems & Deployment',
      subtitle: 'Industry Architecture Standards',
      status: 'NEEDS_IMPROVEMENT' as const,
      statusLabel: 'Priority Gap',
      description: 'Microservices containerization, API contracts, model serving, and CI/CD pipelines.',
      skills: ['Docker', 'FastAPI', 'Cloud Run']
    },
    {
      id: 'node_5',
      title: 'Verified Project Evidence',
      subtitle: 'End-to-End Artifacts',
      status: 'IN_PROGRESS' as const,
      statusLabel: 'In Progress',
      description: 'Real deployed artifacts with clean GitHub commits, live URLs, and automated benchmarks.',
      skills: ['End-to-End ML Pipeline', 'Automated Testing']
    },
    {
      id: 'node_6',
      title: 'Technical Assessment Gates',
      subtitle: 'Objective Evaluation Gateway',
      status: 'IN_PROGRESS' as const,
      statusLabel: 'In Progress',
      description: 'Strict proctored coding challenges and verified capability score above 70%.',
      skills: ['Python Certification', 'SQL Verification']
    },
    {
      id: 'node_7',
      title: 'Workplace Internship Track',
      subtitle: 'Industry Experience',
      status: 'LOCKED' as const,
      statusLabel: 'Next Stage',
      description: 'High-impact enterprise internship with mentor endorsements and production contributions.',
      skills: ['Enterprise Collaboration', 'Code Reviews']
    },
    {
      id: 'node_8',
      title: targetCareer?.title || 'Target Role',
      subtitle: 'Career Readiness 85%+',
      status: 'TARGET' as const,
      statusLabel: 'Target Destination',
      description: 'Full qualification for direct recruiter dispatch, prioritized hiring rounds, and top compensation bands.',
      skills: ['Full Production Capability']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Skill Gap & Career GPS Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              AI Powered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {activeEngineTab === 'gap_analysis'
              ? 'Understand what is missing between your current capability and your target career.'
              : 'See where you are, what is missing, and the fastest realistic path to your target role.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveEngineTab('gap_analysis')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeEngineTab === 'gap_analysis'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Skill Gap Analysis</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveEngineTab('career_gps')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeEngineTab === 'career_gps'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-4 h-4 text-indigo-600" />
            <span>Career GPS & Path Simulator</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SKILL GAP ANALYSIS */}
      {activeEngineTab === 'gap_analysis' && (
        <div className="space-y-6">
          {/* Target Role & Readiness Summary Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                Target Career Pathway
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {targetCareer?.title || 'Machine Learning Engineer'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xl">
                {targetCareer?.description || 'Builds production-ready neural networks, scalable inference endpoints, and automated data pipelines.'}
              </p>
            </div>

            <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80 shrink-0">
              <div className="text-center">
                <span className="text-[11px] text-slate-500 block">Current Readiness</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {student?.careerReadinessScore || 72}%
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <span className="text-[11px] text-slate-500 block">Target Threshold</span>
                <span className="text-2xl font-bold text-slate-900">85%</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <span className="text-[11px] text-slate-500 block">Status</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 inline-block mt-0.5">
                  {(student?.careerReadinessScore || 72) >= 85 ? 'Market Ready' : 'In Preparation'}
                </span>
              </div>
            </div>
          </div>

          {/* Highest Priority Gaps Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <FlameIcon />
                  Highest Priority Gaps
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated automatically: <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">Priority = Gap Size × Career Relevance × Opportunity Demand</code>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priorityGaps.map(gap => (
                <div
                  key={gap.name}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{gap.name}</span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${gap.statusBg} ${gap.statusColor}`}>
                          {gap.status} ({gap.gap}% Gap)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {gap.importance} Priority
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Current: {gap.currentLevel}%</span>
                        <span>Required Target: {gap.targetLevel}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${(gap.currentLevel / gap.targetLevel) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Step-by-step resolution pathway */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800 block">Recommended Pathway:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[9px]">1</span>
                          <span>Learn Fundamentals</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[9px]">2</span>
                          <span>Build Project Artifact</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[9px]">3</span>
                          <span>Pass Assessment Gate</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[9px]">4</span>
                          <span>Log Verified Evidence</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onTakeAssessment(gap.name)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Take Assessment</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTab('courses')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Start Learning</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectModalSkill(gap.name)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>Build Project</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive "Skills You Have" Table with Evidence Explainability */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Required Skills Competency Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Click on any skill to see the exact <strong>Evidence-Based Score breakdown</strong> across projects, assessments, and repos.
                </p>
              </div>
              <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 self-start sm:self-auto">
                {categorizedSkills.length} Total Competencies Analyzed
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                    <th className="py-3 px-4">Skill Name</th>
                    <th className="py-3 px-4">Importance</th>
                    <th className="py-3 px-4">Current Proficiency</th>
                    <th className="py-3 px-4">Target Requirement</th>
                    <th className="py-3 px-4">Gap Status</th>
                    <th className="py-3 px-4 text-right">Evidence Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categorizedSkills.map(skill => (
                    <tr
                      key={skill.name}
                      onClick={() => setSelectedSkillForDrawer(skill.name)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <span>{skill.name}</span>
                        <Info className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize text-slate-600 font-medium">
                          {skill.importance}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {skill.currentLevel}%
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {skill.targetLevel}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${skill.statusBg} ${skill.statusColor}`}>
                          {skill.status} ({skill.gap > 0 ? `-${skill.gap}%` : 'Met ✓'})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs text-indigo-600 font-semibold group-hover:underline inline-flex items-center gap-1">
                          <span>View Score Logic</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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

      {/* VIEW 2: CAREER GPS & PATH SIMULATOR */}
      {activeEngineTab === 'career_gps' && (
        <div className="space-y-6">
          {/* Career GPS Dashboard Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 block">Current Status</span>
              <span className="text-xs font-bold text-slate-900 line-clamp-1">
                {student?.degree?.split(' ')[0] || (student?.education && student.education[0]?.degree?.split(' ')[0]) || 'Undergraduate'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 block">Career Readiness</span>
              <span className="text-base font-bold text-indigo-600">
                {student?.careerReadinessScore || 72}%
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 block">Target Role</span>
              <span className="text-xs font-bold text-slate-900 line-clamp-1">
                {targetCareer?.title || 'ML Engineer'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 block">Skill Completion</span>
              <span className="text-base font-bold text-emerald-600">
                {Math.round((categorizedSkills.filter(s => s.gap <= 5).length / Math.max(1, categorizedSkills.length)) * 100)}%
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 block">Critical Gaps</span>
              <span className="text-base font-bold text-rose-600">
                {categorizedSkills.filter(s => s.status === 'Critical').length}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 block">Recommended</span>
              <span className="text-base font-bold text-slate-900">
                {priorityGaps.length} Actions
              </span>
            </div>
          </div>

          {/* NEXT BEST ACTION Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  Next Best Action
                </span>
                <span className="text-xs text-indigo-200 font-mono">
                  Impact: {nextBestAction.expectedGain} • +{nextBestAction.unlockedJobs} Opportunities
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{nextBestAction.title}</h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {nextBestAction.reason}
              </p>
            </div>

            <div className="shrink-0">
              {nextBestAction.actionType === 'assessment' ? (
                <button
                  type="button"
                  onClick={() => onTakeAssessment(nextBestAction.skill)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Launch Assessment Now</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectTab('courses')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Start Recommended Course</span>
                </button>
              )}
            </div>
          </div>

          {/* Chronological Visual Career Path */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  Chronological Career Progression Path
                </h3>
                <p className="text-xs text-slate-500">
                  Follow the verified sequential milestones from your university baseline to direct enterprise placement.
                </p>
              </div>
            </div>

            {/* Path Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gpsNodes.map((node, i) => (
                <div
                  key={node.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    node.status === 'COMPLETED'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : node.status === 'IN_PROGRESS'
                      ? 'bg-indigo-50/40 border-indigo-200'
                      : node.status === 'NEEDS_IMPROVEMENT'
                      ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/50'
                      : node.status === 'TARGET'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50/60 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-mono font-bold ${node.status === 'TARGET' ? 'text-indigo-300' : 'text-slate-400'}`}>
                        Step 0{i + 1}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          node.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : node.status === 'IN_PROGRESS'
                            ? 'bg-indigo-100 text-indigo-800'
                            : node.status === 'NEEDS_IMPROVEMENT'
                            ? 'bg-amber-100 text-amber-900'
                            : node.status === 'TARGET'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {node.statusLabel}
                      </span>
                    </div>

                    <h4 className={`font-bold text-sm ${node.status === 'TARGET' ? 'text-white' : 'text-slate-900'}`}>
                      {node.title}
                    </h4>
                    <p className={`text-[11px] leading-relaxed ${node.status === 'TARGET' ? 'text-slate-300' : 'text-slate-500'}`}>
                      {node.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                    <div className="flex flex-wrap gap-1">
                      {node.skills.map(s => (
                        <span
                          key={s}
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            node.status === 'TARGET' ? 'bg-slate-800 text-slate-300' : 'bg-white border border-slate-200 text-slate-600'
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* "WHAT IF I IMPROVE THIS SKILL?" SIMULATOR */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    "What If I Improve This Skill?" Simulator
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Simulation Only — Actual Profile Unchanged
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select any competency gap to preview how increased mastery unlocks higher readiness scores and opportunities.
                </p>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select Skill */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Select Gap Skill to Simulate:</label>
                  <select
                    value={simulatedSkill}
                    onChange={e => setSimulatedSkill(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    {priorityGaps.map(g => (
                      <option key={g.name} value={g.name}>
                        {g.name} (Current: {g.currentLevel}%, Gap: -{g.gap}%)
                      </option>
                    ))}
                    {requiredSkillsList.filter(r => !priorityGaps.some(p => p.name === r.name)).map(r => (
                      <option key={r.name} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Boost Buttons */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Improvement Level Boost:</label>
                  <div className="flex items-center gap-2">
                    {[10, 20, 30].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSimulationBoost(val)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                          simulationBoost === val
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        +{val}% Boost
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulation Real-Time Projection Output Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1 text-center">
                  <span className="text-[11px] text-slate-500 block">Projected Career Readiness</span>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-xl font-bold text-slate-900">
                      {student?.careerReadinessScore || 72}%
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xl font-bold text-emerald-600">
                      {simulationResult.projectedReadiness}%
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 block">
                    (+{simulationResult.readinessGain} Readiness Points)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1 text-center">
                  <span className="text-[11px] text-slate-500 block">Opportunities Unlocked</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    +{simulationResult.unlockedJobsCount}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Meets minimum gate score
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1 text-center">
                  <span className="text-[11px] text-slate-500 block">Alternative Roles Unlocked</span>
                  <span className="text-2xl font-bold text-slate-900">
                    +{simulationResult.newRolesCount}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    In AI & Cloud Engineering
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Multiple Strongest Career Paths */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Strongest Matched Career Pathways
                </h3>
                <p className="text-xs text-slate-500">
                  Multiple viable careers dynamically ranked by your proven capabilities and market demand.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alternativePaths.slice(0, 4).map(career => (
                <div
                  key={career.id}
                  className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                    career.isCurrentTarget
                      ? 'bg-indigo-50/40 border-indigo-300 ring-1 ring-indigo-300/50'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{career.title}</h4>
                          {career.isCurrentTarget && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                              Active Target
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">{career.category}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold text-indigo-600">{career.readiness}%</span>
                        <span className="text-[10px] text-slate-400 block">Readiness</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {career.description}
                    </p>

                    {/* Matched vs Missing Skills */}
                    <div className="space-y-1 pt-1 text-[11px]">
                      <span className="text-slate-500 font-medium block">
                        Required Competencies ({career.matchedCount}/{career.totalReq} Met):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(career.requiredSkills || []).map(req => {
                          const reqName = getSkillName(req);
                          const hasSkill = (studentSkillMap.get(reqName.toLowerCase()) || 0) >= 50;
                          return (
                            <span
                              key={reqName}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                                hasSkill
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {hasSkill ? <Check className="w-2.5 h-2.5" /> : null}
                              <span>{reqName}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {career.matchedJobsCount} Matched Opportunities
                    </span>

                    <button
                      type="button"
                      onClick={() => onSelectTab('jobs')}
                      className="px-3 py-1.5 rounded-lg font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1"
                    >
                      <span>Explore Openings</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EVIDENCE EXPLAINABILITY DRAWER / MODAL */}
      <AnimatePresence>
        {selectedSkillForDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Evidence-Based Skill Rating
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {selectedSkillForDrawer} Proficiency Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Nexminds ratings are not self-reported numbers. They are derived from verified technical evidence artifacts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSkillForDrawer(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Total Score & Formula Breakdown */}
              {(() => {
                const breakdown = getEvidenceBreakdown(selectedSkillForDrawer);
                return (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Calculated Rating</span>
                        <span className="text-2xl font-bold text-slate-900">{breakdown.total} / 100</span>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        Confidence: 95% (High)
                      </span>
                    </div>

                    {/* Breakdown bars */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-semibold text-slate-800 block">Weighted Source Contributions:</span>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                            Production Project Artifacts
                          </span>
                          <span className="font-bold text-slate-900">+{breakdown.projects} pts</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(breakdown.projects / 35) * 100}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Technical Proctored Assessments
                          </span>
                          <span className="font-bold text-slate-900">+{breakdown.assessment} pts</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(breakdown.assessment / 30) * 100}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <GitBranch className="w-3.5 h-3.5 text-amber-600" />
                            GitHub Repositories & Commits
                          </span>
                          <span className="font-bold text-slate-900">+{breakdown.github} pts</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-amber-600 rounded-full" style={{ width: `${(breakdown.github / 20) * 100}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                            Certifications & Courses
                          </span>
                          <span className="font-bold text-slate-900">+{breakdown.courses} pts</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(breakdown.courses / 15) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSkillForDrawer(null);
                          onTakeAssessment(selectedSkillForDrawer);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      >
                        Boost with Proctored Assessment
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROJECT BLUEPRINT MODAL */}
      <AnimatePresence>
        {projectModalSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Recommended Project Blueprint
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    Build Production {projectModalSkill} Artifact
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setProjectModalSkill(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p className="leading-relaxed">
                  To turn your <strong>{projectModalSkill}</strong> skill into verified evidence that hiring managers trust, build an end-to-end artifact matching these specifications:
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block">Suggested Project Idea:</span>
                  <p className="text-slate-700">
                    <strong>Enterprise {projectModalSkill} Microservice</strong>: A containerized REST service featuring asynchronous processing, unit tests (pytest/jest), automated CI/CD GitHub Actions, and container deployment.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-800 block">Expected Verification Artifacts:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Public GitHub Repository with documented README</li>
                    <li>Dockerfile and docker-compose.yml configuration</li>
                    <li>Live deployment endpoint or recorded demo walkthrough</li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProjectModalSkill(null)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProjectModalSkill(null);
                    onSelectTab('skills-graph');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Submit Evidence on Skills Graph</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function FlameIcon() {
  return (
    <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 24 24">
      <path d="M12 2c-.3 0-.5.1-.7.3C9.7 4.1 6.8 7.6 6.8 11.2c0 3.2 2.3 5.8 5.2 5.8 2.9 0 5.2-2.6 5.2-5.8 0-3.6-2.9-7.1-4.5-8.9-.2-.2-.4-.3-.7-.3z"/>
    </svg>
  );
}
