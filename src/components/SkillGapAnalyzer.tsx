import React, { useState } from 'react';
import { StudentProfile, SkillGapItem, ViewMode } from '../types';
import { initialCertifications } from '../data/initialData';
import {
  TrendingUp,
  Target,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';

interface SkillGapAnalyzerProps {
  student: StudentProfile;
  skillGaps: SkillGapItem[];
  onSelectCareerTarget: (career: string) => void;
  setCurrentView: (view: ViewMode) => void;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({
  student,
  skillGaps,
  onSelectCareerTarget,
  setCurrentView
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'Missing' | 'In Progress' | 'Mastered'>('all');
  const [certStatuses, setCertStatuses] = useState<Record<string, 'Recommended' | 'In Progress' | 'Completed'>>({});

  const careerTargets = [
    'AI Engineer',
    'Data Scientist',
    'Backend Developer',
    'Cloud Engineer',
    'Cybersecurity Specialist',
    'Full Stack Engineer'
  ];

  const filteredGaps = skillGaps.filter(
    item => filterCategory === 'all' || item.status === filterCategory
  );

  const totalHoursNeeded = skillGaps
    .filter(item => item.status !== 'Mastered')
    .reduce((acc, curr) => acc + curr.estimatedHours, 0);

  // Filter actual certifications for current student's target career
  const relevantCertifications = initialCertifications.filter(c => 
    c.targetCareers.includes(student.targetCareer) || c.targetCareers.includes('All')
  );

  const handleToggleCertStatus = (certId: string) => {
    setCertStatuses(prev => {
      const current = prev[certId] || 'Recommended';
      const next = current === 'Recommended' ? 'In Progress' : current === 'In Progress' ? 'Completed' : 'Recommended';
      return { ...prev, [certId]: next };
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-slide-up">
      {/* Header Banner */}
      <div className="glass-banner rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>AI Skill Gap & Industry Benchmarking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">AI Skill Gap Analyzer</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Comparing your current skill stack against real industry hiring criteria for <strong className="text-white">{student.targetCareer}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-inner">
            <Clock className="w-5 h-5 text-indigo-300" />
            <div>
              <span className="text-[10px] text-slate-300 uppercase font-semibold block">Est. Upskill Time</span>
              <span className="text-sm font-bold text-white">{totalHoursNeeded} Hours (~3-4 Weeks)</span>
            </div>
          </div>
        </div>

        {/* Career Switcher Pills */}
        <div className="pt-3 border-t border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-2">
            Switch Target Role:
          </span>
          <div className="flex flex-wrap gap-2">
            {careerTargets.map((role) => {
              const isSelected = student.targetCareer === role;
              return (
                <button
                  key={role}
                  onClick={() => onSelectCareerTarget(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/50'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Breakdown Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all hover:shadow-lg hover:-translate-y-0.5">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Industry Skill Match</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {student.skillMatchScore}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
            {student.skillMatchScore}%
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all hover:shadow-lg hover:-translate-y-0.5">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Missing Core Gaps</span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {skillGaps.filter(s => s.status === 'Missing').length} Skills
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200/50 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold">
            !
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all hover:shadow-lg hover:-translate-y-0.5">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-bold text-purple-600 dark:text-purple-400">Target Certifications</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {relevantCertifications.length} Industry Certs
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200/50 dark:border-purple-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Actual Recommended Certifications Section */}
      <div className="glass-card p-6 rounded-2xl shadow-sm space-y-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                <Award className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Recommended Industry Certifications
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Official certifications mapped specifically to recruiters' criteria at <strong className="text-slate-800 dark:text-slate-200">{student.targetCompany}</strong> for <strong className="text-indigo-600 dark:text-indigo-400">{student.targetCareer}</strong>.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            {relevantCertifications.length} Top Credentials
          </span>
        </div>

        {/* Certifications Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relevantCertifications.map((cert) => {
            const currentStatus = certStatuses[cert.id] || cert.status;
            return (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-md shadow-xs hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-800 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon, Provider & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-100 dark:border-slate-700 shrink-0">
                        {cert.badgeIcon}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                          {cert.provider}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                          {cert.title}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
                      {cert.industryRecognition}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {cert.description}
                  </p>

                  {/* Skills Badges */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Skills Tested:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skillsCovered.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Metadata & Link */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>⏱️ {cert.durationWeeks}</span>
                    <span>•</span>
                    <span>💰 {cert.cost}</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleToggleCertStatus(cert.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                        currentStatus === 'Completed'
                          ? 'bg-emerald-600 text-white'
                          : currentStatus === 'In Progress'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {currentStatus === 'Completed' && <Check className="w-3.5 h-3.5" />}
                      {currentStatus === 'In Progress' && <Clock className="w-3.5 h-3.5" />}
                      <span>{currentStatus}</span>
                    </button>

                    <a
                      href={cert.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Official Exam</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Filter & Skill Gap List */}
      <div className="glass-card p-6 rounded-2xl shadow-sm space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Required Competencies for {student.targetCareer}</span>
          </h3>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['all', 'Missing', 'In Progress', 'Mastered'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Gap Items Grid */}
        <div className="space-y-3">
          {filteredGaps.map((item) => (
            <div
              key={item.skill}
              className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-white/40 dark:bg-slate-800/20 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-md"
            >
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.skill}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Recommended: <strong>{item.recommendedResource}</strong></span>
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800">
                {/* Hours Badge */}
                {item.estimatedHours > 0 && (
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.estimatedHours}h to master
                  </span>
                )}

                {/* Status Badge */}
                <span className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 ${
                  item.status === 'Mastered'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : item.status === 'In Progress'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                }`}>
                  {item.status === 'Mastered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {item.status === 'In Progress' && <Clock className="w-3.5 h-3.5" />}
                  {item.status === 'Missing' && <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{item.status}</span>
                </span>

                <button
                  onClick={() => setCurrentView('project-matchmaker')}
                  className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                  title="Find Project for this skill"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

