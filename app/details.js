// app/details.js — Word Details screen (route "/details")
// Renders the currently fetched word from context. Uses a ScrollView so long
// text and multiple meanings remain fully accessible (safe for long content).
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MeaningCard from '../components/MeaningCard';
import SpeakerButton from '../components/SpeakerButton';
import { COLORS, SHADOW } from '../constants/colors';
import { useHistory } from '../context/HistoryContext';

export default function DetailsScreen() {
  const { currentEntry } = useHistory();
  const router = useRouter();

  // Defensive: if someone lands here without a fetched word, guide them back.
  if (!currentEntry) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="book-outline" size={64} color={COLORS.border} />
        <Text style={styles.emptyText}>No word selected yet.</Text>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.replace('/')}
          accessibilityRole="button"
        >
          <Ionicons name="search" size={16} color={COLORS.white} />
          <Text style={styles.backText}>Go to Search</Text>
        </Pressable>
      </View>
    );
  }

  const { word, phonetic, audioUrl, meanings } = currentEntry;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Gradient header card: word prominently at the top (Activity 2) */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerCard, SHADOW]}
      >
        <Text style={styles.label}>WORD</Text>
        <Text style={styles.word} numberOfLines={2} adjustsFontSizeToFit>
          {word}
        </Text>

        {/* Phonetic spelling — only when present (validation: missing phonetics) */}
        {phonetic ? (
          <View style={styles.phoneticRow}>
            <Ionicons name="mic-outline" size={16} color={COLORS.textOnGradientSoft} />
            <Text style={styles.phonetic}>{phonetic}</Text>
          </View>
        ) : (
          <Text style={styles.noPhonetic}>Phonetic spelling unavailable</Text>
        )}

        {/* Audio controls — rendered ONLY when an audio URL exists (Activity 3) */}
        {audioUrl ? (
          <SpeakerButton audioUrl={audioUrl} variant="light" />
        ) : (
          <View style={styles.noAudio}>
            <Ionicons name="volume-mute-outline" size={15} color={COLORS.textOnGradientSoft} />
            <Text style={styles.noAudioText}>No pronunciation audio available</Text>
          </View>
        )}
      </LinearGradient>

      {/* Section heading */}
      <Text style={styles.sectionHeading}>
        Meanings
        <Text style={styles.sectionCount}>  ·  {meanings.length}</Text>
      </Text>

      {/* Meanings grouped by part of speech */}
      {meanings.map((m, i) => (
        <MeaningCard key={`${m.partOfSpeech}-${i}`} meaning={m} index={i} />
      ))}

      <Pressable
        style={({ pressed }) => [styles.searchAgain, pressed && styles.searchAgainPressed]}
        onPress={() => router.push('/')}
        accessibilityRole="button"
      >
        <Ionicons name="search" size={16} color={COLORS.white} />
        <Text style={styles.searchAgainText}>Search another word</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 22,
  },
  label: {
    color: COLORS.textOnGradientSoft,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  word: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.white,
    textTransform: 'capitalize',
    marginTop: 4,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  phonetic: {
    fontSize: 18,
    color: COLORS.textOnGradient,
    fontWeight: '500',
  },
  noPhonetic: {
    fontSize: 14,
    color: COLORS.textOnGradientSoft,
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
    color: COLORS.textOnGradientSoft,
    fontStyle: 'italic',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14,
    marginLeft: 4,
  },
  sectionCount: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 15,
  },
  searchAgain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  searchAgainPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  searchAgainText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 24,
  },
  emptyText: {
    marginTop: 14,
    fontSize: 16,
    color: COLORS.textMuted,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
  },
  backText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
