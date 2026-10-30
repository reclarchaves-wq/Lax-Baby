import React, { useState } from 'react';
import { OfflineStudyPack } from '../types';
import { SpeechService } from '../services/speechService';
import confetti from 'canvas-confetti';
import {
  Download,
  CheckCircle,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Check,
  Scissors,
  Calculator,
  Compass,
  ArrowRight,
  Trash2,
} from 'lucide-react';

interface OfflinePacksTabProps {
  packs: OfflineStudyPack[];
  onToggleDownload: (packId: string) => void;
  fontSize: 'normal' | 'large' | 'huge';
}

export const OfflinePacksTab: React.FC<OfflinePacksTabProps> = ({
  packs,
  onToggleDownload,
  fontSize,
}) => {
  const [selectedPackId, setSelectedPackId] = useState<string>(packs[0]?.id || '');
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [revealedQuiz, setRevealedQuiz] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  const selectedPack = packs.find((p) => p.id === selectedPackId) || packs[0];
  const activeLesson = selectedPack?.content[activeLessonIndex] || selectedPack?.content[0];

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (_) {}
  };

  const toggleQuizAnswer = (key: string) => {
    setRevealedQuiz((prev) => {
      const nextState = !prev[key];
      if (nextState) triggerConfetti();
      return { ...prev, [key]: nextState };
    });
  };

  const handleSpeakLesson = () => {
    if (isSpeaking) {
      SpeechService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!activeLesson) return;

    const fullText = `${activeLesson.title}. ${activeLesson.simpleExplanation}. ${
      activeLesson.steps ? activeLesson.steps.join('. ') : ''
    }. ${activeLesson.example || ''}`;

    setIsSpeaking(true);
    SpeechService.speak(
      fullText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const getFontSizeClass = () => {
    if (fontSize === 'huge') return 'text-lg sm:text-xl';
    if (fontSize === 'large') return 'text-base sm:text-lg';
    return 'text-sm sm:text-base';
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-3 sm:px-4 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 rounded-2xl text-white p-5 sm:p-6 shadow-md border-2 border-sky-400/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 uppercase tracking-wider mb-2">
            <Compass size={14} className="text-yellow-300" /> 100% Offline Accessible
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] tracking-tight">
            Offline Study Packs &amp; DIY Maker Guides
          </h2>
          <p className="mt-2 text-sky-100 text-sm sm:text-base font-medium">
            No internet at home? No mobile load? Don&apos;t worry! Download these bite-sized packs once,
            and study Grade 1-6 fundamentals, math flashcards, and zero-cost DIY projects anytime!
          </p>
        </div>
      </div>

      {/* Packs Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {packs.map((pack) => {
          const isSelected = pack.id === selectedPackId;
          return (
            <div
              key={pack.id}
              onClick={() => {
                setSelectedPackId(pack.id);
                setActiveLessonIndex(0);
                SpeechService.stopSpeaking();
                setIsSpeaking(false);
              }}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/80 shadow-md ring-2 ring-sky-200'
                  : 'border-stone-200 bg-white hover:border-sky-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {pack.grade}
                  </span>
                  <span className="text-xs text-stone-400 font-semibold">{pack.fileSize}</span>
                </div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2">
                  {pack.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2">{pack.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">
                  {pack.lessonsCount} interactive lessons
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDownload(pack.id);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition cursor-pointer ${
                    pack.downloaded
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-sky-500 text-white hover:bg-sky-600'
                  }`}
                  title={pack.downloaded ? 'Saved to phone' : 'Download for offline use'}
                >
                  {pack.downloaded ? (
                    <>
                      <CheckCircle size={13} />
                      <span>Ready</span>
                    </>
                  ) : (
                    <>
                      <Download size={13} />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Pack Interactive Viewer */}
      {selectedPack && (
        <div className="bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden">
          {/* Header of viewer */}
          <div className="bg-sky-50 p-4 border-b border-sky-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-200/80 px-2.5 py-0.5 rounded-full">
                  {selectedPack.category.toUpperCase()} PACK
                </span>
                <h3 className="text-lg sm:text-xl font-black text-stone-900">
                  {selectedPack.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{selectedPack.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakLesson}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
              >
                {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{isSpeaking ? 'Stop Voice' : 'Read Lesson Aloud'}</span>
              </button>
            </div>
          </div>

          {/* Lesson Sub-Tabs */}
          <div className="flex border-b border-stone-200 overflow-x-auto no-scrollbar bg-stone-50/50 p-2 gap-1.5">
            {selectedPack.content.map((lesson, idx) => {
              const isActive = idx === activeLessonIndex;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveLessonIndex(idx);
                    SpeechService.stopSpeaking();
                    setIsSpeaking(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  {lesson.title.split(':')[0] || `Lesson ${idx + 1}`}
                </button>
              );
            })}
          </div>

          {/* Active Lesson Content */}
          {activeLesson && (
            <div className="p-5 sm:p-6 space-y-5">
              <div>
                <h4 className="text-xl font-bold text-stone-900 font-['Fredoka',sans-serif]">
                  {activeLesson.title}
                </h4>
                <p className={`mt-2 font-medium text-stone-800 ${getFontSizeClass()}`}>
                  {activeLesson.simpleExplanation}
                </p>

                {activeLesson.filipinoHint && (
                  <div className="mt-2.5 bg-amber-50 border-l-4 border-amber-400 p-2.5 rounded-r-xl text-xs sm:text-sm text-amber-950 font-medium">
                    🇵🇭 <strong>Paliwanag sa Filipino:</strong> {activeLesson.filipinoHint}
                  </div>
                )}
              </div>

              {/* Steps or Checklist */}
              {activeLesson.steps && activeLesson.steps.length > 0 && (
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                    <CheckCircle size={15} className="text-sky-500" /> Easy Step-by-Step Instructions:
                  </h5>
                  <div className="space-y-2">
                    {activeLesson.steps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-stone-200/70"
                      >
                        <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                          {sIdx + 1}
                        </span>
                        <span className={`text-stone-800 font-medium ${getFontSizeClass()}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real life Example */}
              {activeLesson.example && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700 flex items-center gap-1.5">
                    <Sparkles size={14} /> Real-Life Everyday Example:
                  </p>
                  <p className={`mt-1 font-semibold ${getFontSizeClass()}`}>
                    {activeLesson.example}
                  </p>
                </div>
              )}

              {/* Interactive Mini Quiz */}
              {activeLesson.quizQuestion && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-black uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                        Fun Mini Quiz
                      </span>
                      <p className="mt-1 font-bold text-stone-900 text-sm sm:text-base">
                        ❓ {activeLesson.quizQuestion}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleQuizAnswer(`${selectedPack.id}-${activeLessonIndex}`)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      {revealedQuiz[`${selectedPack.id}-${activeLessonIndex}`]
                        ? 'Hide Answer'
                        : 'Reveal Answer ⭐'}
                    </button>
                  </div>

                  {revealedQuiz[`${selectedPack.id}-${activeLessonIndex}`] && (
                    <div className="mt-3 pt-3 border-t border-amber-200 text-emerald-800 font-bold text-sm bg-white p-2.5 rounded-xl flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Check size={16} className="text-emerald-600 font-bold" />
                        Correct Answer: {activeLesson.quizAnswer}! Ang galing mo!
                      </span>
                      <span className="text-xs text-amber-600 font-medium">Keep shining! 🌟</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
