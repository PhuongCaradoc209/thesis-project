import { useSceneData } from '../../hooks/useScenes';
import DynamicPlacement from './DynamicPlacement';

type DynamicSceneRendererProps = {
  sceneId: string;
};

export default function DynamicSceneRenderer({ sceneId }: DynamicSceneRendererProps) {
  const { data, isLoading, isError } = useSceneData(sceneId);

  if (isLoading || isError || !data?.resolvedPlacements) {
    return null;
  }

  return (
    <>
      {data.resolvedPlacements.map((resolvedPlacement) => (
        <DynamicPlacement key={resolvedPlacement.placement.placementId} resolvedPlacement={resolvedPlacement} />
      ))}
    </>
  );
}
