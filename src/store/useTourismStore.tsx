import { create } from 'zustand';

type TourismState = {
  pause: boolean;
  selectedArtifactId: string | null;
};

type TourismActions = {
  setPause: (pause: boolean) => void;
  openInspect: (artifactId: string) => void;
  closeInspect: () => void;
  clear: () => void;
};

const initialState: TourismState = {
  pause: false,
  selectedArtifactId: null,
};

export const useTourismStore = create<TourismState & TourismActions>((set) => ({
  ...initialState,
  setPause: (pause) => set({ pause }),
  openInspect: (artifactId) =>
    set({
      pause: true,
      selectedArtifactId: artifactId,
    }),
  closeInspect: () =>
    set({
      pause: false,
      selectedArtifactId: null,
    }),
  clear: () => set(initialState),
}));
