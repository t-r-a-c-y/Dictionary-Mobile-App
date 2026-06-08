// context/ThemeContext.js
// Provides the active color palette + a toggle for light/dark mode.
// Defaults to the device's system scheme, and lets the user override it.
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../constants/colors';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  // null = follow the system; otherwise an explicit user choice.
  const [override, setOverride] = useState(null);

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
