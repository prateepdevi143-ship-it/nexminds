// Skill Matching Service
// Performs mathematical set intersection, difference, and weighted score alignment.

import { skillNormalizationService } from './skillNormalizationService';
import { StudentSkill } from '../types';

export interface SkillMatchOutput {
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  preferredMatched: string[];
  preferredMissing: string[];
  weakSkills: string[];
  explanation: string;
}

export const skillMatchingService = {
  calculateMatch(
    studentSkills: (string | StudentSkill)[],
    requiredSkills: string[],
    preferredSkills: string[] = []
  ): SkillMatchOutput {
    const normRequired = skillNormalizationService.normalizeSkillsList(requiredSkills);
    const normPreferred = skillNormalizationService.normalizeSkillsList(preferredSkills);

    // Map student skills to normalized lowercase keys -> confidence
    const confidenceMap = new Map<string, number>();
    studentSkills.forEach(s => {
      if (typeof s === 'string') {
        confidenceMap.set(skillNormalizationService.normalizeSkill(s).toLowerCase(), 0.8);
      } else {
        confidenceMap.set(skillNormalizationService.normalizeSkill(s.name).toLowerCase(), s.confidence || 0.8);
      }
    });

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    const weakSkills: string[] = [];
    let requiredPointsEarned = 0;

    normRequired.forEach(req => {
      const key = req.toLowerCase();
      if (confidenceMap.has(key)) {
        matchedSkills.push(req);
        const conf = confidenceMap.get(key)!;
        if (conf < 0.65) {
          weakSkills.push(req);
        }
        // Base credit (60%) + evidence confidence scaling (40%)
        requiredPointsEarned += 0.60 + 0.40 * Math.min(1.0, conf);
      } else {
        missingSkills.push(req);
      }
    });

    const preferredMatched: string[] = [];
    const preferredMissing: string[] = [];
    let preferredPointsEarned = 0;

    normPreferred.forEach(pref => {
      const key = pref.toLowerCase();
      if (confidenceMap.has(key)) {
        preferredMatched.push(pref);
        const conf = confidenceMap.get(key)!;
        preferredPointsEarned += 0.60 + 0.40 * Math.min(1.0, conf);
      } else {
        preferredMissing.push(pref);
      }
    });

    const reqTotal = normRequired.length || 1;
    const reqScore = (requiredPointsEarned / reqTotal) * 100;

    const prefTotal = normPreferred.length;
    const prefScore = prefTotal > 0 ? (preferredPointsEarned / prefTotal) * 100 : 100;

    // Weight: 85% required skills, 15% preferred bonus
    let finalScore = 0;
    if (prefTotal > 0) {
      finalScore = Math.round(reqScore * 0.85 + prefScore * 0.15);
    } else {
      finalScore = Math.round(reqScore);
    }

    finalScore = Math.max(10, Math.min(100, finalScore));

    const explanation = missingSkills.length === 0
      ? `Strong alignment across all ${normRequired.length} required competencies with ${preferredMatched.length} preferred bonus skills.`
      : `Matches ${matchedSkills.length} of ${normRequired.length} required skills. Learning ${missingSkills.slice(0, 2).join(', ')} will significantly boost competitiveness.`;

    return {
      matchScore: finalScore,
      matchedSkills,
      missingSkills,
      preferredMatched,
      preferredMissing,
      weakSkills,
      explanation
    };
  }
};
