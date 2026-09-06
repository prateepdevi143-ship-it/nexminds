import { Course } from '../types';

export const COMPREHENSIVE_COURSES: Course[] = [
  // 1. Python
  {
    id: 'crs_py_adv',
    title: 'Python Core & Advanced Systems Programming',
    provider: 'CareerAI Technical Academy',
    url: '#',
    category: 'Backend & Systems',
    difficulty: 'Intermediate',
    durationHours: 16,
    rating: 4.9,
    totalLessons: 14,
    skills: ['Python', 'DSA', 'OOP'],
    description: 'Master Python memory model, generators, concurrency with asyncio, metaprogramming, and writing production-grade modules.'
  },
  // 2. Machine Learning
  {
    id: 'crs_ml_eng',
    title: 'Applied Machine Learning & Statistical Modeling',
    provider: 'DataSphere Institute',
    url: '#',
    category: 'AI & Data Science',
    difficulty: 'Intermediate',
    durationHours: 24,
    rating: 4.8,
    totalLessons: 18,
    skills: ['Machine Learning', 'Python', 'Scikit-Learn', 'Pandas'],
    description: 'End-to-end supervised and unsupervised learning, feature engineering pipelines, cross-validation, and model deployment.'
  },
  // 3. Deep Learning
  {
    id: 'crs_dl_pytorch',
    title: 'Production Deep Learning with PyTorch',
    provider: 'Deep Learning Labs',
    url: '#',
    category: 'AI & Data Science',
    difficulty: 'Advanced',
    durationHours: 28,
    rating: 4.9,
    totalLessons: 20,
    skills: ['Deep Learning', 'PyTorch', 'Python'],
    description: 'Build and train neural networks, CNNs for computer vision, loss optimization, gradient clipping, and distributed training on GPUs.'
  },
  // 4. NLP
  {
    id: 'crs_nlp_llms',
    title: 'Natural Language Processing & Transformer Architectures',
    provider: 'AI Research Institute',
    url: '#',
    category: 'AI & Data Science',
    difficulty: 'Advanced',
    durationHours: 22,
    rating: 4.9,
    totalLessons: 16,
    skills: ['Natural Language Processing', 'Transformers', 'Python', 'PyTorch'],
    description: 'Tokenization, attention mechanisms, fine-tuning BERT and Llama models, semantic embeddings, and vector databases.'
  },
  // 5. React
  {
    id: 'crs_react_modern',
    title: 'Modern React 19, Hooks & State Architecture',
    provider: 'NextStack Academy',
    url: '#',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationHours: 18,
    rating: 4.8,
    totalLessons: 15,
    skills: ['React', 'JavaScript', 'Tailwind CSS'],
    description: 'Component lifecycles, memoization with useMemo/useCallback, custom hooks, context architecture, and performance profiling.'
  },
  // 6. JavaScript
  {
    id: 'crs_js_deep_dive',
    title: 'Modern JavaScript: Event Loop, Closures & Async Patterns',
    provider: 'FullStack Institute',
    url: '#',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationHours: 14,
    rating: 4.7,
    totalLessons: 12,
    skills: ['JavaScript', 'HTML', 'CSS'],
    description: 'Deep dive into V8 engine internals, call stack, microtask queue, prototypes, Promises, and ES2024 features.'
  },
  // 7. Node.js
  {
    id: 'crs_nodejs_microservices',
    title: 'Scalable Backend Services with Node.js & Express',
    provider: 'Backend Engineering Guild',
    url: '#',
    category: 'Backend',
    difficulty: 'Intermediate',
    durationHours: 20,
    rating: 4.8,
    totalLessons: 16,
    skills: ['Node.js', 'Express.js', 'REST API', 'JavaScript'],
    description: 'Architecting RESTful services, middleware pipelines, JWT auth, clustering, streams, error boundaries, and rate limiting.'
  },
  // 8. MongoDB
  {
    id: 'crs_mongodb_scale',
    title: 'MongoDB Schema Design & High-Throughput Aggregations',
    provider: 'DataSphere Institute',
    url: '#',
    category: 'Database & Analytics',
    difficulty: 'Intermediate',
    durationHours: 12,
    rating: 4.7,
    totalLessons: 10,
    skills: ['MongoDB', 'Database', 'Node.js'],
    description: 'Document schema design patterns, indexing strategies, complex aggregation pipelines, sharding, and replica sets.'
  },
  // 9. SQL
  {
    id: 'crs_sql_mastery',
    title: 'Enterprise SQL & PostgreSQL Performance Tuning',
    provider: 'Database Engineering Guild',
    url: '#',
    category: 'Database & Analytics',
    difficulty: 'Intermediate',
    durationHours: 16,
    rating: 4.9,
    totalLessons: 14,
    skills: ['SQL', 'PostgreSQL', 'Database'],
    description: 'Complex joins, window functions, query execution plan analysis with EXPLAIN ANALYZE, indexing, and ACID transactions.'
  },
  // 10. Data Science
  {
    id: 'crs_datascience_foundations',
    title: 'Data Science & Statistical Analysis with Pandas',
    provider: 'DataSphere Institute',
    url: '#',
    category: 'AI & Data Science',
    difficulty: 'Intermediate',
    durationHours: 20,
    rating: 4.8,
    totalLessons: 16,
    skills: ['Data Science', 'Pandas', 'NumPy', 'Python', 'Statistics'],
    description: 'Exploratory data analysis (EDA), data cleaning, hypothesis testing, probability distributions, and data visualization with Seaborn.'
  },
  // 11. Cybersecurity
  {
    id: 'crs_cybersec_soc',
    title: 'Practical Cybersecurity Defense & SOC Operations',
    provider: 'CyberShield Academy',
    url: '#',
    category: 'Security',
    difficulty: 'Intermediate',
    durationHours: 22,
    rating: 4.8,
    totalLessons: 18,
    skills: ['Cybersecurity', 'Networking', 'Linux', 'OWASP'],
    description: 'Threat hunting, network packet analysis with Wireshark, intrusion detection, SIEM log triage, and incident response playbooks.'
  },
  // 12. Cloud (GCP / Multi-Cloud)
  {
    id: 'crs_gcp_cloud_architect',
    title: 'Google Cloud Platform Solutions Architect',
    provider: 'Cloud Native Labs',
    url: '#',
    category: 'DevOps & Cloud',
    difficulty: 'Intermediate',
    durationHours: 20,
    rating: 4.8,
    totalLessons: 15,
    skills: ['Google Cloud', 'Cloud Computing', 'Docker', 'Linux'],
    description: 'Compute Engine, Cloud Run serverless deployment, VPC networks, Cloud Storage, IAM policies, and cloud cost management.'
  },
  // 13. AWS
  {
    id: 'crs_aws_certified',
    title: 'AWS Cloud Architecture & Serverless Computing',
    provider: 'CloudWorks Institute',
    url: '#',
    category: 'DevOps & Cloud',
    difficulty: 'Intermediate',
    durationHours: 24,
    rating: 4.9,
    totalLessons: 18,
    skills: ['AWS', 'Cloud Computing', 'Linux'],
    description: 'EC2, S3, Lambda serverless, API Gateway, DynamoDB, CloudWatch telemetry, and architecting fault-tolerant infrastructure.'
  },
  // 14. Docker
  {
    id: 'crs_docker_containers',
    title: 'Docker & Containerization for Modern DevOps',
    provider: 'Cloud Native Labs',
    url: '#',
    category: 'DevOps & Cloud',
    difficulty: 'Beginner',
    durationHours: 12,
    rating: 4.8,
    totalLessons: 10,
    skills: ['Docker', 'Linux', 'CI/CD'],
    description: 'Multi-stage Dockerfile builds, container security, network isolation, volume mounts, and multi-service docker-compose workflows.'
  },
  // 15. DevOps
  {
    id: 'crs_devops_cicd',
    title: 'Enterprise CI/CD Pipelines & Infrastructure as Code',
    provider: 'CloudWorks Institute',
    url: '#',
    category: 'DevOps & Cloud',
    difficulty: 'Advanced',
    durationHours: 22,
    rating: 4.9,
    totalLessons: 16,
    skills: ['CI/CD', 'Docker', 'Kubernetes', 'Git', 'Linux'],
    description: 'Automated testing and release pipelines with GitHub Actions, Terraform IaC, canary releases, and Prometheus monitoring.'
  },
  // 16. Git
  {
    id: 'crs_git_collaboration',
    title: 'Git Version Control & Enterprise Workflow Strategies',
    provider: 'CareerAI Technical Academy',
    url: '#',
    category: 'Tools & Workflows',
    difficulty: 'Beginner',
    durationHours: 8,
    rating: 4.8,
    totalLessons: 8,
    skills: ['Git', 'CI/CD'],
    description: 'Branching strategies (GitFlow, trunk-based), interactive rebasing, merge conflict resolution, submodules, and semantic versioning.'
  },
  // 17. UI/UX
  {
    id: 'crs_uiux_design_systems',
    title: 'UI/UX Design Systems & Micro-Interactions in Figma',
    provider: 'Design Crafts Academy',
    url: '#',
    category: 'Design & Frontend',
    difficulty: 'Intermediate',
    durationHours: 15,
    rating: 4.8,
    totalLessons: 12,
    skills: ['UI Design', 'Figma', 'CSS', 'Tailwind CSS'],
    description: 'Design tokens, accessible color palettes (WCAG AA), typographic hierarchy, responsive auto-layout, and interactive prototyping.'
  },
  // 18. Flutter
  {
    id: 'crs_flutter_crossplatform',
    title: 'Cross-Platform Mobile Development with Flutter & Dart',
    provider: 'Mobile Engineering Guild',
    url: '#',
    category: 'Mobile',
    difficulty: 'Intermediate',
    durationHours: 20,
    rating: 4.8,
    totalLessons: 16,
    skills: ['Flutter', 'Dart', 'REST API'],
    description: 'State management with Bloc & Provider, native device integrations, responsive mobile layouts, offline persistence, and app store deployment.'
  },
  // 19. Java
  {
    id: 'crs_java_enterprise',
    title: 'Core Java Programming & Object-Oriented Software Design',
    provider: 'Enterprise Java Academy',
    url: '#',
    category: 'Backend',
    difficulty: 'Intermediate',
    durationHours: 22,
    rating: 4.7,
    totalLessons: 16,
    skills: ['Java', 'OOP', 'DSA'],
    description: 'Java memory model, collections framework, lambda expressions & Streams API, generics, multi-threading, and clean code principles.'
  },
  // 20. Spring Boot
  {
    id: 'crs_springboot_microservices',
    title: 'Enterprise Microservices with Spring Boot 3 & Hibernate',
    provider: 'Enterprise Java Academy',
    url: '#',
    category: 'Backend',
    difficulty: 'Advanced',
    durationHours: 26,
    rating: 4.9,
    totalLessons: 20,
    skills: ['Spring Boot', 'Java', 'SQL', 'REST API'],
    description: 'Dependency injection, Spring Data JPA, Spring Security with OAuth2/JWT, resilience patterns with Resilience4j, and Kafka integration.'
  },
  // 21. TypeScript
  {
    id: 'crs_typescript_prof',
    title: 'Professional TypeScript: Type-Safe Full Stack Applications',
    provider: 'NextStack Academy',
    url: '#',
    category: 'Frontend & Full Stack',
    difficulty: 'Intermediate',
    durationHours: 14,
    rating: 4.9,
    totalLessons: 12,
    skills: ['TypeScript', 'JavaScript', 'React'],
    description: 'Conditional types, mapped types, discriminated unions, utility types, and strict type configurations in React and Node.'
  },
  // 22. Kubernetes
  {
    id: 'crs_kubernetes_prod',
    title: 'Kubernetes Container Orchestration in Production',
    provider: 'Cloud Native Labs',
    url: '#',
    category: 'DevOps & Cloud',
    difficulty: 'Advanced',
    durationHours: 22,
    rating: 4.8,
    totalLessons: 16,
    skills: ['Kubernetes', 'Docker', 'Linux', 'DevOps'],
    description: 'Pods, Deployments, Services, Ingress controllers, ConfigMaps, Helm charts, stateful sets, and cluster autoscaling.'
  },
  // 23. FastAPI
  {
    id: 'crs_fastapi_microservices',
    title: 'High-Performance Asynchronous APIs with FastAPI',
    provider: 'Modern Backend Series',
    url: '#',
    category: 'Backend',
    difficulty: 'Intermediate',
    durationHours: 12,
    rating: 4.8,
    totalLessons: 10,
    skills: ['FastAPI', 'Python', 'REST API'],
    description: 'Pydantic data validation, async route handlers, dependency injection, automatic OpenAPI documentation, and Celery background workers.'
  },
  // 24. Tailwind CSS
  {
    id: 'crs_tailwind_mastery',
    title: 'Tailwind CSS: Rapid Modern Responsive UI Engineering',
    provider: 'Frontend Guild',
    url: '#',
    category: 'Frontend',
    difficulty: 'Beginner',
    durationHours: 8,
    rating: 4.7,
    totalLessons: 8,
    skills: ['Tailwind CSS', 'CSS', 'HTML'],
    description: 'Utility-first workflows, custom design themes, dark mode variants, arbitrary properties, animation plugins, and responsive grids.'
  },
  // 25. OWASP Security
  {
    id: 'crs_owasp_top_ten',
    title: 'Web Application Security & OWASP Top 10 Mitigation',
    provider: 'CyberShield Academy',
    url: '#',
    category: 'Security',
    difficulty: 'Intermediate',
    durationHours: 14,
    rating: 4.9,
    totalLessons: 12,
    skills: ['OWASP', 'Cybersecurity', 'REST API'],
    description: 'Defending against SQL injection, XSS, CSRF, broken access control, security misconfigurations, and cryptanalysis.'
  },
  // 26. Data Engineering
  {
    id: 'crs_data_engineering',
    title: 'Data Pipelines & Distributed ETL with Spark & Python',
    provider: 'DataSphere Institute',
    url: '#',
    category: 'AI & Data Science',
    difficulty: 'Advanced',
    durationHours: 22,
    rating: 4.8,
    totalLessons: 16,
    skills: ['Python', 'SQL', 'Data Science'],
    description: 'Building batch and streaming data pipelines, Apache Spark transformations, Delta Lake storage, and pipeline orchestration.'
  },
  // 27. Power BI
  {
    id: 'crs_powerbi_analytics',
    title: 'Business Intelligence & Executive Dashboards with Power BI',
    provider: 'DataSphere Institute',
    url: '#',
    category: 'Database & Analytics',
    difficulty: 'Intermediate',
    durationHours: 12,
    rating: 4.7,
    totalLessons: 10,
    skills: ['Power BI', 'SQL', 'Statistics'],
    description: 'DAX expressions, Power Query transformations, data modeling relationships, and building interactive drill-down reports.'
  },
  // 28. System Design
  {
    id: 'crs_system_design_scalability',
    title: 'System Design: Architecting Large-Scale Distributed Systems',
    provider: 'CareerAI Technical Academy',
    url: '#',
    category: 'Backend & Systems',
    difficulty: 'Advanced',
    durationHours: 24,
    rating: 4.9,
    totalLessons: 18,
    skills: ['System Design', 'Backend', 'Database', 'Cloud Computing'],
    description: 'Load balancing, caching strategies (Redis/CDN), database sharding, CAP theorem, message queues, and designing systems like Uber or Netflix.'
  },
  // 29. Linux & Bash
  {
    id: 'crs_linux_bash_automation',
    title: 'Linux Systems Administration & Shell Scripting Automation',
    provider: 'Cloud Native Labs',
    url: '#',
    category: 'DevOps & Cloud',
    difficulty: 'Beginner',
    durationHours: 10,
    rating: 4.8,
    totalLessons: 9,
    skills: ['Linux', 'Bash/Shell', 'DevOps'],
    description: 'File permissions, process management (systemd), SSH tunneling, grep/sed/awk data manipulation, and writing cron automation scripts.'
  },
  // 30. Computer Vision
  {
    id: 'crs_computer_vision_opencv',
    title: 'Computer Vision with OpenCV, PyTorch & YOLOv8',
    provider: 'AI Research Institute',
    url: '#',
    category: 'AI & Data Science',
    difficulty: 'Advanced',
    durationHours: 20,
    rating: 4.8,
    totalLessons: 15,
    skills: ['Computer Vision', 'PyTorch', 'Python'],
    description: 'Image filtering, morphological operations, object detection, bounding box regression, image segmentation, and real-time video inference.'
  },
  // 31. Redis & Caching
  {
    id: 'crs_redis_caching',
    title: 'In-Memory Data Structures & High-Speed Caching with Redis',
    provider: 'Backend Engineering Guild',
    url: '#',
    category: 'Backend',
    difficulty: 'Intermediate',
    durationHours: 8,
    rating: 4.7,
    totalLessons: 7,
    skills: ['Redis', 'Node.js', 'System Design'],
    description: 'Strings, Hashes, Sorted Sets, Pub/Sub channels, cache invalidation patterns, distributed locks, and session storage.'
  },
  // 32. Next.js Full Stack
  {
    id: 'crs_nextjs_fullstack',
    title: 'Full Stack Web Engineering with Next.js 15 & Server Actions',
    provider: 'NextStack Academy',
    url: '#',
    category: 'Frontend & Full Stack',
    difficulty: 'Intermediate',
    durationHours: 18,
    rating: 4.9,
    totalLessons: 14,
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    description: 'App Router architecture, React Server Components (RSC), server actions, dynamic caching, SEO optimization, and Edge deployment.'
  }
];
