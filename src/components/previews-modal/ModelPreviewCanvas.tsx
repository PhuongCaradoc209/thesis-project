import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, type ComponentRef } from 'react';
import * as THREE from 'three';

type ModelPreviewCanvasProps = {
  modelUrl: string;
  cameraPosition?: number[];
  modelPosition?: number[];
  orbitTarget?: number[];
  resetRequest?: number;
};

type Vector3Tuple = [number, number, number];

const DEFAULT_CAMERA_POSITION: Vector3Tuple = [0, 1, 4.5];
const DEFAULT_MODEL_POSITION: Vector3Tuple = [0, -6.5, -16];

function toVector3(value: number[] | undefined, fallback: Vector3Tuple): Vector3Tuple {
  if (value?.length === 3 && value.every(Number.isFinite)) {
    return [value[0], value[1], value[2]];
  }

  return fallback;
}

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

export function ArtifactPreviewScene({
  modelUrl,
  cameraPosition,
  modelPosition,
  orbitTarget,
  resetRequest = 0,
}: ModelPreviewCanvasProps) {
  const gl = useThree((state) => state.gl);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const hasSavedInitialViewRef = useRef(false);
  const resolvedCameraPosition = useMemo(() => toVector3(cameraPosition, DEFAULT_CAMERA_POSITION), [cameraPosition]);
  const resolvedModelPosition = useMemo(() => toVector3(modelPosition, DEFAULT_MODEL_POSITION), [modelPosition]);
  const resolvedOrbitTarget = useMemo(() => toVector3(orbitTarget, resolvedModelPosition), [orbitTarget, resolvedModelPosition]);
  const initialDistance = useMemo(
    () => new THREE.Vector3(...resolvedCameraPosition).distanceTo(new THREE.Vector3(...resolvedOrbitTarget)),
    [resolvedCameraPosition, resolvedOrbitTarget],
  );
  const distanceReference = Math.max(initialDistance, 1);
  const minDistance = Math.max(0.5, distanceReference * 0.1);
  const maxDistance = Math.max(3, distanceReference * 3);
  const previewConfigurationKey = `${modelUrl}:${resolvedCameraPosition.join(',')}:${resolvedModelPosition.join(',')}:${resolvedOrbitTarget.join(',')}`;

  useEffect(() => {
    const previousToneMapping = gl.toneMapping;
    const previousExposure = gl.toneMappingExposure;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.25;

    return () => {
      gl.toneMapping = previousToneMapping;
      gl.toneMappingExposure = previousExposure;
    };
  }, [gl]);

  useEffect(() => {
    hasSavedInitialViewRef.current = false;
  }, [previewConfigurationKey]);

  useEffect(() => {
    if (!hasSavedInitialViewRef.current) return;
    controlsRef.current?.reset();
  }, [resetRequest]);

  const saveInitialView = useCallback(() => {
    if (!controlsRef.current || hasSavedInitialViewRef.current) return;

    controlsRef.current.saveState();
    hasSavedInitialViewRef.current = true;
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={resolvedCameraPosition} fov={35} />
      <ambientLight intensity={1.8} />
      <hemisphereLight args={['#ffffff', '#64748b', 1.6]} />
      <directionalLight intensity={3.2} position={[4, 8, 6]} />
      <directionalLight intensity={1.8} position={[-6, 4, -4]} />

      <group position={resolvedModelPosition}>
        <PreviewModel modelUrl={modelUrl} />
      </group>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan
        minDistance={minDistance}
        maxDistance={maxDistance}
        target={resolvedOrbitTarget}
        onStart={saveInitialView}
      />
    </>
  );
}
