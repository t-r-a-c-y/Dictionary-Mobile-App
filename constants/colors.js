// constants/colors.js
// Two full palettes (light + dark) for the DARK GREEN theme. Components read the
// active palette from ThemeContext via useTheme().colors — never import these
// directly for styling (except as a static fallback).

export const lightColors = {
  mode: 'light',
  isDark: false,

  // Brand / gradients (dark green)
  primary: '#15803D',       // green-700
  primaryDark: '#166534',   // green-800 (pressed)
  gradientStart: '#166534', // green-800
  gradientMid: '#15803D',   // green-700
  gradientEnd: '#14532D',   // green-900
  accent: '#0D9488',        // teal-600 (secondary accent / POS tags)

  // Translucent tints
  primaryTint: 'rgba(21,128,61,0.12)',
  accentTint: 'rgba(13,148,136,0.12)',
  successTint: 'rgba(22,163,74,0.12)',
  errorTint: 'rgba(220,38,38,0.08)',

  // Surfaces
  background: '#EDF4EE',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F7F2',

  // Text
  text: '#0E1F15',
  textMuted: '#566B5D',
  textOnGradient: '#FFFFFF',
  textOnGradientSoft: 'rgba(255,255,255,0.85)',

  // Lines / states
  border: '#D6E6DA',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  success: '#15803D',
  white: '#FFFFFF',
  backdrop: 'rgba(14,31,21,0.45)',

  shadow: {
    shadowColor: '#0B3A22',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
};

export const darkColors = {
  mode: 'dark',
  isDark: true,

  // Brand / gradients (brighter greens for contrast on dark surfaces)
  primary: '#34D399',       // emerald-400
  primaryDark: '#6EE7B7',
  gradientStart: '#14532D', // green-900
  gradientMid: '#166534',   // green-800
  gradientEnd: '#15803D',   // green-700
  accent: '#2DD4BF',        // teal-400

  // Translucent tints
  primaryTint: 'rgba(52,211,153,0.18)',
  accentTint: 'rgba(45,212,191,0.16)',
  successTint: 'rgba(74,222,128,0.14)',
  errorTint: 'rgba(248,113,113,0.16)',

  // Surfaces
  background: '#08140D',
  surface: '#10241A',
  surfaceAlt: '#173024',

  // Text
  text: '#E6F2EA',
  textMuted: '#8FA899',
  textOnGradient: '#FFFFFF',
  textOnGradientSoft: 'rgba(255,255,255,0.85)',

  // Lines / states
  border: '#22432F',
  error: '#F87171',
  errorBg: 'rgba(248,113,113,0.12)',
  success: '#4ADE80',
  white: '#FFFFFF',
  backdrop: 'rgba(0,0,0,0.6)',

  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Static fallback (light) — safety net for any non-themed reference.
export const COLORS = lightColors;
export const SHADOW = lightColors.shadow;
