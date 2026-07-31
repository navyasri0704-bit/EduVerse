import React, { useState } from 'react';
import { MatchedProject, StudentProfile } from '../types';
import {
  X,
  Code,
  Sparkles,
  Star,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Terminal,
  BookOpen,
  ArrowRight,
  Github,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  Layout,
  FileCode2
} from 'lucide-react';

interface ProjectDetailsModalProps {
  project: MatchedProject | null;
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  student,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'roadmap' | 'resume-bullets' | 'starter-code'>('overview');
  const [copiedBulletIndex, setCopiedBulletIndex] = useState<number | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  // Fallback rich defaults if specific optional fields are missing
  const projectSummary = project.summary || 
    `${project.title} is a high-impact, production-grade application engineered to give ${student.name} hands-on mastery in ${project.technologies.join(', ')}. It directly demonstrates real-world software design, scalable backend APIs, and modern deployment standards sought after by recruiters at ${student.targetCompany || 'top tech companies'}.`;

  const architectureModules = project.architectureDiagram ? [
    { title: 'System Overview', desc: project.architectureDiagram }
  ] : [
    { title: 'Frontend UI & Dashboard', icon: Layout, desc: 'Responsive, accessible user interface built with React, TypeScript, and Tailwind CSS with real-time state updates.' },
    { title: 'Backend REST / Stream API', icon: Cpu, desc: `Scalable API layer using ${project.technologies.find(t => t.toLowerCase().includes('python') || t.toLowerCase().includes('node') || t.toLowerCase().includes('fastapi')) || 'FastAPI / Node.js'} handling asynchronous requests and rate-limiting.` },
    { title: 'Database & Data Pipeline', icon: Database, desc: `Structured data persistence powered by ${project.technologies.find(t => t.toLowerCase().includes('sql') || t.toLowerCase().includes('redis') || t.toLowerCase().includes('vector')) || 'PostgreSQL'} with indexed query optimization.` },
    { title: 'AI & Machine Learning Engine', icon: Sparkles, desc: 'Integrates Gemini / LLM models for automated analysis, structured JSON outputs, and vector embedding retrieval.' },
    { title: 'Containerization & DevOps', icon: ShieldCheck, desc: 'Multi-stage Dockerfile configuration with automated CI/CD deployment pipelines on Cloud Run.' }
  ];

  const implementationSteps = project.implementationSteps || [
    { stepNumber: 1, title: 'Phase 1: Environment Setup & Architecture Design', description: 'Initialize repository structure, setup Docker environment, configure environment variables, and define API TypeScript types or Pydantic models.' },
    { stepNumber: 2, title: 'Phase 2: Core Backend Engine & Database Schema', description: 'Design database tables/schemas, create migration scripts, implement asynchronous service controllers, and test endpoints with Jest/Pytest.' },
    { stepNumber: 3, title: 'Phase 3: AI Integration & Business Logic', description: 'Integrate Gemini API / LLM prompts with structured response schemas, build error fallback handlers, and setup caching layer.' },
    { stepNumber: 4, title: 'Phase 4: Frontend Integration, Testing & Deployment', description: 'Connect React client to backend endpoints, refine responsive UI/UX transitions, package into Docker container, and host on Cloud Run.' }
  ];

