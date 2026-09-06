// Job Matching Service
// Performs multi-dimensional alignment between a student candidate and an employer job requisition.

import { skillMatchingService } from './skillMatchingService';
import { Student, Job, StudentSkill, SkillEvidence } from '../types';

export interface DetailedJobMatchResult {
  overallScore: number; // 0 - 100
  skillMatchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  weakSkills: string[];
  educationScore: number;
  experienceScore: number;
  evidenceStrengthBonus: number;
  explanation: string;
  hireabilityBand: 'Immediate Contender' | 'Competitive' | 'Promising with Upskilling' | 'Under-Qualified';
}

export const jobMatchingService = {
  calculateMatch(
    student: Partial<Student>,
    job: Partial<Job>,
    evidences: SkillEvidence[] = []
  ): DetailedJobMatchResult {
    const studentSkills: (string | StudentSkill)[] = student.skills || [];
    const required = job.requiredSkills || [];
    const preferred = job.preferredSkills || [];

    // 1. Skill Match Alignment
    const skillResult = skillMatchingService.calculateMatch(studentSkills, required, preferred);

    // 2. Education alignment
    let educationScore = 80;
    if (student.cgpa) {
      // Scale CGPA 7.0 - 9.5 to 70 - 98
      educationScore = Math.min(98, Math.max(65, Math.round(student.cgpa * 10.5)));
    }

    // 3. Experience alignment
    const expCount = (student.experience || []).length;
    const projectCount = (student.projects || []).length;
    let experienceScore = Math.min(95, 60 + expCount * 12 + projectCount * 6);

    // 4. Evidence Verification Bonus
    // Verified evidence across required skills grants up to +8 bonus points
    const verifiedEvidenceCount = evidences.filter(e => (e.verified ?? (e.confidence >= 0.8)) && required.some(r => r.toLowerCase() === (e.skillName || e.skill || '').toLowerCase())).length;
    const evidenceBonus = Math.min(8, verifiedEvidenceCount * 2);

    // Weighted composite: Skills (65%), Experience/Projects (20%), Education/Academics (15%) + Evidence Bonus
    const composite = (
      skillResult.matchScore * 0.65 +
      experienceScore * 0.20 +
      educationScore * 0.15
    ) + evidenceBonus;

    const overallScore = Math.min(100, Math.max(15, Math.round(composite)));

    let hireabilityBand: DetailedJobMatchResult['hireabilityBand'] = 'Promising with Upskilling';
    if (overallScore >= 84) hireabilityBand = 'Immediate Contender';
    else if (overallScore >= 72) hireabilityBand = 'Competitive';
    else if (overallScore >= 55) hireabilityBand = 'Promising with Upskilling';
    else hireabilityBand = 'Under-Qualified';

    return {
      overallScore,
      skillMatchScore: skillResult.matchScore,
      matchedSkills: skillResult.matchedSkills,
      missingSkills: skillResult.missingSkills,
      weakSkills: skillResult.weakSkills,
      educationScore,
      experienceScore,
      evidenceStrengthBonus: evidenceBonus,
      explanation: `${student.name || 'Candidate'} scored ${overallScore}% fit. Matched ${skillResult.matchedSkills.length}/${required.length} required competencies with ${hireabilityBand.toLowerCase()} rating.`,
      hireabilityBand
    };
  }
};
