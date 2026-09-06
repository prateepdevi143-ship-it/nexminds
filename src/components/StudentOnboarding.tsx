import React, { useState } from 'react';
import { Sparkles, User, GraduationCap, MapPin, Target, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export const StudentOnboarding: React.FC = () => {
  const { firebaseUser, completeStudentOnboarding } = useAuth();

  const [name, setName] = useState(firebaseUser?.displayName || '');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech in Computer Science');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [cgpa, setCgpa] = useState<number>(8.5);
  const [location, setLocation] = useState('San Francisco, CA');
  const [careerGoal, setCareerGoal] = useState('AI Engineer');
  const [skillsInput, setSkillsInput] = useState('Python, SQL, Machine Learning');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const skillsArr = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(skillName => ({
          skillId: `sk_${skillName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          name: skillName,
          level: 70,
          confidence: 0.75,
          lastDemonstrated: new Date().toISOString(),
          evidenceCount: 1,
          freshness: 'recent' as const
        }));

      await completeStudentOnboarding({
        name: name.trim() || 'Student',
        email: firebaseUser?.email || '',
        college: college.trim() || 'University',
        degree: degree.trim(),
        graduationYear,
        cgpa,
        location: location.trim(),
        careerGoal: careerGoal.trim() || 'AI Engineer',
        skills: skillsArr
      });
    } catch (err) {
      console.error('Onboarding failed', err);
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
            <GraduationCap className="w-4 h-4" />
            <span>Profile Initialization</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Complete your Career Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalize your skills, academic background, and target career path.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Career Goal</label>
              <select
                value={careerGoal}
                onChange={e => setCareerGoal(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              >
                <option value="AI Engineer">AI Engineer</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Cloud Architect">Cloud Architect</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                required
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. Stanford / MIT / Berkeley"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Program</label>
              <input
                type="text"
                required
                value={degree}
                onChange={e => setDegree(e.target.value)}
                placeholder="e.g. B.Tech in CS / BS in Data Science"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grad Year</label>
              <input
                type="number"
                required
                min={2020}
                max={2032}
                value={graduationYear}
                onChange={e => setGraduationYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA / GPA</label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={10}
                required
                value={cgpa}
                onChange={e => setCgpa(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Remote / NYC"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Core Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, Machine Learning, Docker, SQL"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              You can also upload your full resume on the next screen to automatically extract and verify your skills!
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Creating Profile...' : 'Save & Launch Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
