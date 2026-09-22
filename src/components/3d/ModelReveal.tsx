import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import * as THREE from 'three';

type ModelRevealProps = {
  children: ReactNode;
  duration?: number;
};

type MaterialSnapshot = {
  material: THREE.Material;
  opacity: number;
  transparent: boolean;
  depthWrite: boolean;
};

type MeshAssignment = {
  mesh: THREE.Mesh;
  original: THREE.Material | THREE.Material[];
  cloned: THREE.Material[];
  snapshots: MaterialSnapshot[];
};

/** Reveals newly loaded meshes without mutating materials cached by useGLTF. */
export default function ModelReveal({ children, duration = 0.35 }: ModelRevealProps) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);
  const assignmentsRef = useRef<MeshAssignment[]>([]);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return undefined;

    elapsedRef.current = 0;
    const assignments: MeshAssignment[] = [];

    group.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;

      const mesh = child as THREE.Mesh;
      const original = mesh.material;
      const originalMaterials = Array.isArray(original) ? original : [original];
      const cloned = originalMaterials.map((material) => material.clone());
      const snapshots = cloned.map((material) => ({
        material,
        opacity: material.opacity,
        transparent: material.transparent,
        depthWrite: material.depthWrite,
      }));

      snapshots.forEach(({ material }) => {
        material.opacity = 0;
        material.transparent = true;
        material.depthWrite = false;
        material.needsUpdate = true;
      });

      mesh.material = Array.isArray(original) ? cloned : cloned[0];
      assignments.push({ mesh, original, cloned, snapshots });
    });

    assignmentsRef.current = assignments;

    return () => {
      assignments.forEach(({ mesh, original, cloned }) => {
        mesh.material = original;
        cloned.forEach((material) => material.dispose());
      });
      assignmentsRef.current = [];
    };
  }, []);

  useFrame((_, delta) => {
    if (!assignmentsRef.current.length || elapsedRef.current >= duration) return;

    elapsedRef.current = Math.min(duration, elapsedRef.current + delta);
    const linearProgress = duration > 0 ? elapsedRef.current / duration : 1;
    const progress = 1 - (1 - linearProgress) ** 3;

    assignmentsRef.current.forEach(({ snapshots }) => {
      snapshots.forEach(({ material, opacity, transparent, depthWrite }) => {
        material.opacity = opacity * progress;

        if (linearProgress >= 1) {
          material.transparent = transparent;
          material.depthWrite = depthWrite;
          material.needsUpdate = true;
        }
      });
    });
  });

  return <group ref={groupRef}>{children}</group>;
}
