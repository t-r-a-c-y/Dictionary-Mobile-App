// components/ErrorView.js
// Friendly, theme-aware error state with an optional Retry button. The icon
// adapts to the type of error.
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ErrorView({ message, onRetry }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const lower = (message || '').toLowerCase();
  const iconName = lower.includes('network')
    ? 'cloud-offline-outline'
    : lower.includes('not found')
    ? 'help-circle-outline'
    : 'alert-circle-outline';

  return (
    <View style={[styles.container, colors.shadow]}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={36} color={colors.error} />
      </View>
      <Text style={styles.message}>{message}</Text>

      {onRetry ? (
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry search"
        >
          <Ionicons name="refresh" size={18} color={colors.white} />
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface,
      borderRadius: 18,
      paddingVertical: 28,
      paddingHorizontal: 20,
      marginTop: 24,
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: c.errorBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    message: {
      fontSize: 15,
      color: c.text,
      textAlign: 'center',
      lineHeight: 22,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 18,
      backgroundColor: c.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    buttonPressed: {
      backgroundColor: c.primaryDark,
      transform: [{ scale: 0.98 }],
    },
    buttonText: {
      color: c.white,
      fontSize: 15,
      fontWeight: '700',
    },
  });
