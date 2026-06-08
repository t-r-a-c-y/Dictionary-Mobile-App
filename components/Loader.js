// components/Loader.js
// A centered spinner card with an optional message, shown while a request is in
// flight. Card styling keeps it visually consistent with the rest of the app.
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS, SHADOW } from '../constants/colors';

export default function Loader({ message }) {
  return (
    <View style={[styles.container, SHADOW]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  text: {
    marginTop: 14,
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
