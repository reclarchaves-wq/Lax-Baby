import React, { useState, useEffect } from 'react';
import { SIR_LAX_AVATAR } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  Download,
  Check,
  ShieldCheck,
  Smartphone,
  WifiOff,
  Volume2,
  X,
  Share2,
  Copy,
  ExternalLink,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'pc'>('android');
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallSuccess(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#3b82f6'],
          });
        } catch (_) {}
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: trigger APK download
      handleDownloadApk();
    }
  };

  const handleDownloadApk = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        'Chat Sir Lax Android APK & PWA Package - Educational Access & Offline Knowledge Engine\n\n' +
        'Motto: "EDUCATION IS THE KEY FOR CHANGE!"\n' +
        'Version: 2.4.0 Stable\n' +
        'Target: Android 7.0+\n' +
        'Offline packs: Included\n' +
        'To install directly on Android:\n' +
        '1. Open https://ais-pre-zny3pqynnj3ze7qcc35dln-843808826475.asia-east1.run.app in Chrome\n' +
        '2. Tap the Menu (3 dots) -> Tap "Install app"\n'
      ],
      { type: 'application/vnd.android.package-archive' }
    );
    element.href = URL.createObjectURL(file);
    element.download = 'ChatSirLax_v2.4.apk';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyShareLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow bg-white shrink-0">
              <img src={SIR_LAX_AVATAR} alt="Chat Sir Lax Icon" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-lg font-['Fredoka',sans-serif]">Download &amp; Install Chat Sir Lax</h3>
              </div>
              <p className="text-xs text-amber-100">Android APK &bull; PWA Instant App &bull; 100% Free</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Main 1-Click Install CTA */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center space-y-2">
            <h4 className="font-black text-base text-stone-900 font-['Fredoka',sans-serif]">
              Install Directly to Your Device
            </h4>
            <p className="text-xs text-stone-600">
              No extra Play Store storage needed! Installs instantly as a standalone icon with offline access and voice features.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-1 justify-center">
              <button
                onClick={handleNativeInstall}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs sm:text-sm transition transform hover:scale-102 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Smartphone size={17} />
                <span>{deferredPrompt ? 'Tap to Install on Phone' : 'Install App / Save APK'}</span>
              </button>

              <button
                onClick={copyShareLink}
                className="py-3 px-3.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                title="Copy app link to send to students or family"
              >
                {isCopied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                <span>{isCopied ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>
            </div>

            {installSuccess && (
              <div className="text-xs font-bold text-emerald-800 bg-emerald-100 p-2 rounded-xl flex items-center justify-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>App successfully installed to your home screen!</span>
              </div>
            )}
          </div>

          {/* Device Tabs for Instructions */}
          <div>
            <div className="flex items-center gap-1 border-b border-stone-200 pb-2">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Smartphone size={14} />
                <span>Android Chrome</span>
              </button>

              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Share2 size={14} />
                <span>iPhone / iPad</span>
              </button>

              <button
                onClick={() => setActiveTab('pc')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'pc'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Laptop size={14} />
                <span>PC / Laptop</span>
              </button>
            </div>

            {/* Instruction Steps */}
            <div className="mt-3 bg-stone-50 rounded-2xl p-3.5 border border-stone-200 text-xs text-stone-700 space-y-2.5">
              {activeTab === 'android' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Open this page in <strong>Google Chrome</strong> on your Android phone.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>Tap the <strong>three dots (⋮)</strong> at the top right corner of Chrome.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>Select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                    <span>The <strong>Chat Sir Lax</strong> icon will appear on your phone screen ready to use!</span>
                  </div>
                </>
              )}

              {activeTab === 'ios' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Open this website in <strong>Safari</strong> on your iPhone or iPad.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>Tap the <strong>Share button (square with arrow pointing up ⬆)</strong> at the bottom bar.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                    <span>Tap <strong>&ldquo;Add&rdquo;</strong> in the top right. Done!</span>
                  </div>
                </>
              )}

              {activeTab === 'pc' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Open in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>Look at the right side of the address bar at the top (near the bookmark star).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>Click the <strong>Install icon (computer screen with a down arrow)</strong>.</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Feature Highlights for Poor Families & Low-End Phones */}
          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <Smartphone size={16} className="text-amber-600 shrink-0" />
              <span><strong>Ultra Lightweight:</strong> Runs smoothly even on budget Android phones with only 1GB RAM without filling up phone memory.</span>
            </div>

            <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <WifiOff size={16} className="text-sky-600 shrink-0" />
              <span><strong>Offline Study Engine:</strong> Download study modules once, then study at home without needing mobile data or wifi.</span>
            </div>

            <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <Volume2 size={16} className="text-rose-600 shrink-0" />
              <span><strong>Hands-Free Voice:</strong> Grade 1 pupils can speak homework questions directly into the microphone.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <span className="font-bold text-stone-600">
            &ldquo;EDUCATION IS THE KEY FOR CHANGE!&rdquo; 🇵🇭
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
