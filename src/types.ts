export type MilestoneKey = '1d' | '3d' | '7d' | '90d' | '180d' | '365d';

export type SelfAssessment = 'easy' | 'medium' | 'hard';

export interface MilestoneReview {
  key: MilestoneKey;
  completed: boolean;
  scheduledDate: string; // YYYY-MM-DD
  completedAt?: string; // YYYY-MM-DD
  assessment?: SelfAssessment;
  notesOnReview?: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string; // Category name or ID
  categoryColor?: string; // Optional badge color
  notes: string; // Active recall key points / questions
  dateCompleted: string; // T_0 completion date (YYYY-MM-DD)
  milestones: Record<MilestoneKey, MilestoneReview>;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface CategoryOption {
  id: string;
  name: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  iconName: string;
}

export interface MilestoneDefinition {
  key: MilestoneKey;
  label: string;
  shortLabel: string;
  daysOffset: number;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}

export type ReviewStatus = 'all' | 'due' | 'overdue' | 'completed' | 'upcoming';

export interface FilterState {
  search: string;
  category: string;
  status: ReviewStatus;
  sortBy: 'scheduledDate' | 'dateCompleted' | 'title' | 'category';
}

export interface RetentionStats {
  totalTopics: number;
  totalRevisionsCompleted: number;
  retentionIndex: number; // percentage based on easy/medium/hard ratings
  dueTodayCount: number;
  overdueCount: number;
  cadenceCounts: Record<MilestoneKey, number>;
  categoryCounts: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
}
