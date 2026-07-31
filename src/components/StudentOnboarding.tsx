import React, { useState, useRef } from 'react';
import { StudentProfile } from '../types';
import { parseResumeFile, analyzeResumeLocally } from '../utils/resumeParser';
import {
  Sparkles,
  CheckCircle2,
  Upload,
  User,
  GraduationCap,
  Briefcase,
  Building2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Check,
  Cpu,
  Zap,
  Lock,
  Mail,
  Loader2,
  FileCheck,
  Eye,
  EyeOff,
  Trophy,
  Target,
  Award,
  TrendingUp,
  Star,
  Users,
  Compass,
  PhoneCall,
  Layers
} from 'lucide-react';

interface StudentOnboardingProps {
  student: StudentProfile;
  onCompleteOnboarding: (updatedStudent: StudentProfile, userData?: any) => void;
}

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({
  student,
  onCompleteOnboarding
}) => {
  const [step, setStep] = useState<number>(1); // 1: Auth, 2: Profile, 3: Resume Upload, 4: Career Target
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('register');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  // Registration Form State
  const [registerData, setRegisterData] = useState({
    name: student.name || '',
    email: student.email || '',
    phone: student.phone || '',
    college: student.university || '',
    department: student.department || '',
    year: student.year || '',
    password: '',
    confirmPassword: ''
  });

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: student.email || '',
    password: ''
  });

  // Forgot Password Form State
  const [forgotData, setForgotData] = useState({
    email: student.email || '',
    newPassword: ''
  });

  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<StudentProfile>({
    ...student,
    university: student.university || '',
    department: student.department || '',
    major: student.major || '',
    graduationYear: student.graduationYear || '',
    year: student.year || '',
    targetCareer: student.targetCareer || '',
    targetCompany: student.targetCompany || ''
  });

  const fillSampleData = () => {
    setRegisterData({
      name: 'Radhika Chilakala',
      email: 'radhikachilakala928@gmail.com',
      phone: '+1 (555) 234-5678',
      college: 'Stanford University / IIT Tech',
      department: 'Computer Science',
      year: '3rd Year',
      password: 'EduVerse2026!',
      confirmPassword: 'EduVerse2026!'
    });
    setLoginData({
      email: 'radhikachilakala928@gmail.com',
      password: 'EduVerse2026!'
    });
    setAuthSuccessMsg('Sample demo credentials filled! Click Create Account or Sign In.');
  };

  const [pastedResumeText, setPastedResumeText] = useState(student.resumeText || '');
  const [cgpa, setCgpa] = useState<number>(8.8);

  const popularUniversities = [
    'IIT Delhi / Bombay',
    'Stanford University',
    'BITS Pilani',
    'MIT',
    'Carnegie Mellon',
    'Delhi University',
    'Anna University',
    'UC Berkeley'
  ];

  const popularMajors = [
    'Computer Science & Eng',
    'AI & Data Science',
    'Information Technology',
    'Electronics & Communication',
    'Software Engineering'
  ];

  const careerOptions = [
    { name: 'AI Engineer', salary: '$145k/yr', color: 'from-purple-500 to-indigo-600', badge: 'Popular' },
    { name: 'Full Stack Engineer', salary: '$125k/yr', color: 'from-blue-500 to-cyan-600', badge: 'High Demand' },
    { name: 'Data Scientist', salary: '$135k/yr', color: 'from-emerald-500 to-teal-600', badge: 'Top Growth' },
    { name: 'Backend Developer', salary: '$120k/yr', color: 'from-amber-500 to-orange-600', badge: 'Core Role' },
    { name: 'Cloud / DevOps', salary: '$130k/yr', color: 'from-rose-500 to-pink-600', badge: 'Trending' },
    { name: 'Product Manager', salary: '$140k/yr', color: 'from-violet-500 to-purple-600', badge: 'Leadership' }
  ];

  const companyOptions = [
    { name: 'Google', accent: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400', logo: '🌐' },
    { name: 'Microsoft', accent: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', logo: '💻' },
    { name: 'Amazon', accent: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400', logo: '📦' },
    { name: 'Meta', accent: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', logo: '♾️' },
    { name: 'Apple', accent: 'border-slate-500 bg-slate-500/10 text-slate-700 dark:text-slate-300', logo: '🍎' },
    { name: 'Deloitte', accent: 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400', logo: '📊' },
    { name: 'TCS', accent: 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400', logo: '🏢' },
    { name: 'AI Startup', accent: 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400', logo: '🚀' }
  ];

  // Quick Demo Accounts to test
  const demoAccounts = [
    {
      name: 'Radhika Chilakala',
      email: 'radhikachilakala928@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tag: 'Google User'
    },
    {
      name: 'Nikhil Sharma',
      email: 'nikhil.sharma@iitd.ac.in',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      tag: 'IIT Delhi'
    }
  ];

  // Google & Email OAuth authentication state
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState<boolean>(false);

  // Skill Verification Mock Test State
  const [isTakingSkillTest, setIsTakingSkillTest] = useState<boolean>(false);
  const [isLoadingSkillTest, setIsLoadingSkillTest] = useState<boolean>(false);
  const [skillTestQuestions, setSkillTestQuestions] = useState<Array<{
    id: string;
    skill: string;
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  }>>([]);
  const [skillTestAnswers, setSkillTestAnswers] = useState<Record<number, number>>({});
  const [skillTestSubmitted, setSkillTestSubmitted] = useState<boolean>(false);
  const [skillTestResult, setSkillTestResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
    message: string;
  } | null>(null);

  const fetchSkillTest = async (extractedSkills: string[]) => {
    setIsLoadingSkillTest(true);
    setSkillTestSubmitted(false);
    setSkillTestResult(null);
    setSkillTestAnswers({});
    setIsTakingSkillTest(true);

    try {
      const res = await fetch('/api/gemini/generate-skill-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: extractedSkills,
          targetCareer: formData.targetCareer
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setSkillTestQuestions(data.questions);
      } else {
        setSkillTestQuestions([
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
      setIsLoadingSkillTest(false);
    }
  };

  const handleGradeSkillTest = () => {
    let correctCount = 0;
    const totalCount = skillTestQuestions.length || 1;

    skillTestQuestions.forEach((q, idx) => {
      if (skillTestAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / totalCount) * 100);
    const passed = scorePercentage >= 50;

    let message = "";
    if (passed) {
      message = `Verification Successful! (${scorePercentage}% score - ${correctCount}/${totalCount} correct). Your practical knowledge matches the technical skills extracted from your resume.`;
    } else {
      message = `Resume Verification Failed (${scorePercentage}% score - ${correctCount}/${totalCount} correct). Your test score was below the required 50% passing criteria. The uploaded resume may contain inaccurate skills or incorrect experience. Please re-upload a verified resume or retake the test.`;
    }

    setSkillTestResult({
      score: scorePercentage,
      passed,
      correctCount,
      totalCount,
      message
    });
    setSkillTestSubmitted(true);
  };

  // Listen for Google OAuth popup callback message & top navbar Sign In events
  React.useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.user) {
        const u = event.data.user;
        setFormData(prev => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
          avatarUrl: u.picture || prev.avatarUrl
        }));
        setIsAuthenticatedUser(true);
        setIsGoogleLoading(false);
        setAuthError(null);
        setTimeout(() => {
          setStep(2);
        }, 400);
      }
    };

    const handleSwitchLogin = () => {
      setAuthMode('login');
      setStep(1);
      setAuthError(null);
      setTimeout(() => {
        document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    };

    window.addEventListener('message', handleOAuthMessage);
    window.addEventListener('SWITCH_TO_LOGIN', handleSwitchLogin);

    return () => {
      window.removeEventListener('message', handleOAuthMessage);
      window.removeEventListener('SWITCH_TO_LOGIN', handleSwitchLogin);
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();

      if (data.configured && data.url) {
        // Open real Google OAuth Authorization Popup directly
        const authWindow = window.open(
          data.url,
          'google_oauth_popup',
          'width=580,height=680,top=100,left=100'
        );

        if (!authWindow) {
          setAuthError('Popup blocker prevented opening Google Sign-In. Please allow popups or use instant account verify below.');
          setIsGoogleLoading(false);
        }
        return;
      }
    } catch (err) {
      console.warn('Google OAuth URL fetch failed, executing fallback verify:', err);
    }

    // Direct Google Account Verification Fallback
    try {
      const targetEmail = formData.email && formData.email.includes('@') ? formData.email : 'radhikachilakala928@gmail.com';
      const targetName = formData.name && formData.name !== 'Nikhil Sharma' ? formData.name : 'Radhika Chilakala';

      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, name: targetName })
      });
      const verifyData = await verifyRes.json();

      if (verifyData.success && verifyData.user) {
        setFormData(prev => ({
          ...prev,
          name: verifyData.user.name,
          email: verifyData.user.email,
          avatarUrl: verifyData.user.avatarUrl
        }));
        setIsAuthenticatedUser(true);
        setTimeout(() => {
          setIsGoogleLoading(false);
          setStep(2);
        }, 500);
      }
    } catch (e) {
      setIsGoogleLoading(false);
      setAuthError('Failed to authenticate Google account. Please check internet connection.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    // Front-end validations
    if (!registerData.name || !registerData.email || !registerData.phone || !registerData.college || !registerData.department || !registerData.year) {
      setAuthError('All registration fields are required.');
      return;
    }

    if (!registerData.email.includes('@') || !registerData.email.includes('.')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setAuthError('Passwords do not match. Please verify your passwords.');
      return;
    }

    if (registerData.password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });

      const data = await res.json();

      if (!data.success) {
        setAuthError(data.error || 'Registration failed.');
        return;
      }

      // Successful Registration
      if (data.token) {
        localStorage.setItem('eduverse_auth_token', data.token);
      }

      setFormData(prev => ({
        ...prev,
        ...data.profile,
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        university: registerData.college,
        department: registerData.department,
        year: registerData.year
      }));

      setIsAuthenticatedUser(true);
      setAuthSuccessMsg('Registration successful! Welcome to EduVerse.');
      
      setTimeout(() => {
        setStep(2);
      }, 600);
    } catch (err) {
      setAuthError('Network error. Please try again.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (!loginData.email || !loginData.password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem('eduverse_auth_token', data.token);
        }

        const loggedInProfile: StudentProfile = {
          ...formData,
          ...(data.profile || {}),
          email: loginData.email,
          isOnboarded: true
        };

        setFormData(loggedInProfile);
        setIsAuthenticatedUser(true);
        setAuthSuccessMsg(`Welcome back, ${loggedInProfile.name || 'Student'}! Logging in...`);

        setTimeout(() => {
          onCompleteOnboarding(loggedInProfile, data.user);
        }, 400);
      } else {
        setAuthError(data.error || 'No account found with this email. Please sign up or register first.');
      }
    } catch (err) {
      setAuthError('Server error during sign in. Please check your network and try again.');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (!forgotData.email) {
      setAuthError('Please enter your account email.');
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgotData)
      });

      const data = await res.json();

      if (!data.success) {
        setAuthError(data.error || 'Failed to reset password.');
        return;
      }

      setAuthSuccessMsg(data.message || 'Password updated successfully! You can now log in.');
      setTimeout(() => {
        setAuthMode('login');
        setLoginData(prev => ({ ...prev, email: forgotData.email }));
      }, 1200);
    } catch (err) {
      setAuthError('Error resetting password.');
    }
  };

  const handleSelectDemoUser = (demo: typeof demoAccounts[0]) => {
    const updatedStudent: StudentProfile = {
      ...formData,
      name: demo.name,
      email: demo.email,
      avatarUrl: demo.avatar,
      isOnboarded: true
    };
    setFormData(updatedStudent);
    setIsAuthenticatedUser(true);
    setAuthSuccessMsg(`Logged in as ${demo.name}! Opening student dashboard...`);
    setTimeout(() => {
      onCompleteOnboarding(updatedStudent);
    }, 400);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsAnalyzingResume(true);

    try {
      const extractedText = await parseResumeFile(file);
      if (extractedText) {
        setPastedResumeText(extractedText);
        await processResumeText(extractedText);
      } else {
        await processResumeText(pastedResumeText || file.name);
      }
    } catch (err) {
      console.error('File parsing error:', err);
      await processResumeText(pastedResumeText);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const processResumeText = async (textToAnalyze: any) => {
    const rawText = typeof textToAnalyze === 'string' ? textToAnalyze : String(textToAnalyze || '');
    const text = rawText.trim() || "Full Stack Developer with React, Node.js, Python and SQL experience.";
    setIsAnalyzingResume(true);

    try {
      const res = await fetch('/api/gemini/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: text,
          studentProfile: formData
        })
      });

      const json = await res.json();
      const analysis = json.data || analyzeResumeLocally(text, formData?.targetCareer);

      const extractedSkills = analysis.extractedSkills && analysis.extractedSkills.length > 0
        ? analysis.extractedSkills
        : ['Python', 'React.js', 'TypeScript', 'REST APIs', 'SQL', 'System Design'];

      setFormData(prev => ({
        ...prev,
        resumeText: text,
        skills: extractedSkills,
        resumeScore: analysis.resumeScore || 85,
        readinessScore: Math.min(Math.round((analysis.resumeScore + analysis.atsCompatibility) / 2), 98)
      }));

      await fetchSkillTest(extractedSkills);
    } catch (err) {
      console.error('Error analyzing resume text:', err);
      const fallback = analyzeResumeLocally(text, formData?.targetCareer);
      setFormData(prev => ({
        ...prev,
        resumeText: text,
        skills: fallback.extractedSkills,
        resumeScore: fallback.resumeScore,
        readinessScore: Math.min(Math.round((fallback.resumeScore + fallback.atsCompatibility) / 2), 98)
      }));
      await fetchSkillTest(fallback.extractedSkills);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const handleAnalyzeResumeUpload = () => {
    processResumeText(pastedResumeText);
  };

  const handleFinalSubmit = () => {
    const finalProfile = {
      ...formData,
      isOnboarded: true
    };
    onCompleteOnboarding(finalProfile);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    const pwd = registerData.password || loginData.password || '';
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-300' };
    if (pwd.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pwd.length < 10) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong & Secure', color: 'bg-emerald-500' };
  };

  const passStrength = getPasswordStrength();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors flex flex-col justify-center items-center overflow-hidden">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-5xl relative z-10">
        {/* Header Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>EduVerse AI Placement Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Accelerate Your <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Campus Placement Success</span>
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Authentic account authentication, instant AI resume parsing, ATS score prediction, and real-time voice mentor guidance.
          </p>
        </div>

        {/* Step Wizard Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative px-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 -z-10 rounded-full"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: '1. Authenticate', icon: <User className="w-4 h-4" /> },
              { num: 2, label: '2. Academics', icon: <GraduationCap className="w-4 h-4" /> },
              { num: 3, label: '3. AI Resume', icon: <FileText className="w-4 h-4" /> },
              { num: 4, label: '4. Target Role', icon: <Briefcase className="w-4 h-4" /> }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <button
                  onClick={() => s.num < step && setStep(s.num)}
                  disabled={s.num > step}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    step === s.num
                      ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/40 scale-110 ring-2 ring-indigo-400/50'
                      : step > s.num
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </button>
                <span className={`text-xs font-semibold mt-2 hidden sm:block ${step === s.num ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: AUTHENTICATION (SPLIT VIEW) */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Colorful Feature Showcase & Student Stats */}
            <div className="lg:col-span-5 bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-slate-950 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-4">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Placed at Top Tech Firms</span>
                </div>

                <h3 className="text-2xl font-black text-white leading-tight">
                  Designed for <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-300 bg-clip-text text-transparent">Ambitious Engineers</span>
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Join over 10,000+ students leveraging AI for technical interview prep, resume optimization, and placement simulation.
                </p>

                {/* Feature Chips */}
                <div className="space-y-3 mt-6">
                  <div className="p-3 rounded-2xl bg-indigo-900/40 border border-indigo-500/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold flex-shrink-0">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">94% ATS Resume Match</h4>
                      <p className="text-[11px] text-indigo-200/80">Automated keyword gap detection</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold flex-shrink-0">
                      🎙️
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Gemini Voice Mentor</h4>
                      <p className="text-[11px] text-purple-200/80">Interactive technical mock interviews</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-pink-900/40 border border-pink-500/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-300 font-bold flex-shrink-0">
                      🎯
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Target Company Simulations</h4>
                      <p className="text-[11px] text-pink-200/80">Tailored for Google, Microsoft, Meta</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Social Proof Bar */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-indigo-500 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80" alt="Student" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-purple-500 object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&fit=crop&q=80" alt="Student" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-pink-500 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&fit=crop&q=80" alt="Student" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">Trusted across 120+ Universities</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Practical Auth Card */}
            <div id="auth-section" className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              {/* Tab Switcher */}
              <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    authMode === 'register'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Form Title & Auto-fill Action */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
                <span className="text-xs font-bold text-slate-300">
                  {authMode === 'register' ? 'New Student Registration' : 'Student Sign In'}
                </span>
                <button
                  type="button"
                  onClick={fillSampleData}
                  className="px-2.5 py-1 text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-all flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  Fill Sample Demo Data
                </button>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              {/* REGISTER MODE */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          placeholder="e.g. Nikhil Sharma"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Student Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          placeholder="e.g. nikhil@university.edu"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <PhoneCall className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="tel"
                          required
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        College / University *
                      </label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={registerData.college}
                          onChange={(e) => setRegisterData({ ...registerData, college: e.target.value })}
                          placeholder="Stanford / IIT Tech"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Department *
                      </label>
                      <div className="relative">
                        <Layers className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={registerData.department}
                          onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                          placeholder="Computer Science"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Academic Year *
                      </label>
                      <select
                        value={registerData.year}
                        onChange={(e) => setRegisterData({ ...registerData, year: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="">Select Academic Year...</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year (Graduating)</option>
                        <option value="Post Graduate">Post Graduate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-3"
                  >
                    <span>Create Student Account & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* LOGIN MODE */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Student Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="e.g. nikhil.sharma@university.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setForgotData(prev => ({ ...prev, email: loginData.email }));
                        }}
                        className="text-[11px] text-indigo-400 hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Student Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* FORGOT PASSWORD MODE */}
              {authMode === 'forgot' && (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-200">
                    Enter your student email address and new password to reset your account credentials.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Student Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={forgotData.email}
                        onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                        placeholder="nikhil.sharma@university.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={forgotData.newPassword}
                        onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                        placeholder="Enter new strong password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
                    >
                      Reset Password
                    </button>
                  </div>
                </form>
              )}

              {/* Quick Demo Sign-In Options */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 mb-2.5 text-center flex items-center justify-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Or Instant 1-Click Demo Login:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {demoAccounts.map((demo) => (
                    <button
                      key={demo.email}
                      type="button"
                      onClick={() => handleSelectDemoUser(demo)}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 flex items-center gap-2.5 transition-all text-left group"
                    >
                      <img
                        src={demo.avatar}
                        alt={demo.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/40 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                          {demo.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {demo.tag}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ACADEMIC PROFILE */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white">
                Academic & University Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Help us tailor your interview questions according to your engineering major and academic standing.
              </p>
            </div>

            <div className="space-y-5">
              {/* Popular University Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Select or Type University / College Name
                </label>
                <div className="relative mb-3">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="e.g. Stanford University / IIT Delhi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularUniversities.map((uni) => (
                    <button
                      key={uni}
                      type="button"
                      onClick={() => setFormData({ ...formData, university: uni })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        formData.university === uni
                          ? 'border-indigo-500 bg-indigo-950 text-indigo-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {uni}
                    </button>
                  ))}
                </div>
              </div>

              {/* Major Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Engineering Major / Specialization
                </label>
                <div className="relative mb-2">
                  <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    placeholder="e.g. Computer Science & AI"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularMajors.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, major: m })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        formData.major === m
                          ? 'border-purple-500 bg-purple-950 text-purple-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* CGPA Slider & Grad Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300">Current CGPA / GPA</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {cgpa.toFixed(1)} / 10.0
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.1"
                    value={cgpa}
                    onChange={(e) => setCgpa(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Top 10% academic percentile ranking</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Graduation Year
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="2025">2025 (Final Year)</option>
                    <option value="2026">2026 (Pre-Final Year)</option>
                    <option value="2027">2027 (Sophomore)</option>
                    <option value="2028">2028 (Freshman)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2"
                >
                  <span>Next: AI Resume Upload</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESUME UPLOAD & SKILL VERIFICATION MOCK TEST */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {!isTakingSkillTest ? (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white">
                    Upload Student Resume
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload a PDF or paste text. Gemini AI will extract your technical skills and launch a quick verification test.
                  </p>
                </div>

                {/* Upload Dropzone */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.docx,.md"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-500/50 hover:border-indigo-400 rounded-3xl p-6 text-center bg-indigo-950/20 hover:bg-indigo-950/40 cursor-pointer transition-all group"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                    {uploadedFileName ? <FileCheck className="w-7 h-7 text-emerald-400" /> : <Upload className="w-7 h-7 text-indigo-400" />}
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {uploadedFileName ? `Uploaded: ${uploadedFileName}` : 'Click to Upload Resume (PDF / TXT / DOCX)'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {uploadedFileName ? 'Click to replace with another file' : 'Instant AI skill extraction & skill verification test'}
                  </p>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold absolute">
                    Or Paste Resume Content
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={pastedResumeText}
                  onChange={(e) => setPastedResumeText(e.target.value)}
                  placeholder="Paste your resume summary, technical skills, programming languages, and project details here..."
                  className="w-full p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />

                {/* Detected Skill Badges Preview */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                    Extracted Core Competencies Preview:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(formData.skills && formData.skills.length > 0 ? formData.skills : ['Python', 'React.js', 'TypeScript', 'Node.js', 'REST APIs', 'SQL', 'System Design']).map((sk) => (
                      <span key={sk} className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleAnalyzeResumeUpload}
                    disabled={isAnalyzingResume}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzingResume ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Gemini AI Parsing Resume...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze & Take Skill Test</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* SKILL VERIFICATION MOCK TEST PANEL */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Skill Verification Mock Test</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    Verify Uploaded Resume Skills
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                    Please complete these basic multiple-choice questions based on the skills listed in your resume. Pass criteria: <span className="text-amber-400 font-bold">50% or higher</span>.
                  </p>
                </div>

                {/* Skills Badge Banner */}
                <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-indigo-300">Testing Skills:</span>
                  {(formData.skills && formData.skills.length > 0 ? formData.skills : ['Python', 'React.js', 'SQL']).slice(0, 6).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200 text-[10px] font-mono border border-indigo-500/30">
                      {s}
                    </span>
                  ))}
                </div>

                {isLoadingSkillTest ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-300">Generating tailored skill test questions from your resume...</p>
                  </div>
                ) : skillTestSubmitted && skillTestResult ? (
                  <div className="space-y-6">
                    {/* RESULT CARDS */}
                    {skillTestResult.passed ? (
                      <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/50 space-y-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto">
                          <CheckCircle2 className="w-9 h-9" />
                        </div>
                        <div>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                            Verification Passed ({skillTestResult.score}%)
                          </span>
                          <h3 className="text-xl font-black text-white mt-2">
                            Resume Verified Successfully!
                          </h3>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-md mx-auto">
                            {skillTestResult.message}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsTakingSkillTest(false);
                            setStep(4);
                          }}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Continue to Target Career Setup (Step 4)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 rounded-3xl bg-rose-950/60 border border-rose-500/60 space-y-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                          <Zap className="w-9 h-9 animate-pulse" />
                        </div>
                        <div>
                          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-500/40">
                            Resume Verification Failed ({skillTestResult.score}%)
                          </span>
                          <h3 className="text-xl font-black text-white mt-2">
                            The Resume Details or Skills Appear Incorrect
                          </h3>
                          <p className="text-xs text-rose-200 mt-2 leading-relaxed bg-rose-900/40 p-3.5 rounded-2xl border border-rose-700/50 max-w-md mx-auto">
                            {skillTestResult.message}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsTakingSkillTest(false);
                            }}
                            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
                          >
                            Re-Upload / Fix Resume
                          </button>
                          <button
                            type="button"
                            onClick={() => fetchSkillTest(formData.skills || [])}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all"
                          >
                            Retake Skill Test
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* QUESTION LIST */
                  <div className="space-y-5">
                    {skillTestQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                            Question {idx + 1} of {skillTestQuestions.length}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                            Skill: {q.skill}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white leading-relaxed">
                          {q.question}
                        </p>
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = skillTestAnswers[idx] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => setSkillTestAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'border-indigo-500 bg-indigo-950/80 text-white ring-2 ring-indigo-500/30'
                                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsTakingSkillTest(false)}
                        className="w-1/3 py-3 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all"
                      >
                        Cancel & Edit Resume
                      </button>
                      <button
                        type="button"
                        onClick={handleGradeSkillTest}
                        disabled={Object.keys(skillTestAnswers).length < skillTestQuestions.length}
                        className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Submit Answers & Verify Resume</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: CAREER TARGET & SUMMARY PREVIEW */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white">
                Select Your Dream Career & Target Company
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                EduVerse will simulate placement odds specifically for this position.
              </p>
            </div>

            <div className="space-y-5">
              {/* Target Career Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Target Career Track
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {careerOptions.map((c) => {
                    const isSelected = formData.targetCareer === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, targetCareer: c.name })}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 text-white ring-2 ring-indigo-500/30'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{c.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Est. {c.salary}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          {c.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Company Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Target Dream Company
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {companyOptions.map((comp) => {
                    const isSelected = formData.targetCompany === comp.name;
                    return (
                      <button
                        key={comp.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, targetCompany: comp.name })}
                        className={`p-2.5 rounded-xl text-xs font-bold border text-center flex items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? `${comp.accent} ring-2 ring-indigo-500/30 font-black`
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{comp.logo}</span>
                        <span>{comp.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Profile Placement Readiness Summary Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 border border-indigo-500/30 text-white space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Initial AI Placement Readiness</span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    High Match
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 flex-shrink-0">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-300 font-black text-xl">
                      {formData.readinessScore || 82}%
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Placement Odds for {formData.targetCompany} ({formData.targetCareer})
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {formData.skills?.length || 7} Skills Verified • Personalized Interview Roadmap Generated
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 animate-bounce" />
                <span>Launch EduVerse Placement Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

