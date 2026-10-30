import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronUp, ChevronDown, UtensilsCrossed, Coins } from 'lucide-react';

interface BottomBannerAdProps {
  onWatchAd: () => void;
  onOpenAdUnits?: () => void;
  isMobileBottom?: boolean;
}

export const BottomBannerAd: React.FC<BottomBannerAdProps> = ({
  onWatchAd,
  onOpenAdUnits,
  isMobileBottom = false,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);
  const [bannerId, setBannerId] = useState('ca-app-pub-banner');

  useEffect(() => {
    const saved = localStorage.getItem('csl_admob_banner_id');
    if (saved) {
      setBannerId(saved);
    }
  }, []);

  if (closed) return null;

  return (
    <div
      className={`fixed left-0 right-0 z-20 pointer-events-none flex justify-center px-2 pb-1 transition-all ${
        isMobileBottom ? 'bottom-14 sm:bottom-16' : 'bottom-0'
      }`}
    >
      <div className="pointer-events-auto bg-stone-900/95 backdrop-blur-md text-white border-t sm:border border-amber-400/50 rounded-2xl shadow-xl max-w-2xl w-full p-2.5 sm:px-4 flex items-center justify-between gap-3">
        {!minimized ? (
          <>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
              <div className="truncate">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-300">
                  <span className="flex items-center gap-1">
                    <Coins size={12} className="text-yellow-400" />
                    ADMOB LIVE BANNER
                  </span>
                  <span
                    className="text-[9px] bg-stone-800 px-1.5 py-0.2 rounded font-mono text-stone-400 truncate max-w-[170px]"
                    title={`Ad Unit: ${bannerId}`}
                  >
                    {bannerId}
                  </span>
                </div>
                <p className="text-xs text-stone-200 truncate">
                  Monetized for community impact: 100% of revenue provides warm food for pupils.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onWatchAd}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
                title="Watch Rewarded Video to Feed 1 Student"
              >
                <UtensilsCrossed size={12} />
                <span className="hidden sm:inline">Feed Student</span>
              </button>

              <button
                onClick={() => setMinimized(true)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
                title="Minimize banner"
              >
                <ChevronDown size={15} />
              </button>

              <button
                onClick={() => setClosed(true)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
                title="Close ad"
              >
                <X size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full text-xs">
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <Sparkles size={13} /> AdMob Active: Supporting Student Feeding Program
            </span>
            <button
              onClick={() => setMinimized(false)}
              className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 px-2 py-0.5 rounded cursor-pointer font-bold"
            >
              Expand
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
