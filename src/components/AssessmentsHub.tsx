import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { Assessment } from '../types';
import { api } from '../services/api';

interface AssessmentsHubProps {
  initialSkill?: string;
  onRefreshProfile: () => void;
  onSelectTab: (tab: string) => void;
}

export const AssessmentsHub: React.FC<AssessmentsHubProps> = ({
  initialSkill,
  onRefreshProfile,
  onSelectTab
}) => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    if (initialSkill && assessments.length > 0) {
      const match = assessments.find(
        a => a.skillName.toLowerCase() === initialSkill.toLowerCase()
      );
      if (match) {
        startAssessment(match.id);
      }
    }
  }, [initialSkill, assessments]);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const list = await api.getAssessments();
      setAssessments(list);
    } catch (err) {
      console.error('Failed to load assessments', err);
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (id: string) => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const data = await api.getAssessment(id);
      setActiveAssessment(data);
    } catch (err) {
      console.error('Failed to get assessment', err);
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (qId: string, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmit = async () => {
    if (!activeAssessment) return;
    setSubmitting(true);
    try {
      const res = await api.submitAssessment(activeAssessment.id, answers);
      setResult(res);
      if (res.passed) {
        onRefreshProfile();
      }
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Skill Assessments
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Take short technical quizzes to test your proficiency. Passing scores (70%+) add verified evidence to your profile.
        </p>
      </div>

      {!activeAssessment ? (
        /* Assessment Catalog */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {assessments.map(assm => (
            <motion.div
              key={assm.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {assm.skillName}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{assm.durationMinutes} mins</span>
                  </div>
                </div>

                <h3 className="font-semibold text-base text-slate-900">{assm.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{assm.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{assm.questionCount} Questions</span>
                <button
                  id={`btn-start-test-${assm.id}`}
                  onClick={() => startAssessment(assm.id)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
                >
                  Start Assessment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : result ? (
        /* Result Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-2xl mx-auto p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6"
        >
          <div className="text-center space-y-2.5">
            <div
              className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${
                result.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {result.passed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              {result.passed ? 'Assessment Passed' : 'Assessment Not Passed'}
            </h3>

            <p className="text-sm text-slate-600">
              Score: <span className="font-bold text-slate-900">{result.score}%</span> ({result.correctCount} of {result.totalQuestions} questions correct).
            </p>

            {result.passed ? (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed">
                Skill verification evidence has been added to your profile! Your job match recommendations have been updated.
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs">
                Passing grade is 70%. Review the explanations below and feel free to retake when you're ready.
              </div>
            )}
          </div>

          {/* Detailed Question Answers */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
              Answers & Explanations
            </h4>
            {result.results.map((qRes: any, i: number) => (
              <div key={i} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-slate-900">{i + 1}. {qRes.question}</span>
                  {qRes.isCorrect ? (
                    <span className="text-emerald-700 font-semibold shrink-0">Correct ✓</span>
                  ) : (
                    <span className="text-rose-600 font-semibold shrink-0">Incorrect ✕</span>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px] bg-white p-2.5 rounded border border-slate-200/60">
                  <span className="font-semibold text-slate-800">Explanation:</span> {qRes.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setActiveAssessment(null)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Assessments
            </button>
            <button
              onClick={() => onSelectTab('skills-graph')}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>View Skills Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      ) : (
        /* Active Test Form */
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-3xl mx-auto p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                {activeAssessment.skillName} Test
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{activeAssessment.title}</h3>
            </div>
            <button
              onClick={() => setActiveAssessment(null)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Exit
            </button>
          </div>

          {/* Questions list */}
          <div className="space-y-5">
            {activeAssessment.questions.map((q, idx) => (
              <div key={q.id} className="space-y-2.5 p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                <p className="text-xs font-semibold text-slate-900">
                  {idx + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => selectOption(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{opt}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Answered {Object.keys(answers).length} of {activeAssessment.questions.length} questions
            </span>
            <button
              id="btn-submit-assessment"
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < activeAssessment.questions.length}
              className="px-5 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Grading...' : 'Submit Answers'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
