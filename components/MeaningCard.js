// components/MeaningCard.js
// Renders one part-of-speech group with all its numbered definitions and any
// example sentences.
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function MeaningCard({ meaning }) {
  const { partOfSpeech, definitions } = meaning;

  return (
    <View style={styles.card}>
      <View style={styles.posTag}>
        <Text style={styles.posText}>{partOfSpeech}</Text>
      </View>

      {definitions.map((def, idx) => (
        <View key={idx} style={styles.defBlock}>
          <Text style={styles.definition}>
            {idx + 1}. {def.definition}
          </Text>
          {def.example ? (
            <Text style={styles.example}>“{def.example}”</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  posTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139,92,246,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  posText: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  defBlock: {
    marginBottom: 12,
  },
  definition: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  example: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 20,
  },
});
