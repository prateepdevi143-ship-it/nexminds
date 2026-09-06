import React, { useState } from 'react';
import {
  Award,
  Plus,
  Code,
  BookOpen,
  FileCheck,
  ShieldCheck,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { Student, StudentSkill, SkillEvidence } from '../types';
import { api } from '../services/api';

interface SkillsEvidenceGraphProps {
  student: Student;
  evidences: SkillEvidence[];
  onRefreshProfile: () => void;
  onTakeAssessment: (skillName: string) => void;
}

export const SkillsEvidenceGraph: React.FC<SkillsEvidenceGraphProps> = ({
  student,
  evidences,
  onRefreshProfile,
  onTakeAssessment
}) => {
  const studentSkills = student?.skills || [];
  const evidenceList = evidences || [];
  const [selectedSkill, setSelectedSkill] = useState<StudentSkill | null>(studentSkills[0] || null);
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [newEvidenceSkill, setNewEvidenceSkill] = useState(studentSkills[0]?.name || 'Docker');
  const [newEvidenceType, setNewEvidenceType] = useState('project');
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceDetails, setNewEvidenceDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const matchingEvidences = evidenceList.filter(
    e => selectedSkill && e.skill?.toLowerCase() === selectedSkill.name?.toLowerCase()
  );

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await api.addEvidence({
        skill: newEvidenceSkill,
        sourceType: newEvidenceType,
        sourceTitle: newEvidenceTitle,
        details: newEvidenceDetails,
        confidence: 0.90
      });
      setShowAddEvidenceModal(false);
      setNewEvidenceTitle('');
      setNewEvidenceDetails('');
      onRefreshProfile();
    } catch (err) {
      console.error('Failed to add evidence', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Skills & Evidence
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Verified skills backed by objective proof: assessments, projects, and certifications.
          </p>
        </div>

        <button
          id="btn-add-evidence-modal"
          onClick={() => setShowAddEvidenceModal(true)}
          className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill Evidence</span>
        </button>
      </div>

      {/* Main Grid: Left Skill Inventory / Right Evidence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Skill Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              Verified Skills ({studentSkills.length})
            </span>
            <span className="text-xs text-slate-400">
              Select a skill to inspect supporting proof
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {studentSkills.map(skill => {
              const isSelected = selectedSkill?.name?.toLowerCase() === skill.name?.toLowerCase();
              const skillEvCount = evidenceList.filter(e => e.skill?.toLowerCase() === skill.name?.toLowerCase()).length;

              return (
                <motion.div
                  key={skill.name}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{skill.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {skillEvCount} proof {skillEvCount === 1 ? 'artifact' : 'artifacts'}
                      </p>
                    </div>

                    {/* Freshness Badge */}
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        skill.freshness === 'recent'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : skill.freshness === 'needs_refresh'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {skill.freshness === 'recent' ? 'Active' : skill.freshness === 'needs_refresh' ? 'Needs Refresh' : 'Stale'}
                    </span>
                  </div>

                  {/* Confidence & Level Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Confidence: {Math.round(skill.confidence * 100)}%</span>
                      <span className="text-slate-800 font-medium">{skill.level}% Proficiency</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Evidence Inspector */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
            {selectedSkill ? (
              <>
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs text-indigo-600 font-semibold">
                      Proof Inspector
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedSkill.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Last tested: {new Date(selectedSkill.lastDemonstrated).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => onTakeAssessment(selectedSkill.name)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    Retest Skill
                  </button>
                </div>

                {/* Evidence timeline */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-slate-700">
                    Supporting Proof Artifacts ({matchingEvidences.length})
                  </span>

                  {matchingEvidences.length === 0 ? (
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                      No direct evidence uploaded for this skill yet. Add a project or take an assessment to boost confidence.
                    </div>
                  ) : (
                    matchingEvidences.map(ev => (
                      <div
                        key={ev.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            {ev.sourceType === 'assessment' && <Award className="w-3.5 h-3.5 text-indigo-600" />}
                            {ev.sourceType === 'project' && <Code className="w-3.5 h-3.5 text-blue-600" />}
                            {ev.sourceType === 'course' && <BookOpen className="w-3.5 h-3.5 text-emerald-600" />}
                            {ev.sourceType === 'resume' && <FileCheck className="w-3.5 h-3.5 text-amber-600" />}
                            <span className="capitalize">{ev.sourceType} Proof</span>
                          </span>
                          <span className="text-xs font-medium text-slate-600">
                            {Math.round(ev.confidence * 100)}% Conf
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-900">{ev.sourceTitle}</p>
                        {ev.details && <p className="text-[11px] text-slate-500">{ev.details}</p>}
                        <span className="text-[10px] text-slate-400 block">
                          Recorded: {new Date(ev.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">Select a skill to inspect evidence</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Evidence Modal */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg rounded-xl bg-white border border-slate-200 p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Add Verified Skill Evidence
              </h3>
              <button
                onClick={() => setShowAddEvidenceModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Skill</label>
                <input
                  type="text"
                  value={newEvidenceSkill}
                  onChange={(e) => setNewEvidenceSkill(e.target.value)}
                  placeholder="e.g. Docker, PyTorch, React, PostgreSQL"
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white p-2 text-xs text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Evidence Type</label>
                <select
                  value={newEvidenceType}
                  onChange={(e) => setNewEvidenceType(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white p-2 text-xs text-slate-900"
                >
                  <option value="project">Project / GitHub Repository</option>
                  <option value="course">Course / Certification</option>
                  <option value="experience">Internship / Production Work</option>
                  <option value="assessment">Technical Assessment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Artifact Title / Link</label>
                <input
                  type="text"
                  value={newEvidenceTitle}
                  onChange={(e) => setNewEvidenceTitle(e.target.value)}
                  placeholder="e.g. Project: Dockerized Microservices Pipeline"
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white p-2 text-xs text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Verification Details</label>
                <textarea
                  rows={3}
                  value={newEvidenceDetails}
                  onChange={(e) => setNewEvidenceDetails(e.target.value)}
                  placeholder="Describe implementation details, GitHub commit, or test coverage..."
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white p-2 text-xs text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Evidence'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
