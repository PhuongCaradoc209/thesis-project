import DenHung from '@/assets/scenes/denhung/DenHung.jpg';
import TuDuc from '@/assets/scenes/tuduc/TuDuc.jpg';
import TuDucLoading from '@/assets/scenes/tuduc/TuDucLoading.jpg';
import type { MarkerData } from '../types/marker';

export const SCENE_IDS = {
  TU_DUC: 'DvuvR5oMnH9hwief9pqn',
  // Giữ id cũ để quay lại được; marker đã chuyển sang phòng trưng bày
  DEN_HUNG: 'lo1jCATp6QcaQFFAUz6G',
  GALLERY: 'vn-antiquities-gallery',
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
    id: 'gallery',
    // Bảo tàng Lịch sử Quốc gia, Hà Nội
    latitude: 21.0245,
    longitude: 105.8592,
    // TODO: thay bằng ảnh chụp phòng trưng bày khi đã có hiện vật
    thumbnail: DenHung,
    sceneId: SCENE_IDS.GALLERY,
    nameKey: 'sites.gallery.name',
    descriptionKey: 'sites.gallery.description',
  },
];
