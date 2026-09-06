import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { Student } from '../types';
import { api } from '../services/api';

interface CareerDoctorProps {
  student: Student;
  onTakeAssessment: (skillName: string) => void;
  onSelectTab: (tab: string) => void;
}

export const CareerDoctor: React.FC<CareerDoctorProps> = ({
  student,
  onTakeAssessment,
  onSelectTab
}) => {
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiagnosis();
  }, [student]);

  const fetchDiagnosis = async () => {
    setLoading(true);
    try {
      const data = await api.getCareerDoctor();
      setDiagnosis(data);
    } catch (err) {
      console.error('Failed to get career doctor diagnosis', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Career Diagnosis
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Identify bottlenecks in your profile and review high-impact actions to boost conversion.
          </p>
        </div>

        <button
          onClick={fetchDiagnosis}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Rerun Diagnosis</span>
        </button>
      </div>

      {loading ? (
        <div className="p-10 rounded-xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Synthesizing application signals and skill evidence...</p>
        </div>
      ) : diagnosis ? (
        <div className="space-y-6">
          {/* Main Diagnostic Banner */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Pipeline Health Status
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  diagnosis.healthRating === 'Good' || diagnosis.healthRating === 'Excellent'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {diagnosis.healthRating}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {diagnosis.primaryDiagnosis}
            </h3>

            {/* Critical Bottlenecks */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Primary Obstacles Identified:
              </h4>
              <ul className="space-y-1 text-xs text-slate-600">
                {(diagnosis.criticalBottlenecks || []).map((bot: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5">•</span>
                    <span>{bot}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Prescriptions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Recommended Interventions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(diagnosis.prescriptions || []).map((rx: any, idx: number) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                      <span className="uppercase">{rx.type}</span>
                      <span className="text-slate-400 font-normal">{rx.estimatedTimeToFix}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 leading-snug">{rx.title}</h4>
                    <p className="text-xs text-emerald-700 font-medium">
                      ROI: {rx.expectedRoi}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (rx.type === 'assessment') onTakeAssessment('Docker');
                      else if (rx.type === 'course') onSelectTab('courses');
                      else onSelectTab('skills-graph');
                    }}
                    className="w-full py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Take Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
