import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  ViewMode,
  ResumeAnalysisResult,
  SkillGapItem,
  CareerSimulationLever,
  RoadmapWeek,
  MatchedProject,
  MockInterviewQuestion
} from './types';
import {
  cleanStudentProfile,
  cleanResumeAnalysis,
  defaultStudentProfile,
  defaultResumeAnalysis,
  defaultSkillGaps,
  defaultSimulationLevers,
  defaultRoadmapWeeks,
  defaultMatchedProjects,
  defaultMockQuestions
} from './data/initialData';

import { Navbar } from './components/Navbar';
import { StudentOnboarding } from './components/StudentOnboarding';
import { PlacementDashboard } from './components/PlacementDashboard';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { FutureCareerSimulator } from './components/FutureCareerSimulator';
import { LearningRoadmap } from './components/LearningRoadmap';
import { ProjectMatchmaker } from './components/ProjectMatchmaker';
import { MockInterview } from './components/MockInterview';
import { AIMentorChat } from './components/AIMentorChat';
import { VoiceMentorModal } from './components/VoiceMentorModal';
import { SideChatWidget } from './components/SideChatWidget';

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(cleanStudentProfile);
  const [currentView, setCurrentView] = useState<ViewMode>('onboarding'); // Initial onboarding screen
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // Core Data States
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult>(cleanResumeAnalysis);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(defaultSkillGaps);
  const [levers, setLevers] = useState<CareerSimulationLever[]>(defaultSimulationLevers);
  const [roadmapWeeks, setRoadmapWeeks] = useState<RoadmapWeek[]>(defaultRoadmapWeeks);
  const [matchedProjects, setMatchedProjects] = useState<MatchedProject[]>(defaultMatchedProjects);
  const [mockQuestions, setMockQuestions] = useState<MockInterviewQuestion[]>(defaultMockQuestions);

  // Helper to sync state to backend for active session user
  const syncStateToBackend = (updatedData: {
    profile?: StudentProfile;
    resumeAnalysis?: ResumeAnalysisResult | null;
    roadmapWeeks?: RoadmapWeek[];
    skillGaps?: SkillGapItem[];
    levers?: CareerSimulationLever[];
    mockQuestions?: MockInterviewQuestion[];
  }) => {
    const token = localStorage.getItem('eduverse_auth_token');
    if (!token) return;

    fetch('/api/user/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ data: updatedData })
    }).catch(err => console.warn('User sync failed:', err));
  };

  // Hydrate full user state
  const hydrateUserData = (userData: any) => {
    if (!userData) return;
    if (userData.profile) setStudent(userData.profile);
    if (userData.resumeAnalysis !== undefined) {
      setResumeAnalysis(userData.resumeAnalysis || cleanResumeAnalysis);
    }
    if (userData.roadmapWeeks && userData.roadmapWeeks.length > 0) {
      setRoadmapWeeks(userData.roadmapWeeks);
    }
    if (userData.skillGaps && userData.skillGaps.length > 0) {
      setSkillGaps(userData.skillGaps);
    }
    if (userData.levers && userData.levers.length > 0) {
      setLevers(userData.levers);
    }
    if (userData.matchedProjects && userData.matchedProjects.length > 0) {
      setMatchedProjects(userData.matchedProjects);
    }
    if (userData.mockQuestions && userData.mockQuestions.length > 0) {
      setMockQuestions(userData.mockQuestions);
    }
  };

  // Restore user session on initial application load
  useEffect(() => {
    const token = localStorage.getItem('eduverse_auth_token');
    if (token) {
      fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            hydrateUserData(data.user);
            if (data.user.profile?.isOnboarded) {
              setCurrentView('dashboard');
            }
          }
        })
        .catch(err => console.warn('Session restore error:', err));
    }
  }, []);

  // Handlers
  const handleCompleteOnboarding = (updatedStudent: StudentProfile, userData?: any) => {
    if (userData) {
      hydrateUserData(userData);
      if (userData.profile) {
        setStudent(userData.profile);
      } else {
        setStudent(updatedStudent);
      }
    } else {
      setStudent(updatedStudent);
    }

    setCurrentView('dashboard');
    syncStateToBackend({ profile: updatedStudent });
  };

  const handleUpdateResumeAnalysis = (newAnalysis: ResumeAnalysisResult) => {
    const safeNewAnalysis: ResumeAnalysisResult = {
      resumeScore: typeof newAnalysis?.resumeScore === 'number' ? newAnalysis.resumeScore : 70,
      atsCompatibility: typeof newAnalysis?.atsCompatibility === 'number' ? newAnalysis.atsCompatibility : 75,
      extractedSkills: Array.isArray(newAnalysis?.extractedSkills) ? newAnalysis.extractedSkills : [],
      strengths: Array.isArray(newAnalysis?.strengths) ? newAnalysis.strengths : [],
      weaknesses: Array.isArray(newAnalysis?.weaknesses) ? newAnalysis.weaknesses : [],
      atsSuggestions: Array.isArray(newAnalysis?.atsSuggestions) ? newAnalysis.atsSuggestions : [],
      projectAnalysis: Array.isArray(newAnalysis?.projectAnalysis) ? newAnalysis.projectAnalysis : []
    };

    setResumeAnalysis(safeNewAnalysis);

    let updatedProfileState: StudentProfile | null = null;

    setStudent(prev => {
      const updatedSkills = safeNewAnalysis.extractedSkills.length > 0
        ? safeNewAnalysis.extractedSkills
        : prev.skills;

      const newResumeScore = safeNewAnalysis.resumeScore || prev.resumeScore;
      const newReadiness = Math.min(Math.round((newResumeScore + safeNewAnalysis.atsCompatibility) / 2), 98);

      updatedProfileState = {
        ...prev,
        skills: updatedSkills,
        resumeScore: newResumeScore,
        readinessScore: newReadiness
      };

      return updatedProfileState;
    });

    // Update skill gaps dynamically based on extracted skills
    if (safeNewAnalysis.extractedSkills.length > 0) {
      const extractedLower = safeNewAnalysis.extractedSkills.map(s => String(s || '').toLowerCase());
      setSkillGaps(prev =>
        prev.map(gap => {
          const gapName = String(gap.skillName || '').toLowerCase();
          const isFound = extractedLower.some(s => s.includes(gapName) || gapName.includes(s));
          if (isFound) {
            return {
              ...gap,
              currentProficiency: Math.max(gap.currentProficiency, 75),
              gapLevel: 'Low'
            };
          }
          return gap;
        })
      );
    }

    if (updatedProfileState) {
      syncStateToBackend({ profile: updatedProfileState, resumeAnalysis: safeNewAnalysis });
    }
  };

  const handleToggleLever = (leverId: string) => {
    setLevers(prev => {
      const updated = prev.map(l => (l.id === leverId ? { ...l, enabled: !l.enabled } : l));
      syncStateToBackend({ levers: updated });
      return updated;
    });
  };

  const handleToggleTask = (weekNum: number, taskId: string) => {
    setRoadmapWeeks(prev => {
      const updated = prev.map(w => {
        if (w.weekNumber === weekNum) {
          const updatedTasks = w.tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
          const completedCount = updatedTasks.filter(t => t.completed).length;
          const completedPercent = Math.round((completedCount / updatedTasks.length) * 100);
          return { ...w, tasks: updatedTasks, completedPercent };
        }
        return w;
      });

      syncStateToBackend({ roadmapWeeks: updated });
      return updated;
    });
  };

  const handleCompleteInterview = (score: number) => {
    setStudent(prev => {
      const newInterviewScore = Math.max(prev.interviewScore || 0, score);
      const newReadiness = Math.min(Math.round(( (prev.resumeScore || 60) + newInterviewScore ) / 2), 98);

      const unlockedBadges = prev.unlockedBadgeIds.includes('badge-interview')
        ? prev.unlockedBadgeIds
        : [...prev.unlockedBadgeIds, 'badge-interview'];

      const updatedProfile: StudentProfile = {
        ...prev,
        interviewScore: newInterviewScore,
        readinessScore: newReadiness,
        xp: prev.xp + 200,
        unlockedBadgeIds: unlockedBadges,
        xpHistory: [
          {
            id: `xp-int-${Date.now()}`,
            action: `Completed AI Mock Interview (Scored ${score}%)`,
            xp: 200,
            timestamp: 'Just now',
            category: 'Interview'
          },
          ...prev.xpHistory
        ]
      };

      syncStateToBackend({ profile: updatedProfile });
      return updatedProfile;
    });
  };

  const handleSelectCareerTarget = (career: string) => {
    setStudent(prev => {
      const updated = { ...prev, targetCareer: career };
      syncStateToBackend({ profile: updated });
      return updated;
    });
  };

  const handleLogout = () => {
    const token = localStorage.getItem('eduverse_auth_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }

    localStorage.removeItem('eduverse_auth_token');
    setStudent(cleanStudentProfile);
    setResumeAnalysis(cleanResumeAnalysis);
    setRoadmapWeeks(defaultRoadmapWeeks.map(w => ({ ...w, completedPercent: 0, tasks: w.tasks.map(t => ({ ...t, completed: false })) })));
    setCurrentView('onboarding');
  };

  // Active view with authentication guard - force onboarding when not logged in
  const activeView = student.isOnboarded ? currentView : 'onboarding';

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      {/* Background Ambient Glow Orbs */}
      <div className="pointer-events-none absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/15 dark:bg-indigo-500/10 blur-[130px] rounded-full animate-float-orb" />
      <div className="pointer-events-none absolute top-[400px] right-[-100px] w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-500/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-500/10 blur-[140px] rounded-full" />

      {/* Top Navbar Header */}
      <Navbar
        currentView={activeView}
        setCurrentView={(view) => {
          if (student.isOnboarded) {
            setCurrentView(view);
          } else {
            setCurrentView('onboarding');
          }
        }}
        student={student}
        onOpenVoiceMentor={() => setIsVoiceModalOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLogout={handleLogout}
      />

      {/* Main Container Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Unauthenticated View: Onboarding & Authentication Screen */}
        {!student.isOnboarded ? (
          <StudentOnboarding
            student={student}
            onCompleteOnboarding={handleCompleteOnboarding}
          />
        ) : (
          /* Authenticated Dashboard & Feature Views */
          <>
            {activeView === 'onboarding' && (
              <StudentOnboarding
                student={student}
                onCompleteOnboarding={handleCompleteOnboarding}
              />
            )}

            {activeView === 'dashboard' && (
              <PlacementDashboard
                student={student}
                skillGaps={skillGaps}
                roadmapWeeks={roadmapWeeks}
                matchedProjects={matchedProjects}
                levers={levers}
                setCurrentView={setCurrentView}
                onOpenVoiceMentor={() => setIsVoiceModalOpen(true)}
                onToggleTask={handleToggleTask}
              />
            )}

            {activeView === 'resume-analyzer' && (
              <ResumeAnalyzer
                student={student}
                analysis={resumeAnalysis}
                onUpdateAnalysis={handleUpdateResumeAnalysis}
              />
            )}

            {activeView === 'skill-gap' && (
              <SkillGapAnalyzer
                student={student}
                skillGaps={skillGaps}
                onSelectCareerTarget={handleSelectCareerTarget}
                setCurrentView={setCurrentView}
              />
            )}

            {activeView === 'career-simulator' && (
              <FutureCareerSimulator
                student={student}
                levers={levers}
                onToggleLever={handleToggleLever}
              />
            )}

            {activeView === 'roadmap' && (
              <LearningRoadmap
                student={student}
                roadmapWeeks={roadmapWeeks}
                onToggleTask={handleToggleTask}
                setCurrentView={setCurrentView}
              />
            )}

            {activeView === 'project-matchmaker' && (
              <ProjectMatchmaker
                student={student}
                projects={matchedProjects}
              />
            )}

            {activeView === 'mock-interview' && (
              <MockInterview
                student={student}
                questions={mockQuestions}
                onCompleteInterview={handleCompleteInterview}
              />
            )}

            {activeView === 'ai-mentor' && (
              <AIMentorChat
                student={student}
                setCurrentView={setCurrentView}
                onOpenVoiceMentor={() => setIsVoiceModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Side Chatbot Widget & Voice Mentor - Rendered ONLY after authentication */}
      {student.isOnboarded && (
        <>
          <SideChatWidget
            student={student}
            setCurrentView={setCurrentView}
            onOpenVoiceMentor={() => setIsVoiceModalOpen(true)}
          />

          <VoiceMentorModal
            isOpen={isVoiceModalOpen}
            onClose={() => setIsVoiceModalOpen(false)}
            student={student}
            setCurrentView={setCurrentView}
          />
        </>
      )}
    </div>
  );
}
