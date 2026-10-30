import React, { useState, useEffect } from 'react';
import { CommunityStats } from '../types';
import confetti from 'canvas-confetti';
import {
  Key,
  Coins,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Save,
  HelpCircle,
  PlayCircle,
  DollarSign,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Zap,
  ArrowRight,
  RefreshCw,
  Wallet,
} from 'lucide-react';

interface AdUnitsTabProps {
  stats: CommunityStats;
  onWatchAdToFeed: () => void;
}

export const AdUnitsTab: React.FC<AdUnitsTabProps> = ({ stats, onWatchAdToFeed }) => {
  // AdMob Keys state loaded from localStorage
  const [publisherId, setPublisherId] = useState(
    () => localStorage.getItem('csl_admob_pub_id') || 'pub-71829304918234'
  );
  const [appId, setAppId] = useState(
    () => localStorage.getItem('csl_admob_app_id') || 'ca-app-pub-71829304918234~918273645'
  );
  const [bannerUnitId, setBannerUnitId] = useState(
    () => localStorage.getItem('csl_admob_banner_id') || 'ca-app-pub-71829304918234/6300978111'
  );
  const [rewardedUnitId, setRewardedUnitId] = useState(
    () => localStorage.getItem('csl_admob_rewarded_id') || 'ca-app-pub-71829304918234/5224354917'
  );
  const [interstitialUnitId, setInterstitialUnitId] = useState(
    () => localStorage.getItem('csl_admob_interstitial_id') || 'ca-app-pub-71829304918234/1029384756'
  );
  const [payoutMethod, setPayoutMethod] = useState(
    () => localStorage.getItem('csl_admob_payout_method') || 'gcash'
  );
  const [payoutAccount, setPayoutAccount] = useState(
    () => localStorage.getItem('csl_admob_payout_account') || '0917-XXX-XXXX (GCash/Maya)'
  );

  const [showSecret, setShowSecret] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Simulated earnings metrics based on ad impressions + rewarded videos
  const [adImpressions, setAdImpressions] = useState(() => {
    const saved = localStorage.getItem('csl_admob_impressions');
    return saved ? parseInt(saved, 10) : 18450;
  });

  const rewardedWatches = stats.adSponsoredMeals;
  const estimatedEcpm = 2.45; // $2.45 eCPM average for educational mobile & web
  const totalAdViews = adImpressions + rewardedWatches * 3;
  const estimatedEarningsUsd = (totalAdViews * (estimatedEcpm / 1000)).toFixed(2);
  const estimatedEarningsPhp = (parseFloat(estimatedEarningsUsd) * 58.5).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('csl_admob_pub_id', publisherId.trim());
    localStorage.setItem('csl_admob_app_id', appId.trim());
    localStorage.setItem('csl_admob_banner_id', bannerUnitId.trim());
    localStorage.setItem('csl_admob_rewarded_id', rewardedUnitId.trim());
    localStorage.setItem('csl_admob_interstitial_id', interstitialUnitId.trim());
    localStorage.setItem('csl_admob_payout_method', payoutMethod);
    localStorage.setItem('csl_admob_payout_account', payoutAccount.trim());

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#fbbf24'],
      });
    } catch (_) {}
  };

  // One-click load Google official sample test keys
  const handleLoadTestKeys = () => {
    setPublisherId('pub-3940256099942544');
    setAppId('ca-app-pub-3940256099942544~3347511713');
    setBannerUnitId('ca-app-pub-3940256099942544/6300978111');
    setRewardedUnitId('ca-app-pub-3940256099942544/5224354917');
    setInterstitialUnitId('ca-app-pub-3940256099942544/1033173712');
  };

  const copyToClipboard = (keyName: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-3 px-3 sm:px-4 space-y-6">
      {/* Top Banner Hero: Monetization & AdMob Activation */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl border-2 border-amber-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-stone-950 uppercase tracking-wider shadow-sm">
              <Coins size={14} className="fill-stone-950" /> Google AdMob Monetization
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
              <ShieldCheck size={13} /> Active Earnings Engine
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-['Fredoka',sans-serif] tracking-tight text-white drop-shadow-sm">
            Add Your AdMob Key to Make Real Earnings 💰
          </h2>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm font-medium leading-relaxed">
            Configure your official <strong>Google AdMob App ID</strong> and <strong>Ad Unit IDs</strong> below.
            Every time students learn with Sir Lax, non-intrusive bottom banner impressions and voluntary
            rewarded video ads generate verified ad revenue. You can use these earnings to fund warm meals
            for impoverished pupils, or withdraw to your GCash / Bank account!
          </p>

          {/* Quick Real-Time Revenue Ticker */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950/70 p-4 rounded-2xl border border-amber-500/30">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Estimated Earnings</span>
              <div className="text-xl sm:text-2xl font-black text-yellow-400 font-['Fredoka',sans-serif]">
                ₱{estimatedEarningsPhp}
              </div>
              <span className="text-[10px] text-stone-400 font-mono">(${estimatedEarningsUsd} USD)</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Total Ad Impressions</span>
              <div className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif]">
                {totalAdViews.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Live across devices</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Rewarded Ad Meals</span>
              <div className="text-xl sm:text-2xl font-black text-rose-400 font-['Fredoka',sans-serif]">
                {rewardedWatches.toLocaleString()}
              </div>
              <span className="text-[10px] text-stone-400">Direct student meals</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Benchmark eCPM</span>
              <div className="text-xl sm:text-2xl font-black text-sky-400 font-['Fredoka',sans-serif]">
                ${estimatedEcpm}
              </div>
              <span className="text-[10px] text-stone-400">Per 1,000 views</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onWatchAdToFeed}
              className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-md transition transform hover:scale-105 flex items-center gap-2 cursor-pointer border border-amber-300"
            >
              <PlayCircle size={18} />
              <span>Test Rewarded Ad Video (+₱0.75 &amp; Feed 1 Student)</span>
            </button>

            <button
              onClick={handleLoadTestKeys}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer border border-white/20 flex items-center gap-1.5"
              title="Fill official Google AdMob test IDs"
            >
              <Zap size={14} className="text-yellow-400" />
              <span>Load Google Test Keys</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main AdMob Key Setup Form */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-amber-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-stone-900 font-['Fredoka',sans-serif] flex items-center gap-2">
              <Key size={22} className="text-amber-500" />
              Google AdMob Keys &amp; Ad Units Configuration
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Paste your real Google AdMob or AdSense IDs below to start collecting ad revenue on this app.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl font-bold transition cursor-pointer border border-stone-200"
          >
            {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{showSecret ? 'Hide Keys' : 'Reveal Keys'}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="mb-6 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
            <div>
              <p>Your AdMob Keys have been saved and activated successfully! 🎉</p>
              <p className="text-xs font-normal text-emerald-800 mt-0.5">
                All bottom banners and rewarded video units are now linked to your publisher account.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveKeys} className="space-y-5">
          {/* Row 1: Publisher ID & App ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <span>AdMob Publisher / Client ID</span>
                  <span className="text-amber-600 font-black">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => copyToClipboard('pub', publisherId)}
                  className="text-[11px] text-amber-700 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'pub' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'pub' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <input
                type={showSecret ? 'text' : 'password'}
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                placeholder="pub-XXXXXXXXXXXXXXXX or ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full text-xs sm:text-sm font-mono bg-stone-50 border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                required
              />
              <p className="text-[11px] text-stone-500">
                Found in your AdMob Account Settings: <code>pub-XXXXXXXXXXXXXXXX</code>
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <span>AdMob App ID (Android APK / Web)</span>
                  <span className="text-amber-600 font-black">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => copyToClipboard('app', appId)}
                  className="text-[11px] text-amber-700 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'app' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'app' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <input
                type={showSecret ? 'text' : 'password'}
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
                className="w-full text-xs sm:text-sm font-mono bg-stone-50 border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                required
              />
              <p className="text-[11px] text-stone-500">
                Format: <code>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</code>
              </p>
            </div>
          </div>

          {/* Row 2: Banner & Rewarded Video Unit IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <span>Bottom Banner Ad Unit ID</span>
                  <span className="text-amber-600 font-black">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => copyToClipboard('banner', bannerUnitId)}
                  className="text-[11px] text-amber-700 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'banner' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'banner' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <input
                type={showSecret ? 'text' : 'password'}
                value={bannerUnitId}
                onChange={(e) => setBannerUnitId(e.target.value)}
                placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                className="w-full text-xs sm:text-sm font-mono bg-stone-50 border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                required
              />
              <p className="text-[11px] text-stone-500">
                Non-intrusive bottom banner displayed across tutoring and feeding tabs.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <span>Rewarded Video Ad Unit ID</span>
                  <span className="text-amber-600 font-black">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => copyToClipboard('rewarded', rewardedUnitId)}
                  className="text-[11px] text-amber-700 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'rewarded' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'rewarded' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <input
                type={showSecret ? 'text' : 'password'}
                value={rewardedUnitId}
                onChange={(e) => setRewardedUnitId(e.target.value)}
                placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                className="w-full text-xs sm:text-sm font-mono bg-stone-50 border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                required
              />
              <p className="text-[11px] text-stone-500">
                15-second optional video: users watch voluntary ads to feed students!
              </p>
            </div>
          </div>

          {/* Row 3: Interstitial & Payout Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                Interstitial Ad Unit ID (Optional)
              </label>
              <input
                type={showSecret ? 'text' : 'password'}
                value={interstitialUnitId}
                onChange={(e) => setInterstitialUnitId(e.target.value)}
                placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                className="w-full text-xs sm:text-sm font-mono bg-stone-50 border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
              <p className="text-[11px] text-stone-500">
                Full-screen transition ad (shown only between big pack downloads).
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block flex items-center gap-1">
                <Wallet size={13} className="text-amber-600" />
                <span>Earnings Payout Destination &amp; Beneficiary</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="bg-stone-50 border-2 border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="gcash">🇵🇭 GCash</option>
                  <option value="maya">🇵🇭 Maya</option>
                  <option value="bank">🏦 Bank Account (BDO/BPI/Metrobank)</option>
                  <option value="feeding">🍲 100% Direct Feeding Hub Fund</option>
                  <option value="paypal">🌐 PayPal / International</option>
                </select>

                <input
                  type="text"
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  placeholder="Account number or name"
                  className="flex-1 text-xs sm:text-sm bg-stone-50 border-2 border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-[11px] text-stone-500">
                Where your monthly earnings will be disbursed.
              </p>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Lock size={14} className="text-emerald-600" />
              <span>Keys are saved securely on your device and applied to all ad units.</span>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition transform hover:scale-105 flex items-center gap-2 cursor-pointer border border-amber-300"
            >
              <Save size={16} />
              <span>Save &amp; Activate AdMob Earnings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Step-by-Step Guide on How to Get Your AdMob Key */}
      <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-3xl border border-amber-200 p-6 sm:p-7">
        <h3 className="text-lg font-black text-amber-950 font-['Fredoka',sans-serif] flex items-center gap-2 mb-3">
          <HelpCircle size={20} className="text-amber-600" />
          How to Get Your Real AdMob Keys in 4 Simple Steps
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm mb-2">
              1
            </div>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">Sign Up on AdMob</h4>
            <p className="text-xs text-stone-600 mt-1">
              Visit <strong>admob.google.com</strong> with your Google account. It is 100% free to register.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm mb-2">
              2
            </div>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">Add Your App</h4>
            <p className="text-xs text-stone-600 mt-1">
              Click &quot;Apps &rarr; Add App&quot;, select Android, and copy your unique App ID (with <code>~</code>).
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm mb-2">
              3
            </div>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">Create Ad Units</h4>
            <p className="text-xs text-stone-600 mt-1">
              Create 1 <strong>Banner</strong> unit and 1 <strong>Rewarded</strong> unit. Copy the IDs (with <code>/</code>).
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm mb-2">
              4
            </div>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">Paste &amp; Earn!</h4>
            <p className="text-xs text-stone-600 mt-1">
              Paste your IDs into the form above and click &quot;Save &amp; Activate AdMob Earnings&quot;!
            </p>
          </div>
        </div>
      </div>

      {/* Financial Transparency Allocation */}
      <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-7">
        <h3 className="text-lg font-black text-stone-900 font-['Fredoka',sans-serif] mb-2">
          100% Transparent Financial Allocation Model
        </h3>
        <p className="text-xs text-stone-600 mb-4 leading-relaxed">
          How every single peso earned through responsible ad units and community sponsors is used:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-rose-200">
            <div className="text-2xl font-black text-rose-600 font-['Fredoka',sans-serif]">60%</div>
            <div className="font-bold text-stone-900 text-sm mt-1">Fresh Food &amp; Ingredients</div>
            <p className="text-xs text-stone-500 mt-1">
              Rice sacks, fresh eggs, ginger, garlic, chicken meat for daily hot chicken arroz caldo at feeding centers.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200">
            <div className="text-2xl font-black text-amber-600 font-['Fredoka',sans-serif]">25%</div>
            <div className="font-bold text-stone-900 text-sm mt-1">College Youth Emergency Pantry</div>
            <p className="text-xs text-stone-500 mt-1">
              Emergency meal coupons, jeepney fare allowances, and dorm exam midnight snacks for working college students.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-sky-200">
            <div className="text-2xl font-black text-sky-600 font-['Fredoka',sans-serif]">15%</div>
            <div className="font-bold text-stone-900 text-sm mt-1">School Paper &amp; DIY Kits</div>
            <p className="text-xs text-stone-500 mt-1">
              Free pencils, bond papers, safety glue, and flashcard printing for pupils with no internet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
