import FansipanImage from '../assets/home/fansipan.jpg';
import HoiAnImage from '../assets/home/hoian.jpg';
import HueImage from '../assets/home/hue.jpg';
import TrangAnImage from '../assets/home/trangan.jpg';
import { PHOTO_CREDITS, type AssetCredit } from './credits';

export type ComingSoonSite = {
  key: string;
  no: string;
  img: string;
  credit: AssetCredit;
};

export const COMING_SOON_SITES: ComingSoonSite[] = [
  { key: 'hue', no: '003', img: HueImage, credit: PHOTO_CREDITS.hue },
  { key: 'hoiAn', no: '004', img: HoiAnImage, credit: PHOTO_CREDITS.hoiAn },
  { key: 'fansipan', no: '005', img: FansipanImage, credit: PHOTO_CREDITS.fansipan },
  { key: 'trangAn', no: '006', img: TrangAnImage, credit: PHOTO_CREDITS.trangAn },
];
