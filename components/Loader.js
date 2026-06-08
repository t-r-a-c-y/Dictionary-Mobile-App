// components/Loader.js
// A centered spinner with an optional message, shown while a request is in flight.
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Loader({ message }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textMuted,
  },
});
