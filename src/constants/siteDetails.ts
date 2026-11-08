import BrownJarImage from '../assets/home/brownjar.jpg';
import DrumImage from '../assets/home/drum.jpg';
import EwerImage from '../assets/home/ewer.jpg';
import GalleryCeramicsImage from '../assets/home/gallery-ceramics.jpg';
import JarImage from '../assets/home/jar.jpg';
import NgheImage from '../assets/home/nghe.jpg';
import TuDucBiDinhImage from '../assets/home/tuduc-bidinh.jpg';
import VaseImage from '../assets/home/vase.jpg';
import type { MarkerData } from '../types/marker';
import { PHOTO_CREDITS, type AssetCredit } from './credits';

export const ARTIFACT_COUNT = 8;

export type SiteDetail = {
  image: string;
  imagePosition?: string;
  credit: AssetCredit;
  countKey: 'stops' | 'artifacts';
  count: number;
  minutes?: number;
};

export const SITE_DETAILS: Record<string, SiteDetail> = {
  'tu-duc': {
    image: TuDucBiDinhImage,
    imagePosition: '38% 50%',
    credit: PHOTO_CREDITS.tuDucBiDinh,
    countKey: 'stops',
    count: 5,
    minutes: 5,
  },
  gallery: {
    image: GalleryCeramicsImage,
    credit: PHOTO_CREDITS.ceramics,
    countKey: 'artifacts',
    count: ARTIFACT_COUNT,
  },
};

export const GALLERY_ITEMS = [
  { key: 'drum', img: DrumImage, credit: PHOTO_CREDITS.drum },
  { key: 'nghe', img: NgheImage, credit: PHOTO_CREDITS.nghe },
  { key: 'vase', img: VaseImage, credit: PHOTO_CREDITS.vase },
  { key: 'jar', img: JarImage, credit: PHOTO_CREDITS.jar },
  { key: 'ewer', img: EwerImage, credit: PHOTO_CREDITS.ewer },
  { key: 'brownJar', img: BrownJarImage, credit: PHOTO_CREDITS.brownJar },
];

export const formatCoords = (marker: MarkerData) => `${marker.latitude.toFixed(2)}°N ${marker.longitude.toFixed(2)}°E`;

export const formatTicketNumber = (index: number) => String(index + 1).padStart(3, '0');
