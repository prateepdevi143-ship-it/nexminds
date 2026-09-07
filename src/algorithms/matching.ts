import { StudentSkill, SkillEvidence, Student, Job, SkillGapAnalysis, TransparentMatchBreakdown } from '../types';

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
  (studentSkills || []).forEach(s => {
    if (typeof s === 'string') {
      const norm = normalizeSkill(s);
      if (norm) studentSkillConfidenceMap.set(norm.toLowerCase(), 0.85);
    } else if (s) {
      const conf = Math.max(0.2, Math.min(1.0, s.confidence || 0.8));
      const sName = s.name || (s as any).skill || '';
      const norm = normalizeSkill(sName);
      if (norm) {
        studentSkillConfidenceMap.set(norm.toLowerCase(), conf);
      }
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
  const currentSkillsNorm = (currentSkills || [])
    .map(s => {
      const raw = typeof s === 'string' ? s : (s?.name || (s as any)?.skill || '');
      return normalizeSkill(raw);
    })
    .filter(Boolean);

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

// -------------------------------------------------------------
// EVIDENCE-BASED RECRUITMENT MATCHING ENGINE
// Dynamic 7-Factor Transparent Weighted Scoring & Explainability
// -------------------------------------------------------------

export function calculateSkillConfidenceFromEvidence(
  skill: string,
  student: Student,
  evidences: SkillEvidence[] = []
): { confidence: number; evidenceCount: number; reasons: string[] } {
  const norm = normalizeSkill(skill).toLowerCase();
  const reasons: string[] = [];
  let score = 0.2; // Base baseline
  let evidenceCount = 0;

  // 1. Check Projects
  const matchingProjects = (student.projects || []).filter(p =>
    (p.technologies || []).some(t => normalizeSkill(t).toLowerCase() === norm)
  );
  if (matchingProjects.length > 0) {
    score += Math.min(0.35, matchingProjects.length * 0.15);
    evidenceCount += matchingProjects.length;
    reasons.push(`${matchingProjects.length} demonstrated project(s)`);
  }

  // 2. Check Hackathons
  const matchingHackathons = (student.hackathons || []).filter(h =>
    (h.technologies || []).some(t => normalizeSkill(t).toLowerCase() === norm)
  );
  if (matchingHackathons.length > 0) {
    score += Math.min(0.25, matchingHackathons.length * 0.15);
    evidenceCount += matchingHackathons.length;
    reasons.push(`${matchingHackathons.length} competitive hackathon build(s)`);
  }

  // 3. Check Freelance
  const matchingFreelance = (student.freelanceWork || []).filter(f =>
    (f.technologies || []).some(t => normalizeSkill(t).toLowerCase() === norm)
  );
  if (matchingFreelance.length > 0) {
    score += Math.min(0.20, matchingFreelance.length * 0.10);
    evidenceCount += matchingFreelance.length;
    reasons.push(`${matchingFreelance.length} client freelance contract(s)`);
  }

  // 4. Check Certifications
  const matchingCerts = (student.certifications || []).filter(c =>
    (c.name || '').toLowerCase().includes(norm)
  );
  if (matchingCerts.length > 0) {
    score += 0.20;
    evidenceCount += matchingCerts.length;
    reasons.push(`Verified credential: ${matchingCerts[0].name}`);
  }

  // 5. Check Evidence Collection (Assessments, GitHub repos, etc.)
  const directEvidences = evidences.filter(e =>
    normalizeSkill(e.skill || e.skillName || '').toLowerCase() === norm
  );
  directEvidences.forEach(e => {
    evidenceCount++;
    if (e.sourceType === 'assessment') {
      score += 0.25;
      reasons.push(`Passed platform skill assessment`);
    } else if (e.sourceType === 'github') {
      score += 0.15;
      reasons.push(`Public GitHub repository code artifact`);
    }
  });

  // 6. External LeetCode if DSA / Algorithms
  if (norm.includes('algorithm') || norm.includes('dsa') || norm.includes('data structure') || norm.includes('problem solving')) {
    const solved = student.externalProfiles?.leetcodeData?.totalSolved || 0;
    if (solved > 0) {
      const boost = Math.min(0.30, (solved / 200) * 0.30);
      score += boost;
      evidenceCount += 1;
      reasons.push(`${solved} solved LeetCode challenges`);
    }
  }

  // 7. External GitHub top languages
  const topLangs = student.externalProfiles?.githubData?.topLanguages || [];
  const gitMatch = topLangs.find(l => normalizeSkill(l.language).toLowerCase() === norm);
  if (gitMatch) {
    score += 0.15;
    evidenceCount += 1;
    reasons.push(`GitHub codebase activity (${gitMatch.percentage}% of repos)`);
  }

  const finalConfidence = Math.min(1.0, Math.max(0.1, Math.round(score * 100) / 100));
  return { confidence: finalConfidence, evidenceCount, reasons };
}

export function calculateOpportunityMatch(
  student: Student,
  job: Job,
  evidences: SkillEvidence[] = [],
  assessmentAttempt?: { score: number; passed: boolean }
): TransparentMatchBreakdown {
  const explanations: string[] = [];
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const weakSkills: string[] = [];

  // Required skills list
  const required = normalizeSkillsList(job.requiredSkills || []);
  const preferred = normalizeSkillsList(job.preferredSkills || []);
  const studentSkillMap = new Map<string, StudentSkill>();
  (student.skills || []).forEach(s => {
    const rawName = typeof s === 'string' ? s : (s?.name || (s as any)?.skill || '');
    const norm = normalizeSkill(rawName);
    if (norm) {
      const skillObj = typeof s === 'string'
        ? { id: `s_${norm}`, name: norm, confidence: 0.8, level: 80, freshness: 'recent' as const, evidenceCount: 1, lastDemonstrated: '' }
        : s;
      studentSkillMap.set(norm.toLowerCase(), skillObj);
    }
  });

  // 1. Skill Match (35% weight)
  let totalSkillPoints = 0;
  let earnedSkillPoints = 0;

  required.forEach(req => {
    totalSkillPoints += 1.0;
    const reqLower = req.toLowerCase();
    const existing = studentSkillMap.get(reqLower);
    const ev = calculateSkillConfidenceFromEvidence(req, student, evidences);

    if (existing || ev.evidenceCount > 0) {
      matchedSkills.push(req);
      const conf = Math.max(existing?.confidence || 0.5, ev.confidence);
      if (conf < 0.6) {
        weakSkills.push(req);
        earnedSkillPoints += 0.6; // partial
      } else {
        earnedSkillPoints += 1.0;
      }
      if (ev.reasons.length > 0) {
        explanations.push(`Strong ${req} evidence (${ev.reasons.join(', ')})`);
      }
    } else {
      missingSkills.push(req);
    }
  });

  preferred.forEach(pref => {
    totalSkillPoints += 0.4;
    const prefLower = pref.toLowerCase();
    if (studentSkillMap.has(prefLower)) {
      earnedSkillPoints += 0.4;
      explanations.push(`Bonus preferred skill matched: ${pref}`);
    }
  });

  const skillMatch = totalSkillPoints > 0 ? Math.round((earnedSkillPoints / totalSkillPoints) * 100) : 100;

  // 2. Evidence Strength (20% weight)
  let evidenceScore = 50;
  const verifiedCount = (student.skills || []).filter(s => s.confidence >= 0.75).length;
  const projectCount = (student.projects || []).length;
  const hackathonCount = (student.hackathons || []).length;
  const certCount = (student.certifications || []).length;
  evidenceScore = Math.min(100, Math.round(verifiedCount * 12 + projectCount * 10 + hackathonCount * 15 + certCount * 12));
  if (projectCount >= 2) explanations.push(`${projectCount} projects verified against required tech stack`);
  if (hackathonCount > 0) explanations.push(`${hackathonCount} hackathon build(s) showcasing applied execution`);

  // 3. Assessment Score (15% weight)
  let assessmentScore = 70; // baseline if no assessment required
  if (job.assessmentRequired) {
    if (assessmentAttempt) {
      assessmentScore = assessmentAttempt.score;
      if (assessmentAttempt.passed) {
        explanations.push(`Passed required assessment with ${assessmentAttempt.score}%`);
      } else {
        explanations.push(`Required assessment not yet met (${assessmentAttempt.score}% vs ${job.minimumAssessmentScore || 60}% required)`);
      }
    } else {
      assessmentScore = 0;
      explanations.push(`Mandatory assessment required before applying`);
    }
  } else {
    // Check if platform assessments exist
    const platformAssessments = evidences.filter(e => e.sourceType === 'assessment');
    if (platformAssessments.length > 0) {
      assessmentScore = 85;
      explanations.push(`${platformAssessments.length} verified platform technical assessment(s)`);
    }
  }

  // 4. Project Relevance (10% weight)
  let projectScore = 30;
  const jobSkillTerms = [...required, ...preferred].map(s => s.toLowerCase());
  const relevantProjects = (student.projects || []).filter(p =>
    (p.technologies || []).some(t => {
      const rawTech = typeof t === 'string' ? t : ((t as any)?.name || '');
      return jobSkillTerms.includes(rawTech.toLowerCase());
    })
  );
  projectScore = Math.min(100, Math.max(30, relevantProjects.length * 40));
  if (relevantProjects.length > 0) {
    explanations.push(`Direct project relevance: ${relevantProjects.map(p => p.name || p.title || 'Project').join(', ')}`);
  }

  // 5. Career Alignment (10% weight)
  let careerAlignment = 60;
  if (student.careerGoal && job.title) {
    const goalLower = student.careerGoal.toLowerCase();
    const titleLower = job.title.toLowerCase();
    if (titleLower.includes(goalLower) || goalLower.includes(titleLower.split(' ')[0])) {
      careerAlignment = 95;
      explanations.push(`High career alignment: Candidate target role aligns directly with ${job.title}`);
    } else {
      careerAlignment = 75;
    }
  }

  // 6. Experience (5% weight)
  let experienceScore = 50;
  const expCount = (student.experience || []).length;
  const freelanceCount = (student.freelanceWork || []).length;
  experienceScore = Math.min(100, Math.max(40, expCount * 30 + freelanceCount * 20));

  // 7. Education (5% weight)
  let educationScore = 75;
  if (student.cgpa) {
    educationScore = Math.min(100, Math.round((student.cgpa / 10) * 100));
  }

  // Weighted composite score calculation:
  // 35% Skill Match, 20% Evidence, 15% Assessment, 10% Project, 10% Career Alignment, 5% Experience, 5% Education
  const overallMatch = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        skillMatch * 0.35 +
        evidenceScore * 0.20 +
        assessmentScore * 0.15 +
        projectScore * 0.10 +
        careerAlignment * 0.10 +
        experienceScore * 0.05 +
        educationScore * 0.05
      )
    )
  );

  return {
    overallMatch,
    skillMatch,
    evidenceScore,
    assessmentScore,
    projectScore,
    careerAlignment,
    experienceScore,
    educationScore,
    matchedSkills,
    missingSkills,
    weakSkills,
    explanations
  };
}
