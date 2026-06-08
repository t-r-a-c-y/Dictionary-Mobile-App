// components/MeaningCard.js
// Renders one part-of-speech group with all its numbered definitions and any
// example sentences. Defensive against missing/empty definition lists.
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SHADOW } from '../constants/colors';

export default function MeaningCard({ meaning }) {
  const { partOfSpeech, definitions } = meaning || {};
  const list = Array.isArray(definitions) ? definitions : [];

  // Safe render: skip cards that somehow arrived without definitions.
  if (list.length === 0) return null;

  return (
    <View style={[styles.card, SHADOW]}>
      <View style={styles.header}>
        <View style={styles.posTag}>
          <Text style={styles.posText}>{partOfSpeech || 'unknown'}</Text>
        </View>
        <Text style={styles.count}>
          {list.length} {list.length === 1 ? 'definition' : 'definitions'}
        </Text>
      </View>

      {list.map((def, idx) => (
        <View key={idx} style={styles.defBlock}>
          <View style={styles.defRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{idx + 1}</Text>
            </View>
            <Text style={styles.definition}>{def.definition}</Text>
          </View>

          {def.example ? (
            <View style={styles.exampleBox}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={14}
                color={COLORS.accent}
              />
              <Text style={styles.example}>{def.example}</Text>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  posTag: {
    backgroundColor: COLORS.accentTint,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  posText: {
    color: COLORS.accent,
    fontWeight: '800',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  count: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  defBlock: {
    marginBottom: 14,
  },
  defRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  numberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  definition: {
    flex: 1,
    fontSize: 15.5,
    color: COLORS.text,
    lineHeight: 23,
  },
  exampleBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    marginLeft: 32,
  },
  example: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
