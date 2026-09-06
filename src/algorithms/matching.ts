import { StudentSkill, SkillEvidence, Student, Job, SkillGapAnalysis } from '../types';

// Canonical skill aliases lookup table
export const CANONICAL_SKILL_MAP: Record<string, string> = {
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Express.js',
  'expressjs': 'Express.js',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'python': 'Python',
  'py': 'Python',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'tf': 'TensorFlow',
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'dl': 'Deep Learning',
  'nlp': 'Natural Language Processing',
  'natural language processing': 'Natural Language Processing',
  'computer vision': 'Computer Vision',
  'cv': 'Computer Vision',
  'docker': 'Docker',
  'containerization': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'Google Cloud',
  'google cloud platform': 'Google Cloud',
  'google cloud': 'Google Cloud',
  'azure': 'Microsoft Azure',
  'sql': 'SQL',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'redis': 'Redis',
  'git': 'Git',
  'github': 'Git',
  'graphql': 'GraphQL',
  'rest': 'REST APIs',
  'rest api': 'REST APIs',
  'restful apis': 'REST APIs',
  'fastapi': 'FastAPI',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-Learn',
  'sklearn': 'Scikit-Learn',
  'tailwindcss': 'Tailwind CSS',
  'tailwind': 'Tailwind CSS',
  'ci/cd': 'CI/CD',
  'continuous integration': 'CI/CD',
  'linux': 'Linux',
  'bash': 'Bash/Shell',
  'cybersecurity': 'Cybersecurity',
  'system design': 'System Design'
};

export function normalizeSkill(skill: string): string {
  if (!skill) return '';
  const trimmed = skill.trim().toLowerCase();
  if (CANONICAL_SKILL_MAP[trimmed]) {
    return CANONICAL_SKILL_MAP[trimmed];
  }
  // Title case fallback
  return skill.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function normalizeSkillsList(skills: string[]): string[] {
  const set = new Set<string>();
  skills.forEach(s => {
    const norm = normalizeSkill(s);
    if (norm) set.add(norm);
  });
  return Array.from(set);
}

// Calculate Skill Freshness
export function calculateSkillFreshness(lastDemonstratedDate: string): 'recent' | 'needs_refresh' | 'stale' {
  if (!lastDemonstratedDate) return 'needs_refresh';
  const diffDays = (Date.now() - new Date(lastDemonstratedDate).getTime()) / (1000 * 3600 * 24);
  if (diffDays <= 180) return 'recent'; // < 6 months
  if (diffDays <= 540) return 'needs_refresh'; // 6 - 18 months
  return 'stale'; // > 18 months
}

// Deterministic Job Match Score calculation
export interface SkillMatchResult {
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  preferredMatched: string[];
  preferredMissing: string[];
  breakdown: {
    requiredScore: number;
    preferredScore: number;
    confidenceAdjustment: number;
  };
}

export function calculateSkillMatch(
  studentSkills: (string | StudentSkill)[],
  requiredSkills: string[],
  preferredSkills: string[] = [],
  customWeights?: Record<string, number>
): SkillMatchResult {
  const normRequired = normalizeSkillsList(requiredSkills);
  const normPreferred = normalizeSkillsList(preferredSkills);

  // Map of student skill name -> confidence (0-1)
  const studentSkillConfidenceMap = new Map<string, number>();
  studentSkills.forEach(s => {
    if (typeof s === 'string') {
      studentSkillConfidenceMap.set(normalizeSkill(s).toLowerCase(), 0.85);
    } else {
      const conf = Math.max(0.2, Math.min(1.0, s.confidence || 0.8));
      studentSkillConfidenceMap.set(normalizeSkill(s.name).toLowerCase(), conf);
    }
  });

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  let totalRequiredWeight = 0;
  let earnedRequiredWeight = 0;

  normRequired.forEach(req => {
    const weight = customWeights?.[req] ?? 1.0;
    totalRequiredWeight += weight;
    const reqLower = req.toLowerCase();
    if (studentSkillConfidenceMap.has(reqLower)) {
      matchedSkills.push(req);
      const conf = studentSkillConfidenceMap.get(reqLower)!;
      // Partial credit for high confidence evidence
      earnedRequiredWeight += weight * (0.6 + 0.4 * conf);
    } else {
      missingSkills.push(req);
    }
  });

  const preferredMatched: string[] = [];
  const preferredMissing: string[] = [];
  let totalPreferredWeight = 0;
  let earnedPreferredWeight = 0;

  normPreferred.forEach(pref => {
    const weight = 0.5;
    totalPreferredWeight += weight;
    const prefLower = pref.toLowerCase();
    if (studentSkillConfidenceMap.has(prefLower)) {
      preferredMatched.push(pref);
      const conf = studentSkillConfidenceMap.get(prefLower)!;
      earnedPreferredWeight += weight * (0.6 + 0.4 * conf);
    } else {
      preferredMissing.push(pref);
    }
  });

  const reqScore = totalRequiredWeight > 0 ? (earnedRequiredWeight / totalRequiredWeight) * 100 : 100;
  const prefScore = totalPreferredWeight > 0 ? (earnedPreferredWeight / totalPreferredWeight) * 100 : 100;

  // Final blend: 80% required skills, 20% preferred skills
  let compositeScore = 0;
  if (totalRequiredWeight > 0 && totalPreferredWeight > 0) {
    compositeScore = reqScore * 0.8 + prefScore * 0.2;
  } else if (totalRequiredWeight > 0) {
    compositeScore = reqScore;
  } else {
    compositeScore = prefScore;
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(compositeScore)));

  return {
    matchScore: finalScore,
    matchedSkills,
    missingSkills,
    preferredMatched,
    preferredMissing,
    breakdown: {
      requiredScore: Math.round(reqScore),
      preferredScore: Math.round(prefScore),
      confidenceAdjustment: Math.round(earnedRequiredWeight - matchedSkills.length * 0.6)
    }
  };
}

