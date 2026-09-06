// Skill ROI & One-Skill-Away Engine
// Calculates potential match improvement and return on learning investment for each gap.

import { skillMatchingService } from './skillMatchingService';
import { StudentSkill } from '../types';

export interface OneSkillAwaySimulation {
  skill: string;
  currentMatchScore: number;
  projectedMatchScore: number;
  deltaImprovement: number;
  roiPriority: number; // 0 - 100
  estimatedWeeks: number;
  marketOpeningsUnlocked: number;
  recommendationReason: string;
}

export const skillROIService = {
  simulateOneSkillAway(
    studentSkills: (string | StudentSkill)[],
    targetSkills: string[],
    activeOpeningsCount: number = 10
  ): OneSkillAwaySimulation[] {
    const currentBase = skillMatchingService.calculateMatch(studentSkills, targetSkills);
    const missing = currentBase.missingSkills;

    const simulations: OneSkillAwaySimulation[] = missing.map(missingSkill => {
      // Simulate acquiring this skill at proficient level (0.85 confidence)
      const simulatedSkills = [...studentSkills, { name: missingSkill, confidence: 0.85 } as StudentSkill];
      const projected = skillMatchingService.calculateMatch(simulatedSkills, targetSkills);
      const delta = projected.matchScore - currentBase.matchScore;

      // Realistic effort & market factor
      const isHighLeverage = ['TensorFlow', 'Docker', 'AWS', 'React', 'Node.js', 'PyTorch', 'Spring Boot'].includes(missingSkill);
      const weeks = isHighLeverage ? 4 : 2;
      const unlocked = Math.max(1, Math.round(activeOpeningsCount * (delta / 25)));

      // ROI formula: Delta score (40%) + Market impact (35%) + Ease factor (25%)
      const roiPriority = Math.min(99, Math.max(45, Math.round(delta * 2.8 + (isHighLeverage ? 30 : 20) + (10 - weeks) * 2)));

      return {
        skill: missingSkill,
        currentMatchScore: currentBase.matchScore,
        projectedMatchScore: projected.matchScore,
        deltaImprovement: delta,
        roiPriority,
        estimatedWeeks: weeks,
        marketOpeningsUnlocked: unlocked,
        recommendationReason: `Acquiring ${missingSkill} raises target match by +${delta}% and unlocks approximately ${unlocked} matching job requisitions.`
      };
    });

    return simulations.sort((a, b) => b.deltaImprovement - a.deltaImprovement);
  }
};
