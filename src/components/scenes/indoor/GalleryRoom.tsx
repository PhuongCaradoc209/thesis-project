import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useTiledTextures, type TextureUrls } from '../../../hooks/useTiledTextures';
import { CORRIDOR_EDGE_Z, PARTITION_XS, ROOM_HEIGHT, ROOM_LENGTH, ROOM_WIDTH, WALL_THICKNESS } from './roomLayout';

const FLOOR_TEXTURES: TextureUrls = {
  map: '/scenes/gallery/floor/terracotta_floor_tiles_diff_1k.jpg',
  normalMap: '/scenes/gallery/floor/terracotta_floor_tiles_nor_gl_1k.jpg',
  roughnessMap: '/scenes/gallery/floor/terracotta_floor_tiles_rough_1k.jpg',
};

const WALL_TEXTURES: TextureUrls = {
  map: '/scenes/gallery/wall/Plaster001_1K-JPG_Color.jpg',
  normalMap: '/scenes/gallery/wall/Plaster001_1K-JPG_NormalGL.jpg',
  roughnessMap: '/scenes/gallery/wall/Plaster001_1K-JPG_Roughness.jpg',
};

const FLOOR_TILE_SIZE = 4;
const WALL_TILE_SIZE = 2.5;

type WallProps = {
  position: [number, number, number];
  size: [number, number, number];
  textures: TextureUrls;
  tileSize: number;
  color?: string;
  skirting?: boolean;
};

function Wall({ position, size, textures, tileSize, color = '#ffffff', skirting }: WallProps) {
  const [longSide, shortSide] = [...size].sort((a, b) => b - a);
  const material = useTiledTextures(textures, longSide / tileSize, shortSide / tileSize);

  return (
    <>
      <mesh position={position} receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial {...material} color={color} />
      </mesh>
      <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} position={position} />
      {skirting && <Skirting position={position} size={size} />}
    </>
  );
}

const SKIRTING_HEIGHT = 0.12;
const SKIRTING_DEPTH = 0.04;
const SKIRTING_COLOR = '#2b1a12';
function Skirting({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  const [x, , z] = position;
  const [sizeX, , sizeZ] = size;
  const width = sizeX + 2 * SKIRTING_DEPTH;
  const depth = sizeZ + 2 * SKIRTING_DEPTH;

  return (
    <mesh position={[x, SKIRTING_HEIGHT / 2, z]}>
      <boxGeometry args={[width, SKIRTING_HEIGHT, depth]} />
      <meshStandardMaterial color={SKIRTING_COLOR} roughness={0.4} />
    </mesh>
  );
}

export function GalleryRoom() {
  const L = ROOM_LENGTH;
  const H = ROOM_HEIGHT;
  const W = ROOM_WIDTH;
  const T = WALL_THICKNESS;
  const partitionLength = W / 2 - CORRIDOR_EDGE_Z;
  const wall = { textures: WALL_TEXTURES, tileSize: WALL_TILE_SIZE, color: '#e8cf9c' };

  return (
    <RigidBody type='fixed' colliders={false}>
      <Wall position={[0, -T / 2, 0]} size={[L + 2 * T, T, W + 2 * T]} textures={FLOOR_TEXTURES} tileSize={FLOOR_TILE_SIZE} />
      <Wall position={[0, H + T / 2, 0]} size={[L + 2 * T, T, W + 2 * T]} {...wall} />

      <Wall position={[0, H / 2, -(W + T) / 2]} size={[L, H, T]} {...wall} skirting />
      <Wall position={[0, H / 2, (W + T) / 2]} size={[L, H, T]} {...wall} skirting />
      <Wall position={[-(L + T) / 2, H / 2, 0]} size={[T, H, W]} {...wall} skirting />
      <Wall position={[(L + T) / 2, H / 2, 0]} size={[T, H, W]} {...wall} skirting />

      {PARTITION_XS.map((x) => (
        <Wall
          key={x}
          position={[x, H / 2, CORRIDOR_EDGE_Z + partitionLength / 2]}
          size={[T, H, partitionLength]}
          {...wall}
          skirting
        />
      ))}
    </RigidBody>
  );
}
