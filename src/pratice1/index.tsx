import { Environment, GizmoHelper, GizmoViewport, OrbitControls, Plane, useHelper, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';
import {
  CameraHelper,
  DirectionalLightHelper,
  SpotLightHelper,
  type DirectionalLight,
  type Mesh,
  type Object3D,
  type SpotLight,
} from 'three';

function AnimatedBox() {
  const boxRef = useRef<Mesh | null>(null);

  const { speed } = useControls({
    speed: {
      value: 0.01,
      min: 0,
      max: 0.1,
      step: 0.01,
    },
  });

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.x += speed;
      boxRef.current.rotation.y += speed;
    }
  });

  return <></>;
}

export function LightHelper() {
  const light = useRef<SpotLight>(null!);

  useHelper(light, SpotLightHelper);

  const { angle } = useControls({
    angle: {
      value: Math.PI / 4,
      min: 0,
      max: Math.PI / 2,
      step: 0.01,
    },
  });

  return (
    <>
      <spotLight
        ref={light}
        position={[5, 5, 5]}
        intensity={200}
        angle={angle}
        penumbra={0.3}
        target-position={[0, 0, 0]}
        castShadow
      />
      <ambientLight intensity={0.2} />
    </>
  );
}

function DLightHelper() {
  const light = useRef<DirectionalLight>(null!);

  useHelper(light, DirectionalLightHelper, 1, 'red');

  const shadow = useRef<Object3D>(null!);
  useHelper(shadow, CameraHelper);

  return (
    <>
      <directionalLight ref={light} position={[5, 5, 5]} intensity={5} castShadow>
        <orthographicCamera ref={shadow} attach='shadow-camera' args={[-5, 5, 5, -5, 0.5, 20]} />
      </directionalLight>
      <ambientLight intensity={0.2} />
    </>
  );
}

function GroundTexture() {
  const groundTexture = useTexture({
    map: './aerial_rocks_02_diff_4k.jpg',
    displacementMap: './aerial_rocks_02_disp_4k.jpg',
    aoMap: './aerial_rocks_02_arm_4k.jpg',
  });
  return (
    <>
      <Plane args={[10, 10]} rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial {...groundTexture} />
      </Plane>
      <Plane args={[10, 10, 128, 128]} rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial {...groundTexture} wireframe color={'white'} />
      </Plane>
    </>
  );
}

function App1() {
  return (
    <div className='h-screen w-screen'>
      <Canvas className='bg-gray-600' camera={{ position: [0, 0, 10], fov: 75 }} shadows>
        <Environment preset='night' background />

        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>
        <axesHelper args={[5]} />
        {/* <gridHelper args={[20, 20, 0xff22aa]} /> */}
        <OrbitControls />
        <AnimatedBox />
        <DLightHelper />
        <GroundTexture />
      </Canvas>
    </div>
  );
}

export default App1;
