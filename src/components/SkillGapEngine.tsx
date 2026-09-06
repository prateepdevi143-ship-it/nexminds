import React, { useState, useEffect } from 'react';
import {
  Compass,
  Zap,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { Student, CareerGoal, SkillGapAnalysis, OneSkillAwaySimulation } from '../types';
import { api } from '../services/api';

interface SkillGapEngineProps {
  student: Student;
  targetCareer: CareerGoal;
  onTakeAssessment: (skillName: string) => void;
  onSelectTab: (tab: string) => void;
}

export const SkillGapEngine: React.FC<SkillGapEngineProps> = ({
  student,
  targetCareer,
  onTakeAssessment,
  onSelectTab
}) => {
  const [gapAnalysis, setGapAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [oneSkillAway, setOneSkillAway] = useState<OneSkillAwaySimulation[]>([]);
  const [loading, setLoading] = useState(true);

  // Counterfactual Simulator State
  const [simulatedSkills, setSimulatedSkills] = useState<string[]>(['Docker']);

  useEffect(() => {
    loadGapData();
  }, [student]);

  const loadGapData = async () => {
    setLoading(true);
    try {
      const [gapsRes, osaRes] = await Promise.all([
        api.getGapAnalysis(),
        api.getOneSkillAway()
      ]);
      setGapAnalysis(gapsRes.analysis);
      setOneSkillAway(osaRes);
    } catch (err) {
      console.error('Failed to load gap data', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSimulatedSkill = (skill: string) => {
    setSimulatedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Compute counterfactual simulated match
  const currentSkillsList = (student?.skills || []).map(s => s.name?.toLowerCase());
  const simulatedSet = new Set([...currentSkillsList, ...(simulatedSkills || []).map(s => s.toLowerCase())]);
  const requiredTarget = targetCareer?.requiredSkills || ['Python', 'PyTorch', 'Docker', 'Machine Learning'];
  const simulatedMatchCount = (requiredTarget || []).filter(req => simulatedSet.has(req.toLowerCase())).length;
  const simulatedMatchScore = Math.round((simulatedMatchCount / (requiredTarget.length || 1)) * 100);
  const originalMatchScore = gapAnalysis?.overallMatchScore || 75;
  const matchDelta = simulatedMatchScore - originalMatchScore;

  const availableSimOptions = ['Docker', 'FastAPI', 'Kubernetes', 'Natural Language Processing', 'Deep Learning', 'System Design'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Skill Gaps & Target Analysis
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Evaluate what you need to qualify for <span className="text-slate-800 font-semibold">{targetCareer?.title || 'AI Engineer'}</span>.
        </p>
      </div>

      {/* One-Skill-Away Engine Highlight Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-indigo-50/60 border border-indigo-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-indigo-700 border border-indigo-200 inline-flex items-center gap-1.5 shadow-2xs">
            <Zap className="w-3 h-3 text-indigo-600" /> High-ROI Opportunity
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Learn <span className="text-indigo-600">Docker</span> to gain +14% match score
          </h3>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Adding verified Docker knowledge lifts your average match from {originalMatchScore}% to {originalMatchScore + 14}%, qualifying you for 4 additional openings.
          </p>
        </div>

        <div className="shrink-0">
          <button
            id="btn-take-docker-assessment"
            onClick={() => onTakeAssessment('Docker')}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Verify Docker (10m test)</span>
          </button>
        </div>
      </div>

      {/* Interactive Counterfactual Simulator */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Skill Simulator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select hypothetical skills to simulate changes to your qualification score.
            </p>
          </div>

          {/* Outcome counter */}
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 block">Simulated Score</span>
              <span className="text-base font-bold text-slate-900">{simulatedMatchScore}%</span>
            </div>
            {matchDelta > 0 && (
              <span className="text-xs font-semibold text-emerald-700 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">
                +{matchDelta}% Gain
              </span>
            )}
          </div>
        </div>

        {/* Skill toggle chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Toggle simulated skills:</label>
          <div className="flex flex-wrap gap-2">
            {availableSimOptions.map(skill => {
              const active = simulatedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSimulatedSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{active ? '✓' : '+'}</span>
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority Skill Gap Table */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-500" />
            Missing Competencies
          </h3>
          <span className="text-xs text-slate-500">
            Role: <span className="text-slate-900 font-medium">{targetCareer?.title}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-2.5 px-3">Missing Skill</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Role Relevance</th>
                <th className="py-2.5 px-3">Market Demand</th>
                <th className="py-2.5 px-3">Learning Effort</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(gapAnalysis?.missingSkills || []).map(gap => (
                <tr key={gap.skill} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {gap.skill}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        gap.priority === 'HIGH'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : gap.priority === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {gap.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {gap.careerRelevance}%
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {gap.opportunityImpact}%
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {gap.learningEffort}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onTakeAssessment(gap.skill)}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                      >
                        Assess
                      </button>
                      <button
                        onClick={() => onSelectTab('courses')}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        Course
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
