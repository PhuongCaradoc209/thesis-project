import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { TuDucModel } from './tomb-of-tu-duc';

export default function TuducTombs() {
  const floorModel = useGLTF('/tuduc/collision.glb');
  const scene = useMemo(() => {
    floorModel.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            mat.transparent = true;
            mat.opacity = 0;
            mat.depthWrite = false;
          });
        } else {
          mesh.material.transparent = true;
          mesh.material.opacity = 0;
          mesh.material.depthWrite = false;
        }
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });
    return floorModel.scene;
  }, [floorModel]);

  return (
    <>
      <Suspense fallback={null}>
        <TuDucModel />

        <RigidBody type='fixed' colliders='trimesh'>
          <primitive object={scene} position={[0, -3.8, 0]} scale={1} />
        </RigidBody>
      </Suspense>
    </>
  );
}
useGLTF.preload('/tuduc/collision.glb');
