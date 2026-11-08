import type { TFunction } from 'i18next';
import { MARKER_DATA } from '../constants/markers';

export type ScenePresentation = {
  sceneId: string;
  name: string;
  city: string;
  description: string;
  thumbnail: string;
  loadingBackground: string;
};

/**
 * Adapts today's static marker content to the shape consumed by scene UI.
 * A future Firestore heritage-sites source can return the same shape.
 */
export const getScenePresentation = (sceneId: string | null, t: TFunction): ScenePresentation | null => {
  if (!sceneId) return null;

  const marker = MARKER_DATA.find((item) => item.sceneId === sceneId);
  if (!marker) return null;

  return {
    sceneId,
    name: t(marker.nameKey),
    city: t(marker.nameKey.replace('.name', '.city')),
    description: t(marker.descriptionKey),
    thumbnail: marker.thumbnail,
    loadingBackground: marker.loadingBackground ?? marker.thumbnail,
  };
};
