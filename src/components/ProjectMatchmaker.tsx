import React, { useState } from 'react';
import { StudentProfile, MatchedProject } from '../types';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import {
  Code,
  Sparkles,
  Star,
  Clock,
  CheckCircle2,
  ExternalLink,
  Layers,
  Filter,
  ArrowRight,
  Github,
  BookOpen,
  Info
} from 'lucide-react';

interface ProjectMatchmakerProps {
  student: StudentProfile;
  projects: MatchedProject[];
}

export const ProjectMatchmaker: React.FC<ProjectMatchmakerProps> = ({
  student,
  projects
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<MatchedProject | null>(null);

  const filteredProjects = projects.filter(
    p => selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Code className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI High-Impact Project Matchmaker</span>
        </div>
        <h1 className="text-2xl font-black">💡 AI Project Matchmaker</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Projects engineered specifically to close your missing skill gaps and maximize resume firepower for recruiters at <strong className="text-white">{student.targetCompany}</strong>. Click any project to open its complete system architecture, executive summary, and ATS resume bullets.
        </p>

        {/* Difficulty Filter Pills */}
        <div className="pt-2 flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Filter Difficulty:</span>
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedDifficulty === diff
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 transition-all hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-lg group"
          >
            {/* Top Bar: Title, Stars, Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    onClick={() => setSelectedProjectForModal(proj)}
                    className="text-lg font-bold text-slate-900 dark:text-white cursor-pointer group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2"
                  >
                    <span>{proj.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                  </h2>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    proj.difficulty === 'Advanced'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {proj.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {proj.tagline}
                </p>
              </div>

              {/* Stars & Duration */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: proj.resumeImpactStars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                    Resume Impact
                  </span>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {proj.durationWeeks}
                </span>
              </div>
            </div>

            {/* Executive Summary Preview */}
            {proj.summary && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <strong className="text-slate-800 dark:text-slate-200">Overview: </strong>
                {proj.summary}
              </p>
            )}

            {/* Why Recommended AI Explanation */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed space-y-1">
              <span className="font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 text-[10px] block">
                Why Recommended for {student.name}:
              </span>
              <p>{proj.whyRecommended}</p>
            </div>

            {/* Tech Stack & Learning Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.map(tech => (
                    <span
                      key={tech}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Learning Outcomes
                </h4>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {proj.learningOutcomes.map((out, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedProjectForModal(proj)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Full Info & Summary</span>
              </button>

              <button
                onClick={() => setSelectedProjectForModal(proj)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Architecture & Resume Bullets</span>
              </button>
            </div>
          </div>
        ))}
      </div>

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

