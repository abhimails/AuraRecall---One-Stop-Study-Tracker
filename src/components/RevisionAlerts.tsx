import React, { useState } from 'react';
import { Bell, CheckCircle2, Check, Eye, EyeOff, Sparkles, BookOpen, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Topic, MilestoneKey, SelfAssessment } from '../types';
import { MILESTONES } from '../constants/milestones';
import { formatDateFriendly } from '../utils/dateUtils';

interface DueItem {
  topic: Topic;
  milestoneKey: MilestoneKey;
  milestoneLabel: string;
  badgeStyle: string;
  scheduledDate: string;
  isOverdue: boolean;
}

interface RevisionAlertsProps {
  topics: Topic[];
  currentDate: string;
  onCompleteRevision: (topicId: string, milestoneKey: MilestoneKey, assessment: SelfAssessment) => void;
}

export const RevisionAlerts: React.FC<RevisionAlertsProps> = ({
  topics,
  currentDate,
  onCompleteRevision,
}) => {
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Compute due items
  const dueItems: DueItem[] = [];

  topics.forEach((topic) => {
    MILESTONES.forEach((m) => {
      const review = topic.milestones[m.key];
      if (review && !review.completed && review.scheduledDate <= currentDate) {
        dueItems.push({
          topic,
          milestoneKey: m.key,
          milestoneLabel: m.label,
          badgeStyle: `${m.badgeBg} ${m.badgeText} ${m.badgeBorder}`,
          scheduledDate: review.scheduledDate,
          isOverdue: review.scheduledDate < currentDate,
        });
      }
    });
  });

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#818cf8', '#34d399', '#fbbf24', '#f472b6'],
      });
    } catch {
      // ignore in iframe restriction if any
    }
  };

  const handleAssessment = (item: DueItem, assessment: SelfAssessment) => {
    triggerConfetti();
    onCompleteRevision(item.topic.id, item.milestoneKey, assessment);
  };

  const toggleNotes = (itemId: string) => {
    setExpandedNotes((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const toggleAnswer = (itemId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-stone-800 tracking-tight">
              Today's Revision Alerts
            </h2>
          </div>
          {dueItems.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {dueItems.length} {dueItems.length === 1 ? 'topic' : 'topics'} due
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500 mb-5">
          Consistent revision is the secret to moving information to long-term memory.
        </p>

        {dueItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-4">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-stone-800 mb-1">You're all caught up!</h3>
            <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
              No revisions due today. Log new study sessions or check the simulator below to plan ahead!
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {dueItems.map((item) => {
              const itemUniqueId = `${item.topic.id}-${item.milestoneKey}`;
              const isNotesOpen = !!expandedNotes[itemUniqueId];
              const isAnswerRevealed = !!revealedAnswers[itemUniqueId];

              return (
                <div
                  key={itemUniqueId}
                  className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/40 hover:bg-white hover:border-indigo-200 transition-all shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${item.badgeStyle}`}
                      >
                        {item.milestoneLabel}
                      </span>
                      {item.isOverdue && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Overdue
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200/60 text-stone-700 font-medium">
                        {item.topic.category}
                      </span>
                    </div>

                    <span className="text-xs text-stone-400">
                      Scheduled: {formatDateFriendly(item.scheduledDate, currentDate)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-800 mb-2">{item.topic.title}</h3>

                  {item.topic.notes && (
                    <div className="mb-3">
                      <button
                        onClick={() => toggleNotes(itemUniqueId)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {isNotesOpen ? 'Hide Active Recall Notes' : 'Test Active Recall Notes'}
                      </button>

                      {isNotesOpen && (
                        <div className="mt-2 p-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 space-y-2">
                          <p className="whitespace-pre-wrap font-sans leading-relaxed">
                            {item.topic.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-stone-500">
                      Rate Recall Difficulty:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAssessment(item, 'easy')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100/80 text-emerald-800 hover:bg-emerald-200 border border-emerald-300/60 transition-colors"
                      >
                        Easy
                      </button>
                      <button
                        onClick={() => handleAssessment(item, 'medium')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100/80 text-amber-800 hover:bg-amber-200 border border-amber-300/60 transition-colors"
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => handleAssessment(item, 'hard')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-100/80 text-rose-800 hover:bg-rose-200 border border-rose-300/60 transition-colors"
                      >
                        Hard
                      </button>
                    </div>
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
