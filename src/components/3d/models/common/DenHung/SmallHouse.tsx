import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';
import * as THREE from 'three';
import type { CollisionModel, SceneAsset } from '../../../../../types/scene.types';

type ModelProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  asset?: SceneAsset | null;
  collision?: CollisionModel | null;
};

function SmallHouse({ position, rotation, scale = 0.4, asset, collision: collisionConfig }: ModelProps) {
  const smallHouse = useGLTF(asset?.url || 'https://res.cloudinary.com/djbtyhwl4/image/upload/v1775354344/DenHung_kos2g3.glb');
  const collision = useGLTF(
    collisionConfig?.url || 'https://res.cloudinary.com/djbtyhwl4/image/upload/v1775354764/collisionDenHung_nv92of.glb',
  );
  useMemo(() => {
    smallHouse.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [smallHouse.scene]);

  const collisionScene = useMemo(() => {
    collision.scene.traverse((child) => {
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
    return collision.scene;
  }, [collision]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={smallHouse.scene} scale={scale} position={[0, -3.5, 0]} />
      <RigidBody type='fixed' colliders='trimesh'>
        <primitive object={collisionScene} scale={scale} position={[0, -3.5, 0]} />
      </RigidBody>
    </group>
  );
}

export default SmallHouse;

useGLTF.preload('https://res.cloudinary.com/djbtyhwl4/image/upload/v1775354344/DenHung_kos2g3.glb');
useGLTF.preload('https://res.cloudinary.com/djbtyhwl4/image/upload/v1775354764/collisionDenHung_nv92of.glb');
