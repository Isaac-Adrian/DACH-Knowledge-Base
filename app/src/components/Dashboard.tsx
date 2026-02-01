import { useState } from 'react';
import type { TrackedSkill, Topic, TopicCategory } from '../types';
import { SkillsRadarChart } from './SkillsRadarChart';
import { ProgressTimeline } from './ProgressTimeline';
import { CategoryBreakdown } from './CategoryBreakdown';
import { ActivityHeatMap } from './ActivityHeatMap';

type VizTab = 'radar' | 'timeline' | 'category' | 'heatmap';

const CATEGORIES: (TopicCategory | 'all')[] = [
  'all',
  'Languages',
  'Frontend',
  'Backend',
  'Cloud/Infra',
  'Data',
  'Architecture',
  'DevOps',
  'Soft Skills',
];

interface DashboardProps {
  skills: TrackedSkill[];
  customTopics: Topic[];
}

export function Dashboard({ skills, customTopics }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<VizTab>('radar');
  const [radarCategory, setRadarCategory] = useState<TopicCategory | 'all'>('all');

  const tabs: { id: VizTab; label: string; icon: string }[] = [
    { id: 'radar', label: 'Skills Radar', icon: '🎯' },
    { id: 'timeline', label: 'Progress Timeline', icon: '📈' },
    { id: 'category', label: 'By Category', icon: '📊' },
    { id: 'heatmap', label: 'Activity', icon: '🔥' },
  ];

  if (skills.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          No Skills to Visualize
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Add some topics to start tracking your progress and see visualizations here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap" aria-label="Visualization tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'radar' && (
          <div>
            {/* Category Filter */}
            <div className="mb-4 flex items-center gap-3">
              <label htmlFor="radar-category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Category:
              </label>
              <select
                id="radar-category"
                value={radarCategory}
                onChange={(e) => setRadarCategory(e.target.value as TopicCategory | 'all')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
            <SkillsRadarChart
              skills={skills}
              customTopics={customTopics}
              categoryFilter={radarCategory}
              maxTopics={8}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <ProgressTimeline
            skills={skills}
            customTopics={customTopics}
            daysToShow={90}
          />
        )}

        {activeTab === 'category' && (
          <CategoryBreakdown
            skills={skills}
            customTopics={customTopics}
          />
        )}

        {activeTab === 'heatmap' && (
          <ActivityHeatMap
            skills={skills}
            customTopics={customTopics}
            weeksToShow={12}
          />
        )}
      </div>
    </div>
  );
}
