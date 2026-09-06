import React, { useState } from 'react';
import { Building2, Globe, MapPin, Users, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export const CompanyOnboarding: React.FC = () => {
  const { firebaseUser, completeCompanyOnboarding } = useAuth();

  const [name, setName] = useState(firebaseUser?.displayName || '');
  const [industry, setIndustry] = useState('Artificial Intelligence & Software');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('https://example.com');
  const [size, setSize] = useState('50-250');
  const [description, setDescription] = useState('Building next-generation intelligent applications.');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await completeCompanyOnboarding({
        name: name.trim() || 'Tech Labs',
        industry,
        location,
        website,
        size,
        description
      });
    } catch (err) {
      console.error('Company onboarding failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8"
      >
        <div className="mb-6">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Recruiter Onboarding</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Register your Organization
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Post verified tech job listings and discover benchmarked candidates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Vertex AI Labs"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              >
                <option value="Artificial Intelligence & Software">Artificial Intelligence & Software</option>
                <option value="Fintech & Banking">Fintech & Banking</option>
                <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                <option value="Enterprise Cloud Services">Enterprise Cloud Services</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA / Remote"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Website</label>
              <input
                type="url"
                required
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Team Size</label>
              <select
                value={size}
                onChange={e => setSize(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              >
                <option value="1-20">1-20 employees (Seed stage)</option>
                <option value="20-100">20-100 employees (Early Growth)</option>
                <option value="100-500">100-500 employees (Scale-up)</option>
                <option value="500+">500+ employees (Enterprise)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company Overview</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of what your team is building..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Setting up Company...' : 'Launch Recruiter Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
