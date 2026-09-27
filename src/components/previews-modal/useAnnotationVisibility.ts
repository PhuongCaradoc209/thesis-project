import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';

const OCCLUSION_CHECK_INTERVAL = 0.08;
const SURFACE_TOLERANCE = 0.08;

export function useAnnotationVisibility(markerRef: RefObject<THREE.Group | null>, modelRef: RefObject<THREE.Group | null>) {
  const camera = useThree((state) => state.camera);
  const raycasterRef = useRef(new THREE.Raycaster());
  const cameraPositionRef = useRef(new THREE.Vector3());
  const markerPositionRef = useRef(new THREE.Vector3());
  const directionRef = useRef(new THREE.Vector3());
  const elapsedRef = useRef(OCCLUSION_CHECK_INTERVAL);
  const visibilityRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (elapsedRef.current < OCCLUSION_CHECK_INTERVAL) return;
    elapsedRef.current = 0;

    const marker = markerRef.current;
    const model = modelRef.current;
    if (!marker || !model) return;

    camera.getWorldPosition(cameraPositionRef.current);
    marker.getWorldPosition(markerPositionRef.current);
    directionRef.current.subVectors(markerPositionRef.current, cameraPositionRef.current);

    const markerDistance = directionRef.current.length();
    if (markerDistance <= SURFACE_TOLERANCE) return;

    const raycaster = raycasterRef.current;
    raycaster.set(cameraPositionRef.current, directionRef.current.normalize());
    raycaster.near = 0;
    raycaster.far = markerDistance - SURFACE_TOLERANCE;

    const nextVisible = raycaster.intersectObject(model, true).length === 0;
    if (nextVisible === visibilityRef.current) return;

    visibilityRef.current = nextVisible;
    setIsVisible(nextVisible);
  });

  return isVisible;
}
