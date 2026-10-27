import { CuboidCollider } from '@react-three/rapier';
import { useTiledTextures, type TextureUrls } from '../../../hooks/useTiledTextures';
import { PEDESTAL_HEIGHT } from './roomLayout';

const WIDTH = 0.8;
const HEIGHT = PEDESTAL_HEIGHT;

const PEDESTAL_TEXTURES: TextureUrls = {
  map: '/scenes/gallery/pedestal/Wood027_1K-JPG_Color.jpg',
  normalMap: '/scenes/gallery/pedestal/Wood027_1K-JPG_NormalGL.jpg',
  roughnessMap: '/scenes/gallery/pedestal/Wood027_1K-JPG_Roughness.jpg',
};

export function Pedestal({ position }: { position: [number, number, number] }) {
  const material = useTiledTextures(PEDESTAL_TEXTURES, 1, 1);

  return (
    <group position={position}>
      <mesh position={[0, HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[WIDTH, HEIGHT, WIDTH]} />
        <meshStandardMaterial {...material} />
      </mesh>
      <CuboidCollider args={[WIDTH / 2, HEIGHT / 2, WIDTH / 2]} position={[0, HEIGHT / 2, 0]} />
    </group>
  );
}
