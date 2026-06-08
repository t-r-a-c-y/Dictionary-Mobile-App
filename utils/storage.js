// utils/storage.js
// Thin, safe wrapper around AsyncStorage for JSON values. Every call is
// wrapped so a storage failure can never crash the app.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  history: 'dict:history',   // array of searched words
  theme: 'dict:themeMode',   // 'light' | 'dark' | null (follow system)
};

/** Read and JSON-parse a value; returns `fallback` on miss or error. */
export async function loadJSON(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** JSON-stringify and persist a value; best-effort (never throws). */
export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* best-effort: ignore write failures */
  }
}
