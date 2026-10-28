import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Fragment, Suspense, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useGalleryArtifacts } from '../../hooks/useArtifacts';
import type { Artifact } from '../../types/scene.types';
import { ModelErrorBoundary } from '../3d/ModelErrorBoundary';
import { InteractPoint } from '../interact-point';
import { Pedestal } from '../scenes/indoor/Pedestal';
import {
  PAINTING_Y,
  PAINTING_Z,
  PEDESTAL_HEIGHT,
  PEDESTAL_Z,
  ROOM_HEIGHT,
  SPOT_XS,
  WALL_SLOT_XS,
} from '../scenes/indoor/roomLayout';

const DEFAULT_OBJECT_HEIGHT = 0.6;
const DEFAULT_PAINTING_HEIGHT = 0.9;

type Mount = 'pedestal' | 'wall';
type FitBy = 'width' | 'height';

function useFittedModel(url: string, rotationX: number, rotationY: number, mount: Mount, fitBy: FitBy, size: number) {
  const { scene } = useGLTF(url);

  return useMemo(() => {
    const model = scene.clone(true);
    model.rotation.set(THREE.MathUtils.degToRad(rotationX), THREE.MathUtils.degToRad(rotationY), 0, 'YXZ');
    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const boxSize = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const measured = fitBy === 'width' ? boxSize.x : boxSize.y;
    const scale = measured > 0 ? size / measured : 1;
    const offset: [number, number, number] =
      mount === 'wall' ? [-center.x, -center.y, -box.min.z] : [-center.x, -box.min.y, -center.z];

    return { model, scale, offset, height: boxSize.y * scale };
  }, [scene, rotationX, rotationY, mount, fitBy, size]);
}

const LAMP_DISTANCE_FROM_WALL = 1.2;
const LAMP_Y = ROOM_HEIGHT - 0.1;
const LAMP_LENGTH = 0.16;
const FIXTURE_COLOR = '#2b1a12';

function PictureLight({ x }: { x: number }) {
  const [target] = useState(() => new THREE.Object3D());
  const lampPosition = useMemo(() => new THREE.Vector3(x, LAMP_Y, PAINTING_Z + LAMP_DISTANCE_FROM_WALL), [x]);
  const targetPosition = useMemo(() => new THREE.Vector3(x, PAINTING_Y, PAINTING_Z), [x]);

  const lampRotation = useMemo(() => {
    const matrix = new THREE.Matrix4().lookAt(targetPosition, lampPosition, new THREE.Vector3(0, 1, 0));
    return new THREE.Euler().setFromRotationMatrix(matrix);
  }, [lampPosition, targetPosition]);

  return (
    <>
      <primitive object={target} position={targetPosition} />

      <group position={lampPosition} rotation={lampRotation}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.06, 0.06, LAMP_LENGTH, 16]} />
          <meshStandardMaterial color={FIXTURE_COLOR} roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, LAMP_LENGTH / 2 + 0.001]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color='#fff1dc' />
        </mesh>
      </group>

      <spotLight
        position={lampPosition}
        target={target}
        color='#fff1dc'
        intensity={25}
        angle={0.55}
        penumbra={0.6}
        distance={6}
      />
    </>
  );
}

function getSizing(artifact: Artifact): { fitBy: FitBy; size: number } {
  const display = artifact.display;
  if (artifact.mount !== 'wall') return { fitBy: 'height', size: display?.height ?? DEFAULT_OBJECT_HEIGHT };
  if (display?.height) return { fitBy: 'height', size: display.height };
  if (display?.width) return { fitBy: 'width', size: display.width };
  return { fitBy: 'height', size: DEFAULT_PAINTING_HEIGHT };
}

type ExhibitProps = {
  artifact: Artifact;
  x: number;
  onInspect: (artifactId: string) => void;
};

function Exhibit({ artifact, x, onInspect }: ExhibitProps) {
  const isPainting = artifact.mount === 'wall';
  const { fitBy, size } = getSizing(artifact);

  const { model, scale, offset, height } = useFittedModel(
    artifact.sceneModelUrl || artifact.modelUrl,
    artifact.display?.rotationX ?? 0,
    artifact.display?.rotationY ?? 0,
    isPainting ? 'wall' : 'pedestal',
    fitBy,
    size,
  );

  const modelPosition: [number, number, number] = isPainting ? [x, PAINTING_Y, PAINTING_Z] : [x, PEDESTAL_HEIGHT, PEDESTAL_Z];
  const pointPosition: [number, number, number] = isPainting
    ? [x, Math.max(0.6, PAINTING_Y - height / 2 - 0.3), PAINTING_Z + 0.3]
    : [x, PEDESTAL_HEIGHT + height + 0.3, PEDESTAL_Z];

  return (
    <>
      {isPainting && <PictureLight x={x} />}

      <group position={modelPosition} rotation-y={isPainting ? 0 : Math.PI}>
        <group scale={scale}>
          <group position={offset}>
            <primitive object={model} />
          </group>
        </group>
      </group>

      <InteractPoint
        interactionId={`gallery-${artifact.artifactId}`}
        position={pointPosition}
        artifactId={artifact.artifactId}
        onInspect={onInspect}
        promptSide={isPainting ? 'bottom' : 'top'}
      />
    </>
  );
}

function ExhibitSlot({ artifact, x, onInspect }: ExhibitProps) {
  return (
    <ModelErrorBoundary
      resetKey={artifact.sceneModelUrl || artifact.modelUrl}
      fallback={() => null}
      onError={(error) => console.error(`[Gallery] Failed to load artifact ${artifact.artifactId}`, error)}>
      <Suspense fallback={null}>
        <Exhibit artifact={artifact} x={x} onInspect={onInspect} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

type GalleryExhibitsProps = {
  sceneId: string;
  onInspect: (artifactId: string) => void;
};

export function GalleryExhibits({ sceneId, onInspect }: GalleryExhibitsProps) {
  const { data: artifacts } = useGalleryArtifacts(sceneId);

  const { pedestalItems, wallItems } = useMemo(() => {
    const pedestalItems = new Map<number, Artifact>();
    const wallItems = new Map<number, Artifact>();

    for (const artifact of artifacts ?? []) {
      const isPainting = artifact.mount === 'wall';
      const items = isPainting ? wallItems : pedestalItems;
      const slotCount = isPainting ? WALL_SLOT_XS.length : SPOT_XS.length;
      const spot = artifact.spot;
      const validSpot = spot !== undefined && Number.isInteger(spot) && spot >= 0 && spot < slotCount;

      if (!(artifact.sceneModelUrl || artifact.modelUrl) || !validSpot || items.has(spot)) {
        console.warn(`[Gallery] Skipped artifact ${artifact.artifactId}: missing modelUrl, invalid or duplicated spot`, spot);
        continue;
      }
      items.set(spot, artifact);
    }
    return { pedestalItems, wallItems };
  }, [artifacts]);

  return (
    <RigidBody type='fixed' colliders={false}>
      {SPOT_XS.map((x, spot) => {
        const artifact = pedestalItems.get(spot);
        return (
          <Fragment key={`pedestal-${spot}`}>
            <Pedestal position={[x, 0, PEDESTAL_Z]} />
            {artifact && <ExhibitSlot artifact={artifact} x={x} onInspect={onInspect} />}
          </Fragment>
        );
      })}

      {WALL_SLOT_XS.map((x, spot) => {
        const artifact = wallItems.get(spot);
        return artifact ? <ExhibitSlot key={`wall-${spot}`} artifact={artifact} x={x} onInspect={onInspect} /> : null;
      })}
    </RigidBody>
  );
}
