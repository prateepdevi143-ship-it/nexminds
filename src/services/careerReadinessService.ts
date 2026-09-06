// Career Readiness Index Service
// Computes multi-pillar readiness: Skill coverage (40%), Evidence strength (25%), Assessments (20%), Profile completeness (15%).

import { Student, SkillEvidence, CareerGoal } from '../types';
import { skillMatchingService } from './skillMatchingService';

export interface CareerReadinessBreakdown {
  overallIndex: number; // 0 - 100
  readinessBand: 'Job Ready' | 'Near Ready' | 'Developing' | 'Early Stage';
  components: {
    skillCoverage: { score: number; weight: number; contribution: number };
    evidenceStrength: { score: number; weight: number; contribution: number };
    assessmentPerformance: { score: number; weight: number; contribution: number };
    profileCompleteness: { score: number; weight: number; contribution: number };
  };
  keyRecommendations: string[];
}

export const careerReadinessService = {
  calculateReadiness(
    student: Student,
    targetCareer: CareerGoal | null,
    evidences: SkillEvidence[] = []
  ): CareerReadinessBreakdown {
    // 1. Skill Coverage (40%)
    let skillCoverageScore = 70;
    if (targetCareer && targetCareer.requiredSkills.length > 0) {
      const match = skillMatchingService.calculateMatch(student.skills || [], targetCareer.requiredSkills);
      skillCoverageScore = match.matchScore;
    } else if ((student.skills || []).length > 0) {
      const avgConfidence = student.skills.reduce((sum, s) => sum + (s.confidence || 0.8), 0) / student.skills.length;
      skillCoverageScore = Math.round(avgConfidence * 100);
    }

    // 2. Evidence Strength (25%)
    // Based on count and verified flags
    const verifiedCount = evidences.filter(e => e.verified).length;
    const totalEvidences = evidences.length;
    const evidenceScore = Math.min(100, Math.round(Math.min(1.0, (totalEvidences * 0.15 + verifiedCount * 0.25)) * 100));

    // 3. Assessment Performance (20%)
    // Assessments linked in skills or evidences
    const assessedSkills = (student.skills || []).filter(s => s.evidenceCount > 0);
    let assessmentScore = 65;
    if (assessedSkills.length > 0) {
      assessmentScore = Math.min(100, Math.round(assessedSkills.reduce((sum, s) => sum + (s.confidence * 100), 0) / assessedSkills.length));
    }

    // 4. Profile Completeness (15%)
    let profilePoints = 0;
    if (student.name && student.email) profilePoints += 20;
    if (student.bio && student.bio.length > 20) profilePoints += 20;
    if ((student.projects || []).length > 0) profilePoints += 25;
    if ((student.experience || []).length > 0) profilePoints += 15;
    if ((student.certifications || []).length > 0) profilePoints += 10;
    if (student.college && student.degree) profilePoints += 10;
    const profileCompletenessScore = Math.min(100, profilePoints);

    // Weighted composite
    const c1 = skillCoverageScore * 0.40;
    const c2 = evidenceScore * 0.25;
    const c3 = assessmentScore * 0.20;
    const c4 = profileCompletenessScore * 0.15;

    const overallIndex = Math.min(100, Math.max(20, Math.round(c1 + c2 + c3 + c4)));

    let readinessBand: CareerReadinessBreakdown['readinessBand'] = 'Developing';
    if (overallIndex >= 82) readinessBand = 'Job Ready';
    else if (overallIndex >= 70) readinessBand = 'Near Ready';
    else if (overallIndex >= 50) readinessBand = 'Developing';
    else readinessBand = 'Early Stage';

    const keyRecommendations: string[] = [];
    if (skillCoverageScore < 75) {
      keyRecommendations.push('Bridge primary skill gaps against target career requisitions.');
    }
    if (evidenceScore < 70) {
      keyRecommendations.push('Add GitHub repositories, live demo URLs, or assessment proofs.');
    }
    if (profileCompletenessScore < 80) {
      keyRecommendations.push('Complete project case studies and work experience details.');
    }

    return {
      overallIndex,
      readinessBand,
      components: {
        skillCoverage: { score: skillCoverageScore, weight: 0.40, contribution: Math.round(c1) },
        evidenceStrength: { score: evidenceScore, weight: 0.25, contribution: Math.round(c2) },
        assessmentPerformance: { score: assessmentScore, weight: 0.20, contribution: Math.round(c3) },
        profileCompleteness: { score: profileCompletenessScore, weight: 0.15, contribution: Math.round(c4) }
      },
      keyRecommendations
    };
  }
};
