// app/index.js — Search screen (route "/")
// Responsibilities: capture input, validate it, trigger the shared search(),
// show loading + error states, and navigate to Details on success.
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import ErrorView from '../components/ErrorView';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import { COLORS, SHADOW } from '../constants/colors';
import { useHistory } from '../context/HistoryContext';

export default function SearchScreen() {
  const [word, setWord] = useState('');
  const [validationError, setValidationError] = useState('');
  const router = useRouter();
  const { search, loading, error, clearError, history, clearHistory } =
    useHistory();

  const onSearch = async () => {
    Keyboard.dismiss();

    // 1) Local input validation: reject empty AND whitespace-only input.
    if (!word.trim()) {
      setValidationError('Please enter a word to search.');
      return;
    }
    setValidationError('');
    clearError();

    // 2) Delegate to shared search (fetch + history + currentEntry).
    const ok = await search(word);

    // 3) On success, render the Details screen.
    if (ok) {
      router.push('/details');
    }
    // On failure, `error` from context drives the ErrorView below.
  };

  const onChange = (text) => {
    setWord(text);
    if (validationError) setValidationError('');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Gradient hero header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroIcon}>
          <Ionicons name="book" size={28} color={COLORS.white} />
        </View>
        <Text style={styles.heroTitle}>Dictionary</Text>
        <Text style={styles.heroSubtitle}>
          Definitions, phonetics & pronunciation at your fingertips.
        </Text>
      </LinearGradient>

      {/* Floating search card overlapping the hero */}
      <View style={styles.body}>
        <Animated.View
          entering={FadeInDown.duration(450)}
          style={[styles.searchCard, SHADOW]}
        >
          <Text style={styles.cardLabel}>Look up a word</Text>
          <SearchBar
            value={word}
            onChangeText={onChange}
            onSubmit={onSearch}
            disabled={loading}
            error={!!validationError}
          />
          {validationError ? (
            <View style={styles.validationRow}>
              <Ionicons name="alert-circle" size={16} color={COLORS.error} />
              <Text style={styles.validation}>{validationError}</Text>
            </View>
          ) : null}
        </Animated.View>

        {/* Loading indicator while fetching */}
        {loading && <Loader message={`Searching "${word.trim()}"…`} />}

        {/* API / network errors with a Retry action */}
        {!loading && error ? (
          <ErrorView message={error} onRetry={onSearch} />
        ) : null}

        {/* Idle helper content */}
        {!loading && !error ? (
          <Animated.View entering={FadeIn.duration(500)} style={styles.tips}>
            {history.length === 0 ? (
              <>
                <Ionicons
                  name="search-circle-outline"
                  size={72}
                  color={COLORS.border}
                />
                <Text style={styles.tipTitle}>Start exploring</Text>
                <Text style={styles.tipText}>
                  Try a word like “serendipity”, “run”, or “hello”.
                </Text>
                <View style={styles.suggestRow}>
                  {['hello', 'serendipity', 'run'].map((w) => (
                    <Text
                      key={w}
                      onPress={async () => {
                        const ok = await search(w);
                        if (ok) router.push('/details');
                      }}
                      style={styles.suggestChip}
                    >
                      {w}
                    </Text>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.recentWrap}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentTitle}>Recent searches</Text>
                  <Text
                    onPress={clearHistory}
                    style={styles.clearLink}
                    accessibilityRole="button"
                  >
                    Clear all
                  </Text>
                </View>
                <View style={styles.chips}>
                  {history.slice(0, 8).map((w) => (
                    <Text
                      key={w}
                      onPress={async () => {
                        const ok = await search(w);
                        if (ok) router.push('/details');
                      }}
                      style={styles.chip}
                    >
                      {w}
                    </Text>
                  ))}
                </View>
                <Text style={styles.tipHint}>
                  Open the drawer (top-left) for your full history.
                </Text>
              </View>
            )}
          </Animated.View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    paddingTop: 28,
    paddingBottom: 64,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.white,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.textOnGradientSoft,
    marginTop: 6,
    lineHeight: 21,
  },
  body: {
    paddingHorizontal: 20,
    marginTop: -40, // pull the card up to overlap the hero
  },
  searchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  validation: {
    color: COLORS.error,
    fontSize: 14,
  },
  tips: {
    alignItems: 'center',
    marginTop: 36,
    paddingHorizontal: 10,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  suggestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 18,
  },
  suggestChip: {
    backgroundColor: COLORS.primaryTint,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'capitalize',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    overflow: 'hidden',
  },
  recentWrap: {
    width: '100%',
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  clearLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.error,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignSelf: 'flex-start',
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'capitalize',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  tipHint: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 18,
    alignSelf: 'flex-start',
  },
});
