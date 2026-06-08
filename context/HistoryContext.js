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
  useMemo,
  useState,
} from 'react';
import { fetchWord } from '../services/dictionaryApi';

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a word to history, newest first, ignoring duplicates (case-insensitive).
  const addToHistory = useCallback((word) => {
    const w = (word || '').toLowerCase().trim();
    if (!w) return;
    setHistory((prev) => (prev.includes(w) ? prev : [w, ...prev]));
  }, []);

  // The core flow. Returns true on success so callers can navigate.
  const search = useCallback(
    async (rawWord) => {
      const word = (rawWord || '').trim();

      // Input validation guard (the UI also validates, this is a safety net).
      if (!word) {
        setError('Please enter a word to search.');
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
      clearError,
    }),
    [history, currentEntry, loading, error, search, addToHistory, clearError]
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
