import { useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useCallback, useRef } from 'react';
import * as THREE from 'three';

type FloorProps = {
  rotation?: [number, number, number];
  color?: string;
  position?: [number, number, number];
  args?: [number, number];
  textures?: string[];
};

const DEFAULT_TEXTURES = [
  '/tuduc/floor-1/PavingStones146_1K-JPG_Color.jpg',
  '/tuduc/floor-1/PavingStones146_1K-JPG_NormalGL.jpg',
  '/tuduc/floor-1/PavingStones146_1K-JPG_Roughness.jpg',
  '/tuduc/floor-1/PavingStones146_1K-JPG_AmbientOcclusion.jpg',
];

function Floor({
  rotation = [-Math.PI / 2, 0, 0],
  color = '#ffffff',
  position = [-0.2, -3.52, 0],
  args = [80, 30],
  textures = DEFAULT_TEXTURES,
}: FloorProps) {
  const ref = useRef<THREE.Mesh>(null!);

  const loadedTextures = useTexture(textures.length >= 3 ? textures : DEFAULT_TEXTURES);
  const [colorMap, normalMap, roughnessMap, aoMap] = Array.isArray(loadedTextures) ? loadedTextures : [loadedTextures];

  colorMap.colorSpace = THREE.SRGBColorSpace;

  [colorMap, normalMap, roughnessMap, aoMap].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
  });

  const handleGeometry = useCallback((geometry: THREE.BufferGeometry | null) => {
    if (geometry && !geometry.attributes.uv2) {
      geometry.setAttribute('uv2', geometry.attributes.uv.clone());
    }
  }, []);

  return (
    <RigidBody type='fixed'>
      <mesh ref={ref} position={position} receiveShadow rotation={rotation}>
        <planeGeometry ref={handleGeometry} args={args} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          aoMap={aoMap}
          color={color}
          normalScale={new THREE.Vector2(1.5, 1.5)}
        />
      </mesh>
    </RigidBody>
  );
}

export default Floor;
