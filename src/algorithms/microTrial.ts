import {
  ProofOfWorkBreakdown,
  MicroTrial,
  MicroTrialEvaluation,
  Student,
  Job,
  SkillEvidence
} from '../types';
import { normalizeSkill, calculateSkillConfidenceFromEvidence, calculateOpportunityMatch } from './matching';

/**
 * CENTRALIZED PROOF-OF-WORK FORMULA CONFIGURATION
 * Proof-of-Work Score represents demonstrated practical capability.
 */
export const PROOF_OF_WORK_WEIGHTS = {
  correctness: 0.35,
  taskCompletion: 0.20,
  problemSolving: 0.20,
  codeQuality: 0.15,
  technicalReasoning: 0.10
} as const;

export interface RawPoWInput {
  correctness: number; // 0 - 100
  taskCompletion: number; // 0 - 100
  problemSolving: number; // 0 - 100
  codeQuality: number; // 0 - 100
  technicalReasoning: number; // 0 - 100
}

/**
 * Calculates the Proof-of-Work Score according to centralized weights.
 */
export function calculateProofOfWorkScore(metrics: RawPoWInput): ProofOfWorkBreakdown {
  const clamp = (v: number) => Math.min(100, Math.max(0, Math.round(v)));

  const correctness = clamp(metrics.correctness);
  const taskCompletion = clamp(metrics.taskCompletion);
  const problemSolving = clamp(metrics.problemSolving);
  const codeQuality = clamp(metrics.codeQuality);
  const technicalReasoning = clamp(metrics.technicalReasoning);

  const proofOfWorkScore = Math.round(
    correctness * PROOF_OF_WORK_WEIGHTS.correctness +
    taskCompletion * PROOF_OF_WORK_WEIGHTS.taskCompletion +
    problemSolving * PROOF_OF_WORK_WEIGHTS.problemSolving +
    codeQuality * PROOF_OF_WORK_WEIGHTS.codeQuality +
    technicalReasoning * PROOF_OF_WORK_WEIGHTS.technicalReasoning
  );

  return {
    correctness,
    taskCompletion,
    problemSolving,
    codeQuality,
    technicalReasoning,
    proofOfWorkScore: Math.min(100, Math.max(0, proofOfWorkScore))
  };
}

/**
 * Weighted Bayesian/Evidence aggregation for updating skill confidence.
 * Does not merely overwrite existing score, but aggregates:
 * Previous confidence + new practical micro-trial evidence (high weight) + assessment + freshness
 */
export function calculateUpdatedSkillConfidence(
  currentConfidence: number = 0.5,
  trialSkillScore: number, // 0 - 100
  previousEvidenceCount: number = 1
): { newConfidence: number; percentageIncrease: number } {
  // Convert 0-100 score to 0-1 scale
  const trialEvidenceConfidence = trialSkillScore / 100;

  // Practical micro-trial holds strong empirical weight (0.45 weight for practical demonstration)
  // Weight decreases slightly if candidate already has 5+ rigorous verified artifacts, but remains authoritative
  const trialWeight = Math.min(0.50, Math.max(0.35, 0.50 - (previousEvidenceCount * 0.02)));
  const existingWeight = 1.0 - trialWeight;

  const aggregated = (currentConfidence * existingWeight) + (trialEvidenceConfidence * trialWeight);
  const newConfidence = Math.min(1.0, Math.max(0.1, Math.round(aggregated * 100) / 100));
  const percentageIncrease = Math.max(0, Math.round((newConfidence - currentConfidence) * 100));

  return { newConfidence, percentageIncrease };
}

/**
 * Calculates Job Match Score Before and After passing a Micro-Trial.
 */
