import { Clone, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import type { CollisionModel, SceneAsset } from '../../../../../types/scene.types';
import { TuDucModel } from './tomb-of-tu-duc';

type ModelProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  asset?: SceneAsset | null;
  collision?: CollisionModel | null;
};

export default function TuducTombs({ position, rotation, scale, asset, collision }: ModelProps) {
  const floorModel = useGLTF(
    collision?.url || 'https://res.cloudinary.com/djbtyhwl4/image/upload/v1777342022/collision_juyj5n.glb',
  );
  const treeModel = useGLTF('https://res.cloudinary.com/djbtyhwl4/image/upload/v1775703055/tree_s2wv31.glb');
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

  useMemo(() => {
    treeModel.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [treeModel.scene]);

  const positions: [number, number, number][] = [
    [-8, -3.5, -4],
    [0, -3.5, 9],
    [5, -3.5, -4],
    [5, -3.5, 7],
  ];
  return (
    <group>
      <Suspense fallback={null}>
        <TuDucModel modelUrl={asset?.url} position={position} rotation={rotation} scale={scale} />

        <RigidBody type='fixed' colliders='trimesh'>
          <primitive
            object={scene}
            position={(collision?.position as [number, number, number] | undefined) || [0, -3.8, 0]}
            scale={collision?.scale || 1}
          />
        </RigidBody>

        {/* <Instances
          range={positions.length}
          geometry={treeModel.scene.children[0].geometry}
          material={treeModel.scene.children[0].material}>
          {positions.map((pos, index) => (
            <Instance key={index} position={pos} scale={1} />
          ))}
        </Instances> */}
        {/* <Instances range={positions.length} geometry={treeModel.scene.children[1].geometry} material={treeModel.scene.children[1].material}>
          {positions.map((pos, index) => (
            <Instance key={index} position={pos} scale={1} />
          ))}
        </Instances> */}

        {positions.map((pos, index) => (
          <Clone key={index} object={treeModel.scene} position={pos} scale={1} />
        ))}
      </Suspense>
    </group>
  );
}
useGLTF.preload('https://res.cloudinary.com/djbtyhwl4/image/upload/v1777342022/collision_juyj5n.glb');
useGLTF.preload('https://res.cloudinary.com/djbtyhwl4/image/upload/v1775703055/tree_s2wv31.glb');
