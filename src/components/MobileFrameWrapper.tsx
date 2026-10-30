import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  is916Active: boolean;
  onToggle916: (active: boolean) => void;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  is916Active,
  onToggle916,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-900 transition-colors duration-300">
      {/* Top Floating Viewport Switcher Banner (Visible especially on desktop) */}
      <div className="bg-stone-950 text-white border-b border-stone-800 px-3 py-1.5 flex items-center justify-between text-xs sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30">
            <Smartphone size={12} />
            Android APK Mode
          </span>
          <span className="hidden md:inline text-stone-400 text-xs">
            9:16 Smartphone Portrait Viewport
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-900 p-0.5 rounded-xl border border-stone-700">
          <button
            onClick={() => onToggle916(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              is916Active
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Switch to 9:16 Smartphone Mockup View"
          >
            <Smartphone size={13} />
            <span>9:16 View</span>
          </button>

          <button
            onClick={() => onToggle916(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              !is916Active
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Switch to Full Responsive Desktop View"
          >
            <Monitor size={13} />
            <span>Full Width</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {is916Active ? (
        <div className="py-2 sm:py-4 px-1 flex justify-center items-center min-h-[calc(100vh-42px)] bg-radial from-stone-900 via-stone-950 to-black select-none">
          {/* 9:16 Smartphone Chassis Container with strict 9:16 aspect ratio */}
          <div className="relative w-full max-w-[430px] aspect-[9/19.5] sm:aspect-[9/16] max-h-[94vh] bg-stone-950 rounded-none sm:rounded-[46px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] border-0 sm:border-[10px] sm:border-stone-850 flex flex-col overflow-hidden ring-1 ring-stone-900 transition-all duration-300">
            {/* Phone Top Speaker & Android Status Bar */}
            <div className="bg-stone-950 text-stone-300 px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-medium tracking-tight shrink-0 select-none border-b border-stone-900/60">
              <span className="font-semibold text-stone-200">{currentTime || '09:41'}</span>
              
              {/* Dynamic Island / Punch Hole Camera */}
              <div className="hidden sm:flex items-center justify-center px-3 py-0.5 bg-stone-900 rounded-full mx-auto ring-1 ring-stone-800">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-950 ring-1 ring-stone-700/50 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-900/60" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-stone-300">
                <span className="text-[10px] text-amber-400 font-bold tracking-wider mr-0.5">5G</span>
                <Signal size={12} className="text-stone-300" />
                <Wifi size={12} className="text-stone-300" />
                <BatteryCharging size={13} className="text-emerald-400" />
              </div>
            </div>

            {/* Smartphone Screen Viewport (Scrollable child content) */}
            <div className="flex-1 overflow-y-auto bg-stone-100 flex flex-col relative no-scrollbar overscroll-contain shadow-inner [touch-action:pan-y]">
              {children}
            </div>

            {/* Android Home Navigation Bar Pill on bottom */}
            <div className="hidden sm:flex bg-stone-950 py-1.5 justify-center shrink-0 border-t border-stone-900/80">
              <div className="w-32 h-1 bg-stone-600/70 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Fullscreen Viewport */
        <div className="min-h-[calc(100vh-42px)] bg-stone-100">
          {children}
        </div>
      )}
    </div>
  );
};
