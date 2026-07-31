import {
  StudentProfile,
  ResumeAnalysisResult,
  SkillGapItem,
  CareerSimulationLever,
  RoadmapWeek,
  MatchedProject,
  MockInterviewQuestion,
  AchievementBadge,
  LeaderboardEntry,
  CertificationRecommendation
} from '../types';

export const initialBadges: AchievementBadge[] = [
  {
    id: 'badge-resume',
    title: 'Resume Architect',
    description: 'Uploaded & analyzed a resume with over 80+ ATS score',
    icon: '📄',
    category: 'Resume',
    isUnlocked: true,
    unlockedAt: 'Today',
    xpReward: 150
  },
  {
    id: 'badge-roadmap',
    title: 'Roadmap Pioneer',
    description: 'Completed first weekly placement checklist module',
    icon: '🚀',
    category: 'Roadmap',
    isUnlocked: true,
    unlockedAt: 'Yesterday',
    xpReward: 100
  },
  {
    id: 'badge-interview',
    title: 'Interview Dynamo',
    description: 'Scored 80%+ in a simulated AI Mock Interview',
    icon: '🎯',
    category: 'Interview',
    isUnlocked: true,
    unlockedAt: '3 days ago',
    xpReward: 200
  },
  {
    id: 'badge-streak',
    title: '7-Day Streak Titan',
    description: 'Maintained 7 consecutive days of active placement prep',
    icon: '🔥',
    category: 'Streak',
    isUnlocked: true,
    unlockedAt: '5 days ago',
    xpReward: 120
  },
  {
    id: 'badge-ai-mentor',
    title: 'Curious Mind',
    description: 'Asked AI Mentor 10+ strategic career questions',
    icon: '🤖',
    category: 'Community',
    isUnlocked: false,
    xpReward: 80
  },
  {
    id: 'badge-project',
    title: 'Project Champion',
    description: 'Finished a high-impact AI/FullStack portfolio project',
    icon: '🏆',
    category: 'Project',
    isUnlocked: false,
    xpReward: 250
  }
];

export const initialLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'lead-1',
    name: 'Aarav Mehta',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    university: 'IIT Bombay',
    targetCareer: 'AI Research Engineer',
    xp: 2850,
    level: 6,
    badgesCount: 14
  },
  {
    rank: 2,
    id: 'lead-2',
    name: 'Ananya Roy',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    university: 'BITS Pilani',
    targetCareer: 'Full Stack Engineer',
    xp: 2420,
    level: 5,
    badgesCount: 11
  },
  {
    rank: 3,
    id: 'lead-3',
    name: 'Nikhil Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    university: 'Stanford / IIT Tech',
    targetCareer: 'AI Engineer',
    xp: 1850,
    level: 4,
    badgesCount: 8,
    isCurrentUser: true
  },
  {
    rank: 4,
    id: 'lead-4',
    name: 'Rohan Gupta',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    university: 'IIT Delhi',
    targetCareer: 'Cloud / DevOps Engineer',
    xp: 1620,
    level: 4,
    badgesCount: 7
  },
  {
    rank: 5,
    id: 'lead-5',
    name: 'Priya Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    university: 'NIT Trichy',
    targetCareer: 'Data Scientist',
    xp: 1400,
    level: 3,
    badgesCount: 5
  }
];

export const cleanStudentProfile: StudentProfile = {
  id: 'guest-student',
  name: '',
  email: '',
  phone: '',
  university: '',
  department: '',
  major: '',
  graduationYear: '',
  year: '',
  targetCareer: '',
  targetCompany: '',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
  readinessScore: 0,
  resumeScore: 0,
  skillMatchScore: 0,
  interviewScore: 0,
  streakDays: 1,
  skills: [],
  resumeText: '',
  isOnboarded: false,
  xp: 0,
  level: 1,
  unlockedBadgeIds: [],
  xpHistory: [],
  dailyGoalCompleted: false
};

