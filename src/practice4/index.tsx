import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, InstancedRigidBodies, Physics, RigidBody, type InstancedRigidBodyProps } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

function Practice4() {
  const rbRef = useRef<any>(null);
  const twister = useRef<any>(null);
  const cubes = useRef<any>(null);

  const cubesCount = 100;
  const instances = useMemo<InstancedRigidBodyProps[]>(() => {
    const instances: InstancedRigidBodyProps[] = [];

    for (let i = 0; i < cubesCount; i++) {
      instances.push({
        key: 'instance_' + i,
        position: [(Math.random() - 0.5) * 8, 6 + i * 0.2, (Math.random() - 0.5) * 8],
        rotation: [Math.random(), Math.random(), Math.random()],
      });
    }

    return instances;
  }, []);

  const handlePointerDown = () => {
    if (rbRef.current) {
      const mass = rbRef.current.mass();
      rbRef.current.applyImpulse({ x: 5 * mass, y: 0, z: 0 }, true);
      rbRef.current.applyTorqueImpulse(
        {
          x: Math.random() * 2,
          y: Math.random() * 2,
          z: Math.random() * 2,
        },
        true,
      );
    }
  };

  useFrame((state) => {
    if (twister.current) {
      const time = state.clock.getElapsedTime();
      const eulerRotation = new THREE.Euler(0, time, 0);
      const quaternionRotation = new THREE.Quaternion().setFromEuler(eulerRotation);
      twister.current.setNextKinematicRotation(quaternionRotation);
    }
  });

  useEffect(() => {
    for (let i = 0; i < cubesCount; i++) {
      const matrix = new THREE.Matrix4();
      matrix.compose(new THREE.Vector3(i * 2, 0, 0), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
      cubes.current.setMatrixAt(i, matrix);
    }
  }, []);

  return (
    <>
      <Perf position='top-left' />
      <OrbitControls makeDefault />
      <directionalLight castShadow position={[1.5, 2, 0]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics debug>
        <RigidBody colliders='ball' mass={0.1}>
          <mesh castShadow position={[2, 4, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={'orange'} />
          </mesh>
        </RigidBody>

        <RigidBody colliders='trimesh' ref={rbRef} restitution={1}>
          <mesh castShadow position={[-2, 1, 0]} rotation={[Math.PI * 0.5, 0, 0]} onClick={handlePointerDown}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={'violet'} />
          </mesh>
        </RigidBody>

        <RigidBody type='fixed'>
          <mesh receiveShadow position={[0, -2, 0]}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color={'greenyellow'} />
          </mesh>
        </RigidBody>

        <RigidBody position={[0, -0.8, 0]} friction={5} type='kinematicPosition' ref={twister}>
          <mesh castShadow position={[0, 0, 0]} rotation={[0, Math.PI * 0.5, 0]}>
            <boxGeometry args={[4, 0.5, 0.5]} />
            <meshStandardMaterial color={'red'} />
          </mesh>
        </RigidBody>

        <InstancedRigidBodies instances={instances}>
          <instancedMesh ref={cubes} castShadow receiveShadow args={[undefined, undefined, cubesCount]}>
            <boxGeometry />
            <meshStandardMaterial color='tomato' />
          </instancedMesh>
        </InstancedRigidBodies>

        <RigidBody type='fixed'>
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 0.2, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 0.2, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5, 0.2, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5, 0.2, 0]} />
        </RigidBody>
      </Physics>
    </>
  );
}

export default Practice4;
