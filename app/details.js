// app/details.js — Word Details screen (route "/details")
// Renders the currently fetched word from context. Uses a ScrollView so long
// text and multiple meanings remain fully accessible.
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MeaningCard from '../components/MeaningCard';
import SpeakerButton from '../components/SpeakerButton';
import { COLORS } from '../constants/colors';
import { useHistory } from '../context/HistoryContext';

export default function DetailsScreen() {
  const { currentEntry } = useHistory();
  const router = useRouter();

  // Defensive: if someone lands here without a fetched word, guide them back.
  if (!currentEntry) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="book-outline" size={56} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>No word selected yet.</Text>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.replace('/')}
          accessibilityRole="button"
        >
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
      {/* Header card: word, phonetic, and audio (only if available) */}
      <View style={styles.headerCard}>
        <Text style={styles.word}>{word}</Text>
        {phonetic ? <Text style={styles.phonetic}>{phonetic}</Text> : null}

        {/* Speaker icon shown ONLY when an audio URL exists */}
        {audioUrl ? <SpeakerButton audioUrl={audioUrl} /> : null}
      </View>

      {/* Meanings grouped by part of speech */}
      {meanings.map((m, i) => (
        <MeaningCard key={`${m.partOfSpeech}-${i}`} meaning={m} />
      ))}

      <Pressable
        style={styles.searchAgain}
        onPress={() => router.push('/')}
        accessibilityRole="button"
      >
        <Ionicons name="search" size={16} color={COLORS.primary} />
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
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  word: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  phonetic: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 4,
  },
  searchAgain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    marginTop: 8,
    padding: 10,
  },
  searchAgainText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
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
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
