// constants/colors.js
// Two full palettes (light + dark) for the blue theme. Components read the
// active palette from ThemeContext via useTheme().colors — never import these
// directly for styling (except as a static fallback).

export const lightColors = {
  mode: 'light',
  isDark: false,

  // Brand / gradients
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  gradientStart: '#3B82F6',
  gradientMid: '#2563EB',
  gradientEnd: '#1E40AF',
  accent: '#0EA5E9',

  // Translucent tints
  primaryTint: 'rgba(37,99,235,0.12)',
  accentTint: 'rgba(14,165,233,0.12)',
  successTint: 'rgba(22,163,74,0.10)',
  errorTint: 'rgba(220,38,38,0.08)',

  // Surfaces
  background: '#EEF3FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F7FF',

  // Text
  text: '#0F1B2D',
  textMuted: '#5B6B82',
  textOnGradient: '#FFFFFF',
  textOnGradientSoft: 'rgba(255,255,255,0.85)',

  // Lines / states
  border: '#DCE5F2',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  success: '#16A34A',
  white: '#FFFFFF',
  backdrop: 'rgba(15,27,45,0.45)',

  shadow: {
    shadowColor: '#0B2E66',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
};

export const darkColors = {
  mode: 'dark',
  isDark: true,

  // Brand / gradients (brighter for contrast on dark surfaces)
  primary: '#60A5FA',
  primaryDark: '#93C5FD',
  gradientStart: '#1E3A8A',
  gradientMid: '#1D4ED8',
  gradientEnd: '#2563EB',
  accent: '#38BDF8',

  // Translucent tints
  primaryTint: 'rgba(96,165,250,0.18)',
  accentTint: 'rgba(56,189,248,0.16)',
  successTint: 'rgba(74,222,128,0.14)',
  errorTint: 'rgba(248,113,113,0.16)',

  // Surfaces
  background: '#0A101D',
  surface: '#141D2E',
  surfaceAlt: '#1C2740',

  // Text
  text: '#E8EEF7',
  textMuted: '#94A3B8',
  textOnGradient: '#FFFFFF',
  textOnGradientSoft: 'rgba(255,255,255,0.85)',

  // Lines / states
  border: '#26344D',
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
