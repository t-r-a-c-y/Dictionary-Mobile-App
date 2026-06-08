// app/_layout.js
// Root layout = navigation + global providers.
// Provider order matters:
//   GestureHandlerRootView  -> required by the drawer (gestures)
//     SafeAreaProvider      -> safe-area insets for notches/edges
//       HistoryProvider     -> shared search state (also used by the drawer)
//         Drawer            -> file-based drawer navigation
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HistoryDrawerContent from '../components/HistoryDrawerContent';
import { COLORS } from '../constants/colors';
import { HistoryProvider } from '../context/HistoryContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HistoryProvider>
          <StatusBar style="light" />
          <Drawer
            drawerContent={(props) => <HistoryDrawerContent {...props} />}
            screenOptions={{
              headerStyle: { backgroundColor: COLORS.primary },
              headerTintColor: COLORS.white,
              headerTitleStyle: { fontWeight: '700' },
              drawerActiveTintColor: COLORS.primary,
              drawerInactiveTintColor: COLORS.text,
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
