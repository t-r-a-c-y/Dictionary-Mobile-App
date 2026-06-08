// components/Loader.js
// A centered spinner card with an optional message; theme-aware.
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Loader({ message }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, colors.shadow]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
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
      paddingVertical: 32,
      paddingHorizontal: 20,
      marginTop: 24,
    },
    text: {
      marginTop: 14,
      fontSize: 15,
      color: c.textMuted,
      fontWeight: '500',
    },
  });
