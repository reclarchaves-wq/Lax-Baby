import React, { useState } from 'react';
import { FeedingProgramDrive, CommunityStats } from '../types';
import { MOCK_FEEDING_DRIVES } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  UtensilsCrossed,
  Heart,
  Users,
  GraduationCap,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle2,
  Send,
  HelpCircle,
  Coffee,
  Egg,
} from 'lucide-react';

interface FeedingTabProps {
  stats: CommunityStats;
  onSponsorMeal: (count: number, donorName?: string) => void;
  onWatchAdToFeed: () => void;
}

export const FeedingTab: React.FC<FeedingTabProps> = ({
  stats,
  onSponsorMeal,
  onWatchAdToFeed,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'children' | 'college'>('all');
  const [assistanceSubmitted, setAssistanceSubmitted] = useState(false);
  const [assistanceName, setAssistanceName] = useState('');
  const [assistanceSchool, setAssistanceSchool] = useState('');
  const [assistanceLevel, setAssistanceLevel] = useState('College Youth (Working Student)');
  const [assistanceNote, setAssistanceNote] = useState('');

  const [sponsorCustomCount, setSponsorCustomCount] = useState<number>(3);
  const [sponsorDonor, setSponsorDonor] = useState('');
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  const filteredDrives = MOCK_FEEDING_DRIVES.filter((drive) => {
    if (selectedCategory === 'children') return drive.targetGroup === 'Children & Pupils';
    if (selectedCategory === 'college') return drive.targetGroup === 'College Youth';
    return true;
  });

  const handleAssistanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistanceName.trim()) return;
    setAssistanceSubmitted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ef4444', '#f59e0b', '#10b981'],
      });
    } catch (_) {}
  };

  const handleExecuteSponsor = () => {
    onSponsorMeal(sponsorCustomCount, sponsorDonor || 'Anonymous Supporter');
    setShowSponsorModal(false);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
      });
    } catch (_) {}
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-3 sm:px-4 space-y-6">
      {/* Hero Motto Header */}
      <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-yellow-600 rounded-3xl text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-white/20 uppercase tracking-wider mb-3">
            <Heart size={14} className="text-yellow-300 fill-yellow-300" />
            Sustainable Social Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Fredoka',sans-serif] tracking-tight leading-tight">
            &ldquo;EDUCATION IS THE KEY FOR CHANGE!&rdquo;
          </h2>
          <p className="mt-3 text-rose-50 text-sm sm:text-base leading-relaxed font-medium">
            A child cannot solve math problems on an empty stomach. And college youth—who work exhausting
            graveyard shifts just to pay tuition—often skip two meals a day. We nourish their bodies so
            they can finish their diplomas and transform their families forever.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onWatchAdToFeed}
              className="bg-white text-rose-700 hover:bg-rose-50 font-black text-sm px-5 py-3 rounded-2xl shadow-md transition transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={18} className="text-amber-500" />
              <span>Watch 1 Ad &rarr; Free Meal for a Student</span>
            </button>

            <button
              onClick={() => setShowSponsorModal(true)}
              className="bg-rose-950/60 hover:bg-rose-950 text-white font-bold text-sm px-4 py-3 rounded-2xl border border-rose-300/40 transition flex items-center gap-2 cursor-pointer"
            >
              <UtensilsCrossed size={16} />
              <span>Sponsor Warm Meals</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 font-['Fredoka',sans-serif]">
              {stats.mealsServed.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-stone-500">Total Hot Meals Served</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 font-['Fredoka',sans-serif]">
              {stats.collegeYouthSupported.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-stone-500">College Youth Nourished</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-yellow-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 font-['Fredoka',sans-serif]">
              {stats.adSponsoredMeals.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-stone-500">Meals via Ad Support</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 font-['Fredoka',sans-serif]">
              {stats.communitiesReached}
            </div>
            <div className="text-xs font-semibold text-stone-500">Community Feeding Hubs</div>
          </div>
        </div>
      </div>

      {/* Target Audience Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Feeding Outreaches
          </button>
          <button
            onClick={() => setSelectedCategory('children')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              selectedCategory === 'children'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            👶 Grade School Children
          </button>
          <button
            onClick={() => setSelectedCategory('college')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              selectedCategory === 'college'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            🎓 College Youth &amp; Scholars
          </button>
        </div>
      </div>

      {/* Feeding Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrives.map((drive) => (
          <div
            key={drive.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={drive.image}
                  alt={drive.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
                <span
                  className={`absolute top-3 right-3 text-xs font-extrabold px-3 py-1 rounded-full shadow ${
                    drive.status === 'Completed'
                      ? 'bg-emerald-600 text-white'
                      : drive.status === 'Daily Ongoing'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-600 text-white animate-pulse'
                  }`}
                >
                  {drive.status}
                </span>

                <span className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                  {drive.targetGroup}
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-lg text-stone-900 font-['Fredoka',sans-serif]">
                  {drive.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {drive.highlight}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-stone-500 border-t border-stone-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-rose-500" />
                    <span>{drive.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-amber-500" />
                    <span>{drive.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">
                🍲 {drive.mealsServed} warm meals distributed
              </span>
              <button
                onClick={() => setShowSponsorModal(true)}
                className="text-xs font-extrabold text-rose-600 hover:text-rose-700 transition cursor-pointer"
              >
                Support This Hub &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* College Youth Spotlight Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-7">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap size={40} />
          </div>

          <div className="flex-1">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
              Why We Feed College Youth
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 font-['Fredoka',sans-serif]">
              &ldquo;I have seen college students struggle just to stay in school.&rdquo;
            </h3>
            <p className="text-stone-700 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
              In public state colleges, thousands of working youth work evening food stalls, tutor younger
              kids, or sleep on classroom benches. When they run out of money, they buy instant noodles or
              drink tap water for days. Our College Midnight Study Pantries give them warm nutritious arroz
              caldo with boiled eggs, coffee, and free printable study modules so they never drop out.
            </p>
          </div>
        </div>
      </div>

      {/* Request Meal Assistance Form */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <div className="max-w-xl">
          <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
            Student / Parent Aid
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 font-['Fredoka',sans-serif]">
            Request Free Meal Cards or Food Support
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Are you a student in need of breakfast or lunch, or a parent struggling to feed your schooling kids?
            Sign up safely below. No fees, no judgment.
          </p>

          {assistanceSubmitted ? (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Assistance Request Received, {assistanceName}!</span>
              </div>
              <p className="text-xs mt-1 text-emerald-700">
                Your digital voucher code is <strong>#LAX-CARE-{Math.floor(1000 + Math.random() * 9000)}</strong>.
                Show this code or tell your name at any Community Barangay Feeding Hub or Campus Pantry to receive
                free hot meals. Kuya Sir Lax is rooting for you!
              </p>
              <button
                onClick={() => setAssistanceSubmitted(false)}
                className="mt-3 text-xs text-emerald-800 underline font-bold cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleAssistanceSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name / Nickname
                </label>
                <input
                  type="text"
                  required
                  value={assistanceName}
                  onChange={(e) => setAssistanceName(e.target.value)}
                  placeholder="e.g., Juan Santos or Nanay Maria"
                  className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    School / Barangay
                  </label>
                  <input
                    type="text"
                    required
                    value={assistanceSchool}
                    onChange={(e) => setAssistanceSchool(e.target.value)}
                    placeholder="e.g., San Roque National High"
                    className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Student Level
                  </label>
                  <select
                    value={assistanceLevel}
                    onChange={(e) => setAssistanceLevel(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Grade 1-3 Early Pupil">Grade 1-3 Early Pupil</option>
                    <option value="Elementary Grade 4-6">Elementary Grade 4-6</option>
                    <option value="High School Student">Junior / Senior High School</option>
                    <option value="College Youth (Working Student)">College Youth (Working Student)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Optional Note (e.g., Dietary allergies or pickup time)
                </label>
                <textarea
                  rows={2}
                  value={assistanceNote}
                  onChange={(e) => setAssistanceNote(e.target.value)}
                  placeholder="Tell us anything we can do to make studying easier for you..."
                  className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Send size={14} />
                <span>Submit Confidential Food Assistance</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Sponsor Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 animate-in fade-in duration-200">
            <h3 className="text-xl font-black text-stone-900 font-['Fredoka',sans-serif]">
              Sponsor Warm Meals for Students 🍲
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Every single bowl gives a student hot chicken arroz caldo with egg to fuel their study day.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Name / Dedication
                </label>
                <input
                  type="text"
                  value={sponsorDonor}
                  onChange={(e) => setSponsorDonor(e.target.value)}
                  placeholder="e.g. Teacher Ana or An OFW Supporter"
                  className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Number of Meals to Provide
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSponsorCustomCount(num)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        sponsorCustomCount === num
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {num} {num === 1 ? 'Meal' : 'Meals'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium">
                💡 Or watch a sponsored video ad to feed students completely free!
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteSponsor}
                  className="flex-1 py-2 rounded-xl text-xs font-black bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-sm"
                >
                  Confirm {sponsorCustomCount} Meals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
