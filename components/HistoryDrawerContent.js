// components/HistoryDrawerContent.js
// Custom contents for the navigation drawer: a branded gradient header, a
// "Search" link, and the deduplicated search-history list. Tapping a history
// word re-fetches it and navigates to the Details screen.
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

  const goSearch = () => {
    props.navigation.closeDrawer();
    router.push('/');
  };

  return (
    <View style={styles.root}>
      {/* Branded gradient header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.logo}>
          <Ionicons name="book" size={24} color={COLORS.white} />
        </View>
        <Text style={styles.title}>Dictionary</Text>
        <Text style={styles.subtitle}>LexiTech Solutions Ltd</Text>
      </LinearGradient>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        {/* Primary navigation */}
        <Pressable
          style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
          onPress={goSearch}
        >
          <Ionicons name="search-outline" size={20} color={COLORS.primary} />
          <Text style={styles.navText}>Search</Text>
        </Pressable>

        <View style={styles.divider} />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>SEARCH HISTORY</Text>
          {history.length > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{history.length}</Text>
            </View>
          ) : null}
        </View>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={28} color={COLORS.border} />
            <Text style={styles.emptyText}>No searches yet.{'\n'}Look up a word!</Text>
          </View>
        ) : (
          history.map((word) => (
            <Pressable
              key={word}
              style={({ pressed }) => [styles.historyItem, pressed && styles.pressed]}
              onPress={() => onSelectWord(word)}
            >
              <View style={styles.historyIcon}>
                <Ionicons name="bookmark-outline" size={16} color={COLORS.accent} />
              </View>
              <Text style={styles.historyText} numberOfLines={1}>
                {word}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </Pressable>
          ))
        )}
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 22,
    paddingHorizontal: 20,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textOnGradientSoft,
    marginTop: 2,
  },
  scroll: {
    paddingTop: 12,
    paddingHorizontal: 10,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  navText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
    marginHorizontal: 6,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 11,
    backgroundColor: COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  historyIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  pressed: {
    backgroundColor: COLORS.surfaceAlt,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 20,
  },
});
