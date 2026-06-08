// components/HistoryDrawerContent.js
// Custom contents for the navigation drawer: a branded header, a "Search" link,
// and the deduplicated search-history list. Tapping a history word re-fetches it
// and navigates to the Details screen.
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useHistory } from '../context/HistoryContext';

export default function HistoryDrawerContent(props) {
  const router = useRouter();
  const { history, search } = useHistory();

  // Re-run the exact same search flow used by the Search screen.
  const onSelectWord = async (word) => {
    props.navigation.closeDrawer();
    const ok = await search(word);
    if (ok) router.push('/details');
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
      {/* Branded header */}
      <View style={styles.header}>
        <Ionicons name="book" size={30} color={COLORS.primary} />
        <Text style={styles.title}>Dictionary</Text>
        <Text style={styles.subtitle}>LexiTech Solutions Ltd</Text>
      </View>

      {/* Primary navigation */}
      <DrawerItem
        label="Search"
        labelStyle={styles.itemLabel}
        icon={({ size, color }) => (
          <Ionicons name="search-outline" size={size} color={color} />
        )}
        onPress={() => {
          props.navigation.closeDrawer();
          router.push('/');
        }}
      />

      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>SEARCH HISTORY</Text>

      {history.length === 0 ? (
        <Text style={styles.empty}>No searches yet. Look up a word!</Text>
      ) : (
        history.map((word) => (
          <DrawerItem
            key={word}
            label={word}
            labelStyle={[styles.itemLabel, styles.historyLabel]}
            icon={({ size, color }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            )}
            onPress={() => onSelectWord(word)}
          />
        ))
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
    marginHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    paddingHorizontal: 18,
    marginBottom: 4,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  historyLabel: {
    textTransform: 'capitalize',
  },
  empty: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
});