export const cleanResumeAnalysis: ResumeAnalysisResult = {
  resumeScore: 0,
  atsCompatibility: 0,
  extractedSkills: [],
  strengths: [
    'Upload your resume to generate your instant AI ATS report.'
  ],
  weaknesses: [
    'No resume uploaded yet.'
  ],
  atsSuggestions: [
    'Upload a PDF/DOCX or paste text in the Resume Analyzer to get AI feedback.'
  ],
  projectAnalysis: []
};

export const defaultStudentProfile: StudentProfile = {
  id: 'edu-student-101',
  name: 'Nikhil Sharma',
  email: 'nikhil.sharma@university.edu',
  phone: '+1 (555) 234-5678',
  university: 'Stanford University / IIT Tech',
  department: 'Computer Science',
  major: 'Computer Science & Artificial Intelligence',
  graduationYear: '2026',
  year: '3rd Year',
  targetCareer: 'AI Engineer',
  targetCompany: 'Google',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  readinessScore: 78,
  resumeScore: 82,
  skillMatchScore: 74,
  interviewScore: 80,
  streakDays: 12,
  skills: [
    'Python', 'React.js', 'TypeScript', 'Node.js', 'REST APIs',
    'SQL', 'Data Structures', 'Tailwind CSS', 'Git'
  ],
  resumeText: `NIKHIL SHARMA
San Francisco, CA | nikhil@stanford.edu | linkedin.com/in/nikhil-sharma

SUMMARY
Junior Computer Science student passionate about AI engineering, backend systems, and modern web applications. 

EDUCATION
B.S. in Computer Science | Graduation Expected May 2026

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, C++, SQL
Frameworks & Tools: React, Node.js, Express, Tailwind CSS, Git, Docker (Basic)

PROJECTS
1. Smart Content Summarizer (AI Web App)
- Developed a web app leveraging Gemini LLM APIs for automated video transcripts.
- Built React frontend with Tailwind CSS and Express Node.js proxy backend.

2. Real-Time Collaborative Whiteboard
- Created canvas application with WebSocket synchronization for multi-user drawing.

ACHIEVEMENTS
- Hackathon Top 5 Finalist 2025
- Google Developer Student Club Technical Lead`,
  isOnboarded: false, // User starts in Login/Register or Onboarding
  xp: 1850,
  level: 4,
  unlockedBadgeIds: ['badge-resume', 'badge-roadmap', 'badge-interview', 'badge-streak'],
  xpHistory: [
    { id: 'xp-1', action: 'Uploaded Resume & Passed ATS Check', xp: 150, timestamp: 'Today, 09:30 AM', category: 'Resume' },
    { id: 'xp-2', action: 'Completed Docker & Microservices Roadmap Task', xp: 50, timestamp: 'Yesterday, 04:15 PM', category: 'Roadmap' },
    { id: 'xp-3', action: 'Scored 85% in System Design Mock Interview', xp: 200, timestamp: '2 days ago', category: 'Interview' },
    { id: 'xp-4', action: 'Asked 3 Questions to AI Career Mentor', xp: 60, timestamp: '3 days ago', category: 'AIMentor' }
  ],
  dailyGoalCompleted: false
};

export const defaultResumeAnalysis: ResumeAnalysisResult = {
  resumeScore: 82,
  atsCompatibility: 88,
  extractedSkills: [
    'Python', 'JavaScript', 'TypeScript', 'C++', 'SQL',
    'React', 'Node.js', 'Express', 'Tailwind CSS', 'Git', 'Docker'
  ],
  strengths: [
    'Strong full-stack frontend engineering foundation with React & TypeScript',
    'Demonstrated experience with Gemini AI API integration',
    'Clear project structure with quantifiable feature descriptions'
  ],
  weaknesses: [
    'Missing cloud infrastructure details (AWS, GCP, Kubernetes deployment)',
    'No mentions of microservices or advanced database optimization (PostgreSQL/Redis)',
    'Lacks quantitative metrics (e.g. "Improved latency by 35%", "Handled 10k users")'
  ],
  atsSuggestions: [
    'Replace basic project summaries with STAR format (Situation, Task, Action, Result)',
    'Add keywords: Docker, PostgreSQL, REST APIs, CI/CD, PyTorch, Vector DBs',
    'Ensure email and GitHub link formatting are standard hyperlinked plain text'
  ],
  projectAnalysis: [
    {
      title: 'Smart Content Summarizer',
      impactScore: 'High',
      feedback: 'Excellent AI integration! Highlight API latency optimizations and prompt engineering structure.'
    },
    {
      title: 'Real-Time Collaborative Whiteboard',
      impactScore: 'Very High',
      feedback: 'Great system architecture showcase. Mention concurrency handling and WebSocket event throttling.'
    }
  ]
};

