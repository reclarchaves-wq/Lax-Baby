import React from 'react';
import { MessageSquareText, BookOpenCheck, UtensilsCrossed, Image as ImageIcon, BarChart3, Coins, Trophy, HardDrive } from 'lucide-react';

export type TabKey = 'chat' | 'workspace' | 'offline-packs' | 'feeding' | 'media' | 'dashboard' | 'achievements' | 'monetization';

interface NavigationProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  downloadedCount: number;
  unlockedBadgesCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  downloadedCount,
  unlockedBadgesCount = 0,
}) => {
  const tabs = [
    {
      id: 'chat' as TabKey,
      label: 'Chat Sir Lax',
      icon: MessageSquareText,
      badge: 'Ask Anything ☀️',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black ring-1 ring-amber-300',
    },
    {
      id: 'workspace' as TabKey,
      label: 'Google Workspace',
      icon: HardDrive,
      badge: 'Drive • Docs',
      badgeColor: 'bg-blue-600 text-white font-bold',
    },
    {
      id: 'achievements' as TabKey,
      label: 'Achievements',
      icon: Trophy,
      badge: `${unlockedBadgesCount} Badges`,
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'offline-packs' as TabKey,
      label: 'Study Packs & DIY',
      icon: BookOpenCheck,
      badge: `${downloadedCount} Ready`,
      badgeColor: 'bg-sky-500 text-white',
    },
    {
      id: 'feeding' as TabKey,
      label: 'Feeding Programs',
      icon: UtensilsCrossed,
      badge: 'Kids & College',
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'media' as TabKey,
      label: 'Videos & Pictures',
      icon: ImageIcon,
      badge: 'Outreach',
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'dashboard' as TabKey,
      label: 'Community Impact',
      icon: BarChart3,
      badge: 'Dashboard',
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      id: 'monetization' as TabKey,
      label: 'AdMob & Earnings',
      icon: Coins,
      badge: 'Earn 💰',
      badgeColor: 'bg-emerald-600 text-white font-black',
    },
  ];

  return (
    <nav className="bg-white border-b border-amber-200 sticky top-[80px] sm:top-[88px] z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                    : 'text-stone-600 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-white' : 'text-amber-600'} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
