import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';

const SKY_RADIUS = 950;
export const SKY_HDR_URL = '/common/image/citrus_orchard_puresky_1k.hdr';

export function AnimateSky() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const textureRef = useRef<THREE.Texture>(null);
  const sourceTexture = useLoader(RGBELoader, SKY_HDR_URL, (loader) => {
    loader.setDataType(THREE.FloatType);
  });

  // <Environment> trong Lights nạp cùng file và nhận cùng object từ cache của useLoader.
  // Bản clone giữ UVMapping + offset trôi riêng cho bầu trời, không đè mapping equirect của IBL.
  const hdrTexture = useMemo(() => {
    const texture = sourceTexture.clone();
    texture.generateMipmaps = false; // Tắt tự động tạo các bản sao nhòe
    texture.minFilter = THREE.LinearFilter; // Tắt bộ lọc chống răng cưa khi thu nhỏ
    texture.magFilter = THREE.LinearFilter;
    texture.mapping = THREE.UVMapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [sourceTexture]);

  useEffect(() => {
    textureRef.current = hdrTexture;
    return () => hdrTexture.dispose();
  }, [hdrTexture]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.copy(state.camera.position);
    }

    if (textureRef.current) {
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
