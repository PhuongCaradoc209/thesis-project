import { Html, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import type { CollisionModel, ResolvedScenePlacement, SceneAsset } from '../../types/scene.types';
import { ModelErrorBoundary } from './ModelErrorBoundary';
import ModelReveal from './ModelReveal';

type GenericSceneAssetProps = {
  resolvedPlacement: ResolvedScenePlacement;
};

const toVector3 = (value: number[] | undefined, fallback: [number, number, number]): [number, number, number] =>
  value?.length === 3 ? [value[0], value[1], value[2]] : fallback;

const toScale = (value: number | number[] | undefined): number | [number, number, number] => {
  if (Array.isArray(value) && value.length === 3) return [value[0], value[1], value[2]];
  return typeof value === 'number' ? value : 1;
};

export function SceneAssetStatus({ message, retry }: { message: string; retry?: () => void }) {
  const { t } = useTranslation();

  return (
    <Html center distanceFactor={12} zIndexRange={[80, 0]}>
      <div className='border-secondary/60 bg-surface/95 text-on-surface min-w-44 rounded-xl border px-4 py-3 text-center text-xs shadow-xl backdrop-blur-md'>
        <div className='bg-secondary mx-auto mb-2 h-0.5 w-10 rounded-full' />
        <p className='font-headline'>{message}</p>
        {retry && (
          <button
            type='button'
            className='bg-primary hover:bg-primary-container mt-3 rounded-md px-3 py-1.5 font-semibold text-white transition-colors'
            onClick={retry}>
            {t('artifact.retry')}
          </button>
        )}
      </div>
    </Html>
  );
}

function LoadedVisual({ asset }: { asset: SceneAsset }) {
  const gltf = useGLTF(asset.url);
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

function LoadedCollision({ collision }: { collision: CollisionModel }) {
  const gltf = useGLTF(collision.url);
  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const hiddenMaterials = materials.map((material) => {
          const clonedMaterial = material.clone();
          clonedMaterial.transparent = true;
          clonedMaterial.opacity = 0;
          clonedMaterial.depthWrite = false;
          return clonedMaterial;
        });
        mesh.material = Array.isArray(mesh.material) ? hiddenMaterials : hiddenMaterials[0];
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });
    return clonedScene;
  }, [gltf.scene]);

  return (
    <RigidBody type='fixed' colliders='trimesh'>
      <primitive
        object={scene}
        position={toVector3(collision.position, [0, 0, 0])}
        rotation={toVector3(collision.rotation, [0, 0, 0])}
        scale={toScale(collision.scale)}
      />
    </RigidBody>
  );
}

export default function GenericSceneAsset({ resolvedPlacement }: GenericSceneAssetProps) {
  const { t } = useTranslation();
  const [attempt, setAttempt] = useState(0);
  const { placement, asset, collision } = resolvedPlacement;
  const position = toVector3(placement.position, [0, 0, 0]);
  const rotation = toVector3(placement.rotation, [0, 0, 0]);
  const scale = toScale(placement.scale);

  useEffect(() => {
    if (!asset?.url) {
      console.error(`[GenericSceneAsset] Missing scene asset or URL for assetId: ${placement.assetId}`);
    }
  }, [asset?.url, placement.assetId]);

  if (!asset?.url) {
    return <SceneAssetStatus message={t('sceneAsset.missing')} />;
  }

  const retry = () => {
    useGLTF.clear(asset.url);
    if (collision?.url) useGLTF.clear(collision.url);
    setAttempt((current) => current + 1);
  };

  return (
    <ModelErrorBoundary
      resetKey={`${asset.url}:${attempt}`}
      onError={(error) => console.error(`[GenericSceneAsset] Failed to load asset ${placement.assetId}`, error)}
      onRetry={retry}
      fallback={(_error, retryBoundary) => (
        <group position={position}>
          <SceneAssetStatus message={t('sceneAsset.loadError')} retry={retryBoundary} />
        </group>
      )}>
      <Suspense fallback={null}>
        <ModelReveal>
          <group position={position} rotation={rotation} scale={scale}>
            <LoadedVisual asset={asset} />
          </group>
        </ModelReveal>
        {collision && <LoadedCollision collision={collision} />}
      </Suspense>
    </ModelErrorBoundary>
  );
}
