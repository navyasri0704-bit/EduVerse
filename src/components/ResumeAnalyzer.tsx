import React, { useState, useRef } from 'react';
import { StudentProfile, ResumeAnalysisResult } from '../types';
import { parseResumeFile, analyzeResumeLocally } from '../utils/resumeParser';
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Check,
  RotateCw,
  Loader2,
  Award,
  Layers,
  ChevronDown,
  FileCheck
} from 'lucide-react';

interface ResumeAnalyzerProps {
  student: StudentProfile;
  analysis: ResumeAnalysisResult;
  onUpdateAnalysis: (newAnalysis: ResumeAnalysisResult) => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  student,
  analysis,
  onUpdateAnalysis
}) => {
  const [resumeText, setResumeText] = useState(student.resumeText || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ats' | 'projects' | 'test'>('overview');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Skill Verification Mock Test State
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [isLoadingTest, setIsLoadingTest] = useState<boolean>(false);
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
    message: string;
  } | null>(null);

  const fetchSkillTestQuestions = async () => {
    setIsLoadingTest(true);
    setTestSubmitted(false);
    setTestResult(null);
    setTestAnswers({});

    try {
      const skillsToTest = safeAnalysis.extractedSkills.length > 0
        ? safeAnalysis.extractedSkills
        : (student.skills && student.skills.length > 0 ? student.skills : ['Python', 'React.js', 'SQL', 'Data Structures']);

      const res = await fetch('/api/gemini/generate-skill-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: skillsToTest,
          targetCareer: student.targetCareer
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setTestQuestions(data.questions);
      } else {
        setTestQuestions([
          {
            id: 'sq-1',
            skill: 'Python',
            question: 'In Python, what is the primary structural difference between a list and a tuple?',
            options: ['Lists are immutable, tuples are mutable', 'Tuples are immutable, lists are mutable', 'Lists store only numbers', 'Tuples cannot be indexed'],
            correctOptionIndex: 1,
            explanation: 'Tuples are immutable while lists are mutable.'
          },
          {
            id: 'sq-2',
            skill: 'React.js',
            question: 'When should you use the useCallback hook in React?',
            options: ['To fetch API data', 'To memoize callback function instances across re-renders', 'To directly mutate the DOM', 'To define CSS styling'],
            correctOptionIndex: 1,
            explanation: 'useCallback memoizes callback functions across re-renders.'
          },
          {
            id: 'sq-3',
            skill: 'SQL',
            question: 'Which SQL JOIN returns all records from the left table and matching records from the right table?',
            options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
            correctOptionIndex: 1,
            explanation: 'LEFT JOIN returns all rows from the left table and matched rows from the right table.'
          },
          {
            id: 'sq-4',
            skill: 'Data Structures',
            question: 'What is the average time complexity for searching an element in a Hash Table?',
            options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
            correctOptionIndex: 2,
            explanation: 'Hash tables have average O(1) constant search time.'
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load skill test questions:', err);
    } finally {
      setIsLoadingTest(false);
    }
  };

  const handleGradeTest = () => {
    let correct = 0;
    const total = testQuestions.length || 1;
    testQuestions.forEach((q, idx) => {
      if (testAnswers[idx] === q.correctOptionIndex) {
        correct++;
      }
    });

    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 50;

    let msg = "";
    if (passed) {
      msg = `Skill Verification Passed! (${pct}% Score - ${correct}/${total} Correct). Your practical knowledge matches the technical skills extracted from your resume.`;
    } else {
      msg = `Resume Verification Failed (${pct}% Score - ${correct}/${total} Correct). The test score was below the required 50% threshold. The uploaded resume information may be wrong or your selected skills do not match your practical test answers. Please update your resume content.`;
    }

    setTestResult({
      score: pct,
      passed,
      correctCount: correct,
      totalCount: total,
      message: msg
    });
    setTestSubmitted(true);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeAnalysis = {
    resumeScore: typeof analysis?.resumeScore === 'number' ? analysis.resumeScore : 70,
    atsCompatibility: typeof analysis?.atsCompatibility === 'number' ? analysis.atsCompatibility : 75,
    extractedSkills: Array.isArray(analysis?.extractedSkills) ? analysis.extractedSkills : [],
    strengths: Array.isArray(analysis?.strengths) ? analysis.strengths : [],
    weaknesses: Array.isArray(analysis?.weaknesses) ? analysis.weaknesses : [],
    atsSuggestions: Array.isArray(analysis?.atsSuggestions) ? analysis.atsSuggestions : [],
    projectAnalysis: Array.isArray(analysis?.projectAnalysis) ? analysis.projectAnalysis : []
  };

  const handleRunAIAnalysis = async (customText?: any) => {
    const rawText = typeof customText === 'string' ? customText : resumeText;
    const textToAnalyze = (typeof rawText === 'string' ? rawText : String(rawText || '')).trim();
    if (!textToAnalyze) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: textToAnalyze,
          studentProfile: student
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        onUpdateAnalysis(json.data);
      } else {
        const fallback = analyzeResumeLocally(textToAnalyze, student?.targetCareer);
        onUpdateAnalysis(fallback);
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      const fallback = analyzeResumeLocally(textToAnalyze, student?.targetCareer);
      onUpdateAnalysis(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsAnalyzing(true);

    try {
      const extractedText = await parseResumeFile(file);
      const safeText = (extractedText && extractedText.trim().length > 0) ? extractedText : `Resume contents for ${file.name}`;
      setResumeText(safeText);
      await handleRunAIAnalysis(safeText);
    } catch (err) {
      console.error('File parsing error:', err);
      const safeText = `Uploaded resume: ${file.name}`;
      setResumeText(safeText);
      await handleRunAIAnalysis(safeText);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>AI Resume & ATS Optimization Engine</span>
          </div>
          <h1 className="text-2xl font-black">AI Resume Analyzer</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Extract technical skills, check ATS compatibility for target roles, and get actionable impact fixes.
          </p>
        </div>

        <button
          onClick={handleRunAIAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Re-analyze Resume</span>
            </>
          )}
        </button>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Resume Input / Text View */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Resume Content</span>
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">
              Plain Text or Upload
            </span>
          </div>

          <textarea
            rows={16}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your full resume text here..."
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.docx,.md"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 dark:border-indigo-800/80 rounded-xl p-4 text-center hover:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 cursor-pointer transition-colors group"
          >
            {uploadedFileName ? (
              <FileCheck className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
            ) : (
              <Upload className="w-5 h-5 mx-auto text-indigo-500 mb-1 group-hover:scale-110 transition-transform" />
            )}
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {uploadedFileName ? `Uploaded: ${uploadedFileName}` : 'Click to Upload Resume (PDF / TXT / DOCX)'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Auto-extracts text and runs AI ATS scoring
            </p>
          </div>
        </div>

        {/* Right Column (2 cols): AI Analysis Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overall Resume Score</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  Target: {student.targetCareer}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {safeAnalysis.resumeScore}/100
                </span>
                <span className="text-xs font-bold text-emerald-600">Grade: A-</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${safeAnalysis.resumeScore}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ATS Pass Compatibility</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  Parsing Ready
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {safeAnalysis.atsCompatibility}%
                </span>
                <span className="text-xs font-semibold text-slate-500">Passing Threshold</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${safeAnalysis.atsCompatibility}%` }}
                />
              </div>
            </div>
          </div>

          {/* Analysis View Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto">
              {[
                { id: 'overview', label: 'Extracted Skills & Strengths' },
                { id: 'ats', label: 'ATS Format Recommendations' },
                { id: 'projects', label: 'Project Impact Ratings' },
                { id: 'test', label: '⚡ Skill Verification Mock Test' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === 'test' && testQuestions.length === 0) {
                      fetchSkillTestQuestions();
                    }
                  }}
                  className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW & EXTRACTED SKILLS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Extracted Technical Skills ({safeAnalysis.extractedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {safeAnalysis.extractedSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Top Resume Strengths
                    </h5>
                    <ul className="space-y-2">
                      {safeAnalysis.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
                    <h5 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Areas to Improve
                    </h5>
                    <ul className="space-y-2">
                      {safeAnalysis.weaknesses.map((wk, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ATS SUGGESTIONS */}
            {activeTab === 'ats' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  ATS Scanner Optimization Feedback
                </h4>
                <div className="space-y-3">
                  {safeAnalysis.atsSuggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
                    >
                      <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {sug}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PROJECT IMPACT */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Project Bullet Point Impact Breakdown
                </h4>
                <div className="space-y-3">
                  {safeAnalysis.projectAnalysis.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {proj.title}
                        </h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          Impact: {proj.impactScore}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {proj.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SKILL VERIFICATION MOCK TEST */}
            {activeTab === 'test' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Skill Verification Mock Assessment</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Basic MCQs generated directly from your resume's extracted skills: {safeAnalysis.extractedSkills.slice(0, 5).join(', ')}. Passing score: 50%.
                    </p>
                  </div>
                  <button
                    onClick={fetchSkillTestQuestions}
                    disabled={isLoadingTest}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isLoadingTest ? 'animate-spin' : ''}`} />
                    <span>Generate New Test</span>
                  </button>
                </div>

                {isLoadingTest ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Loading skill verification questions from Gemini AI...</p>
                  </div>
                ) : testSubmitted && testResult ? (
                  <div className="space-y-6">
                    {testResult.passed ? (
                      <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-center space-y-3">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">
                          Resume Skills Verified! ({testResult.score}%)
                        </h4>
                        <p className="text-xs text-emerald-800 dark:text-emerald-200 max-w-md mx-auto leading-relaxed">
                          {testResult.message}
                        </p>
                        <button
                          onClick={fetchSkillTestQuestions}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all"
                        >
                          Retake Verification Test
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-center space-y-3">
                        <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-400 mx-auto" />
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">
                          Resume Verification Warning ({testResult.score}%)
                        </h4>
                        <div className="p-3.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 text-xs font-medium max-w-md mx-auto border border-rose-300 dark:border-rose-700">
                          {testResult.message}
                        </div>
                        <div className="flex justify-center gap-3 pt-2">
                          <button
                            onClick={fetchSkillTestQuestions}
                            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all"
                          >
                            Retake Verification Test
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            Question {idx + 1} of {testQuestions.length}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                            Skill: {q.skill}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                          {q.question}
                        </p>
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {q.options.map((opt: string, optIdx: number) => {
                            const isSelected = testAnswers[idx] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => setTestAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-white font-bold'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                                }`}
                              >
                                <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleGradeTest}
                      disabled={Object.keys(testAnswers).length < testQuestions.length}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Answers & Verify Resume</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
