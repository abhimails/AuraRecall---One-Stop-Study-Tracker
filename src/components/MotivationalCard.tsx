import React, { useState } from 'react';
import { MOTIVATIONAL_QUOTES } from '../constants/milestones';
import { RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

const MOTIVATIONAL_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    title: 'Minimalist Study Nook & Morning Sunlight',
    author: 'Cozy Focus',
  },
  {
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    title: 'Peaceful Workspace & Open Book',
    author: 'Mindful Study',
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    title: 'Serene Library & Warm Atmosphere',
    author: 'Knowledge Sanctuary',
  },
  {
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    title: 'Structured Notes & Learning Journey',
    author: 'Active Growth',
  },
];

export const MotivationalCard: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex % MOTIVATIONAL_QUOTES.length];
  const currentImage = MOTIVATIONAL_IMAGES[quoteIndex % MOTIVATIONAL_IMAGES.length];

  const handleNext = () => {
    setImageError(false);
    setQuoteIndex((prev) => prev + 1);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/70 shadow-xs flex flex-col justify-between relative group h-full">
      {/* Visual image banner above quote - occupies ~80% height */}
      <div className="relative w-full flex-[4_1_0%] bg-stone-100 overflow-hidden min-h-[280px]">
        {!imageError ? (
          <img
            src={currentImage.url}
            alt={currentImage.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
          />
        ) : (
          /* SVG Fallback if image fails to load */
          <div className="w-full h-full bg-[#f6f2ec] p-6 flex items-center justify-center">
            <svg viewBox="0 0 320 120" className="w-full h-full text-stone-700" fill="none">
              <rect x="120" y="85" width="60" height="12" rx="2" fill="#818cf8" stroke="#4f46e5" strokeWidth="1.2" />
              <rect x="125" y="73" width="50" height="12" rx="2" fill="#fcd34d" stroke="#d97706" strokeWidth="1.2" />
              <circle cx="150" cy="35" r="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/10 to-transparent" />

        {/* Image tag / badge */}
        <div className="absolute bottom-3 left-3 text-white text-[11px] font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/60 backdrop-blur-md border border-white/20 shadow-xs">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>{currentImage.title}</span>
        </div>

        {/* Refresh Quote & Image Button */}
        <button
          onClick={handleNext}
          title="New motivational quote & image"
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 transition-all border border-stone-200/80 shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">New Quote</span>
        </button>
      </div>

      {/* Quote text block - compact ~20% footer */}
      <div className="px-5 py-3.5 text-center bg-white flex flex-col items-center justify-center flex-1 min-h-[75px]">
        <blockquote className="text-xs sm:text-sm font-serif italic text-stone-700 max-w-md leading-snug">
          "{currentQuote.quote}"
        </blockquote>
        <cite className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 mt-1 block not-italic">
          — {currentQuote.author}
        </cite>
      </div>
    </div>
  );
};
