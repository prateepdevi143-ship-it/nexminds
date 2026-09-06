// Skill Evidence Service
// Computes skill strength & confidence dynamically from multi-source verification:
// Resume, Projects, Assessments, Courses, Certifications, and Freshness Decay.

import { skillFreshnessService } from './skillFreshnessService';

export interface SkillEvidenceInput {
  skill: string;
  resumeScore?: number; // 0 - 100
  projectScore?: number; // 0 - 100
  assessmentScore?: number; // 0 - 100
  courseScore?: number; // 0 - 100
  experienceScore?: number; // 0 - 100
  certificationScore?: number; // 0 - 100
  lastDemonstrated?: string;
  verified?: boolean;
}

export interface CalculatedSkillConfidence {
  skill: string;
  confidenceScore: number; // 0 - 100
  confidenceDecimal: number; // 0.0 - 1.0
  levelLabel: 'Novice' | 'Intermediate' | 'Proficient' | 'Advanced' | 'Expert';
  freshnessMultiplier: number;
  sourcesCount: number;
  breakdown: {
    resume: number;
    project: number;
    assessment: number;
    course: number;
    experience: number;
    certification: number;
    freshnessDecay: number;
  };
}

export const skillEvidenceService = {
  calculateSkillConfidence(input: SkillEvidenceInput): CalculatedSkillConfidence {
    const resume = input.resumeScore ?? 50;
    const project = input.projectScore ?? 0;
    const assessment = input.assessmentScore ?? 0;
    const course = input.courseScore ?? 0;
    const experience = input.experienceScore ?? 0;
    const cert = input.certificationScore ?? 0;

    let totalWeight = 0;
    let weightedSum = 0;
    let sourcesCount = 0;

    if (input.resumeScore !== undefined) {
      weightedSum += resume * 0.15;
      totalWeight += 0.15;
      sourcesCount++;
    }
    if (input.projectScore !== undefined && input.projectScore > 0) {
      weightedSum += project * 0.30;
      totalWeight += 0.30;
      sourcesCount++;
    }
    if (input.assessmentScore !== undefined && input.assessmentScore > 0) {
      weightedSum += assessment * 0.25;
      totalWeight += 0.25;
      sourcesCount++;
    }
    if (input.courseScore !== undefined && input.courseScore > 0) {
      weightedSum += course * 0.15;
      totalWeight += 0.15;
      sourcesCount++;
    }
    if (input.experienceScore !== undefined && input.experienceScore > 0) {
      weightedSum += experience * 0.25;
      totalWeight += 0.25;
      sourcesCount++;
    }
    if (input.certificationScore !== undefined && input.certificationScore > 0) {
      weightedSum += cert * 0.15;
      totalWeight += 0.15;
      sourcesCount++;
    }

    // Default weight if no secondary evidence
    if (totalWeight === 0) {
      weightedSum = resume;
      totalWeight = 1.0;
      sourcesCount = 1;
    }

    const baseScore = weightedSum / totalWeight;

    // Apply freshness decay
    const freshness = skillFreshnessService.calculateFreshness(input.lastDemonstrated || new Date().toISOString());
    const finalScore = Math.min(100, Math.max(25, Math.round(baseScore * freshness.freshnessMultiplier)));

    let levelLabel: 'Novice' | 'Intermediate' | 'Proficient' | 'Advanced' | 'Expert' = 'Intermediate';
    if (finalScore >= 88) levelLabel = 'Expert';
    else if (finalScore >= 78) levelLabel = 'Advanced';
    else if (finalScore >= 65) levelLabel = 'Proficient';
    else if (finalScore >= 45) levelLabel = 'Intermediate';
    else levelLabel = 'Novice';

    return {
      skill: input.skill,
      confidenceScore: finalScore,
      confidenceDecimal: Math.round((finalScore / 100) * 100) / 100,
      levelLabel,
      freshnessMultiplier: freshness.freshnessMultiplier,
      sourcesCount,
      breakdown: {
        resume,
        project,
        assessment,
        course,
        experience,
        certification: cert,
        freshnessDecay: freshness.freshnessMultiplier
      }
    };
  }
};