  const resumeBullets = project.resumeBulletPoints || [
    `Architected and deployed ${project.title} using ${project.technologies.slice(0, 3).join(', ')}, serving 1,000+ simulated requests with <120ms latency.`,
    `Engineered asynchronous data processing pipeline with ${project.technologies[1] || 'REST APIs'}, reducing system memory overhead by 35%.`,
    `Integrated Gemini AI model with structured JSON schemas for automated data analysis and zero-shot error classification.`
  ];

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIndex(index);
    setTimeout(() => setCopiedBulletIndex(null), 2000);
  };

  const handleGenerateStarterCode = () => {
    setIsGeneratingCode(true);
    setTimeout(() => {
      const codeSnippet = `/**
 * ${project.title} - Starter Boilerplate
 * Target Career: ${student.targetCareer} | Target Company: ${student.targetCompany}
 * Stack: ${project.technologies.join(' + ')}
 */

// 1. Environment & Configuration Setup
import dotenv from 'dotenv';
dotenv.config();

// 2. Core Service Initialization
export async function initializeProjectEngine() {
  console.log("🚀 Initializing ${project.title}...");
  
  // Verify API Key availability
  if (!process.env.GEMINI_API_KEY && !process.env.DATABASE_URL) {
    console.warn("⚠️ Ensure environment variables are configured in .env!");
  }

  return {
    status: "active",
    project: "${project.title}",
    technologies: ${JSON.stringify(project.technologies)},
    targetCompanyFit: "${student.targetCompany}"
  };
}

// 3. Main Entry Handler
if (require.main === module) {
  initializeProjectEngine().then(res => {
    console.log("✅ Project initialized successfully:", res);
  });
}`;
      setGeneratedCode(codeSnippet);
      setIsGeneratingCode(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-start justify-between border-b border-slate-800 relative">
          <div className="space-y-2 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold tracking-wider uppercase">
                {project.difficulty} Level Project
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {project.durationWeeks}
              </span>
              <div className="flex items-center gap-1 text-amber-400 pl-1">
                {Array.from({ length: project.resumeImpactStars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
                <span className="text-[10px] font-bold text-amber-200 ml-1">Resume Impact</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {project.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              {project.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar Navigation */}
        <div className="bg-slate-100 dark:bg-slate-950 p-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-semibold">
          {[
            { id: 'overview', label: 'Summary & Overview', icon: BookOpen },
            { id: 'architecture', label: 'System Architecture', icon: Layers },
            { id: 'roadmap', label: 'Implementation Steps', icon: CheckCircle2 },
            { id: 'resume-bullets', label: 'Resume Bullets', icon: Zap },
            { id: 'starter-code', label: 'AI Boilerplate', icon: FileCode2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          {/* TAB 1: OVERVIEW & SUMMARY */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Executive Summary Box */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Executive Project Summary
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {projectSummary}
                </p>
              </div>

              {/* Why Recommended for Student */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Why Recommended for {student.name} ({student.targetCareer}):
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {project.whyRecommended}
                </p>
              </div>

              {/* Technologies Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Technologies & Tools Required
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                    >
                      <Code className="w-3.5 h-3.5 text-indigo-500" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Learning Outcomes */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Core Skills & Capabilities Acquired
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.learningOutcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> System Architecture & Technical Flow
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Below is the modular breakdown required to construct this project from scratch to production readiness.
                </p>
              </div>

              <div className="space-y-3">
                {architectureModules.map((mod, idx) => {
                  const IconComp = mod.icon || Code;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-start gap-3.5"
                    >
                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {mod.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {mod.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: IMPLEMENTATION ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
                Follow this 4-step execution guide to build, test, and host this project within <strong>{project.durationWeeks}</strong>.
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {implementationSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="relative pl-12 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1"
                  >
                    <div className="absolute left-3 top-4 w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                      {step.stepNumber}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RESUME BULLETS */}
          {activeTab === 'resume-bullets' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
                <h4 className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  ATS-Optimized Resume Bullet Points
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Copy and paste these quantifiable bullet points directly into your resume under your Projects section.
                </p>
              </div>

              <div className="space-y-3">
                {resumeBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>{bullet}</span>
                    </div>

                    <button
                      onClick={() => handleCopyBullet(bullet, idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                        copiedBulletIndex === idx
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {copiedBulletIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI BOILERPLATE / STARTER CODE */}
          {activeTab === 'starter-code' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-indigo-500" />
                    AI Starter Boilerplate Setup
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Generate initial code structure tailored for {student.targetCareer}.
                  </p>
                </div>

                <button
                  onClick={handleGenerateStarterCode}
                  disabled={isGeneratingCode}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{generatedCode ? 'Regenerate Code' : 'Generate Boilerplate'}</span>
                </button>
              </div>

              {generatedCode ? (
                <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 overflow-x-auto text-xs font-mono text-emerald-400">
                  <button
                    onClick={() => handleCopyBullet(generatedCode, 999)}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-sans flex items-center gap-1"
                  >
                    {copiedBulletIndex === 999 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBulletIndex === 999 ? 'Copied' : 'Copy Code'}</span>
                  </button>
                  <pre className="whitespace-pre-wrap leading-relaxed">{generatedCode}</pre>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                  <FileCode2 className="w-8 h-8 text-indigo-500 mx-auto opacity-80" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    Click "Generate Boilerplate" above to create clean TypeScript/Python initial module code tailored for this project.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Adding this project adds +15% to your {student.targetCompany} readiness score!</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all w-full sm:w-auto"
            >
              Close
            </button>

            <button
              onClick={() => {
                alert(`Starting ${project.title}! Check your learning checklist for week-by-week guidance.`);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            >
              <Github className="w-4 h-4" />
              <span>Start Building Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
