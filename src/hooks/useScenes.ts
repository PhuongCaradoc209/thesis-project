import { useQuery } from '@tanstack/react-query';
import {
  getCollisionModelsByIds,
  getInteractionPointsByPlacements,
  getSceneAssetsByIds,
  getSceneById,
  getScenePlacements,
  getTeleportPoints,
} from '../api/scenes/scenes.api';
import type { ResolvedScenePlacement } from '../types/scene.types';

export const useSceneData = (sceneId: string | null) => {
  return useQuery({
    queryKey: ['scene', sceneId],
    queryFn: async () => {
      if (!sceneId) throw new Error('Scene ID is required');

      const [scene, placements, teleportPoints] = await Promise.all([
        getSceneById(sceneId),
        getScenePlacements(sceneId),
        getTeleportPoints(sceneId),
      ]);

      if (!scene) {
        throw new Error(`Scene not found for id: ${sceneId}`);
      }

      const placementIds = placements.map((p) => p.placementId);
      const assetIds = placements.map((placement) => placement.assetId);
      const [interactionPoints, assets] = await Promise.all([
        getInteractionPointsByPlacements(placementIds),
        getSceneAssetsByIds(assetIds),
      ]);

      const collisionIds = assets.flatMap((asset) => (asset.collisionId ? [asset.collisionId] : []));
      const collisions = await getCollisionModelsByIds(collisionIds);
      const assetsById = new Map(assets.map((asset) => [asset.assetId, asset]));
      const collisionsById = new Map(collisions.map((collision) => [collision.collisionId, collision]));
      const resolvedPlacements: ResolvedScenePlacement[] = placements.map((placement) => {
        const asset = assetsById.get(placement.assetId) ?? null;
        const collision = asset?.collisionId ? (collisionsById.get(asset.collisionId) ?? null) : null;

        return { placement, asset, collision };
      });

      return {
        scene,
        placements,
        resolvedPlacements,
        interactionPoints,
        teleportPoints,
      };
    },
    enabled: !!sceneId,
    staleTime: 5 * 60 * 1000,
  });
};
