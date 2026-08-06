// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — UI Slice (Theme, Loading Overlay, Toasts, Modal State)
// ─────────────────────────────────────────────────────────────────────────────
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme:            'light' | 'dark' | 'system';
  language:         string;
  isGlobalLoading:  boolean;
  pendingQueueCount: number;
  toastMessage:     { type: 'success' | 'error' | 'info'; text: string } | null;
}

const initialState: UiState = {
  theme:              'system',
  language:           'en',
  isGlobalLoading:    false,
  pendingQueueCount:  0,
  toastMessage:       null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme:             (state, action: PayloadAction<UiState['theme']>) => { state.theme = action.payload; },
    setLanguage:          (state, action: PayloadAction<string>)  => { state.language = action.payload; },
    setGlobalLoading:     (state, action: PayloadAction<boolean>) => { state.isGlobalLoading = action.payload; },
    setPendingQueueCount: (state, action: PayloadAction<number>)  => { state.pendingQueueCount = action.payload; },
    showToast:            (state, action: PayloadAction<UiState['toastMessage']>) => { state.toastMessage = action.payload; },
    clearToast:           (state) => { state.toastMessage = null; },
  },
});

export const { setTheme, setLanguage, setGlobalLoading, setPendingQueueCount, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
