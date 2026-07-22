import React, { useState } from 'react';
import { BookOpen, Search, Filter, CheckCircle2, Check, Clock, Trash2, Edit3, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Topic, MilestoneKey, SelfAssessment } from '../types';
import { MILESTONES } from '../constants/milestones';
import { DEFAULT_CATEGORIES } from '../constants/milestones';
import { formatDateFriendly } from '../utils/dateUtils';

interface StudyJourneyProps {
  topics: Topic[];
  currentDate: string;
  onDeleteTopic: (topicId: string) => void;
  onCompleteRevision: (topicId: string, milestoneKey: MilestoneKey, assessment: SelfAssessment) => void;
  onEditTopic: (topic: Topic) => void;
}

export const StudyJourney: React.FC<StudyJourneyProps> = ({
  topics,
  currentDate,
  onDeleteTopic,
  onCompleteRevision,
  onEditTopic,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'due' | 'completed'>('all');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  // Filter topics
  const filteredTopics = topics.filter((topic) => {
    // Search
    if (
      searchTerm.trim() &&
      !topic.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !topic.notes.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Category
    if (selectedCategory !== 'All Categories' && topic.category !== selectedCategory) {
      return false;
    }

    // Status
    if (selectedStatus === 'due') {
      const hasDue = MILESTONES.some((m) => {
        const rev = topic.milestones[m.key];
        return rev && !rev.completed && rev.scheduledDate <= currentDate;
      });
      if (!hasDue) return false;
    } else if (selectedStatus === 'completed') {
      const allDone = MILESTONES.every((m) => {
        const rev = topic.milestones[m.key];
        return rev && rev.completed;
      });
      if (!allDone) return false;
    }

    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-stone-800 tracking-tight">
            My Study Journey
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
            {topics.length} {topics.length === 1 ? 'topic' : 'topics'}
          </span>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 cursor-pointer pr-8 appearance-none"
            >
              <option value="All Categories">All Categories</option>
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 cursor-pointer pr-8 appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="due">Due / Overdue</option>
              <option value="completed">All Milestones Done</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-800 mb-1">Start Your Study Journey</h3>
          <p className="text-xs text-stone-500 max-w-md leading-relaxed">
            Log what you studied today in the form on the left, and we'll calculate your spaced repetition schedule.
          </p>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="p-8 text-center text-xs text-stone-500 italic bg-stone-50/50 rounded-2xl border border-stone-200">
          No topics match your current filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/30 hover:bg-white transition-all shadow-2xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-stone-200/60 text-stone-700">
                        {topic.category}
                      </span>
                      <span className="text-xs text-stone-400">
                        Studied: {formatDateFriendly(topic.dateCompleted, currentDate)}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-800">{topic.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                      className="text-xs text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors flex items-center gap-1 font-medium"
                    >
                      {isExpanded ? 'Hide Notes' : 'View Notes'}
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {deletingTopicId === topic.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-xl animate-fade-in">
                        <span className="text-[11px] font-semibold text-rose-800 px-1">Delete?</span>
                        <button
                          onClick={() => {
                            onDeleteTopic(topic.id);
                            setDeletingTopicId(null);
                          }}
                          className="px-2 py-0.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeletingTopicId(null)}
                          className="px-2 py-0.5 rounded-lg text-xs font-medium bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingTopicId(topic.id)}
                        title="Delete topic"
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Milestone Cadence Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 my-3">
                  {MILESTONES.map((m) => {
                    const review = topic.milestones[m.key];
                    const isCompleted = review?.completed;
                    const isDue = review && !isCompleted && review.scheduledDate <= currentDate;
                    const isOverdue = review && !isCompleted && review.scheduledDate < currentDate;

                    return (
                      <div
                        key={m.key}
                        className={`p-2.5 rounded-xl border text-center flex flex-col justify-between transition-all ${
                          isCompleted
                            ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800'
                            : isDue
                            ? isOverdue
                              ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
                              : 'bg-indigo-50 border-indigo-300 text-indigo-800'
                            : 'bg-white border-stone-200/70 text-stone-500'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                          {m.shortLabel}
                          {isCompleted && <Check className="w-3 h-3 text-emerald-600" />}
                        </div>

                        <div className="text-[11px] font-medium">
                          {isCompleted ? (
                            <span className="text-emerald-700 font-semibold">Done</span>
                          ) : (
                            <span>{formatDateFriendly(review.scheduledDate, currentDate)}</span>
                          )}
                        </div>

                        {!isCompleted && isDue && (
                          <button
                            onClick={() => onCompleteRevision(topic.id, m.key, 'medium')}
                            className="mt-2 py-1 px-1.5 rounded-lg text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Expanded Notes Section */}
                {isExpanded && topic.notes && (
                  <div className="mt-3 p-4 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">
                    <div className="font-bold uppercase tracking-wider text-stone-400 text-[10px] mb-1">
                      Active Recall Key Points / Takeaways
                    </div>
                    {topic.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
