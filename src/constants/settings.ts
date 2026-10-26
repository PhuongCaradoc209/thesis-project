export type QualityLevel = 'low' | 'medium' | 'high';
export type ShadowQuality = 'off' | 'medium' | 'high';
export type GraphicsPreset = QualityLevel;
export type WalkSpeed = 'slow' | 'normal' | 'fast';

export type GraphicsSettings = {
  resolution: QualityLevel;
  shadows: ShadowQuality;
  ambientOcclusion: boolean;
  grassDensity: QualityLevel;
};

export const QUALITY_LEVELS: QualityLevel[] = ['low', 'medium', 'high'];
export const SHADOW_QUALITIES: ShadowQuality[] = ['off', 'medium', 'high'];
export const WALK_SPEEDS: WalkSpeed[] = ['slow', 'normal', 'fast'];

export const GRAPHICS_PRESETS: Record<GraphicsPreset, GraphicsSettings> = {
  low: { resolution: 'low', shadows: 'off', ambientOcclusion: false, grassDensity: 'low' },
  medium: { resolution: 'medium', shadows: 'medium', ambientOcclusion: false, grassDensity: 'medium' },
  high: { resolution: 'high', shadows: 'high', ambientOcclusion: true, grassDensity: 'high' },
};

export const DEFAULT_GRAPHICS_PRESET: GraphicsPreset = 'medium';
export const DEFAULT_WALK_SPEED: WalkSpeed = 'normal';
export const DEFAULT_HEAD_BOB = true;

export const RESOLUTION_DPR: Record<QualityLevel, number> = { low: 0.75, medium: 1, high: 1.5 };
export const SHADOW_MAP_SIZE: Record<Exclude<ShadowQuality, 'off'>, number> = { medium: 1024, high: 2048 };
export const GRASS_INSTANCE_COUNT: Record<QualityLevel, number> = { low: 4000, medium: 8000, high: 16000 };
export const WALK_SPEED_MPS: Record<WalkSpeed, number> = { slow: 1.5, normal: 2, fast: 3 };

export function matchGraphicsPreset(graphics: GraphicsSettings): GraphicsPreset | 'custom' {
  const match = QUALITY_LEVELS.find((preset) => {
    const presetSettings = GRAPHICS_PRESETS[preset];
    return (Object.keys(presetSettings) as (keyof GraphicsSettings)[]).every((key) => presetSettings[key] === graphics[key]);
  });
  return match ?? 'custom';
}
