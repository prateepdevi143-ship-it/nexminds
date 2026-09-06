// Skill Gap Service
// Analyzes technical gaps against target career or requisition requirements.

import { skillMatchingService } from './skillMatchingService';
import { StudentSkill } from '../types';

export interface GapItem {
  skill: string;
  gapSeverity: 'Critical' | 'Moderate' | 'Minor';
  priorityScore: number; // 0 - 100
  marketDemand: number; // 0 - 100
  learningEffort: 'Low' | 'Medium' | 'High';
  estimatedWeeks: number;
}

export interface SkillGapOutput {
  targetCareer: string;
  matchedCount: number;
  totalRequired: number;
  matchedSkills: string[];
  missingSkills: GapItem[];
  weakSkills: string[];
  gapPercentage: number;
  readinessBenchmark: number;
}

export const skillGapService = {
  analyzeGaps(
    studentSkills: (string | StudentSkill)[],
    targetCareerSkills: string[],
    targetCareerTitle: string = 'Target Position'
  ): SkillGapOutput {
    const match = skillMatchingService.calculateMatch(studentSkills, targetCareerSkills);

    const getEffort = (skill: string): { effort: 'Low' | 'Medium' | 'High'; weeks: number } => {
      const low = ['Git', 'HTML', 'CSS', 'Bash/Shell', 'SQL', 'FastAPI', 'Figma'];
      const high = ['Machine Learning', 'Deep Learning', 'Kubernetes', 'Cybersecurity', 'Transformers', 'Spring Boot'];
      if (low.some(s => skill.toLowerCase().includes(s.toLowerCase()))) return { effort: 'Low', weeks: 2 };
      if (high.some(s => skill.toLowerCase().includes(s.toLowerCase()))) return { effort: 'High', weeks: 6 };
      return { effort: 'Medium', weeks: 4 };
    };

    const missingWithDetails: GapItem[] = match.missingSkills.map((skill, index) => {
      const { effort, weeks } = getEffort(skill);
      // Priority depends on position in requirement list + effort invert
      const baseRelevance = Math.max(50, 95 - index * 6);
      const demand = 85;
      const effortPenalty = effort === 'High' ? 15 : effort === 'Medium' ? 8 : 0;
      const priorityScore = Math.round(baseRelevance * 0.5 + demand * 0.35 + (20 - effortPenalty));

      let gapSeverity: 'Critical' | 'Moderate' | 'Minor' = 'Moderate';
      if (index < 2 || priorityScore > 80) gapSeverity = 'Critical';
      else if (priorityScore < 60) gapSeverity = 'Minor';

      return {
        skill,
        gapSeverity,
        priorityScore,
        marketDemand: demand,
        learningEffort: effort,
        estimatedWeeks: weeks
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);

    const totalReq = targetCareerSkills.length || 1;
    const gapPct = Math.round((match.missingSkills.length / totalReq) * 100);

    return {
      targetCareer: targetCareerTitle,
      matchedCount: match.matchedSkills.length,
      totalRequired: totalReq,
      matchedSkills: match.matchedSkills,
      missingSkills: missingWithDetails,
      weakSkills: match.weakSkills,
      gapPercentage: gapPct,
      readinessBenchmark: match.matchScore
    };
  }
};
