import { create } from 'zustand';

type DarkMode = {
  mode: 'dark' | 'light';

  toggle: () => void;
};

export const useDarkModeStore = create<DarkMode>((set, get) => ({
  mode: 'dark',

  toggle: () => {
    set({ mode: get().mode === 'dark' ? 'light' : 'dark' });
  },
}));
