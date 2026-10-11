import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { SceneInteractionContext, type SceneInteractionRegistration } from './sceneInteractionContext';

const DISTANCE_TIE_THRESHOLD = 0.25;
const TARGET_SWITCH_MARGIN = 0.75;

type SceneInteractionProviderProps = {
  active: boolean;
  children: ReactNode;
};

function setsMatch(left: ReadonlySet<string>, right: ReadonlySet<string>) {
  if (left.size !== right.size) return false;
  for (const value of left) {
    if (!right.has(value)) return false;
  }
  return true;
}

export function SceneInteractionProvider({ active, children }: SceneInteractionProviderProps) {
  const camera = useThree((state) => state.camera);
  const registrationsRef = useRef(new Map<string, SceneInteractionRegistration>());
  const activeRef = useRef(active);
  const focusedIdRef = useRef<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [nearbyIds, setNearbyIds] = useState<ReadonlySet<string>>(() => new Set());
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const projectedPosition = useMemo(() => new THREE.Vector3(), []);

  activeRef.current = active;

  const registerInteraction = useCallback((registration: SceneInteractionRegistration) => {
    registrationsRef.current.set(registration.id, registration);

    return () => {
      const current = registrationsRef.current.get(registration.id);
      if (current === registration) registrationsRef.current.delete(registration.id);
    };
  }, []);

  const updateFocusedId = useCallback((nextId: string | null) => {
    if (focusedIdRef.current === nextId) return;
    focusedIdRef.current = nextId;
    setFocusedId(nextId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!activeRef.current || event.repeat || event.key.toLowerCase() !== 'f') return;

      const currentId = focusedIdRef.current;
      if (!currentId) return;
      registrationsRef.current.get(currentId)?.onInteract();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useFrame(() => {
    if (!active) {
      updateFocusedId(null);
      setNearbyIds((current) => (current.size ? new Set() : current));
      return;
    }

    const nextNearbyIds = new Set<string>();
    const visibleCandidates: { id: string; distance: number; screenDistance: number }[] = [];

    for (const registration of registrationsRef.current.values()) {
      const object = registration.objectRef.current;
      if (!object) continue;

      object.getWorldPosition(targetPosition);
      const distance = targetPosition.distanceTo(camera.position);
      if (distance > registration.maxDistance || distance === 0) continue;

      nextNearbyIds.add(registration.id);
      projectedPosition.copy(targetPosition).project(camera);
      const isOnScreen =
        projectedPosition.z >= -1 &&
        projectedPosition.z <= 1 &&
        Math.abs(projectedPosition.x) <= 1 &&
        Math.abs(projectedPosition.y) <= 1;
      if (!isOnScreen) continue;

      visibleCandidates.push({
        id: registration.id,
        distance,
        screenDistance: Math.hypot(projectedPosition.x, projectedPosition.y),
      });
    }

    visibleCandidates.sort((left, right) => {
      const distanceDifference = left.distance - right.distance;
      if (Math.abs(distanceDifference) > DISTANCE_TIE_THRESHOLD) return distanceDifference;

      const screenDifference = left.screenDistance - right.screenDistance;
      if (screenDifference !== 0) return screenDifference;
      if (distanceDifference !== 0) return distanceDifference;
      return left.id.localeCompare(right.id);
    });

    let nextFocusedId = visibleCandidates[0]?.id ?? null;
    const currentCandidate = visibleCandidates.find((candidate) => candidate.id === focusedIdRef.current);
    const bestCandidate = visibleCandidates[0];

    if (
      currentCandidate &&
      bestCandidate &&
      currentCandidate.id !== bestCandidate.id &&
      currentCandidate.distance <= bestCandidate.distance + TARGET_SWITCH_MARGIN
    ) {
      nextFocusedId = currentCandidate.id;
    }

    updateFocusedId(nextFocusedId);
    setNearbyIds((current) => (setsMatch(current, nextNearbyIds) ? current : nextNearbyIds));
  });

  const contextValue = useMemo(
    () => ({ focusedId, nearbyIds, registerInteraction }),
    [focusedId, nearbyIds, registerInteraction],
  );

  return <SceneInteractionContext.Provider value={contextValue}>{children}</SceneInteractionContext.Provider>;
}
