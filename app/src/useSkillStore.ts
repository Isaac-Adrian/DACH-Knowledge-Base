import { useState, useEffect, useCallback } from 'react';
import {
  loadUserData,
  saveUserData,
  exportUserData,
  importUserData,
  shouldShowExportReminder,
} from './db';
import type {
  UserData,
  TrackedSkill,
  Topic,
  SkillLevel,
  SkillUpdate,
} from './types';
import { DEFAULT_USER_DATA } from './types';

interface UseSkillStoreReturn {
  // State
  userData: UserData;
  isLoading: boolean;
  error: string | null;
  showExportReminder: boolean;

  // Skill operations
  addSkill: (topicId: string, initialLevel?: SkillLevel) => Promise<void>;
  removeSkill: (topicId: string) => Promise<void>;
  updateSkillLevel: (topicId: string, level: SkillLevel, timeSpent?: number) => Promise<void>;
  setSkillGoal: (topicId: string, goalLevel: SkillLevel, goalDate?: string) => Promise<void>;
  updateSkillNotes: (topicId: string, notes: string) => Promise<void>;

  // Custom topic operations
  addCustomTopic: (topic: Omit<Topic, 'id' | 'isCustom'>) => Promise<Topic>;
  removeCustomTopic: (topicId: string) => Promise<void>;

  // Data operations
  exportData: () => Promise<string>;
  importData: (jsonString: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useSkillStore(): UseSkillStoreReturn {
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportReminder, setShowExportReminder] = useState(false);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await loadUserData();
      setUserData(data);
      const shouldRemind = await shouldShowExportReminder();
      setShowExportReminder(shouldRemind);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const persistData = useCallback(async (newData: UserData) => {
    try {
      await saveUserData(newData);
      setUserData(newData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
      throw err;
    }
  }, []);

  const addSkill = useCallback(
    async (topicId: string, initialLevel: SkillLevel = 1) => {
      // Check if skill already exists
      if (userData.skills.some((s) => s.topicId === topicId)) {
        return;
      }

      const now = new Date().toISOString();
      const newSkill: TrackedSkill = {
        topicId,
        level: initialLevel,
        lastUpdated: now,
        history: [{ date: now, level: initialLevel }],
      };

      await persistData({
        ...userData,
        skills: [...userData.skills, newSkill],
      });
    },
    [userData, persistData]
  );

  const removeSkill = useCallback(
    async (topicId: string) => {
      await persistData({
        ...userData,
        skills: userData.skills.filter((s) => s.topicId !== topicId),
      });
    },
    [userData, persistData]
  );

  const updateSkillLevel = useCallback(
    async (topicId: string, level: SkillLevel, timeSpent?: number) => {
      const now = new Date().toISOString();
      const update: SkillUpdate = {
        date: now,
        level,
        timeSpentMinutes: timeSpent,
      };

      await persistData({
        ...userData,
        skills: userData.skills.map((skill) =>
          skill.topicId === topicId
            ? {
                ...skill,
                level,
                lastUpdated: now,
                history: [...skill.history, update],
              }
            : skill
        ),
      });
    },
    [userData, persistData]
  );

  const setSkillGoal = useCallback(
    async (topicId: string, goalLevel: SkillLevel, goalDate?: string) => {
      await persistData({
        ...userData,
        skills: userData.skills.map((skill) =>
          skill.topicId === topicId
            ? { ...skill, goalLevel, goalDate }
            : skill
        ),
      });
    },
    [userData, persistData]
  );

  const updateSkillNotes = useCallback(
    async (topicId: string, notes: string) => {
      await persistData({
        ...userData,
        skills: userData.skills.map((skill) =>
          skill.topicId === topicId ? { ...skill, notes } : skill
        ),
      });
    },
    [userData, persistData]
  );

  const addCustomTopic = useCallback(
    async (topicData: Omit<Topic, 'id' | 'isCustom'>): Promise<Topic> => {
      const topic: Topic = {
        ...topicData,
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isCustom: true,
      };

      await persistData({
        ...userData,
        customTopics: [...userData.customTopics, topic],
      });

      return topic;
    },
    [userData, persistData]
  );

  const removeCustomTopic = useCallback(
    async (topicId: string) => {
      // Remove the topic and any skills tracking it
      await persistData({
        ...userData,
        customTopics: userData.customTopics.filter((t) => t.id !== topicId),
        skills: userData.skills.filter((s) => s.topicId !== topicId),
      });
    },
    [userData, persistData]
  );

  const exportData = useCallback(async (): Promise<string> => {
    const json = await exportUserData();
    setShowExportReminder(false);
    // Reload to get updated lastExported
    await loadInitialData();
    return json;
  }, []);

  const importData = useCallback(async (jsonString: string): Promise<void> => {
    const data = await importUserData(jsonString);
    setUserData(data);
    setShowExportReminder(false);
  }, []);

  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, []);

  return {
    userData,
    isLoading,
    error,
    showExportReminder,
    addSkill,
    removeSkill,
    updateSkillLevel,
    setSkillGoal,
    updateSkillNotes,
    addCustomTopic,
    removeCustomTopic,
    exportData,
    importData,
    refreshData,
  };
}
