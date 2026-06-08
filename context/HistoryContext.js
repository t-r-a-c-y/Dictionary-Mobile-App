// context/HistoryContext.js
// Single source of truth for search state shared between the Search screen and
// the navigation drawer. Holds:
//   - history:      deduplicated list of successfully searched words
//   - currentEntry: the most recently fetched/normalized word (rendered on Details)
//   - loading/error: request status for the UI
//   - search():     validate -> fetch -> store -> record history (used everywhere)
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchWord } from '../services/dictionaryApi';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../utils/storage';
import { validateWord } from '../utils/validation';

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Guards against persisting the initial empty list before stored history
  // has been read back in.
  const [hydrated, setHydrated] = useState(false);

  // Load saved history once on app start.
  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await loadJSON(STORAGE_KEYS.history, []);
      if (active && Array.isArray(stored)) setHistory(stored);
      if (active) setHydrated(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist history whenever it changes (after hydration).
  useEffect(() => {
    if (hydrated) saveJSON(STORAGE_KEYS.history, history);
  }, [history, hydrated]);

  // Add a word to history, newest first, ignoring duplicates (case-insensitive).
  const addToHistory = useCallback((word) => {
    const w = (word || '').toLowerCase().trim();
    if (!w) return;
    setHistory((prev) => (prev.includes(w) ? prev : [w, ...prev]));
  }, []);

  // Remove a single word from history.
  const removeFromHistory = useCallback((word) => {
    const w = (word || '').toLowerCase().trim();
    setHistory((prev) => prev.filter((item) => item !== w));
  }, []);

  // Clear the entire search history.
  const clearHistory = useCallback(() => setHistory([]), []);

  // The core flow. Returns true on success so callers can navigate.
  const search = useCallback(
    async (rawWord) => {
      const word = (rawWord || '').trim();

      // Input validation guard (the UI also validates; this is a safety net
      // that covers programmatic/history-triggered searches too).
      const validationMsg = validateWord(rawWord);
      if (validationMsg) {
        setError(validationMsg);
        return false;
      }

      setLoading(true);
      setError(null);
      try {
        const entry = await fetchWord(word);
        setCurrentEntry(entry);       // stored temporarily for the Details screen
        addToHistory(entry.word);     // record only successful searches
        return true;
      } catch (err) {
        setCurrentEntry(null);
        setError(err.message || 'Something went wrong. Please try again.');
        return false;
      } finally {
        setLoading(false);            // always hide the loader, even on error
      }
    },
    [addToHistory]
  );

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      history,
      currentEntry,
      loading,
      error,
      search,
      addToHistory,
      removeFromHistory,
      clearHistory,
      clearError,
    }),
    [
      history,
      currentEntry,
      loading,
      error,
      search,
      addToHistory,
      removeFromHistory,
      clearHistory,
      clearError,
    ]
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

// Convenience hook with a guard against using it outside the provider.
export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return ctx;
}
