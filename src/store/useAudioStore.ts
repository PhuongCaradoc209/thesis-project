import { create } from 'zustand';

type AudioState = {
  isNarrating: boolean;
  setNarrating: (isNarrating: boolean) => void;
};

export const useAudioStore = create<AudioState>((set) => ({
  isNarrating: false,
  setNarrating: (isNarrating) => set({ isNarrating }),
}));
