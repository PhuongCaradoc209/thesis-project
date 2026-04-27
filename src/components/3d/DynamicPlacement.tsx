import { Suspense } from 'react';
import type { ScenePlacement } from '../../types/scene.types';
import { MODEL_REGISTRY } from './models/ModelRegistry';

type DynamicPlacementProps = {
  placement: ScenePlacement;
};

export default function DynamicPlacement({ placement }: DynamicPlacementProps) {
  const Component = MODEL_REGISTRY[placement.assetId];

  if (!Component) {
    console.warn(`[DynamicPlacement] Model not found in registry for assetId: ${placement.assetId}`);
    return null;
  }

  const { position, rotation, scale } = placement;
  const positionProp = position as [number, number, number];
  const rotationProp = rotation as [number, number, number];

  const ComponentToRender = Component as any;

  console.log(position);

  return (
    <Suspense fallback={null}>
      <ComponentToRender position={positionProp} rotation={rotationProp} scale={scale} />
    </Suspense>
  );
}
