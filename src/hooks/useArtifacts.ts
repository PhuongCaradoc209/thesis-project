import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getArtifactById, getArtifactsByScene } from '../api/artifact/artifacts.api';

export const useArtifactData = (artifactId: string | null) => {
  return useQuery({
    queryKey: ['artifact', artifactId],
    queryFn: async () => {
      if (!artifactId) return null;
      return getArtifactById(artifactId);
    },
    enabled: !!artifactId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGalleryArtifacts = (sceneId: string, enabled = true) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['gallery-artifacts', sceneId],
    queryFn: async () => {
      const artifacts = await getArtifactsByScene(sceneId);
      artifacts.forEach((artifact) => queryClient.setQueryData(['artifact', artifact.artifactId], artifact));
      return artifacts;
    },
    enabled,
    staleTime: 10 * 60 * 1000,
  });
};