export const defaultSkillGaps: SkillGapItem[] = [
  {
    skill: 'PyTorch / TensorFlow',
    category: 'Core Requirement',
    status: 'In Progress',
    importance: 'High',
    estimatedHours: 25,
    recommendedResource: 'DeepLearning.AI Neural Networks Course'
  },
  {
    skill: 'Vector Databases (Pinecone / Chroma)',
    category: 'Core Requirement',
    status: 'Missing',
    importance: 'High',
    estimatedHours: 12,
    recommendedResource: 'RAG & Vector Embeddings Deep Dive'
  },
  {
    skill: 'Docker & Containerization',
    category: 'Core Requirement',
    status: 'In Progress',
    importance: 'High',
    estimatedHours: 10,
    recommendedResource: 'Docker Essentials for Software Engineers'
  },
  {
    skill: 'LangChain / LlamaIndex Frameworks',
    category: 'Preferred Tech',
    status: 'Missing',
    importance: 'Medium',
    estimatedHours: 15,
    recommendedResource: 'Building AI Agents with LangChain'
  },
  {
    skill: 'FastAPI / Production Python APIs',
    category: 'Preferred Tech',
    status: 'Mastered',
    importance: 'High',
    estimatedHours: 0,
    recommendedResource: 'Official FastAPI Documentation'
  },
  {
    skill: 'Kubernetes & CI/CD Pipelines',
    category: 'Bonus Skill',
    status: 'Missing',
    importance: 'Low',
    estimatedHours: 20,
    recommendedResource: 'GitHub Actions & K8s Fundamentals'
  }
];

export const defaultSimulationLevers: CareerSimulationLever[] = [
  {
    id: 'lever-projects',
    title: 'Complete 2 Production AI Projects',
    category: 'Projects',
    boostPercentage: 18,
    enabled: true,
    timeCommitment: '2 Weeks'
  },
  {
    id: 'lever-dsa',
    title: 'Practice 60+ LeetCode DSA Patterns',
    category: 'Problem Solving',
    boostPercentage: 14,
    enabled: true,
    timeCommitment: '3 Weeks'
  },
  {
    id: 'lever-docker',
    title: 'Master Docker & Kubernetes Deployment',
    category: 'DevOps & Cloud',
    boostPercentage: 12,
    enabled: true,
    timeCommitment: '1 Week'
  },
  {
    id: 'lever-interviews',
    title: 'Complete 5 AI Mock Interviews',
    category: 'Interviews',
    boostPercentage: 10,
    enabled: false,
    timeCommitment: '3 Days'
  },
  {
    id: 'lever-tensorflow',
    title: 'Earn TensorFlow / AWS Cloud Certification',
    category: 'Certifications',
    boostPercentage: 8,
    enabled: false,
    timeCommitment: '2 Weeks'
  }
];

