// components/SearchBar.js
// Controlled text input + Search button. Purely presentational: all logic
// (validation, fetching) is handled by the parent screen.
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  disabled,
  error,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <Ionicons
          name="search"
          size={20}
          color={error ? COLORS.error : COLORS.textMuted}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter an English word"
          placeholderTextColor={COLORS.textMuted}
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
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
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
        <Ionicons name="search" size={18} color={COLORS.white} />
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    gap: 8,
  },
  inputRowError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBg,
  },
  icon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    height: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 52,
  },
  buttonPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
