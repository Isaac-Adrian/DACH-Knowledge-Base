import { useState } from 'react';
import type { TrackedSkill, Topic, SkillLevel } from '../types';
import { SkillCard } from './SkillCard';
import { getTopicById } from '../topicLibrary';

interface SkillListProps {
  skills: TrackedSkill[];
  customTopics: Topic[];
  onLevelChange: (topicId: string, level: SkillLevel) => void;
  onLogTime: (topicId: string) => void;
  onViewDetails: (topicId: string) => void;
}

type SortOption = 'name' | 'level' | 'recent' | 'category';

export function SkillList({
  skills,
  customTopics,
  onLevelChange,
  onLogTime,
  onViewDetails,
}: SkillListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Filter skills by search
  const filteredSkills = skills.filter((skill) => {
    const topic = getTopicById(skill.topicId, customTopics);
    if (!topic) return false;
    const query = searchQuery.toLowerCase();
    return (
      topic.name.toLowerCase().includes(query) ||
      topic.category.toLowerCase().includes(query)
    );
  });

  // Sort skills
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    const topicA = getTopicById(a.topicId, customTopics);
    const topicB = getTopicById(b.topicId, customTopics);
    
    if (!topicA || !topicB) return 0;

    switch (sortBy) {
      case 'name':
        return topicA.name.localeCompare(topicB.name);
      case 'level':
        return b.level - a.level; // Highest first
      case 'category':
        return topicA.category.localeCompare(topicB.category);
      case 'recent':
      default:
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    }
  });

  if (skills.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <p className="text-6xl mb-4">🎯</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No skills tracked yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add topics from the library above to start tracking your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📈 Your Skills ({skills.length})
        </h2>
        
        <div className="flex gap-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
            <option value="level">Level</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSkills.map((skill) => (
          <SkillCard
            key={skill.topicId}
            skill={skill}
            customTopics={customTopics}
            onLevelChange={(level) => onLevelChange(skill.topicId, level)}
            onLogTime={() => onLogTime(skill.topicId)}
            onViewDetails={() => onViewDetails(skill.topicId)}
          />
        ))}
      </div>

      {filteredSkills.length === 0 && searchQuery && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No skills found matching "{searchQuery}"
        </p>
      )}
    </div>
  );
}