export const defaultRoadmapWeeks: RoadmapWeek[] = [
  {
    weekNumber: 1,
    title: 'AI Engineering & Vector Embeddings',
    description: 'Master RAG architecture, vector search with ChromaDB, and prompt engineering.',
    completedPercent: 80,
    tasks: [
      {
        id: 'w1-t1',
        day: 'Mon',
        title: 'Understand Embeddings & Cosine Similarity',
        description: 'Learn how textual tokens map into multidimensional vector spaces.',
        type: 'Video',
        durationMinutes: 45,
        completed: true
      },
      {
        id: 'w1-t2',
        day: 'Tue',
        title: 'Set up ChromaDB in Python FastAPI',
        description: 'Build local vector store with document chunking pipeline.',
        type: 'Project',
        durationMinutes: 90,
        completed: true
      },
      {
        id: 'w1-t3',
        day: 'Wed',
        title: 'RAG Pipeline Implementation',
        description: 'Connect Gemini API to relevant retrieved context fragments.',
        type: 'Project',
        durationMinutes: 120,
        completed: true
      },
      {
        id: 'w1-t4',
        day: 'Thu',
        title: 'LeetCode: Graphs & BFS/DFS Patterns',
        description: 'Solve 3 medium graph problems focus on shortest path.',
        type: 'DSA',
        durationMinutes: 60,
        completed: true
      },
      {
        id: 'w1-t5',
        day: 'Fri',
        title: 'AI Mock Interview Practice Session',
        description: 'Practice explaining RAG system tradeoffs under 3 minutes.',
        type: 'Quiz',
        durationMinutes: 30,
        completed: false
      }
    ]
  },
  {
    weekNumber: 2,
    title: 'Backend Scalability & Docker Pipelines',
    description: 'Containerize full-stack services and write optimized PostgreSQL queries.',
    completedPercent: 20,
    tasks: [
      {
        id: 'w2-t1',
        day: 'Mon',
        title: 'Dockerfile & Multi-Stage Builds',
        description: 'Minimize Node/Python container sizes with alpine images.',
        type: 'Reading',
        durationMinutes: 40,
        completed: true
      },
      {
        id: 'w2-t2',
        day: 'Tue',
        title: 'Docker Compose for App + PostgreSQL + Redis',
        description: 'Orchestrate multi-container backend service environment.',
        type: 'Project',
        durationMinutes: 90,
        completed: false
      },
      {
        id: 'w2-t3',
        day: 'Wed',
        title: 'SQL Query Optimization & Indexing',
        description: 'Analyze EXPLAIN query plans and build B-Tree indices.',
        type: 'Quiz',
        durationMinutes: 45,
        completed: false
      }
    ]
  }
];

