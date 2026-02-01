import { useState } from 'react';
import type { TrackedSkill, Topic, SkillLevel } from '../types';
import { SKILL_LEVEL_LABELS } from '../types';
import { getTopicById } from '../topicLibrary';

interface SkillDetailModalProps {
  skill: TrackedSkill;
  customTopics: Topic[];
  onUpdateNotes: (notes: string) => void;
  onSetGoal: (goalLevel: SkillLevel, goalDate?: string) => void;
  onClose: () => void;
}

export function SkillDetailModal({
  skill,
  customTopics,
  onUpdateNotes,
  onSetGoal,
  onClose,
}: SkillDetailModalProps) {
  const [notes, setNotes] = useState(skill.notes || '');
  const [goalLevel, setGoalLevel] = useState<SkillLevel>(skill.goalLevel || 5);
  const [goalDate, setGoalDate] = useState(skill.goalDate || '');
  const [activeTab, setActiveTab] = useState<'history' | 'notes' | 'goals'>('history');

  const topic = getTopicById(skill.topicId, customTopics);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const totalTime = skill.history.reduce((sum, u) => sum + (u.timeSpentMinutes || 0), 0);

  const handleSaveNotes = () => {
    onUpdateNotes(notes);
  };

  const handleSaveGoal = () => {
    onSetGoal(goalLevel, goalDate || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{topic?.icon || '📌'}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {topic?.name || 'Unknown Topic'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {topic?.category} • Level {skill.level} ({SKILL_LEVEL_LABELS[skill.level]})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Time</p>
              <p className="font-bold text-gray-900 dark:text-white">{formatDuration(totalTime)}</p>
            </div>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Updates</p>
              <p className="font-bold text-gray-900 dark:text-white">{skill.history.length}</p>
            </div>
            {skill.goalLevel && (
              <div className={`px-3 py-2 rounded-lg ${
                skill.level >= skill.goalLevel
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <p className="text-xs text-gray-500 dark:text-gray-400">Goal</p>
                <p className={`font-bold ${
                  skill.level >= skill.goalLevel
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-blue-700 dark:text-blue-400'
                }`}>
                  Level {skill.goalLevel} {skill.level >= skill.goalLevel && '✓'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {(['history', 'notes', 'goals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'history' && '📜 History'}
              {tab === 'notes' && '📝 Notes'}
              {tab === 'goals' && '🎯 Goals'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'history' && (
            <div className="space-y-3">
              {skill.history.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No history yet
                </p>
              ) : (
                [...skill.history].reverse().map((update, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className={`skill-level-${update.level} w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-800 dark:text-white`}>
                      {update.level}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Level {update.level} - {SKILL_LEVEL_LABELS[update.level]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(update.date)}
                      </p>
                    </div>
                    {update.timeSpentMinutes && (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        ⏱️ {formatDuration(update.timeSpentMinutes)}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your learning journey, resources, or goals..."
                className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSaveNotes}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Save Notes
              </button>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Level
                </label>
                <div className="flex gap-2">
                  {([1, 2, 3, 4, 5] as SkillLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setGoalLevel(level)}
                      disabled={level <= skill.level}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        level === goalLevel
                          ? 'bg-blue-500 text-white ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'
                          : level <= skill.level
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {level}
                      <span className="block text-xs mt-1">{SKILL_LEVEL_LABELS[level]}</span>
                    </button>
                  ))}
                </div>
                {skill.level === 5 && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    🎉 You've reached the highest level!
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Date (optional)
                </label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSaveGoal}
                disabled={goalLevel <= skill.level}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:dark:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {skill.goalLevel ? 'Update Goal' : 'Set Goal'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
