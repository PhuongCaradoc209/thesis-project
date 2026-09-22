import { useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResolvedScenePlacement } from '../../types/scene.types';
import GenericSceneAsset, { SceneAssetStatus } from './GenericSceneAsset';
import { ModelErrorBoundary } from './ModelErrorBoundary';
import ModelReveal from './ModelReveal';
import { CUSTOM_MODEL_RENDERERS } from './models/ModelRegistry';

type DynamicPlacementProps = {
  resolvedPlacement: ResolvedScenePlacement;
};

export default function DynamicPlacement({ resolvedPlacement }: DynamicPlacementProps) {
  const { t } = useTranslation();
  const { placement, asset, collision } = resolvedPlacement;
  const rendererKey = asset?.rendererKey || placement.assetId;
  const Component = CUSTOM_MODEL_RENDERERS[rendererKey];

  if (!asset?.url || !Component) {
    return <GenericSceneAsset resolvedPlacement={resolvedPlacement} />;
  }

  const { position, rotation, scale } = placement;
  const positionProp = (position?.length === 3 ? position : [0, 0, 0]) as [number, number, number];
  const rotationProp = (rotation?.length === 3 ? rotation : [0, 0, 0]) as [number, number, number];

  const ComponentToRender = Component as any;

  return (
    <ModelErrorBoundary
      resetKey={rendererKey}
      onError={(error) => console.error(`[DynamicPlacement] Custom renderer failed for asset ${placement.assetId}`, error)}
      onRetry={() => {
        if (asset?.url) useGLTF.clear(asset.url);
        if (collision?.url) useGLTF.clear(collision.url);
      }}
      fallback={(_error, retry) => (
        <group position={positionProp}>
          <SceneAssetStatus message={t('sceneAsset.loadError')} retry={retry} />
        </group>
      )}>
      <Suspense fallback={null}>
        <ModelReveal>
          <ComponentToRender
            position={positionProp}
            rotation={rotationProp}
            scale={scale}
            asset={asset}
            collision={collision}
            placement={placement}
            loadingLabel={t('sceneAsset.loading')}
          />
        </ModelReveal>
      </Suspense>
    </ModelErrorBoundary>
  );
}
