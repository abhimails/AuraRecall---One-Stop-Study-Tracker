import { Topic, RetentionStats, MilestoneKey } from '../types';
import { MILESTONES, getSampleTopics, MILESTONE_KEYS } from '../constants/milestones';
import { getTodayISOString, getDaysDifference } from './dateUtils';

const STORAGE_KEY_TOPICS = 'aura_recall_topics_v1';
const STORAGE_KEY_SIMULATED_DATE = 'aura_recall_sim_date_v1';

export function loadStoredTopics(): Topic[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOPICS);
    if (!raw) {
      const samples = getSampleTopics();
      saveStoredTopics(samples);
      return samples;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Error loading topics from localStorage:', err);
  }
  const samples = getSampleTopics();
  saveStoredTopics(samples);
  return samples;
}

export function saveStoredTopics(topics: Topic[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TOPICS, JSON.stringify(topics));
  } catch (err) {
    console.error('Error saving topics to localStorage:', err);
  }
}

export function loadSimulatedDate(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SIMULATED_DATE);
    if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) {
      return saved;
    }
  } catch (err) {
    console.error('Error loading simulated date:', err);
  }
  return getTodayISOString();
}

export function saveSimulatedDate(dateStr: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SIMULATED_DATE, dateStr);
  } catch (err) {
    console.error('Error saving simulated date:', err);
  }
}

export function calculateRetentionStats(topics: Topic[], currentDateStr: string): RetentionStats {
  let totalRevisionsCompleted = 0;
  let totalAssessed = 0;
  let scoreSum = 0;

  const cadenceCounts: Record<MilestoneKey, number> = {
    '1d': 0,
    '3d': 0,
    '7d': 0,
    '90d': 0,
    '180d': 0,
    '365d': 0
  };

  const categoryCounts: Record<string, number> = {};

  let dueTodayCount = 0;
  let overdueCount = 0;

  topics.forEach(topic => {
    // Count category balance
    const cat = topic.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    MILESTONE_KEYS.forEach(mKey => {
      const review = topic.milestones[mKey];
      if (!review) return;

      if (review.completed) {
        totalRevisionsCompleted++;
        cadenceCounts[mKey] = (cadenceCounts[mKey] || 0) + 1;

        if (review.assessment) {
          totalAssessed++;
          if (review.assessment === 'easy') scoreSum += 100;
          else if (review.assessment === 'medium') scoreSum += 75;
          else if (review.assessment === 'hard') scoreSum += 40;
        } else {
          totalAssessed++;
          scoreSum += 85; // default completed score
        }
      } else {
        // Check if due or overdue
        if (review.scheduledDate === currentDateStr) {
          dueTodayCount++;
        } else if (review.scheduledDate < currentDateStr) {
          overdueCount++;
        }
      }
    });
  });

  const retentionIndex = totalAssessed > 0 ? Math.round(scoreSum / totalAssessed) : 0;
  const currentStreak = calculateStreak(topics, currentDateStr);

  return {
    totalTopics: topics.length,
    totalRevisionsCompleted,
    retentionIndex,
    dueTodayCount,
    overdueCount,
    cadenceCounts,
    categoryCounts,
    currentStreak,
    longestStreak: Math.max(currentStreak, 5) // aesthetic floor for prototype
  };
}

export function calculateStreak(topics: Topic[], currentDateStr: string): number {
  if (topics.length === 0) return 0;

  // Gather all unique active dates (dates topics were logged or revisions were completed)
  const activeDates = new Set<string>();

  topics.forEach(topic => {
    if (topic.dateCompleted) activeDates.add(topic.dateCompleted);

    MILESTONE_KEYS.forEach(mKey => {
      const rev = topic.milestones[mKey];
      if (rev && rev.completed && rev.completedAt) {
        activeDates.add(rev.completedAt);
      }
    });
  });

  if (activeDates.size === 0) return 0;

  // Count backwards from current date
  let streak = 0;
  let checkDate = currentDateStr;

  // If active today or yesterday, start counting streak
  if (activeDates.has(checkDate)) {
    streak++;
    while (true) {
      checkDate = addDaysToDateStr(checkDate, -1);
      if (activeDates.has(checkDate)) {
        streak++;
      } else {
        break;
      }
    }
  } else {
    // Check if active yesterday
    const yesterday = addDaysToDateStr(checkDate, -1);
    if (activeDates.has(yesterday)) {
      checkDate = yesterday;
      streak++;
      while (true) {
        checkDate = addDaysToDateStr(checkDate, -1);
        if (activeDates.has(checkDate)) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  return streak;
}

function addDaysToDateStr(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
