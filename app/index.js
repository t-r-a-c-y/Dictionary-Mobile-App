// app/index.js — Search screen (route "/")
// Captures input, validates it, triggers the shared search(), shows loading +
// error states, and navigates to Details on success. Theme-aware.
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import ConfirmModal from '../components/ConfirmModal';
import ErrorView from '../components/ErrorView';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';
import { validateWord } from '../utils/validation';

export default function SearchScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [word, setWord] = useState('');
  const [validationError, setValidationError] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const router = useRouter();
  const { search, loading, error, clearError, history, clearHistory } =
    useHistory();

  // Clear the previous word whenever the search screen regains focus, so
  // "Search another word" always starts from an empty field.
  useFocusEffect(
    useCallback(() => {
      setWord('');
      setValidationError('');
    }, [])
  );

  const onSearch = async () => {
    Keyboard.dismiss();
    // Run the full validation rule set (empty / sentence / numbers / symbols).
    const validationMsg = validateWord(word);
    if (validationMsg) {
      setValidationError(validationMsg);
      return;
    }
    setValidationError('');
    clearError();
    const ok = await search(word);
    if (ok) router.push('/details');
  };

  const onChange = (text) => {
    setWord(text);
    if (validationError) setValidationError('');
  };

  const runWord = async (w) => {
    const ok = await search(w);
    if (ok) router.push('/details');
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient hero header */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroIcon}>
            <Ionicons name="book" size={28} color={colors.white} />
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
            style={[styles.searchCard, colors.shadow]}
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
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.validation}>{validationError}</Text>
              </View>
            ) : null}
          </Animated.View>

          {loading && <Loader message={`Searching "${word.trim()}"…`} />}

          {!loading && error ? (
            <ErrorView message={error} onRetry={onSearch} />
          ) : null}

          {!loading && !error ? (
            <Animated.View entering={FadeIn.duration(500)} style={styles.tips}>
              {history.length === 0 ? (
                <>
                  <Ionicons
                    name="search-circle-outline"
                    size={72}
                    color={colors.border}
                  />
                  <Text style={styles.tipTitle}>Start exploring</Text>
                  <Text style={styles.tipText}>
                    Try a word like “serendipity”, “run”, or “hello”.
                  </Text>
                  <View style={styles.suggestRow}>
                    {['hello', 'serendipity', 'run'].map((w) => (
                      <Text
                        key={w}
                        onPress={() => runWord(w)}
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
                      onPress={() => setConfirmClear(true)}
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
                        onPress={() => runWord(w)}
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

      {/* Themed confirm dialog for clearing recent searches */}
      <ConfirmModal
        visible={confirmClear}
        icon="trash-outline"
        title="Clear search history?"
        message="This removes all words from your history. This action cannot be undone."
        confirmLabel="Clear all"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => {
          clearHistory();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    scrollContent: { paddingBottom: 40 },
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
    heroTitle: { fontSize: 30, fontWeight: '800', color: c.white },
    heroSubtitle: {
      fontSize: 15,
      color: c.textOnGradientSoft,
      marginTop: 6,
      lineHeight: 21,
    },
    body: { paddingHorizontal: 20, marginTop: -40 },
    searchCard: {
      backgroundColor: c.surface,
      borderRadius: 20,
      padding: 18,
    },
    cardLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: c.textMuted,
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
    validation: { color: c.error, fontSize: 14 },
    tips: { alignItems: 'center', marginTop: 36, paddingHorizontal: 10 },
    tipTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.text,
      marginTop: 12,
    },
    tipText: {
      fontSize: 14,
      color: c.textMuted,
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
      backgroundColor: c.primaryTint,
      color: c.primary,
      fontWeight: '700',
      fontSize: 14,
      textTransform: 'capitalize',
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 999,
      overflow: 'hidden',
    },
    recentWrap: { width: '100%' },
    recentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    recentTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    clearLink: { fontSize: 13, fontWeight: '700', color: c.error },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      alignSelf: 'flex-start',
    },
    chip: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      color: c.primary,
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
      color: c.textMuted,
      marginTop: 18,
      alignSelf: 'flex-start',
    },
  });
