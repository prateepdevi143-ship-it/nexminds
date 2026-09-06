// ATS Resume Evaluation Service
// Evaluates resume text or student profile across standard ATS parsing criteria:
// Keyword density (30%), Section completeness (20%), Measurable impact (25%), Readability (15%), Contact info (10%).

import { Student } from '../types';

export interface ATSEvaluationResult {
  overallScore: number; // 0 - 100
  rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Issues';
  breakdown: {
    keywordDensity: { score: number; max: 30 };
    sectionCompleteness: { score: number; max: 20 };
    measurableImpact: { score: number; max: 25 };
    formattingReadability: { score: number; max: 15 };
    contactInfo: { score: number; max: 10 };
  };
  detectedActionVerbs: string[];
  metricsFoundCount: number;
  criticalFixes: string[];
  recommendedImprovements: string[];
}

export const atsService = {
  evaluateProfile(student: Student, targetSkills: string[] = []): ATSEvaluationResult {
    // 1. Keyword density (max 30)
    const skillsCount = (student.skills || []).length;
    let keywordScore = Math.min(30, Math.round((skillsCount / 8) * 30));
    if (targetSkills.length > 0) {
      const studentSkillNames = (student.skills || []).map(s => s.name.toLowerCase());
      const matchedTargetCount = targetSkills.filter(t => studentSkillNames.includes(t.toLowerCase())).length;
      keywordScore = Math.min(30, Math.round((matchedTargetCount / Math.max(1, targetSkills.length)) * 30));
    }

    // 2. Section completeness (max 20)
    let sectionScore = 0;
    if (student.name && student.email) sectionScore += 4;
    if (student.college && student.degree) sectionScore += 4;
    if ((student.projects || []).length > 0) sectionScore += 5;
    if ((student.experience || []).length > 0) sectionScore += 4;
    if ((student.certifications || []).length > 0) sectionScore += 3;
    sectionScore = Math.min(20, sectionScore);

    // 3. Measurable impact metrics / Action verbs (max 25)
    const allText = [
      student.bio || '',
      ...(student.projects || []).map(p => `${p.title} ${p.description || ''}`),
      ...(student.experience || []).map(e => `${e.role} ${e.description || ''}`)
    ].join(' ').toLowerCase();

    const ACTION_VERBS = [
      'developed', 'built', 'engineered', 'architected', 'optimized',
      'implemented', 'deployed', 'reduced', 'increased', 'led', 'designed',
      'scaled', 'automated', 'integrated', 'refactored', 'analyzed'
    ];

    const detectedActionVerbs = ACTION_VERBS.filter(verb => allText.includes(verb));
    // Check for numbers or percentages (measurable impact)
    const numberMatches = allText.match(/\d+[%kKmMxX]?|\b\d+\b/g) || [];
    const metricsFoundCount = numberMatches.length;

    let impactScore = Math.min(25, detectedActionVerbs.length * 2 + Math.min(10, metricsFoundCount * 2));

    // 4. Formatting & Readability (max 15)
    let readabilityScore = 13;
    if (student.bio && student.bio.length > 300) readabilityScore = 11; // overly verbose
    if (!student.bio || student.bio.length < 50) readabilityScore = 9; // too short

    // 5. Contact Info (max 10)
    let contactScore = 0;
    if (student.email) contactScore += 3;
    if (student.phone) contactScore += 3;
    if (student.location) contactScore += 2;
    if (student.github || student.linkedin) contactScore += 2;

    const overallScore = Math.min(100, Math.max(20, keywordScore + sectionScore + impactScore + readabilityScore + contactScore));

    let rating: ATSEvaluationResult['rating'] = 'Good';
    if (overallScore >= 85) rating = 'Excellent';
    else if (overallScore >= 70) rating = 'Good';
    else if (overallScore >= 50) rating = 'Needs Improvement';
    else rating = 'Critical Issues';

    const criticalFixes: string[] = [];
    const recommendedImprovements: string[] = [];

    if (metricsFoundCount < 2) {
      criticalFixes.push('Quantify project outcomes with numerical metrics (e.g., "improved latency by 28%", "served 10k+ requests").');
    }
    if (detectedActionVerbs.length < 3) {
      criticalFixes.push('Begin bullet points with strong technical action verbs (e.g., "Architected", "Engineered", "Deployed").');
    }
    if ((student.projects || []).length < 2) {
      recommendedImprovements.push('Add at least 2 full-stack or domain-specific capstone projects with live repository links.');
    }
    if (!student.linkedin && !student.github) {
      recommendedImprovements.push('Include professional profiles (GitHub, LinkedIn, or personal portfolio URL).');
    }

    return {
      overallScore,
      rating,
      breakdown: {
        keywordDensity: { score: keywordScore, max: 30 },
        sectionCompleteness: { score: sectionScore, max: 20 },
        measurableImpact: { score: impactScore, max: 25 },
        formattingReadability: { score: readabilityScore, max: 15 },
        contactInfo: { score: contactScore, max: 10 }
      },
      detectedActionVerbs,
      metricsFoundCount,
      criticalFixes,
      recommendedImprovements
    };
  }
};
