import { useQuery } from '@tanstack/react-query';
import {
  getSceneById,
  getScenePlacements,
  getTeleportPoints,
  getInteractionPointsByPlacements,
} from '../api/scenes/scenes.api';

export const useSceneData = (sceneId: string | null) => {
  return useQuery({
    queryKey: ['scene', sceneId],
    queryFn: async () => {
      if (!sceneId) throw new Error('Scene ID is required');

      // Fetch scene config first or in parallel if it doesn't depend on placements
      // Let's do parallel for the root endpoints
      const [scene, placements, teleportPoints] = await Promise.all([
        getSceneById(sceneId),
        getScenePlacements(sceneId),
        getTeleportPoints(sceneId),
      ]);

      if (!scene) {
        throw new Error(`Scene not found for id: ${sceneId}`);
      }

      // Extract placement IDs for the interaction points query
      const placementIds = placements.map((p) => p.placementId);

      // Fetch interaction points based on the chunked queries
      const interactionPoints = await getInteractionPointsByPlacements(placementIds);

      return {
        scene,
        placements,
        interactionPoints,
        teleportPoints,
      };
    },
    enabled: !!sceneId,
    staleTime: 5 * 60 * 1000, // Keep fresh for 5 minutes
  });
};
