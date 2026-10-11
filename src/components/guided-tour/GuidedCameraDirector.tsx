import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGuidedTourStore } from '../../store/useGuidedTourStore';
import type { GuidedTourIntro } from '../../types/guidedTour.types';

type CameraSnapshot = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  fov?: number;
};

type GuidedCameraDirectorProps = {
  introOverride?: GuidedTourIntro;
};

type ResolvedOrbitSettings = {
  center: THREE.Vector3;
  target: THREE.Vector3;
  radius: number;
  height: number;
  startAngle: number;
  endAngle: number;
  duration: number;
};

const DEFAULT_ORBIT_RADIUS = 10;
const DEFAULT_ORBIT_HEIGHT = 8;
const DEFAULT_ORBIT_DURATION = 5;
const DEFAULT_ROTATION_SPEED = 14;

function toVector3(value: number[], fallback: [number, number, number]) {
  if (value.length < 3 || value.slice(0, 3).some((coordinate) => !Number.isFinite(coordinate))) {
    return new THREE.Vector3(...fallback);
  }
  return new THREE.Vector3(value[0], value[1], value[2]);
}

function resolveOrbitSettings(intro: GuidedTourIntro, reduceMotion: boolean): ResolvedOrbitSettings {
  const angleDistance = Math.abs(intro.endAngle - intro.startAngle);
  const durationFromSpeed = intro.rotationSpeed ? angleDistance / intro.rotationSpeed : intro.duration;

  return {
    center: toVector3(intro.orbitCenter, [0, 0, 0]),
    target: toVector3(intro.lookAt, [0, 1.5, 0]),
    radius: intro.radius,
    height: intro.height,
    startAngle: THREE.MathUtils.degToRad(intro.startAngle),
    endAngle: THREE.MathUtils.degToRad(intro.endAngle),
    duration: reduceMotion ? Math.min(3, durationFromSpeed) : durationFromSpeed,
  };
}

export function GuidedCameraDirector({ introOverride }: GuidedCameraDirectorProps) {
  const camera = useThree((state) => state.camera);
  const reduceMotion = useReducedMotion();
  const tourIntro = useGuidedTourStore((state) => state.tour?.intro);
  const status = useGuidedTourStore((state) => state.status);
  const skipRequested = useGuidedTourStore((state) => state.cinematicSkipRequested);
  const completeCinematic = useGuidedTourStore((state) => state.completeCinematic);
  const setCinematicProgress = useGuidedTourStore((state) => state.setCinematicProgress);
  const intro = introOverride ?? tourIntro;
  const snapshotRef = useRef<CameraSnapshot | null>(null);
  const elapsedRef = useRef(0);
  const reportedProgressRef = useRef(-1);

  const orbitSettings = useMemo(() => (intro ? resolveOrbitSettings(intro, Boolean(reduceMotion)) : null), [intro, reduceMotion]);

  const placeCamera = useCallback(
    (progress: number) => {
      //dùng lerp để tính toán vị trí camera giữa startAngle và endAngle dựa trên progress
      if (!orbitSettings) return;
      const angleProgress = reduceMotion ? 0.5 : progress;
      const angle = THREE.MathUtils.lerp(orbitSettings.startAngle, orbitSettings.endAngle, angleProgress);
      camera.position.set(
        orbitSettings.center.x + Math.cos(angle) * orbitSettings.radius,
        orbitSettings.center.y + orbitSettings.height,
        orbitSettings.center.z + Math.sin(angle) * orbitSettings.radius,
      );
      camera.lookAt(orbitSettings.target);
      camera.updateMatrixWorld();
    },
    [camera, orbitSettings, reduceMotion],
  );

  const restoreCamera = useCallback(() => {
    const snapshot = snapshotRef.current;
    if (!snapshot) return;

    camera.position.copy(snapshot.position);
    camera.quaternion.copy(snapshot.quaternion);
    if ('fov' in camera && typeof snapshot.fov === 'number') {
      camera.fov = snapshot.fov;
      camera.updateProjectionMatrix();
    }
    camera.updateMatrixWorld();
    snapshotRef.current = null;
  }, [camera]);

  const finish = useCallback(() => {
    restoreCamera();
    completeCinematic();
  }, [completeCinematic, restoreCamera]);

  useEffect(() => {
    if (status !== 'cinematic' || !intro || snapshotRef.current) return;

    snapshotRef.current = {
      //store current camera state
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone(),
      fov: 'fov' in camera ? camera.fov : undefined,
    };
    elapsedRef.current = 0;
    reportedProgressRef.current = -1;
    setCinematicProgress(0);
    placeCamera(0);
  }, [camera, intro, placeCamera, setCinematicProgress, status]);

  useEffect(
    () => () => {
      restoreCamera();
    },
    [restoreCamera],
  );

  useFrame((_, delta) => {
    if (status !== 'cinematic' || !intro || !snapshotRef.current) return;
    if (skipRequested) {
      finish();
      return;
    }

    const duration = orbitSettings?.duration ?? intro.duration;
    // không cho thời gian vượt quá tổng duration. Normalize progress to [0, 1] range
    elapsedRef.current = Math.min(duration, elapsedRef.current + delta);
    const progress = duration > 0 ? elapsedRef.current / duration : 1;
    placeCamera(progress);

    if (progress - reportedProgressRef.current >= 0.02 || progress >= 1) {
      reportedProgressRef.current = progress;
      setCinematicProgress(progress);
    }

    if (progress >= 1) finish();
  });

  return null;
}

