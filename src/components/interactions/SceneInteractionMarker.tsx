import { Billboard, Html } from '@react-three/drei';
import { AnnotationMarkerVisual } from '../annotation/AnnotationMarkerVisual';
import { SCENE_INTERACTION_HTML_Z_INDEX_RANGE } from './sceneInteraction.constants';
import type { SceneInteractionState } from './sceneInteractionContext';

type SceneInteractionMarkerProps = {
  state: SceneInteractionState;
  visibleWhenFar?: boolean;
  emphasized?: boolean;
};

export function SceneInteractionMarker({ state, visibleWhenFar = false, emphasized = false }: SceneInteractionMarkerProps) {
  if (state === 'far' && !visibleWhenFar && !emphasized) return null;

  const isFocused = state === 'focused';
  const intensity = isFocused || emphasized ? 1 : state === 'near' ? 0.6 : 0.32;

  return (
    <Billboard>
      <AnnotationMarkerVisual visible active={isFocused || emphasized} depthTest={false} intensity={intensity} />
      {isFocused && (
        <Html position={[0, 0.36, 0]} center distanceFactor={8} zIndexRange={SCENE_INTERACTION_HTML_Z_INDEX_RANGE}>
          <div className='border-secondary-fixed-dim/70 bg-surface/95 text-on-surface font-manrope flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-bold shadow-lg backdrop-blur-sm'>
            F
          </div>
        </Html>
      )}
    </Billboard>
  );
}
