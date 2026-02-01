import { useMemo } from 'react';
import type { TrackedSkill, Topic } from '../types';
import { TOPIC_LIBRARY } from '../topicLibrary';

interface ActivityHeatMapProps {
  skills: TrackedSkill[];
  customTopics: Topic[];
  weeksToShow?: number;
}

interface DayActivity {
  date: string;
  count: number;
  totalMinutes: number;
  topics: string[];
}

function getTopicById(topicId: string, customTopics: Topic[]): Topic | undefined {
  return TOPIC_LIBRARY.find((t) => t.id === topicId) || 
         customTopics.find((t) => t.id === topicId);
}

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-700';
  if (count === 1) return 'bg-green-200 dark:bg-green-900';
  if (count === 2) return 'bg-green-300 dark:bg-green-800';
  if (count <= 4) return 'bg-green-400 dark:bg-green-700';
  return 'bg-green-500 dark:bg-green-600';
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ActivityHeatMap({
  skills,
  customTopics,
  weeksToShow = 12,
}: ActivityHeatMapProps) {
  // Build activity map from skill history
  const activityData = useMemo(() => {
    const activityMap = new Map<string, DayActivity>();

    skills.forEach((skill) => {
      const topic = getTopicById(skill.topicId, customTopics);
      const topicName = topic?.name || skill.topicId;

      skill.history.forEach((update) => {
        const dateKey = update.date.split('T')[0];
        
        if (!activityMap.has(dateKey)) {
          activityMap.set(dateKey, {
            date: dateKey,
            count: 0,
            totalMinutes: 0,
            topics: [],
          });
        }

        const day = activityMap.get(dateKey)!;
        day.count += 1;
        day.totalMinutes += update.timeSpentMinutes || 0;
        if (!day.topics.includes(topicName)) {
          day.topics.push(topicName);
        }
      });
    });

    return activityMap;
  }, [skills, customTopics]);

  // Generate calendar grid
  const calendarData = useMemo(() => {
    const today = new Date();
    const totalDays = weeksToShow * 7;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    // Adjust to start on Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const weeks: DayActivity[][] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= today || weeks.length < weeksToShow) {
      const week: DayActivity[] = [];
      
      for (let i = 0; i < 7; i++) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const activity = activityMap.get(dateKey);
        
        week.push(activity || {
          date: dateKey,
          count: 0,
          totalMinutes: 0,
          topics: [],
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(week);
      
      if (weeks.length >= weeksToShow + 2) break;
    }

    return weeks;
  }, [weeksToShow]);

  const activityMap = activityData;

  // Calculate stats
  const totalActiveDays = Array.from(activityData.values()).filter((d) => d.count > 0).length;
  const totalUpdates = Array.from(activityData.values()).reduce((sum, d) => sum + d.count, 0);
  const totalMinutes = Array.from(activityData.values()).reduce((sum, d) => sum + d.totalMinutes, 0);

  if (skills.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🔥</div>
          <p>No activity to show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalActiveDays}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Active Days
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalUpdates}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Updates
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalMinutes > 60 
              ? `${Math.round(totalMinutes / 60)}h` 
              : `${totalMinutes}m`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Time Logged
          </div>
        </div>
      </div>

      {/* Heat Map Grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2">
            {DAYS_OF_WEEK.map((day, i) => (
              <div
                key={day}
                className={`h-4 w-8 text-xs text-gray-500 dark:text-gray-400 flex items-center ${
                  i % 2 === 0 ? '' : 'invisible'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const isToday = day.date === new Date().toISOString().split('T')[0];
                const isFuture = new Date(day.date) > new Date();
                
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`
                      w-4 h-4 rounded-sm transition-colors cursor-pointer
                      ${isFuture ? 'bg-transparent' : getIntensityClass(day.count)}
                      ${isToday ? 'ring-2 ring-blue-500' : ''}
                    `}
                    title={
                      isFuture
                        ? ''
                        : `${new Date(day.date).toLocaleDateString()}: ${day.count} update${day.count !== 1 ? 's' : ''}${
                            day.totalMinutes > 0 ? `, ${day.totalMinutes}min` : ''
                          }${day.topics.length > 0 ? `\n${day.topics.join(', ')}` : ''}`
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-gray-700" />
          <div className="w-4 h-4 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="w-4 h-4 rounded-sm bg-green-300 dark:bg-green-800" />
          <div className="w-4 h-4 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="w-4 h-4 rounded-sm bg-green-500 dark:bg-green-600" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
