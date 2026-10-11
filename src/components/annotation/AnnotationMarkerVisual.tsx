import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MARKER_SIZE = 1;

type AnnotationMarkerVisualProps = {
  active?: boolean;
  depthTest?: boolean;
  intensity?: number;
  interactive?: boolean;
  visible: boolean;
  onPointerDown?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
};

export function AnnotationMarkerVisual({
  active = false,
  depthTest = true,
  intensity = 1,
  interactive = false,
  visible,
  onPointerDown,
  onPointerOut,
  onPointerOver,
}: AnnotationMarkerVisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const burstRef = useRef<THREE.Mesh>(null);
  const burstMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const outerMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const centerMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const revealProgressRef = useRef(0);
  const intensityRef = useRef(intensity);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    revealProgressRef.current = 0;
  }, [visible]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!visible) {
      group.scale.setScalar(0.35 * MARKER_SIZE);
      if (ringMaterialRef.current) ringMaterialRef.current.opacity = 0;
      if (burstMaterialRef.current) burstMaterialRef.current.opacity = 0;
      if (outerMaterialRef.current) outerMaterialRef.current.opacity = 0;
      if (centerMaterialRef.current) centerMaterialRef.current.opacity = 0;
      return;
    }

    intensityRef.current = THREE.MathUtils.damp(intensityRef.current, THREE.MathUtils.clamp(intensity, 0, 1), 8, delta);
    const currentIntensity = intensityRef.current;

    revealProgressRef.current = reduceMotion ? 1 : Math.min(1, revealProgressRef.current + delta / 0.5);
    const revealProgress = 1 - (1 - revealProgressRef.current) ** 3;
    const rawProgress = revealProgressRef.current;
    const revealScale =
      rawProgress < 0.55
        ? THREE.MathUtils.lerp(0.35, 1.3, 1 - (1 - rawProgress / 0.55) ** 3)
        : rawProgress < 0.8
          ? THREE.MathUtils.lerp(1.3, 0.92, (rawProgress - 0.55) / 0.25)
          : THREE.MathUtils.lerp(0.92, 1, 1 - (1 - (rawProgress - 0.8) / 0.2) ** 2);
    const interactionScale = active ? 1.18 : 1;

    if (rawProgress < 1 && !reduceMotion) {
      group.scale.setScalar(revealScale * interactionScale * MARKER_SIZE);
    } else {
      const nextScale = THREE.MathUtils.damp(group.scale.x, interactionScale * MARKER_SIZE, 12, delta);
      group.scale.setScalar(nextScale);
    }

    if (burstRef.current && burstMaterialRef.current) {
      burstRef.current.scale.setScalar(0.8 + rawProgress * 2.4);
      burstMaterialRef.current.opacity = reduceMotion ? 0 : (1 - rawProgress) ** 2 * 0.75 * currentIntensity;
    }

    if (ringMaterialRef.current) {
      const pulse = reduceMotion ? 0.5 : (Math.sin(state.clock.elapsedTime * 3) + 1) / 2;
      ringMaterialRef.current.opacity = (0.12 + pulse * 0.2) * revealProgress * currentIntensity;
    }

    const revealOpacity = Math.min(1, revealProgress * 1.6);
    if (outerMaterialRef.current) outerMaterialRef.current.opacity = 0.32 * revealOpacity * currentIntensity;
    if (centerMaterialRef.current) centerMaterialRef.current.opacity = revealOpacity * currentIntensity;
  });

  return (
    <group ref={groupRef} scale={0.35 * MARKER_SIZE}>
      <mesh ref={burstRef}>
        <ringGeometry args={[0.1, 0.14, 32]} />
        <meshBasicMaterial
          ref={burstMaterialRef}
          color='#ffe16d'
          transparent
          opacity={0}
          depthTest={depthTest}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.75}>
        <ringGeometry args={[0.09, 0.13, 32]} />
        <meshBasicMaterial
          ref={ringMaterialRef}
          color='#c79f00'
          transparent
          opacity={0}
          depthTest={depthTest}
          depthWrite={false}
        />
      </mesh>

      {interactive && (
        <mesh
          visible={visible}
          position={[0, 0, 0.01]}
          onPointerDown={onPointerDown}
          onPointerOut={onPointerOut}
          onPointerOver={onPointerOver}>
          <circleGeometry args={[0.22, 32]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      <mesh>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial
          ref={outerMaterialRef}
          color='#c79f00'
          transparent
          opacity={0}
          depthTest={depthTest}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[0.11, 32]} />
        <meshBasicMaterial
          ref={centerMaterialRef}
          color={'#ffffff'}
          transparent
          opacity={0}
          depthTest={depthTest}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
