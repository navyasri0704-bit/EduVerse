import React, { useState, useRef, useEffect } from 'react';
import { StudentProfile, MentorChatMessage, ViewMode } from '../types';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Mic,
  Maximize2,
  PhoneCall,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface SideChatWidgetProps {
  student: StudentProfile;
  setCurrentView: (view: ViewMode) => void;
  onOpenVoiceMentor: () => void;
}

export const SideChatWidget: React.FC<SideChatWidgetProps> = ({
  student,
  setCurrentView,
  onOpenVoiceMentor
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MentorChatMessage[]>([
    {
      id: 'side-m1',
      sender: 'ai',
      text: `Hi ${student.name.split(' ')[0]}! I'm your AI Career Assistant. Ask me anything about your resume, interview prep, or career roadmap!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isSending) return;

    const userMsg: MentorChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/gemini/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageHistory: [...messages, userMsg].map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          })),
          studentProfile: student
        })
      });

      const json = await res.json();
      let replyText = '';

      if (json.success && json.reply) {
        replyText = json.reply;
      } else {
        replyText = `Based on your goal for **${student.targetCareer}** at **${student.targetCompany}**, focus on strengthening your project portfolio, practicing technical problems, and tailoring your resume bullet points with quantifiable results!`;
      }

      const aiMsg: MentorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Side chat error:', err);
      const aiMsg: MentorChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `I'm analyzing your profile for **${student.targetCareer}**. Feel free to ask about resume ATS optimization or technical interview questions!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
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
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e: any) => {
          let interimText = '';
          for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
            else interimText += e.results[i][0].transcript;
          }
          const live = finalText || interimText;
          if (live) setInput(live);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        setIsListening(false);
      }
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Floating Side Panel Drawer when Open */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[90vw] sm:w-[380px] h-[520px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div>
                <h3 className="font-bold text-xs flex items-center gap-1.5">
                  <span>AI Career Mentor</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 text-[10px] font-semibold">
                    Live
                  </span>
                </h3>
                <p className="text-[10px] text-slate-300">
                  Target: {student.targetCareer}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onOpenVoiceMentor}
                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                title="Start Voice Call"
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentView('ai-mentor');
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                title="Expand Full Screen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Banner */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-2 border-b border-indigo-100 dark:border-indigo-900/50 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              'Improve Resume ATS',
              'Mock Interview Question',
              'Bridge Skill Gap'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold whitespace-nowrap hover:bg-indigo-50 transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${
                  m.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white ${
                    m.sender === 'user'
                      ? 'bg-indigo-600'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                  }`}
                >
                  {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-[11px]">{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      m.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold pl-8">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI Mentor typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={handleToggleMic}
              className={`p-2 rounded-xl border transition-colors shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Speak Question"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? 'Listening...' : 'Ask AI Mentor...'}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isSending}
              className="p-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors shrink-0 shadow-md shadow-indigo-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Persistent Floating Side Trigger Button - HIGH VISIBILITY */}
      <div className="pointer-events-auto flex items-center gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-lg border border-slate-800 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Mentor Chat</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/35 hover:scale-110 active:scale-95 transition-all ring-4 ring-indigo-500/20"
          title="Open AI Mentor Chatbot"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </span>

          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};
