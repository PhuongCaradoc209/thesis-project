import { createContext, type RefObject } from 'react';
import type * as THREE from 'three';

export type SceneInteractionState = 'far' | 'near' | 'focused';

export type SceneInteractionRegistration = {
  id: string;
  objectRef: RefObject<THREE.Object3D | null>;
  maxDistance: number;
  onInteract: () => void;
};

export type SceneInteractionContextValue = {
  focusedId: string | null;
  nearbyIds: ReadonlySet<string>;
  registerInteraction: (registration: SceneInteractionRegistration) => () => void;
};

export const SceneInteractionContext = createContext<SceneInteractionContextValue | null>(null);
