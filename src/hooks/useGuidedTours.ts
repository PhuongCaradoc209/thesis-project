import { useQuery } from '@tanstack/react-query';
import { getGuidedToursByScene } from '../api/guided-tour/guidedTours.api';

export const useGuidedTours = (sceneId: string | null) =>
  useQuery({
    queryKey: ['guided-tours', sceneId],
    queryFn: () => getGuidedToursByScene(sceneId!),
    enabled: Boolean(sceneId),
    staleTime: 5 * 60 * 1000,
  });
