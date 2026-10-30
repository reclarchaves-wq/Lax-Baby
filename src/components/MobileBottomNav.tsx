import React, { useState } from 'react';
import { TabKey } from './Navigation';
import {
  MessageSquareText,
  HardDrive,
  BookOpenCheck,
  UtensilsCrossed,
  Coins,
  Trophy,
  BarChart3,
  Image as ImageIcon,
  MoreHorizontal,
  X,
  ChevronUp,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  downloadedCount: number;
  unlockedBadgesCount?: number;
  mealsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  downloadedCount,
  unlockedBadgesCount = 0,
  mealsCount = 0,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    {
      id: 'chat' as TabKey,
      label: 'Sir Lax',
      sublabel: 'AI Tutor',
      icon: MessageSquareText,
      badge: '☀️',
    },
    {
      id: 'workspace' as TabKey,
      label: 'Workspace',
      sublabel: 'Docs & Drive',
      icon: HardDrive,
      badge: null,
    },
    {
      id: 'offline-packs' as TabKey,
      label: 'Study DIY',
      sublabel: `${downloadedCount} Ready`,
      icon: BookOpenCheck,
      badge: downloadedCount > 0 ? `${downloadedCount}` : null,
    },
    {
      id: 'feeding' as TabKey,
      label: 'Feed Kids',
      sublabel: 'Outreach',
      icon: UtensilsCrossed,
      badge: mealsCount > 0 ? `${mealsCount}` : null,
    },
    {
      id: 'monetization' as TabKey,
      label: 'Earn ₱',
      sublabel: 'AdMob',
      icon: Coins,
      badge: '💰',
    },
  ];

  const secondaryTabs = [
    {
      id: 'achievements' as TabKey,
      label: 'Student Badges & Milestones',
      description: `${unlockedBadgesCount} unlocked achievements`,
      icon: Trophy,
      badgeColor: 'bg-yellow-400 text-stone-900',
    },
    {
      id: 'dashboard' as TabKey,
      label: 'Community Impact Dashboard',
      description: 'Live food served, donors & students reached',
      icon: BarChart3,
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      id: 'media' as TabKey,
      label: 'Photos & Community Outreach',
      description: 'Gallery of feeding programs and classrooms',
      icon: ImageIcon,
      badgeColor: 'bg-amber-500 text-white',
    },
  ];

  const handleSelectTab = (tab: TabKey) => {
    setActiveTab(tab);
    setIsMoreOpen(false);
  };

  const isSecondaryActive = ['achievements', 'dashboard', 'media'].includes(activeTab);

  return (
    <>
      {/* Slide-Up "More" Sheet */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="absolute inset-0"
            onClick={() => setIsMoreOpen(false)}
            aria-label="Close menu"
          />
          <div className="relative z-10 bg-white rounded-t-3xl p-5 border-t-2 border-amber-300 shadow-2xl max-w-lg mx-auto w-full animate-slide-up">
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div>
                <h3 className="font-extrabold text-stone-900 font-['Fredoka',sans-serif] text-base">
                  More APK Features
                </h3>
                <p className="text-xs text-stone-500">
                  Track student milestones and community feeding
                </p>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {secondaryTabs.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-sm leading-snug">{item.label}</div>
                        <div
                          className={`text-xs ${
                            isSelected ? 'text-amber-100' : 'text-stone-500'
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-amber-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] max-w-lg mx-auto pb-safe">
        <div className="grid grid-cols-6 items-center px-1 py-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition cursor-pointer relative ${
                  isActive
                    ? 'text-amber-600 font-extrabold'
                    : 'text-stone-500 hover:text-stone-800 font-medium'
                }`}
              >
                {/* Active pill background marker */}
                {isActive && (
                  <span className="absolute top-1 w-8 h-1 bg-amber-500 rounded-full" />
                )}

                <div className="relative mt-1">
                  <Icon
                    size={20}
                    className={`transition-transform ${
                      isActive ? 'scale-110 text-amber-600' : 'text-stone-500'
                    }`}
                  />
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-stone-950 font-black text-[9px] px-1 py-0.2 rounded-full ring-1 ring-white">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[56px] text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-xl transition cursor-pointer relative ${
              isSecondaryActive || isMoreOpen
                ? 'text-amber-600 font-extrabold'
                : 'text-stone-500 hover:text-stone-800 font-medium'
            }`}
            title="More Tabs"
          >
            {(isSecondaryActive || isMoreOpen) && (
              <span className="absolute top-1 w-8 h-1 bg-amber-500 rounded-full" />
            )}
            <div className="relative mt-1">
              <MoreHorizontal size={20} />
              {unlockedBadgesCount > 0 && !isSecondaryActive && (
                <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-stone-950 font-black text-[9px] px-1 py-0.2 rounded-full ring-1 ring-white">
                  {unlockedBadgesCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 flex items-center gap-0.5">
              <span>More</span>
              <ChevronUp size={10} />
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
