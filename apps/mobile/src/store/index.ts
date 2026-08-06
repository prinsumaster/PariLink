// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Redux Store
// RTK store with persist middleware, typed hooks, and slice composition.
// ─────────────────────────────────────────────────────────────────────────────

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer     from './slices/authSlice';
import tripsReducer    from './slices/tripsSlice';
import uiReducer       from './slices/uiSlice';
import offlineReducer  from './slices/offlineSlice';
import notifReducer    from './slices/notificationsSlice';

// ─── Persist Config ───────────────────────────────────────────────────────────
const persistConfig = {
  key:       'root',
  storage:   AsyncStorage,
  whitelist: ['auth', 'ui', 'offline'],  // trips are always fetched fresh
  blacklist: ['notifications'],           // notifications are ephemeral
};

const rootReducer = combineReducers({
  auth:          authReducer,
  trips:         tripsReducer,
  ui:            uiReducer,
  offline:       offlineReducer,
  notifications: notifReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ─── Store ────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// ─── Typed Hooks ──────────────────────────────────────────────────────────────
export type RootState   = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
