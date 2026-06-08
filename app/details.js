// app/details.js — Word Details screen (route "/details")
// Renders the currently fetched word from context inside a ScrollView so long
// text and multiple meanings remain fully accessible. Theme-aware.
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MeaningCard from '../components/MeaningCard';
import SpeakerButton from '../components/SpeakerButton';
import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';

export default function DetailsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { currentEntry } = useHistory();
  const router = useRouter();

  if (!currentEntry) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="book-outline" size={64} color={colors.border} />
        <Text style={styles.emptyText}>No word selected yet.</Text>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.replace('/')}
          accessibilityRole="button"
        >
          <Ionicons name="search" size={16} color={colors.white} />
          <Text style={styles.backText}>Go to Search</Text>
        </Pressable>
      </View>
    );
  }

  const { word, phonetic, audios = [], meanings } = currentEntry;
  const hasAudio = Array.isArray(audios) && audios.length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Gradient header card: word prominently at the top (Activity 2) */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerCard, colors.shadow]}
        >
          <Text style={styles.label}>WORD</Text>
          <Text style={styles.word} numberOfLines={2} adjustsFontSizeToFit>
            {word}
          </Text>

          {phonetic ? (
            <View style={styles.phoneticRow}>
              <Ionicons name="mic-outline" size={16} color={colors.textOnGradientSoft} />
              <Text style={styles.phonetic}>{phonetic}</Text>
            </View>
          ) : (
            <Text style={styles.noPhonetic}>Phonetic spelling unavailable</Text>
          )}

          {hasAudio ? (
            <SpeakerButton audios={audios} variant="light" />
          ) : (
            <View style={styles.noAudio}>
              <Ionicons
                name="volume-mute-outline"
                size={15}
                color={colors.textOnGradientSoft}
              />
              <Text style={styles.noAudioText}>No pronunciation audio available</Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      <Text style={styles.sectionHeading}>
        Meanings
        <Text style={styles.sectionCount}>  ·  {meanings.length}</Text>
      </Text>

      {meanings.map((m, i) => (
        <MeaningCard key={`${m.partOfSpeech}-${i}`} meaning={m} index={i} />
      ))}

      <Pressable
        style={({ pressed }) => [styles.searchAgain, pressed && styles.searchAgainPressed]}
        onPress={() => router.push('/')}
        accessibilityRole="button"
      >
        <Ionicons name="search" size={16} color={colors.white} />
        <Text style={styles.searchAgainText}>Search another word</Text>
      </Pressable>
    </ScrollView>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    content: { padding: 18, paddingBottom: 40 },
    headerCard: { borderRadius: 22, padding: 22, marginBottom: 22 },
    label: {
      color: c.textOnGradientSoft,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.5,
    },
    word: {
      fontSize: 38,
      fontWeight: '800',
      color: c.white,
      textTransform: 'capitalize',
      marginTop: 4,
    },
    phoneticRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
    },
    phonetic: { fontSize: 18, color: c.textOnGradient, fontWeight: '500' },
    noPhonetic: {
      fontSize: 14,
      color: c.textOnGradientSoft,
      fontStyle: 'italic',
      marginTop: 8,
    },
    noAudio: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 16,
    },
    noAudioText: {
      fontSize: 13,
      color: c.textOnGradientSoft,
      fontStyle: 'italic',
    },
    sectionHeading: {
      fontSize: 18,
      fontWeight: '800',
      color: c.text,
      marginBottom: 14,
      marginLeft: 4,
    },
    sectionCount: { color: c.textMuted, fontWeight: '600', fontSize: 15 },
    searchAgain: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      alignSelf: 'center',
      marginTop: 10,
      backgroundColor: c.primary,
      paddingHorizontal: 22,
      paddingVertical: 14,
      borderRadius: 14,
    },
    searchAgainPressed: {
      backgroundColor: c.primaryDark,
      transform: [{ scale: 0.98 }],
    },
    searchAgainText: { color: c.white, fontSize: 15, fontWeight: '700' },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.background,
      padding: 24,
    },
    emptyText: { marginTop: 14, fontSize: 16, color: c.textMuted },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 20,
      backgroundColor: c.primary,
      paddingHorizontal: 22,
      paddingVertical: 13,
      borderRadius: 14,
    },
    backText: { color: c.white, fontWeight: '700', fontSize: 15 },
  });
