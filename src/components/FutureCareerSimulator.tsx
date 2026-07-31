import React, { useState } from 'react';
import { StudentProfile, CareerSimulationLever } from '../types';
import {
  Sparkles,
  Target,
  Building2,
  TrendingUp,
  CheckCircle2,
  Zap,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
  Clock,
  Briefcase
} from 'lucide-react';

interface FutureCareerSimulatorProps {
  student: StudentProfile;
  levers: CareerSimulationLever[];
  onToggleLever: (leverId: string) => void;
}

export const FutureCareerSimulator: React.FC<FutureCareerSimulatorProps> = ({
  student,
  levers,
  onToggleLever
}) => {
  const [selectedCompany, setSelectedCompany] = useState<string>(student.targetCompany || 'Google');
  const [selectedRole, setSelectedRole] = useState<string>(student.targetCareer || 'AI Engineer');

  const companies = ['Google', 'Microsoft', 'Amazon', 'Deloitte', 'TCS', 'Meta', 'Apple'];
  const roles = ['AI Engineer', 'Data Scientist', 'Backend Developer', 'Cloud Engineer', 'Cybersecurity Engineer'];

  const baseProbability = 42;
  const activeBoost = levers.filter(l => l.enabled).reduce((acc, curr) => acc + curr.boostPercentage, 0);
  const simulatedProbability = Math.min(baseProbability + activeBoost, 96);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white border border-purple-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>AI Predictive Career Outcome Simulator</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            🚀 AI Future Career Simulator
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Select any top tier technology company or target role. EduVerse simulates your placement probability in real-time and reveals the exact actionable levers needed to reach <strong className="text-emerald-400">85%+ Placement Odds</strong>.
          </p>

          {/* Selectors Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" /> Target Company Simulation
              </label>
              <div className="flex flex-wrap gap-1.5">
                {companies.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCompany(c)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedCompany === c
                        ? 'bg-white text-purple-950 font-bold shadow'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Target Role
              </label>
              <div className="flex flex-wrap gap-1.5">
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedRole === r
                        ? 'bg-purple-500 text-white font-bold shadow'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Simulation Comparison Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Current Path vs Improved Path Gauge */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Placement Odds Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulating for {selectedCompany} — {selectedRole}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              +{activeBoost}% Boost Applied
            </span>
          </div>

          {/* Probability Comparison Visualizer */}
          <div className="space-y-6">
            {/* Current Path */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400">
                  Current Unimproved Path
                </span>
                <span className="text-base font-black text-slate-700 dark:text-slate-300">
                  {baseProbability}% Odds
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: `${baseProbability}%` }} />
              </div>
              <p className="text-[11px] text-slate-500">
                Without additional projects, Docker, or targeted DSA practice.
              </p>
            </div>

            {/* Improved Path */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-emerald-50/50 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-emerald-950/30 border border-indigo-200/80 dark:border-indigo-800/80 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 text-sm">
                  <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  EduVerse Accelerated Path
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {simulatedProbability}% Odds
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${simulatedProbability}%` }}
                />
              </div>

              <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  To reach {simulatedProbability}% placement probability:
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Maintain active status on all enabled simulation levers on the right panel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Interactive Action Levers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Interactive Career Levers</span>
                <span className="text-xs text-slate-400 font-normal">(Click to toggle)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle these milestones to simulate your placement growth.
              </p>
            </div>
          </div>

          {/* Lever Toggles List */}
          <div className="space-y-3">
            {levers.map((lever) => (
              <div
                key={lever.id}
                onClick={() => onToggleLever(lever.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  lever.enabled
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    lever.enabled
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {lever.enabled && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {lever.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{lever.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {lever.timeCommitment}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                    lever.enabled
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    +{lever.boostPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
