// Career GPS Service
// Generates personalized chronological milestones and career progression paths.

import { Student, CareerGoal } from '../types';
import { skillGapService } from './skillGapService';

export interface Milestone {
  id: string;
  stepNumber: number;
  title: string;
  skill: string;
  estimatedWeeks: number;
  status: 'completed' | 'in_progress' | 'upcoming';
  description: string;
  deliverable: string;
}

export interface CareerGPSPlan {
  targetTitle: string;
  currentReadiness: number;
  projectedReadiness: number;
  totalWeeks: number;
  milestones: Milestone[];
  nextImmediateStep: string;
}

export const careerGPSService = {
  generateGPSPlan(student: Student, targetCareer: CareerGoal | null): CareerGPSPlan {
    const targetTitle = targetCareer ? targetCareer.title : 'Software Engineer';
    const targetSkills = targetCareer ? targetCareer.requiredSkills : ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'];

    const gapAnalysis = skillGapService.analyzeGaps(student.skills || [], targetSkills, targetTitle);

    let cumulativeWeeks = 0;
    const milestones: Milestone[] = [];

    // Add completed milestones for already matched skills
    gapAnalysis.matchedSkills.slice(0, 3).forEach((skill, idx) => {
      milestones.push({
        id: `ms_comp_${idx}`,
        stepNumber: idx + 1,
        title: `Mastered ${skill} Competency`,
        skill,
        estimatedWeeks: 0,
        status: 'completed',
        description: `Verified proficiency demonstrated in ${skill}.`,
        deliverable: 'Verified code and assessment proof'
      });
    });

    // Add upcoming milestones for missing skills
    gapAnalysis.missingSkills.forEach((gap, idx) => {
      const stepNo = milestones.length + 1;
      const isFirst = idx === 0;
      cumulativeWeeks += gap.estimatedWeeks;

      milestones.push({
        id: `ms_gap_${idx}`,
        stepNumber: stepNo,
        title: `Acquire ${gap.skill} Fundamentals & Build Project`,
        skill: gap.skill,
        estimatedWeeks: gap.estimatedWeeks,
        status: isFirst ? 'in_progress' : 'upcoming',
        description: `Complete targeted exercises in ${gap.skill} with verifiable practical implementation.`,
        deliverable: `Production-ready capstone module demonstrating ${gap.skill}`
      });
    });

    const currentReadiness = student.careerReadinessScore || gapAnalysis.readinessBenchmark;
    const projectedReadiness = Math.min(96, currentReadiness + Math.min(30, gapAnalysis.missingSkills.length * 6));

    const nextImmediateStep = gapAnalysis.missingSkills.length > 0
      ? `Focus on ${gapAnalysis.missingSkills[0].skill} to close your primary critical gap.`
      : 'Maintain skill freshness and start applying to matched open requisitions.';

    return {
      targetTitle,
      currentReadiness,
      projectedReadiness,
      totalWeeks: cumulativeWeeks || 4,
      milestones,
      nextImmediateStep
    };
  }
};
