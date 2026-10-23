import DenHung from '@/assets/scenes/denhung/DenHung.jpg';
import TuDuc from '@/assets/scenes/tuduc/TuDuc.jpg';
import TuDucLoading from '@/assets/scenes/tuduc/TuDucLoading.jpg';
import type { MarkerData } from '../types/marker';

export const SCENE_IDS = {
  TU_DUC: 'DvuvR5oMnH9hwief9pqn',
  DEN_HUNG: 'lo1jCATp6QcaQFFAUz6G',
} as const;

export const MARKER_DATA: MarkerData[] = [
  {
    id: 'tu-duc',
    latitude: 16.4326,
    longitude: 107.5656,
    thumbnail: TuDuc,
    loadingBackground: TuDucLoading,
    sceneId: SCENE_IDS.TU_DUC,
    nameKey: 'sites.tuDuc.name',
    descriptionKey: 'sites.tuDuc.description',
  },
  {
    id: 'den-hung',
    latitude: 10.0663,
    longitude: 105.7337,
    thumbnail: DenHung,
    sceneId: SCENE_IDS.DEN_HUNG,
    nameKey: 'sites.denHung.name',
    descriptionKey: 'sites.denHung.description',
  },
];
