import { Billboard, Html } from '@react-three/drei';
import { AnnotationMarkerVisual } from '../annotation/AnnotationMarkerVisual';
import { InteractionPrompt } from './InteractionPrompt';
import { SCENE_INTERACTION_HTML_Z_INDEX_RANGE } from './sceneInteraction.constants';
import type { SceneInteractionState } from './sceneInteractionContext';

type SceneInteractionMarkerProps = {
  state: SceneInteractionState;
  label: string;
  visibleWhenFar?: boolean;
  emphasized?: boolean;
};

export function SceneInteractionMarker({
  state,
  label,
  visibleWhenFar = false,
  emphasized = false,
}: SceneInteractionMarkerProps) {
  if (state === 'far' && !visibleWhenFar && !emphasized) return null;

  const isFocused = state === 'focused';
  const intensity = isFocused || emphasized ? 1 : state === 'near' ? 0.6 : 0.32;

  return (
    <Billboard>
      <AnnotationMarkerVisual visible active={isFocused || emphasized} depthTest={false} intensity={intensity} />
      {isFocused && (
        <Html position={[0, 0.36, 0]} center distanceFactor={8} zIndexRange={SCENE_INTERACTION_HTML_Z_INDEX_RANGE}>
          <InteractionPrompt label={label} />
        </Html>
      )}
    </Billboard>
  );
}
