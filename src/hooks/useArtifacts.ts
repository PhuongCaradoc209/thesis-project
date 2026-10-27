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
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};

// Hiện vật của phòng trưng bày. Lưu luôn từng hiện vật vào cache của useArtifactData,
// để nút F và modal dùng lại, không phải đọc Firestore thêm lần nữa.
export const useGalleryArtifacts = (sceneId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['gallery-artifacts', sceneId],
    queryFn: async () => {
      const artifacts = await getArtifactsByScene(sceneId);
      artifacts.forEach((artifact) => queryClient.setQueryData(['artifact', artifact.artifactId], artifact));
      return artifacts;
    },
    staleTime: 10 * 60 * 1000,
  });
};
