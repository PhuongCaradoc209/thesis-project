import { useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useCallback, useRef } from 'react';
import * as THREE from 'three';

type FloorProps = {
  rotation?: [number, number, number];
  position?: [number, number, number];
  args?: [number, number];
};

export function SplatFloor({ rotation = [-Math.PI / 2, 0, 0], position = [-0.2, -3.52, 0], args = [80, 30] }: FloorProps) {
  const ref = useRef<THREE.Mesh>(null!);

  // 1. Nạp TẤT CẢ các map của Cỏ và Gạch + 1 ảnh Mask
  const [grassColor, grassNormal, grassRough, brickColor, brickNormal, brickRough, maskMap] = useTexture([
    '/scenes/tuduc/grass/Grass006_1K-JPG_Color.jpg',
    '/scenes/tuduc/grass/Grass006_1K-JPG_NormalGL.jpg',
    '/scenes/tuduc/grass/Grass006_1K-JPG_Roughness.jpg',
    '/scenes/tuduc/floor/PavingStones146_1K-JPG_Color.jpg',
    '/scenes/tuduc/floor/PavingStones146_1K-JPG_NormalGL.jpg',
    '/scenes/tuduc/floor/PavingStones146_1K-JPG_Roughness.jpg',
    '/scenes/tuduc/grass/image.png', // Ảnh trắng đen
  ]);

  // Cài đặt hệ màu sRGB cho Color Map
  grassColor.colorSpace = THREE.SRGBColorSpace;
  brickColor.colorSpace = THREE.SRGBColorSpace;

  // Lặp vân (Repeat) cho tất cả các map của Cỏ và Gạch
  [grassColor, grassNormal, grassRough, brickColor, brickNormal, brickRough].forEach((tex) => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(15, 5);
  });

  // Mask KHÔNG lặp, kéo giãn vừa bằng cái sàn
  maskMap.wrapS = THREE.ClampToEdgeWrapping;
  maskMap.wrapT = THREE.ClampToEdgeWrapping;

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
          map={grassColor}
          normalMap={grassNormal}
          roughnessMap={grassRough}
          onBeforeCompile={(shader) => {
            // Three r170+ có thể compile shader dưới GLSL3 (WebGL2).
            // GLSL3 không hỗ trợ texture2D(), nên thêm macro tương thích.
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `
              #include <common>
              #if defined( GL_ES ) && (__VERSION__ >= 300)
              #define texture2D texture
              #endif
              `,
            );

            // --- BƯỚC 1: Đẩy dữ liệu Gạch và Mask vào GPU ---
            shader.uniforms.tBrickColor = { value: brickColor };
            shader.uniforms.tBrickNormal = { value: brickNormal };
            shader.uniforms.tBrickRough = { value: brickRough };
            shader.uniforms.tMask = { value: maskMap };

            // Khai báo các biến uniform trong code GLSL
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_pars_fragment>',
              `
              #include <map_pars_fragment>
              uniform sampler2D tBrickColor;
              uniform sampler2D tBrickNormal;
              uniform sampler2D tBrickRough;
              uniform sampler2D tMask;
              `,
            );

            // --- BƯỚC 2: Trộn Màu (Color/Diffuse) ---
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `
              #ifdef USE_MAP
                vec4 gColor = texture2D(map, vMapUv); // map là grassColor
                vec4 bColor = texture2D(tBrickColor, vMapUv);
                vec2 maskUv = vMapUv / vec2(15.0, 5.0);
                float splatMaskColor = texture2D(tMask, maskUv).r; // 0=Đen (Cỏ), 1=Trắng (Gạch)
                
                vec4 mixedColor = mix(gColor, bColor, splatMaskColor);
                diffuseColor *= mixedColor;
              #endif
              `,
            );

            // --- BƯỚC 3: Trộn Độ nhám (Roughness) ---
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <roughnessmap_fragment>',
              `
              float roughnessFactor = roughness;
              #ifdef USE_ROUGHNESSMAP
                vec4 gRough = texture2D(roughnessMap, vRoughnessMapUv);
                vec4 bRough = texture2D(tBrickRough, vRoughnessMapUv);
                float splatMaskRough = texture2D(tMask, vRoughnessMapUv).r;
                
                // Trộn 2 ảnh nhám lại với nhau
                vec4 mixedRough = mix(gRough, bRough, splatMaskRough);
                
                // Three.js lấy kênh màu xanh lá (g) làm chuẩn cho Roughness
                roughnessFactor *= mixedRough.g;
              #endif
              `,
            );

            // --- BƯỚC 4: Trộn Lồi lõm (Normal) ---
            // Không override cả chunk nữa (Three r170 không dùng perturbNormal2Arb trong shader chunks).
            // Chỉ thay đúng dòng sample normal map để giữ nguyên logic normalScale/tbn của Three.js.
            shader.fragmentShader = shader.fragmentShader.replace(
              'normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals',
              `
              vec3 gNormalSample = texture2D( normalMap, vNormalMapUv ).xyz;
              vec3 bNormalSample = texture2D( tBrickNormal, vNormalMapUv ).xyz;
              float splatMaskNormal = texture2D( tMask, vNormalMapUv ).r;
              normal = mix( gNormalSample, bNormalSample, splatMaskNormal ) * 2.0 - 1.0; // overrides both flatShading and attribute normals
              `,
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
              `
              vec3 gNormalSample = texture2D( normalMap, vNormalMapUv ).xyz;
              vec3 bNormalSample = texture2D( tBrickNormal, vNormalMapUv ).xyz;
              float splatMaskNormal = texture2D( tMask, vNormalMapUv ).r;
              vec3 mapN = mix( gNormalSample, bNormalSample, splatMaskNormal ) * 2.0 - 1.0;
              `,
            );
          }}
        />
      </mesh>
    </RigidBody>
  );
}