export function calculateMatchImprovement(
  student: Student,
  job: Job,
  trial: MicroTrial,
  evaluation: MicroTrialEvaluation,
  existingEvidences: SkillEvidence[] = []
): {
  matchBefore: number;
  matchAfter: number;
  improvement: number;
  strengthenedSkills: Array<{ skill: string; before: number; after: number; delta: number }>;
} {
  // 1. Calculate baseline match before trial
  const baselineBreakdown = calculateOpportunityMatch(student, job, existingEvidences);
  const matchBefore = baselineBreakdown.overallMatch;

  // 2. Synthesize virtual evidence representing the completed micro-trial
  const syntheticEvidence: SkillEvidence[] = [
    ...existingEvidences,
    ...trial.requiredSkills.map((sk, idx) => ({
      id: `syn_ev_${trial.id}_${idx}`,
      studentId: student.id,
      skill: normalizeSkill(sk),
      sourceType: 'micro-trial',
      type: 'micro-trial',
      sourceTitle: `Micro-Trial: ${trial.title}`,
      title: `Micro-Trial: ${trial.title}`,
      confidence: Math.min(1.0, Math.max(0.65, (evaluation.proofOfWorkScore || 85) / 100)),
      date: new Date().toISOString(),
      details: `Demonstrated ${sk} in practical task with Proof-of-Work score of ${evaluation.proofOfWorkScore}%`,
      verified: true,
      verificationScore: evaluation.proofOfWorkScore
    }))
  ];

  // 3. Synthesize updated student skills
  const updatedStudent: Student = {
    ...student,
    skills: (student.skills || []).map(s => {
      const sName = typeof s === 'string' ? s : s.name;
      const normS = normalizeSkill(sName);
      const isTrialSkill = trial.requiredSkills.some(ts => normalizeSkill(ts).toLowerCase() === normS.toLowerCase());
      if (isTrialSkill) {
        const skillScore = evaluation.skillScores[sName] || evaluation.skillScores[normS] || evaluation.proofOfWorkScore || 85;
        const currentConf = typeof s === 'string' ? 0.6 : (s.confidence || 0.6);
        const { newConfidence } = calculateUpdatedSkillConfidence(currentConf, skillScore, 2);
        return typeof s === 'string'
          ? { id: `s_${normS}`, name: normS, confidence: newConfidence, level: Math.round(newConfidence * 100), freshness: 'recent' as const, evidenceCount: 3, lastDemonstrated: new Date().toISOString() }
          : { ...s, confidence: newConfidence, level: Math.round(newConfidence * 100), freshness: 'recent' as const, evidenceCount: (s.evidenceCount || 1) + 1, lastDemonstrated: new Date().toISOString() };
      }
      return s;
    })
  };

  // Add any trial required skills that weren't in student's profile yet
  trial.requiredSkills.forEach(req => {
    const normReq = normalizeSkill(req);
    const hasIt = (updatedStudent.skills || []).some(s => {
      const sName = typeof s === 'string' ? s : s.name;
      return normalizeSkill(sName).toLowerCase() === normReq.toLowerCase();
    });
    if (!hasIt) {
      const score = evaluation.skillScores[normReq] || evaluation.proofOfWorkScore || 80;
      const conf = Math.min(0.95, Math.max(0.70, score / 100));
      (updatedStudent.skills as any[]).push({
        id: `s_new_${normReq}`,
        name: normReq,
        confidence: conf,
        level: Math.round(conf * 100),
        freshness: 'recent',
        evidenceCount: 1,
        lastDemonstrated: new Date().toISOString()
      });
    }
  });

  const postBreakdown = calculateOpportunityMatch(updatedStudent, job, syntheticEvidence);
  const matchAfter = Math.max(matchBefore, postBreakdown.overallMatch);
  const improvement = matchAfter - matchBefore;

  // Strengthened skills breakdown
  const strengthenedSkills = trial.requiredSkills.map(sk => {
    const norm = normalizeSkill(sk);
    const oldSkill = (student.skills || []).find(s => {
      const name = typeof s === 'string' ? s : s.name;
      return normalizeSkill(name).toLowerCase() === norm.toLowerCase();
    });
    const beforeConf = oldSkill ? (typeof oldSkill === 'string' ? 60 : Math.round(oldSkill.confidence * 100)) : 45;
    const score = evaluation.skillScores[norm] || evaluation.skillScores[sk] || evaluation.proofOfWorkScore || 85;
    const { newConfidence } = calculateUpdatedSkillConfidence(beforeConf / 100, score, 2);
    const afterConf = Math.round(newConfidence * 100);
    return {
      skill: norm,
      before: beforeConf,
      after: afterConf,
      delta: Math.max(1, afterConf - beforeConf)
    };
  });

  return {
    matchBefore,
    matchAfter,
    improvement,
    strengthenedSkills
  };
}

/**
 * Links One-Skill-Away identified gap to a recommended practical Micro-Trial.
 */
export function getRecommendedTrialForSkillGap(
  skillName: string,
  availableTrials: MicroTrial[]
): MicroTrial | null {
  const normTarget = normalizeSkill(skillName).toLowerCase();
  const directMatch = availableTrials.find(t =>
    t.status === 'published' &&
    t.requiredSkills.some(s => normalizeSkill(s).toLowerCase() === normTarget)
  );
  if (directMatch) return directMatch;

  // Fallback to preferred skills
  return availableTrials.find(t =>
    t.status === 'published' &&
    (t.preferredSkills || []).some(s => normalizeSkill(s).toLowerCase() === normTarget)
  ) || null;
}
