// components/MeaningCard.js
// Renders one part-of-speech group with all its numbered definitions, example
// sentences, and synonyms/antonyms chips. Defensive against missing data and
// animates in for a polished feel.
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SHADOW } from '../constants/colors';

// A small labelled chip group (used for synonyms & antonyms).
function ChipRow({ icon, label, items, color, bg }) {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.chipSection}>
      <View style={styles.chipHeader}>
        <Ionicons name={icon} size={14} color={color} />
        <Text style={[styles.chipLabel, { color }]}>{label}</Text>
      </View>
      <View style={styles.chips}>
        {items.map((w) => (
          <Text key={w} style={[styles.chip, { backgroundColor: bg, color }]}>
            {w}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function MeaningCard({ meaning, index = 0 }) {
  const { partOfSpeech, definitions, synonyms, antonyms } = meaning || {};
  const list = Array.isArray(definitions) ? definitions : [];

  // Safe render: skip cards that somehow arrived without definitions.
  if (list.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(380).delay(index * 70)}
      style={[styles.card, SHADOW]}
    >
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

      {/* Synonyms / antonyms (only when present) */}
      <ChipRow
        icon="swap-horizontal"
        label="Synonyms"
        items={synonyms}
        color={COLORS.success}
        bg="rgba(22,163,74,0.10)"
      />
      <ChipRow
        icon="git-compare-outline"
        label="Antonyms"
        items={antonyms}
        color={COLORS.error}
        bg="rgba(220,38,38,0.08)"
      />
    </Animated.View>
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
  chipSection: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  chipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  chip: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
    textTransform: 'lowercase',
  },
});
