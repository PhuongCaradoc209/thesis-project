import { Bounds, OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

type ModelPreviewCanvasProps = {
  modelUrl: string;
  cameraPosition?: [number, number, number];
};

function PreviewModel({ modelUrl }: Pick<ModelPreviewCanvasProps, 'modelUrl'>) {
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

  return <primitive object={scene} />;
}

export function ArtifactPreviewScene({ modelUrl, cameraPosition = [0, 1, 4.5] }: ModelPreviewCanvasProps) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const previousToneMapping = gl.toneMapping;
    const previousExposure = gl.toneMappingExposure;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.25;

    return () => {
      gl.toneMapping = previousToneMapping;
      gl.toneMappingExposure = previousExposure;
    };
  }, [gl]);

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPosition} fov={35} />
      <ambientLight intensity={1.8} />
      <hemisphereLight args={['#ffffff', '#64748b', 1.6]} />
      <directionalLight intensity={3.2} position={[4, 8, 6]} />
      <directionalLight intensity={1.8} position={[-6, 4, -4]} />

      <Bounds fit clip margin={1.2}>
        <group position={[0, -0.6, 0]}>
          <PreviewModel modelUrl={modelUrl} />
        </group>
      </Bounds>

      <OrbitControls makeDefault enablePan minDistance={1.5} maxDistance={14} target={[0, 0.6, 0]} />
    </>
  );
}
