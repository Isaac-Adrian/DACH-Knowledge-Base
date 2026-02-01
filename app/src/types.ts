// Core data types for the Knowledge Tracker

export interface Topic {
  id: string;
  name: string;
  category: TopicCategory;
  isCustom: boolean;
  icon?: string;
}

export type TopicCategory =
  | 'Languages'
  | 'Frontend'
  | 'Backend'
  | 'Cloud/Infra'
  | 'Data'
  | 'Architecture'
  | 'DevOps'
  | 'Soft Skills'
  | 'Custom';

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  1: 'Novice',
  2: 'Beginner',
  3: 'Competent',
  4: 'Proficient',
  5: 'Expert',
};

export interface TrackedSkill {
  topicId: string;
  level: SkillLevel;
  lastUpdated: string; // ISO date string
  history: SkillUpdate[];
  notes?: string;
  goalLevel?: SkillLevel;
  goalDate?: string; // ISO date string
}

export interface SkillUpdate {
  date: string; // ISO date string
  level: SkillLevel;
  timeSpentMinutes?: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  exportReminderDays: number;
}

export interface UserData {
  version: number;
  skills: TrackedSkill[];
  customTopics: Topic[];
  settings: UserSettings;
  createdAt: string; // ISO date string
  lastModified: string; // ISO date string
  lastExported?: string; // ISO date string
}

// Default values
export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'system',
  exportReminderDays: 7,
};

export const DEFAULT_USER_DATA: UserData = {
  version: 1,
  skills: [],
  customTopics: [],
  settings: DEFAULT_USER_SETTINGS,
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
};
