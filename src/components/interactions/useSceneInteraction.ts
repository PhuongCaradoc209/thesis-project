import { useContext, useEffect, useRef } from 'react';
import { SceneInteractionContext, type SceneInteractionRegistration } from './sceneInteractionContext';

export function useSceneInteraction({ id, objectRef, maxDistance, onInteract }: SceneInteractionRegistration) {
  const context = useContext(SceneInteractionContext);
  const onInteractRef = useRef(onInteract);
  onInteractRef.current = onInteract;

  if (!context) {
    throw new Error('useSceneInteraction must be used inside SceneInteractionProvider.');
  }

  const { focusedId, nearbyIds, registerInteraction } = context;

  useEffect(
    () =>
      registerInteraction({
        id,
        objectRef,
        maxDistance,
        onInteract: () => onInteractRef.current(),
      }),
    [id, maxDistance, objectRef, registerInteraction],
  );

  if (focusedId === id) return 'focused';
  if (nearbyIds.has(id)) return 'near';
  return 'far';
}
