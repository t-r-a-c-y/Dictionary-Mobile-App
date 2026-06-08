// app/_layout.js
// Root layout = navigation + global providers.
// Provider order matters:
//   GestureHandlerRootView  -> required by the drawer (gestures)
//     SafeAreaProvider      -> safe-area insets for notches/edges
//       HistoryProvider     -> shared search state (also used by the drawer)
//         Drawer            -> file-based drawer navigation
import { setAudioModeAsync } from 'expo-audio';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HistoryDrawerContent from '../components/HistoryDrawerContent';
import { COLORS } from '../constants/colors';
import { HistoryProvider } from '../context/HistoryContext';

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
        <HistoryProvider>
          <StatusBar style="light" />
          <Drawer
            drawerContent={(props) => <HistoryDrawerContent {...props} />}
            screenOptions={{
              headerStyle: { backgroundColor: COLORS.gradientMid },
              headerTintColor: COLORS.white,
              headerTitleStyle: { fontWeight: '800', fontSize: 18 },
              headerShadowVisible: false,
              drawerActiveTintColor: COLORS.primary,
              drawerInactiveTintColor: COLORS.text,
              drawerActiveBackgroundColor: 'rgba(99,102,241,0.10)',
              drawerItemStyle: { borderRadius: 12 },
              sceneStyle: { backgroundColor: COLORS.background },
            }}
          >
            <Drawer.Screen name="index" options={{ title: 'Dictionary' }} />
            <Drawer.Screen name="details" options={{ title: 'Word Details' }} />
          </Drawer>
        </HistoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
