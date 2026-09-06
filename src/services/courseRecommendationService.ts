// Course Recommendation Service
// Connects student skill gaps directly to recommended learning modules and tracks progress.

import { Course, StudentSkill } from '../types';
import { skillNormalizationService } from './skillNormalizationService';

export interface RecommendedCourse extends Course {
  relevanceScore: number;
  targetedSkill: string;
  reason: string;
}

export const courseRecommendationService = {
  getRecommendations(
    courses: Course[],
    missingSkills: string[],
    studentSkills: (string | StudentSkill)[] = []
  ): RecommendedCourse[] {
    const normMissing = new Set(missingSkills.map(s => s.toLowerCase()));

    const scored = courses.map(course => {
      const courseSkills = (course.skills || []).map(s => skillNormalizationService.normalizeSkill(s).toLowerCase());
      const targetedMissing = courseSkills.find(s => normMissing.has(s));

      let relevanceScore = 40;
      let targetedSkill = course.skills[0] || 'Software Engineering';
      let reason = 'General foundational career upskilling';

      if (targetedMissing) {
        relevanceScore = 95;
        targetedSkill = skillNormalizationService.normalizeSkill(targetedMissing);
        reason = `Directly closes your verified critical gap in ${targetedSkill}`;
      } else if (courseSkills.length > 0) {
        relevanceScore = 60;
        targetedSkill = course.skills[0];
        reason = `Deepens proficiency in ${targetedSkill}`;
      }

      return {
        ...course,
        relevanceScore,
        targetedSkill,
        reason
      };
    });

    return scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
};
