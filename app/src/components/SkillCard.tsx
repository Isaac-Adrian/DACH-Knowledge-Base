import type { TrackedSkill, SkillLevel } from '../types';
import { SKILL_LEVEL_LABELS } from '../types';
import { getTopicById } from '../topicLibrary';
import type { Topic } from '../types';

interface SkillCardProps {
  skill: TrackedSkill;
  customTopics: Topic[];
  onLevelChange: (level: SkillLevel) => void;
  onLogTime: () => void;
  onViewDetails: () => void;
}

export function SkillCard({
  skill,
  customTopics,
  onLevelChange,
  onLogTime,
  onViewDetails,
}: SkillCardProps) {
  const topic = getTopicById(skill.topicId, customTopics);
  
  if (!topic) {
    return null;
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getTotalTime = () => {
    const totalMinutes = skill.history.reduce((sum, update) => sum + (update.timeSpentMinutes || 0), 0);
    if (totalMinutes === 0) return null;
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const totalTime = getTotalTime();
  const hasGoal = skill.goalLevel !== undefined;
  const goalMet = hasGoal && skill.level >= skill.goalLevel!;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{topic.icon || '📌'}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {topic.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {topic.category}
            </p>
          </div>
        </div>
        {hasGoal && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            goalMet 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
          }`}>
            {goalMet ? '🎯 Goal met!' : `🎯 Goal: ${skill.goalLevel}`}
          </span>
        )}
      </div>

      {/* Level Selector */}
      <div className="mb-3">
        <div className="flex items-center gap-1">
          {([1, 2, 3, 4, 5] as SkillLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => onLevelChange(level)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                level <= skill.level
                  ? `skill-level-${level} text-gray-800 dark:text-white`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
              } ${level === skill.level ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''}`}
              title={SKILL_LEVEL_LABELS[level]}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          {SKILL_LEVEL_LABELS[skill.level]}
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>Updated {formatDate(skill.lastUpdated)}</span>
        {totalTime && (
          <span className="flex items-center gap-1">
            ⏱️ {totalTime}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onLogTime}
          className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
        >
          ⏱️ Log Time
        </button>
        <button
          onClick={onViewDetails}
          className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm rounded-lg transition-colors"
        >
          📊 Details
        </button>
      </div>
    </div>
  );
}
