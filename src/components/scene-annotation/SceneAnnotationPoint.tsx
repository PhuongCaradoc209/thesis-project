import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import { SCENE_ANNOTATION_INTERACTION_DISTANCE } from '../interactions/sceneInteraction.constants';
import { SceneInteractionMarker } from '../interactions/SceneInteractionMarker';
import { useSceneInteraction } from '../interactions/useSceneInteraction';

type SceneAnnotationPointProps = {
  interactionId: string;
  title: string;
  position: [number, number, number];
  onInteract: () => void;
  guidedTarget?: boolean;
  maxDistance?: number;
};

export function SceneAnnotationPoint({
  interactionId,
  title,
  position,
  onInteract,
  guidedTarget = false,
  maxDistance = SCENE_ANNOTATION_INTERACTION_DISTANCE,
}: SceneAnnotationPointProps) {
  const { t } = useTranslation();
  const pointRef = useRef<THREE.Group>(null);
  const interactionState = useSceneInteraction({
    id: interactionId,
    objectRef: pointRef,
    maxDistance,
    onInteract,
  });

  return (
    <group ref={pointRef} position={position}>
      <SceneInteractionMarker
        state={interactionState}
        label={t('interaction.inspect', { name: t(title) })}
        emphasized={guidedTarget && interactionState !== 'far'}
      />
    </group>
  );
}
