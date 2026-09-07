import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Check,
  ShieldAlert,
  Target,
  Briefcase,
  Layers,
  Award,
  ChevronRight,
  BarChart3,
  ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, ResumeAnalysisResult, Job } from '../types';
import { api } from '../services/api';
import { ResumeBulletOptimizer } from './ResumeBulletOptimizer';

interface ResumeIntelligenceProps {
  student: Student;
  onRefreshProfile: () => void;
}

const SAMPLE_RESUME_TEXT = `PRATEEP P
San Francisco, CA | student@careerai.dev | +1 (555) 438-9201 | linkedin.com/in/prateep-p | github.com/prateepp

EDUCATION
Stanford Institute of Technology — B.Tech in Artificial Intelligence & Machine Learning (2022 - 2026)
• CGPA: 8.9 / 10.0. Focus: Neural Architecture Design, Transformers, Distributed Deep Learning.

TECHNICAL SKILLS
• Programming & Frameworks: Python, PyTorch, TensorFlow, FastAPI, SQL, TypeScript, Bash/Shell, Git
• AI/ML Specializations: Machine Learning, Deep Learning, Natural Language Processing, Computer Vision
• Tools & Infrastructure: Docker, Linux, REST APIs, Scikit-Learn, Hugging Face Transformers

PROJECTS
NeuroSummarize: Neural Sequence-to-Sequence Abstractor
• Built and benchmarked multi-head self-attention models in PyTorch for abstractive text summarization.
• Packaged model into production-ready FastAPI microservice delivering sub-100ms inference with Docker.
• Deployed evaluation pipeline benchmarking ROUGE-1/2 scores on CNN/DailyMail dataset.

OmniVision: Real-time Multi-Object Edge Tracking
• Engineered lightweight YOLOv8 computer vision detection system for continuous video feeds.
• Optimized tensor operations achieving 45 FPS on edge devices using TensorRT and Python.

EXPERIENCE
HyperScale AI Labs — Machine Learning Research Intern (June 2024 - August 2024)
• Fine-tuned 7B parameter instruction-following LLMs with LoRA quantization techniques.
• Designed automated evaluation harnesses to stress-test prompt injection resilience.
• Co-authored internal benchmark comparing PyTorch vs vLLM throughput.
`;