// Calculate Gap Priority & Skill Gap Analysis
export function calculateSkillGaps(
  studentSkills: (string | StudentSkill)[],
  targetCareerSkills: string[],
  marketDemandMultiplier: Record<string, number> = {}
): SkillGapAnalysis {
  const matchRes = calculateSkillMatch(studentSkills, targetCareerSkills);

  // Effort estimation based on common tech domains
  const getEffort = (skill: string): 'Low' | 'Medium' | 'High' => {
    const lowEffort = ['Git', 'Bash/Shell', 'Tailwind CSS', 'SQL', 'FastAPI'];
    const highEffort = ['Machine Learning', 'Deep Learning', 'Kubernetes', 'Computer Vision', 'System Design'];
    if (lowEffort.includes(skill)) return 'Low';
    if (highEffort.includes(skill)) return 'High';
    return 'Medium';
  };

  const effortScoreMap: Record<'Low' | 'Medium' | 'High', number> = {
    Low: 30,
    Medium: 60,
    High: 90
  };

  const missingSkillsWithPriority = matchRes.missingSkills.map(skill => {
    const careerRelevance = 90; // High intrinsic relevance to target career
    const demandBonus = marketDemandMultiplier[skill] || 80;
    const effort = getEffort(skill);
    const effortVal = effortScoreMap[effort];

    // Priority formula: relevance (45%) + demand (35%) + ROI upside (ease factor 20%)
    const priorityScore = Math.round(careerRelevance * 0.45 + demandBonus * 0.35 + (100 - effortVal) * 0.20);

    let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    if (priorityScore >= 75) priority = 'HIGH';
    else if (priorityScore <= 55) priority = 'LOW';

    return {
      skill,
      priority,
      priorityScore,
      careerRelevance,
      opportunityImpact: demandBonus,
      learningEffort: effort
    };
  });

  // Sort by priorityScore descending
  missingSkillsWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    targetCareer: 'Target Career',
    requiredSkills: targetCareerSkills,
    matchedSkills: matchRes.matchedSkills,
    missingSkills: missingSkillsWithPriority,
    overallMatchScore: matchRes.matchScore
  };
}

// One-Skill-Away Simulation
export interface OneSkillAwaySimulation {
  skill: string;
  currentMatch: number;
  simulatedMatch: number;
  impactDelta: number;
  newJobsUnlocked: number;
}

export function calculateOneSkillAway(
  currentSkills: (string | StudentSkill)[],
  targetSkillsList: string[][],
  missingCandidateSkills: string[]
): OneSkillAwaySimulation[] {
  const currentSkillsNorm = currentSkills.map(s => (typeof s === 'string' ? normalizeSkill(s) : s.name));

  // Current average match across all target profiles
  const currentMatches = targetSkillsList.map(reqs => calculateSkillMatch(currentSkillsNorm, reqs).matchScore);
  const currentAvgMatch = currentMatches.length > 0 ? currentMatches.reduce((a, b) => a + b, 0) / currentMatches.length : 0;

  const results: OneSkillAwaySimulation[] = [];

  const uniqueMissing = Array.from(new Set(missingCandidateSkills.map(s => normalizeSkill(s))));

  uniqueMissing.forEach(simSkill => {
    const simulatedSkills = [...currentSkillsNorm, simSkill];
    const newMatches = targetSkillsList.map(reqs => calculateSkillMatch(simulatedSkills, reqs).matchScore);
    const newAvgMatch = newMatches.reduce((a, b) => a + b, 0) / newMatches.length;
    const impactDelta = Math.round(newAvgMatch - currentAvgMatch);

    // Count how many target opportunities moved above 70% threshold
    const originallyUnlocked = currentMatches.filter(m => m >= 70).length;
    const newlyUnlocked = newMatches.filter(m => m >= 70).length;
    const unlockedDelta = Math.max(0, newlyUnlocked - originallyUnlocked);

    results.push({
      skill: simSkill,
      currentMatch: Math.round(currentAvgMatch),
      simulatedMatch: Math.round(newAvgMatch),
      impactDelta: Math.max(1, impactDelta),
      newJobsUnlocked: unlockedDelta
    });
  });

  return results.sort((a, b) => b.impactDelta - a.impactDelta);
}

