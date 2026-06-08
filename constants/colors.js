// Centralized color palette so styling stays consistent and easy to theme.
// Theme: clean, professional BLUE.
export const COLORS = {
  // Brand / gradients
  primary: '#2563EB',       // blue-600 (buttons, accents)
  primaryDark: '#1D4ED8',   // blue-700 (pressed states)
  gradientStart: '#3B82F6', // blue-500
  gradientMid: '#2563EB',   // blue-600
  gradientEnd: '#1E40AF',   // blue-800
  accent: '#0EA5E9',        // sky-500 (part-of-speech tags / secondary accent)

  // Translucent brand tints (used for soft badge/icon backgrounds)
  primaryTint: 'rgba(37,99,235,0.12)',
  accentTint: 'rgba(14,165,233,0.12)',

  // Surfaces
  background: '#EEF3FB',     // app background (soft blue-grey)
  surface: '#FFFFFF',        // cards
  surfaceAlt: '#F2F7FF',     // subtle alternate surface (blue-tinted)

  // Text
  text: '#0F1B2D',           // primary text (deep navy)
  textMuted: '#5B6B82',      // secondary text (blue-grey)
  textOnGradient: '#FFFFFF',
  textOnGradientSoft: 'rgba(255,255,255,0.85)',

  // Lines / states
  border: '#DCE5F2',         // blue-tinted border
  error: '#DC2626',
  errorBg: '#FEF2F2',
  success: '#16A34A',
  white: '#FFFFFF',
};

// Reusable soft shadow for cards (works on iOS + Android).
export const SHADOW = {
  shadowColor: '#0B2E66',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 14,
  elevation: 4,
};
