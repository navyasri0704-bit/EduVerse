import React, { useState } from 'react';
import { StudentProfile, RoadmapWeek, ViewMode } from '../types';
import {
  Map,
  CheckCircle2,
  Clock,
  BookOpen,
  Video,
  Code,
  HelpCircle,
  FileText,
  Flame,
  Sparkles,
  ChevronRight,
  Layers,
  ArrowRight
} from 'lucide-react';

interface LearningRoadmapProps {
  student: StudentProfile;
  roadmapWeeks: RoadmapWeek[];
  onToggleTask: (weekNum: number, taskId: string) => void;
  setCurrentView: (view: ViewMode) => void;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({
  student,
  roadmapWeeks,
  onToggleTask,
  setCurrentView
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  const activeWeekData = roadmapWeeks.find(w => w.weekNumber === selectedWeek) || roadmapWeeks[0];

  const totalTasks = activeWeekData.tasks.length;
  const completedTasks = activeWeekData.tasks.filter(t => t.completed).length;
  const weekProgressPercent = Math.round((completedTasks / totalTasks) * 100) || 0;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Video':
        return { icon: <Video className="w-3.5 h-3.5" />, bg: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' };
      case 'Project':
        return { icon: <Code className="w-3.5 h-3.5" />, bg: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' };
      case 'DSA':
        return { icon: <Sparkles className="w-3.5 h-3.5" />, bg: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' };
      default:
        return { icon: <BookOpen className="w-3.5 h-3.5" />, bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Map className="w-3.5 h-3.5" />
            <span>AI Personalized Career Path</span>
          </div>
          <h1 className="text-2xl font-black">AI Learning Roadmap</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Weekly milestones and daily tasks tailored specifically for your target role: <strong className="text-white">{student.targetCareer}</strong>.
          </p>
        </div>

        {/* Streak Counter Box */}
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
          <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 block">Current Streak</span>
            <span className="text-sm font-black text-white">{student.streakDays} Consecutive Days</span>
          </div>
        </div>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Week Selector Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Milestone Weeks</span>
            <span className="text-xs text-slate-400 font-normal">{roadmapWeeks.length} Weeks Total</span>
          </h3>

          <div className="space-y-2">
            {roadmapWeeks.map((w) => {
              const isSelected = selectedWeek === w.weekNumber;
              return (
                <div
                  key={w.weekNumber}
                  onClick={() => setSelectedWeek(w.weekNumber)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      Week {w.weekNumber}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {w.completedPercent}% Done
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white mt-1 truncate">
                    {w.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 cols): Week Details & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            {/* Week Title Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Week {activeWeekData.weekNumber} Milestone
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeWeekData.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeWeekData.description}
                </p>
              </div>

              {/* Progress Ring / Bar */}
              <div className="text-right sm:min-w-[120px]">
                <span className="text-xs text-slate-400 font-semibold block mb-1">
                  {completedTasks} of {totalTasks} Completed
                </span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${weekProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Daily Tasks List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Daily Task Checklist
              </h4>

              {activeWeekData.tasks.map((task) => {
                const badge = getTypeBadge(task.type);
                return (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(activeWeekData.weekNumber, task.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      task.completed
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60 opacity-75'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button className="text-slate-300 dark:text-slate-600 hover:text-emerald-500 transition-colors mt-0.5">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                            {task.day}
                          </span>
                          <h5 className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                            {task.title}
                          </h5>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${badge.bg}`}>
                        {badge.icon}
                        <span>{task.type}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                        {task.durationMinutes} min
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
