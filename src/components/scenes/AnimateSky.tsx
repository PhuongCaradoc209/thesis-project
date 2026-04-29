import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';

const SKY_RADIUS = 950;

export function AnimateSky() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const textureRef = useRef<THREE.Texture>(null);
  const hdrTexture = useLoader(RGBELoader, '/common/image/citrus_orchard_puresky_1k.hdr', (loader) => {
    loader.setDataType(THREE.FloatType); // Ép dùng bộ nhớ lớn để chống tràn
  });

  hdrTexture.generateMipmaps = false; // Tắt tự động tạo các bản sao nhòe
  hdrTexture.minFilter = THREE.LinearFilter; // Tắt bộ lọc chống răng cưa khi thu nhỏ
  hdrTexture.magFilter = THREE.LinearFilter;
  hdrTexture.mapping = THREE.UVMapping;

  hdrTexture.wrapS = THREE.RepeatWrapping;
  hdrTexture.wrapT = THREE.ClampToEdgeWrapping;

  useEffect(() => {
    textureRef.current = hdrTexture;
  }, [hdrTexture]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.copy(state.camera.position);
    }

    if (textureRef.current) {
      // Số 0.005 là tốc độ trôi. Có thể tăng lên 0.01 nếu mây trôi quá chậm
      textureRef.current.offset.x += delta * 0.005;
    }
  });

  return (
    <mesh ref={meshRef} frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[SKY_RADIUS, 64, 64]} />

      <meshBasicMaterial map={hdrTexture} side={THREE.BackSide} fog={false} depthWrite={false} depthTest={false} />
    </mesh>
  );
}
