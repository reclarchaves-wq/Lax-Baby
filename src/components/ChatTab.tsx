import React, { useState, useEffect, useRef } from 'react';
import { SIR_LAX_AVATAR } from '../data/mockData';
import { ChatMessage, GradeLevel, LanguageMode, ModeType } from '../types';
import { sendChatMessage } from '../services/chatService';
import { SpeechService } from '../services/speechService';
import confetti from 'canvas-confetti';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  WifiOff,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Scissors,
  Calculator,
  GraduationCap,
  BookOpen,
  Sun,
  Globe,
  Maximize2,
  Minimize2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Dices,
  Atom,
  Cpu,
  Brain,
  Compass,
  FileText,
  CheckSquare,
  HardDrive,
  ExternalLink,
  Loader2,
  X,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  createGoogleDoc,
  createGoogleTask,
  saveTextFileToDrive,
} from '../services/workspaceService';
import { saveChatMessageToFirestore } from '../services/firebase';

interface ChatTabProps {
  language: LanguageMode;
  fontSize: 'normal' | 'large' | 'huge';
  isForceOffline: boolean;
  onSolveHomework?: () => void;
  user?: User | null;
  onOpenWorkspace?: () => void;
  onSignIn?: () => void;
}

// Universal "Under The Sun" knowledge bank spanning every possible question an AI can answer
export const UNIVERSAL_UNDER_THE_SUN_LIBRARY = [
  // Space, Cosmos & Physics
  'Why is the sky blue and the sunset red?',
  'What are black holes and what happens if something falls inside?',
  'How do heavy metal airplanes stay up in the sky without falling?',
  'How did the universe begin, and what was there before the Big Bang?',
  'Is time travel mathematically possible according to Einstein?',
  'Why does the moon have craters and how does it control ocean tides?',
  'Could humans live on Mars or Jupiter’s moon Europa?',
  // Technology, AI & Coding
  'How do artificial intelligence neural networks actually learn?',
  'How does the internet travel under deep oceans through fiber optic cables?',
  'How does a computer processor execute billions of calculations per second?',
  'Write a simple beginner Python script to calculate student grades',
  'What is quantum computing and how will it change the world?',
  // Deep Science & Biology
  'How does DNA store the complete blueprint for all human life?',
  'Why do we dream when we sleep, and what do dreams mean?',
  'Why is ocean sea water so salty while river and rain water is fresh?',
  'How does the human brain store and recall memories?',
  'Explain quantum entanglement in simple everyday words',
  'Why do leaves turn green with chlorophyll and yellow in autumn?',
  // Practical World & Daily Life
  'How to budget a ₱100 daily school allowance with the 3-envelope rule?',
  'Teach me a nutritious ₱25 healthy meal recipe with egg and malunggay',
  'How can a student get a free First-Time Jobseeker Barangay Clearance?',
  'What are 5 essential psychological tips for winning your first job interview?',
  'How does electricity safely travel into our wall sockets at home?',
  'How to fix a slow internet Wi-Fi connection at home',
  // Philosophy, Mind & Human Psychology
  'What is Stoicism and how can it help us endure hard days?',
  'How do I overcome procrastination and build unbreakable discipline?',
  'Why did humans invent money, and what gives paper bills their value?',
  'Why do we feel anxiety, and what is the fastest way to calm our mind?',
  'What is the meaning of life according to great philosophers?',
  // Academics, History & Mathematics
  'Explain Photosynthesis in baby words with sunlight and water',
  'Solve 48 × 15 step-by-step using simple baskets of mangoes',
  'Why is Dr. Jose Rizal honored as our Philippine national hero?',
  'What caused the fall of the ancient Roman Empire in simple words?',
  'How does compound interest make money multiply over time?',
  // DIY & Inventions
  'How to build a bubbling volcano using zero money (vinegar & soil)',
  'Make a self-watering desk planter from a discarded soda bottle',
  'Build a cardboard shoebox solar water heater for washing',
];

