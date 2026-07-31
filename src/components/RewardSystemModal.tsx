import React, { useState } from 'react';
import { StudentProfile, AchievementBadge, LeaderboardEntry, XPHistoryItem } from '../types';
import { initialBadges, initialLeaderboard } from '../data/initialData';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  X,
  Users,
  Clock,
  Sparkles,
  TrendingUp,
  Star
} from 'lucide-react';

interface RewardSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onEarnXP?: (amount: number, reason: string, category: 'Resume' | 'Roadmap' | 'Interview' | 'DailyGoal' | 'AIMentor' | 'Project') => void;
}

export const RewardSystemModal: React.FC<RewardSystemModalProps> = ({
  isOpen,
  onClose,
  student,
  onEarnXP
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges' | 'history'>('leaderboard');

  if (!isOpen) return null;

  // Level calculations
  const currentXP = student.xp || 1850;
  const currentLevel = Math.floor(currentXP / 500) + 1;
  const xpInCurrentLevel = currentXP % 500;
  const progressPercent = Math.min(Math.round((xpInCurrentLevel / 500) * 100), 100);

  const levelTitles: Record<number, string> = {
    1: 'Novice Prep',
    2: 'Tech Explorer',
    3: 'Code Ninja',
    4: 'Placement Master',
    5: 'Tech Legend',
    6: 'AI Vanguard'
  };

  const levelTitle = levelTitles[currentLevel] || 'Tech Titan';

  // Merge current user into leaderboard
  const updatedLeaderboard = initialLeaderboard.map(entry => {
    if (entry.isCurrentUser || entry.name.toLowerCase() === student.name.toLowerCase()) {
      return {
        ...entry,
        name: student.name,
        university: student.university || entry.university,
        targetCareer: student.targetCareer || entry.targetCareer,
        xp: currentXP,
        level: currentLevel,
        badgesCount: (student.unlockedBadgeIds || []).length,
        isCurrentUser: true
      };
    }
    return entry;
  }).sort((a, b) => b.xp - a.xp).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero XP Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 border border-indigo-500/30 mb-6 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-amber-400">Lvl {currentLevel}</span>
                  <Trophy className="w-4 h-4 text-amber-400 -mt-0.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{levelTitle}</h2>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {student.name.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Total Earned: <strong className="text-amber-400">{currentXP} XP</strong> · Next Level in {500 - xpInCurrentLevel} XP
                </p>
              </div>
            </div>

            <div className="w-full sm:w-48 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">Level Progress</span>
                <span className="text-indigo-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Campus Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'badges'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Badges & Achievements</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>XP History</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Live placement prep rankings across university students. Earn XP by uploading resumes, completing roadmaps, and acing mock interviews!
              </p>

              <div className="space-y-2">
                {updatedLeaderboard.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      item.isCurrentUser
                        ? 'bg-indigo-950/60 border-indigo-500/60 ring-2 ring-indigo-500/30'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        item.rank === 1 ? 'bg-amber-500 text-slate-950' :
                        item.rank === 2 ? 'bg-slate-300 text-slate-950' :
                        item.rank === 3 ? 'bg-amber-700 text-white' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        #{item.rank}
                      </div>

                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">
                            {item.name} {item.isCurrentUser && '(You)'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 font-medium">
                            Lvl {item.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {item.university} · {item.targetCareer}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs font-black text-amber-400">
                        <Zap className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.xp} XP</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.badgesCount} Badges Unlocked
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BADGES TAB */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {initialBadges.map((badge) => {
                const isUnlocked = (student.unlockedBadgeIds || []).includes(badge.id) || badge.isUnlocked;

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-slate-800/60 border-indigo-500/40'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        isUnlocked ? 'bg-indigo-950 border border-indigo-500/50 shadow-md' : 'bg-slate-900 border border-slate-800'
                      }`}>
                        {badge.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-white">{badge.title}</h4>
                          <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                            +{badge.xpReward} XP
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {badge.description}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                            {badge.category}
                          </span>
                          {isUnlocked ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Unlocked
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* XP HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-2">
              {(student.xpHistory && student.xpHistory.length > 0 ? student.xpHistory : [
                { id: 'xp-1', action: 'Uploaded Resume & Passed ATS Check', xp: 150, timestamp: 'Today, 09:30 AM', category: 'Resume' as const },
                { id: 'xp-2', action: 'Completed Docker & Microservices Roadmap Task', xp: 50, timestamp: 'Yesterday, 04:15 PM', category: 'Roadmap' as const },
                { id: 'xp-3', action: 'Scored 85% in System Design Mock Interview', xp: 200, timestamp: '2 days ago', category: 'Interview' as const }
              ]).map((history) => (
                <div
                  key={history.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      <Zap className="w-4 h-4 fill-indigo-400" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-white">{history.action}</h5>
                      <span className="text-[10px] text-slate-400">{history.timestamp}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs">
                    +{history.xp} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
