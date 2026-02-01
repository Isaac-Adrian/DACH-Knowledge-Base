import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TrackedSkill, Topic } from '../types';
import { TOPIC_LIBRARY } from '../topicLibrary';
import { SKILL_LEVEL_LABELS } from '../types';

interface ProgressTimelineProps {
  skills: TrackedSkill[];
  customTopics: Topic[];
  daysToShow?: number;
}

interface TimelineDataPoint {
  date: string;
  [topicName: string]: number | string;
}

function getTopicById(topicId: string, customTopics: Topic[]): Topic | undefined {
  return TOPIC_LIBRARY.find((t) => t.id === topicId) || 
         customTopics.find((t) => t.id === topicId);
}

// Generate distinct colors for up to 10 lines
const LINE_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
  '#14b8a6', // teal
  '#6366f1', // indigo
];

export function ProgressTimeline({
  skills,
  customTopics,
  daysToShow = 90,
}: ProgressTimelineProps) {
  // Filter to skills that have history
  const skillsWithHistory = skills.filter((s) => s.history.length > 0);

  if (skillsWithHistory.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p>No progress history yet</p>
          <p className="text-sm mt-1">Update your skill levels to see your progress over time</p>
        </div>
      </div>
    );
  }

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysToShow);

  // Build timeline data
  // Group all updates by date and skill
  const dateMap = new Map<string, Record<string, number>>();

  // Initialize with current levels for all skills at the start date
  const initialLevels: Record<string, number> = {};
  skillsWithHistory.forEach((skill) => {
    const topic = getTopicById(skill.topicId, customTopics);
    const name = topic?.name || skill.topicId;
    
    // Find the level at or before startDate, or use 0
    const earlierUpdates = skill.history
      .filter((u) => new Date(u.date) <= startDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    initialLevels[name] = earlierUpdates.length > 0 ? earlierUpdates[0].level : 0;
  });

  // Process updates within the date range
  skillsWithHistory.forEach((skill) => {
    const topic = getTopicById(skill.topicId, customTopics);
    const name = topic?.name || skill.topicId;

    skill.history.forEach((update) => {
      const updateDate = new Date(update.date);
      if (updateDate >= startDate && updateDate <= endDate) {
        const dateKey = updateDate.toISOString().split('T')[0];
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {});
        }
        dateMap.get(dateKey)![name] = update.level;
      }
    });
  });

  // Build the data array with interpolated values
  const data: TimelineDataPoint[] = [];
  const currentLevels = { ...initialLevels };
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    
    // Update current levels with any changes on this date
    if (dateMap.has(dateKey)) {
      Object.assign(currentLevels, dateMap.get(dateKey));
    }

    // Only add data points where there's activity (or first/last)
    const isFirstOrLast = d.getTime() === startDate.getTime() || 
                          d.toDateString() === endDate.toDateString();
    const hasActivity = dateMap.has(dateKey);

    if (isFirstOrLast || hasActivity) {
      data.push({
        date: dateKey,
        ...currentLevels,
      });
    }
  }

  // Get unique skill names for the legend
  const skillNames = Object.keys(initialLevels);

  // Limit to 10 skills for readability
  const displayedSkills = skillNames.slice(0, 10);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.3} />
          <XAxis
            dataKey="date"
            tick={{ fill: 'currentColor', fontSize: 11 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            className="text-gray-600 dark:text-gray-300"
          />
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: 'currentColor', fontSize: 11 }}
            tickFormatter={(value) => SKILL_LEVEL_LABELS[value as 1|2|3|4|5]?.[0] || ''}
            className="text-gray-600 dark:text-gray-300"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, white)',
              border: '1px solid var(--tooltip-border, #e5e7eb)',
              borderRadius: '8px',
            }}
            labelFormatter={(label) => {
              const date = new Date(label as string);
              return date.toLocaleDateString();
            }}
            formatter={(value, name) => {
              const numValue = typeof value === 'number' ? value : 0;
              return [
                `Level ${numValue}: ${SKILL_LEVEL_LABELS[numValue as 1|2|3|4|5] || 'Unknown'}`,
                name,
              ];
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          {displayedSkills.map((skillName, index) => (
            <Line
              key={skillName}
              type="stepAfter"
              dataKey={skillName}
              stroke={LINE_COLORS[index % LINE_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {skillNames.length > 10 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Showing top 10 of {skillNames.length} skills
        </p>
      )}
    </div>
  );
}
