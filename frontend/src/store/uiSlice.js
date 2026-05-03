import { createSlice } from '@reduxjs/toolkit';

const getStoredTheme = () => {
  try { return localStorage.getItem('theme') || 'dark'; } catch { return 'dark'; }
};

const initialState = {
  theme: getStoredTheme(),
  toasts: [],
  recentlyViewed: [],
};

let toastId = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    addToast: (state, action) => {
      state.toasts.push({ id: ++toastId, ...action.payload });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    addRecentlyViewed: (state, action) => {
      state.recentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter(p => p.id !== action.payload.id)
      ].slice(0, 10);
    },
  },
});

export const { toggleTheme, setTheme, addToast, removeToast, addRecentlyViewed } = uiSlice.actions;
export default uiSlice.reducer;
