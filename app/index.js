// app/index.js — Search screen (route "/")
// Responsibilities: capture input, validate it, trigger the shared search(),
// show loading + error states, and navigate to Details on success.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorView from '../components/ErrorView';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import { COLORS } from '../constants/colors';
import { useHistory } from '../context/HistoryContext';

export default function SearchScreen() {
  const [word, setWord] = useState('');
  const [validationError, setValidationError] = useState('');
  const router = useRouter();
  const { search, loading, error, clearError } = useHistory();

  const onSearch = async () => {
    Keyboard.dismiss();

    // 1) Local input validation for instant feedback on empty input.
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.heading}>Look up a word</Text>
        <Text style={styles.subheading}>
          Search English definitions, phonetics & audio pronunciation.
        </Text>

        <SearchBar
          value={word}
          onChangeText={onChange}
          onSubmit={onSearch}
          disabled={loading}
        />

        {/* Empty-input validation message */}
        {validationError ? (
          <Text style={styles.validation}>{validationError}</Text>
        ) : null}

        {/* Loading indicator while fetching */}
        {loading && <Loader message={`Searching "${word.trim()}"…`} />}

        {/* API / network errors with a Retry action */}
        {!loading && error ? (
          <ErrorView message={error} onRetry={onSearch} />
        ) : null}

        {/* Idle hint */}
        {!loading && !error && !validationError ? (
          <Text style={styles.hint}>
            Tip: open the drawer (top-left) to revisit your search history.
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginBottom: 22,
    lineHeight: 21,
  },
  validation: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 10,
  },
  hint: {
    marginTop: 28,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
