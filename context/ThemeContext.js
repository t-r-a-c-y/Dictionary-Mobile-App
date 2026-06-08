// context/ThemeContext.js
// Provides the active color palette + a toggle for light/dark mode.
// Defaults to the device's system scheme, and lets the user override it.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../constants/colors';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../utils/storage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  // null = follow the system; otherwise an explicit user choice.
  const [override, setOverride] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore the saved theme preference on app start.
  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await loadJSON(STORAGE_KEYS.theme, null);
      if (active && (stored === 'light' || stored === 'dark')) {
        setOverride(stored);
      }
      if (active) setHydrated(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist the preference whenever the user changes it.
  useEffect(() => {
    if (hydrated) saveJSON(STORAGE_KEYS.theme, override);
  }, [override, hydrated]);

  const mode = override ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const isDark = mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = useCallback(() => {
    setOverride(isDark ? 'light' : 'dark');
  }, [isDark]);

  const value = useMemo(
    () => ({ colors, isDark, mode, toggleTheme, setMode: setOverride }),
    [colors, isDark, mode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
