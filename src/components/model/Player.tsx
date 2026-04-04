import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

type PlayerProps = {
  active?: boolean;
  initialPosition?: [number, number, number];
};

function Player({ active = true, initialPosition = [-6, 0, 0] }: PlayerProps) {
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const body = useRef<any>(null);
  const { rapier, world } = useRapier();
  const { camera } = useThree();
  /**
   * Movement vectors
   */
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();

  const SPEED = 2;

  /**
   * Jump logic
   */
  const jump = useCallback(() => {
    if (!body.current) return;

    const origin = body.current.translation();
    origin.y -= 0.2;

    const ray = new rapier.Ray(origin, { x: 0, y: -1, z: 0 });
    const hit = world.castRay(ray, 10, true);

    if (hit && hit.timeOfImpact < 0.15) {
      body.current.applyImpulse({ x: 0, y: 1, z: 0 });
    }
  }, [rapier.Ray, world]);

  useEffect(() => {
    if (!active) return;
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => value && jump(),
    );
    return () => unsubscribeJump();
  }, [active, jump, subscribeKeys]);

  useFrame((state) => {
    if (!active || !body.current) return;

    const translation = body.current.translation();
    const velocity = body.current.linvel();

    const isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.z) > 0.1;

    let bobbingOffset = 0;
    if (isMoving) {
      const speedFactor = 8;
      const amplitude = 0.04;
      bobbingOffset = Math.sin(state.clock.elapsedTime * speedFactor) * amplitude;
    }

    state.camera.position.set(translation.x, translation.y + 1 + bobbingOffset, translation.z);

    const { forward, backward, left, right } = getKeys();

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation);

    const currentVelocity = body.current.linvel();
    body.current.setLinvel(
      {
        x: direction.x,
        y: currentVelocity.y,
        z: direction.z,
      },
      true,
    );
  });

  useEffect(() => {
    camera.rotation.order = 'YXZ';
    camera.rotation.y = -Math.PI / 2;
  }, [camera]);

  return (
    <>
      <RigidBody
        ref={body}
        colliders={false}
        enabledRotations={[false, false, false]}
        linearDamping={0.5}
        angularDamping={0.5}
        position={initialPosition}
        friction={1}>
        <CapsuleCollider args={[0.5, 0.2]} />
      </RigidBody>
    </>
  );
}

export default Player;
