/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabKey } from './components/Navigation';
import { ChatTab } from './components/ChatTab';
import { WorkspaceTab } from './components/WorkspaceTab';
import { OfflinePacksTab } from './components/OfflinePacksTab';
import { FeedingTab } from './components/FeedingTab';
import { MediaGalleryTab } from './components/MediaGalleryTab';
import { DashboardTab } from './components/DashboardTab';
import { AdUnitsTab } from './components/AdUnitsTab';
import { Achievements } from './components/Achievements';
import { RewardedAdModal } from './components/RewardedAdModal';
import { InstallModal } from './components/InstallModal';
import { BottomBannerAd } from './components/BottomBannerAd';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { INITIAL_COMMUNITY_STATS, INITIAL_OFFLINE_PACKS } from './data/mockData';
import { CommunityStats, LanguageMode, OfflineStudyPack, UserActivityStats } from './types';
import { initAuth, googleSignIn, logout } from './services/workspaceService';
import { syncUserProfileToFirestore } from './services/firebase';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('chat');
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  const [language, setLanguage] = useState<LanguageMode>('simple-english');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  // 9:16 Smartphone APK Portrait Mode state (default to true per user request)
  const [is916Active, setIs916Active] = useState<boolean>(() => {
    const saved = localStorage.getItem('csl_916_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const handleToggle916 = (active: boolean) => {
    setIs916Active(active);
    localStorage.setItem('csl_916_mode', String(active));
  };

  // Stats state
  const [stats, setStats] = useState<CommunityStats>(() => {
    const saved = localStorage.getItem('csl_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_COMMUNITY_STATS;
  });

  // Offline packs state
  const [packs, setPacks] = useState<OfflineStudyPack[]>(() => {
    const saved = localStorage.getItem('csl_packs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_OFFLINE_PACKS;
  });

  // User personal achievement stats
  const [userStats, setUserStats] = useState<UserActivityStats>(() => {
    const saved = localStorage.getItem('csl_user_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return {
      homeworksSolved: 7, // Seeded at 7 so the student can easily reach the 10 homeworks solved milestone!
      mealsSponsored: 12,
      packsDownloaded: 2,
      voiceListens: 4,
      diyProjectsViewed: 2,
    };
  });

  // Calculate unlocked badges count dynamically
  const unlockedBadgesCount = [
    userStats.homeworksSolved >= 1,
    userStats.homeworksSolved >= 5,
    userStats.homeworksSolved >= 10,
    userStats.homeworksSolved >= 25,
    userStats.mealsSponsored >= 1,
    userStats.mealsSponsored >= 10,
    userStats.mealsSponsored >= 50,
    userStats.mealsSponsored >= 100,
    userStats.packsDownloaded >= 1,
    userStats.packsDownloaded >= 3,
    userStats.voiceListens >= 3,
    userStats.diyProjectsViewed >= 1,
  ].filter(Boolean).length;

  // Modals
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isRewardedAdModalOpen, setIsRewardedAdModalOpen] = useState(false);

  // Google Workspace User State
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sync Google Workspace & Firebase Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
        syncUserProfileToFirestore(currentUser.uid, {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          stats: userStats,
        });
      },
      () => {
        setUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [userStats]);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setUser(res.user);
        syncUserProfileToFirestore(res.user.uid, {
          displayName: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          stats: userStats,
        });
      }
    } catch (err: any) {
      console.warn('Google Workspace sign in error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Sync online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch live stats from server if online
  useEffect(() => {
    if (!isOffline) {
      fetch('/api/impact')
        .then((res) => res.json())
        .then((data) => {
          if (data?.stats) {
            setStats(data.stats);
            localStorage.setItem('csl_stats', JSON.stringify(data.stats));
          }
        })
        .catch((err) => console.log('Loaded local stats cache:', err));
    }
  }, [isOffline]);

  // Handle toggling pack download
  const handleToggleDownloadPack = (packId: string) => {
    setPacks((prev) => {
      const next = prev.map((p) => {
        if (p.id === packId) {
          const newState = !p.downloaded;
          if (newState) {
            try {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#0284c7', '#38bdf8', '#fbbf24'],
              });
            } catch (_) {}
          }
          return { ...p, downloaded: newState };
        }
        return p;
      });
      localStorage.setItem('csl_packs', JSON.stringify(next));
      return next;
    });

    setStats((prev) => {
      const updated = {
        ...prev,
        offlinePacksDownloaded: prev.offlinePacksDownloaded + 1,
      };
      localStorage.setItem('csl_stats', JSON.stringify(updated));
      return updated;
    });

    setUserStats((prev) => {
      const updated = {
        ...prev,
        packsDownloaded: prev.packsDownloaded + 1,
      };
      localStorage.setItem('csl_user_stats', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle sponsoring meals
  const handleSponsorMeal = (count: number, donorName?: string) => {
    setStats((prev) => {
      const updated = {
        ...prev,
        mealsServed: prev.mealsServed + count,
      };
      localStorage.setItem('csl_stats', JSON.stringify(updated));
      return updated;
    });

    setUserStats((prev) => {
      const nextMeals = prev.mealsSponsored + count;
      const updated = {
        ...prev,
        mealsSponsored: nextMeals,
      };
      localStorage.setItem('csl_user_stats', JSON.stringify(updated));

      // Check for milestone: 100 Meals Sponsored!
      if (nextMeals >= 100 && prev.mealsSponsored < 100) {
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
          });
        } catch (_) {}
      }
      return updated;
    });

    if (!isOffline) {
      fetch('/api/support-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'direct-sponsor', count, donorName }),
      }).catch((e) => console.log('Offline queue:', e));
    }
  };

  // Handle watching ad to feed
  const handleWatchAdReward = () => {
    setStats((prev) => {
      const updated = {
        ...prev,
        mealsServed: prev.mealsServed + 1,
        adSponsoredMeals: prev.adSponsoredMeals + 1,
      };
      localStorage.setItem('csl_stats', JSON.stringify(updated));
      return updated;
    });

    setUserStats((prev) => {
      const nextMeals = prev.mealsSponsored + 1;
      const updated = {
        ...prev,
        mealsSponsored: nextMeals,
      };
      localStorage.setItem('csl_user_stats', JSON.stringify(updated));

      if (nextMeals >= 100 && prev.mealsSponsored < 100) {
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
          });
        } catch (_) {}
      }
      return updated;
    });

    if (!isOffline) {
      fetch('/api/support-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ad-watch', count: 1 }),
      }).catch((e) => console.log('Offline queue:', e));
    }
  };

  const handleSolveHomework = () => {
    setStats((prev) => {
      const updated = {
        ...prev,
        homeworkSolved: prev.homeworkSolved + 1,
      };
      localStorage.setItem('csl_stats', JSON.stringify(updated));
      return updated;
    });

    setUserStats((prev) => {
      const nextHw = prev.homeworksSolved + 1;
      const updated = {
        ...prev,
        homeworksSolved: nextHw,
      };
      localStorage.setItem('csl_user_stats', JSON.stringify(updated));

      // Check for milestone: 10 Homeworks Solved!
      if (nextHw === 10) {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'],
          });
        } catch (_) {}
      }
      return updated;
    });
  };

  const downloadedCount = packs.filter((p) => p.downloaded).length;

  return (
    <MobileFrameWrapper is916Active={is916Active} onToggle916={handleToggle916}>
      <div className="min-h-full bg-stone-100 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950 relative">
        {/* Header */}
        <Header
          isOffline={isOffline}
          setIsOffline={setIsOffline}
          language={language}
          setLanguage={setLanguage}
          fontSize={fontSize}
          setFontSize={setFontSize}
          onOpenAdUnits={() => setActiveTab('monetization')}
          onOpenFeedModal={() => setActiveTab('feeding')}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenAchievements={() => setActiveTab('achievements')}
          onOpenWorkspace={() => setActiveTab('workspace')}
          onSignIn={handleGoogleSignIn}
          user={user}
          unlockedBadgesCount={unlockedBadgesCount}
          mealsCount={stats.mealsServed}
        />

        {/* Desktop Top Navigation Bar (Hidden in 9:16 Mobile View since MobileBottomNav is active) */}
        {!is916Active && (
          <Navigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            downloadedCount={downloadedCount}
            unlockedBadgesCount={unlockedBadgesCount}
          />
        )}

        {/* Main Tab Content */}
        <main
          className={`flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 py-2 ${
            is916Active ? 'pb-28' : 'pb-16'
          }`}
        >
          {activeTab === 'chat' && (
            <ChatTab
              language={language}
              fontSize={fontSize}
              isForceOffline={isOffline}
              onSolveHomework={handleSolveHomework}
              user={user}
              onOpenWorkspace={() => setActiveTab('workspace')}
              onSignIn={handleGoogleSignIn}
            />
          )}

          {activeTab === 'workspace' && (
            <WorkspaceTab
              user={user}
              onSignIn={handleGoogleSignIn}
              onSignOut={handleSignOut}
              isLoggingIn={isLoggingIn}
            />
          )}

          {activeTab === 'achievements' && (
            <Achievements
              userStats={userStats}
              communityStats={stats}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onSolveHomeworkQuick={handleSolveHomework}
              onSponsorMealQuick={(count) => handleSponsorMeal(count)}
              onWatchAdQuick={() => setIsRewardedAdModalOpen(true)}
            />
          )}

          {activeTab === 'offline-packs' && (
            <OfflinePacksTab
              packs={packs}
              onToggleDownload={handleToggleDownloadPack}
              fontSize={fontSize}
            />
          )}

          {activeTab === 'feeding' && (
            <FeedingTab
              stats={stats}
              onSponsorMeal={handleSponsorMeal}
              onWatchAdToFeed={() => setIsRewardedAdModalOpen(true)}
            />
          )}

          {activeTab === 'media' && <MediaGalleryTab />}

          {activeTab === 'dashboard' && (
            <DashboardTab
              stats={stats}
              onOpenFeedModal={() => setActiveTab('feeding')}
              onWatchAdToFeed={() => setIsRewardedAdModalOpen(true)}
              onNavigateToAchievements={() => setActiveTab('achievements')}
            />
          )}

          {activeTab === 'monetization' && (
            <AdUnitsTab
              stats={stats}
              onWatchAdToFeed={() => setIsRewardedAdModalOpen(true)}
            />
          )}
        </main>

        {/* Non-intrusive Bottom Banner Ad Simulation */}
        <BottomBannerAd
          onWatchAd={() => setIsRewardedAdModalOpen(true)}
          isMobileBottom={is916Active}
        />

        {/* Mobile-First Bottom Navigation Bar (Active in 9:16 mode and on mobile screens) */}
        {is916Active && (
          <MobileBottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            downloadedCount={downloadedCount}
            unlockedBadgesCount={unlockedBadgesCount}
            mealsCount={stats.mealsServed}
          />
        )}

        {/* Footer */}
        {!is916Active && (
          <Footer
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onOpenFeedModal={() => setActiveTab('feeding')}
          />
        )}

        {/* Modals */}
        <RewardedAdModal
          isOpen={isRewardedAdModalOpen}
          onClose={() => setIsRewardedAdModalOpen(false)}
          onCompleted={handleWatchAdReward}
        />

        <InstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />
      </div>
    </MobileFrameWrapper>
  );
}
