# 🏗️ AuraRecall — Technical Architecture & Design Document

This document outlines the architectural principles, data flow, state management strategy, and algorithm designs underpinning **AuraRecall**.

---

## 1. System Architecture Overview

AuraRecall follows a modern, component-driven client-side architecture built with React, TypeScript, and Tailwind CSS. The design prioritizes zero external runtime server dependencies, fast client-side reactivity, offline data persistence, and deterministic time-travel testing.

```
+-----------------------------------------------------------------------+
|                             App.tsx                                   |
|   (Root State: Topics, Simulated Date, DevTools Toggle, Calculations)  |
+-----------------------------------------------------------------------+
        |                  |                 |                  |
        v                  v                 v                  v
+---------------+  +---------------+  +--------------+  +---------------+
|    Header     |  | StudyLogForm  |  | Revision     |  | Consistency   |
| (Streak Count)|  |  (Input T_0)  |  | Alerts (Due) |  | Metrics       |
+---------------+  +---------------+  +--------------+  +---------------+
        |                  |                 |                  |
        v                  v                 v                  v
+---------------+  +---------------+  +--------------+  +---------------+
| Motivational  |  | Consistency   |  | StudyJourney |  | TimeTravel    |
| Card (Image)  |  | Grid (Heatmap)|  | (Full Log)   |  | Simulator     |
+---------------+  +---------------+  +--------------+  +---------------+
        \                  /                 \                  /
         +----------------+-------------------+----------------+
                                   |
                                   v
                  +--------------------------------+
                  |    storage.ts & dateUtils.ts   |
                  | (localStorage & Retention Engine) |
                  +--------------------------------+
```

---

## 2. Core Concepts & Spaced Repetition Algorithm

### 2.1 The Milestone Schedule Engine

When a new study topic is logged at date $T_0$, AuraRecall automatically populates a dictionary of 6 review milestone objects (`Record<MilestoneKey, MilestoneReview>`).

Each milestone key maps to a fixed day offset from $T_0$:

$$\text{ScheduledDate}(m) = T_0 + \text{daysOffset}(m)$$

| Milestone Key | Label | Offset Days ($\Delta t$) | Cognitive Objective |
| :--- | :--- | :--- | :--- |
| **`1d`** | 24 Hours | $+1$ Day | Arrest steep initial Ebbinghaus forgetting curve |
| **`3d`** | 72 Hours | $+3$ Days | Reinforce early neural retrieval pathways |
| **`7d`** | 1 Week | $+7$ Days | Transfer concepts from short-term to medium-term memory |
| **`90d`** | 3 Months | $+90$ Days | Consolidate long-term schematic integration |
| **`180d`** | 6 Months | $+180$ Days | Confirm permanent mastery |
| **`365d`** | 1 Year | $+365$ Days | Annual refresh for lifelong retention |

### 2.2 Retention Index Formula

The **Retention Index** is dynamically computed across all completed revisions using self-assessed recall difficulty ratings (`easy`, `medium`, `hard`):

$$\text{Retention Index} = \frac{\sum \text{Score}(r)}{N_{\text{assessed}}} \times 100\%$$

Where:
- $\text{Score}(\text{"easy"}) = 100$
- $\text{Score}(\text{"medium"}) = 75$
- $\text{Score}(\text{"hard"}) = 40$
- $\text{Score}(\text{default}) = 85$

---

## 3. Data Models (`src/types.ts`)

```typescript
export type MilestoneKey = '1d' | '3d' | '7d' | '90d' | '180d' | '365d';
export type SelfAssessment = 'easy' | 'medium' | 'hard';

export interface MilestoneReview {
  key: MilestoneKey;
  completed: boolean;
  scheduledDate: string; // YYYY-MM-DD
  completedAt?: string;  // YYYY-MM-DD
  assessment?: SelfAssessment;
  notesOnReview?: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  categoryColor?: string;
  notes: string;          // Active recall questions & takeaways
  dateCompleted: string;  // T_0 completion date (YYYY-MM-DD)
  milestones: Record<MilestoneKey, MilestoneReview>;
  createdAt: string;
  updatedAt: string;
}

export interface RetentionStats {
  totalTopics: number;
  totalRevisionsCompleted: number;
  retentionIndex: number;
  dueTodayCount: number;
  overdueCount: number;
  cadenceCounts: Record<MilestoneKey, number>;
  categoryCounts: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
}
```

---

## 4. State Management & Persistence Layer

- **LocalStorage Engine (`src/utils/storage.ts`)**:
  - `aura_recall_topics_v1`: JSON stringified collection of `Topic[]` items.
  - `aura_recall_sim_date_v1`: ISO date string representing the current simulated date (`YYYY-MM-DD`).
- **Reactive Updates**:
  - `App.tsx` synchronizes topic mutations (`handleAddTopic`, `handleCompleteRevision`, `handleDeleteTopic`) to localStorage via standard React `useEffect` hooks.
  - Calculations for retention statistics and heatmaps are wrapped in `useMemo` hooks for performance.

---

## 5. Time-Travel Simulator Mechanics

Spaced repetition systems inherently operate across extended temporal horizons (weeks to months). To enable instant verification and testing without waiting months in real time:

1. **Virtual Current Date**: The application reads `simulatedDate` instead of hardcoding `new Date()`.
2. **Dynamic Alert Re-computation**: All `scheduledDate <= simulatedDate` comparisons re-evaluate automatically when `simulatedDate` changes.
3. **Streak Preservation**: Streak calculation counts backwards from `simulatedDate` to ensure accurate historical tracking.

---

## 6. UX & Design System Principles

1. **Warm Soft Neutral Palette**: Soft warm background (`bg-gradient-to-br from-[#fef8f3] via-[#f8ede3] to-[#f3e3d4]`) with clean white rounded card surfaces (`rounded-3xl border border-stone-200/70 shadow-xs`).
2. **Micro-Interactions**: Two-step inline deletion confirmation, active recall toggle drawers, and celebration confetti upon marking revisions complete.
3. **Responsive Grid Layouts**: Mobile-first responsive layouts that scale smoothly to ultra-wide desktop viewports.
