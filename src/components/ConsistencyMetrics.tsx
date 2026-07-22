import React from 'react';
import { TrendingUp, Award, BarChart2 } from 'lucide-react';
import { RetentionStats } from '../types';
import { MILESTONES } from '../constants/milestones';

interface ConsistencyMetricsProps {
  stats: RetentionStats;
}

export const ConsistencyMetrics: React.FC<ConsistencyMetricsProps> = ({ stats }) => {
  const categoryTotal = (Object.values(stats.categoryCounts) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs space-y-5">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-bold text-stone-800 tracking-tight">
          Consistency Metrics
        </h2>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/80 text-center">
          <div className="text-2xl font-bold font-serif text-indigo-600 mb-0.5">
            {stats.totalTopics}
          </div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-stone-400">
            TOPICS STUDIED
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/80 text-center">
          <div className="text-2xl font-bold font-serif text-indigo-600 mb-0.5">
            {stats.totalRevisionsCompleted}
          </div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-stone-400">
            REVISIONS MADE
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/80 text-center">
          <div className="text-2xl font-bold font-serif text-indigo-600 mb-0.5">
            {stats.retentionIndex}%
          </div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-stone-400">
            RETENTION INDEX
          </div>
        </div>
      </div>

      <hr className="border-stone-100" />

      {/* Cadence Breakdown */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
          REVISIONS COMPLETED BY CADENCE
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          {MILESTONES.map((m) => {
            const count = stats.cadenceCounts[m.key] || 0;
            return (
              <div
                key={m.key}
                className="p-3 rounded-2xl bg-stone-50/60 border border-stone-200/60 text-center hover:bg-stone-50 transition-colors"
              >
                <div className="text-[11px] font-semibold text-stone-500 mb-0.5">{m.label}</div>
                <div className="text-lg font-bold text-stone-800">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-stone-100" />

      {/* Study Balance by Category */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
          STUDY BALANCE (BY CATEGORY)
        </h3>
        {categoryTotal === 0 ? (
          <p className="text-xs italic text-stone-400">Log some topics to see balance.</p>
        ) : (
          <div className="space-y-2.5">
            {Object.entries(stats.categoryCounts).map(([cat, countVal]) => {
              const count = Number(countVal);
              const pct = categoryTotal > 0 ? Math.round((count / categoryTotal) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-700">{cat}</span>
                    <span className="text-stone-400 font-medium">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