// Rich categorized starter prompts across academics, practical world, and anything under the sun
const CATEGORY_PROMPTS = [
  {
    category: '☀️ Under The Sun (Universal AI)',
    mode: 'anything' as ModeType,
    icon: Sun,
    color: 'from-amber-500 to-yellow-500',
    description: 'ChatGPT & Dola AI universal intelligence: Ask absolutely anything in the world',
    prompts: [
      'Why is the sky blue and the sunset red?',
      'What are black holes and what happens inside them?',
      'How do heavy metal airplanes stay up in the sky?',
      'How does the internet travel under deep oceans?',
      'How do neural networks and AI models learn?',
      'Why do humans dream when we sleep?',
      'Is time travel theoretically possible according to physics?',
      'Why is ocean sea water so salty?',
    ],
  },
  {
    category: '✍️ Write & Code (Like ChatGPT)',
    mode: 'anything' as ModeType,
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-600',
    description: 'Essays, speeches, programming code, excuse letters, and creative writing',
    prompts: [
      'Write an inspiring 3-paragraph speech about education breaking poverty',
      'Write a simple beginner Python program to calculate school grades',
      'Draft a polite excuse letter to my teacher for missing class yesterday',
      'Write a touching poem about hardworking parents in simple English',
      'Translate this paragraph into formal, professional English for a job',
      'Debug this code and explain why errors happen in simple words',
    ],
  },
  {
    category: '📅 Plan & Routine (Like Dola AI)',
    mode: 'practical' as ModeType,
    icon: Compass,
    color: 'from-emerald-500 to-teal-600',
    description: 'Personal assistant: 7-day study timetables, daily routines, focus habits',
    prompts: [
      'Create a 7-day exam study timetable for a busy working student',
      'Help me design a productive daily routine from 6:00 AM to 10:00 PM',
      'Break down a 10-page research paper into 5 easy daily milestones',
      'Give me an anti-procrastination daily checklist to stay focused',
      'How to organize a weekly budget and meal schedule on ₱500',
    ],
  },
  {
    category: '📚 Academics & Homework',
    mode: 'academics' as ModeType,
    icon: BookOpen,
    color: 'from-sky-500 to-blue-600',
    description: 'Math, Science, English, Filipino, History, Chemistry & Physics',
    prompts: [
      'Explain Photosynthesis in baby words with sunlight and water',
      'Solve 48 × 15 step-by-step using simple baskets of mangoes',
      'What is the difference between "their", "there", and "they\'re"?',
      'Why is Dr. Jose Rizal honored as our Philippine national hero?',
      'How do electric circuits work with batteries and wires?',
      'What are the 3 states of matter: solid, liquid, gas?',
    ],
  },
  {
    category: '🌍 Practical World & Life Skills',
    mode: 'practical' as ModeType,
    icon: Globe,
    color: 'from-emerald-500 to-teal-600',
    description: 'Budgeting allowance, healthy tipid meals, IDs, interview tips, daily safety',
    prompts: [
      'How do I budget a ₱100 daily school allowance with the 3-envelope rule?',
      'Teach me a nutritious ₱25 healthy meal recipe with egg and rice',
      'How can a student get a free First-Time Jobseeker Barangay Clearance?',
      'What should I say in my first job or scholarship interview?',
      'Basic electrical safety rules every kid and teen must know at home',
      'How to open a student savings bank account or digital piggy bank?',
    ],
  },
  {
    category: '🛠️ DIY Projects & Inventions',
    mode: 'diy' as ModeType,
    icon: Scissors,
    color: 'from-orange-500 to-amber-600',
    description: 'Zero-cost science experiments and crafts from recycled trash',
    prompts: [
      'How to build a bubbling volcano using zero money (vinegar & soil)',
      'Make a self-watering desk planter from a discarded soda bottle',
      'Build a cardboard shoebox solar water heater for washing',
      'DIY homemade sturdy desk pencil organizer from paper rolls',
    ],
  },
  {
    category: '🎓 College & Future Career',
    mode: 'college' as ModeType,
    icon: GraduationCap,
    color: 'from-purple-500 to-indigo-600',
    description: 'Thesis guidance, dorm tips, working-student hacks, scholarships',
    prompts: [
      'How to survive college exams on a ₱50 daily food budget?',
      'How do I write an effective Thesis Statement without stress?',
      'Where can underprivileged students find legitimate college scholarships?',
      'Time management tips for a working student balancing night shift and class',
    ],
  },
  {
    category: '🎮 Interactive Quiz & Games',
    mode: 'interactive' as ModeType,
    icon: Sparkles,
    color: 'from-pink-500 to-rose-600',
    description: 'Fun quizzes, brain teasers, and friendly challenge rounds',
    prompts: [
      'Quiz me on the planets of our Solar System!',
      'Give me a 3-question Grade 2 math puzzle challenge',
      'Test my English polite manners and greetings vocabulary',
      'Give me a fun science riddle about animals',
    ],
  },
];

