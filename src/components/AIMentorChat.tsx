import React, { useState, useRef } from 'react';
import { StudentProfile, MentorChatMessage, ViewMode } from '../types';
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  Loader2,
  HelpCircle,
  PhoneCall,
  ArrowRight,
  Mic,
  MicOff
} from 'lucide-react';

interface AIMentorChatProps {
  student: StudentProfile;
  setCurrentView: (view: ViewMode) => void;
  onOpenVoiceMentor: () => void;
}

export const AIMentorChat: React.FC<AIMentorChatProps> = ({
  student,
  setCurrentView,
  onOpenVoiceMentor
}) => {
  const [messages, setMessages] = useState<MentorChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${student.name.split(' ')[0]}! I'm your EduVerse AI Career Mentor. I've reviewed your resume and profile targeting **${student.targetCompany}** for the **${student.targetCareer}** position.\n\nYou're currently at **${student.readinessScore}% Placement Readiness**. How can I help you accelerate your prep today?`,
      timestamp: 'Just now'
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const handleToggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalText = '';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalText += event.results[i][0].transcript;
            } else {
              interimText += event.results[i][0].transcript;
            }
          }
          const liveText = finalText || interimText;
          if (liveText) {
            setInput(liveText);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error in chat:', err.error);
          setIsListening(false);
          if (!input) {
            setInput('How can I prepare for technical interviews?');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition initialization error in chat:', e);
      }
    }

    // Fallback simulation
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInput(`What are the key technical requirements for ${student.targetCareer || 'AI Engineer'} roles?`);
    }, 2200);
  };

  const suggestedQuestions = [
    `How can I prepare for ${student.targetCompany} ${student.targetCareer} technical rounds?`,
    'Which missing skill gap should I prioritize learning first?',
    'Review my current learning roadmap for Docker and PyTorch.',
    'What projects will give my resume the highest impact rating?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isSending) return;

    const userMsg: MentorChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/gemini/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          })),
          studentProfile: student
        })
      });

      const json = await res.json();
      const aiMsg: MentorChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: json.reply || `Great question! Focus on mastering the core concepts of ${student.targetCareer} and practice 2-3 LeetCode problems daily.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error in mentor chat:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Profile-Aware Conversational Assistant</span>
          </div>
          <h1 className="text-2xl font-black">🤖 AI Career Mentor</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Ask anything about your interview prep, skill roadmap, or project choices. Personalized specifically for {student.name}.
          </p>
        </div>

        <button
          onClick={onOpenVoiceMentor}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>Switch to Voice Mentor Call</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[550px]">
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
              }`}>
                <p className="whitespace-pre-line">{m.text}</p>
                <span className={`text-[9px] mt-2 block font-medium ${
                  m.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                }`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>AI Mentor is thinking...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sq)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-500 whitespace-nowrap shrink-0 transition-all"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSpeechRecognition}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title={isListening ? "Listening... Click to stop" : "Click to speak voice input"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? "Listening to your speech..." : "Ask your AI Mentor anything about your career path..."}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isSending}
            className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
