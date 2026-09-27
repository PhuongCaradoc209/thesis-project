import { useGLTF } from '@react-three/drei';
import { useMemo, type RefObject } from 'react';
import * as THREE from 'three';

type PreviewModelProps = {
  modelUrl: string;
  modelRef: RefObject<THREE.Group | null>;
};

export function PreviewModel({ modelUrl, modelRef }: PreviewModelProps) {
  const gltf = useGLTF(modelUrl);

  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return clonedScene;
  }, [gltf.scene]);

  return <primitive ref={modelRef} object={scene} />;
}
