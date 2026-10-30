import React, { useState } from 'react';
import { AchievementBadge, UserActivityStats, CommunityStats } from '../types';
import { SIR_LAX_AVATAR } from '../data/mockData';
import { SpeechService } from '../services/speechService';
import confetti from 'canvas-confetti';
import {
  Award,
  Trophy,
  Star,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  UtensilsCrossed,
  Volume2,
  VolumeX,
  Share2,
  Printer,
  ChevronRight,
  TrendingUp,
  Download,
  ShieldCheck,
  Heart,
  Plus,
} from 'lucide-react';

interface AchievementsProps {
  userStats: UserActivityStats;
  communityStats: CommunityStats;
  onNavigateToTab: (tabKey: any) => void;
  onSolveHomeworkQuick: () => void;
  onSponsorMealQuick: (count: number) => void;
  onWatchAdQuick: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({
  userStats,
  communityStats,
  onNavigateToTab,
  onSolveHomeworkQuick,
  onSponsorMealQuick,
  onWatchAdQuick,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedBadgeForDetail, setSelectedBadgeForDetail] = useState<AchievementBadge | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Compute all achievement badges based on user stats and community contributions
  const badges: AchievementBadge[] = [
    // Homework Milestones
    {
      id: 'hw-1',
      title: 'First Step to Learning',
      category: 'homework',
      description: 'Solve your very first homework question or ask Sir Lax for guidance.',
      icon: '🌱',
      target: 1,
      current: userStats.homeworksSolved,
      unlocked: userStats.homeworksSolved >= 1,
      tier: 'bronze',
      rewardMotto: 'The journey of a thousand miles begins with one curious question!',
      tag: '1 Homework Solved',
    },
    {
      id: 'hw-5',
      title: 'Curious Problem Solver',
      category: 'homework',
      description: 'Successfully complete 5 homework assignments with step-by-step help.',
      icon: '✏️',
      target: 5,
      current: userStats.homeworksSolved,
      unlocked: userStats.homeworksSolved >= 5,
      tier: 'silver',
      rewardMotto: 'Practice makes permanent! You are getting sharper every single day.',
      tag: '5 Homeworks Solved',
    },
    {
      id: 'hw-10',
      title: 'Homework Hero Champion',
      category: 'homework',
      description: 'Solve 10 homework assignments! You have built a true daily study habit.',
      icon: '🏆',
      target: 10,
      current: userStats.homeworksSolved,
      unlocked: userStats.homeworksSolved >= 10,
      tier: 'gold',
      rewardMotto: 'Ang galing mo! 10 homeworks solved! Education is the key for change!',
      tag: '10 Homeworks Solved',
    },
    {
      id: 'hw-25',
      title: 'Honor Pupil of Hope',
      category: 'homework',
      description: 'Master 25 homework assignments across math, science, and reading.',
      icon: '🌟',
      target: 25,
      current: userStats.homeworksSolved,
      unlocked: userStats.homeworksSolved >= 25,
      tier: 'platinum',
      rewardMotto: 'Outstanding dedication! You are inspiring your classmates and family!',
      tag: '25 Homeworks Solved',
    },

    // Feeding & Social Impact Milestones
    {
      id: 'feed-1',
      title: 'Kind Heart Supporter',
      category: 'feeding',
      description: 'Sponsor or watch 1 ad to provide your first hot arroz caldo with egg to a hungry student.',
      icon: '🍲',
      target: 1,
      current: userStats.mealsSponsored,
      unlocked: userStats.mealsSponsored >= 1,
      tier: 'bronze',
      rewardMotto: 'A warm meal warms the soul. You nourished a student who was studying hungry.',
      tag: '1 Meal Provided',
    },
    {
      id: 'feed-10',
      title: 'Community Sustainer',
      category: 'feeding',
      description: 'Provide 10 hot, nutritious meals to early grade pupils and college youth.',
      icon: '👼',
      target: 10,
      current: userStats.mealsSponsored,
      unlocked: userStats.mealsSponsored >= 10,
      tier: 'silver',
      rewardMotto: '10 stomachs filled! You are a true guardian angel for our community pantry.',
      tag: '10 Meals Provided',
    },
    {
      id: 'feed-50',
      title: 'Dorm & Pantry Pillar',
      category: 'feeding',
      description: 'Provide 50 meals for working college youth surviving midterms and night shifts.',
      icon: '🎓',
      target: 50,
      current: userStats.mealsSponsored,
      unlocked: userStats.mealsSponsored >= 50,
      tier: 'gold',
      rewardMotto: 'College youth will never have to choose between tuition and food because of you!',
      tag: '50 Meals Provided',
    },
    {
      id: 'feed-100',
      title: 'Centennial Hope Patron',
      category: 'feeding',
      description: 'Major community milestone: Sponsor 100 hot meals for students and pupils!',
      icon: '👑',
      target: 100,
      current: userStats.mealsSponsored,
      unlocked: userStats.mealsSponsored >= 100,
      tier: 'platinum',
      rewardMotto: 'A legendary social impact hero! 100 students fed through your generosity and support!',
      tag: '100 Meals Sponsored',
    },

    // Offline & Voice Milestones
    {
      id: 'off-1',
      title: 'Zero-Data Explorer',
      category: 'offline',
      description: 'Download at least 1 offline study pack to study without paying for mobile data.',
      icon: '📲',
      target: 1,
      current: userStats.packsDownloaded,
      unlocked: userStats.packsDownloaded >= 1,
      tier: 'bronze',
      rewardMotto: 'Knowledge is free! You are ready to study anytime, anywhere, even in brownouts.',
      tag: 'Offline Pack Ready',
    },
    {
      id: 'off-3',
      title: 'Mobile Library Master',
      category: 'offline',
      description: 'Save 3 or more offline packs covering math, science, and DIY projects.',
      icon: '📚',
      target: 3,
      current: userStats.packsDownloaded,
      unlocked: userStats.packsDownloaded >= 3,
      tier: 'silver',
      rewardMotto: 'Your phone is now an offline university for your entire family!',
      tag: '3 Packs Saved',
    },
    {
      id: 'voc-3',
      title: 'Voice Assistant Listener',
      category: 'voice',
      description: 'Listen to Sir Lax explain lessons with audio voice assistant 3 or more times.',
      icon: '🎙️',
      target: 3,
      current: userStats.voiceListens,
      unlocked: userStats.voiceListens >= 3,
      tier: 'bronze',
      rewardMotto: 'Listening builds strong pronunciation and clear understanding for young learners!',
      tag: 'Voice Assistant Active',
    },
    {
      id: 'diy-1',
      title: 'Recycled Eco-Inventor',
      category: 'offline',
      description: 'Explore and follow DIY zero-cost home projects made from recycled trash.',
      icon: '🛠️',
      target: 1,
      current: userStats.diyProjectsViewed,
      unlocked: userStats.diyProjectsViewed >= 1,
      tier: 'bronze',
      rewardMotto: 'You proved that genius doesn\'t require money—only imagination and recycled bottles!',
      tag: 'Zero-Cost DIY Maker',
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Trigger celebration audio and confetti
  const celebrateBadge = (badge: AchievementBadge) => {
    setSelectedBadgeForDetail(badge);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'],
      });
    } catch (_) {}

    const motivationalText = `Mabuhay! Congratulations anak on reaching your milestone: ${badge.title}! ${badge.rewardMotto} Always remember: Education is the key for change!`;
    SpeechService.stopSpeaking();
    setIsSpeaking(true);
    SpeechService.speak(
      motivationalText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const filteredBadges = badges.filter((b) => {
    if (selectedFilter === 'unlocked') return b.unlocked;
    if (selectedFilter === 'locked') return !b.unlocked;
    if (selectedFilter === 'homework') return b.category === 'homework';
    if (selectedFilter === 'feeding') return b.category === 'feeding';
    if (selectedFilter === 'offline') return b.category === 'offline' || b.category === 'voice';
    return true;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'border-purple-400 bg-gradient-to-b from-purple-50 to-white text-purple-900';
      case 'gold':
        return 'border-amber-400 bg-gradient-to-b from-amber-50 to-white text-amber-900';
      case 'silver':
        return 'border-slate-300 bg-gradient-to-b from-slate-50 to-white text-slate-800';
      default:
        return 'border-amber-700/30 bg-gradient-to-b from-orange-50 to-white text-stone-800';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'gold':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'silver':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-3 sm:px-4 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl text-stone-900 p-6 sm:p-8 shadow-lg border-2 border-yellow-300 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/70 uppercase tracking-wider mb-2 text-amber-950 shadow-xs">
              <Trophy size={14} className="text-amber-600 fill-amber-600" />
              Student Motivation &amp; Community Milestones
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-['Fredoka',sans-serif] tracking-tight text-stone-950">
              Achievements &amp; Honor Badges
            </h2>
            <p className="mt-2 text-stone-800 text-xs sm:text-base font-medium leading-relaxed">
              Every homework solved and every bowl of food provided brings us one step closer to breaking poverty.
              Celebrate your learning milestones, earn badges from Sir Lax, and inspire your community!
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowCertificate(true)}
                className="bg-stone-950 text-white hover:bg-stone-800 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Award size={16} className="text-yellow-400" />
                <span>View Certificate of Honor</span>
              </button>

              <button
                onClick={() => onNavigateToTab('chat')}
                className="bg-white/80 hover:bg-white text-stone-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl transition border border-stone-300 flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <BookOpen size={15} />
                <span>Solve Homework Now</span>
              </button>
            </div>
          </div>

          {/* Quick Rank Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-amber-300/80 shadow-md w-full md:w-auto min-w-[240px] text-center shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 mx-auto flex items-center justify-center text-2xl shadow-inner mb-2">
              {progressPercent >= 75 ? '👑' : progressPercent >= 50 ? '🥇' : progressPercent >= 25 ? '🌟' : '🌱'}
            </div>
            <div className="font-black text-stone-900 text-lg font-['Fredoka',sans-serif]">
              {progressPercent >= 75
                ? 'Community Hero Scholar'
                : progressPercent >= 50
                ? 'Diligent Star Achiever'
                : progressPercent >= 25
                ? 'Rising Hope Pupil'
                : 'Curious Beginner'}
            </div>
            <div className="text-xs text-stone-600 font-semibold mt-0.5">
              {unlockedCount} of {totalCount} Badges Unlocked ({progressPercent}%)
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden mt-3 p-0.5 border border-stone-300">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Specific Milestones Banner: "10 Homeworks Solved" & "100 Meals Sponsored" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 10 Homeworks Solved Spotlight */}
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 text-3xl flex items-center justify-center shrink-0 shadow-sm">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                  Featured Study Milestone
                </span>
                <h3 className="text-lg font-black text-stone-900 font-['Fredoka',sans-serif] mt-0.5">
                  10 Homeworks Solved Badge
                </h3>
                <p className="text-xs text-stone-600">
                  Master 10 assignments with Sir Lax&apos;s step-by-step guidance.
                </p>
              </div>
            </div>

            {userStats.homeworksSolved >= 10 ? (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1 shrink-0">
                <CheckCircle2 size={13} /> Unlocked
              </span>
            ) : (
              <span className="bg-stone-100 text-stone-600 text-xs font-bold px-2 py-1 rounded-full shrink-0">
                {userStats.homeworksSolved}/10
              </span>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-stone-700">Progress to 10 Homeworks:</span>
              <span className="text-amber-800">
                {Math.min(userStats.homeworksSolved, 10)} / 10 ({Math.min(100, Math.round((userStats.homeworksSolved / 10) * 100))}%)
              </span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (userStats.homeworksSolved / 10) * 100)}%` }}
              ></div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={onSolveHomeworkQuick}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>Simulate Solve (+1)</span>
              </button>

              {userStats.homeworksSolved >= 10 ? (
                <button
                  onClick={() => celebrateBadge(badges[2])}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>Celebrate Badge!</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigateToTab('chat')}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Go to Chat</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 100 Meals Sponsored Spotlight */}
        <div className="bg-white rounded-3xl border-2 border-rose-300 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 border-2 border-rose-300 text-3xl flex items-center justify-center shrink-0 shadow-sm">
                👑
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full border border-rose-200">
                  Featured Community Milestone
                </span>
                <h3 className="text-lg font-black text-stone-900 font-['Fredoka',sans-serif] mt-0.5">
                  100 Meals Sponsored Badge
                </h3>
                <p className="text-xs text-stone-600">
                  Sponsor 100 hot arroz caldo meals via ad views or direct community pantry aid.
                </p>
              </div>
            </div>

            {userStats.mealsSponsored >= 100 ? (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1 shrink-0">
                <CheckCircle2 size={13} /> Unlocked
              </span>
            ) : (
              <span className="bg-stone-100 text-stone-600 text-xs font-bold px-2 py-1 rounded-full shrink-0">
                {userStats.mealsSponsored}/100
              </span>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-stone-700">Progress to 100 Meals:</span>
              <span className="text-rose-700">
                {Math.min(userStats.mealsSponsored, 100)} / 100 ({Math.min(100, Math.round((userStats.mealsSponsored / 100) * 100))}%)
              </span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (userStats.mealsSponsored / 100) * 100)}%` }}
              ></div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onWatchAdQuick}
                  className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                  title="Watch 1 ad unit to feed a student"
                >
                  <Sparkles size={12} />
                  <span>Watch Ad (+1)</span>
                </button>
                <button
                  onClick={() => onSponsorMealQuick(10)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-800 bg-stone-100 px-2 py-1.5 rounded-xl transition cursor-pointer"
                  title="Sponsor 10 meals"
                >
                  +10 Meals
                </button>
              </div>

              {userStats.mealsSponsored >= 100 ? (
                <button
                  onClick={() => celebrateBadge(badges[7])}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>Celebrate Badge!</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigateToTab('feeding')}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Feeding Hub</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: `All Badges (${totalCount})` },
            { id: 'homework', label: '📚 Homework (4)' },
            { id: 'feeding', label: '🍲 Feeding & Impact (4)' },
            { id: 'offline', label: '📲 Offline & Voice (4)' },
            { id: 'unlocked', label: `✨ Unlocked (${unlockedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-amber-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-500 font-semibold">
          💡 Click any badge to view details &amp; listen to Sir Lax
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.unlocked;
          const currentProgress = Math.min(badge.current, badge.target);
          const percent = Math.min(100, Math.round((currentProgress / badge.target) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => celebrateBadge(badge)}
              className={`p-4 rounded-3xl border-2 transition cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md transform hover:-translate-y-0.5 ${getTierColor(
                badge.tier
              )} ${!isUnlocked ? 'opacity-85' : 'ring-2 ring-amber-300/60'}`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getTierBadge(
                      badge.tier
                    )}`}
                  >
                    {badge.tier}
                  </span>

                  {isUnlocked ? (
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock size={11} /> Locked
                    </span>
                  )}
                </div>

                {/* Badge Icon & Name */}
                <div className="text-center my-3">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${
                      isUnlocked
                        ? 'bg-white border-amber-300'
                        : 'bg-stone-100 border-stone-200 grayscale'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <h4 className="font-black text-stone-900 text-base mt-2 font-['Fredoka',sans-serif] leading-tight">
                    {badge.title}
                  </h4>
                  <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md mt-1">
                    {badge.tag}
                  </span>
                </div>

                <p className="text-xs text-stone-600 text-center leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress Footer */}
              <div className="mt-4 pt-3 border-t border-stone-200/60">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="text-stone-500">Progress:</span>
                  <span className={isUnlocked ? 'text-emerald-700' : 'text-stone-700'}>
                    {currentProgress} / {badge.target} ({percent}%)
                  </span>
                </div>

                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden p-0.2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <div className="mt-2 text-center">
                  <button
                    type="button"
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center justify-center gap-1 mx-auto"
                  >
                    <Sparkles size={11} />
                    <span>{isUnlocked ? 'Hear Praise 🎙️' : 'View Goal'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honor Certificate Modal / Preview */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-400 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Certificate Header Banner */}
            <div className="text-center space-y-2 border-b-2 border-amber-200 pb-4">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Award size={14} className="text-amber-600" />
                Republic of Learning &bull; Community Hope Award
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-['Fredoka',sans-serif] tracking-tight">
                Certificate of Dedication &amp; Achievement
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 italic">
                Presented with pride to our student &amp; community champion
              </p>
            </div>

            {/* Certificate Body */}
            <div className="py-6 text-center space-y-4">
              <div className="text-3xl font-black text-amber-700 font-['Fredoka',sans-serif] underline decoration-amber-300">
                Diligent Scholar &amp; Community Benefactor
              </div>

              <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed">
                For outstanding perseverance in solving homework, learning step-by-step in clear English,
                and supporting community feeding programs for hungry students and struggling college youth.
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 bg-amber-50 p-3 rounded-2xl border border-amber-200 max-w-md mx-auto text-xs">
                <div>
                  <div className="font-black text-amber-900 text-lg">{userStats.homeworksSolved}</div>
                  <div className="text-stone-500 text-[10px]">Homeworks Solved</div>
                </div>
                <div>
                  <div className="font-black text-rose-600 text-lg">{userStats.mealsSponsored}</div>
                  <div className="text-stone-500 text-[10px]">Meals Sponsored</div>
                </div>
                <div>
                  <div className="font-black text-purple-700 text-lg">{unlockedCount} / {totalCount}</div>
                  <div className="text-stone-500 text-[10px]">Badges Earned</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-dashed border-amber-300 p-3 rounded-2xl max-w-md mx-auto">
                <p className="text-xs sm:text-sm font-extrabold text-amber-950">
                  &ldquo;EDUCATION IS THE KEY FOR CHANGE!&rdquo; 🇵🇭
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Never give up on your dreams. Poverty cannot steal the knowledge in your heart!
                </p>
              </div>
            </div>

            {/* Signature & Date */}
            <div className="border-t-2 border-amber-200 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-300 bg-white">
                  <img src={SIR_LAX_AVATAR} alt="Sir Lax" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <div className="font-black text-xs text-stone-900">Sir Lax</div>
                  <div className="text-[10px] text-stone-500">Teacher &amp; Community Mentor</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badge Detail Audio Modal */}
      {selectedBadgeForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 border-2 border-amber-300 text-4xl flex items-center justify-center mx-auto shadow-inner">
              {selectedBadgeForDetail.icon}
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                {selectedBadgeForDetail.tier} Badge
              </span>
              <h3 className="text-xl font-black text-stone-900 font-['Fredoka',sans-serif] mt-1">
                {selectedBadgeForDetail.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {selectedBadgeForDetail.description}
              </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-2xl text-left text-xs text-amber-950 font-medium">
              💡 <strong>Sir Lax says:</strong> &ldquo;{selectedBadgeForDetail.rewardMotto}&rdquo;
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  SpeechService.stopSpeaking();
                  setSelectedBadgeForDetail(null);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => celebrateBadge(selectedBadgeForDetail)}
                className="flex-1 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles size={14} />
                <span>Hear Voice Praise</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
