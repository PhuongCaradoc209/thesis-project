import { useRef } from 'react';
import * as THREE from 'three';
import { SCENE_ANNOTATION_INTERACTION_DISTANCE } from '../interactions/sceneInteraction.constants';
import { SceneInteractionMarker } from '../interactions/SceneInteractionMarker';
import { useSceneInteraction } from '../interactions/useSceneInteraction';

type SceneAnnotationPointProps = {
  interactionId: string;
  position: [number, number, number];
  onInteract: () => void;
  guidedTarget?: boolean;
  maxDistance?: number;
};

export function SceneAnnotationPoint({
  interactionId,
  position,
  onInteract,
  guidedTarget = false,
  maxDistance = SCENE_ANNOTATION_INTERACTION_DISTANCE,
}: SceneAnnotationPointProps) {
  const pointRef = useRef<THREE.Group>(null);
  const interactionState = useSceneInteraction({
    id: interactionId,
    objectRef: pointRef,
    maxDistance,
    onInteract,
  });

  return (
    <group ref={pointRef} position={position}>
      <SceneInteractionMarker state={interactionState} emphasized={guidedTarget && interactionState !== 'far'} />
    </group>
  );
}
