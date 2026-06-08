// components/HistoryDrawerContent.js
// Custom drawer: branded gradient header, a "Search" link, a dark-mode toggle,
// and the deduplicated search-history list with per-item delete + a confirmed
// "Clear all" action. Theme-aware.
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import ConfirmModal from '../components/ConfirmModal';
import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';

export default function HistoryDrawerContent(props) {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const router = useRouter();
  const { history, search, removeFromHistory, clearHistory } = useHistory();
  const [confirmClear, setConfirmClear] = useState(false);
  const [deleteWord, setDeleteWord] = useState(null); // word pending deletion

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
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.logo}>
          <Ionicons name="book" size={24} color={colors.white} />
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
          <View style={styles.navIcon}>
            <Ionicons name="search-outline" size={18} color={colors.primary} />
          </View>
          <Text style={styles.navText}>Search</Text>
        </Pressable>

        {/* Dark mode toggle */}
        <View style={styles.navItem}>
          <View style={styles.navIcon}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={18}
              color={colors.primary}
            />
          </View>
          <Text style={styles.navText}>Dark mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.divider} />

        {/* History section header with Clear-all */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>HISTORY</Text>
            {history.length > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{history.length}</Text>
              </View>
            ) : null}
          </View>

          {history.length > 0 ? (
            <Pressable
              onPress={() => setConfirmClear(true)}
              hitSlop={8}
              style={({ pressed }) => [styles.clearAll, pressed && styles.clearAllPressed]}
              accessibilityRole="button"
              accessibilityLabel="Clear all history"
            >
              <Ionicons name="trash-outline" size={14} color={colors.error} />
              <Text style={styles.clearAllText}>Clear all</Text>
            </Pressable>
          ) : null}
        </View>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={30} color={colors.border} />
            <Text style={styles.emptyText}>No searches yet.{'\n'}Look up a word!</Text>
          </View>
        ) : (
          history.map((word) => (
            <Animated.View
              key={word}
              entering={FadeIn.duration(220)}
              exiting={FadeOutRight.duration(180)}
              layout={LinearTransition.springify()}
            >
              <Pressable
                style={({ pressed }) => [styles.historyItem, pressed && styles.pressed]}
                onPress={() => onSelectWord(word)}
              >
                <View style={styles.historyIcon}>
                  <Ionicons name="bookmark-outline" size={16} color={colors.accent} />
                </View>
                <Text style={styles.historyText} numberOfLines={1}>
                  {word}
                </Text>
                <Pressable
                  onPress={() => setDeleteWord(word)}
                  hitSlop={10}
                  style={styles.deleteBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${word} from history`}
                >
                  <Ionicons name="close" size={16} color={colors.textMuted} />
                </Pressable>
              </Pressable>
            </Animated.View>
          ))
        )}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Dictionary App · v1.0.0</Text>
      </View>

      {/* Confirm: clear ALL history */}
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

      {/* Confirm: remove a SINGLE word */}
      <ConfirmModal
        visible={!!deleteWord}
        icon="close-circle-outline"
        title="Remove this word?"
        message={
          deleteWord
            ? `"${deleteWord}" will be removed from your search history.`
            : ''
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => {
          removeFromHistory(deleteWord);
          setDeleteWord(null);
        }}
        onCancel={() => setDeleteWord(null)}
      />
    </View>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
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
    title: { fontSize: 22, fontWeight: '800', color: c.white },
    subtitle: { fontSize: 13, color: c.textOnGradientSoft, marginTop: 2 },
    scroll: { paddingTop: 12, paddingHorizontal: 10 },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 11,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    navIcon: {
      width: 32,
      height: 32,
      borderRadius: 9,
      backgroundColor: c.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    navText: { flex: 1, fontSize: 15, fontWeight: '700', color: c.text },
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: 10,
      marginHorizontal: 6,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      marginBottom: 8,
    },
    sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: c.textMuted,
      letterSpacing: 1,
    },
    badge: {
      minWidth: 22,
      height: 22,
      paddingHorizontal: 7,
      borderRadius: 11,
      backgroundColor: c.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: { fontSize: 12, fontWeight: '700', color: c.primary },
    clearAll: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 8,
    },
    clearAllPressed: { backgroundColor: c.errorBg },
    clearAllText: { fontSize: 12, fontWeight: '700', color: c.error },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    historyIcon: {
      width: 30,
      height: 30,
      borderRadius: 8,
      backgroundColor: c.accentTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    historyText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: c.text,
      textTransform: 'capitalize',
    },
    deleteBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceAlt,
    },
    pressed: { backgroundColor: c.surfaceAlt },
    empty: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 14 },
    emptyText: {
      textAlign: 'center',
      color: c.textMuted,
      fontStyle: 'italic',
      marginTop: 8,
      lineHeight: 20,
    },
    footer: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    footerText: { fontSize: 12, color: c.textMuted, textAlign: 'center' },
  });
