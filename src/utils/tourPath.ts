import { NAV_PATH } from '../router/paths';
import type { MarkerData } from '../types/marker';

export const getTourPath = (marker: MarkerData) => NAV_PATH.TOUR.replace(':sceneId', marker.sceneId);
