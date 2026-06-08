// components/SearchBar.js
// Controlled text input + Search button. Purely presentational; theme-aware.
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  disabled,
  error,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <Ionicons
          name="search"
          size={20}
          color={error ? colors.error : colors.textMuted}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter an English word"
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          editable={!disabled}
        />
        {value?.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={8}
            accessibilityLabel="Clear input"
          >
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.buttonPressed,
        ]}
        onPress={onSubmit}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        <Ionicons name="search" size={18} color={colors.white} />
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surfaceAlt,
      borderWidth: 1.5,
      borderColor: c.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      height: 54,
      gap: 8,
    },
    inputRowError: {
      borderColor: c.error,
      backgroundColor: c.errorBg,
    },
    icon: {
      marginRight: 2,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: c.text,
      height: '100%',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 12,
      backgroundColor: c.primary,
      borderRadius: 14,
      height: 52,
    },
    buttonPressed: {
      backgroundColor: c.primaryDark,
      transform: [{ scale: 0.99 }],
    },
    buttonDisabled: {
      backgroundColor: c.border,
    },
    buttonText: {
      color: c.white,
      fontSize: 16,
      fontWeight: '700',
    },
  });
