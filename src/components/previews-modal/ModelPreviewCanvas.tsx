import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import * as THREE from 'three';
import type { ArtifactAnnotation } from '../../types/scene.types';
import { ArtifactAnnotationMarker } from './ArtifactAnnotationMarker';
import { PreviewModel } from './PreviewModel';
import { toVector3, type Vector3Tuple } from './preview.utils';

type ModelPreviewCanvasProps = {
  modelUrl: string;
  cameraPosition?: number[];
  modelPosition?: number[];
  orbitTarget?: number[];
  rotationX?: number;
  rotationY?: number;
  annotations?: ArtifactAnnotation[];
  resetRequest?: number;
  guidedAnnotationId?: string | null;
  onAnnotationOpen?: (annotationId: string) => void;
};

const DEFAULT_CAMERA_POSITION: Vector3Tuple = [0, 1, 4.5];
const DEFAULT_MODEL_POSITION: Vector3Tuple = [0, -6.5, -16];
const PREVIEW_FOV = 35;

export function ArtifactPreviewScene({
  modelUrl,
  cameraPosition,
  modelPosition,
  orbitTarget,
  rotationX = 0,
  rotationY = 0,
  annotations = [],
  resetRequest = 0,
  guidedAnnotationId,
  onAnnotationOpen,
}: ModelPreviewCanvasProps) {
  const gl = useThree((state) => state.gl);
  const { scene: gltfScene } = useGLTF(modelUrl);
  const modelRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const hasSavedInitialViewRef = useRef(false);
  const resolvedModelPosition = useMemo(() => toVector3(modelPosition, DEFAULT_MODEL_POSITION), [modelPosition]);
  const modelRotation = useMemo(
    () => new THREE.Euler(THREE.MathUtils.degToRad(rotationX), THREE.MathUtils.degToRad(rotationY), 0, 'YXZ'),
    [rotationX, rotationY],
  );
  const [previewCamera, setPreviewCamera] = useState<THREE.PerspectiveCamera | null>(null);

  const fit = useMemo(() => {
    if (cameraPosition) return null;

    gltfScene.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(gltfScene);
    if (box.isEmpty()) return null;
    box.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(modelRotation));

    const center = box.getCenter(new THREE.Vector3()).add(new THREE.Vector3(...resolvedModelPosition));
    const size = box.getSize(new THREE.Vector3());
    const halfFov = THREE.MathUtils.degToRad(PREVIEW_FOV / 2);
    const distance = (Math.max(size.x, size.y) / 2 / Math.tan(halfFov)) * 1.15 + size.z / 2;

    return {
      camera: [center.x, center.y + size.y * 0.1, center.z + distance] as Vector3Tuple,
      target: [center.x, center.y, center.z] as Vector3Tuple,
      distance,
    };
  }, [cameraPosition, gltfScene, resolvedModelPosition, modelRotation]);

  const resolvedCameraPosition = useMemo(
    () => fit?.camera ?? toVector3(cameraPosition, DEFAULT_CAMERA_POSITION),
    [fit, cameraPosition],
  );
  const resolvedOrbitTarget = useMemo(
    () => fit?.target ?? toVector3(orbitTarget, resolvedModelPosition),
    [fit, orbitTarget, resolvedModelPosition],
  );
  const initialDistance = useMemo(
    () => new THREE.Vector3(...resolvedCameraPosition).distanceTo(new THREE.Vector3(...resolvedOrbitTarget)),
    [resolvedCameraPosition, resolvedOrbitTarget],
  );
  const distanceReference = Math.max(initialDistance, 1);
  const minDistance = fit ? fit.distance * 0.2 : Math.max(0.5, distanceReference * 0.1);
  const maxDistance = fit ? fit.distance * 3 : Math.max(3, distanceReference * 3);
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
      <PerspectiveCamera ref={setPreviewCamera} makeDefault position={resolvedCameraPosition} fov={PREVIEW_FOV} />
      <ambientLight intensity={1.8} />
      <hemisphereLight args={['#ffffff', '#64748b', 1.6]} />
      <directionalLight intensity={3.2} position={[4, 8, 6]} />
      <directionalLight intensity={1.8} position={[-6, 4, -4]} />

      <group position={resolvedModelPosition} rotation={modelRotation}>
        <PreviewModel modelUrl={modelUrl} modelRef={modelRef} />
        {annotations.map((annotation) => (
          <ArtifactAnnotationMarker
            key={`${previewConfigurationKey}:${annotation.annotationId}`}
            annotation={annotation}
            modelRef={modelRef}
            guidedTarget={guidedAnnotationId === annotation.annotationId}
            onOpen={onAnnotationOpen}
          />
        ))}
      </group>

      {previewCamera && (
        <OrbitControls
          ref={controlsRef}
          camera={previewCamera}
          makeDefault
          enablePan
          minDistance={minDistance}
          maxDistance={maxDistance}
          target={resolvedOrbitTarget}
          onStart={saveInitialView}
        />
      )}
    </>
  );
}
