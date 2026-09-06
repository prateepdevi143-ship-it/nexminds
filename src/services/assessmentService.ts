// Assessment Evaluation Service
// Evaluates quizzes, calculates score percentages, and computes confidence updates.

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  skill: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  explanation?: string;
}

export interface AssessmentResult {
  skill: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  passed: boolean;
  newConfidenceLevel: number; // 0.0 - 1.0
  feedback: string;
}

export const assessmentService = {
  evaluateAssessment(
    skill: string,
    questions: QuizQuestion[],
    userAnswers: Record<string, number>
  ): AssessmentResult {
    let correctCount = 0;
    const total = questions.length;

    questions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected !== undefined && selected === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed = scorePercentage >= 70;

    // Calculate new confidence based on quiz score
    // 100% -> 0.95, 80% -> 0.85, 70% -> 0.75, <70% -> proportional
    const newConfidenceLevel = Math.max(0.35, Math.min(0.98, Math.round((0.50 + (scorePercentage / 100) * 0.45) * 100) / 100));

    let feedback = '';
    if (scorePercentage >= 90) {
      feedback = `Outstanding demonstration of ${skill} principles. Your verified proficiency score has been updated to ${scorePercentage}%.`;
    } else if (scorePercentage >= 70) {
      feedback = `Solid mastery of core ${skill} concepts. Passed with ${scorePercentage}%.`;
    } else {
      feedback = `Scored ${scorePercentage}%. Review recommended learning modules before retaking to elevate skill confidence.`;
    }

    return {
      skill,
      totalQuestions: total,
      correctAnswers: correctCount,
      scorePercentage,
      passed,
      newConfidenceLevel,
      feedback
    };
  }
};
