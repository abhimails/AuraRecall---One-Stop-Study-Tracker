import React, { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Topic } from '../types';
import { addDaysToDate, formatDateFriendly, getDaysDifference } from '../utils/dateUtils';
import { MILESTONE_KEYS } from '../constants/milestones';

interface ConsistencyGridProps {
  topics: Topic[];
  currentDate: string;
}

export const ConsistencyGrid: React.FC<ConsistencyGridProps> = ({ topics, currentDate }) => {
  const [hoveredDate, setHoveredDate] = useState<{ date: string; count: number } | null>(null);

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

  // Generate grid for past 20 weeks (~140 days)
  const weeksCount = 22;
  const gridDays = useMemo(() => {
    const days: string[] = [];
    // Start from currentDate and go back 22 weeks * 7 days
    const totalDays = weeksCount * 7;
    for (let i = totalDays - 1; i >= 0; i--) {
      days.push(addDaysToDate(currentDate, -i));
    }
    return days;
  }, [currentDate, weeksCount]);

  const getColorClass = (count: number) => {
    if (!count || count === 0) return 'bg-stone-100 border-stone-200/50 hover:border-stone-300';
    if (count === 1) return 'bg-amber-100 border-amber-200 hover:bg-amber-200';
    if (count === 2) return 'bg-amber-300 border-amber-400 hover:bg-amber-400';
    if (count >= 3) return 'bg-indigo-500 border-indigo-600 hover:bg-indigo-600';
    return 'bg-stone-100 border-stone-200/50';
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-stone-800 tracking-tight">
            Consistency Grid (Since Inception)
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-stone-100 border border-stone-200 inline-block" />
            <span className="w-3 h-3 rounded-xs bg-amber-100 border border-amber-200 inline-block" />
            <span className="w-3 h-3 rounded-xs bg-amber-300 border border-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-xs bg-indigo-500 border border-indigo-600 inline-block" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-2">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-full">
          {gridDays.map((dateStr) => {
            const count = dateActivityMap[dateStr] || 0;
            return (
              <div
                key={dateStr}
                onMouseEnter={() => setHoveredDate({ date: dateStr, count })}
                onMouseLeave={() => setHoveredDate(null)}
                className={`w-3.5 h-3.5 rounded-xs border transition-all cursor-pointer ${getColorClass(
                  count
                )}`}
                title={`${formatDateFriendly(dateStr, currentDate)}: ${count} study/revision ${
                  count === 1 ? 'activity' : 'activities'
                }`}
              />
            );
          })}
        </div>

        {hoveredDate && (
          <div className="mt-2 text-xs font-medium text-stone-600 bg-stone-50 border border-stone-200 inline-block px-3 py-1 rounded-lg">
            {formatDateFriendly(hoveredDate.date, currentDate)}:{' '}
            <span className="font-bold text-stone-800">
              {hoveredDate.count} {hoveredDate.count === 1 ? 'activity' : 'activities'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
