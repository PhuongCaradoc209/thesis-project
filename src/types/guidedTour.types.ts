export type GuidedTourStepType =
  | 'teleport'
  | 'reach_scene_point'
  | 'inspect_scene_point'
  | 'inspect_artifact'
  | 'view_artifact_annotation';

export interface GuidedTourIntro {
  type: 'orbit';
  orbitCenter: number[];
  lookAt: number[];
  radius: number;
  height: number;
  startAngle: number;
  endAngle: number;
  duration: number;
  title: string;
  caption?: string;
  audioUrl?: string | null;
  skippable?: boolean;
}

export interface GuidedTourDiscovery {
  discoveryId: string;
  title: string;
  summary: string;
  images?: string[];
}

export interface GuidedTourStep {
  stepId: string;
  order: number;
  type: GuidedTourStepType;
  targetId: string;
  instruction: string;
  hint: string;
  artifactId?: string;
  radius?: number;
  audioUrl?: string;
  discovery?: GuidedTourDiscovery;
}

export interface GuidedTour {
  tourId: string;
  sceneId: string;
  title: string;
  description: string;
  intro?: GuidedTourIntro;
  completionAudioUrl?: string;
  steps: GuidedTourStep[];
}

export type GuidedTourStatus = 'idle' | 'cinematic' | 'active' | 'paused' | 'completed';

export type GuidedTourEvent =
  | { type: 'teleport_selected'; targetId: string }
  | { type: 'scene_area_reached'; targetId: string }
  | { type: 'scene_point_opened'; targetId: string }
  | { type: 'artifact_opened'; targetId: string }
  | { type: 'artifact_annotation_opened'; targetId: string; artifactId: string };
