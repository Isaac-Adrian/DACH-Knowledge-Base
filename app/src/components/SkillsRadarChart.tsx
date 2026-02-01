import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { TrackedSkill, Topic, TopicCategory } from '../types';
import { TOPIC_LIBRARY } from '../topicLibrary';
import { SKILL_LEVEL_LABELS } from '../types';

interface SkillsRadarChartProps {
  skills: TrackedSkill[];
  customTopics: Topic[];
  categoryFilter: TopicCategory | 'all';
  maxTopics?: number;
}

interface RadarDataPoint {
  topic: string;
  level: number;
  fullMark: 5;
  icon: string;
}

function getTopicById(topicId: string, customTopics: Topic[]): Topic | undefined {
  return TOPIC_LIBRARY.find((t) => t.id === topicId) || 
         customTopics.find((t) => t.id === topicId);
}

export function SkillsRadarChart({
  skills,
  customTopics,
  categoryFilter,
  maxTopics = 8,
}: SkillsRadarChartProps) {
  // Filter skills by category if specified
  const filteredSkills = categoryFilter === 'all'
    ? skills
    : skills.filter((skill) => {
        const topic = getTopicById(skill.topicId, customTopics);
        return topic?.category === categoryFilter;
      });

  // Take top skills by level, then by most recently updated
  const sortedSkills = [...filteredSkills]
    .sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    })
    .slice(0, maxTopics);

  // Transform to radar data format
  const data: RadarDataPoint[] = sortedSkills.map((skill) => {
    const topic = getTopicById(skill.topicId, customTopics);
    return {
      topic: topic?.name || skill.topicId,
      level: skill.level,
      fullMark: 5,
      icon: topic?.icon || '📚',
    };
  });

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🎯</div>
          <p>No skills in this category</p>
        </div>
      </div>
    );
  }

  // Need at least 3 data points for a meaningful radar
  if (data.length < 3) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🎯</div>
          <p>Add at least 3 skills to see the radar chart</p>
          <p className="text-sm mt-1">Currently tracking: {data.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid 
            stroke="#94a3b8" 
            strokeOpacity={0.3}
          />
          <PolarAngleAxis 
            dataKey="topic" 
            tick={{ 
              fill: 'currentColor', 
              fontSize: 12,
              className: 'text-gray-600 dark:text-gray-300'
            }}
            className="text-gray-600 dark:text-gray-300"
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 5]} 
            tickCount={6}
            tick={{ 
              fill: 'currentColor', 
              fontSize: 10,
              className: 'text-gray-500 dark:text-gray-400'
            }}
            axisLine={false}
          />
          <Radar
            name="Skill Level"
            dataKey="level"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as RadarDataPoint;
                return (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {data.icon} {data.topic}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Level {data.level}: {SKILL_LEVEL_LABELS[data.level as 1|2|3|4|5]}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
