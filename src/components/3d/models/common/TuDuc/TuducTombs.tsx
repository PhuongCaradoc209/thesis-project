import { Clone, Detailed, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import type { CollisionModel, SceneAsset } from '../../../../../types/scene.types';
import { TuDucModel } from './tomb-of-tu-duc';

const TREE_URL = 'https://res.cloudinary.com/djbtyhwl4/image/upload/v1792638768/tree-7mb_pxoprs.glb';
const TREE_LITE_URL = 'https://res.cloudinary.com/djbtyhwl4/image/upload/v1792641562/tree-lite_yj0ue0.glb';
const TREE_LOD_DISTANCES = [0, 6];
const TREE_SCALE = 2.0;

function treeRotationY(index: number) {
  const hash = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return (hash - Math.floor(hash)) * Math.PI * 2;
}

function setupTreeMaterials(tree: THREE.Object3D) {
  tree.traverse((child: any) => {
    if (child.isMesh) {
      const isLeaves = child.material?.name?.includes('leaves');
      child.castShadow = !isLeaves;
      child.receiveShadow = true;
      if (isLeaves) {
        child.material.transparent = false;
        child.material.alphaTest = 0.5;
      }
    }
  });
}

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
  const treeModel = useGLTF(TREE_URL);
  const treeLiteModel = useGLTF(TREE_LITE_URL);
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

  useMemo(() => setupTreeMaterials(treeModel.scene), [treeModel.scene]);
  useMemo(() => setupTreeMaterials(treeLiteModel.scene), [treeLiteModel.scene]);

  const positions: [number, number, number][] = [
    [-8, -3.5, -4],
    [-6, -3.5, 6],
    [2, -3.5, -8],
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
          <Detailed
            key={index}
            distances={TREE_LOD_DISTANCES}
            position={pos}
            rotation={[0, treeRotationY(index), 0]}
            scale={TREE_SCALE}>
            <Clone object={treeModel.scene} />
            <Clone object={treeLiteModel.scene} />
          </Detailed>
        ))}
      </Suspense>
    </group>
  );
}
useGLTF.preload('https://res.cloudinary.com/djbtyhwl4/image/upload/v1777342022/collision_juyj5n.glb');
useGLTF.preload(TREE_URL);
useGLTF.preload(TREE_LITE_URL);
