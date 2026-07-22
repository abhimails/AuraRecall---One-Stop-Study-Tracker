/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StudyLogForm } from './components/StudyLogForm';
import { RevisionAlerts } from './components/RevisionAlerts';
import { ConsistencyMetrics } from './components/ConsistencyMetrics';
import { MotivationalCard } from './components/MotivationalCard';
import { ConsistencyGrid } from './components/ConsistencyGrid';
import { StudyJourney } from './components/StudyJourney';
import { TimeTravelSimulator } from './components/TimeTravelSimulator';

import { Topic, MilestoneKey, SelfAssessment } from './types';
import { createMilestonesForDate, getSampleTopics } from './constants/milestones';
import {
  loadStoredTopics,
  saveStoredTopics,
  loadSimulatedDate,
  saveSimulatedDate,
  calculateRetentionStats,
} from './utils/storage';
import { getTodayISOString } from './utils/dateUtils';
import { Settings, Heart } from 'lucide-react';

export default function App() {
  const [topics, setTopics] = useState<Topic[]>(() => loadStoredTopics());
  const [simulatedDate, setSimulatedDate] = useState<string>(() => loadSimulatedDate());
  const [showDevTools, setShowDevTools] = useState(false);

  const realToday = getTodayISOString();
  const isSimulated = simulatedDate !== realToday;

  // Sync topics to localStorage
  useEffect(() => {
    saveStoredTopics(topics);
  }, [topics]);

  // Sync simulated date to localStorage
  useEffect(() => {
    saveSimulatedDate(simulatedDate);
  }, [simulatedDate]);

  // Calculate stats
  const stats = useMemo(
    () => calculateRetentionStats(topics, simulatedDate),
    [topics, simulatedDate]
  );

  // Handlers
  const handleAddTopic = (
    title: string,
    category: string,
    notes: string,
    dateCompleted: string
  ) => {
    const newTopic: Topic = {
      id: `topic-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      category,
      categoryColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      notes,
      dateCompleted,
      createdAt: dateCompleted,
      updatedAt: dateCompleted,
      milestones: createMilestonesForDate(dateCompleted),
    };

    setTopics((prev) => [newTopic, ...prev]);
  };

  const handleCompleteRevision = (
    topicId: string,
    milestoneKey: MilestoneKey,
    assessment: SelfAssessment
  ) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;

        const updatedMilestones = { ...t.milestones };
        const targetReview = updatedMilestones[milestoneKey];

        if (targetReview) {
          updatedMilestones[milestoneKey] = {
            ...targetReview,
            completed: true,
            completedAt: simulatedDate,
            assessment,
          };
        }

        return {
          ...t,
          milestones: updatedMilestones,
          updatedAt: simulatedDate,
        };
      })
    );
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
  };

  const handleEditTopic = (updatedTopic: Topic) => {
    setTopics((prev) => prev.map((t) => (t.id === updatedTopic.id ? updatedTopic : t)));
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(topics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aurarecall_backup_${simulatedDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setTopics(parsed);
            alert('Study records imported successfully!');
          }
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  const handleResetApp = () => {
    if (window.confirm('Reset all study logs back to default sample records?')) {
      const samples = getSampleTopics(realToday);
      setTopics(samples);
      setSimulatedDate(realToday);
    }
  };

  const handleLoadSampleData = () => {
    const samples = getSampleTopics(simulatedDate);
    setTopics(samples);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f3] via-[#f8ede3] to-[#f3e3d4] text-stone-800 antialiased font-sans selection:bg-indigo-100 selection:text-indigo-900 px-4 py-6 sm:px-8 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top App Header */}
        <Header
          streak={stats.currentStreak}
          simulatedDate={simulatedDate}
          isSimulated={isSimulated}
          onResetSimulatedDate={() => setSimulatedDate(realToday)}
        />

        {/* Top Grid: Study Log Form (Left) & Today's Revision Alerts (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <StudyLogForm onAddTopic={handleAddTopic} currentDate={simulatedDate} />
          <RevisionAlerts
            topics={topics}
            currentDate={simulatedDate}
            onCompleteRevision={handleCompleteRevision}
          />
        </div>

        {/* Middle Grid: Consistency Metrics (Left) & Motivational Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <ConsistencyMetrics stats={stats} />
          <MotivationalCard />
        </div>

        {/* Full-width Section 1: Consistency Grid (Heatmap) */}
        <ConsistencyGrid topics={topics} currentDate={simulatedDate} />

        {/* Full-width Section 2: My Study Journey (Log & Cadence Tracker) */}
        <StudyJourney
          topics={topics}
          currentDate={simulatedDate}
          onDeleteTopic={handleDeleteTopic}
          onCompleteRevision={handleCompleteRevision}
          onEditTopic={handleEditTopic}
        />

        {/* Footer & Developer Simulator Toggle */}
        <div className="pt-4 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for
            lifelong learners. <span className="font-semibold text-stone-700">AuraRecall © 2026</span>
          </div>

          <button
            onClick={() => setShowDevTools((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer font-medium"
          >
            <Settings className="w-3.5 h-3.5 text-stone-500" />
            {showDevTools ? 'Hide Settings & Developer Tools' : 'Settings & Developer Tools'}
          </button>
        </div>

        {/* Time-Travel Simulator & Data Tools (Always accessible or via toggle) */}
        {showDevTools && (
          <div className="pt-2">
            <TimeTravelSimulator
              currentSimulatedDate={simulatedDate}
              onDateChange={setSimulatedDate}
              onExportJSON={handleExportJSON}
              onImportJSON={handleImportJSON}
              onResetApp={handleResetApp}
              onLoadSampleData={handleLoadSampleData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
