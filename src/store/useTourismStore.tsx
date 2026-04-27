import { create } from 'zustand';

type TeleportTarget = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

type TourismState = {
  pause: boolean;
  selectedArtifactId: string | null;
  isTeleporting: boolean;
  teleportTarget: TeleportTarget | null;
};

type TourismActions = {
  setPause: (pause: boolean) => void;
  openInspect: (artifactId: string) => void;
  closeInspect: () => void;
  clear: () => void;
  triggerTeleport: (target: TeleportTarget) => void;
  clearTeleport: () => void;
};

const initialState: TourismState = {
  pause: false,
  selectedArtifactId: null,
  isTeleporting: false,
  teleportTarget: null,
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
  triggerTeleport: (target) => set({ isTeleporting: true, teleportTarget: target }),
  clearTeleport: () => set({ isTeleporting: false, teleportTarget: null }),
}));
