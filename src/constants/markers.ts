import DenHung from '@/assets/scenes/denhung/DenHung.jpg';
import TuDuc from '@/assets/scenes/tuduc/TuDuc.jpg';
import type { MarkerData } from '../types/marker';

export const MARKER_DATA: MarkerData[] = [
  {
    id: 'tu-duc',
    latitude: 16.4326,
    longitude: 107.5656,
    thumbnail: TuDuc,
    sceneId: 'DvuvR5oMnH9hwief9pqn',
    nameKey: 'sites.tuDuc.name',
    descriptionKey: 'sites.tuDuc.description',
  },
  {
    id: 'den-hung',
    latitude: 10.0663,
    longitude: 105.7337,
    thumbnail: DenHung,
    sceneId: 'lo1jCATp6QcaQFFAUz6G',
    nameKey: 'sites.denHung.name',
    descriptionKey: 'sites.denHung.description',
  },
];
