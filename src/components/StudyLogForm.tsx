import React, { useState } from 'react';
import { Feather, Plus, Check } from 'lucide-react';
import { CategoryOption } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/milestones';

interface StudyLogFormProps {
  onAddTopic: (title: string, category: string, notes: string, dateCompleted: string) => void;
  currentDate: string;
}

export const StudyLogForm: React.FC<StudyLogFormProps> = ({ onAddTopic, currentDate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Python');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [dateCompleted, setDateCompleted] = useState(currentDate);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = isCustomCat && customCategory.trim() ? customCategory.trim() : category;
    onAddTopic(title.trim(), finalCategory, notes.trim(), dateCompleted || currentDate);

    setTitle('');
    setNotes('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Feather className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-stone-800 tracking-tight">
            Log Today's Study
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              WHAT DID YOU STUDY TODAY?
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SQL Joins, Python Decorators, Power BI DAX..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all placeholder:text-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                CATEGORY
              </label>
              {!isCustomCat ? (
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCat(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all appearance-none cursor-pointer pr-8"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    autoFocus
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="New category name"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCat(false)}
                    className="px-2.5 py-2 text-xs bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-600 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                DATE STUDIED
              </label>
              <input
                type="date"
                required
                value={dateCompleted}
                onChange={(e) => setDateCompleted(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              KEY POINTS / TAKEAWAYS (OPTIONAL)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Summarize key details or active recall questions to test yourself during revision..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all placeholder:text-stone-400 resize-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
              submitted
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white active:scale-[0.99]'
            }`}
          >
            {submitted ? (
              <>
                <Check className="w-4 h-4" /> Added to Study Log!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add to Study Log
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
