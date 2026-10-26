import { Environment } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SHADOW_MAP_SIZE } from '../../constants/settings';
import { useSettingsStore } from '../../store/useSettingsStore';
import { SKY_HDR_URL } from './AnimateSky';

type LightsProps = {
  sunPosition?: [number, number, number];
};

const SUN_COLOR = '#fff1d6';
const SUN_DISTANCE = 50;
const SHADOW_HALF_SIZE = 20;

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const sunDirection = new THREE.Vector3();
const lightRight = new THREE.Vector3();
const lightUp = new THREE.Vector3();

const Lights = ({ sunPosition = [10, 14, 10] }: LightsProps) => {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const scene = useThree((state) => state.scene);
  const shadowQuality = useSettingsStore((state) => state.graphics.shadows);
  const castShadow = shadowQuality !== 'off';
  const shadowMapSize = castShadow ? SHADOW_MAP_SIZE[shadowQuality] : SHADOW_MAP_SIZE.medium;
  const shadowTexelSize = (SHADOW_HALF_SIZE * 2) / shadowMapSize;

  useEffect(() => {
    const shadow = lightRef.current.shadow;
    shadow.map?.dispose();
    shadow.map = null;
  }, [shadowMapSize]);

  useEffect(() => {
    const target = lightRef.current.target;
    scene.add(target);
    return () => {
      scene.remove(target);
    };
  }, [scene]);

  useFrame(({ camera }) => {
    const light = lightRef.current;
    sunDirection.set(...sunPosition).normalize();

    lightRight.crossVectors(WORLD_UP, sunDirection).normalize();
    lightUp.crossVectors(sunDirection, lightRight);

    const x = Math.round(camera.position.dot(lightRight) / shadowTexelSize) * shadowTexelSize;
    const y = Math.round(camera.position.dot(lightUp) / shadowTexelSize) * shadowTexelSize;
    const depth = camera.position.dot(sunDirection);

    light.target.position.copy(lightRight).multiplyScalar(x).addScaledVector(lightUp, y).addScaledVector(sunDirection, depth);
    light.position.copy(light.target.position).addScaledVector(sunDirection, SUN_DISTANCE);
  });

  return (
    <>
      <Environment files={SKY_HDR_URL} environmentIntensity={0.6} />
      <hemisphereLight args={['#cfe3f5', '#6e5a40', 0.6]} />
      <directionalLight
        ref={lightRef}
        castShadow={castShadow}
        color={SUN_COLOR}
        intensity={3}
        shadow-radius={6}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}>
        <orthographicCamera
          attach='shadow-camera'
          args={[-SHADOW_HALF_SIZE, SHADOW_HALF_SIZE, SHADOW_HALF_SIZE, -SHADOW_HALF_SIZE, 0.1, SUN_DISTANCE * 2]}
        />
      </directionalLight>
    </>
  );
};

export default Lights;
