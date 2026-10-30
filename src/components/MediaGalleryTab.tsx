import React, { useState } from 'react';
import { MediaItem } from '../types';
import { MOCK_GALLERY_ITEMS, SIR_LAX_AVATAR } from '../data/mockData';
import {
  Play,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
  Heart,
  Volume2,
} from 'lucide-react';

export const MediaGalleryTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'video' | 'picture'>('picture');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMediaModal, setActiveMediaModal] = useState<MediaItem | null>(null);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = MOCK_GALLERY_ITEMS.filter((item) => {
    if (item.type !== activeSubTab) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const categories = [
    'all',
    'Feeding Program',
    'Classroom Tutoring',
    'DIY Workshop',
    'College Scholars',
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 px-3 sm:px-4 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 rounded-3xl text-white p-6 sm:p-7 shadow-md">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 uppercase tracking-wider mb-2">
            <Sparkles size={14} className="text-yellow-200" /> Community Evidence &amp; Memories
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka',sans-serif] tracking-tight">
            Videos &amp; Pictures of Hope in Action
          </h2>
          <p className="mt-2 text-amber-100 text-xs sm:text-sm font-medium leading-relaxed">
            See the actual lives changed through Chat Sir Lax: from early grade 1 kids learning their first
            English phonics words, to cauldrons of hot arroz caldo served in barangay gyms, to working college
            scholars receiving their midterm exam study fuel!
          </p>
        </div>
      </div>

      {/* Sub Tabs: Videos vs Pictures */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        {/* Main media switch */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            onClick={() => {
              setActiveSubTab('picture');
              setSelectedCategory('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              activeSubTab === 'picture'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon size={16} />
            <span>Pictures Gallery ({MOCK_GALLERY_ITEMS.filter((i) => i.type === 'picture').length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('video');
              setSelectedCategory('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              activeSubTab === 'video'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <VideoIcon size={16} />
            <span>Videos &amp; Stories ({MOCK_GALLERY_ITEMS.filter((i) => i.type === 'video').length})</span>
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Media Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveMediaModal(item)}
            className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Media Thumbnail Container */}
              <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />

                {/* Video Play badge or Picture icon */}
                {item.type === 'video' ? (
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/25 transition">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                      <Play size={20} className="fill-white ml-1" />
                    </div>
                    {item.duration && (
                      <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        {item.duration}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                    <ImageIcon size={11} /> Photo
                  </div>
                )}

                <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                  {item.category}
                </span>
              </div>

              {/* Caption Content */}
              <div className="p-4">
                <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-700 transition font-['Fredoka',sans-serif]">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {item.impactQuote && (
                  <p className="mt-2 text-[11px] italic text-amber-800 bg-amber-50/80 p-2 rounded-xl border border-amber-200/50">
                    {item.impactQuote}
                  </p>
                )}
              </div>
            </div>

            {/* Footer tags */}
            <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin size={11} className="text-amber-600" />
                {item.location}
              </span>
              <button
                type="button"
                onClick={(e) => toggleLike(item.id, e)}
                className="flex items-center gap-1 font-semibold text-stone-600 hover:text-rose-600 transition"
              >
                <Heart
                  size={14}
                  className={likedItems[item.id] ? 'text-rose-500 fill-rose-500' : ''}
                />
                <span className="text-[11px]">{likedItems[item.id] ? 'Loved' : 'Love'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Media Detail Modal */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  {activeMediaModal.category}
                </span>
                <span className="text-xs text-stone-500 font-semibold">{activeMediaModal.date}</span>
              </div>
              <button
                onClick={() => setActiveMediaModal(null)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Media Body */}
            <div className="overflow-y-auto">
              {activeMediaModal.type === 'video' ? (
                <div className="relative bg-black aspect-video flex items-center justify-center">
                  {activeMediaModal.mediaUrl ? (
                    <video
                      controls
                      autoPlay
                      src={activeMediaModal.mediaUrl}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-6 text-white">
                      <Play size={48} className="mx-auto text-amber-400 mb-2" />
                      <p className="font-bold">Community Video Tutorial</p>
                      <p className="text-xs text-stone-400">Offline video cached on APK</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-stone-900 max-h-[400px] flex items-center justify-center overflow-hidden">
                  <img
                    src={activeMediaModal.thumbnail}
                    alt={activeMediaModal.title}
                    className="max-h-[400px] w-auto object-contain"
                  />
                </div>
              )}

              {/* Modal Text & Story */}
              <div className="p-5 sm:p-6 space-y-3">
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-['Fredoka',sans-serif]">
                  {activeMediaModal.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-rose-500" />
                    {activeMediaModal.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-amber-500" />
                    {activeMediaModal.date}
                  </span>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {activeMediaModal.description}
                </p>

                {activeMediaModal.impactQuote && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl">
                    <p className="text-xs sm:text-sm font-semibold text-amber-950 italic">
                      {activeMediaModal.impactQuote}
                    </p>
                    <span className="block text-[11px] font-bold text-amber-800 mt-1">
                      — Sir Lax &amp; Community Volunteer Team
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-600">
                &ldquo;EDUCATION IS THE KEY FOR CHANGE!&rdquo; 🇵🇭
              </span>
              <button
                onClick={() => setActiveMediaModal(null)}
                className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
