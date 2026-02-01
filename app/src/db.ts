import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { UserData } from './types';
import { DEFAULT_USER_DATA } from './types';

const DB_NAME = 'knowledge-tracker';
const DB_VERSION = 1;
const STORE_NAME = 'userData';
const USER_DATA_KEY = 'main';

interface KnowledgeTrackerDB extends DBSchema {
  userData: {
    key: string;
    value: UserData;
  };
}

let dbPromise: Promise<IDBPDatabase<KnowledgeTrackerDB>> | null = null;

function getDB(): Promise<IDBPDatabase<KnowledgeTrackerDB>> {
  if (!dbPromise) {
    dbPromise = openDB<KnowledgeTrackerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create the userData store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Load user data from IndexedDB
 * Returns default data if none exists
 */
export async function loadUserData(): Promise<UserData> {
  const db = await getDB();
  const data = await db.get(STORE_NAME, USER_DATA_KEY);
  
  if (!data) {
    // Initialize with default data
    const defaultData = { ...DEFAULT_USER_DATA };
    await saveUserData(defaultData);
    return defaultData;
  }
  
  // Run migrations if needed
  return migrateData(data);
}

/**
 * Save user data to IndexedDB
 */
export async function saveUserData(data: UserData): Promise<void> {
  const db = await getDB();
  const updatedData: UserData = {
    ...data,
    lastModified: new Date().toISOString(),
  };
  await db.put(STORE_NAME, updatedData, USER_DATA_KEY);
}

/**
 * Clear all user data (for testing/reset)
 */
export async function clearUserData(): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, USER_DATA_KEY);
}

/**
 * Export user data as JSON string
 */
export async function exportUserData(): Promise<string> {
  const data = await loadUserData();
  const exportData: UserData = {
    ...data,
    lastExported: new Date().toISOString(),
  };
  // Save the lastExported timestamp
  await saveUserData(exportData);
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import user data from JSON string
 * Validates the data structure before importing
 */
export async function importUserData(jsonString: string): Promise<UserData> {
  try {
    const data = JSON.parse(jsonString) as UserData;
    
    // Basic validation
    if (typeof data.version !== 'number') {
      throw new Error('Invalid data: missing version');
    }
    if (!Array.isArray(data.skills)) {
      throw new Error('Invalid data: skills must be an array');
    }
    
    // Migrate if needed and save
    const migratedData = migrateData(data);
    await saveUserData(migratedData);
    
    return migratedData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format');
    }
    throw error;
  }
}

/**
 * Migrate data from older versions
 */
function migrateData(data: UserData): UserData {
  let migrated = { ...data };
  
  // Migration: v1 -> v2 (example for future use)
  // if (migrated.version < 2) {
  //   // Perform v1 to v2 migration
  //   migrated.version = 2;
  // }
  
  return migrated;
}

/**
 * Check if user should be reminded to export
 */
export async function shouldShowExportReminder(): Promise<boolean> {
  const data = await loadUserData();
  
  if (!data.lastExported) {
    // Never exported - remind if they have any skills tracked
    return data.skills.length > 0;
  }
  
  const lastExported = new Date(data.lastExported);
  const daysSinceExport = Math.floor(
    (Date.now() - lastExported.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceExport >= data.settings.exportReminderDays;
}
