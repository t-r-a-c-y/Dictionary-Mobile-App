// components/ErrorView.js
// Friendly error state with an optional Retry button so users can recover
// without retyping their word. The icon adapts to the type of error.
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, SHADOW } from '../constants/colors';

export default function ErrorView({ message, onRetry }) {
  // Pick a fitting icon based on the message wording.
  const lower = (message || '').toLowerCase();
  const iconName = lower.includes('network')
    ? 'cloud-offline-outline'
    : lower.includes('not found')
    ? 'help-circle-outline'
    : 'alert-circle-outline';

  return (
    <View style={[styles.container, SHADOW]}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={36} color={COLORS.error} />
      </View>
      <Text style={styles.message}>{message}</Text>

      {onRetry ? (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry search"
        >
          <Ionicons name="refresh" size={18} color={COLORS.white} />
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  message: {
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
