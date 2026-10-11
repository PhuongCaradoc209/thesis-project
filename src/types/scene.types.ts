export interface FloorMaterialConfig {
  color: string;
  normal: string;
  roughness: string;
  ao?: string;
}

export interface FloorConfig {
  mode?: 'single' | 'splat' | 'splat-terrain';
  args: number[];
  position: number[];
  rotation?: number[];
  repeat?: number[];
  segments?: number[];
  texture?: string[];
  materials?: {
    grass: FloorMaterialConfig;
    brick: FloorMaterialConfig;
    dirt: FloorMaterialConfig;
  };
  splatMap?: string;
  heightMap?: string;
  heightScale?: number;
  heightOffset?: number;
  collision?: {
    enabled?: boolean;
    type?: 'heightfield';
  };
}

// 1. SCENES
export interface Scene {
  sceneId: string;
  environmentConfig: { sunPosition: number[]; fogColor: string; fogNear: number; fogFar: number };
  playerConfig: { position: number[]; killY?: number };
  floorConfig: FloorConfig;
}

// 2. SCENE ASSETS (Low-poly models)
export interface SceneAsset {
  assetId: string;
  url: string; // Firebase Storage URL
  collisionId?: string | null;
  rendererKey?: string | null;
}

// 3. COLLISION MODELS (Physics bounding boxes)
export interface CollisionModel {
  collisionId: string;
  url: string;
  position: number[];
  rotation?: number[];
  scale?: number | number[];
}

// 4. SCENE PLACEMENTS (Instancing assets into scenes)
export interface ScenePlacement {
  placementId: string;
  sceneId: string;
  assetId: string;
  position: number[];
  rotation?: number[];
  scale?: number | number[];
}

export interface ResolvedScenePlacement {
  placement: ScenePlacement;
  asset: SceneAsset | null;
  collision: CollisionModel | null;
}

export interface ArtifactAnnotation {
  annotationId: string;
  position: number[];
  title: string;
  description?: string;
  images?: string[];
}

// 5. ARTIFACTS (High-poly models & i18n Data for Review Mode)
export interface Artifact {
  artifactId: string;
  title: string;
  type?: string;
  subtitle: string;
  modelUrl: string;
  cameraPosition: number[];
  modelPosition?: number[];
  orbitTarget?: number[];
  annotation?: ArtifactAnnotation[];
  dynasty?: string;
  material?: string;
  year?: number | string;
  history: string;
}

// 6. INTERACTION POINTS (Hotspots attached to placements)
interface BaseInteractionPoint {
  pointId: string;
  placementId: string;
  positionOffset: number[];
}

export interface ArtifactInteractionPoint extends BaseInteractionPoint {
  type?: 'artifact';
  artifactId: string;
}

export interface SceneAnnotationInteractionPoint extends BaseInteractionPoint {
  type: 'scene_annotation';
  title: string;
  description: string;
  images?: string[];
}

export type InteractionPoint = ArtifactInteractionPoint | SceneAnnotationInteractionPoint;

// 7. TELEPORT POINTS (Fast travel locations)
export interface TeleportPoint {
  teleportId: string;
  sceneId: string;
  associatedPlacementId?: string | null;
  position: number[];
  lookAt: number[];
  label: string;
}
