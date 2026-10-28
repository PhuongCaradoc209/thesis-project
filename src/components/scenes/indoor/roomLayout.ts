export const ROOM_LENGTH = 16;
export const ROOM_HEIGHT = 4;
export const ROOM_WIDTH = 10;
export const WALL_THICKNESS = 0.2;

export const CORRIDOR_EDGE_Z = -2;
export const PARTITION_XS = [-2.7, 2.7];

export const BAY_CENTER_XS = [-5.4, 0, 5.4];

export const SPOT_XS = [-6.6, -4.1, -1.3, 1.3, 4.1, 6.6];

export const PEDESTAL_Z = 2;
export const PEDESTAL_HEIGHT = 1;

export const WALL_SLOT_XS = [-6, -2, 2, 6];
export const PAINTING_Y = 1.6;
export const PAINTING_Z = -ROOM_WIDTH / 2 + 0.01;

type Vec3 = [number, number, number];

export function getViewpoint(isPainting: boolean, spot: number): { position: Vec3; lookAt: Vec3 } {
  if (isPainting) {
    const x = WALL_SLOT_XS[spot];
    return { position: [x, 1, PAINTING_Z + 2], lookAt: [x, PAINTING_Y, PAINTING_Z] };
  }
  const x = SPOT_XS[spot];
  return { position: [x, 1, PEDESTAL_Z - 1.8], lookAt: [x, PEDESTAL_HEIGHT + 0.4, PEDESTAL_Z] };
}
