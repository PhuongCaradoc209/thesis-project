import { useQuery } from '@tanstack/react-query';
import { getArtifactById } from '../api/artifact/artifacts.api';

export const useArtifactData = (artifactId: string | null) => {
  return useQuery({
    queryKey: ['artifact', artifactId],
    queryFn: async () => {
      if (!artifactId) return null;
      return getArtifactById(artifactId);
    },
    enabled: !!artifactId,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};
