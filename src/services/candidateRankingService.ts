// Candidate Ranking Service
// Evaluates and ranks candidate applicants for employer job postings.

import { jobMatchingService, DetailedJobMatchResult } from './jobMatchingService';
import { Student, Job, SkillEvidence } from '../types';

export interface RankedCandidate {
  student: Student;
  rank: number;
  matchResult: DetailedJobMatchResult;
  evidenceCount: number;
  readinessScore: number;
}

export const candidateRankingService = {
  rankCandidatesForJob(
    candidates: Student[],
    job: Job,
    allEvidences: SkillEvidence[] = []
  ): RankedCandidate[] {
    const scored = candidates.map(student => {
      const studentEvidences = allEvidences.filter(e => e.studentId === student.id);
      const matchResult = jobMatchingService.calculateMatch(student, job, studentEvidences);
      return {
        student,
        rank: 0,
        matchResult,
        evidenceCount: studentEvidences.length,
        readinessScore: student.careerReadinessScore || 75
      };
    });

    // Sort descending by overall match score, tie-break by readinessScore and evidenceCount
    scored.sort((a, b) => {
      if (b.matchResult.overallScore !== a.matchResult.overallScore) {
        return b.matchResult.overallScore - a.matchResult.overallScore;
      }
      if (b.readinessScore !== a.readinessScore) {
        return b.readinessScore - a.readinessScore;
      }
      return b.evidenceCount - a.evidenceCount;
    });

    return scored.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }
};
