export type LanguageMode = 'simple-english' | 'filipino' | 'bilingual';
export type GradeLevel = 'grade-1' | 'grade-4' | 'high-school' | 'college';
export type ModeType =
  | 'anything'
  | 'academics'
  | 'practical'
  | 'diy'
  | 'math'
  | 'college'
  | 'interactive'
  | 'homework'
  | 'general';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isOffline?: boolean;
  gradeLevel?: GradeLevel;
  language?: LanguageMode;
  suggestedFollowUps?: string[];
  audioPlaying?: boolean;
}

export interface OfflineStudyPack {
  id: string;
  title: string;
  grade: string;
  category: 'math' | 'science' | 'english' | 'diy' | 'college';
  description: string;
  fileSize: string;
  downloaded: boolean;
  lessonsCount: number;
  content: {
    title: string;
    simpleExplanation: string;
    filipinoHint?: string;
    steps?: string[];
    example?: string;
    quizQuestion?: string;
    quizAnswer?: string;
  }[];
}

export interface FeedingProgramDrive {
  id: string;
  title: string;
  targetGroup: 'Children & Pupils' | 'College Youth' | 'All Students';
  date: string;
  location: string;
  mealsServed: number;
  highlight: string;
  status: 'Completed' | 'Upcoming This Saturday' | 'Daily Ongoing';
  image: string;
}

export interface MediaItem {
  id: string;
  type: 'video' | 'picture';
  title: string;
  category: 'Feeding Program' | 'Classroom Tutoring' | 'DIY Workshop' | 'College Scholars';
  thumbnail: string;
  mediaUrl?: string;
  duration?: string;
  date: string;
  location: string;
  description: string;
  impactQuote?: string;
}

export interface CommunityStats {
  mealsServed: number;
  collegeYouthSupported: number;
  homeworkSolved: number;
  communitiesReached: number;
  offlinePacksDownloaded: number;
  adSponsoredMeals: number;
}

export interface UserActivityStats {
  homeworksSolved: number;
  mealsSponsored: number;
  packsDownloaded: number;
  voiceListens: number;
  diyProjectsViewed: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  category: 'homework' | 'feeding' | 'offline' | 'voice' | 'community';
  description: string;
  icon: string;
  target: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  rewardMotto: string;
  tag: string;
}

