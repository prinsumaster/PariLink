// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — App Root
// Wraps the app in Redux Provider + PersistGate + Navigation.
// Initialises background sync, network listener, and FCM token registration.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider }                  from 'react-redux';
import { PersistGate }               from 'redux-persist/integration/react';
import Toast                         from 'react-native-toast-message';
import NetInfo                       from '@react-native-community/netinfo';

import { store, persistor }   from './src/store';
import { AppNavigator }       from './src/navigation/AppNavigator';
import { setOnline }          from './src/store/slices/offlineSlice';
import { OfflineQueue }       from './src/offline/OfflineQueue';
import { setQueueCount }      from './src/store/slices/offlineSlice';
import { DarkTheme, LightTheme } from './src/theme';

// ─── Background Sync Hook ─────────────────────────────────────────────────────
function useBackgroundSync() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isOnline = state.isConnected ?? false;
      store.dispatch(setOnline(isOnline));

      if (isOnline) {
        // Flush queued offline actions on reconnect
        await OfflineQueue.flush();
        const count = await OfflineQueue.count();
        store.dispatch(setQueueCount(count));
      }
    });

    // Refresh queue count on mount
    OfflineQueue.count().then((count) => store.dispatch(setQueueCount(count)));

    return unsubscribe;
  }, []);
}

// ─── Root Component ───────────────────────────────────────────────────────────
function AppRoot() {
  const scheme = useColorScheme();
  const theme  = scheme === 'dark' ? DarkTheme : LightTheme;

  useBackgroundSync();

  return (
    <>
      <StatusBar
        barStyle={theme.statusBar}
        backgroundColor={theme.header}
        translucent={false}
      />
      <AppNavigator />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRoot />
      </PersistGate>
    </Provider>
  );
}
