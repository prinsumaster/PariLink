// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Offline Slice (queue metadata in Redux)
// ─────────────────────────────────────────────────────────────────────────────
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OfflineState {
  isOnline:   boolean;
  queueCount: number;
  lastSyncAt: string | null;
  isSyncing:  boolean;
}

const initialState: OfflineState = {
  isOnline:   true,
  queueCount: 0,
  lastSyncAt: null,
  isSyncing:  false,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnline:    (state, action: PayloadAction<boolean>) => { state.isOnline = action.payload; },
    setQueueCount:(state, action: PayloadAction<number>)  => { state.queueCount = action.payload; },
    setSyncing:   (state, action: PayloadAction<boolean>) => { state.isSyncing = action.payload; },
    setSyncTime:  (state, action: PayloadAction<string>)  => { state.lastSyncAt = action.payload; },
  },
});

export const { setOnline, setQueueCount, setSyncing, setSyncTime } = offlineSlice.actions;
export default offlineSlice.reducer;
