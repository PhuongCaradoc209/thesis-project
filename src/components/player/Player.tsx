import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTourismStore } from '../../store/useTourismStore';

type PlayerProps = {
  active?: boolean;
  initialPosition?: [number, number, number];
  killY?: number;
};

export const DEFAULT_KILL_Y = -20;

const PLAYER_EYE_HEIGHT = 1;
const INITIAL_CAMERA_YAW = -Math.PI / 2;
const RESPAWN_REARM_MARGIN = 1;

function Player({ active = true, initialPosition = [-6, 0, 0], killY = DEFAULT_KILL_Y }: PlayerProps) {
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const body = useRef<any>(null);
  const respawnRequestedRef = useRef(false);
  const { rapier, world } = useRapier();
  const { camera } = useThree();

  const isTeleporting = useTourismStore((state) => state.isTeleporting);
  const teleportTarget = useTourismStore((state) => state.teleportTarget);
  const triggerTeleport = useTourismStore((state) => state.triggerTeleport);
  const clearTeleport = useTourismStore((state) => state.clearTeleport);
  const effectiveKillY = initialPosition[1] > killY ? killY : initialPosition[1] - RESPAWN_REARM_MARGIN;

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

  useEffect(() => {
    if (initialPosition[1] > killY) return;

    console.warn('[Player] Invalid killY, using fallback.', {
      spawnY: initialPosition[1],
      killY,
      fallbackKillY: effectiveKillY,
    });
  }, [effectiveKillY, initialPosition, killY]);

  useFrame((state) => {
    if (!active || !body.current) return;

    const translation = body.current.translation();

    if (
      respawnRequestedRef.current &&
      !isTeleporting &&
      !teleportTarget &&
      translation.y > effectiveKillY + RESPAWN_REARM_MARGIN
    ) {
      respawnRequestedRef.current = false;
    }

    if (translation.y < effectiveKillY && !respawnRequestedRef.current && !isTeleporting && !teleportTarget) {
      const [spawnX, spawnY, spawnZ] = initialPosition;
      respawnRequestedRef.current = true;
      triggerTeleport({
        position: [spawnX, spawnY, spawnZ],
        lookAt: [spawnX + 1, spawnY + PLAYER_EYE_HEIGHT, spawnZ],
      });
      return;
    }

    if (isTeleporting || teleportTarget) return;

    const velocity = body.current.linvel();

    const isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.z) > 0.1;

    let bobbingOffset = 0;
    if (isMoving) {
      const speedFactor = 8;
      const amplitude = 0.04;
      bobbingOffset = Math.sin(state.clock.elapsedTime * speedFactor) * amplitude;
    }

    state.camera.position.set(translation.x, translation.y + PLAYER_EYE_HEIGHT + bobbingOffset, translation.z);

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
    camera.rotation.set(0, INITIAL_CAMERA_YAW, 0);
  }, [camera]);

  useEffect(() => {
    if (!teleportTarget || !body.current) return;

    const [px, py, pz] = teleportTarget.position;
    if (py <= effectiveKillY) {
      console.error(
        `[Player] Teleport target [${teleportTarget.position.join(', ')}] is not above killY (${effectiveKillY}). Teleport cancelled.`,
      );
      respawnRequestedRef.current = false;
      clearTeleport();
      return;
    }

    let clearTransitionTimeout: ReturnType<typeof setTimeout> | undefined;
    const timeout1 = setTimeout(() => {
      body.current.setTranslation({ x: px, y: py, z: pz }, true);
      body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      const [tx, ty, tz] = teleportTarget.lookAt;
      camera.position.set(px, py + PLAYER_EYE_HEIGHT, pz);
      camera.lookAt(tx, ty, tz);

      clearTransitionTimeout = setTimeout(() => {
        clearTeleport();
      }, 100);
    }, 300);

    return () => {
      clearTimeout(timeout1);
      if (clearTransitionTimeout) clearTimeout(clearTransitionTimeout);
    };
  }, [teleportTarget, camera, clearTeleport, effectiveKillY]);

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
