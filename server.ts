import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import {
  calculateSkillMatch,
  calculateSkillGaps,
  calculateOneSkillAway,
  calculateCareerReadiness,
  calculateCandidateRank,
  normalizeSkill,
  normalizeSkillsList,
  calculateSkillFreshness,
  calculateOpportunityMatch,
  calculateSkillConfidenceFromEvidence
} from './src/algorithms/matching';
import {
  analyzeResumeWithGemini,
  parseJobDescriptionWithGemini,
  generateCareerDoctorDiagnosis,
  chatCareerAssistant,
  generateCoverLetter
} from './server/ai';
import { ApplicationStatus, SkillEvidence, Student, User, Company, MandatoryAssessmentAttempt, RecruiterFeedback, PersonalizedImprovementPlan } from './src/types';
import { QUESTION_BANK } from './server/data/questionsData';
import { COMPREHENSIVE_COURSES } from './server/data/coursesData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Dynamic user resolution supporting Firebase Auth UID headers
let currentUserId = 'usr_student_01';

function resolveUser(req: express.Request): User {
  const customStudentId = (req.headers['x-student-id'] as string) || (req.query.studentId as string);
  const customUid = req.headers['x-user-id'] as string;
  const customEmail = req.headers['x-user-email'] as string;
  const customName = req.headers['x-user-name'] ? decodeURIComponent(req.headers['x-user-name'] as string) : '';

  const users = db.get('users');
  const students = db.get('students');

  if (customStudentId) {
    const student = students.find(s => s.id === customStudentId || s.userId === customStudentId);
    if (student) {
      const u = users.find(u => u.id === student.userId);
      if (u) return u;
      return {
        id: student.userId,
        email: student.email,
        name: student.name,
        role: 'student',
        createdAt: new Date().toISOString()
      };
    }
  }

  if (customUid) {
    let user = users.find(u => u.id === customUid);
    if (!user) {
      // Check if student profile exists for this UID or create just-in-time user
      const student = students.find(s => s.userId === customUid || s.id === customUid);
      const companies = db.get('companies');
      const company = companies.find(c => c.userId === customUid || c.id === customUid);

      const determinedRole = student ? 'student' : company ? 'company' : 'student';
      user = {
        id: customUid,
        email: customEmail || (student?.email || 'user@careerai.dev'),
        name: customName || (student?.name || company?.name || 'User'),
        role: determinedRole,
        createdAt: new Date().toISOString()
      };
      db.update('users', u => [...u, user!]);
    }
    return user;
  }

  return users.find(u => u.id === currentUserId) || users[0];
}

function resolveStudent(req: express.Request): Student | undefined {
  const students = db.get('students');
  const customStudentId = (req.headers['x-student-id'] as string) || (req.query.studentId as string);
  if (customStudentId) {
    const s = students.find(s => s.id === customStudentId || s.userId === customStudentId);
    if (s) return s;
  }

  const user = resolveUser(req);

  if (user.role !== 'student') {
    // Return primary student profile so recruiters and admins can still preview/test student views safely
    return students[0];
  }

  let student = students.find(s => s.userId === user.id || s.id === user.id);

  if (!student) {
    // Automatically bootstrap empty/custom profile for new authenticated Firebase student
    const careers = db.get('careers');
    student = {
      id: user.id,
      userId: user.id,
      name: user.name || 'New Student',
      email: user.email,
      college: 'University',
      degree: 'Computer Science & Engineering',
      graduationYear: 2026,
      cgpa: 8.0,
      careerGoal: 'AI Engineer',
      targetCareerId: 'career_ai_eng',
      profileCompletion: 60,
      careerReadinessScore: 50,
      skills: [],
      education: [],
      projects: [],
      experience: [],
      certifications: [],
      updatedAt: new Date().toISOString()
    };
    db.update('students', s => [...s, student!]);
  }

  return student;
}

function resolveCompany(req: express.Request): Company | undefined {
  const user = resolveUser(req);
  if (user.role !== 'company') return undefined;

  const companies = db.get('companies');
  let company = companies.find(c => c.userId === user.id || c.id === user.id);

  if (!company) {
    company = {
      id: user.id,
      userId: user.id,
      name: user.name || 'Company Recruiter',
      email: user.email,
      industry: 'Artificial Intelligence & Software',
      location: 'San Francisco, CA',
      website: 'https://example.com',
      size: '50-250',
      description: 'Engineering and technical innovation organization.',
      verified: true,
      createdAt: new Date().toISOString()
    };
    db.update('companies', c => [...c, company!]);
  }

  return company;
}

// ---------------- API ROUTES ----------------

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth Endpoints
app.get('/api/auth/me', (req, res) => {
  const user = resolveUser(req);
  let profile: any = null;
  if (user.role === 'student') {
    profile = resolveStudent(req);
  } else if (user.role === 'company') {
    profile = resolveCompany(req);
  }
  res.json({ user, profile });
});

app.post('/api/auth/switch-demo', (req, res) => {
  const { role, email, studentId } = req.body;
  const users = db.get('users');
  const students = db.get('students');
  let targetUser: User | undefined;
  let profile: any = null;

  if (studentId) {
    const student = students.find(s => s.id === studentId || s.userId === studentId);
    if (student) {
      targetUser = users.find(u => u.id === student.userId) || {
        id: student.userId,
        email: student.email,
        name: student.name,
        role: 'student',
        createdAt: new Date().toISOString()
      };
      currentUserId = targetUser.id;
      return res.json({ user: targetUser, profile: student });
    }
  }

  if (email) {
    targetUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  if (!targetUser && role) {
    if (role === 'student') targetUser = users.find(u => u.id === 'usr_student_01') || users.find(u => u.role === 'student');
    else if (role === 'company') targetUser = users.find(u => u.id === 'usr_company_01') || users.find(u => u.role === 'company');
    else if (role === 'admin') targetUser = users.find(u => u.id === 'usr_admin') || users.find(u => u.role === 'admin');
    else if (role === 'industry') targetUser = users.find(u => u.id === 'usr_industry_01') || users.find(u => u.role === 'industry');
    else targetUser = users.find(u => u.role === role);
  }

  if (targetUser) {
    currentUserId = targetUser.id;
    if (targetUser.role === 'student') {
      profile = students.find(s => s.userId === targetUser!.id) || students[0];
    } else if (targetUser.role === 'company') {
      profile = db.get('companies').find(c => c.userId === targetUser!.id);
    }
    return res.json({ user: targetUser, profile });
  }

  res.status(400).json({ error: 'User or role not found' });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const cleanEmail = (email || '').toLowerCase().trim();
  const users = db.get('users');
  const students = db.get('students');
  let user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    const stdNumMatch = cleanEmail.match(/student0?(\d+)/i) || cleanEmail.match(/std_?0?(\d+)/i);
    if (stdNumMatch) {
      const idx = parseInt(stdNumMatch[1], 10);
      const padded = idx < 10 ? `0${idx}` : `${idx}`;
      user = users.find(u => u.id === `usr_student_${padded}` || u.email.includes(`student${padded}`));
      if (!user) {
        const matchingStudent = students.find(s => s.id === `std_${padded}` || s.userId === `usr_student_${padded}`);
        if (matchingStudent) {
          user = users.find(u => u.id === matchingStudent.userId) || {
            id: matchingStudent.userId,
            email: matchingStudent.email,
            name: matchingStudent.name,
            role: 'student',
            createdAt: new Date().toISOString()
          };
        }
      }
    } else if (cleanEmail.includes('admin')) {
      user = users.find(u => u.role === 'admin') || users.find(u => u.id === 'usr_admin');
    } else if (cleanEmail.includes('company') || cleanEmail.includes('recruiter')) {
      const compMatch = cleanEmail.match(/company0?(\d+)/i);
      if (compMatch) {
        const cidx = parseInt(compMatch[1], 10);
        const cpadded = cidx < 10 ? `0${cidx}` : `${cidx}`;
        user = users.find(u => u.id === `usr_company_${cpadded}` || u.email.includes(`company${cpadded}`));
      }
      if (!user) user = users.find(u => u.role === 'company');
    } else if (cleanEmail.includes('student')) {
      user = users.find(u => u.role === 'student');
    }
  }

  if (!user) {
    return res.status(404).json({ error: 'User with this email not found in demo environment' });
  }
  currentUserId = user.id;
  let profile: any = null;
  if (user.role === 'student') {
    profile = db.get('students').find(s => s.userId === user.id) || db.get('students')[0];
  } else if (user.role === 'company') {
    profile = db.get('companies').find(c => c.userId === user.id) || db.get('companies')[0];
  }
  res.json({ user, profile });
});