export const defaultMatchedProjects: MatchedProject[] = [
  {
    id: 'proj-hospital-mgmt',
    title: 'Hospital & Patient Care AI Assistant',
    tagline: 'Enterprise-grade medical triage system with intelligent prescription parsing',
    difficulty: 'Intermediate',
    durationWeeks: '2-3 Weeks',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Gemini API', 'Docker'],
    resumeImpactStars: 5,
    whyRecommended: 'Directly closes your backend deployment & PostgreSQL gap while demonstrating high-value AI healthcare application.',
    summary: 'A complete clinical decision support and patient triage dashboard designed to analyze electronic health records (EHR), extract optical character data from doctor prescriptions using Gemini Vision, and manage appointment queues securely in PostgreSQL.',
    architectureDiagram: 'Frontend (React/Tailwind) -> FastAPI Gateway -> Pydantic Validation -> Gemini 1.5 Flash Vision OCR -> PostgreSQL Database (indexed on patient_id) -> Dockerized Service',
    implementationSteps: [
      { stepNumber: 1, title: 'Phase 1: FastAPI & PostgreSQL Core Setup', description: 'Setup async SQLAlchemy connection pools, Pydantic schemas, and Alembic database migration scripts for Patient and Prescription entities.' },
      { stepNumber: 2, title: 'Phase 2: Gemini Vision Prescription OCR Pipeline', description: 'Implement file upload endpoints that stream medical images to Gemini API for zero-shot medical terminology extraction.' },
      { stepNumber: 3, title: 'Phase 3: Real-Time Patient Triage Queue', description: 'Build priority queue endpoints with WebSocket alerts when urgent risk markers are identified in triage logs.' },
      { stepNumber: 4, title: 'Phase 4: Docker Containerization & CI/CD', description: 'Create multi-stage Dockerfile, run local integration test suites, and deploy production container on Cloud Run.' }
    ],
    resumeBulletPoints: [
      'Developed an AI-powered medical triage platform with FastAPI and PostgreSQL, processing 500+ daily patient records with Pydantic validation.',
      'Integrated Gemini Vision API to parse handwritten prescriptions with 94%+ extraction accuracy, reducing manual data entry time by 60%.',
      'Containerized the full-stack microservice using Docker and deployed on Cloud Run with zero-downtime health checks.'
    ],
    learningOutcomes: [
      'Built async REST API endpoints with Pydantic validation',
      'Configured PostgreSQL database schema with migration scripts',
      'Implemented medical record document text extraction with Gemini Vision'
    ]
  },
  {
    id: 'proj-rag-agent',
    title: 'Autonomous Code Reviewer & Security Scanner',
    tagline: 'AI GitHub bot that analyzes pull requests for security vulnerabilities and code smells',
    difficulty: 'Advanced',
    durationWeeks: '3 Weeks',
    technologies: ['TypeScript', 'Node.js', 'Vector DB', 'GitHub Webhooks', 'Docker'],
    resumeImpactStars: 5,
    whyRecommended: 'Targeted for AI Engineer and Backend Developer paths at top tech companies like Google, Meta, and Stripe.',
    summary: 'An automated DevOps GitHub App bot that intercepts incoming Git Pull Requests via Webhooks, parses AST code diffs, queries Chroma/Pinecone vector databases for security anti-patterns, and posts inline review comments automatically.',
    architectureDiagram: 'GitHub Pull Request Webhook -> Node.js Webhook Receiver -> AST Diff Parser -> Vector Database Semantic Search -> Gemini LLM Code Evaluator -> GitHub API Commenter',
    implementationSteps: [
      { stepNumber: 1, title: 'Phase 1: GitHub App & Webhook Verification', description: 'Register GitHub App, generate HMAC signature verification middleware, and intercept pull_request.opened payload events.' },
      { stepNumber: 2, title: 'Phase 2: Semantic Code Embeddings & Vector Store', description: 'Generate code chunk embeddings, ingest OWASP top 10 security guidelines into ChromaDB vector store, and perform similarity searches.' },
      { stepNumber: 3, title: 'Phase 3: Automated Review Generation Engine', description: 'Construct contextual prompts for Gemini LLM to identify memory leaks, SQL injection vulnerabilities, and line-by-line feedback.' },
      { stepNumber: 4, title: 'Phase 4: Production Hosting & Performance Benchmarking', description: 'Deploy serverless container on Cloud Run, achieving sub-3 second review latency for pull requests up to 500 diff lines.' }
    ],
    resumeBulletPoints: [
      'Engineered a GitHub App bot in TypeScript and Node.js that automatically audits pull requests for OWASP security vulnerabilities.',
      'Leveraged vector embeddings and semantic search (ChromaDB) to retrieve historical code smell patterns, reducing false positive reviews by 40%.',
      'Processed GitHub webhooks asynchronously with sub-3s response times, posting inline code review comments on 100+ simulated PRs.'
    ],
    learningOutcomes: [
      'Integrated GitHub Webhooks for automated event triggers',
      'Implemented AST parsing and vector embeddings for semantic code lookup',
      'Deployed production Docker container on Cloud Run'
    ]
  },
  {
    id: 'proj-fintech-analytics',
    title: 'Real-Time Financial Market Sentiment Tracker',
    tagline: 'Streaming financial news analysis dashboard with live WebSocket visualization',
    difficulty: 'Intermediate',
    durationWeeks: '2 Weeks',
    technologies: ['React', 'Tailwind CSS', 'WebSockets', 'Python', 'Redis'],
    resumeImpactStars: 4,
    whyRecommended: 'Strengthens your real-time data handling and streaming API metrics on frontend and backend.',
    summary: 'A high-throughput financial intelligence portal that aggregates streaming financial news feeds, calculates real-time sentiment metrics using Redis pub/sub queues, and streams instant chart updates via WebSockets to a React client.',
    architectureDiagram: 'Financial News Feed Ingestion -> Python Worker Queue (Redis Pub/Sub) -> Sentiment Classification -> WebSocket Server -> React & Recharts Dashboard',
    implementationSteps: [
      { stepNumber: 1, title: 'Phase 1: Live News Ingestion Engine', description: 'Build background ingestion workers in Python to poll live market news feeds and format JSON payloads.' },
      { stepNumber: 2, title: 'Phase 2: Redis Pub/Sub & Caching Queue', description: 'Setup Redis channel broadcasting to decouple news ingestion from client-facing socket connections.' },
      { stepNumber: 3, title: 'Phase 3: WebSocket Streaming Server', description: 'Create WebSocket server handling client connections, heartbeats, and room subscriptions with auto-reconnection fallback.' },
      { stepNumber: 4, title: 'Phase 4: High-Performance Frontend Rendering', description: 'Design real-time Recharts dashboard using Canvas/D3 rendering techniques to prevent React layout thrashing during spike loads.' }
    ],
    resumeBulletPoints: [
      'Built a real-time financial market sentiment dashboard streaming 1,000+ news items/min via WebSockets and Redis Pub/Sub.',
      'Optimized React frontend rendering performance with requestAnimationFrame debouncing, eliminating UI frame drops during high volatility spikes.',
      'Architected Python background news ingestion workers with Redis memory caching, maintaining sub-50ms queue latency.'
    ],
    learningOutcomes: [
      'Handled high-throughput WebSocket streams without layout thrashing',
      'Created caching strategy using Redis pub/sub'
    ]
  }
];

