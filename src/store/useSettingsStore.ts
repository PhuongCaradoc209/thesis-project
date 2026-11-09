import { create } from 'zustand';
import {
  DEFAULT_GRAPHICS_PRESET,
  DEFAULT_HEAD_BOB,
  DEFAULT_NARRATION,
  DEFAULT_WALK_SPEED,
  GRAPHICS_PRESETS,
  QUALITY_LEVELS,
  SHADOW_QUALITIES,
  WALK_SPEEDS,
  type GraphicsPreset,
  type GraphicsSettings,
  type WalkSpeed,
} from '../constants/settings';

// v2: preset Vừa đổi sang tắt AO (23/10/2026); bỏ cài đặt cũ đã lưu AO bật theo preset Vừa trước đó
const STORAGE_KEY = 'app-settings:v2';

type StoredSettings = {
  graphics: GraphicsSettings;
  walkSpeed: WalkSpeed;
  headBob: boolean;
  narration: boolean;
};

type SettingsState = StoredSettings & {
  isSettingsOpen: boolean;
};

type SettingsActions = {
  applyPreset: (preset: GraphicsPreset) => void;
  setGraphics: (changes: Partial<GraphicsSettings>) => void;
  setWalkSpeed: (walkSpeed: WalkSpeed) => void;
  setHeadBob: (headBob: boolean) => void;
  setNarration: (narration: boolean) => void;
  resetDefaults: () => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const defaultSettings: StoredSettings = {
  graphics: GRAPHICS_PRESETS[DEFAULT_GRAPHICS_PRESET],
  walkSpeed: DEFAULT_WALK_SPEED,
  headBob: DEFAULT_HEAD_BOB,
  narration: DEFAULT_NARRATION,
};

function pickOption<T extends string>(value: unknown, options: T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

function readStoredSettings(): StoredSettings {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return defaultSettings;

    const stored = JSON.parse(value) as Partial<StoredSettings>;
    const graphics: Partial<GraphicsSettings> = stored.graphics ?? {};
    const fallback = defaultSettings.graphics;
    return {
      graphics: {
        resolution: pickOption(graphics.resolution, QUALITY_LEVELS, fallback.resolution),
        shadows: pickOption(graphics.shadows, SHADOW_QUALITIES, fallback.shadows),
        ambientOcclusion: typeof graphics.ambientOcclusion === 'boolean' ? graphics.ambientOcclusion : fallback.ambientOcclusion,
        grassDensity: pickOption(graphics.grassDensity, QUALITY_LEVELS, fallback.grassDensity),
      },
      walkSpeed: pickOption(stored.walkSpeed, WALK_SPEEDS, defaultSettings.walkSpeed),
      headBob: typeof stored.headBob === 'boolean' ? stored.headBob : defaultSettings.headBob,
      narration: typeof stored.narration === 'boolean' ? stored.narration : defaultSettings.narration,
    };
  } catch {
    return defaultSettings;
  }
}

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
  ...readStoredSettings(),
  isSettingsOpen: false,

  applyPreset: (preset) => set({ graphics: GRAPHICS_PRESETS[preset] }),
  setGraphics: (changes) => set((state) => ({ graphics: { ...state.graphics, ...changes } })),
  setWalkSpeed: (walkSpeed) => set({ walkSpeed }),
  setHeadBob: (headBob) => set({ headBob }),
  setNarration: (narration) => set({ narration }),
  resetDefaults: () => set(defaultSettings),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
}));

useSettingsStore.subscribe((state) => {
  const settings: StoredSettings = {
    graphics: state.graphics,
    walkSpeed: state.walkSpeed,
    headBob: state.headBob,
    narration: state.narration,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Settings still apply for the current visit when storage is unavailable.
  }
});
