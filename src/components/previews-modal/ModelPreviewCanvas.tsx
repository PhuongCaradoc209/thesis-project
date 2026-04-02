import { Bounds, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
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

function PreviewFallback() {
  return <div className='flex h-full items-center justify-center text-sm text-slate-500'>Dang tai model...</div>;
}

export function ModelPreviewCanvas({ modelUrl, cameraPosition = [0, 1, 4.5] }: ModelPreviewCanvasProps) {
  return (
    <div
      className='relative h-full w-full overflow-hidden'
      style={{
        backgroundImage: "url('/tuduc/BackgroundTuDucTomb.jpg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#000',
      }}>
      <div className='absolute inset-0 bg-white/50 backdrop-blur-xl' />
      <Suspense fallback={<PreviewFallback />}>
        <Canvas camera={{ position: cameraPosition, fov: 35 }} shadows dpr={[1, 2]} gl={{ alpha: true }}>
          {/* <color attach='background' args={['#edf3f9']} /> */}
          <ambientLight intensity={1.4} />
          <directionalLight
            castShadow
            intensity={2.5}
            position={[4, 8, 6]}
            shadow-mapSize-height={2048}
            shadow-mapSize-width={2048}
          />
          <directionalLight intensity={1.2} position={[-6, 4, -4]} />

          <Bounds fit clip observe margin={1.2}>
            <group position={[0, -0.6, 0]}>
              <PreviewModel modelUrl={modelUrl} />
            </group>
          </Bounds>

          {/* <mesh rotation-x={-Math.PI / 2} position={[0, -1.25, 0]} receiveShadow>
            <planeGeometry args={[16, 16]} />
            <shadowMaterial opacity={0.2} />
          </mesh> */}

          <OrbitControls makeDefault enablePan enableDamping minDistance={1.5} maxDistance={14} target={[0, 0.6, 0]} />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload('/tuduc/Khiem_Cung_Ky_Stele.glb');