export function DevelopmentGuidedCameraDirector() {
  const intro = useGuidedTourStore((state) => state.tour?.intro);
  const controls = useControls('Guided cinematic', {
    orbitCenterX: { value: intro?.orbitCenter[0] ?? 0, step: 0.1 },
    orbitCenterY: { value: intro?.orbitCenter[1] ?? 0, step: 0.1 },
    orbitCenterZ: { value: intro?.orbitCenter[2] ?? 0, step: 0.1 },
    lookAtX: { value: intro?.lookAt[0] ?? 0, step: 0.1 },
    lookAtY: { value: intro?.lookAt[1] ?? 1.5, step: 0.1 },
    lookAtZ: { value: intro?.lookAt[2] ?? 0, step: 0.1 },
    radius: { value: intro?.radius ?? DEFAULT_ORBIT_RADIUS, min: 1, max: 100, step: 0.5 },
    height: { value: intro?.height ?? DEFAULT_ORBIT_HEIGHT, min: -20, max: 100, step: 0.5 },
    startAngle: { value: intro?.startAngle ?? -70, min: -360, max: 360, step: 1 },
    endAngle: { value: intro?.endAngle ?? 70, min: -360, max: 360, step: 1 },
    rotationSpeed: {
      value: intro?.rotationSpeed ?? DEFAULT_ROTATION_SPEED,
      min: 1,
      max: 90,
      step: 1,
      label: 'Speed (deg/s)',
    },
    duration: {
      value: intro?.duration ?? DEFAULT_ORBIT_DURATION,
      min: 1,
      max: 60,
      step: 0.5,
      label: 'Duration fallback (s)',
    },
  });

  const configuredIntro = useMemo<GuidedTourIntro | undefined>(() => {
    if (!intro) return undefined;
    return {
      ...intro,
      orbitCenter: [controls.orbitCenterX, controls.orbitCenterY, controls.orbitCenterZ],
      lookAt: [controls.lookAtX, controls.lookAtY, controls.lookAtZ],
      radius: controls.radius,
      height: controls.height,
      startAngle: controls.startAngle,
      endAngle: controls.endAngle,
      rotationSpeed: controls.rotationSpeed,
      duration: controls.duration,
    };
  }, [controls, intro]);

  return <GuidedCameraDirector introOverride={configuredIntro} />;
}
