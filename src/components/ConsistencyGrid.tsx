import React, { useMemo, useState } from 'react';
import { Calendar, Edit3, RotateCcw, Check, X, Info, Sparkles } from 'lucide-react';
import { Topic } from '../types';
import { addDaysToDate, formatDateFriendly, getDaysDifference } from '../utils/dateUtils';
import { MILESTONE_KEYS } from '../constants/milestones';
import { loadCustomInceptionDate, saveCustomInceptionDate } from '../utils/storage';

interface ConsistencyGridProps {
  topics: Topic[];
  currentDate: string;
}

export const ConsistencyGrid: React.FC<ConsistencyGridProps> = ({ topics, currentDate }) => {
  const [hoveredDate, setHoveredDate] = useState<{ date: string; count: number } | null>(null);
  const [customInceptionDate, setCustomInceptionDate] = useState<string | null>(() => loadCustomInceptionDate());
  const [isEditing, setIsEditing] = useState(false);

  // Compute default inception date based on earliest topic entry
  const defaultInceptionDate = useMemo(() => {
    if (!topics || topics.length === 0) return currentDate;
    const dates = topics
      .map((t) => t.dateCompleted)
      .filter(Boolean)
      .sort();
    return dates[0] || currentDate;
  }, [topics, currentDate]);

  const effectiveInceptionDate = customInceptionDate || defaultInceptionDate;
  const isCustomInception = Boolean(customInceptionDate);

  const [inputDate, setInputDate] = useState<string>(effectiveInceptionDate);

  // Calculate days since inception
  const daysSinceInception = Math.max(0, getDaysDifference(currentDate, effectiveInceptionDate));

  // Map dates to activity count
  const dateActivityMap = useMemo(() => {
    const map: Record<string, number> = {};

    topics.forEach((topic) => {
      if (topic.dateCompleted) {
        map[topic.dateCompleted] = (map[topic.dateCompleted] || 0) + 1;
      }
      MILESTONE_KEYS.forEach((mKey) => {
        const rev = topic.milestones[mKey];
        if (rev && rev.completed && rev.completedAt) {
          map[rev.completedAt] = (map[rev.completedAt] || 0) + 1;
        }
      });
    });

    return map;
  }, [topics]);

  // Generate grid starting from effectiveInceptionDate as the very 1st box and moving forward
  const weeksCount = useMemo(() => {
    const daysFromInceptionToNow = Math.max(0, getDaysDifference(currentDate, effectiveInceptionDate));
    const neededDays = daysFromInceptionToNow + 1;
    const neededWeeks = Math.ceil(neededDays / 7);
    return Math.max(22, neededWeeks);
  }, [currentDate, effectiveInceptionDate]);

  const gridDays = useMemo(() => {
    const days: string[] = [];
    const totalDays = weeksCount * 7;
    for (let i = 0; i < totalDays; i++) {
      days.push(addDaysToDate(effectiveInceptionDate, i));
    }
    return days;
  }, [effectiveInceptionDate, weeksCount]);

  const getColorClass = (dateStr: string, count: number) => {
    const isFutureDate = dateStr > currentDate;
    
    if (isFutureDate) {
      if (count > 0) return 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100';
      return 'bg-stone-50/60 border-stone-200/30 hover:border-stone-300';
    }

    if (!count || count === 0) return 'bg-stone-100 border-stone-200/50 hover:border-stone-300';
    if (count === 1) return 'bg-amber-100 border-amber-200 hover:bg-amber-200';
    if (count === 2) return 'bg-amber-300 border-amber-400 hover:bg-amber-400';
    if (count >= 3) return 'bg-indigo-500 border-indigo-600 hover:bg-indigo-600';
    return 'bg-stone-100 border-stone-200/50';
  };

  const handleSaveInception = (newDate: string) => {
    if (!newDate) return;
    saveCustomInceptionDate(newDate);
    setCustomInceptionDate(newDate);
    setIsEditing(false);
  };

  const handleResetInception = () => {
    saveCustomInceptionDate(null);
    setCustomInceptionDate(null);
    setInputDate(defaultInceptionDate);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs space-y-4">
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-stone-800 tracking-tight">
            Consistency Grid
          </h2>

          {/* Inception Date Pill */}
          <div className="flex items-center gap-1.5 bg-stone-100/80 border border-stone-200/70 px-2.5 py-1 rounded-full text-xs text-stone-600 font-medium">
            <span>Inception:</span>
            <span className="font-bold text-stone-800">
              {formatDateFriendly(effectiveInceptionDate, currentDate)}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-semibold tracking-wide uppercase ${
                isCustomInception
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
            >
              {isCustomInception ? 'Custom' : '1st Entry Date'}
            </span>
          </div>

          {/* Edit Inception Date Button */}
          <button
            onClick={() => {
              setInputDate(effectiveInceptionDate);
              setIsEditing(!isEditing);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-stone-600 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-full transition-colors cursor-pointer"
            title="Configure journey inception date"
          >
            <Edit3 className="w-3 h-3 text-indigo-600" />
            <span>{isEditing ? 'Cancel Edit' : 'Set Inception'}</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-stone-100 border border-stone-200 inline-block" title="0 activities" />
            <span className="w-3 h-3 rounded-xs bg-amber-100 border border-amber-200 inline-block" title="1 activity" />
            <span className="w-3 h-3 rounded-xs bg-amber-300 border border-amber-400 inline-block" title="2 activities" />
            <span className="w-3 h-3 rounded-xs bg-indigo-500 border border-indigo-600 inline-block" title="3+ activities" />
          </div>
          <span>More</span>
          <span className="text-stone-300 mx-1">|</span>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <span className="w-2.5 h-2.5 rounded-xs ring-2 ring-indigo-500 bg-indigo-100 inline-block" />
            <span>Inception</span>
            <span className="w-2.5 h-2.5 rounded-xs ring-2 ring-amber-500 bg-amber-100 inline-block ml-1" />
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Expandable Inception Date Config Panel */}
      {isEditing && (
        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-3 animate-fade-in">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Configure Journey Inception Date</span>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="text-stone-400 hover:text-stone-600 p-0.5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            By default, your consistency journey starts on your first study entry date (
            <span className="font-semibold text-stone-700">
              {formatDateFriendly(defaultInceptionDate, currentDate)}
            </span>
            ). You can customize your inception date below to track consistency from a specific milestone.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-xs font-medium text-stone-500">Inception Date:</span>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="text-xs font-semibold text-stone-800 outline-hidden bg-transparent cursor-pointer"
              />
            </div>

            <button
              onClick={() => handleSaveInception(inputDate)}
              disabled={!inputDate}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              Save Inception
            </button>

            {isCustomInception && (
              <button
                onClick={handleResetInception}
                className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset inception date to your earliest recorded study topic"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to 1st Entry ({formatDateFriendly(defaultInceptionDate, currentDate)})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Heatmap Grid View - padded container so ring highlights and edge boxes have full clearance */}
      <div className="relative overflow-x-auto p-3 sm:p-4 border border-stone-100 bg-stone-50/40 rounded-2xl">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-2 min-w-full">
          {gridDays.map((dateStr) => {
            const count = dateActivityMap[dateStr] || 0;
            const isStartDay = dateStr === effectiveInceptionDate;
            const isToday = dateStr === currentDate;

            let ringClass = '';
            if (isStartDay && isToday) {
              ringClass = 'ring-2 ring-indigo-600 ring-offset-2 z-10 font-bold';
            } else if (isStartDay) {
              ringClass = 'ring-2 ring-indigo-500 ring-offset-1.5 z-10';
            } else if (isToday) {
              ringClass = 'ring-2 ring-amber-500 ring-offset-1.5 z-10';
            }

            return (
              <div
                key={dateStr}
                onMouseEnter={() => setHoveredDate({ date: dateStr, count })}
                onMouseLeave={() => setHoveredDate(null)}
                className={`w-3.5 h-3.5 rounded-xs border transition-all cursor-pointer relative ${getColorClass(
                  dateStr,
                  count
                )} ${ringClass}`}
                title={`${formatDateFriendly(dateStr, currentDate)}${
                  isStartDay ? ' (Inception Date)' : ''
                }${isToday ? ' (Today)' : ''}: ${count} study/revision ${count === 1 ? 'activity' : 'activities'}`}
              />
            );
          })}
        </div>

        {/* Hover date indicator & summary stats */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2 pt-1 border-t border-stone-200/40">
          {hoveredDate ? (
            <div className="font-medium text-stone-600 bg-white border border-stone-200/80 inline-block px-3 py-1 rounded-lg shadow-2xs">
              {formatDateFriendly(hoveredDate.date, currentDate)}: {' '}
              <span className="font-bold text-stone-800">
                {hoveredDate.count} {hoveredDate.count === 1 ? 'activity' : 'activities'}
              </span>
              {hoveredDate.date === effectiveInceptionDate && (
                <span className="ml-1.5 text-indigo-600 font-semibold">(Inception Date)</span>
              )}
              {hoveredDate.date === currentDate && (
                <span className="ml-1.5 text-amber-600 font-semibold">(Today)</span>
              )}
            </div>
          ) : (
            <div className="italic text-stone-400 text-[11px]">
              Hover over a square to view detailed activity counts.
            </div>
          )}

          <div className="text-[11px] font-medium text-stone-400">
            Journey duration: <span className="font-bold text-stone-700">{daysSinceInception + 1} days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

