// Centralized color palette so styling stays consistent and easy to theme.
export const COLORS = {
  // Brand / gradients
  primary: '#4F46E5',       // indigo (buttons, accents)
  primaryDark: '#4338CA',
  gradientStart: '#6366F1', // indigo
  gradientMid: '#7C3AED',   // violet
  gradientEnd: '#9333EA',   // purple
  accent: '#8B5CF6',        // violet accent (part-of-speech tags)

  // Surfaces
  background: '#F4F5FB',     // app background (soft lavender-grey)
  surface: '#FFFFFF',        // cards
  surfaceAlt: '#F8FAFF',     // subtle alternate surface

  // Text
  text: '#111827',           // primary text
  textMuted: '#6B7280',      // secondary text
  textOnGradient: '#FFFFFF',
  textOnGradientSoft: 'rgba(255,255,255,0.85)',

  // Lines / states
  border: '#E5E7EB',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  success: '#16A34A',
  white: '#FFFFFF',
};

// Reusable soft shadow for cards (works on iOS + Android).
export const SHADOW = {
  shadowColor: '#1E1B4B',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 4,
};
