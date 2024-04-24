import { create } from 'zustand';

type ProjectState = {
  name: string;

  changeName: (newName: string) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  name: '',

  changeName: (newName: string) => {
    set({ name: newName });
  },
}));
