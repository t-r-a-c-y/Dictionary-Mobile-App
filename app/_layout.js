// app/_layout.js
// Root layout = navigation + global providers.
// Provider order:
//   GestureHandlerRootView -> SafeAreaProvider -> ThemeProvider
//     -> HistoryProvider -> Drawer
// A separate <RootNavigator/> consumes the theme so the Drawer + headers can be
// styled with the active palette (incl. dark mode).
import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync } from 'expo-audio';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HistoryDrawerContent from '../components/HistoryDrawerContent';
import { HistoryProvider } from '../context/HistoryContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

// Quick light/dark toggle shown in the header.
function ThemeToggle() {
  const { colors, isDark, toggleTheme } = useTheme();
  return (
    <Pressable
      onPress={toggleTheme}
      hitSlop={10}
      style={({ pressed }) => [styles.toggle, pressed && { opacity: 0.6 }]}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={22}
        color={colors.white}
      />
    </Pressable>
  );
}

function RootNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style="light" />
      <Drawer
        drawerContent={(props) => <HistoryDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: colors.gradientMid },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
          headerShadowVisible: false,
          headerRight: () => <ThemeToggle />,
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.text,
          drawerActiveBackgroundColor: colors.primaryTint,
          drawerItemStyle: { borderRadius: 12 },
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Drawer.Screen name="index" options={{ title: 'Dictionary' }} />
        <Drawer.Screen name="details" options={{ title: 'Word Details' }} />
      </Drawer>
    </>
  );
}

export default function RootLayout() {
  // Allow pronunciation audio to play even when the iOS ringer is on silent.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {
      /* non-fatal: audio still works in normal mode */
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <HistoryProvider>
            <RootNavigator />
          </HistoryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  toggle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
});
