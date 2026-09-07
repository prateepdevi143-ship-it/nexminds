import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, CheckCircle2, Calendar, FileText, ArrowLeft, ExternalLink, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { CertificateRecord } from '../types';
import { api } from '../services/api';

interface CertificateVerificationViewProps {
  certificateId: string;
  onBack?: () => void;
}

export const CertificateVerificationView: React.FC<CertificateVerificationViewProps> = ({
  certificateId,
  onBack
}) => {
  const [loading, setLoading] = useState(true);
  const [certData, setCertData] = useState<{
    verified: boolean;
    certificate: CertificateRecord;
    internship?: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVerification();
  }, [certificateId]);

  const loadVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyCertificate(certificateId);
      if (res && res.verified) {
        setCertData(res);
      } else {
        setError('Certificate could not be verified or does not exist.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or revoked certificate identifier.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="public-certificate-verifier" className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Glow effect background */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Application
          </button>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Querying NextMind AI Cryptographic Credential Registry...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Certificate</h2>
            <p className="text-sm text-red-300 max-w-md mx-auto mb-6">{error}</p>
            <p className="text-xs text-slate-500">Provided ID: {certificateId}</p>
          </div>
        ) : certData?.certificate ? (
          <div>
            {/* Header Status */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-3">
                <CheckCircle2 className="w-4 h-4" /> NextMind AI Verified Credential
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Certificate of Internship Completion
              </h1>
              <p className="text-xs text-slate-400 mt-1">Official Verification Record from NextMind AI Platform</p>
            </div>

            {/* Recipient Card */}
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-6 mb-6 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Issued To
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-300 font-serif">
                {certData.certificate.studentName}
              </h2>

              <p className="text-xs text-slate-300 mt-3 max-w-lg mx-auto leading-relaxed">
                For successfully fulfilling all capstone project requirements, code reviews, and industry defense criteria in
              </p>

              <h3 className="text-lg font-bold text-white mt-1">
                {certData.certificate.internshipTitle}
              </h3>
            </div>

            {/* Credential Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1">Credential ID</span>
                <code className="text-emerald-400 font-mono font-bold text-xs break-all">
                  {certData.certificate.certificateId}
                </code>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1">Issue Date</span>
                <span className="text-white font-medium">{certData.certificate.issueDate}</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1">Authority</span>
                <span className="text-indigo-300 font-medium">{certData.certificate.issuer}</span>
              </div>
            </div>

            {/* Validated Skills */}
            {certData.certificate.skills && certData.certificate.skills.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                <span className="text-xs text-slate-400 font-semibold block mb-2">
                  Validated Industry Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {certData.certificate.skills.map((s: string) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Authenticity Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Cryptographically Verified Record
              </div>
              <span>Status: <strong className="text-emerald-300">ACTIVE & AUTHENTIC</strong></span>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};
