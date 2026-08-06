// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Notifications Slice
// ─────────────────────────────────────────────────────────────────────────────
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NotificationsAPI } from '../../services/api/client';
import { PushNotification } from '../../types';

interface NotificationsState {
  items:      PushNotification[];
  unreadCount: number;
  isLoading:  boolean;
}

const initialState: NotificationsState = {
  items:      [],
  unreadCount: 0,
  isLoading:  false,
};

export const fetchNotificationsThunk = createAsyncThunk(
  'notifications/fetch',
  async () => {
    const { data } = await NotificationsAPI.list();
    return data as { items: PushNotification[]; unreadCount: number };
  },
);

export const markReadThunk = createAsyncThunk(
  'notifications/markRead',
  async (id: string) => {
    await NotificationsAPI.markRead(id);
    return id;
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<PushNotification>) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => { state.isLoading = true; })
      .addCase(fetchNotificationsThunk.fulfilled, (state, { payload }) => {
        state.isLoading   = false;
        state.items        = payload.items;
        state.unreadCount  = payload.unreadCount;
      })
      .addCase(fetchNotificationsThunk.rejected, (state) => { state.isLoading = false; });

    builder.addCase(markReadThunk.fulfilled, (state, { payload }) => {
      const item = state.items.find((n) => n.id === payload);
      if (item && !item.readAt) {
        item.readAt       = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });
  },
});

export const { pushNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
