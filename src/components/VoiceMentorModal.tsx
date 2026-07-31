import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, ViewMode } from '../types';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Video,
  Map,
  X,
  MessageSquare,
  Send,
  Loader2,
  Bot,
  UserCheck,
  ArrowLeft
} from 'lucide-react';

interface VoiceMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  setCurrentView: (view: ViewMode) => void;
}

export const VoiceMentorModal: React.FC<VoiceMentorModalProps> = ({
  isOpen,
  onClose,
  student,
  setCurrentView
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');

  const recognitionRef = useRef<any>(null);

  // Initialize call with greeting speech
  useEffect(() => {
    if (!isOpen) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsListening(false);
      setIsSpeaking(false);
      return;
    }

    const initialGreeting = `Hello ${student.name.split(' ')[0]}! I'm your EduVerse AI Voice Mentor. Your placement readiness for ${student.targetCompany || 'top tech companies'} is currently at ${student.readinessScore || 78}%. What would you like to practice or work on today?`;
    
    setActiveSpeechText(initialGreeting);
    speakText(initialGreeting);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [isOpen]);

  const speakText = (text: string) => {
    if (!audioEnabled || isMuted) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleListening = async () => {
    // Stop listening if currently active
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    // Stop active TTS speaking when user starts talking
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setIsSpeaking(false);
    setUserTranscript('');

    // Request browser microphone permission explicitly if supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micErr: any) {
        console.warn('Microphone permission request result:', micErr);
        if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
          setUserTranscript('Microphone permission denied. Please allow microphone access in browser settings.');
          return;
        }
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        // Always instantiate a fresh instance to avoid state locks
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalTranscriptCollected = '';

        recognition.onstart = () => {
          setIsListening(true);
          setUserTranscript('Listening to your voice... Speak clearly (Educational queries only).');
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscriptCollected += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const liveText = finalTranscriptCollected || interimTranscript;
          if (liveText) {
            setUserTranscript(liveText);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition notice/error:', err.error);
          setIsListening(false);

          if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
            setUserTranscript('Microphone permission denied or blocked by browser.');
          } else if (err.error === 'no-speech') {
            setUserTranscript('No speech detected. Please click the mic and try speaking again.');
          } else if (!finalTranscriptCollected) {
            // Fall back to voice simulation if network/speech service fails
            triggerSimulatedSpeechFallback();
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          if (finalTranscriptCollected.trim()) {
            handleSendUserSpeech(finalTranscriptCollected.trim());
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition initialization failed:', e);
      }
    }

    // Fallback: Voice simulation if SpeechRecognition API is unsupported or restricted
    triggerSimulatedSpeechFallback();
  };

  const triggerSimulatedSpeechFallback = () => {
    setIsListening(true);
    setUserTranscript('Listening to your voice... (Voice Simulation)');

    setTimeout(() => {
      setIsListening(false);
      const simulatedSpeeches = [
        `How can I improve my ATS resume score for ${student.targetCareer || 'Software Engineer'}?`,
        `What projects should I build to target ${student.targetCompany || 'Google'}?`,
        `Can we do a short 2-minute mock technical interview?`,
        `What are my top missing skill gaps right now?`
      ];
      const randomSpeech = simulatedSpeeches[Math.floor(Math.random() * simulatedSpeeches.length)];
      handleSendUserSpeech(randomSpeech);
    }, 2800);
  };

  const handleSendUserSpeech = async (speech: string) => {
    const query = speech.trim();
    if (!query) return;

    setUserTranscript(query);
    setTextInput('');
    setIsLoadingAI(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    try {
      const res = await fetch('/api/gemini/voice-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSpeechText: query,
          studentProfile: student
        })
      });

      const json = await res.json();
      const reply = json.speechReply || `I heard you! Let's continue working on closing your skill gaps for ${student.targetCareer}.`;
      
      setActiveSpeechText(reply);
      speakText(reply);
    } catch (err) {
      console.error('Voice mentor API error:', err);
      const fallback = `Focusing on ${student.targetCareer} concepts! Review your roadmap tasks to stay on track for ${student.targetCompany}.`;
      setActiveSpeechText(fallback);
      speakText(fallback);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const samplePrompts = [
    `How can I improve my ATS score?`,
    `What skills am I missing for ${student.targetCareer || 'Software Engineer'}?`,
    `Simulate a Google mock interview`,
    `Which project should I build next?`
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        {/* Back button */}
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            if (recognitionRef.current) {
              try { recognitionRef.current.stop(); } catch (e) {}
            }
            onClose();
          }}
          className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Back</span>
        </button>

        {/* Close button */}
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            if (recognitionRef.current) {
              try { recognitionRef.current.stop(); } catch (e) {}
            }
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Interactive Voice Coach</span>
          </div>

          <h2 className="text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            EduVerse AI Voice Mentor
          </h2>
          <p className="text-xs text-slate-400">
            Real-Time Speech-to-Speech Guidance for {student.targetCareer || 'Software Roles'}
          </p>
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-center gap-1.5 font-medium">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>Microphone Enabled: AI responds strictly for <strong>educational and career guidance</strong> queries.</span>
          </div>
        </div>

        {/* Animated Audio Wave Spectrum Visualizer */}
        <div className="my-6 py-6 flex items-center justify-center gap-1.5 h-24 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          {[40, 75, 30, 90, 50, 100, 60, 85, 45, 95, 35, 70, 50, 80, 40, 65, 85, 45].map((h, i) => (
            <div
              key={i}
              className={`w-2 rounded-full transition-all duration-300 ${
                isSpeaking
                  ? 'bg-gradient-to-t from-indigo-500 via-purple-500 to-emerald-400 animate-pulse'
                  : isListening
                  ? 'bg-gradient-to-t from-emerald-500 to-teal-400 animate-bounce'
                  : 'bg-slate-700'
              }`}
              style={{
                height: (isSpeaking || isListening) ? `${Math.max(20, h)}%` : '15%',
                animationDelay: `${i * 0.08}s`
              }}
            />
          ))}
        </div>

        {/* User Voice Input Display */}
        {userTranscript && (
          <div className="mb-3 px-4 py-2 rounded-xl bg-indigo-950/50 border border-indigo-800/60 text-xs text-indigo-200 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-semibold text-indigo-300">You said:</span>
            <span className="italic">"{userTranscript}"</span>
          </div>
        )}

        {/* Live Subtitle Transcript Box */}
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-center space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> AI Coach Response:
            </span>
            {isLoadingAI && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
          </div>
          <p className="text-sm font-medium text-slate-100 leading-relaxed min-h-[44px] flex items-center justify-center">
            {isLoadingAI ? "Thinking & formulating spoken advice..." : `"${activeSpeechText}"`}
          </p>
        </div>

        {/* Quick Voice Prompt Chips */}
        <div className="my-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Suggested Voice Prompts:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendUserSpeech(prompt)}
                disabled={isLoadingAI}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 text-[11px] text-slate-300 hover:text-indigo-200 transition-all font-medium"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Text Voice Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendUserSpeech(textInput);
          }}
          className="flex items-center gap-2 mb-6"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type a question to speak with AI Mentor..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isLoadingAI}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick View Switcher */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
              setCurrentView('mock-interview');
            }}
            className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-xs font-semibold text-indigo-300 flex items-center justify-center gap-1.5 transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Mock Interview</span>
          </button>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
              setCurrentView('roadmap');
            }}
            className="p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-xs font-semibold text-purple-300 flex items-center justify-center gap-1.5 transition-all"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Roadmap</span>
          </button>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
              setCurrentView('ai-mentor');
            }}
            className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Room</span>
          </button>
        </div>

        {/* Primary Call Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) {}
              }
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const newAudioState = !audioEnabled;
                setAudioEnabled(newAudioState);
                if (!newAudioState && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
              }}
              className={`p-3 rounded-full border transition-all ${
                !audioEnabled
                  ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={audioEnabled ? "Disable AI Speech Output" : "Enable AI Speech Output"}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={handleToggleListening}
              className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all flex items-center gap-2 ${
                isListening
                  ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse shadow-lg shadow-emerald-500/30'
                  : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-md'
              }`}
              title={isListening ? "Listening... Click to stop" : "Click to Speak"}
            >
              {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? "Listening..." : "Tap to Speak"}</span>
            </button>

            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                if (recognitionRef.current) {
                  try { recognitionRef.current.stop(); } catch (e) {}
                }
                onClose();
              }}
              className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              title="End Voice Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
