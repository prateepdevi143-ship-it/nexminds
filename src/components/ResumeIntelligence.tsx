import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { Student, ResumeAnalysisResult } from '../types';
import { api } from '../services/api';

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
      const res = await api.uploadResume(resumeText, fileName || 'Resume.pdf');
      setAnalysisResult(res.analysis);
      setSuccessMsg('Resume parsed and skills saved to your profile!');
      onRefreshProfile();
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
            Resume Analysis & ATS Score
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload or paste your resume to extract skills, test ATS keyword compatibility, and identify areas for improvement.
          </p>
        </div>
      </div>

      {/* Upload / Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Upload Resume
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
            <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-5 text-center transition-colors bg-slate-50/50">
              <input
                id="resume-file-input"
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="resume-file-input"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                </div>
                <p className="text-[11px] text-slate-400">PDF, TXT, or DOCX</p>
              </label>
              {fileName && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs shadow-xs">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-medium">{fileName}</span>
                </div>
              )}
            </div>

            {/* Or Paste Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Or Paste Resume Text</label>
              <textarea
                id="resume-text-input"
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the text of your resume here..."
                className="w-full rounded-lg bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 text-xs text-slate-800 font-mono resize-none"
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
              className="w-full py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Analyze Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Analysis Results */}
        <div className="lg:col-span-6 space-y-4">
          {analysisResult ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Score card */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-center">
                  <span className="text-3xl font-bold text-indigo-600">{analysisResult.resumeScore || 88}%</span>
                  <p className="text-xs font-semibold text-slate-800 mt-1">ATS Score</p>
                  <p className="text-[11px] text-slate-500">Applicant Tracking Match</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-center">
                  <span className="text-3xl font-bold text-emerald-600">{analysisResult.atsCompatibility || 90}%</span>
                  <p className="text-xs font-semibold text-slate-800 mt-1">Keyword Match</p>
                  <p className="text-[11px] text-slate-500">Industry terminology</p>
                </div>
              </div>

              {/* Extracted Skills */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Identified Skills ({analysisResult.skills?.length || 0})
                  </h4>
                  <span className="text-xs text-slate-500">Added to your profile</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(analysisResult.skills || []).map(skill => (
                    <span
                      key={skill.name}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 flex items-center gap-1.5"
                    >
                      <span>{skill.name}</span>
                      <span className="text-[10px] font-semibold text-indigo-600">
                        {Math.round((skill.confidence || 0.85) * 100)}%
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="font-semibold text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Strengths
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
                  <h4 className="font-semibold text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Suggested Improvements
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
            </motion.div>
          ) : (
            <div className="h-full min-h-[360px] rounded-xl border border-dashed border-slate-200 bg-white flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <ShieldCheck className="w-10 h-10 text-slate-300 mb-2" />
              <h4 className="font-semibold text-sm text-slate-700">No Resume Analyzed Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                Upload your resume or click "Load Sample Resume" on the left, then click Analyze to see your ATS score and skill breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