app.post('/api/auth/register', (req, res) => {
  const { email, name, role } = req.body;
  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Missing email, name, or role' });
  }

  const userId = `usr_${Date.now()}`;
  const newUser: User = {
    id: userId,
    email,
    name,
    role: role as any,
    createdAt: new Date().toISOString()
  };

  db.update('users', users => [...users, newUser]);
  currentUserId = userId;

  let profile: any = null;
  if (role === 'student') {
    const newStudent: Student = {
      id: `std_${Date.now()}`,
      userId,
      name,
      email,
      college: 'University Candidate',
      degree: 'Computer Science',
      graduationYear: 2026,
      cgpa: 8.5,
      careerGoal: 'AI Engineer',
      targetCareerId: 'career_ai_eng',
      profileCompletion: 50,
      careerReadinessScore: 60,
      skills: [
        { skillId: 'sk_py', name: 'Python', level: 75, confidence: 0.8, lastDemonstrated: new Date().toISOString(), evidenceCount: 1, freshness: 'recent' },
        { skillId: 'sk_git', name: 'Git', level: 70, confidence: 0.8, lastDemonstrated: new Date().toISOString(), evidenceCount: 1, freshness: 'recent' }
      ],
      education: [],
      projects: [],
      experience: [],
      certifications: [],
      updatedAt: new Date().toISOString()
    };
    db.update('students', students => [...students, newStudent]);
    profile = newStudent;
  } else if (role === 'company') {
    const newComp = {
      id: `comp_${Date.now()}`,
      userId,
      name,
      email,
      industry: 'Technology',
      location: 'Remote',
      website: 'https://example.com',
      size: '10-50',
      description: 'Innovative technology enterprise.',
      verified: true,
      createdAt: new Date().toISOString()
    };
    db.update('companies', comps => [...comps, newComp]);
    profile = newComp;
  }

  res.json({ user: newUser, profile });
});

// Student Profile Endpoints
app.get('/api/students', (req, res) => {
  const students = db.get('students');
  res.json(students);
});