export const ChatTab: React.FC<ChatTabProps> = ({
  language,
  fontSize,
  isForceOffline,
  onSolveHomework,
  user,
  onOpenWorkspace,
  onSignIn,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello anak! I am **Sir Lax**, your friendly teacher, kuya, and universal AI companion! 🌟\n\nRemember our golden motto: **"EDUCATION IS THE KEY FOR CHANGE!"** 🇵🇭\n\nThink of me like **ChatGPT and Dola AI combined**, but with the patient, loving heart of a dedicated community teacher who believes in you! Through our **"Under The Sun"** engine, you can ask or do **ANYTHING**:\n\n• ✍️ **Write & Create (Like ChatGPT):** Draft school essays, poems, speech writing, debate points, or polite excuse letters.\n• 💻 **Code & Tech:** Write Python/JavaScript programs, fix bugs, learn web coding, and understand algorithms.\n• 📅 **Plan & Organize (Like Dola AI):** Build 7-day study timetables, daily routines, prioritize homework, and crush procrastination.\n• ☀️ **Universal Curiosities:** Black holes, quantum physics, why the sky is blue, deep ocean internet cables, philosophy, animal wonders.\n• 📚 **Academics & Math:** Step-by-step math with mangoes, science, physics, chemistry, biology, grammar.\n• 🌍 **Practical Life Skills:** Budgeting daily allowance, cooking ₱25 healthy meals, getting free government IDs, job interviews.\n\nTap **"🎲 Surprise Me"** or tap the **Microphone 🎙️** to speak. What shall we learn, write, or plan today? 🍎✏️`,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Create a 7-day exam study timetable for me (Dola AI style)',
        'Write an inspiring 3-paragraph essay on education (ChatGPT style)',
        'Why is the sky blue and the sunset red?',
        'How to budget a ₱100 daily school allowance?',
        'Write a beginner Python program for student grades',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ModeType>('anything');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('grade-1');
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showInspirations, setShowInspirations] = useState(true);
  const [isExpandedStage, setIsExpandedStage] = useState(false);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState(0);

  // Google Workspace 1-Click Export States
  const [exportingDocId, setExportingDocId] = useState<string | null>(null);
  const [exportingDriveId, setExportingDriveId] = useState<string | null>(null);
  const [exportingTaskId, setExportingTaskId] = useState<string | null>(null);
  const [workspaceToast, setWorkspaceToast] = useState<{ text: string; link?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleExportToGoogleDoc = async (msgId: string, text: string) => {
    if (!user) {
      if (window.confirm('Sign in with Google Workspace to save Sir Lax’s lesson notes directly to Google Docs. Would you like to sign in now?')) {
        if (onSignIn) onSignIn();
      }
      return;
    }
    if (!window.confirm('Create a new Google Doc with this lesson summary in your Google Drive?')) {
      return;
    }
    setExportingDocId(msgId);
    try {
      const firstLine = text.split('\n')[0].replace(/[*#_]/g, '').trim().slice(0, 40) || 'Study Notes';
      const res = await createGoogleDoc(`Notes - ${firstLine}`, text);
      setWorkspaceToast({
        text: 'Successfully exported to Google Docs!',
        link: res.url,
      });
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#4285F4', '#34A853', '#FBBC05'] });
      } catch (_) {}
    } catch (err: any) {
      alert(err?.message || 'Failed to export to Google Docs');
    } finally {
      setExportingDocId(null);
    }
  };

  const handleSaveToDrive = async (msgId: string, text: string) => {
    if (!user) {
      if (window.confirm('Sign in with Google Workspace to save study notes directly to Google Drive. Would you like to sign in now?')) {
        if (onSignIn) onSignIn();
      }
      return;
    }
    if (!window.confirm('Save this study material as a text file in your Google Drive?')) {
      return;
    }
    setExportingDriveId(msgId);
    try {
      const res = await saveTextFileToDrive(`Sir_Lax_Lesson_${Date.now()}`, text);
      setWorkspaceToast({
        text: 'Saved file to Google Drive!',
        link: res.webViewLink || 'https://drive.google.com',
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to save to Google Drive');
    } finally {
      setExportingDriveId(null);
    }
  };

  const handleAddToGoogleTasks = async (msgId: string, text: string) => {
    if (!user) {
      if (window.confirm('Sign in with Google Workspace to manage study tasks. Would you like to sign in now?')) {
        if (onSignIn) onSignIn();
      }
      return;
    }
    if (!window.confirm('Add this study objective or homework reminder to your Google Tasks?')) {
      return;
    }
    setExportingTaskId(msgId);
    try {
      const cleanTitle = text.split('\n')[0].replace(/[#*]/g, '').trim().slice(0, 50) || 'Study with Sir Lax';
      await createGoogleTask(cleanTitle, text);
      setWorkspaceToast({
        text: 'Task successfully added to Google Tasks!',
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to add to Google Tasks');
    } finally {
      setExportingTaskId(null);
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      SpeechService.stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#fbbf24', '#8b5cf6'],
      });
    } catch (_) {}
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    SpeechService.stopSpeaking();
    setActiveSpeechId(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (user?.uid) {
      saveChatMessageToFirestore(user.uid, userMsg, mode, gradeLevel);
    }

    try {
      const response = await sendChatMessage(
        text,
        mode,
        gradeLevel,
        language,
        [...messages, userMsg],
        isForceOffline
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOffline: response.isOffline,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (user?.uid) {
        saveChatMessageToFirestore(user.uid, botMsg, mode, gradeLevel);
      }

      // If user asked a math problem, science, diy, or practical question, reward learning effort!
      const lower = text.toLowerCase();
      if (
        lower.includes('+') ||
        lower.includes('-') ||
        lower.includes('*') ||
        lower.includes('/') ||
        lower.includes('solve') ||
        lower.includes('diy') ||
        lower.includes('homework') ||
        lower.includes('budget') ||
        lower.includes('sky') ||
        lower.includes('why')
      ) {
        triggerConfetti();
        if (onSolveHomework) onSolveHomework();
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pick a random question from universal library
  const handleSurpriseMe = () => {
    const randomQ =
      UNIVERSAL_UNDER_THE_SUN_LIBRARY[
        Math.floor(Math.random() * UNIVERSAL_UNDER_THE_SUN_LIBRARY.length)
      ];
    setInput(randomQ);
    inputRef.current?.focus();

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'],
      });
    } catch (_) {}
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!SpeechService.isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = SpeechService.createSpeechRecognition(
        (transcript: string) => {
          setInput(transcript);
          setIsListening(false);
          handleSend(transcript);
        },
        () => setIsListening(false),
        (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        }
      );

      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      }
    } catch (err) {
      console.error('Error starting recognition:', err);
      setIsListening(false);
    }
  };

  // Speak bot response aloud
  const handleSpeak = (msgId: string, text: string) => {
    if (activeSpeechId === msgId) {
      SpeechService.stopSpeaking();
      setActiveSpeechId(null);
      return;
    }

    setActiveSpeechId(msgId);
    SpeechService.speak(
      text,
      () => setActiveSpeechId(msgId),
      () => setActiveSpeechId(null),
      () => setActiveSpeechId(null)
    );
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear your chat conversation with Sir Lax and start fresh?')) {
      SpeechService.stopSpeaking();
      setActiveSpeechId(null);
      setMessages([
        {
          id: 'welcome-reset',
          sender: 'bot',
          text: `Welcome back anak! Clean slate! 🌟 With our **"Under The Sun"** universal engine, you can ask literally ANY question an AI can answer—science, coding, everyday world, emotions, or academics. I am ready! ☀️🇵🇭`,
          timestamp: 'Just now',
          suggestedFollowUps: [
            'Why is the sky blue and the sunset red?',
            'What are black holes and what happens inside them?',
            'How to budget a ₱100 daily school allowance?',
            'How do heavy metal airplanes stay up in the sky?',
          ],
        },
      ]);
    }
  };

  const getFontSizeClass = () => {
    if (fontSize === 'huge') return 'text-lg sm:text-xl';
    if (fontSize === 'large') return 'text-base sm:text-lg';
    return 'text-sm sm:text-base';
  };

  return (
    <div
      className={`flex flex-col transition-all duration-300 mx-auto my-2 rounded-3xl bg-white shadow-xl border-2 border-amber-300 overflow-hidden ${
        isExpandedStage
          ? 'fixed inset-2 z-50 max-w-none h-[calc(100vh-16px)] my-0'
          : 'w-full max-w-6xl h-[calc(100vh-140px)] min-h-[660px] lg:min-h-[740px]'
      }`}
    >
      {/* =========================================================================
          HERO & VISIBILITY BANNER: CHAT SIR LAX - ASK ANYTHING UNDER THE SUN
          ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-3 sm:p-4 text-stone-900 border-b-2 border-amber-400 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Avatar & Title info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
                <img
                  src={SIR_LAX_AVATAR}
                  alt="Sir Lax - AI Tutor"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black text-amber-950 tracking-tight font-['Fredoka',sans-serif] flex items-center gap-2 flex-wrap">
                  <span>Chat Sir Lax</span>
                  <span className="text-xs sm:text-sm font-black bg-stone-950 text-yellow-300 px-2.5 py-0.5 rounded-full border border-amber-400 shadow-xs flex items-center gap-1">
                    <Sun size={14} className="fill-yellow-300 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
                    Anything Under The Sun ☀️
                  </span>
                  <span className="text-[10px] sm:text-xs font-black bg-white/85 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs">
                    Like ChatGPT &amp; Dola AI
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                    Very Simple &amp; Understandable 🌟
                  </span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-amber-950/90 mt-0.5">
                Every question answered in super simple, crystal-clear words • Write, Code, Plan &amp; Learn with Sir Lax 🇵🇭
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            {/* Surprise Me / Random Question Under The Sun */}
            <button
              onClick={handleSurpriseMe}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-stone-950 hover:bg-stone-900 text-yellow-300 transition cursor-pointer shadow-sm border border-amber-400 transform hover:scale-105"
              title="Pick a fascinating random question under the sun"
            >
              <Dices size={16} className="text-yellow-300" />
              <span>Surprise Me 🎲</span>
            </button>

            <button
              onClick={() => setShowInspirations(!showInspirations)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shadow-xs border ${
                showInspirations
                  ? 'bg-amber-950 text-yellow-300 border-amber-900'
                  : 'bg-white/80 hover:bg-white text-stone-900 border-amber-300'
              }`}
              title="Toggle starter question ideas"
            >
              <Lightbulb size={14} className="text-amber-400" />
              <span>{showInspirations ? 'Hide Topics' : 'Explore Topics'}</span>
            </button>

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-stone-700 hover:text-rose-600 transition cursor-pointer border border-amber-300 shadow-xs"
              title="Clear chat and start fresh"
            >
              <Trash2 size={16} />
            </button>

            <button
              onClick={() => setIsExpandedStage(!isExpandedStage)}
              className="flex items-center gap-1 p-2 rounded-xl bg-white/80 hover:bg-white text-stone-800 transition cursor-pointer border border-amber-300 shadow-xs font-bold text-xs"
              title={isExpandedStage ? 'Exit Full View' : 'Expand Chat Fullscreen'}
            >
              {isExpandedStage ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="hidden md:inline">{isExpandedStage ? 'Normal' : 'Expand'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOPIC EXPLORER & INSPIRATION DRAWER
          ========================================================================= */}
      {showInspirations && (
        <div className="bg-gradient-to-b from-amber-50/90 to-stone-50 border-b border-amber-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-600" />
              <span>
                <strong>Under The Sun Universal Knowledge:</strong> Tap any domain to explore sample questions:
              </span>
            </span>
            <button
              onClick={handleSurpriseMe}
              className="text-xs font-extrabold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-200/60 hover:bg-amber-200 px-2 py-0.5 rounded-lg transition"
            >
              <Dices size={13} />
              <span>Random Question 🎲</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            {CATEGORY_PROMPTS.map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = selectedPromptCategory === idx;
              return (
                <button
                  key={cat.category}
                  onClick={() => {
                    setSelectedPromptCategory(idx);
                    setMode(cat.mode);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                      : 'bg-white text-stone-700 hover:bg-amber-100/60 border border-amber-200'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-white' : 'text-amber-600'} />
                  <span>{cat.category}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Prompt Pills for selected category */}
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_PROMPTS[selectedPromptCategory].prompts.map((promptText, pIdx) => (
              <button
                key={pIdx}
                onClick={() => {
                  setInput(promptText);
                  inputRef.current?.focus();
                }}
                onDoubleClick={() => handleSend(promptText)}
                className="group shrink-0 flex items-center gap-1.5 bg-white hover:bg-amber-500 hover:text-white text-stone-800 text-xs px-3 py-1.5 rounded-xl border border-amber-300 font-semibold transition cursor-pointer shadow-2xs"
                title="Tap to paste in box, or double-click to ask immediately"
              >
                <span>{promptText}</span>
                <ArrowRight size={12} className="text-amber-500 group-hover:text-white transition" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          CONTROL BAR: Active Mode Pills + Grade Level selector
          ========================================================================= */}
      <div className="bg-stone-100 border-b border-amber-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Mode Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="font-bold text-stone-600 shrink-0">Mode:</span>
          <button
            onClick={() => setMode('anything')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-black transition cursor-pointer ${
              mode === 'anything'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-xs ring-1 ring-amber-400'
                : 'bg-white text-stone-700 hover:bg-amber-100'
            }`}
          >
            <Sun size={13} className={mode === 'anything' ? 'fill-stone-950 text-stone-950' : ''} />
            <span>☀️ Under The Sun (Universal)</span>
          </button>

          <button
            onClick={() => setMode('academics')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              mode === 'academics' || mode === 'homework'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-amber-100'
            }`}
          >
            <BookOpen size={13} />
            <span>📚 Academics</span>
          </button>

          <button
            onClick={() => setMode('practical')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              mode === 'practical'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-amber-100'
            }`}
          >
            <Globe size={13} />
            <span>🌍 Practical World</span>
          </button>

          <button
            onClick={() => setMode('math')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              mode === 'math'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-amber-100'
            }`}
          >
            <Calculator size={13} />
            <span>📐 Math</span>
          </button>

          <button
            onClick={() => setMode('diy')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              mode === 'diy'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-amber-100'
            }`}
          >
            <Scissors size={13} />
            <span>🛠️ DIY</span>
          </button>

          <button
            onClick={() => setMode('college')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              mode === 'college'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-amber-100'
            }`}
          >
            <GraduationCap size={13} />
            <span>🎓 College</span>
          </button>
        </div>

        {/* Grade level dropdown */}
        <div className="flex items-center gap-1.5 font-semibold text-stone-700 shrink-0">
          <GraduationCap size={15} className="text-amber-700" />
          <span>Learner Level:</span>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
            className="bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-xs font-bold text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-2xs"
          >
            <option value="grade-1">Grade 1 - 3 (Ultra Simple &amp; Visual)</option>
            <option value="grade-4">Grade 4 - 6 (Elementary)</option>
            <option value="high-school">Junior / Senior High School</option>
            <option value="college">College Youth &amp; Lifelong Learners</option>
          </select>
        </div>
      </div>

      {/* Offline Mode Alert banner if offline */}
      {isForceOffline && (
        <div className="bg-amber-500 text-amber-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff size={14} />
            <span>Offline Resilience Mode: Instant answers from local knowledge base. No data needed!</span>
          </div>
          <span className="text-[11px] bg-white/40 px-2 py-0.5 rounded-full font-extrabold">100% Free &amp; Offline</span>
        </div>
      )}

      {/* =========================================================================
          MESSAGES LIST (Spacious, Clear, Beautiful)
          ========================================================================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-stone-50 via-white to-amber-50/20">
        {/* Google Workspace Action Toast */}
        {workspaceToast && (
          <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-900 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 font-medium">
              <span className="p-1 bg-blue-600 text-white rounded-lg">
                <FileText size={14} />
              </span>
              <span>{workspaceToast.text}</span>
              {workspaceToast.link && (
                <a
                  href={workspaceToast.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-blue-700 hover:text-blue-950 inline-flex items-center gap-1"
                >
                  Open in Workspace <ExternalLink size={12} />
                </a>
              )}
            </div>
            <button
              onClick={() => setWorkspaceToast(null)}
              className="text-blue-700 hover:text-blue-950 p-1 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = activeSpeechId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot Avatar */}
              {!isUser && (
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400 shadow-sm bg-white mt-1">
                  <img
                    src={SIR_LAX_AVATAR}
                    alt="Sir Lax"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-3xl p-4 sm:p-5 shadow-sm relative transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-xs'
                    : 'bg-white text-stone-800 border-2 border-amber-200/90 rounded-bl-xs'
                }`}
              >
                {/* Header label for bot */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-amber-100 text-xs text-amber-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="font-extrabold text-amber-950 font-['Fredoka',sans-serif]">
                        Sir Lax (Your Community Teacher)
                      </span>
                      {msg.isOffline && (
                        <span className="bg-sky-100 text-sky-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Offline Pack
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-stone-400 font-normal">{msg.timestamp}</span>
                  </div>
                )}

                {/* Text Content */}
                <div className={`whitespace-pre-line leading-relaxed ${getFontSizeClass()} font-medium`}>
                  {msg.text}
                </div>

                {/* Bot Message Action Buttons: Read aloud, Copy, Workspace Export, etc */}
                {!isUser && (
                  <div className="mt-3.5 pt-2.5 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                          isSpeaking
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                        }`}
                        title="Read aloud with voice assistant"
                      >
                        {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        <span>{isSpeaking ? 'Pause Voice' : 'Listen to Sir Lax'}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold transition cursor-pointer"
                        title="Copy text to notebook"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={14} className="text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy Notes</span>
                          </>
                        )}
                      </button>

                      {/* Google Workspace direct 1-click export actions */}
                      <button
                        onClick={() => handleExportToGoogleDoc(msg.id, msg.text)}
                        disabled={exportingDocId === msg.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition cursor-pointer"
                        title="Export this response directly into a Google Doc"
                      >
                        {exportingDocId === msg.id ? (
                          <Loader2 size={12} className="animate-spin text-blue-600" />
                        ) : (
                          <FileText size={12} className="text-blue-600" />
                        )}
                        <span>Google Doc</span>
                      </button>

                      <button
                        onClick={() => handleSaveToDrive(msg.id, msg.text)}
                        disabled={exportingDriveId === msg.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition cursor-pointer"
                        title="Save text note to Google Drive"
                      >
                        {exportingDriveId === msg.id ? (
                          <Loader2 size={12} className="animate-spin text-emerald-600" />
                        ) : (
                          <HardDrive size={12} className="text-emerald-600" />
                        )}
                        <span>Drive</span>
                      </button>

                      <button
                        onClick={() => handleAddToGoogleTasks(msg.id, msg.text)}
                        disabled={exportingTaskId === msg.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition cursor-pointer"
                        title="Add as a task in Google Tasks"
                      >
                        {exportingTaskId === msg.id ? (
                          <Loader2 size={12} className="animate-spin text-purple-600" />
                        ) : (
                          <CheckSquare size={12} className="text-purple-600" />
                        )}
                        <span>Tasks</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-amber-800/80 italic font-semibold self-end sm:self-auto">
                      &ldquo;EDUCATION IS THE KEY FOR CHANGE!&rdquo; 🇵🇭
                    </span>
                  </div>
                )}

                {/* Follow-up suggestion buttons */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-amber-100">
                    <p className="text-xs font-bold text-amber-950 mb-2 flex items-center gap-1">
                      <Lightbulb size={13} className="text-amber-500" /> Quick questions you can tap next:
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(question)}
                          className="text-left text-xs bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-950 px-3 py-1.5 rounded-xl border border-amber-200 font-semibold transition cursor-pointer shadow-2xs"
                        >
                          👉 {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400 bg-white">
              <img src={SIR_LAX_AVATAR} alt="Sir Lax" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-4 shadow-sm flex items-center gap-3 text-xs sm:text-sm font-bold text-amber-950">
              <RefreshCw size={16} className="animate-spin text-amber-600" />
              <span>Sir Lax is consulting universal knowledge to answer your question...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Listening Overlay */}
      {isListening && (
        <div className="bg-rose-50 border-t-2 border-rose-300 px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm text-rose-900 animate-pulse">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping"></span>
            <span>Sir Lax is listening to your question... Speak clearly, anak! 🎙️</span>
          </div>
          <button
            onClick={toggleListening}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition shadow-xs"
          >
            Done / Cancel
          </button>
        </div>
      )}

      {/* =========================================================================
          BIGGER & VISIBLE INPUT CONSOLE
          ========================================================================= */}
      <div className="bg-white border-t-2 border-amber-300 p-3 sm:p-4 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex flex-col gap-2"
        >
          {/* Main Input Box & Action Buttons */}
          <div className="flex items-end gap-2 sm:gap-3 bg-stone-100 rounded-2xl p-1.5 sm:p-2 border-2 border-amber-200 focus-within:border-amber-500 focus-within:bg-white transition-all shadow-inner">
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 sm:p-3.5 rounded-xl transition cursor-pointer shadow-sm shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-500 text-white animate-bounce ring-4 ring-rose-200'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
              }`}
              title="Speak your question aloud"
            >
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {/* Textarea Input (Auto-sized, spacious) */}
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything under the sun! Sir Lax explains every topic in very simple, easy-to-understand words... (e.g. 'How does AI think?' or 'Help me budget my allowance')"
              className="flex-1 bg-transparent text-stone-900 text-xs sm:text-sm md:text-base font-semibold focus:outline-none resize-none py-1.5 px-2 leading-relaxed"
              disabled={loading}
            />

            {/* Quick Surprise Me Button inside input row */}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="hidden lg:flex items-center gap-1 bg-stone-200 hover:bg-amber-200 text-stone-800 text-xs font-bold px-2.5 py-3 rounded-xl transition cursor-pointer"
              title="Pick a random universal question under the sun"
            >
              <Dices size={16} className="text-amber-700" />
              <span>Surprise</span>
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-40 text-stone-950 font-black p-3 sm:px-5 sm:py-3.5 rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer disabled:cursor-not-allowed shrink-0 flex items-center gap-2 border border-amber-300"
              title="Send question"
            >
              <Send size={18} className="text-stone-950" />
              <span className="hidden sm:inline text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                Ask Sir Lax
              </span>
            </button>
          </div>

          {/* Bottom helper info */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-semibold text-stone-500 px-1 pt-1 gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-amber-800">
                <Mic size={12} className="text-amber-600" /> Tap 🎙️ to talk hands-free
              </span>
              <span>&bull;</span>
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="text-amber-700 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <Dices size={12} /> Random &quot;Under The Sun&quot; Question
              </button>
              <span>&bull;</span>
              <span className="text-stone-600">Press Enter ↵ to send</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck size={13} /> Limitless Universal AI Engine • 100% Free
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
