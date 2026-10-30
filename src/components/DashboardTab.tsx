import React from 'react';
import { CommunityStats } from '../types';
import { STUDENT_GRATITUDE_STORIES, SIR_LAX_AVATAR } from '../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  UtensilsCrossed,
  GraduationCap,
  Download,
  BookOpen,
  MapPin,
  Heart,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface DashboardTabProps {
  stats: CommunityStats;
  onOpenFeedModal: () => void;
  onWatchAdToFeed: () => void;
  onNavigateToAchievements?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  stats,
  onOpenFeedModal,
  onWatchAdToFeed,
  onNavigateToAchievements,
}) => {
  const goalMeals = 20000;
  const progressPercent = Math.min(100, Math.round((stats.mealsServed / goalMeals) * 100));

  return (
    <div className="max-w-6xl mx-auto py-4 px-3 sm:px-4 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-amber-700 rounded-3xl text-white p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 uppercase tracking-wider mb-2">
              <BarChart3 size={14} className="text-yellow-300" /> Real Community Progress
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] tracking-tight">
              Local Community Engagement &amp; Impact Dashboard
            </h2>
            <p className="mt-2 text-indigo-100 text-xs sm:text-sm max-w-2xl font-medium">
              Transparent, measurable change powered by community teachers, donors, and the free Chat Sir Lax
              applet. Track how every homework solved and every meal served brings us closer to ending educational poverty.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={onWatchAdToFeed}
              className="bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>Watch Ad to Feed (+1)</span>
            </button>
            <button
              onClick={onOpenFeedModal}
              className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/40 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Heart size={16} />
              <span>Sponsor Meals</span>
            </button>
          </div>
        </div>

        {/* Milestone Goal Progress Bar */}
        <div className="mt-6 bg-black/25 backdrop-blur-xs rounded-2xl p-4 border border-white/20">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-white mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={15} className="text-amber-300" />
              Next Community Goal: 20,000 Warm Meals for Struggling Students
            </span>
            <span className="text-amber-300">{progressPercent}% Achieved ({stats.mealsServed.toLocaleString()} / {goalMeals.toLocaleString()})</span>
          </div>

          <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-indigo-200 mt-2">
            Just {(goalMeals - stats.mealsServed).toLocaleString()} more meals to reach our next milestone for the upcoming semester exam period!
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
            <UtensilsCrossed size={20} />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-['Fredoka',sans-serif]">
            {stats.mealsServed.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-0.5">Hot Meals Distributed</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
            <GraduationCap size={20} />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-['Fredoka',sans-serif]">
            {stats.collegeYouthSupported.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-0.5">College Scholars Sustained</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
            <BookOpen size={20} />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-['Fredoka',sans-serif]">
            {stats.homeworkSolved.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-0.5">Homeworks Simplified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-2">
            <Download size={20} />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-['Fredoka',sans-serif]">
            {stats.offlinePacksDownloaded.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-0.5">Offline Packs Cached</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
            <MapPin size={20} />
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-['Fredoka',sans-serif]">
            {stats.communitiesReached}
          </div>
          <div className="text-xs text-stone-500 font-semibold mt-0.5">Barangay Learning Hubs</div>
        </div>
      </div>

      {/* Achievements Motivation Banner */}
      {onNavigateToAchievements && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-3xl shadow-md shrink-0">
              🏆
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                Student &amp; Sponsor Motivation
              </span>
              <h3 className="text-lg sm:text-xl font-black text-stone-900 font-['Fredoka',sans-serif] mt-0.5">
                Earn Badges for 10 Homeworks Solved &amp; 100 Meals Sponsored!
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Track personal study streaks, celebrate milestones with Sir Lax voice praise, and earn printable Honor Certificates.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToAchievements}
            className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-sm transition transform hover:scale-105 shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Award size={16} />
            <span>Open Achievements &amp; Badges &rarr;</span>
          </button>
        </div>
      )}

      {/* Community Learning Hubs & Schedules */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 font-['Fredoka',sans-serif]">
              Active Community Learning Hubs
            </h3>
            <p className="text-xs text-stone-500">Free tutoring, homework help, hot soup, and offline APK installation stations</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> All Hubs Open
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Barangay San Roque Covered Gym
            </div>
            <p className="text-xs text-stone-600 mt-1">Sitio Maligaya, Barangay Hall Compound</p>
            <div className="mt-2 text-[11px] text-amber-900 font-semibold bg-amber-100/70 p-2 rounded-xl">
              🕒 Monday - Friday: 3:00 PM - 6:00 PM (Grade School Tutoring &amp; Rice Soup)
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              University Dormitory Midnight Pantry
            </div>
            <p className="text-xs text-stone-600 mt-1">State University Student Center Walkway</p>
            <div className="mt-2 text-[11px] text-rose-900 font-semibold bg-rose-100/70 p-2 rounded-xl">
              🕒 Daily 8:00 PM - 12:00 MN (Hot Arroz Caldo &amp; Exam Study Fuel for College Youth)
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              Riverside Community Chapel Center
            </div>
            <p className="text-xs text-stone-600 mt-1">Riverside Extension, Purok 4</p>
            <div className="mt-2 text-[11px] text-sky-900 font-semibold bg-sky-100/70 p-2 rounded-xl">
              🕒 Saturdays 8:00 AM - 12:00 NN (DIY Science Workshop &amp; Free Breakfast Lugaw)
            </div>
          </div>
        </div>
      </div>

      {/* Student Gratitude Wall */}
      <div className="bg-stone-50 rounded-3xl border border-stone-200 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
              Student &amp; Parent Voices
            </span>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-1 font-['Fredoka',sans-serif]">
              Gratitude Wall: What the Community Says
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-medium">Real verified community reviews</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {STUDENT_GRATITUDE_STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                &ldquo;{story.text}&rdquo;
              </p>

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-stone-900">{story.name}</div>
                  <div className="text-[11px] text-stone-500">{story.school}</div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {story.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
