import { useQuery } from '@tanstack/react-query';
import { getInteractionPointsByPlacements, getSceneById, getScenePlacements, getTeleportPoints } from '../api/scenes/scenes.api';

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

      const interactionPoints = await getInteractionPointsByPlacements(placementIds);

      return {
        scene,
        placements,
        interactionPoints,
        teleportPoints,
      };
    },
    enabled: !!sceneId,
    staleTime: 5 * 60 * 1000, 
  });
};
