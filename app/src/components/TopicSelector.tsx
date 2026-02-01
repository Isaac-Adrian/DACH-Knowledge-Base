import { useState } from 'react';
import type { Topic, TopicCategory } from '../types';
import { TOPIC_LIBRARY, CATEGORIES, searchTopics } from '../topicLibrary';

interface TopicSelectorProps {
  trackedTopicIds: string[];
  customTopics: Topic[];
  onAddTopic: (topicId: string) => void;
  onRemoveTopic: (topicId: string) => void;
}

export function TopicSelector({
  trackedTopicIds,
  customTopics,
  onAddTopic,
  onRemoveTopic,
}: TopicSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | 'All'>('All');

  // Get filtered topics
  const allTopics = [...TOPIC_LIBRARY, ...customTopics];
  let filteredTopics = searchQuery
    ? searchTopics(searchQuery, customTopics)
    : allTopics;

  if (selectedCategory !== 'All') {
    filteredTopics = filteredTopics.filter((t) => t.category === selectedCategory);
  }

  const isTracked = (topicId: string) => trackedTopicIds.includes(topicId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        📚 Topic Library
      </h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTopics.map((topic) => {
          const tracked = isTracked(topic.id);
          return (
            <div
              key={topic.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                tracked
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{topic.icon || '📌'}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {topic.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {topic.category}
                    {topic.isCustom && ' • Custom'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => (tracked ? onRemoveTopic(topic.id) : onAddTopic(topic.id))}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  tracked
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                }`}
              >
                {tracked ? 'Remove' : 'Add'}
              </button>
            </div>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No topics found matching your search.
        </p>
      )}

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Tracking <span className="font-bold text-blue-600 dark:text-blue-400">{trackedTopicIds.length}</span> of{' '}
          <span className="font-bold">{allTopics.length}</span> topics
        </p>
      </div>
    </div>
  );
}
