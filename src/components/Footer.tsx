import React from 'react';
import { SIR_LAX_AVATAR } from '../data/mockData';
import { Heart, ShieldCheck, Download, Sparkles, BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenInstallModal: () => void;
  onOpenFeedModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInstallModal, onOpenFeedModal }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t-4 border-amber-500 pt-10 pb-20 px-4 mt-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand identity */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-400 bg-white">
              <img src={SIR_LAX_AVATAR} alt="Sir Lax" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-['Fredoka',sans-serif]">
                Chat Sir Lax (APK &amp; Web)
              </h3>
              <p className="text-xs text-amber-400 font-bold">
                Accessible AI Tutor &bull; Daily Homework &bull; Feeding Drives
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
            &ldquo;EDUCATION IS THE KEY FOR CHANGE!&rdquo; Designed especially for students battling
            language barriers, poverty, and hunger. Ultra-simple English explanations, audio voice reading,
            downloadable offline study packs, and community nourishment for pupils and struggling college scholars.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenInstallModal}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-sm"
            >
              <Download size={14} /> Download APK (Free)
            </button>
            <button
              onClick={onOpenFeedModal}
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer border border-stone-700"
            >
              <Heart size={14} className="text-rose-400" /> Sponsor Meals
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">
            Key Learning Features
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>&bull; Grade 1 Ultra-Simple English &amp; Phonics</li>
            <li>&bull; Step-by-Step Daily Homework Helper</li>
            <li>&bull; Free Zero-Cost Recycled DIY Projects</li>
            <li>&bull; Interactive Voice Assistant for Non-Writers</li>
            <li>&bull; 100% Offline Cache Engine (Zero Data)</li>
          </ul>
        </div>

        {/* Mission & Social Impact */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">
            Social Impact Mission
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>&bull; Hot Arroz Caldo &amp; Egg Feeding Drives</li>
            <li>&bull; College Youth Dorm Midnight Exam Pantries</li>
            <li>&bull; Responsible Ad Units Monetization Model</li>
            <li>&bull; Barangay Community Learning Hubs</li>
            <li>&bull; Free Printable Formula Flashcards</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-stone-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
        <p>&copy; {new Date().getFullYear()} Chat Sir Lax. Built with deep love for Filipino learners and students worldwide.</p>
        <p className="flex items-center gap-1 text-amber-400 font-semibold">
          <ShieldCheck size={14} /> 100% Free Core Educational Service
        </p>
      </div>
    </footer>
  );
};