app.get('/api/students/:id', (req, res) => {
  const students = db.get('students');
  const student = students.find(s => s.id === req.params.id || s.userId === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const evidences = db.get('evidences').filter(e => e.studentId === student.id);
  const careers = db.get('careers');
  const targetCareer = careers.find(c => c.id === student.targetCareerId || c.title.toLowerCase() === student.careerGoal.toLowerCase()) || careers[0];
  res.json({ student, evidences, targetCareer });
});

app.get('/api/students/profile', (req, res) => {
  const student = resolveStudent(req) || db.get('students')[0];
  if (!student) return res.status(404).json({ error: 'No active student' });

  const evidences = db.get('evidences').filter(e => e.studentId === student.id);
  const careers = db.get('careers');
  const targetCareer = careers.find(c => c.id === student.targetCareerId || c.title.toLowerCase() === student.careerGoal.toLowerCase()) || careers[0];

  // Recalculate freshness and readiness score dynamically
  student.skills = (student.skills || []).map(sk => ({
    ...sk,
    freshness: calculateSkillFreshness(sk.lastDemonstrated)
  }));
  const targetSkills = targetCareer ? targetCareer.requiredSkills : ['Python', 'Machine Learning'];
  const readiness = calculateCareerReadiness(student, targetSkills, evidences);
  student.careerReadinessScore = readiness;

  res.json({ student, evidences, targetCareer });
});

app.put('/api/students/profile', (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student' });

  const updates = req.body;
  let updatedStudent: Student | null = null;

  db.update('students', students => {
    return students.map(s => {
      if (s.id === student.id) {
        updatedStudent = {
          ...s,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return updatedStudent;
      }
      return s;
    });
  });

  res.json(updatedStudent);
});

// Resume Upload & AI Parser
app.post('/api/students/resume/upload', async (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student' });

  const { resumeText, fileName } = req.body;
  if (!resumeText) return res.status(400).json({ error: 'No resume text provided' });

  try {
    const analysis = await analyzeResumeWithGemini(resumeText);

    // Merge extracted skills into student profile
    const existingSkillNames = new Set((student.skills || []).map(s => s.name.toLowerCase()));
    const newStudentSkills = [...(student.skills || [])];
    const newEvidences: SkillEvidence[] = [];

    (analysis.skills || []).forEach(extracted => {
      const canonicalName = normalizeSkill(extracted.name);
      if (!canonicalName) return;

      const normLower = canonicalName.toLowerCase();
      if (!existingSkillNames.has(normLower)) {
        newStudentSkills.push({
          skillId: `sk_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          name: canonicalName,
          level: Math.round((extracted.confidence || 0.8) * 90),
          confidence: extracted.confidence || 0.85,
          lastDemonstrated: new Date().toISOString(),
          evidenceCount: 1,
          freshness: 'recent'
        });
        existingSkillNames.add(normLower);
      }

      // Add evidence item
      newEvidences.push({
        id: `ev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        studentId: student.id,
        skill: canonicalName,
        sourceType: 'resume',
        sourceTitle: `Resume Extraction: ${fileName || 'Resume.pdf'}`,
        confidence: extracted.confidence || 0.85,
        date: new Date().toISOString(),
        details: `Extracted via CareerAI Talent Intelligence parser with ${(extracted.confidence || 0.85) * 100}% confidence.`
      });
    });

    // Merge extracted projects
    const existingProjectNames = new Set((student.projects || []).map(p => p.name.toLowerCase()));
    const newProjects = [...(student.projects || [])];
    (analysis.projects || []).forEach(p => {
      if (!existingProjectNames.has(p.name.toLowerCase())) {
        newProjects.push({
          id: `proj_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          name: p.name,
          description: p.description || 'Extracted project portfolio item.',
          technologies: (p.technologies || []).map(normalizeSkill)
        });
        existingProjectNames.add(p.name.toLowerCase());
      }
    });

    // Save evidences
    if (newEvidences.length > 0) {
      db.update('evidences', evs => [...evs, ...newEvidences]);
    }

    // Update student
    db.update('students', students => {
      return students.map(s => {
        if (s.id === student.id) {
          const updated: Student = {
            ...s,
            skills: newStudentSkills,
            projects: newProjects,
            resumeFileName: fileName || 'Uploaded_Resume.pdf',
            resumeScore: analysis.resumeScore || 85,
            phone: analysis.personalInfo?.phone || s.phone,
            location: s.location,
            updatedAt: new Date().toISOString()
          };
          // Recalculate readiness
          const careers = db.get('careers');
          const targetCareer = careers.find(c => c.id === s.targetCareerId) || careers[0];
          const allEvidences = db.get('evidences').filter(e => e.studentId === s.id);
          updated.careerReadinessScore = calculateCareerReadiness(updated, targetCareer.requiredSkills, allEvidences);
          return updated;
        }
        return s;
      });
    });

    // Notification
    const notif = {
      id: `notif_${Date.now()}`,
      userId: student.userId,
      title: 'Resume Parsed Successfully 📄',
      message: `Extracted ${(analysis.skills || []).length} skills and updated your ATS score to ${analysis.resumeScore}%.`,
      type: 'evidence' as const,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/resume'
    };
    db.update('notifications', n => [notif, ...n]);

    res.json({ success: true, analysis });
  } catch (err: any) {
    console.error('Resume upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to process resume' });
  }
});

// Skill Gap Analysis
app.get('/api/students/gap-analysis', (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student' });

  const careers = db.get('careers');
  const targetCareer = careers.find(c => c.id === student.targetCareerId || c.title.toLowerCase() === student.careerGoal.toLowerCase()) || careers[0];

  const analysis = calculateSkillGaps(student.skills || [], targetCareer.requiredSkills);
  analysis.targetCareer = targetCareer.title;

  res.json({ analysis, targetCareer });
});

// One Skill Away Simulation
app.get('/api/students/one-skill-away', (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student' });

  const jobs = db.get('jobs').filter(j => j.status === 'published');
  const allTargetSkills = jobs.map(j => j.requiredSkills);

  // Missing candidate skills across active jobs
  const currentSkillsNorm = (student.skills || []).map(s => s.name.toLowerCase());
  const missingCandidates = new Set<string>();
  jobs.forEach(j => {
    j.requiredSkills.forEach(req => {
      const norm = normalizeSkill(req);
      if (!currentSkillsNorm.includes(norm.toLowerCase())) {
        missingCandidates.add(norm);
      }
    });
  });

  const simulations = calculateOneSkillAway(student.skills || [], allTargetSkills, Array.from(missingCandidates));
  res.json(simulations);
});

// Evidence creation
app.post('/api/students/evidence/add', (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student' });

  const { skill, sourceType, sourceTitle, details, confidence } = req.body;
  if (!skill || !sourceType || !sourceTitle) {
    return res.status(400).json({ error: 'Missing required evidence fields' });
  }

  const normSkill = normalizeSkill(skill);
  const newEv: SkillEvidence = {
    id: `ev_${Date.now()}`,
    studentId: student.id,
    skill: normSkill,
    sourceType,
    sourceTitle,
    confidence: confidence || 0.85,
    date: new Date().toISOString(),
    details
  };

  db.update('evidences', evs => [newEv, ...evs]);

  // Update or add skill in student's profile
  db.update('students', students => {
    return students.map(s => {
      if (s.id === student.id) {
        const existingIdx = s.skills.findIndex(sk => sk.name.toLowerCase() === normSkill.toLowerCase());
        const updatedSkills = [...s.skills];
        if (existingIdx >= 0) {
          const old = updatedSkills[existingIdx];
          updatedSkills[existingIdx] = {
            ...old,
            confidence: Math.min(1.0, old.confidence + 0.05),
            level: Math.min(100, old.level + 5),
            evidenceCount: old.evidenceCount + 1,
            lastDemonstrated: new Date().toISOString(),
            freshness: 'recent'
          };
        } else {
          updatedSkills.push({
            skillId: `sk_${Date.now()}`,
            name: normSkill,
            level: 80,
            confidence: newEv.confidence,
            lastDemonstrated: new Date().toISOString(),
            evidenceCount: 1,
            freshness: 'recent'
          });
        }
        return {
          ...s,
          skills: updatedSkills,
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });
  });

  res.json({ success: true, evidence: newEv });
});

// Jobs & Opportunities API
app.get(['/api/jobs', '/api/opportunities'], (req, res) => {
  const jobs = db.get('jobs');
  const typeFilter = req.query.type as string; // 'all' | 'job' | 'internship'
  const student = resolveStudent(req);
  const evidences = student ? db.get('evidences').filter(e => e.studentId === student.id) : [];
  const attempts = db.get('assessmentAttempts') || [];

  let filteredJobs = jobs;
  if (typeFilter && typeFilter !== 'all') {
    filteredJobs = jobs.filter(j => {
      const oppType = j.opportunityType || (j.type === 'Internship' ? 'internship' : 'job');
      return oppType.toLowerCase() === typeFilter.toLowerCase();
    });
  }

  const enriched = filteredJobs.map(job => {
    let matchResult = null;
    let opportunityMatch = null;
    let assessmentAttempt = null;

    if (student) {
      matchResult = calculateSkillMatch(student.skills || [], job.requiredSkills, job.preferredSkills, job.skillWeights);
      assessmentAttempt = attempts.find(a => a.studentId === student.id && a.opportunityId === job.id);
      opportunityMatch = calculateOpportunityMatch(student, job, evidences, assessmentAttempt);
    }
    return {
      ...job,
      opportunityType: job.opportunityType || (job.type === 'Internship' ? 'internship' : 'job'),
      matchResult,
      opportunityMatch,
      assessmentAttempt
    };
  });

  res.json(enriched);
});

app.get(['/api/jobs/:id', '/api/opportunities/:id'], (req, res) => {
  const job = db.get('jobs').find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Opportunity not found' });

  const student = resolveStudent(req);
  let matchResult = null;
  let opportunityMatch = null;
  let assessmentAttempt = null;

  if (student) {
    const evidences = db.get('evidences').filter(e => e.studentId === student.id);
    const attempts = db.get('assessmentAttempts') || [];
    assessmentAttempt = attempts.find(a => a.studentId === student.id && a.opportunityId === job.id);
    matchResult = calculateSkillMatch(student.skills || [], job.requiredSkills, job.preferredSkills, job.skillWeights);
    opportunityMatch = calculateOpportunityMatch(student, job, evidences, assessmentAttempt);
  }

  res.json({
    job: {
      ...job,
      opportunityType: job.opportunityType || (job.type === 'Internship' ? 'internship' : 'job'),
      assessmentAttempt
    },
    matchResult,
    opportunityMatch
  });
});

app.post(['/api/jobs/create', '/api/opportunities/create'], (req, res) => {
  const user = resolveUser(req);
  if (user.role !== 'company' && user.role !== 'admin') {
    return res.status(403).json({ error: 'Only companies and administrators can post opportunities' });
  }

  const company = resolveCompany(req) || db.get('companies')[0];
  const {
    title,
    description,
    employmentType,
    opportunityType,
    location,
    workMode,
    salaryRange,
    salary,
    stipend,
    duration,
    internshipType,
    conversionPossibility,
    openings,
    experienceLevel,
    educationRequirement,
    requiredSkills,
    preferredSkills,
    assessmentRequired,
    assessmentSkills,
    minimumAssessmentScore,
    allowRetake,
    maxAttempts,
    deadline
  } = req.body;

  if (!title || !description || !requiredSkills || requiredSkills.length === 0) {
    return res.status(400).json({ error: 'Job title, description, and required skills are required' });
  }

  const resolvedOppType = opportunityType || (employmentType === 'Internship' ? 'internship' : 'job');

  const newJob: any = {
    id: `job_${Date.now()}`,
    companyId: company.id,
    companyName: company.name,
    title,
    description,
    type: employmentType || (resolvedOppType === 'internship' ? 'Internship' : 'Full-time'),
    employmentType: employmentType || (resolvedOppType === 'internship' ? 'Internship' : 'Full-time'),
    opportunityType: resolvedOppType,
    location: location || 'Remote',
    workMode: workMode || 'Remote',
    salaryRange: salaryRange || salary || (resolvedOppType === 'internship' ? (stipend || '₹25,000 / month') : '₹8,00,000 - ₹12,00,000 / yr'),
    salary: salary || salaryRange || (resolvedOppType === 'internship' ? (stipend || '₹25,000 / month') : '₹8,00,000 - ₹12,00,000 / yr'),
    stipend: resolvedOppType === 'internship' ? (stipend || '₹25,000 / month') : undefined,
    duration: resolvedOppType === 'internship' ? (duration || '3-6 months') : undefined,
    internshipType: resolvedOppType === 'internship' ? (internshipType || 'Summer') : undefined,
    conversionPossibility: resolvedOppType === 'internship' ? Boolean(conversionPossibility) : undefined,
    openings: openings ? Number(openings) : (resolvedOppType === 'internship' ? 3 : 1),
    experienceLevel: experienceLevel || (resolvedOppType === 'internship' ? 'Student / Intern' : 'Entry Level'),
    educationRequirement: educationRequirement || "Bachelor's degree in Engineering, Computer Science, or relevant field",
    requiredSkills: normalizeSkillsList(requiredSkills),
    preferredSkills: normalizeSkillsList(preferredSkills || []),
    assessmentRequired: Boolean(assessmentRequired),
    assessmentSkills: assessmentRequired ? normalizeSkillsList(assessmentSkills || requiredSkills) : [],
    minimumAssessmentScore: assessmentRequired ? (Number(minimumAssessmentScore) || 60) : undefined,
    allowRetake: allowRetake !== false,
    maxAttempts: Number(maxAttempts) || 3,
    deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: 'published' as const,
    applicantCount: 0,
    createdAt: new Date().toISOString()
  };

  db.update('jobs', j => [newJob, ...j]);
  res.json(newJob);
});

// Opportunity Mandatory Skill Assessment API
app.get('/api/opportunities/:id/assessment', (req, res) => {
  const job = db.get('jobs').find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Opportunity not found' });

  const targetSkills = (job.assessmentSkills && job.assessmentSkills.length > 0)
    ? job.assessmentSkills
    : job.requiredSkills;

  const targetLower = targetSkills.map(s => s.toLowerCase());

  // Match questions from QUESTION_BANK for these target skills
  const matched = QUESTION_BANK.filter(q => {
    const qSkill = q.skill.toLowerCase();
    return targetLower.some(ts => ts.includes(qSkill) || qSkill.includes(ts));
  });

  let selectedQuestions = matched.slice(0, 10);

  // Fallback if question bank has fewer than 5 questions
  if (selectedQuestions.length < 5) {
    const fallbackBank = QUESTION_BANK.slice(0, 5);
    selectedQuestions = [...selectedQuestions, ...fallbackBank.slice(0, 5 - selectedQuestions.length)];
  }

  // Sanitize questions so correctIndex and explanation are NOT leaked to candidate
  const sanitizedQuestions = selectedQuestions.map((q, idx) => ({
    id: q.id,
    questionNumber: idx + 1,
    skill: q.skill,
    question: q.question,
    options: q.options
  }));

  res.json({
    opportunityId: job.id,
    opportunityTitle: job.title,
    opportunityType: job.opportunityType || (job.type === 'Internship' ? 'internship' : 'job'),
    companyName: job.companyName,
    requiredSkills: targetSkills,
    passingScore: job.minimumAssessmentScore || 60,
    durationMinutes: 15,
    totalQuestions: sanitizedQuestions.length,
    questions: sanitizedQuestions
  });
});

// Submit Opportunity Mandatory Assessment Attempt
app.post('/api/opportunities/:id/assessment-attempt', (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(403).json({ error: 'Only registered students can take assessments' });

  const job = db.get('jobs').find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Opportunity not found' });

  const { answers } = req.body; // map of questionId -> chosenIndex
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Assessment answers object required' });
  }

  const targetSkills = (job.assessmentSkills && job.assessmentSkills.length > 0)
    ? job.assessmentSkills
    : job.requiredSkills;
  const targetLower = targetSkills.map(s => s.toLowerCase());

  // Find all matched questions
  const allCandidateQuestions = QUESTION_BANK.filter(q => {
    const qSkill = q.skill.toLowerCase();
    return targetLower.some(ts => ts.includes(qSkill) || qSkill.includes(ts));
  });
  const questionsMap = new Map(QUESTION_BANK.map(q => [q.id, q]));

  let correctCount = 0;
  let totalAnswered = 0;
  const skillBreakdown: Record<string, { total: number; correct: number }> = {};

  Object.entries(answers).forEach(([qId, chosenIndex]) => {
    const q = questionsMap.get(qId);
    if (q) {
      totalAnswered++;
      const isCorrect = chosenIndex === q.correctIndex;
      if (isCorrect) correctCount++;

      const sk = q.skill;
      if (!skillBreakdown[sk]) skillBreakdown[sk] = { total: 0, correct: 0 };
      skillBreakdown[sk].total++;
      if (isCorrect) skillBreakdown[sk].correct++;
    }
  });

  const totalQuestions = Math.max(1, totalAnswered);
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const passingScore = job.minimumAssessmentScore || 60;
  const passed = scorePercentage >= passingScore;

  // Record attempt
  const attempt: MandatoryAssessmentAttempt = {
    id: `att_${Date.now()}`,
    opportunityId: job.id,
    studentId: student.id,
    score: scorePercentage,
    passed,
    attemptNumber: ((db.get('assessmentAttempts') || []).filter(a => a.studentId === student.id && a.opportunityId === job.id).length) + 1,
    date: new Date().toISOString(),
    breakdown: Object.entries(skillBreakdown).map(([skill, stats]) => ({
      skill,
      score: Math.round((stats.correct / Math.max(1, stats.total)) * 100),
      passed: (stats.correct / Math.max(1, stats.total)) >= 0.6
    }))
  };

  db.update('assessmentAttempts', attempts => [attempt, ...(attempts || [])]);

  // If passed: inject high-confidence verified skill evidence into platform
  if (passed) {
    targetSkills.forEach(skillName => {
      const evidence: SkillEvidence = {
        id: `ev_mand_assm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        studentId: student.id,
        skill: skillName,
        sourceType: 'assessment',
        sourceId: job.id,
        sourceTitle: `${job.title} Assessment (${scorePercentage}%)`,
        confidence: 0.95,
        date: new Date().toISOString(),
        details: `Passed mandatory role assessment for ${job.title} at ${job.companyName} scoring ${scorePercentage}%.`
      };
      db.update('evidences', evs => [evidence, ...evs]);
    });

    // Update student's skills
    db.update('students', students => {
      return students.map(s => {
        if (s.id === student.id) {
          const currentSkills = [...(s.skills || [])];
          targetSkills.forEach(targetSkill => {
            const norm = normalizeSkill(targetSkill);
            const existingIdx = currentSkills.findIndex(sk => sk.name.toLowerCase() === norm.toLowerCase());
            if (existingIdx >= 0) {
              currentSkills[existingIdx] = {
                ...currentSkills[existingIdx],
                level: Math.max(currentSkills[existingIdx].level, scorePercentage),
                confidence: 0.95,
                verified: true,
                evidenceCount: (currentSkills[existingIdx].evidenceCount || 1) + 1,
                lastDemonstrated: new Date().toISOString(),
                freshness: 'recent'
              };
            } else {
              currentSkills.push({
                skillId: `sk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                name: norm,
                level: scorePercentage,
                confidence: 0.95,
                verified: true,
                lastDemonstrated: new Date().toISOString(),
                evidenceCount: 1,
                freshness: 'recent'
              });
            }
          });

          return {
            ...s,
            skills: currentSkills,
            careerReadinessScore: Math.min(100, (s.careerReadinessScore || 70) + 3),
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
    });

    // In-app Notification for student
    const notif = {
      id: `notif_${Date.now()}`,
      userId: student.userId,
      title: `Mandatory Assessment Passed! 🎯`,
      message: `You passed the assessment for ${job.title} (${scorePercentage}%). You are now eligible to submit your application.`,
      type: 'assessment' as const,
      read: false,
      createdAt: new Date().toISOString(),
      link: `/jobs`
    };
    db.update('notifications', n => [notif, ...n]);
  }

  res.json({
    success: true,
    attempt,
    passed,
    score: scorePercentage,
    passingScore,
    message: passed
      ? `Assessment passed! You achieved ${scorePercentage}%. Application is now unlocked.`
      : `Assessment not passed. You scored ${scorePercentage}% (required: ${passingScore}%). Please review your skills and retake.`
  });
});

// Apply to Job / Opportunity
app.post(['/api/jobs/:id/apply', '/api/opportunities/:id/apply'], (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(403).json({ error: 'Only students can apply to opportunities' });

  const job = db.get('jobs').find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Opportunity not found' });

  const existingApp = db.get('applications').find(a => a.studentId === student.id && a.jobId === job.id);
  if (existingApp) {
    return res.status(400).json({ error: 'You have already applied to this opportunity' });
  }

  const attempts = db.get('assessmentAttempts') || [];
  const latestAttempt = attempts.find(a => a.studentId === student.id && a.opportunityId === job.id);

  // Mandatory Assessment Gate
  if (job.assessmentRequired) {
    const passedAttempt = attempts.find(a => a.studentId === student.id && a.opportunityId === job.id && a.passed);
    if (!passedAttempt) {
      return res.status(403).json({
        error: 'Mandatory technical skill assessment must be passed before submitting this application.',
        assessmentRequired: true,
        minimumScore: job.minimumAssessmentScore || 60,
        opportunityId: job.id
      });
    }
  }

  const evidences = db.get('evidences').filter(e => e.studentId === student.id);
  const matchResult = calculateSkillMatch(student.skills || [], job.requiredSkills, job.preferredSkills);
  const candidateRank = calculateCandidateRank(student, job, evidences);
  const opportunityMatch = calculateOpportunityMatch(student, job, evidences, latestAttempt);

  const resolvedOppType = job.opportunityType || (job.type === 'Internship' ? 'internship' : 'job');

  const newApp: any = {
    id: `app_${Date.now()}`,
    studentId: student.id,
    studentName: student.name,
    studentEmail: student.email,
    studentCollege: student.college,
    studentDegree: student.degree,
    jobId: job.id,
    jobTitle: job.title,
    companyId: job.companyId,
    companyName: job.companyName,
    opportunityType: resolvedOppType,
    assessmentScore: latestAttempt?.score,
    assessmentPassed: !!(latestAttempt?.passed),
    resumeFileName: student.resumeFileName || 'Profile_Resume.pdf',
    matchScoreAtApplication: opportunityMatch.overallMatch,
    candidateScore: candidateRank.overallScore,
    status: 'applied' as ApplicationStatus,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        status: 'applied' as ApplicationStatus,
        date: new Date().toISOString(),
        note: `Application submitted with verified evidence and ${opportunityMatch.overallMatch}% match score`
      }
    ]
  };

  db.update('applications', apps => [newApp, ...apps]);

  // Increment applicant count
  db.update('jobs', jobs => jobs.map(j => j.id === job.id ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j));

  // Notification for student
  const notif = {
    id: `notif_${Date.now()}`,
    userId: student.userId,
    title: `Application Submitted to ${job.companyName}`,
    message: `Your application for ${job.title} was submitted with a ${opportunityMatch.overallMatch}% match score based on your verified skills and portfolio.`,
    type: 'application' as const,
    read: false,
    createdAt: new Date().toISOString(),
    link: '/applications'
  };
  db.update('notifications', n => [notif, ...n]);

  res.json({ success: true, application: newApp });
});

// Applications API
app.get('/api/applications', (req, res) => {
  const user = resolveUser(req);
  const allApps = db.get('applications');

  if (user.role === 'student') {
    const student = resolveStudent(req);
    if (!student) return res.json([]);
    // CRITICAL: Students must NEVER see internalHRNotes
    const safeApps = allApps
      .filter(a => a.studentId === student.id)
      .map(app => {
        const { internalHRNotes, ...sanitized } = app as any;
        return sanitized;
      });
    return res.json(safeApps);
  } else if (user.role === 'company') {
    const company = resolveCompany(req) || db.get('companies')[0];
    return res.json(allApps.filter(a => a.companyId === company.id));
  }

  // Admin gets all
  res.json(allApps);
});

// Company Candidate Ranking for a Job/Opportunity
app.get(['/api/company/jobs/:id/candidates', '/api/companies/jobs/:id/candidates'], (req, res) => {
  const job = db.get('jobs').find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Opportunity not found' });

  const students = db.get('students');
  const allEvidences = db.get('evidences');

  const rankedCandidates = students.map(std => {
    const studentEvidences = allEvidences.filter(e => e.studentId === std.id);
    return calculateCandidateRank(std, job, studentEvidences);
  }).sort((a, b) => b.overallScore - a.overallScore);

  res.json(rankedCandidates);
});

// HR Evaluation, Decision & Feedback Loop
app.post('/api/applications/:id/feedback', (req, res) => {
  const user = resolveUser(req);
  if (user.role !== 'company' && user.role !== 'admin') {
    return res.status(403).json({ error: 'Only companies or admins can submit feedback' });
  }

  const appId = req.params.id;
  const {
    status, // 'shortlisted' | 'interview' | 'selected' | 'rejected'
    primaryReason,
    skillGapsIdentified,
    internalHRNotes,
    studentFeedback
  } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  let targetApp: any = null;
  db.update('applications', apps => {
    return apps.map(app => {
      if (app.id === appId) {
        const newTimeline = [
          ...app.timeline,
          {
            status: status as ApplicationStatus,
            date: new Date().toISOString(),
            note: status === 'rejected'
              ? `Application rejected: ${primaryReason || 'Feedback provided'}`
              : `Status updated to ${status.toUpperCase()} by recruiter`
          }
        ];
        targetApp = {
          ...app,
          status: status as ApplicationStatus,
          rejectionReason: status === 'rejected' ? primaryReason : undefined,
          skillGapsIdentified: skillGapsIdentified || [],
          studentFeedback: studentFeedback || undefined,
          internalHRNotes: internalHRNotes || undefined,
          feedbackAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: newTimeline
        };
        return targetApp;
      }
      return app;
    });
  });

  if (!targetApp) {
    return res.status(404).json({ error: 'Application not found' });
  }

  // Record RecruiterFeedback
  const feedbackRecord: RecruiterFeedback = {
    id: `fb_${Date.now()}`,
    applicationId: targetApp.id,
    studentId: targetApp.studentId,
    opportunityId: targetApp.jobId,
    companyId: targetApp.companyId,
    status: status as 'rejected' | 'shortlisted' | 'interview' | 'selected',
    primaryReason: primaryReason || (status === 'rejected' ? 'Skills gap identified' : 'Candidate meets requirements'),
    skillGapsIdentified: skillGapsIdentified || [],
    internalHRNotes: internalHRNotes || '',
    studentFeedback: studentFeedback || '',
    createdAt: new Date().toISOString()
  };
  db.update('recruiterFeedbacks', fbs => [feedbackRecord, ...(fbs || [])]);

  // Create real in-app Notification for candidate
  const student = db.get('students').find(s => s.id === targetApp.studentId);
  if (student) {
    const isRejection = status === 'rejected';
    const notifTitle = isRejection
      ? `Application Update: ${targetApp.jobTitle}`
      : `Good News! Progress for ${targetApp.jobTitle} 🚀`;
    const notifMessage = isRejection
      ? `${targetApp.companyName} reviewed your application and provided actionable feedback. Review your personalized improvement plan to bridge identified gaps.`
      : `${targetApp.companyName} updated your application status to ${status.toUpperCase().replace('_', ' ')}. ${studentFeedback ? `Note: "${studentFeedback}"` : ''}`;

    const notif = {
      id: `notif_${Date.now()}`,
      userId: student.userId,
      title: notifTitle,
      message: notifMessage,
      type: 'application' as const,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/applications'
    };
    db.update('notifications', n => [notif, ...n]);
  }

  res.json({ success: true, application: targetApp });
});

// Update Application Status (legacy/quick status change)
app.put('/api/applications/:id/status', (req, res) => {
  const { status, note, internalHRNotes, studentFeedback, primaryReason, skillGapsIdentified } = req.body;
  const appId = req.params.id;

  let updatedApp: any = null;
  db.update('applications', apps => {
    return apps.map(app => {
      if (app.id === appId) {
        const newTimeline = [
          ...app.timeline,
          {
            status: status as ApplicationStatus,
            date: new Date().toISOString(),
            note: note || `Status updated to ${status.replace('_', ' ')}`
          }
        ];
        updatedApp = {
          ...app,
          status: status as ApplicationStatus,
          rejectionReason: status === 'rejected' ? (primaryReason || app.rejectionReason) : undefined,
          skillGapsIdentified: skillGapsIdentified || app.skillGapsIdentified,
          studentFeedback: studentFeedback || app.studentFeedback,
          internalHRNotes: internalHRNotes !== undefined ? internalHRNotes : app.internalHRNotes,
          updatedAt: new Date().toISOString(),
          timeline: newTimeline
        };
        return updatedApp;
      }
      return app;
    });
  });

  if (updatedApp) {
    const student = db.get('students').find(s => s.id === updatedApp.studentId);
    if (student) {
      const notif = {
        id: `notif_${Date.now()}`,
        userId: student.userId,
        title: `Application Update: ${updatedApp.jobTitle}`,
        message: `${updatedApp.companyName} updated your status to ${status.toUpperCase().replace('_', ' ')}. ${note || ''}`,
        type: 'application' as const,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/applications'
      };
      db.update('notifications', n => [notif, ...n]);
    }
    return res.json(updatedApp);
  }

  res.status(404).json({ error: 'Application not found' });
});

// Personalized Improvement Plan for Rejected or Skill-Gapped Applications
app.get('/api/applications/:id/improvement-plan', (req, res) => {
  const appId = req.params.id;
  const application = db.get('applications').find(a => a.id === appId);
  if (!application) return res.status(404).json({ error: 'Application not found' });

  const job = db.get('jobs').find(j => j.id === application.jobId);
  const student = db.get('students').find(s => s.id === application.studentId);
  const gaps = (application.skillGapsIdentified && application.skillGapsIdentified.length > 0)
    ? application.skillGapsIdentified
    : (job ? job.requiredSkills.filter(reqSkill => !(student?.skills || []).some(s => s.name.toLowerCase() === reqSkill.toLowerCase())) : ['Core Engineering Foundations']);

  // Match courses from COMPREHENSIVE_COURSES
  const courses = db.get('courses');
  const recommendedCourses = gaps.flatMap(gap => {
    const matched = courses.filter(c => c.skills.some(cs => cs.toLowerCase().includes(gap.toLowerCase()) || gap.toLowerCase().includes(cs.toLowerCase())));
    return matched.length > 0 ? matched : [courses[0]];
  }).slice(0, 3);

  // Concrete suggested projects
  const recommendedProjects = gaps.map((gap, i) => ({
    title: `Production Portfolio Build: ${gap} Integration`,
    description: `Design and implement an open-source GitHub portfolio repository demonstrating ${gap} in a real-world scenario with unit tests and live deployment.`,
    technologies: [gap, 'TypeScript', 'Docker'],
    expectedOutcome: `Verified high-confidence skill evidence for ${gap} on your CareerAI profile.`
  }));

  // Practice assessments
  const practiceAssessments = gaps.map(gap => ({
    skill: gap,
    assessmentTitle: `${gap} Core Knowledge Assessment`,
    passingScore: 65,
    durationMinutes: 15
  }));

  const plan: PersonalizedImprovementPlan = {
    applicationId: application.id,
    targetRole: application.jobTitle,
    companyName: application.companyName,
    identifiedGaps: gaps,
    studentFeedback: application.studentFeedback || 'Recruiter identified key areas for technical reinforcement.',
    recommendedCourses,
    recommendedProjects,
    practiceAssessments,
    generatedAt: new Date().toISOString()
  };

  res.json(plan);
});

// Student Capability Profile Update API
app.put('/api/students/profile', (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student found' });

  const {
    bio,
    phone,
    location,
    college,
    degree,
    graduationYear,
    cgpa,
    targetCareerId,
    education,
    projects,
    hackathons,
    freelanceWork,
    achievements,
    certifications,
    externalProfiles,
    skills
  } = req.body;

  let updatedStudent: any = null;
  db.update('students', students => {
    return students.map(s => {
      if (s.id === student.id) {
        const updatedCandidate: Student = {
          ...s,
          bio: bio !== undefined ? bio : s.bio,
          phone: phone !== undefined ? phone : s.phone,
          location: location !== undefined ? location : s.location,
          college: college !== undefined ? college : s.college,
          degree: degree !== undefined ? degree : s.degree,
          graduationYear: graduationYear !== undefined ? Number(graduationYear) : s.graduationYear,
          cgpa: cgpa !== undefined ? Number(cgpa) : s.cgpa,
          targetCareerId: targetCareerId !== undefined ? targetCareerId : s.targetCareerId,
          education: education !== undefined ? education : s.education,
          projects: projects !== undefined ? projects : s.projects,
          hackathons: hackathons !== undefined ? hackathons : s.hackathons,
          freelanceWork: freelanceWork !== undefined ? freelanceWork : s.freelanceWork,
          achievements: achievements !== undefined ? achievements : s.achievements,
          certifications: certifications !== undefined ? certifications : s.certifications,
          externalProfiles: externalProfiles !== undefined ? externalProfiles : s.externalProfiles,
          updatedAt: new Date().toISOString()
        };

        // Recalculate dynamic skill confidence from evidence
        const studentEvs = db.get('evidences').filter(e => e.studentId === s.id);
        const incomingSkills = skills || s.skills || [];
        const recalculatedSkills = incomingSkills.map((sk: any) => {
          const confidenceResult = calculateSkillConfidenceFromEvidence(sk.name, updatedCandidate, studentEvs);
          const calculatedConfidence = confidenceResult.confidence;
          return {
            ...sk,
            confidence: Math.max(sk.confidence || 0.6, calculatedConfidence),
            verified: calculatedConfidence >= 0.7
          };
        });

        updatedCandidate.skills = recalculatedSkills;

        // Recalculate career readiness
        const careers = db.get('careers');
        const targetCareer = careers.find(c => c.id === updatedCandidate.targetCareerId) || careers[0];
        updatedCandidate.careerReadinessScore = calculateCareerReadiness(updatedCandidate, targetCareer.requiredSkills, studentEvs);

        updatedStudent = updatedCandidate;
        return updatedCandidate;
      }
      return s;
    });
  });

  res.json({ success: true, student: updatedStudent });
});

// Admin Recruitment Analytics API
app.get('/api/admin/recruitment-analytics', (req, res) => {
  const jobs = db.get('jobs');
  const applications = db.get('applications');
  const attempts = db.get('assessmentAttempts') || [];
  const feedbacks = db.get('recruiterFeedbacks') || [];

  const totalOpportunities = jobs.length;
  const jobsCount = jobs.filter(j => (j.opportunityType || (j.type === 'Internship' ? 'internship' : 'job')) === 'job').length;
  const internshipsCount = jobs.filter(j => (j.opportunityType || (j.type === 'Internship' ? 'internship' : 'job')) === 'internship').length;

  const totalApplications = applications.length;
  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const reviewingCount = applications.filter(a => a.status === 'reviewing').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'interview').length;
  const selectedCount = applications.filter(a => a.status === 'selected').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter(a => a.passed).length;
  const assessmentPassRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 74;
  const averageAssessmentScore = totalAttempts > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
    : 78;

  // Aggregate top skill gaps identified across all rejections and feedbacks
  const gapCounter: Record<string, number> = {};
  applications.forEach(app => {
    (app.skillGapsIdentified || []).forEach(gap => {
      gapCounter[gap] = (gapCounter[gap] || 0) + 1;
    });
  });
  feedbacks.forEach(fb => {
    (fb.skillGapsIdentified || []).forEach(gap => {
      gapCounter[gap] = (gapCounter[gap] || 0) + 1;
    });
  });

  const topSkillGaps = Object.entries(gapCounter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([skill, count]) => ({ skill, count }));

  // Fallback if not many rejections logged yet
  if (topSkillGaps.length === 0) {
    topSkillGaps.push(
      { skill: 'Docker & Containerization', count: 5 },
      { skill: 'PyTorch Model Optimization', count: 4 },
      { skill: 'PostgreSQL Query Profiling', count: 3 },
      { skill: 'REST API Authentication', count: 3 }
    );
  }

  // Most demanded skills across published opportunities
  const demandCounter: Record<string, number> = {};
  jobs.forEach(job => {
    job.requiredSkills.forEach(s => {
      demandCounter[s] = (demandCounter[s] || 0) + 1;
    });
  });
  const topDemandedSkills = Object.entries(demandCounter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([skill, count]) => ({ skill, count }));

  res.json({
    dataSourceLabel: 'CareerAI Platform Data',
    totalOpportunities,
    jobsCount,
    internshipsCount,
    totalApplications,
    pipeline: {
      applied: appliedCount,
      reviewing: reviewingCount,
      shortlisted: shortlistedCount,
      interview: interviewCount,
      selected: selectedCount,
      rejected: rejectedCount
    },
    conversionFunnel: {
      shortlistRate: totalApplications > 0 ? Math.round((shortlistedCount / totalApplications) * 100) : 0,
      interviewRate: totalApplications > 0 ? Math.round((interviewCount / totalApplications) * 100) : 0,
      selectionRate: totalApplications > 0 ? Math.round((selectedCount / totalApplications) * 100) : 0,
      rejectionRate: totalApplications > 0 ? Math.round((rejectedCount / totalApplications) * 100) : 0
    },
    assessmentMetrics: {
      totalAttempts,
      passedAttempts,
      passRate: assessmentPassRate,
      averageScore: averageAssessmentScore
    },
    topSkillGaps,
    topDemandedSkills
  });
});

// Candidate Ranking for Companies
app.get('/api/company/jobs/:id/candidates', (req, res) => {
  const jobId = req.params.id;
  const job = db.get('jobs').find(j => j.id === jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const applications = db.get('applications').filter(a => a.jobId === jobId);
  const students = db.get('students');
  const evidences = db.get('evidences');
  const attempts = db.get('assessmentAttempts') || [];

  const rankedCandidates = applications.map(app => {
    const student = students.find(s => s.id === app.studentId) || {
      id: app.studentId,
      name: app.studentName,
      email: app.studentEmail,
      college: app.studentCollege,
      degree: app.studentDegree,
      skills: [],
      careerReadinessScore: 70
    } as any;

    const studentEvs = evidences.filter(e => e.studentId === student.id);
    const candidateAttempt = attempts.find(a => a.studentId === student.id && a.opportunityId === job.id);
    const scoreBreakdown = calculateCandidateRank(student, job, studentEvs);
    const matchDetails = calculateSkillMatch(student.skills, job.requiredSkills, job.preferredSkills);
    const opportunityMatch = calculateOpportunityMatch(student, job, studentEvs, candidateAttempt);

    return {
      application: app,
      student,
      skillMatch: scoreBreakdown.skillMatch,
      evidenceConfidence: scoreBreakdown.evidenceConfidence,
      experienceYears: scoreBreakdown.experienceYears,
      assessmentScore: candidateAttempt ? candidateAttempt.score : scoreBreakdown.assessmentScore,
      assessmentPassed: candidateAttempt ? candidateAttempt.passed : (app.assessmentPassed ?? true),
      overallCandidateScore: opportunityMatch.overallMatch || scoreBreakdown.overallScore,
      matchedSkills: matchDetails.matchedSkills,
      missingSkills: matchDetails.missingSkills,
      opportunityMatch,
      evidenceSummary: {
        projectsCount: (student.projects || []).length,
        hackathonsCount: (student.hackathons || []).length,
        freelanceCount: (student.freelanceWork || []).length,
        certificationsCount: (student.certifications || []).length,
        achievementsCount: (student.achievements || []).length,
        githubRepos: student.externalProfiles?.github?.publicRepos || 0,
        leetcodeSolved: student.externalProfiles?.leetcode?.problemsSolved || 0
      }
    };
  });

  // Sort descending by overall candidate score
  rankedCandidates.sort((a, b) => b.overallCandidateScore - a.overallCandidateScore);

  res.json(rankedCandidates);
});

// Courses & Learning Progress
app.get('/api/courses', (req, res) => {
  res.json(db.get('courses'));
});

app.get('/api/learning/progress', (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.json([]);

  const courses = db.get('courses');
  // Generate realistic progress for student
  const progressList = [
    {
      id: `lp_${student.id}`,
      studentId: student.id,
      courseId: 'crs_pytorch',
      courseTitle: 'Production Deep Learning with PyTorch',
      progress: 75,
      completed: false,
      startedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      lastActivity: new Date(Date.now() - 2 * 86400000).toISOString(),
      completedLessons: 9,
      totalLessons: 12
    }
  ];
  res.json(progressList);
});

// Assessments API
app.get('/api/assessments', (req, res) => {
  const assessments = db.get('assessments').map(a => ({
    id: a.id,
    skillId: a.skillId,
    skillName: a.skillName,
    title: a.title,
    description: a.description,
    durationMinutes: a.durationMinutes,
    passingScore: a.passingScore,
    questionCount: a.questions.length
  }));
  res.json(assessments);
});

app.get('/api/assessments/:id', (req, res) => {
  const assessment = db.get('assessments').find(a => a.id === req.params.id || a.skillId === req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
  // Return questions without disclosing correct answers
  const sanitized = {
    ...assessment,
    questions: assessment.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }))
  };
  res.json(sanitized);
});

app.post('/api/assessments/:id/submit', (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student' });

  const assessment = db.get('assessments').find(a => a.id === req.params.id || a.skillId === req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

  const { answers } = req.body; // map of question id -> chosen option index
  if (!answers) return res.status(400).json({ error: 'Answers object required' });

  let correctCount = 0;
  const results = assessment.questions.map(q => {
    const chosen = answers[q.id];
    const isCorrect = chosen === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      question: q.question,
      chosenIndex: chosen,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const scorePercentage = Math.round((correctCount / assessment.questions.length) * 100);
  const passed = scorePercentage >= assessment.passingScore;

  if (passed) {
    // Add verified SkillEvidence
    const evidence: SkillEvidence = {
      id: `ev_assm_${Date.now()}`,
      studentId: student.id,
      skill: assessment.skillName,
      sourceType: 'assessment',
      sourceId: assessment.id,
      sourceTitle: `${assessment.title} Passed (${scorePercentage}%)`,
      confidence: 0.95,
      date: new Date().toISOString(),
      details: `Scored ${correctCount}/${assessment.questions.length} on verified platform technical assessment.`
    };
    db.update('evidences', evs => [evidence, ...evs]);

    // Boost skill in student profile
    db.update('students', students => {
      return students.map(s => {
        if (s.id === student.id) {
          const normName = normalizeSkill(assessment.skillName);
          const studentSkills = s.skills || [];
          const idx = studentSkills.findIndex(sk => sk.name.toLowerCase() === normName.toLowerCase());
          const updatedSkills = [...studentSkills];
          if (idx >= 0) {
            updatedSkills[idx] = {
              ...updatedSkills[idx],
              level: Math.max(updatedSkills[idx].level, scorePercentage),
              confidence: 0.95,
              evidenceCount: (updatedSkills[idx].evidenceCount || 1) + 1,
              lastDemonstrated: new Date().toISOString(),
              freshness: 'recent'
            };
          } else {
            updatedSkills.push({
              skillId: `sk_${Date.now()}`,
              name: normName,
              level: scorePercentage,
              confidence: 0.95,
              lastDemonstrated: new Date().toISOString(),
              evidenceCount: 1,
              freshness: 'recent'
            });
          }

          const careers = db.get('careers');
          const targetCareer = careers.find(c => c.id === s.targetCareerId) || careers[0];
          const allEvs = db.get('evidences').filter(e => e.studentId === s.id);
          const newReadiness = calculateCareerReadiness({ ...s, skills: updatedSkills }, targetCareer.requiredSkills, allEvs);

          return {
            ...s,
            skills: updatedSkills,
            careerReadinessScore: newReadiness,
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
    });

    // Notification
    const notif = {
      id: `notif_${Date.now()}`,
      userId: student.userId,
      title: `Assessment Passed: ${assessment.skillName} 🏆`,
      message: `Congratulations! You scored ${scorePercentage}% on the ${assessment.skillName} test. Your capability confidence is now 95%.`,
      type: 'assessment' as const,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/skills-graph'
    };
    db.update('notifications', n => [notif, ...n]);
  }

  res.json({
    score: scorePercentage,
    passed,
    correctCount,
    totalQuestions: assessment.questions.length,
    results
  });
});

// AI Endpoints
app.post('/api/ai/job-extract', async (req, res) => {
  const { rawText } = req.body;
  if (!rawText) return res.status(400).json({ error: 'Text required' });
  const result = await parseJobDescriptionWithGemini(rawText);
  res.json(result);
});

app.get('/api/ai/career-doctor', async (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student' });

  const applications = db.get('applications').filter(a => a.studentId === student.id);
  const careers = db.get('careers');
  const targetCareer = careers.find(c => c.id === student.targetCareerId) || careers[0];

  const diagnosis = await generateCareerDoctorDiagnosis(student, applications, targetCareer);
  res.json(diagnosis);
});

app.post('/api/ai/chat', async (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student' });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  const careers = db.get('careers');
  const targetCareer = careers.find(c => c.id === student.targetCareerId) || careers[0];

  const reply = await chatCareerAssistant(messages, student, targetCareer);
  res.json({ message: reply });
});

app.post('/api/ai/cover-letter', async (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(404).json({ error: 'No active student' });

  const { jobId, customNotes } = req.body;
  if (!jobId) return res.status(400).json({ error: 'Job ID required' });

  const job = db.get('jobs').find(j => j.id === jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  try {
    const letter = await generateCoverLetter(student, job, customNotes);
    res.json({ coverLetter: letter });
  } catch (err: any) {
    console.error('Cover letter generation error:', err);
    res.status(500).json({ error: 'Failed to generate tailored cover letter' });
  }
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const user = resolveUser(req);
  const notifs = db.get('notifications').filter(n => n.userId === user.id);
  res.json(notifs);
});

app.post('/api/notifications/:id/read', (req, res) => {
  db.update('notifications', notifs => notifs.map(n => n.id === req.params.id ? { ...n, read: true } : n));
  res.json({ success: true });
});

// Admin System Metrics
app.get('/api/admin/metrics', (req, res) => {
  const students = db.get('students');
  const companies = db.get('companies');
  const jobs = db.get('jobs');
  const applications = db.get('applications');
  const evidences = db.get('evidences');

  const avgReadiness = Math.round(students.reduce((acc, s) => acc + (s.careerReadinessScore || 0), 0) / (students.length || 1));
  const avgAts = Math.round(students.reduce((acc, s) => acc + (s.resumeScore || 80), 0) / (students.length || 1));

  res.json({
    totalStudents: students.length,
    totalCompanies: companies.length,
    activeJobs: jobs.filter(j => j.status === 'published').length,
    totalApplications: applications.length,
    totalEvidencesVerified: evidences.length,
    averageReadinessScore: avgReadiness,
    averageAtsScore: avgAts,
    applicationStatusDistribution: {
      applied: applications.filter(a => a.status === 'applied').length,
      under_review: applications.filter(a => a.status === 'under_review').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      interview: applications.filter(a => a.status === 'interview').length,
      selected: applications.filter(a => a.status === 'selected').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    }
  });
});

// Industry Market Insights API
app.get('/api/industry/insights', (req, res) => {
  const jobs = db.get('jobs');
  const students = db.get('students');
  const companies = db.get('companies');
  const careers = db.get('careers');
  const applications = db.get('applications');

  // Compute skill demand across all jobs
  const demandMap: Record<string, { required: number; preferred: number }> = {};
  jobs.forEach(j => {
    (j.requiredSkills || []).forEach(sk => {
      const norm = normalizeSkill(sk);
      if (!demandMap[norm]) demandMap[norm] = { required: 0, preferred: 0 };
      demandMap[norm].required += 1;
    });
    (j.preferredSkills || []).forEach(sk => {
      const norm = normalizeSkill(sk);
      if (!demandMap[norm]) demandMap[norm] = { required: 0, preferred: 0 };
      demandMap[norm].preferred += 1;
    });
  });

  // Compute student supply across all students
  const supplyMap: Record<string, number> = {};
  students.forEach(s => {
    (s.skills || []).forEach(sk => {
      const norm = normalizeSkill(sk.name);
      supplyMap[norm] = (supplyMap[norm] || 0) + 1;
    });
  });

  const skillsList = Object.keys(demandMap).map(skillName => {
    const reqCount = demandMap[skillName].required;
    const prefCount = demandMap[skillName].preferred;
    const totalDemand = reqCount * 2 + prefCount;
    const supplyCount = supplyMap[skillName] || 0;
    const gapIndex = Math.max(0, reqCount - supplyCount);
    return {
      skill: skillName,
      requiredInJobs: reqCount,
      preferredInJobs: prefCount,
      totalDemandScore: totalDemand,
      talentSupplyCount: supplyCount,
      deficit: gapIndex,
      readinessCoverage: supplyCount > 0 ? Math.min(100, Math.round((supplyCount / (reqCount || 1)) * 100)) : 0
    };
  }).sort((a, b) => b.totalDemandScore - a.totalDemandScore);

  // Domain breakdown
  const domainBreakdown = careers.map(c => {
    const relatedJobs = jobs.filter(j =>
      j.title.toLowerCase().includes(c.title.toLowerCase()) ||
      c.requiredSkills.some(rs => j.requiredSkills.includes(rs))
    );
    const domainStudents = students.filter(s => s.targetCareerId === c.id);
    const avgReadiness = domainStudents.length
      ? Math.round(domainStudents.reduce((acc, s) => acc + (s.careerReadinessScore || 0), 0) / domainStudents.length)
      : 0;

    return {
      domain: c.domain,
      careerTitle: c.title,
      avgSalary: c.avgSalary,
      growthRate: c.growthRate,
      activeOpenings: relatedJobs.length,
      candidatePoolCount: domainStudents.length,
      averageReadiness: avgReadiness
    };
  });

  res.json({
    summary: {
      totalJobs: jobs.length,
      totalCompanies: companies.length,
      totalCandidates: students.length,
      totalApplications: applications.length,
      marketReadinessScore: Math.round(students.reduce((acc, s) => acc + (s.careerReadinessScore || 0), 0) / (students.length || 1)),
      verifiedCredentialRate: 94
    },
    topInDemandSkills: skillsList,
    domainBreakdown,
    topEmergingSkills: ['PyTorch', 'FastAPI', 'Docker', 'Kubernetes', 'TypeScript', 'Tailwind CSS']
  });
});

// Reset demo state
app.post('/api/system/reset-seed', (req, res) => {
  db.resetToSeed();
  currentUserId = 'usr_demo_student_1';
  res.json({ success: true, message: 'Database reset to initial demo seed' });
});

// ---------------- Vite Middleware / Production Serving ----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerAI Platform Server running on port ${PORT}`);
  });
}

startServer();
