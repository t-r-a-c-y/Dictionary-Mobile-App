// components/MeaningCard.js
// One part-of-speech group: numbered definitions, examples, and synonyms/
// antonyms chips. Theme-aware, animated, and defensive against missing data.
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

// A labelled, self-contained chip group (synonyms / antonyms).
function ChipRow({ icon, label, items, color, bg, styles }) {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.chipSection}>
      <View style={styles.chipHeader}>
        <Ionicons name={icon} size={14} color={color} />
        <Text style={[styles.chipLabel, { color }]}>{label}</Text>
      </View>
      <View style={styles.chips}>
        {items.map((w) => (
          <View key={w} style={[styles.chip, { backgroundColor: bg }]}>
            <Text
              style={[styles.chipText, { color }]}
              numberOfLines={1}
            >
              {w}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function MeaningCard({ meaning, index = 0 }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { partOfSpeech, definitions, synonyms, antonyms } = meaning || {};
  const list = Array.isArray(definitions) ? definitions : [];

  if (list.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(380).delay(index * 70)}
      style={[styles.card, colors.shadow]}
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
                color={colors.accent}
              />
              <Text style={styles.example}>{def.example}</Text>
            </View>
          ) : null}
        </View>
      ))}

      <ChipRow
        icon="swap-horizontal"
        label="Synonyms"
        items={synonyms}
        color={colors.success}
        bg={colors.successTint}
        styles={styles}
      />
      <ChipRow
        icon="git-compare-outline"
        label="Antonyms"
        items={antonyms}
        color={colors.error}
        bg={colors.errorTint}
        styles={styles}
      />
    </Animated.View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 18,
      padding: 18,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: c.accent,
      overflow: 'hidden', // keep all content inside the rounded card
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    posTag: {
      backgroundColor: c.accentTint,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 999,
    },
    posText: {
      color: c.accent,
      fontWeight: '800',
      fontSize: 13,
      textTransform: 'capitalize',
    },
    count: {
      color: c.textMuted,
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
      backgroundColor: c.surfaceAlt,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1,
    },
    numberText: {
      fontSize: 12,
      fontWeight: '700',
      color: c.primary,
    },
    definition: {
      flex: 1,
      fontSize: 15.5,
      color: c.text,
      lineHeight: 23,
    },
    exampleBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor: c.surfaceAlt,
      borderRadius: 12,
      padding: 12,
      marginTop: 10,
      marginLeft: 32,
    },
    example: {
      flex: 1,
      fontSize: 14,
      color: c.textMuted,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    chipSection: {
      marginTop: 6,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    chipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10,
    },
    chipLabel: {
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    // Full-width wrapping row that keeps every chip inside the card.
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      width: '100%',
    },
    chip: {
      maxWidth: '100%',
      flexShrink: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 8,
    },
    chipText: {
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'lowercase',
    },
  });
