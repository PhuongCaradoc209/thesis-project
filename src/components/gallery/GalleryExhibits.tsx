import { useGLTF } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useGalleryArtifacts } from '../../hooks/useArtifacts';
import type { Artifact } from '../../types/scene.types';
import { ModelErrorBoundary } from '../3d/ModelErrorBoundary';
import { InteractPoint } from '../interact-point';
import { PEDESTAL_HEIGHT, PEDESTAL_POSITIONS } from '../scenes/indoor/roomLayout';

const DEFAULT_HEIGHT = 0.6; // chiều cao mặc định của hiện vật trên bục (m)

// Model Sketchfab mỗi cái một đơn vị đo: đo khung bao của model rồi co về đúng chiều cao mong muốn,
// đồng thời dời model cho đáy chạm mặt bục và tâm nằm giữa bục.
function ExhibitModel({ url, height, rotationY }: { url: string; height: number; rotationY: number }) {
  const { scene } = useGLTF(url);

  const { model, scale, offset } = useMemo(() => {
    const model = scene.clone(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const offset: [number, number, number] = [-center.x, -box.min.y, -center.z];
    return { model, scale: size.y > 0 ? height / size.y : 1, offset };
  }, [scene, height]);

  return (
    <group scale={scale} rotation-y={THREE.MathUtils.degToRad(rotationY)}>
      <primitive object={model} position={offset} />
    </group>
  );
}

function Exhibit({ artifact, onInspect }: { artifact: Artifact; onInspect: (artifactId: string) => void }) {
  const [x, , z] = PEDESTAL_POSITIONS[artifact.pedestal ?? 0];
  const height = artifact.display?.height ?? DEFAULT_HEIGHT;
  const rotationY = artifact.display?.rotationY ?? 0;

  return (
    <>
      {/* Model lỗi thì chỉ hiện vật đó biến mất, cả phòng vẫn chạy */}
      <ModelErrorBoundary
        resetKey={artifact.modelUrl}
        fallback={() => null}
        onError={(error) => console.error(`[Gallery] Failed to load artifact ${artifact.artifactId}`, error)}>
        <Suspense fallback={null}>
          <group position={[x, PEDESTAL_HEIGHT, z]}>
            <ExhibitModel url={artifact.modelUrl} height={height} rotationY={rotationY} />
          </group>
        </Suspense>
      </ModelErrorBoundary>

      {/* Điểm bấm F nằm ngay trên đầu hiện vật */}
      <InteractPoint
        interactionId={`gallery-${artifact.artifactId}`}
        position={[x, PEDESTAL_HEIGHT + height + 0.3, z]}
        artifactId={artifact.artifactId}
        onInspect={onInspect}
      />
    </>
  );
}

type GalleryExhibitsProps = {
  sceneId: string;
  onInspect: (artifactId: string) => void;
};

// Đặt các hiện vật của phòng (document `artifacts` có sceneId trùng) lên bục theo số `pedestal`
export function GalleryExhibits({ sceneId, onInspect }: GalleryExhibitsProps) {
  const { data: artifacts = [] } = useGalleryArtifacts(sceneId);

  // Bỏ qua hiện vật thiếu model hoặc số bục không có trong phòng
  const validArtifacts = artifacts.filter((artifact) => {
    const pedestal = artifact.pedestal ?? 0;
    const valid =
      Boolean(artifact.modelUrl) && Number.isInteger(pedestal) && pedestal >= 0 && pedestal < PEDESTAL_POSITIONS.length;
    if (!valid)
      console.warn(`[Gallery] Artifact ${artifact.artifactId} has no modelUrl or an invalid pedestal`, artifact.pedestal);
    return valid;
  });

  return (
    <>
      {validArtifacts.map((artifact) => (
        <Exhibit key={artifact.artifactId} artifact={artifact} onInspect={onInspect} />
      ))}
    </>
  );
}
