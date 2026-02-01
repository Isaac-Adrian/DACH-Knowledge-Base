import { useState } from 'react';
import type { Topic } from '../types';
import { getTopicById } from '../topicLibrary';

interface LogTimeModalProps {
  topicId: string;
  customTopics: Topic[];
  onSubmit: (minutes: number) => void;
  onClose: () => void;
}

export function LogTimeModal({
  topicId,
  customTopics,
  onSubmit,
  onClose,
}: LogTimeModalProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  const topic = getTopicById(topicId, customTopics);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes > 0) {
      onSubmit(totalMinutes);
    }
  };

  const quickOptions = [
    { label: '15m', minutes: 15 },
    { label: '30m', minutes: 30 },
    { label: '1h', minutes: 60 },
    { label: '2h', minutes: 120 },
    { label: '4h', minutes: 240 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            ⏱️ Log Learning Time
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {topic && (
          <div className="flex items-center gap-2 mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span className="text-2xl">{topic.icon || '📌'}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{topic.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{topic.category}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Quick Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick select
            </label>
            <div className="flex gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.minutes}
                  type="button"
                  onClick={() => {
                    setHours(Math.floor(option.minutes / 60));
                    setMinutes(option.minutes % 60);
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hours * 60 + minutes === option.minutes
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Or enter custom time
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg"
                />
              </div>
              <div className="flex items-end pb-2 text-2xl text-gray-400">:</div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hours * 60 + minutes === 0}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:dark:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Log {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
