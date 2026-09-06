// Resume Analysis Service
// Extracts competencies, evaluates structural completeness, and highlights optimization opportunities.

import { Student, CareerGoal } from '../types';
import { atsService, ATSEvaluationResult } from './atsService';
import { skillNormalizationService } from './skillNormalizationService';

export interface ResumeAnalysisSummary {
  atsScore: number;
  atsResult: ATSEvaluationResult;
  extractedSkillsCount: number;
  extractedSkills: string[];
  missingTargetSkills: string[];
  strengths: string[];
  areasToEnhance: string[];
}

export const resumeAnalysisService = {
  analyzeStudentResume(student: Student, targetCareer: CareerGoal | null): ResumeAnalysisSummary {
    const targetSkills = targetCareer ? targetCareer.requiredSkills : [];
    const atsResult = atsService.evaluateProfile(student, targetSkills);

    const extractedSkills = (student.skills || []).map(s => s.name);
    const normExtracted = new Set(extractedSkills.map(s => s.toLowerCase()));

    const missingTargetSkills = targetSkills.filter(req => !normExtracted.has(skillNormalizationService.normalizeSkill(req).toLowerCase()));

    const strengths: string[] = [];
    const areasToEnhance: string[] = [];

    if (student.cgpa && student.cgpa >= 8.5) {
      strengths.push(`Strong academic record (${student.cgpa} CGPA at ${student.college || 'University'}).`);
    }
    if ((student.projects || []).length >= 2) {
      strengths.push(`Rich project portfolio with ${student.projects.length} documented capstones.`);
    }
    if ((student.certifications || []).length > 0) {
      strengths.push(`Verified credentials from ${student.certifications.map(c => c.issuer || c.provider).join(', ')}.`);
    }

    if (missingTargetSkills.length > 0) {
      areasToEnhance.push(`Add technical competency in ${missingTargetSkills.slice(0, 3).join(', ')}.`);
    }
    if (atsResult.criticalFixes.length > 0) {
      areasToEnhance.push(atsResult.criticalFixes[0]);
    }

    return {
      atsScore: atsResult.overallScore,
      atsResult,
      extractedSkillsCount: extractedSkills.length,
      extractedSkills,
      missingTargetSkills,
      strengths,
      areasToEnhance
    };
  }
};
