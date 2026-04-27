import { useSceneData } from '../../hooks/useScenes';
import DynamicPlacement from './DynamicPlacement';

type DynamicSceneRendererProps = {
  sceneId: string;
};

export default function DynamicSceneRenderer({ sceneId }: DynamicSceneRendererProps) {
  const { data, isLoading, isError } = useSceneData(sceneId);

  if (isLoading || isError || !data?.placements) {
    return null;
  }

  return (
    <>
      {data.placements.map((placement) => (
        <DynamicPlacement key={placement.placementId} placement={placement} />
      ))}
    </>
  );
}