export const defaultMockQuestions: MockInterviewQuestion[] = [
  {
    id: 'q1',
    category: 'Technical',
    questionText: 'How would you design a Retrieval-Augmented Generation (RAG) system that minimizes hallucinations and handles large document volumes efficiently?',
    hints: [
      'Discuss semantic chunking strategies (e.g. 510 tokens with 50 token overlap)',
      'Explain dense vs sparse vector search (e.g., Pinecone/Chroma vs BM25)',
      'Mention reranking models like Cohere Rerank before sending context to LLM'
    ],
    expectedKeywords: ['embeddings', 'chunking', 'vector store', 'reranking', 'prompt context', 'latency']
  },
  {
    id: 'q2',
    category: 'Technical',
    questionText: 'Explain the difference between SQL and NoSQL databases. When would you choose PostgreSQL over MongoDB for a scalable AI SaaS platform?',
    hints: [
      'Relational integrity, ACID compliance, structured joins vs Document flexibility',
      'PostgreSQL support for pgvector vs native Mongo JSON collections'
    ],
    expectedKeywords: ['ACID', 'schema', 'joins', 'indexing', 'pgvector', 'scaling']
  },
  {
    id: 'q3',
    category: 'HR',
    questionText: 'Tell me about a challenging technical bug or architectural obstacle you encountered in a project, and how you resolved it.',
    hints: [
      'Structure using STAR: Situation, Task, Action, Result',
      'Be specific about tools used (profilers, logs, metrics)',
      'Quantify the outcome (e.g., reduced load time by 40%)'
    ],
    expectedKeywords: ['STAR method', 'root cause', 'debugging', 'performance', 'quantified result']
  }
];

