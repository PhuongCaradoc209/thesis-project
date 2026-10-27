import { useQuery } from '@tanstack/react-query';
import {
  getCollisionModelsByIds,
  getInteractionPointsByPlacements,
  getSceneAssetsByIds,
  getSceneById,
  getScenePlacements,
  getTeleportPoints,
} from '../api/scenes/scenes.api';
import { SCENE_IDS } from '../constants/markers';
import type { ResolvedScenePlacement, Scene } from '../types/scene.types';

// Cấu hình tạm để xem phòng khi chưa tạo document trên Firestore. Không dùng ở bản build.
const DEV_FALLBACK_SCENES: Record<string, Scene> = {
  [SCENE_IDS.GALLERY]: {
    sceneId: SCENE_IDS.GALLERY,
    layout: 'indoor',
    playerConfig: { position: [-7, 1, -3.5] },
  },
};

export const useSceneData = (sceneId: string | null) => {
  return useQuery({
    queryKey: ['scene', sceneId],
    queryFn: async () => {
      if (!sceneId) throw new Error('Scene ID is required');

      const [firestoreScene, placements, teleportPoints] = await Promise.all([
        getSceneById(sceneId),
        getScenePlacements(sceneId),
        getTeleportPoints(sceneId),
      ]);
      // Chỉ khi dev: xem trước phòng trưng bày khi Firestore chưa có document
      const scene = firestoreScene ?? (import.meta.env.DEV ? (DEV_FALLBACK_SCENES[sceneId] ?? null) : null);

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
