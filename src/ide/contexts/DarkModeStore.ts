import { create } from 'zustand';
import { STORAGE_DARK_MODE } from '../commons/consts';
import Storage from '../commons/Storage';

type Mods = 'dark' | 'light';
type DarkMode = {
  mode: Mods;

  loadFromCache: () => void;
  toggle: () => void;
  change: (newMode: Mods) => void;
};

export const useDarkModeStore = create<DarkMode>((set, get) => ({
  mode: 'dark',

  loadFromCache: () => {
    const last = Storage.get(STORAGE_DARK_MODE, 'last');

    get().change(last || 'dark');
  },

  toggle: () => {
    const newMode = get().mode === 'dark' ? 'light' : 'dark';
    get().change(newMode);
  },

  change: (newMode: Mods) => {
    const htmlTag = document.querySelector('html');
    htmlTag!.setAttribute('data-bs-theme', newMode);

    set({ mode: newMode });

    Storage.set(STORAGE_DARK_MODE, 'last', newMode);
  },
}));
