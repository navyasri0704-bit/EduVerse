export type ViewMode =
  | 'onboarding'
  | 'dashboard'
  | 'resume-analyzer'
  | 'skill-gap'
  | 'career-simulator'
  | 'roadmap'
  | 'project-matchmaker'
  | 'mock-interview'
  | 'ai-mentor';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Resume' | 'Roadmap' | 'Interview' | 'Streak' | 'Community' | 'Project';
  unlockedAt?: string;
  isUnlocked: boolean;
  xpReward: number;
}

export interface XPHistoryItem {
  id: string;
  action: string;
  xp: number;
  timestamp: string;
  category: 'Resume' | 'Roadmap' | 'Interview' | 'DailyGoal' | 'AIMentor' | 'Project';
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatarUrl: string;
  university: string;
  targetCareer: string;
  xp: number;
  level: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university: string; // College
  department?: string;
  major: string;
  graduationYear: string;
  year?: string; // e.g. 3rd Year
  targetCareer: string;
  targetCompany: string;
  avatarUrl: string;
  readinessScore: number;
  resumeScore: number;
  skillMatchScore: number;
  interviewScore: number;
  streakDays: number;
  skills: string[];
  resumeText?: string;
  isOnboarded: boolean;
  
  // Reward & Session properties
  xp: number;
  level: number;
  unlockedBadgeIds: string[];
  xpHistory: XPHistoryItem[];
  dailyGoalCompleted?: boolean;
}

export interface ResumeAnalysisResult {
  resumeScore: number;
  atsCompatibility: number;
  extractedSkills: string[];
  strengths: string[];
  weaknesses: string[];
  atsSuggestions: string[];
  projectAnalysis: {
    title: string;
    impactScore: string;
    feedback: string;
  }[];
}

export interface SkillGapItem {
  skill: string;
  category: 'Core Requirement' | 'Preferred Tech' | 'Bonus Skill';
  status: 'Mastered' | 'In Progress' | 'Missing';
  importance: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  recommendedResource: string;
}

export interface CareerSimulationLever {
  id: string;
  title: string;
  category: string;
  boostPercentage: number;
  enabled: boolean;
  timeCommitment: string;
}

export interface RoadmapTask {
  id: string;
  day: string;
  title: string;
  description: string;
  type: 'Video' | 'Project' | 'DSA' | 'Quiz' | 'Reading';
  durationMinutes: number;
  completed: boolean;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  description: string;
  completedPercent: number;
  tasks: RoadmapTask[];
}

export interface MatchedProject {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: string;
  technologies: string[];
  resumeImpactStars: number;
  whyRecommended: string;
  learningOutcomes: string[];
  summary?: string;
  architectureDiagram?: string;
  implementationSteps?: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  resumeBulletPoints?: string[];
  githubTemplateUrl?: string;
  targetRoleMatch?: string;
}

export interface MentorChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    targetView: ViewMode;
  };
}

export interface MockInterviewQuestion {
  id: string;
  category: 'HR' | 'Technical';
  questionText: string;
  hints: string[];
  expectedKeywords: string[];
}

export interface InterviewEvaluation {
  overallScore: number;
  technicalAccuracy: number;
  communicationScore: number;
  confidenceScore: number;
  grammarScore: number;
  strengths: string[];
  improvementAreas: string[];
  idealAnswerSample: string;
}

export interface CertificationRecommendation {
  id: string;
  title: string;
  provider: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: string;
  cost: string;
  badgeIcon: string;
  targetCareers: string[];
  description: string;
  skillsCovered: string[];
  officialUrl: string;
  examCode?: string;
  industryRecognition: 'Gold Standard' | 'Essential' | 'Highly Valued';
  status: 'Recommended' | 'In Progress' | 'Completed';
}

