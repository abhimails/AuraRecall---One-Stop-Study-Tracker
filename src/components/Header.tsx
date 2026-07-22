import React from 'react';
import { GraduationCap, Flame, Sparkles } from 'lucide-react';

interface HeaderProps {
  streak: number;
  simulatedDate: string;
  isSimulated: boolean;
  onResetSimulatedDate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  simulatedDate,
  isSimulated,
  onResetSimulatedDate,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shadow-sm">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-800 tracking-tight font-serif sm:text-3xl">
              AuraRecall
            </h1>
            {isSimulated && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3" /> Time Travel Active ({simulatedDate})
                <button
                  onClick={onResetSimulatedDate}
                  className="ml-1 text-xs underline hover:text-amber-900 font-normal"
                >
                  Reset
                </button>
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500">
            Your companion for lifelong learning, consistency, and retention.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/90 border border-orange-200/80 rounded-2xl shadow-xs">
          <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-stone-400'}`} />
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold tracking-wider uppercase text-stone-700">
              {streak} DAY STREAK
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