export const ResumeIntelligence: React.FC<ResumeIntelligenceProps> = ({
  student,
  onRefreshProfile
}) => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState(student.resumeFileName || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'ats' | 'job_match' | 'bullet_optimizer'>('ats');

  useEffect(() => {
    api.getJobs()
      .then(jobs => {
        if (Array.isArray(jobs)) {
          setAvailableJobs(jobs.filter(j => j.status === 'published'));
        }
      })
      .catch(err => console.warn('Could not load jobs for alignment:', err));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setResumeText(text || SAMPLE_RESUME_TEXT);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME_TEXT);
    setFileName('Prateep_P_AI_Resume_2026.pdf');
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setErrorMsg('Please paste resume text or upload a file.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.uploadResume(
        resumeText,
        fileName || 'Resume.pdf',
        selectedJobId || undefined
      );
      setAnalysisResult(res.analysis);
      setSuccessMsg('Resume parsed, 9-point ATS evaluated, and verified skills updated!');
      onRefreshProfile();
      if (selectedJobId && res.analysis.jobMatchAnalysis) {
        setActiveTab('job_match');
      } else {
        setActiveTab('ats');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze resume.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Resume Intelligence & ATS Evaluation
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit your resume across 9 ATS criteria, extract categorized capabilities with evidence, and optimize bullet points.
          </p>
        </div>
      </div>

      {/* Mandatory Truthfulness Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">Resume Truthfulness & Verification Standard</span>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Only include information you can truthfully support. Platform recruiters and automated technical screening pipelines cross-validate listed skills against assessment submissions and project repositories.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          id="tab-ats-diagnostic"
          type="button"
          onClick={() => setActiveTab('ats')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'ats'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>ATS & 9-Criteria Diagnostic</span>
        </button>

        <button
          id="tab-job-match"
          type="button"
          onClick={() => setActiveTab('job_match')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'job_match'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Target Job Alignment</span>
          {analysisResult?.jobMatchAnalysis && (
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {analysisResult.jobMatchAnalysis.matchPercentage}%
            </span>
          )}
        </button>

        <button
          id="tab-bullet-optimizer"
          type="button"
          onClick={() => setActiveTab('bullet_optimizer')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'bullet_optimizer'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Bullet Optimizer (Action+Task+Tech+Outcome)</span>
        </button>
      </div>

      {activeTab === 'bullet_optimizer' ? (
        <div className="max-w-4xl">
          <ResumeBulletOptimizer defaultRole={student.careerGoal || 'AI / Software Engineer'} />
        </div>
      ) : (
        /* Upload & Analysis Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Resume Source
                </span>
                <button
                  id="resume-sample-btn"
                  onClick={handleLoadSample}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                >
                  Load Sample Resume
                </button>
              </div>

              {/* Drop Zone */}
              <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-4 text-center transition-colors bg-slate-50/50">
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="resume-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                  </div>
                  <p className="text-[10px] text-slate-400">PDF, TXT, or DOCX</p>
                </label>
                {fileName && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs shadow-2xs">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-medium truncate max-w-[200px]">{fileName}</span>
                  </div>
                )}
              </div>

              {/* Optional Job Alignment Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  Align With Target Role (Optional)
                </label>
                <select
                  id="target-job-select"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full rounded-lg bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2 text-xs text-slate-800"
                >
                  <option value="">General ATS Evaluation (No target role)</option>
                  {availableJobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.companyName}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Selecting a role unlocks role-specific keyword density and missing skill gaps.
                </p>
              </div>

              {/* Paste Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Or Paste Resume Text</label>
                <textarea
                  id="resume-text-input"
                  rows={7}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste the raw text of your resume here..."
                  className="w-full rounded-lg bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2.5 text-xs text-slate-800 font-mono resize-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                id="resume-analyze-btn"
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating 9 ATS Criteria...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Analyze Resume & Evaluate ATS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Analysis Display */}
          <div className="lg:col-span-7 space-y-4">
            {analysisResult ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {activeTab === 'ats' ? (
                  <>
                    {/* Top ATS Summary Card */}
                    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-center">
                        <span className="text-3xl font-bold text-indigo-600">
                          {analysisResult.atsBreakdown?.atsCompatibility || analysisResult.resumeScore || 88}%
                        </span>
                        <p className="text-xs font-semibold text-slate-800 mt-1">Overall ATS Score</p>
                        <p className="text-[11px] text-slate-500">Industry parsing benchmark</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-center">
                        <span className="text-3xl font-bold text-emerald-600">
                          {analysisResult.atsBreakdown?.keywordRelevance || analysisResult.atsCompatibility || 90}%
                        </span>
                        <p className="text-xs font-semibold text-slate-800 mt-1">Keyword Relevance</p>
                        <p className="text-[11px] text-slate-500">Canonical tech nomenclature</p>
                      </div>
                    </div>

                    {/* 9-Point ATS Evaluation Matrix */}
                    {analysisResult.atsBreakdown && (
                      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                            9-Point ATS Evaluation Matrix
                          </h4>
                          <span className="text-[11px] text-slate-400">Score / 100</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            { label: 'ATS Compatibility', val: analysisResult.atsBreakdown.atsCompatibility },
                            { label: 'Keyword Relevance', val: analysisResult.atsBreakdown.keywordRelevance },
                            { label: 'Skills Match', val: analysisResult.atsBreakdown.skillsMatch },
                            { label: 'Experience Relevance', val: analysisResult.atsBreakdown.experienceRelevance },
                            { label: 'Project Relevance', val: analysisResult.atsBreakdown.projectRelevance },
                            { label: 'Achievement Quality', val: analysisResult.atsBreakdown.achievementQuality },
                            { label: 'Resume Structure', val: analysisResult.atsBreakdown.resumeStructure },
                            { label: 'Readability', val: analysisResult.atsBreakdown.readability },
                            { label: 'Role Alignment', val: analysisResult.atsBreakdown.roleAlignment }
                          ].map(item => (
                            <div key={item.label} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-medium text-[11px] truncate">{item.label}</span>
                                <span className={`font-bold text-xs ${item.val >= 85 ? 'text-emerald-600' : item.val >= 70 ? 'text-indigo-600' : 'text-amber-600'}`}>
                                  {item.val}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${item.val >= 85 ? 'bg-emerald-500' : item.val >= 70 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                                  style={{ width: `${item.val}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categorized Skills Identification */}
                    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          Categorized Skills & Demonstrated Evidence
                        </h4>
                        <span className="text-xs text-slate-500">
                          {analysisResult.skills?.length || 0} Total Skills
                        </span>
                      </div>

                      {/* Technical Skills */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          Technical Skills ({analysisResult.skillCategories?.technical.length || analysisResult.skills.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(analysisResult.skillCategories?.technical || analysisResult.skills || []).map(skill => (
                            <span
                              key={skill.name}
                              title={skill.evidence || `Confidence: ${Math.round((skill.confidence || 0.85) * 100)}%`}
                              className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-colors cursor-help"
                            >
                              <span>{skill.name}</span>
                              <span className="text-[10px] font-bold text-indigo-600">
                                {Math.round((skill.confidence || 0.85) * 100)}%
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Soft Skills */}
                      {analysisResult.skillCategories?.soft && analysisResult.skillCategories.soft.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Soft & Collaborative Skills ({analysisResult.skillCategories.soft.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.skillCategories.soft.map(skill => (
                              <span
                                key={skill.name}
                                title={skill.evidence}
                                className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200/60 flex items-center gap-1.5 cursor-help"
                              >
                                <span>{skill.name}</span>
                                <span className="text-[10px] font-bold text-emerald-700">
                                  {Math.round((skill.confidence || 0.85) * 100)}%
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Domain Skills */}
                      {analysisResult.skillCategories?.domain && analysisResult.skillCategories.domain.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            Domain Specializations ({analysisResult.skillCategories.domain.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.skillCategories.domain.map(skill => (
                              <span
                                key={skill.name}
                                title={skill.evidence}
                                className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-900 border border-purple-200/60 flex items-center gap-1.5 cursor-help"
                              >
                                <span>{skill.name}</span>
                                <span className="text-[10px] font-bold text-purple-700">
                                  {Math.round((skill.confidence || 0.85) * 100)}%
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
                      <div>
                        <h4 className="font-semibold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Resume Strengths
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {(analysisResult.strengths || []).map((str, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <h4 className="font-semibold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Actionable Improvements
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {(analysisResult.improvements || []).map((imp, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">•</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Job Match Alignment View */
                  <div className="space-y-4">
                    {analysisResult.jobMatchAnalysis ? (
                      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Target Alignment Result
                            </span>
                            <h4 className="text-base font-bold text-slate-900 mt-0.5">
                              {analysisResult.jobMatchAnalysis.jobTitle || 'Target Position'}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-indigo-600">
                              {analysisResult.jobMatchAnalysis.matchPercentage}%
                            </span>
                            <span className="block text-[10px] text-slate-500">Overall Match</span>
                          </div>
                        </div>

                        {/* Strong Matches */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Strong Matches (
                            {analysisResult.jobMatchAnalysis.strongMatches.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.jobMatchAnalysis.strongMatches.map(m => (
                              <span
                                key={m}
                                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Missing Skills */}
                        {analysisResult.jobMatchAnalysis.missingSkills.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Missing Job Requirements (
                              {analysisResult.jobMatchAnalysis.missingSkills.length})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {analysisResult.jobMatchAnalysis.missingSkills.map(m => (
                                <span
                                  key={m}
                                  className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing Evidence */}
                        {analysisResult.jobMatchAnalysis.evidenceGaps?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-amber-800">
                              Evidence & Benchmark Gaps
                            </span>
                            <ul className="space-y-1 text-xs text-slate-600">
                              {analysisResult.jobMatchAnalysis.evidenceGaps.map((eg, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-amber-500 mt-0.5">•</span>
                                  <span>{eg}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Strategic Recommendations */}
                        {analysisResult.jobMatchAnalysis.recommendations?.length > 0 && (
                          <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-100 space-y-1.5">
                            <span className="text-xs font-bold text-indigo-950 block">
                              Alignment Recommendations
                            </span>
                            <ul className="space-y-1 text-xs text-indigo-900">
                              {analysisResult.jobMatchAnalysis.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <ChevronRight className="w-3 h-3 mt-0.5 text-indigo-600 shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 rounded-xl border border-dashed border-slate-200 bg-white text-center space-y-2 text-slate-500">
                        <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                        <h4 className="text-sm font-semibold text-slate-700">No Job Selected During Analysis</h4>
                        <p className="text-xs max-w-sm mx-auto">
                          Select a role from the "Align With Target Role" dropdown on the left and re-run analysis to view role-specific matching.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full min-h-[360px] rounded-xl border border-dashed border-slate-200 bg-white flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <ShieldCheck className="w-10 h-10 text-slate-300 mb-2" />
                <h4 className="font-semibold text-sm text-slate-700">No Resume Analyzed Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                  Upload your resume or click "Load Sample Resume" on the left, then click Analyze to see your 9-point ATS evaluation, categorized skills, and job alignment.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

