/**
 * Centralized localStorage keys for the OpenBook application
 * 
 * This module serves as the single source of truth for all localStorage keys
 * used throughout the application. Any new feature that uses localStorage
 * should add its keys here to ensure they are properly cleared when needed.
 * 
 * Testing recommendations:
 * - Verify all individual keys are included in OPENBOOK_STORAGE_KEYS
 * - Ensure clearAllStorageData removes all documented keys
 * - Test that non-OpenBook keys are preserved during clearing
 * - Validate no duplicate keys exist in the arrays
 */

import {
  STREAK_COUNT_KEY,
  STREAK_LAST_VISIT_KEY,
  STREAK_LAST_CELEBRATED_MILESTONE_KEY
} from './streakKeys';

// Main data stores
export const SPACES_DATA_KEY = 'openbook_spaces_data';
export const NOTEBOOKS_DATA_KEY = 'openbook_notebooks_data';
export const STUDY_MODES_KEY = 'openbook_study_modes';
export const USER_DATA_KEY = 'openbook_user_data';
export const JOURNAL_ENTRIES_KEY = 'openbook_journal_entries';

// UI preferences and settings
export const SIDEBAR_STATE_KEY = 'openbook_sidebar_state';
export const ANIMATIONS_PREFERENCE_KEY = 'enableAnimations';
export const SELECTED_MODEL_KEY = 'openbook_selected_model';
export const INSTALL_PROMPT_DISMISSED_KEY = 'openbook_install_prompt_dismissed';
export const USER_ID_KEY = 'openbook_user_id';

/**
 * All localStorage keys used by the OpenBook application
 * 
 * When adding new localStorage usage:
 * 1. Define the key as a named export above
 * 2. Add it to this array
 * 3. Update the clear storage UI description if needed
 */
const OPENBOOK_STORAGE_KEYS: readonly string[] = [
  // Main data stores
  SPACES_DATA_KEY,
  NOTEBOOKS_DATA_KEY,
  STUDY_MODES_KEY,
  USER_DATA_KEY,
  JOURNAL_ENTRIES_KEY,

  // UI preferences and settings
  SIDEBAR_STATE_KEY,
  ANIMATIONS_PREFERENCE_KEY,
  SELECTED_MODEL_KEY,
  INSTALL_PROMPT_DISMISSED_KEY,
  USER_ID_KEY,

  // Streak data
  STREAK_COUNT_KEY,
  STREAK_LAST_VISIT_KEY,
  STREAK_LAST_CELEBRATED_MILESTONE_KEY,
] as const;

/**
 * Categories of storage keys for documentation and UI purposes
 */
const STORAGE_KEY_CATEGORIES = {
  DATA: {
    keys: [SPACES_DATA_KEY, NOTEBOOKS_DATA_KEY, STUDY_MODES_KEY, USER_DATA_KEY, JOURNAL_ENTRIES_KEY],
    description: 'Core application data (spaces, journals, notebooks, etc.)'
  },
  PREFERENCES: {
    keys: [SIDEBAR_STATE_KEY, ANIMATIONS_PREFERENCE_KEY, SELECTED_MODEL_KEY, INSTALL_PROMPT_DISMISSED_KEY, USER_ID_KEY],
    description: 'User preferences and UI settings'
  }
} as const;

/**
 * Whitelisted prefixes for OpenBook storage keys
 * This prevents accidental removal of keys from other applications
 * that might share similar prefixes
 */
const OPENBOOK_PREFIX_WHITELIST = [
  'openbook_',
  'openbook-dev_',
  'openbook-staging_',
] as const;

/**
 * Clears all OpenBook localStorage data
 * 
 * @param clearPreferences - Whether to also clear user preferences (default: true)
 */
export function clearAllStorageData(clearPreferences: boolean = true): void {
  const keysToRemove = clearPreferences
    ? OPENBOOK_STORAGE_KEYS
    : STORAGE_KEY_CATEGORIES.DATA.keys;

  // First, remove all explicitly defined keys
  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });

  // Fallback: if the caller opted to clear preferences, remove any additional
  // OpenBook-prefixed keys that we might have forgotten to whitelist explicitly.
  if (clearPreferences) {
    Object.keys(localStorage).forEach((key) => {
      const isOpenBookKey = OPENBOOK_PREFIX_WHITELIST.some((prefix) => key.startsWith(prefix));
      if (isOpenBookKey && !OPENBOOK_STORAGE_KEYS.includes(key as any)) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * ---------------------------------------------------------------------------
 * Key migrations
 * ---------------------------------------------------------------------------
 * When a localStorage key is renamed, add a mapping here so existing user
 * data is preserved. Migrations are run exactly once, the first time this
 * module is imported in a browser environment.
 */

const KEY_MIGRATIONS: Array<{ from: string; to: string }> = [
  { from: 'journalEntries', to: JOURNAL_ENTRIES_KEY },
  { from: 'sidebar-isOpen', to: SIDEBAR_STATE_KEY },
  { from: 'installPromptDismissed', to: INSTALL_PROMPT_DISMISSED_KEY },
  // Migrate streak keys from dot notation to underscore notation
  { from: 'openbook.streak.count', to: STREAK_COUNT_KEY },
  { from: 'openbook.streak.lastVisit', to: STREAK_LAST_VISIT_KEY },
  { from: 'openbook.streak.lastCelebratedMilestone', to: STREAK_LAST_CELEBRATED_MILESTONE_KEY },
];

if (typeof window !== 'undefined') {
  KEY_MIGRATIONS.forEach(({ from, to }) => {
    try {
      const oldVal = localStorage.getItem(from);
      if (oldVal !== null && localStorage.getItem(to) === null) {
        localStorage.setItem(to, oldVal);
        localStorage.removeItem(from);
      }
    } catch (err) {
      // Access to localStorage can fail (e.g., privacy mode). Silently ignore.
      console.error('[OpenBook] Storage key migration failed:', err);
    }
  });
} 