import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { TrackedSkill, Topic, TopicCategory } from '../types';
import { TOPIC_LIBRARY } from '../topicLibrary';
import { SKILL_LEVEL_LABELS } from '../types';

interface CategoryBreakdownProps {
  skills: TrackedSkill[];
  customTopics: Topic[];
}

interface CategoryData {
  category: TopicCategory;
  count: number;
  averageLevel: number;
  skills: string[];
}

// Category colors
const CATEGORY_COLORS: Record<TopicCategory, string> = {
  'Languages': '#3b82f6',     // blue
  'Frontend': '#10b981',      // green
  'Backend': '#f59e0b',       // amber
  'Cloud/Infra': '#06b6d4',   // cyan
  'Data': '#8b5cf6',          // purple
  'Architecture': '#ef4444',  // red
  'DevOps': '#f97316',        // orange
  'Soft Skills': '#ec4899',   // pink
  'Custom': '#6366f1',        // indigo
};

function getTopicById(topicId: string, customTopics: Topic[]): Topic | undefined {
  return TOPIC_LIBRARY.find((t) => t.id === topicId) || 
         customTopics.find((t) => t.id === topicId);
}

export function CategoryBreakdown({
  skills,
  customTopics,
}: CategoryBreakdownProps) {
  if (skills.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No skills to categorize</p>
        </div>
      </div>
    );
  }

  // Group skills by category
  const categoryMap = new Map<TopicCategory, { totalLevel: number; count: number; skills: string[] }>();

  skills.forEach((skill) => {
    const topic = getTopicById(skill.topicId, customTopics);
    const category = topic?.category || 'Custom';
    const name = topic?.name || skill.topicId;

    if (!categoryMap.has(category)) {
      categoryMap.set(category, { totalLevel: 0, count: 0, skills: [] });
    }

    const data = categoryMap.get(category)!;
    data.totalLevel += skill.level;
    data.count += 1;
    data.skills.push(name);
  });

  // Convert to array and calculate averages
  const data: CategoryData[] = Array.from(categoryMap.entries())
    .map(([category, { totalLevel, count, skills: skillNames }]) => ({
      category,
      count,
      averageLevel: Math.round((totalLevel / count) * 10) / 10,
      skills: skillNames,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.3} />
            <XAxis
              type="number"
              tick={{ fill: 'currentColor', fontSize: 11 }}
              className="text-gray-600 dark:text-gray-300"
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fill: 'currentColor', fontSize: 12 }}
              width={90}
              className="text-gray-600 dark:text-gray-300"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, white)',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                borderRadius: '8px',
              }}
              formatter={(value, name) => {
                if (name === 'count') {
                  return [`${value} skills`, 'Count'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `📁 ${label}`}
            />
            <Bar 
              dataKey="count" 
              name="Skills"
              radius={[0, 4, 4, 0]}
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.category} 
                  fill={CATEGORY_COLORS[entry.category] || '#6b7280'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((cat) => (
          <div
            key={cat.category}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            style={{ borderLeftColor: CATEGORY_COLORS[cat.category], borderLeftWidth: '4px' }}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {cat.category}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {cat.count} skill{cat.count !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Avg Level: <strong>{cat.averageLevel}</strong> ({SKILL_LEVEL_LABELS[Math.round(cat.averageLevel) as 1|2|3|4|5] || 'N/A'})
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {cat.skills.slice(0, 3).join(', ')}
              {cat.skills.length > 3 && ` +${cat.skills.length - 3} more`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
