// components/SearchBar.js
// Controlled text input + Search button. Purely presentational: all logic
// (validation, fetching) is handled by the parent screen.
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SearchBar({ value, onChangeText, onSubmit, disabled }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.inputRow}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.textMuted}
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    height: '100%',
  },
  button: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: COLORS.primaryDark,
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
