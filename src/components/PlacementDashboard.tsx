import React, { useState } from 'react';
import {
  StudentProfile,
  ViewMode,
  SkillGapItem,
  RoadmapWeek,
  MatchedProject,
  CareerSimulationLever
} from '../types';
import { initialCertifications } from '../data/initialData';
import { RewardSystemModal } from './RewardSystemModal';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import {
  Sparkles,
  Award,
  FileText,
  TrendingUp,
  Flame,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Code,
  Target,
  Zap,
  PlayCircle,
  Building2,
  Layers,
  Star,
  ChevronRight,
  ShieldAlert,
  Trophy,
  Users,
  ExternalLink
} from 'lucide-react';

interface PlacementDashboardProps {
  student: StudentProfile;
  skillGaps: SkillGapItem[];
  roadmapWeeks: RoadmapWeek[];
  matchedProjects: MatchedProject[];
  levers: CareerSimulationLever[];
  setCurrentView: (view: ViewMode) => void;
  onOpenVoiceMentor: () => void;
  onToggleTask: (weekNum: number, taskId: string) => void;
}

export const PlacementDashboard: React.FC<PlacementDashboardProps> = ({
  student,
  skillGaps,
  roadmapWeeks,
  matchedProjects,
  levers,
  setCurrentView,
  onOpenVoiceMentor,
  onToggleTask
}) => {
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<MatchedProject | null>(null);

  const currentWeek = roadmapWeeks[0];
  const featuredProject = matchedProjects[0];
  const missingSkills = skillGaps.filter(s => s.status !== 'Mastered').slice(0, 3);

  // Top recommended certifications for student's target career
  const topCertifications = initialCertifications
    .filter(c => c.targetCareers.includes(student.targetCareer) || c.targetCareers.includes('All'))
    .slice(0, 2);

  // Calculate active levers boost for Future Career Simulator Preview
  const activeBoost = levers.filter(l => l.enabled).reduce((acc, l) => acc + l.boostPercentage, 0);
  const currentProb = 42;
  const simulatedProb = Math.min(currentProb + activeBoost, 95);

  return (
    <div className="space-y-6 pb-12 animate-slide-up">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-banner p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-60 h-60 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>Targeting {student.targetCompany} ({student.targetCareer})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {student.name.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Your AI Mentor analyzed your latest activities. Completing your Docker container task today will boost your placement match for <strong className="text-white">{student.targetCompany}</strong> by <strong className="text-emerald-400">+4%</strong>.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenVoiceMentor}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Call AI Mentor</span>
            </button>

            <button
              onClick={() => setCurrentView('career-simulator')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Simulate Career Odds</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Widgets Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        {/* Placement Readiness */}
        <div
          onClick={() => setCurrentView('career-simulator')}
          className="p-5 rounded-2xl glass-card shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Placement Readiness</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {student.readinessScore}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              +5% this week
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${student.readinessScore}%` }}
            />
          </div>
        </div>

        {/* Resume Score */}
        <div
          onClick={() => setCurrentView('resume-analyzer')}
          className="p-5 rounded-2xl glass-card shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ATS Resume Score</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {student.resumeScore}/100
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Strong ATS
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
            2 formatting fixes suggested
          </p>
        </div>

        {/* Skill Match */}
        <div
          onClick={() => setCurrentView('skill-gap')}
          className="p-5 rounded-2xl glass-card shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Skill Match</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {student.skillMatchScore}%
            </span>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              {missingSkills.length} gaps
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
            PyTorch, Docker, Vector DBs
          </p>
        </div>

        {/* Streak & Interview */}
        <div
          onClick={() => setCurrentView('mock-interview')}
          className="p-5 rounded-2xl glass-card shadow-sm hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Learning Streak</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {student.streakDays} Days
            </span>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              🔥 Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
            Last mock interview: 80% score
          </p>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Left Column (2 cols wide): Future Career Simulator Preview + Roadmap Tasks + Industry Certs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 🚀 AI Future Career Simulator Widget (Flagship Feature) */}
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-indigo-100/80 dark:border-indigo-900/60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI Future Career Simulator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Predicting your placement odds at <strong className="text-slate-800 dark:text-slate-200">{student.targetCompany}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('career-simulator')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Full Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Comparison Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700">
              {/* Current Path */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Current Path</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentProb}% Probability</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: `${currentProb}%` }} />
                </div>
                <p className="text-[11px] text-slate-400">Based on current resume & skill set</p>
              </div>

              {/* Improved Path with Levers */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Improved Path
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{simulatedProb}% Probability</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${simulatedProb}%` }}
                  />
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  +{simulatedProb - currentProb}% boost with 3 active learning levers
                </p>
              </div>
            </div>

            {/* Quick Lever Toggles */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Active Career Levers (Click to toggle)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {levers.slice(0, 3).map((l) => (
                  <div
                    key={l.id}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                      l.enabled
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="truncate max-w-[130px]">{l.title}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1">+{l.boostPercentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🏅 Industry Certifications Recommendation Spotlight */}
          <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Recommended Industry Certifications
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Targeted credentials for {student.targetCareer}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('skill-gap')}
                className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                <span>View All Certs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topCertifications.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setCurrentView('skill-gap')}
                  className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{cert.badgeIcon}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        {cert.industryRecognition}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors line-clamp-1">
                      {cert.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {cert.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-500">
                    <span>⏱️ {cert.durationWeeks}</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{cert.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Learning Roadmap Widget */}
          <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Today's Learning Tasks</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    Week {currentWeek.weekNumber}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentWeek.title}
                </p>
              </div>

              <button
                onClick={() => setCurrentView('roadmap')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Full Roadmap</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Task Checklist */}
            <div className="space-y-2.5">
              {currentWeek.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(currentWeek.weekNumber, task.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-75'
                      : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-300 dark:text-slate-600 hover:text-emerald-500 transition-colors">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {task.durationMinutes} mins
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col wide): AI Project Matchmaker Spotlight + Missing Skills */}
        <div className="space-y-6">
          {/* 🏆 Reward System & Leaderboard Widget */}
          <div className="bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:via-purple-950/40 dark:to-slate-900 rounded-2xl p-6 border border-amber-500/30 dark:border-amber-500/20 shadow-sm space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Level {student.level || 4} Prep Master
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Earned <strong className="text-amber-600 dark:text-amber-400">{student.xp || 1850} XP</strong>
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Rank #3
              </span>
            </div>

            {/* XP Level Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Level Progress</span>
                <span className="text-indigo-600 dark:text-indigo-400">{((student.xp || 1850) % 500) / 5}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full"
                  style={{ width: `${((student.xp || 1850) % 500) / 5}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsRewardModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>View Leaderboard & Badges</span>
            </button>
          </div>

          {/* 💡 AI Project Matchmaker Spotlight */}
          <div
            onClick={() => setSelectedProjectForModal(featuredProject)}
            className="glass-card rounded-2xl p-6 shadow-sm space-y-4 hover:border-indigo-400 dark:hover:border-indigo-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4" /> AI Project Spotlight
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                ★★★★★ Resume Impact
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {featuredProject.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {featuredProject.tagline}
              </p>
            </div>

            {/* Why Recommended Box */}
            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
              <strong>Why Recommended:</strong> {featuredProject.whyRecommended}
            </div>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-1.5">
              {featuredProject.technologies.map(t => (
                <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProjectForModal(featuredProject);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Info & Full Summary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Missing Skill Gap Summary */}
          <div className="glass-card rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Missing Industry Gaps
              </h3>
              <button
                onClick={() => setCurrentView('skill-gap')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {missingSkills.map((sg) => (
                <div key={sg.skill} className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{sg.skill}</h5>
                    <p className="text-[10px] text-slate-500">{sg.recommendedResource}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {sg.estimatedHours}h
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rewards System Modal */}
      <RewardSystemModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        student={student}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProjectForModal}
        student={student}
        isOpen={!!selectedProjectForModal}
        onClose={() => setSelectedProjectForModal(null)}
      />
    </div>
  );
};

