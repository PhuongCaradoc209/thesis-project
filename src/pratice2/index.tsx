import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { DirectionalLightHelper, type Object3D } from 'three';
import { Float, OrbitControls, PivotControls, Sky, SoftShadows, Text, useHelper } from '@react-three/drei';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';
import Objects from '../components/model/TuducTombs';

function Lights({ lightPosition }: { lightPosition: [number, number, number] }) {
  const lightRef = useRef<Object3D>(null!);
  useHelper(lightRef, DirectionalLightHelper, 1, 'yellow');

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={lightPosition}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <ambientLight intensity={0.5} />
    </>
  );
}

function FallbackObject({
  showPivot,
  position,
  height,
  wireframe,
}: {
  showPivot: boolean;
  position: [number, number, number];
  height: number;
  wireframe: boolean;
}) {
  return (
    <PivotControls anchor={[0, 0, 0]} depthTest={false} visible={showPivot}>
      <mesh castShadow position={position} scale={0.8}>
        <cylinderGeometry args={[0.5, 0.5, height, 32]} />
        <meshStandardMaterial color='orange' wireframe={wireframe} />
      </mesh>
    </PivotControls>
  );
}

function Practice2() {
  const controls = useControls('basic control', {
    position: -2,
    color: '#6eeda0',
    perfVisible: true,
    showTransform: false,
    showPivot: false,
  });
  const { sunPosition } = useControls('environment', {
    sunPosition: {
      value: [1, 2, 3],
    },
  });
  const { position, height, wireframe } = useControls('fallback', {
    position: {
      value: [0, 0.5, 0],
    },
    height: {
      value: 1.3,
      min: 0.5,
      max: 2,
      step: 0.05,
    },
    wireframe: false,
  });
  return (
    <div className={`h-screen w-screen bg-[#4672a9]`}>
      <Canvas
        // gl={{
        //   toneMapping: THREE.LinearToneMapping,
        //   // outputColorSpace: THREE.SRGBColorSpace,
        // }}
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [3, 2, 6],
        }}>
        {controls.perfVisible && <Perf position='top-left' />}
        <OrbitControls makeDefault />
        {/* <CameraController /> */}

        {/* <Environment background preset='sunset' ground={{ height: 10, radius: 50, scale: 100 }} blur={0.8}>
          <color args={['#000000']} attach={'background'} />
          <Lightformer position-z={-5} scale={10} color={'red'} intensity={10} form={'ring'} />
        </Environment> */}

        <Lights lightPosition={sunPosition} />
        <Sky sunPosition={sunPosition} />
        {/* <BakeShadows /> */}
        <SoftShadows size={25} samples={10} focus={0} />

        {/* <RotatingBox showTransform={controls.showTransform} />
        <Sphere showPivot={controls.showPivot} /> */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={10} receiveShadow>
          <planeGeometry />
          <meshStandardMaterial color='greenyellow' />
          {/* <MeshReflectorMaterial resolution={512} blur={[1000, 1000]} mixBlur={1} mirror={0.75} color={controls.color} /> */}
        </mesh>
        <Suspense
          fallback={<FallbackObject showPivot={controls.showPivot} position={position} height={height} wireframe={wireframe} />}>
          <Objects />
        </Suspense>

        <Float speed={5}>
          <Text position={[0, 1.5, 0]} color='salmon' fontSize={0.5} anchorX='center' anchorY='middle'>
            Practice 2
          </Text>
        </Float>
      </Canvas>
    </div>
  );
}

export default Practice2;