// Profile Completeness calculation
export function calculateProfileCompletion(student: Partial<Student>): number {
  let score = 0;
  if (student.name && student.email) score += 15;
  if (student.college && student.degree && student.graduationYear) score += 15;
  if (student.careerGoal) score += 10;
  if (student.bio) score += 5;
  if (student.linkedinUrl || student.githubUrl) score += 10;
  if (student.skills && student.skills.length >= 3) score += 20;
  if (student.projects && student.projects.length >= 1) score += 15;
  if (student.education && student.education.length >= 1) score += 5;
  if (student.resumeUrl || student.resumeFileName) score += 5;
  return Math.min(100, score);
}

// Career Readiness Score
export function calculateCareerReadiness(
  student: Student,
  targetSkills: string[],
  evidenceList: SkillEvidence[] = []
): number {
  // Factor 1: Skill Coverage (40%)
  const match = calculateSkillMatch(student.skills, targetSkills);
  const skillCoverageScore = match.matchScore;

  // Factor 2: Evidence Maturity (25%)
  const totalEvidence = evidenceList.length;
  const assessmentEvidence = evidenceList.filter(e => e.sourceType === 'assessment').length;
  const projectEvidence = evidenceList.filter(e => e.sourceType === 'project').length;
  const evidenceMaturityScore = Math.min(100, assessmentEvidence * 25 + projectEvidence * 15 + totalEvidence * 5);

  // Factor 3: Profile Completeness (15%)
  const profileCompletenessScore = calculateProfileCompletion(student);

  // Factor 4: Assessment Validation / Academic Foundation (20%)
  const gpaFactor = student.cgpa ? Math.min(100, (student.cgpa / 10) * 100) : 75;
  const validationScore = assessmentEvidence > 0 ? 90 : gpaFactor;

  const readiness = Math.round(
    skillCoverageScore * 0.40 +
    evidenceMaturityScore * 0.25 +
    profileCompletenessScore * 0.15 +
    validationScore * 0.20
  );

  return Math.min(100, Math.max(0, readiness));
}

// Candidate Ranking Score (for Companies reviewing applicants)
export function calculateCandidateRank(
  student: Student,
  job: Job,
  evidences: SkillEvidence[] = [],
  assessmentAverageScore: number = 80
): {
  overallScore: number;
  skillMatch: number;
  evidenceConfidence: number;
  experienceYears: number;
  assessmentScore: number;
} {
  const matchResult = calculateSkillMatch(student.skills, job.requiredSkills, job.preferredSkills, job.skillWeights);
  const skillMatch = matchResult.matchScore;

  // Calculate average evidence confidence for required skills
  const requiredNorm = job.requiredSkills.map(s => normalizeSkill(s).toLowerCase());
  const matchingEvidences = evidences.filter(e => requiredNorm.includes(normalizeSkill(e.skill).toLowerCase()));
  const avgConfidence = matchingEvidences.length > 0
    ? (matchingEvidences.reduce((acc, ev) => acc + (ev.confidence || 0.8), 0) / matchingEvidences.length) * 100
    : 65;

  // Experience calculation
  const totalExpMonths = (student.experience || []).length * 6; // approximate or real
  const experienceYears = Math.min(5, Math.round((totalExpMonths / 12) * 10) / 10);
  const experienceScore = Math.min(100, experienceYears * 25 + (student.projects?.length || 0) * 15);

  // Multi-factor formula
  const overall = Math.round(
    skillMatch * 0.50 +
    avgConfidence * 0.20 +
    assessmentAverageScore * 0.15 +
    experienceScore * 0.15
  );

  return {
    overallScore: Math.min(100, Math.max(0, overall)),
    skillMatch,
    evidenceConfidence: Math.round(avgConfidence),
    experienceYears,
    assessmentScore: Math.round(assessmentAverageScore)
  };
}
