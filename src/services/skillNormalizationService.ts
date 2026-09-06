// Skill Normalization Service
// Standardizes diverse skill strings (e.g. 'ReactJS', 'react.js', 'React') into canonical names.

export const CANONICAL_SKILL_MAP: Record<string, string> = {
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Express.js',
  'expressjs': 'Express.js',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'python': 'Python',
  'py': 'Python',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'tf': 'TensorFlow',
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'dl': 'Deep Learning',
  'nlp': 'Natural Language Processing',
  'natural language processing': 'Natural Language Processing',
  'computer vision': 'Computer Vision',
  'cv': 'Computer Vision',
  'docker': 'Docker',
  'containerization': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'Google Cloud',
  'google cloud platform': 'Google Cloud',
  'google cloud': 'Google Cloud',
  'azure': 'Microsoft Azure',
  'sql': 'SQL',
  'mysql': 'MySQL',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'redis': 'Redis',
  'git': 'Git',
  'github': 'Git',
  'graphql': 'GraphQL',
  'rest': 'REST API',
  'rest api': 'REST API',
  'restful apis': 'REST API',
  'fastapi': 'FastAPI',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-Learn',
  'sklearn': 'Scikit-Learn',
  'tailwindcss': 'Tailwind CSS',
  'tailwind': 'Tailwind CSS',
  'ci/cd': 'CI/CD',
  'continuous integration': 'CI/CD',
  'linux': 'Linux',
  'bash': 'Bash/Shell',
  'cybersecurity': 'Cybersecurity',
  'owasp': 'OWASP',
  'networking': 'Networking',
  'flutter': 'Flutter',
  'dart': 'Dart',
  'java': 'Java',
  'spring boot': 'Spring Boot',
  'power bi': 'Power BI',
  'tableau': 'Tableau',
  'excel': 'Excel',
  'statistics': 'Statistics',
  'figma': 'Figma',
  'ui design': 'UI Design',
  'dsa': 'DSA',
  'oop': 'OOP',
  'transformers': 'Transformers',
  'html': 'HTML',
  'css': 'CSS',
  'system design': 'System Design'
};

export const skillNormalizationService = {
  normalizeSkill(skill: string): string {
    if (!skill) return '';
    const trimmed = skill.trim().toLowerCase();
    if (CANONICAL_SKILL_MAP[trimmed]) {
      return CANONICAL_SKILL_MAP[trimmed];
    }
    return skill.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  },

  normalizeSkillsList(skills: string[]): string[] {
    const set = new Set<string>();
    skills.forEach(s => {
      const norm = this.normalizeSkill(s);
      if (norm) set.add(norm);
    });
    return Array.from(set);
  },

  skillIntersection(studentSkills: string[], requiredSkills: string[]): string[] {
    const normStudent = new Set(this.normalizeSkillsList(studentSkills).map(s => s.toLowerCase()));
    return this.normalizeSkillsList(requiredSkills).filter(req => normStudent.has(req.toLowerCase()));
  },

  skillDifference(requiredSkills: string[], studentSkills: string[]): string[] {
    const normStudent = new Set(this.normalizeSkillsList(studentSkills).map(s => s.toLowerCase()));
    return this.normalizeSkillsList(requiredSkills).filter(req => !normStudent.has(req.toLowerCase()));
  }
};
