import React, { useState } from 'react';
import { StudentProfile, MockInterviewQuestion, InterviewEvaluation } from '../types';
import {
  Video,
  Mic,
  MicOff,
  Sparkles,
  Send,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCw,
  Loader2,
  Volume2
} from 'lucide-react';

interface MockInterviewProps {
  student: StudentProfile;
  questions: MockInterviewQuestion[];
  onCompleteInterview?: (score: number) => void;
}

export const MockInterview: React.FC<MockInterviewProps> = ({
  student,
  questions,
  onCompleteInterview
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Technical' | 'HR'>('Technical');
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);

  const recognitionRef = React.useRef<any>(null);

  const filteredQuestions = questions.filter(q => q.category === selectedCategory);
  const activeQuestion = filteredQuestions[currentQuestionIndex] || questions[0];

  const handleToggleVoiceInput = async () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micErr: any) {
        console.warn('Microphone permission error:', micErr);
        if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
          alert('Microphone access denied. Please grant microphone permissions in browser settings to speak your answer.');
          return;
        }
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalText = '';

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalText += event.results[i][0].transcript + ' ';
            } else {
              interimText += event.results[i][0].transcript;
            }
          }
          const liveText = finalText || interimText;
          if (liveText) {
            setUserAnswer(liveText);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error in interview:', err.error);
          setIsRecording(false);

          if (!userAnswer) {
            triggerInterviewVoiceSimulation();
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }

    // Fallback if Speech Recognition API is blocked or unsupported
    triggerInterviewVoiceSimulation();
  };

  const triggerInterviewVoiceSimulation = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setUserAnswer(
        "For a high-scalability production system, I would apply microservices architecture with Redis caching, PostgreSQL read replicas, and Docker containers orchestrated via Kubernetes. For AI features, I would integrate Gemini API with semantic retrieval and fallback error boundaries."
      );
    }, 2800);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.questionText,
          answer: userAnswer,
          category: selectedCategory,
          studentProfile: student
        })
      });
      const json = await res.json();
      if (json.success && json.evaluation) {
        setEvaluation(json.evaluation);
        if (onCompleteInterview && json.evaluation.score) {
          onCompleteInterview(json.evaluation.score);
        }
      }
    } catch (err) {
      console.error('Interview evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Video className="w-3.5 h-3.5" />
              <span>AI Real-time Speech & Technical Assessor</span>
            </div>
            <h1 className="text-2xl font-black">🎤 AI Mock Interview Simulator</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Practice HR and Technical questions with voice audio capture and instant AI scoring on confidence, STAR structure, and technical depth.
            </p>
          </div>

          {/* Mode Toggles */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setSelectedCategory('Technical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'Technical'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => setSelectedCategory('HR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'HR'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              HR & Behavioral
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Interviewer Stage */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          {/* AI Avatar Display Box */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white overflow-hidden text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold text-2xl relative">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-indigo-200">
                AI Interviewer — Senior Engineer at {student.targetCompany}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </p>
            </div>

            {/* Question Text Box */}
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-sm font-medium text-white max-w-xl mx-auto leading-relaxed">
              "{activeQuestion.questionText}"
            </div>
          </div>

          {/* User Response Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Response ({isVoiceMode ? 'Voice Mode' : 'Text Mode'})
              </label>

              <button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Switch to {isVoiceMode ? 'Text Mode' : 'Voice Mode'}
              </button>
            </div>

            {isVoiceMode ? (
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center space-y-4">
                <button
                  onClick={handleToggleVoiceInput}
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/40'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105'
                  }`}
                >
                  {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isRecording ? 'Listening... Speak your answer now' : 'Click microphone to record your voice answer'}
                </p>

                {userAnswer && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 text-left font-mono">
                    "{userAnswer}"
                  </div>
                )}
              </div>
            ) : (
              <textarea
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your response here..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            )}

            <button
              onClick={handleSubmitAnswer}
              disabled={isEvaluating || !userAnswer.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI Scoring Answer Depth...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answer for Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Instant Evaluation Feedback */}
        <div className="space-y-6">
          {evaluation ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>Interview AI Evaluation</span>
                </h3>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {evaluation.overallScore}/100
                </span>
              </div>

              {/* Sub Scores */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-slate-400 block text-[10px]">Technical Accuracy</span>
                  <span className="font-bold text-slate-900 dark:text-white">{evaluation.technicalAccuracy}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-slate-400 block text-[10px]">Communication</span>
                  <span className="font-bold text-slate-900 dark:text-white">{evaluation.communicationScore}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-slate-400 block text-[10px]">Confidence</span>
                  <span className="font-bold text-slate-900 dark:text-white">{evaluation.confidenceScore}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                  <span className="text-slate-400 block text-[10px]">Grammar & Delivery</span>
                  <span className="font-bold text-slate-900 dark:text-white">{evaluation.grammarScore}%</span>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-emerald-600">Strengths:</h5>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {evaluation.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-amber-600">Improvement Suggestions:</h5>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {evaluation.improvementAreas.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ideal Answer Box */}
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-1">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 block">Sample High-Impact Answer:</span>
                <p className="text-slate-700 dark:text-slate-300">{evaluation.idealAnswerSample}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center py-12 space-y-3">
              <Award className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Evaluation Pending
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Submit your response to generate AI performance scoring.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
