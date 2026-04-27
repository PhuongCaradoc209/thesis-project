import { useGLTF } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';

type GateProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
};
function Gate({ position = [0, -3.8, 0], rotation = [0, 0, 0], scale = 0.012 }: GateProps) {
  const gateModel = useGLTF('https://res.cloudinary.com/djbtyhwl4/image/upload/v1775313663/stone-gate_tlfms8.glb');

  useMemo(() => {
    gateModel.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gateModel.scene]);

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type='fixed' colliders={false}>
        <CuboidCollider args={[0.8, 1, 2.3]} position={[0, 0.6, 5]} />
        <CuboidCollider args={[0.8, 1, 2.3]} position={[0, 0.6, -5]} />
        <primitive object={gateModel.scene} scale={scale} />
      </RigidBody>
    </group>
  );
}

export default Gate;

useGLTF.preload('https://res.cloudinary.com/djbtyhwl4/image/upload/v1775313663/stone-gate_tlfms8.glb');
