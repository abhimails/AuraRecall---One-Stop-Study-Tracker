import { MilestoneDefinition, MilestoneKey, CategoryOption, Topic } from '../types';
import { addDaysToDate, getTodayISOString } from '../utils/dateUtils';

export const MILESTONES: MilestoneDefinition[] = [
  {
    key: '1d',
    label: '24 Hours',
    shortLabel: '1 Day',
    daysOffset: 1,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    description: 'First review to arrest initial memory decay (within 24 hours).'
  },
  {
    key: '3d',
    label: '72 Hours',
    shortLabel: '3 Days',
    daysOffset: 3,
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    badgeText: 'text-sky-800',
    badgeBorder: 'border-sky-200',
    description: 'Second review to reinforce neural retrieval pathways.'
  },
  {
    key: '7d',
    label: '1 Week',
    shortLabel: '1 Wk',
    daysOffset: 7,
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    description: 'Weekly review to transfer concepts into medium-term memory.'
  },
  {
    key: '90d',
    label: '3 Months',
    shortLabel: '3 Mo',
    daysOffset: 90,
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
    description: 'Quarterly review for long-term schematic integration.'
  },
  {
    key: '180d',
    label: '6 Months',
    shortLabel: '6 Mo',
    daysOffset: 180,
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    description: 'Semi-annual check-in to confirm permanent mastery.'
  },
  {
    key: '365d',
    label: '1 Year',
    shortLabel: '1 Yr',
    daysOffset: 365,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    description: 'Annual refresh to ensure lifelong retention.'
  }
];

export const MILESTONE_KEYS: MilestoneKey[] = ['1d', '3d', '7d', '90d', '180d', '365d'];

export const DEFAULT_CATEGORIES: CategoryOption[] = [
  {
    id: 'python',
    name: 'Python',
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-800',
    colorBorder: 'border-emerald-200',
    iconName: 'Code'
  },
  {
    id: 'sql',
    name: 'SQL',
    colorBg: 'bg-sky-50',
    colorText: 'text-sky-800',
    colorBorder: 'border-sky-200',
    iconName: 'Database'
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-800',
    colorBorder: 'border-amber-200',
    iconName: 'BarChart2'
  },
  {
    id: 'personal',
    name: 'Personal Growth',
    colorBg: 'bg-purple-50',
    colorText: 'text-purple-800',
    colorBorder: 'border-purple-200',
    iconName: 'Sparkles'
  },
  {
    id: 'systemdesign',
    name: 'System Design',
    colorBg: 'bg-indigo-50',
    colorText: 'text-indigo-800',
    colorBorder: 'border-indigo-200',
    iconName: 'Cpu'
  }
];

export const MOTIVATIONAL_QUOTES = [
  {
    quote: "Develop a passion for learning. If you do, you will never cease to grow.",
    author: "Anthony J. D'Angelo"
  },
  {
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    quote: "Repetition is the mother of learning, the father of action, which makes it the architect of accomplishment.",
    author: "Zig Ziglar"
  },
  {
    quote: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma"
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  }
];

export function createMilestonesForDate(baseDateStr: string): Record<MilestoneKey, any> {
  const result: Record<string, any> = {};
  MILESTONES.forEach(m => {
    result[m.key] = {
      key: m.key,
      completed: false,
      scheduledDate: addDaysToDate(baseDateStr, m.daysOffset),
    };
  });
  return result as Record<MilestoneKey, any>;
}

export function getSampleTopics(todayStr: string = getTodayISOString()): Topic[] {
  // Yesterday's topic (1d review is due today!)
  const dateYesterday = addDaysToDate(todayStr, -1);
  const date3DaysAgo = addDaysToDate(todayStr, -3);
  const date7DaysAgo = addDaysToDate(todayStr, -7);

  const t1: Topic = {
    id: 'sample-1',
    title: 'SQL Window Functions & Partitioning',
    category: 'SQL',
    categoryColor: 'bg-sky-50 text-sky-800 border-sky-200',
    notes: 'Q: What is the difference between RANK() and DENSE_RANK()? \nA: RANK() leaves gaps in rank numbers when there are ties, while DENSE_RANK() assigns consecutive rank values without skipping numbers.',
    dateCompleted: dateYesterday,
    createdAt: dateYesterday,
    updatedAt: dateYesterday,
    milestones: createMilestonesForDate(dateYesterday)
  };

  const t2: Topic = {
    id: 'sample-2',
    title: 'Python Decorators & functools.wraps',
    category: 'Python',
    categoryColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    notes: 'Q: Why do we use @functools.wraps(fn) inside a custom decorator?\nA: It preserves the original function metadata like __name__, __doc__, and type annotations.',
    dateCompleted: date3DaysAgo,
    createdAt: date3DaysAgo,
    updatedAt: date3DaysAgo,
    milestones: createMilestonesForDate(date3DaysAgo)
  };

  const t3: Topic = {
    id: 'sample-3',
    title: 'Power BI DAX Calculated Columns vs Measures',
    category: 'Power BI',
    categoryColor: 'bg-amber-50 text-amber-800 border-amber-200',
    notes: 'Q: When should you use a DAX Measure instead of a Calculated Column?\nA: Measures are evaluated dynamically on filter context and do not consume RAM storage, whereas Calculated Columns are pre-computed at model refresh.',
    dateCompleted: date7DaysAgo,
    createdAt: date7DaysAgo,
    updatedAt: date7DaysAgo,
    milestones: createMilestonesForDate(date7DaysAgo)
  };

  // Mark 1d completed for t2 and t3 to simulate realistic progression
  t2.milestones['1d'].completed = true;
  t2.milestones['1d'].completedAt = addDaysToDate(date3DaysAgo, 1);
  t2.milestones['1d'].assessment = 'easy';

  t3.milestones['1d'].completed = true;
  t3.milestones['1d'].completedAt = addDaysToDate(date7DaysAgo, 1);
  t3.milestones['1d'].assessment = 'medium';

  t3.milestones['3d'].completed = true;
  t3.milestones['3d'].completedAt = addDaysToDate(date7DaysAgo, 3);
  t3.milestones['3d'].assessment = 'easy';

  return [t1, t2, t3];
}
