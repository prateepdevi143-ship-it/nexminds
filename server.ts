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
  calculateSkillFreshness
} from './src/algorithms/matching';
import {
  analyzeResumeWithGemini,
  parseJobDescriptionWithGemini,
  generateCareerDoctorDiagnosis,
  chatCareerAssistant,
  generateCoverLetter
} from './server/ai';
import { ApplicationStatus, SkillEvidence, Student, User, Company } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Dynamic user resolution supporting Firebase Auth UID headers
let currentUserId = 'usr_student_01';

function resolveUser(req: express.Request): User {
  const customUid = req.headers['x-user-id'] as string;
  const customEmail = req.headers['x-user-email'] as string;
  const customName = req.headers['x-user-name'] ? decodeURIComponent(req.headers['x-user-name'] as string) : '';

  const users = db.get('users');

  if (customUid) {
    let user = users.find(u => u.id === customUid);
    if (!user) {
      // Check if student profile exists for this UID or create just-in-time user
      const students = db.get('students');
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
  const user = resolveUser(req);
  if (user.role !== 'student') return undefined;

  const students = db.get('students');
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
  const { role, email } = req.body;
  const users = db.get('users');
  let targetUser: User | undefined;

  if (email) {
    targetUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  if (!targetUser && role) {
    if (role === 'student') targetUser = users.find(u => u.id === 'usr_demo_student_1') || users.find(u => u.role === 'student');
    else if (role === 'company') targetUser = users.find(u => u.id === 'usr_demo_company_1') || users.find(u => u.role === 'company');
    else if (role === 'admin') targetUser = users.find(u => u.id === 'usr_demo_admin') || users.find(u => u.role === 'admin');
    else if (role === 'industry') targetUser = users.find(u => u.id === 'usr_demo_industry') || users.find(u => u.role === 'industry');
    else targetUser = users.find(u => u.role === role);
  }

  if (targetUser) {
    currentUserId = targetUser.id;
    let profile: any = null;
    if (targetUser.role === 'student') {
      profile = db.get('students').find(s => s.userId === targetUser!.id);
    } else if (targetUser.role === 'company') {
      profile = db.get('companies').find(c => c.userId === targetUser!.id);
    }
    return res.json({ user: targetUser, profile });
  }

  res.status(400).json({ error: 'User or role not found' });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const users = db.get('users');
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: 'User with this email not found in demo environment' });
  }
  currentUserId = user.id;
  let profile: any = null;
  if (user.role === 'student') {
    profile = db.get('students').find(s => s.userId === user.id);
  } else if (user.role === 'company') {
    profile = db.get('companies').find(c => c.userId === user.id);
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
app.get('/api/students/profile', (req, res) => {
  const student = resolveStudent(req);
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

// Jobs API
app.get('/api/jobs', (req, res) => {
  const jobs = db.get('jobs');
  const student = resolveStudent(req);

  const enriched = jobs.map(job => {
    let matchResult = null;
    if (student) {
      matchResult = calculateSkillMatch(student.skills || [], job.requiredSkills, job.preferredSkills, job.skillWeights);
    }
    return {
      ...job,
      matchResult
    };
  });

  res.json(enriched);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = db.get('jobs').find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const student = resolveStudent(req);
  let matchResult = null;
  if (student) {
    matchResult = calculateSkillMatch(student.skills || [], job.requiredSkills, job.preferredSkills, job.skillWeights);
  }

  res.json({ job, matchResult });
});

app.post('/api/jobs/create', (req, res) => {
  const user = resolveUser(req);
  if (user.role !== 'company' && user.role !== 'admin') {
    return res.status(403).json({ error: 'Only companies can post jobs' });
  }

  const company = resolveCompany(req) || db.get('companies')[0];
  const {
    title,
    description,
    employmentType,
    location,
    workMode,
    salaryRange,
    experienceLevel,
    educationRequirement,
    requiredSkills,
    preferredSkills,
    deadline
  } = req.body;

  if (!title || !description || !requiredSkills || requiredSkills.length === 0) {
    return res.status(400).json({ error: 'Job title, description, and required skills are required' });
  }

  const newJob = {
    id: `job_${Date.now()}`,
    companyId: company.id,
    companyName: company.name,
    title,
    description,
    employmentType: employmentType || 'Full-time',
    location: location || 'Remote',
    workMode: workMode || 'Remote',
    salaryRange: salaryRange || '$90,000 - $130,000 / yr',
    experienceLevel: experienceLevel || 'Entry Level',
    educationRequirement: educationRequirement || "Bachelor's degree in CS, Engineering, or relevant field",
    requiredSkills: normalizeSkillsList(requiredSkills),
    preferredSkills: normalizeSkillsList(preferredSkills || []),
    deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: 'published' as const,
    applicantCount: 0,
    createdAt: new Date().toISOString()
  };

  db.update('jobs', j => [newJob, ...j]);
  res.json(newJob);
});

// Apply to Job
app.post('/api/jobs/:id/apply', (req, res) => {
  const student = resolveStudent(req);
  if (!student) return res.status(403).json({ error: 'Only students can apply to jobs' });

  const job = db.get('jobs').find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const existingApp = db.get('applications').find(a => a.studentId === student.id && a.jobId === job.id);
  if (existingApp) {
    return res.status(400).json({ error: 'You have already applied to this job' });
  }

  const evidences = db.get('evidences').filter(e => e.studentId === student.id);
  const matchResult = calculateSkillMatch(student.skills || [], job.requiredSkills, job.preferredSkills);
  const candidateRank = calculateCandidateRank(student, job, evidences);

  const newApp = {
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
    resumeFileName: student.resumeFileName || 'Profile_Resume.pdf',
    matchScoreAtApplication: matchResult.matchScore,
    candidateScore: candidateRank.overallScore,
    status: 'applied' as ApplicationStatus,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        status: 'applied' as ApplicationStatus,
        date: new Date().toISOString(),
        note: 'Application verified and submitted through CareerAI'
      }
    ]
  };

  db.update('applications', apps => [newApp, ...apps]);

  // Increment applicant count
  db.update('jobs', jobs => jobs.map(j => j.id === job.id ? { ...j, applicantCount: j.applicantCount + 1 } : j));

  // Notification for student
  const notif = {
    id: `notif_${Date.now()}`,
    userId: student.userId,
    title: `Application Submitted to ${job.companyName}`,
    message: `Your application for ${job.title} was submitted with a ${matchResult.matchScore}% capability match score.`,
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
    return res.json(allApps.filter(a => a.studentId === student.id));
  } else if (user.role === 'company') {
    const company = resolveCompany(req) || db.get('companies')[0];
    return res.json(allApps.filter(a => a.companyId === company.id));
  }

  // Admin gets all
  res.json(allApps);
});

// Update Application Status (for company review pipeline)
app.put('/api/applications/:id/status', (req, res) => {
  const { status, note } = req.body;
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
          updatedAt: new Date().toISOString(),
          timeline: newTimeline
        };
        return updatedApp;
      }
      return app;
    });
  });

  if (updatedApp) {
    // Notify student
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

// Candidate Ranking for Companies
app.get('/api/company/jobs/:id/candidates', (req, res) => {
  const jobId = req.params.id;
  const job = db.get('jobs').find(j => j.id === jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const applications = db.get('applications').filter(a => a.jobId === jobId);
  const students = db.get('students');
  const evidences = db.get('evidences');

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
    const scoreBreakdown = calculateCandidateRank(student, job, studentEvs);
    const matchDetails = calculateSkillMatch(student.skills, job.requiredSkills, job.preferredSkills);

    return {
      application: app,
      student,
      skillMatch: scoreBreakdown.skillMatch,
      evidenceConfidence: scoreBreakdown.evidenceConfidence,
      experienceYears: scoreBreakdown.experienceYears,
      assessmentScore: scoreBreakdown.assessmentScore,
      overallCandidateScore: scoreBreakdown.overallScore,
      matchedSkills: matchDetails.matchedSkills,
      missingSkills: matchDetails.missingSkills
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
