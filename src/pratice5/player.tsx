import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, useRapier } from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const body = useRef<any>(null!);
  const { rapier, world } = useRapier();
  const rapierWorld = world;

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3());
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.31;

    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);

    if (hit && hit.timeOfImpact < 0.15) body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      },
    );
    return () => {
      unsubscribeJump();
    };
  });

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.2 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (left) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (right) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    body.current.applyImpulse(impulse, true);
    body.current.applyTorqueImpulse(torque, true);

    /**
     * Camera
     */
    const bodyPosition = body.current.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.y += 0.5;
    cameraPosition.z += 1.5;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.5;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  });

  return (
    <>
      <RigidBody type='fixed'>
        <mesh receiveShadow position={[0, -2, 0]}>
          <boxGeometry args={[10, 0.5, 10]} />
          <meshStandardMaterial color={'greenyellow'} />
        </mesh>
      </RigidBody>
      <RigidBody type='fixed'>
        <mesh receiveShadow position={[0, 0, -5]}>
          <boxGeometry args={[10, 5, 0.5]} />
          <meshStandardMaterial color={'greenyellow'} />
        </mesh>
      </RigidBody>
      <RigidBody
        ref={body}
        colliders='ball'
        restitution={0.2}
        linearDamping={0.5}
        angularDamping={0.5}
        position={[0, 1, 0]}
        friction={1}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial color={'hotpink'} />
        </mesh>
      </RigidBody>
    </>
  );
}

export default Player;