export const initialCertifications: CertificationRecommendation[] = [
  {
    id: 'cert-aws-ml',
    title: 'AWS Certified Machine Learning – Specialty',
    provider: 'Amazon Web Services (AWS)',
    level: 'Advanced',
    durationWeeks: '4-6 Weeks',
    cost: '$300 USD',
    badgeIcon: '☁️',
    targetCareers: ['AI Engineer', 'Backend Developer', 'Cloud Engineer'],
    description: 'Validates expertise in building, training, tuning, and deploying machine learning models using AWS SageMaker and cloud infrastructure.',
    skillsCovered: ['SageMaker', 'Model Deployment', 'Data Pipelines', 'Hyperparameter Tuning', 'Feature Store'],
    officialUrl: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/',
    examCode: 'MLS-C01',
    industryRecognition: 'Gold Standard',
    status: 'Recommended'
  },
  {
    id: 'cert-tf-dev',
    title: 'TensorFlow Developer Certificate',
    provider: 'Google / DeepLearning.AI',
    level: 'Intermediate',
    durationWeeks: '3-4 Weeks',
    cost: '$100 USD',
    badgeIcon: '🧠',
    targetCareers: ['AI Engineer', 'Data Scientist'],
    description: 'Demonstrates proficiency in deep learning, computer vision, natural language processing, and time-series forecasting using TensorFlow 2.x.',
    skillsCovered: ['TensorFlow 2.x', 'Convolutional Networks', 'NLP & Embeddings', 'Transfer Learning'],
    officialUrl: 'https://www.tensorflow.org/certificate',
    examCode: 'TF-DEV',
    industryRecognition: 'Gold Standard',
    status: 'Recommended'
  },
  {
    id: 'cert-meta-frontend',
    title: 'Meta Front-End Developer Professional Certificate',
    provider: 'Meta (via Coursera)',
    level: 'Intermediate',
    durationWeeks: '4 Weeks',
    cost: 'Free w/ Coursera Plus',
    badgeIcon: '⚛️',
    targetCareers: ['Full Stack Engineer', 'Backend Developer'],
    description: 'Industry-recognized credential from Meta covering modern React, UI/UX design, state management, and web application architecture.',
    skillsCovered: ['React 18', 'TypeScript', 'Tailwind CSS', 'State Management', 'Web Vitals'],
    officialUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    industryRecognition: 'Highly Valued',
    status: 'Recommended'
  },
  {
    id: 'cert-aws-sa',
    title: 'AWS Certified Solutions Architect – Associate',
    provider: 'Amazon Web Services (AWS)',
    level: 'Intermediate',
    durationWeeks: '3-5 Weeks',
    cost: '$150 USD',
    badgeIcon: '🛡️',
    targetCareers: ['Cloud Engineer', 'Backend Developer', 'Full Stack Engineer'],
    description: 'Validates ability to design resilient, high-performing, secure, and cost-optimized architectures on Amazon Web Services.',
    skillsCovered: ['EC2 & S3', 'VPC & Networking', 'IAM Security', 'DynamoDB & RDS', 'Serverless Lambda'],
    officialUrl: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    examCode: 'SAA-C03',
    industryRecognition: 'Gold Standard',
    status: 'Recommended'
  },
  {
    id: 'cert-cka',
    title: 'Certified Kubernetes Administrator (CKA)',
    provider: 'Linux Foundation / CNCF',
    level: 'Advanced',
    durationWeeks: '5-7 Weeks',
    cost: '$395 USD',
    badgeIcon: '☸️',
    targetCareers: ['Cloud Engineer', 'Backend Developer', 'AI Engineer'],
    description: 'Hands-on performance-based exam proving skill in Kubernetes installation, configuration, cluster management, networking, and security.',
    skillsCovered: ['Kubernetes Cluster Setup', 'Pods & Deployments', 'Ingress Routing', 'Helm Charts', 'Troubleshooting'],
    officialUrl: 'https://www.cncf.io/certification/cka/',
    examCode: 'CKA',
    industryRecognition: 'Gold Standard',
    status: 'Recommended'
  },
  {
    id: 'cert-google-data',
    title: 'Google Data Analytics Professional Certificate',
    provider: 'Google (via Coursera)',
    level: 'Beginner',
    durationWeeks: '3-4 Weeks',
    cost: 'Free w/ Coursera Plus',
    badgeIcon: '📊',
    targetCareers: ['Data Scientist'],
    description: 'Comprehensive program covering data cleaning, SQL query optimization, R programming, and data visualization tools like Tableau.',
    skillsCovered: ['SQL Queries', 'Data Cleaning', 'R Programming', 'Tableau', 'Data Storytelling'],
    officialUrl: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    industryRecognition: 'Essential',
    status: 'Recommended'
  },
  {
    id: 'cert-comptia-sec',
    title: 'CompTIA Security+ Certification',
    provider: 'CompTIA',
    level: 'Intermediate',
    durationWeeks: '4-5 Weeks',
    cost: '$392 USD',
    badgeIcon: '🔒',
    targetCareers: ['Cybersecurity Specialist'],
    description: 'Global benchmark for foundational cybersecurity skills, threat identification, risk management, and network defense.',
    skillsCovered: ['Threat Assessment', 'Cryptography', 'Identity Access (IAM)', 'Incident Response'],
    officialUrl: 'https://www.comptia.org/certifications/security',
    examCode: 'SY0-701',
    industryRecognition: 'Essential',
    status: 'Recommended'
  }
];

