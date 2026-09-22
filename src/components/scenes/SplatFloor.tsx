import { useTexture } from '@react-three/drei';
import { HeightfieldCollider, RigidBody } from '@react-three/rapier';
import { useCallback, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { FloorConfig } from '../../types/scene.types';

type SplatFloorProps = {
  config?: FloorConfig;
};

type LegacyFloorProps = {
  rotation: [number, number, number];
  position: [number, number, number];
  args: [number, number];
  textures?: string[];
  repeat: [number, number];
};

const DEFAULT_TEXTURES = [
  '/scenes/tuduc/grass/Grass001_1K-JPG_Color.jpg',
  '/scenes/tuduc/grass/Grass001_1K-JPG_NormalGL.jpg',
  '/scenes/tuduc/grass/Grass001_1K-JPG_Roughness.jpg',
  '/scenes/tuduc/floor/PavingStones146_1K-JPG_Color.jpg',
  '/scenes/tuduc/floor/PavingStones146_1K-JPG_NormalGL.jpg',
  '/scenes/tuduc/floor/PavingStones146_1K-JPG_Roughness.jpg',
  '/scenes/tuduc/terrain/splat-map.png',
];

const DEFAULT_POSITION: [number, number, number] = [-0.2, -3.52, 0];
const DEFAULT_ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0];
const DEFAULT_SIZE: [number, number] = [80, 30];
const DEFAULT_REPEAT: [number, number] = [15, 5];
const DEFAULT_SEGMENTS: [number, number] = [96, 96];

function asVector2(value: number[] | undefined, fallback: [number, number]): [number, number] {
  return value?.length === 2 ? [value[0], value[1]] : fallback;
}

function asVector3(value: number[] | undefined, fallback: [number, number, number]): [number, number, number] {
  return value?.length === 3 ? [value[0], value[1], value[2]] : fallback;
}

function configureRepeatedTexture(texture: THREE.Texture, repeat: [number, number], colorTexture = false) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.colorSpace = colorTexture ? THREE.SRGBColorSpace : THREE.NoColorSpace;
}

function createWhiteTexture() {
  const data = new Uint8Array([255, 255, 255, 255]);
  const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createTerrainGeometry(
  heightTexture: THREE.Texture,
  size: [number, number],
  segments: [number, number],
  heightScale: number,
  heightOffset: number,
) {
  const [segmentsX, segmentsZ] = segments;
  const image = heightTexture.image as HTMLImageElement;
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  const canvas = document.createElement('canvas');
  canvas.width = imageWidth;
  canvas.height = imageHeight;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Could not read the terrain height map.');

  context.drawImage(image, 0, 0, imageWidth, imageHeight);
  const pixels = context.getImageData(0, 0, imageWidth, imageHeight).data;
  const geometry = new THREE.PlaneGeometry(size[0], size[1], segmentsX, segmentsZ);
  const positions = geometry.getAttribute('position');
  const normalizedHeights = new Float32Array((segmentsX + 1) * (segmentsZ + 1));

  for (let row = 0; row <= segmentsZ; row += 1) {
    const pixelY = Math.round((row / segmentsZ) * (imageHeight - 1));

    for (let column = 0; column <= segmentsX; column += 1) {
      const pixelX = Math.round((column / segmentsX) * (imageWidth - 1));
      const pixelIndex = (pixelY * imageWidth + pixelX) * 4;
      const normalizedHeight = pixels[pixelIndex] / 255;
      const vertexIndex = row * (segmentsX + 1) + column;

      normalizedHeights[vertexIndex] = normalizedHeight;
      positions.setZ(vertexIndex, normalizedHeight * heightScale + heightOffset);
    }
  }

  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  // Rapier stores height matrices column-major: all Z rows for one X column.
  const colliderHeights = new Array<number>((segmentsX + 1) * (segmentsZ + 1));
  for (let column = 0; column <= segmentsX; column += 1) {
    for (let row = 0; row <= segmentsZ; row += 1) {
      colliderHeights[column * (segmentsZ + 1) + row] = normalizedHeights[row * (segmentsX + 1) + column];
    }
  }

  return { colliderHeights, geometry };
}

function TerrainFloor({ config }: { config: FloorConfig }) {
  const materials = config.materials!;
  const size = useMemo(() => asVector2(config.args, DEFAULT_SIZE), [config.args]);
  const position = useMemo(() => asVector3(config.position, DEFAULT_POSITION), [config.position]);
  const repeat = useMemo(() => asVector2(config.repeat, DEFAULT_REPEAT), [config.repeat]);
  const segments = useMemo<[number, number]>(() => {
    const requestedSegments = asVector2(config.segments, DEFAULT_SEGMENTS);
    return [Math.max(1, Math.round(requestedSegments[0])), Math.max(1, Math.round(requestedSegments[1]))];
  }, [config.segments]);
  const heightScale = config.heightScale ?? 0;
  const heightOffset = config.heightOffset ?? 0;

  const textureUrls = useMemo(() => {
    const urls: Record<string, string> = {
      grassColor: materials.grass.color,
      grassNormal: materials.grass.normal,
      grassRoughness: materials.grass.roughness,
      brickColor: materials.brick.color,
      brickNormal: materials.brick.normal,
      brickRoughness: materials.brick.roughness,
      dirtColor: materials.dirt.color,
      dirtNormal: materials.dirt.normal,
      dirtRoughness: materials.dirt.roughness,
      splatMap: config.splatMap!,
      heightMap: config.heightMap!,
    };

    if (materials.grass.ao) urls.grassAo = materials.grass.ao;
    if (materials.brick.ao) urls.brickAo = materials.brick.ao;
    if (materials.dirt.ao) urls.dirtAo = materials.dirt.ao;
    return urls;
  }, [config.heightMap, config.splatMap, materials]);

  const loaded = useTexture(textureUrls) as Record<string, THREE.Texture>;
  const whiteTexture = useMemo(createWhiteTexture, []);

  useEffect(() => () => whiteTexture.dispose(), [whiteTexture]);

  const grassAo = loaded.grassAo || whiteTexture;
  const brickAo = loaded.brickAo || whiteTexture;
  const dirtAo = loaded.dirtAo || whiteTexture;

  [
    loaded.grassColor,
    loaded.grassNormal,
    loaded.grassRoughness,
    grassAo,
    loaded.brickColor,
    loaded.brickNormal,
    loaded.brickRoughness,
    brickAo,
    loaded.dirtColor,
    loaded.dirtNormal,
    loaded.dirtRoughness,
    dirtAo,
  ].forEach((texture, index) => configureRepeatedTexture(texture, repeat, index === 0 || index === 4 || index === 8));

  loaded.splatMap.wrapS = THREE.ClampToEdgeWrapping;
  loaded.splatMap.wrapT = THREE.ClampToEdgeWrapping;
  loaded.splatMap.colorSpace = THREE.NoColorSpace;
  loaded.heightMap.wrapS = THREE.ClampToEdgeWrapping;
  loaded.heightMap.wrapT = THREE.ClampToEdgeWrapping;
  loaded.heightMap.colorSpace = THREE.NoColorSpace;

  const terrain = useMemo(
    () => createTerrainGeometry(loaded.heightMap, size, segments, heightScale, heightOffset),
    [heightOffset, heightScale, loaded.heightMap, segments, size],
  );

  useEffect(() => () => terrain.geometry.dispose(), [terrain.geometry]);

  const customizeShader = useCallback(
    (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.tBrickColor = { value: loaded.brickColor };
      shader.uniforms.tBrickNormal = { value: loaded.brickNormal };
      shader.uniforms.tBrickRoughness = { value: loaded.brickRoughness };
      shader.uniforms.tBrickAo = { value: brickAo };
      shader.uniforms.tDirtColor = { value: loaded.dirtColor };
      shader.uniforms.tDirtNormal = { value: loaded.dirtNormal };
      shader.uniforms.tDirtRoughness = { value: loaded.dirtRoughness };
      shader.uniforms.tDirtAo = { value: dirtAo };
      shader.uniforms.tSplatMap = { value: loaded.splatMap };
      shader.uniforms.uSplatRepeat = { value: new THREE.Vector2(repeat[0], repeat[1]) };

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        #if defined( GL_ES ) && (__VERSION__ >= 300)
        #define texture2D texture
        #endif

        uniform sampler2D tBrickColor;
        uniform sampler2D tBrickNormal;
        uniform sampler2D tBrickRoughness;
        uniform sampler2D tBrickAo;
        uniform sampler2D tDirtColor;
        uniform sampler2D tDirtNormal;
        uniform sampler2D tDirtRoughness;
        uniform sampler2D tDirtAo;
        uniform sampler2D tSplatMap;
        uniform vec2 uSplatRepeat;

        vec3 getSplatWeights(vec2 repeatedUv) {
          vec2 maskUv = repeatedUv / uSplatRepeat;
          vec2 paintedWeights = clamp(texture2D(tSplatMap, maskUv).rg, 0.0, 1.0);
          vec3 weights = vec3(max(1.0 - paintedWeights.r - paintedWeights.g, 0.0), paintedWeights.r, paintedWeights.g);
          return weights / max(weights.x + weights.y + weights.z, 0.0001);
        }
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        #ifdef USE_MAP
          vec3 splatWeightsColor = getSplatWeights(vMapUv);
          vec4 grassSample = texture2D(map, vMapUv);
          vec4 brickSample = texture2D(tBrickColor, vMapUv);
          vec4 dirtSample = texture2D(tDirtColor, vMapUv);
          diffuseColor *= grassSample * splatWeightsColor.x
            + brickSample * splatWeightsColor.y
            + dirtSample * splatWeightsColor.z;
        #endif
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <roughnessmap_fragment>',
        `
        float roughnessFactor = roughness;
        #ifdef USE_ROUGHNESSMAP
          vec3 splatWeightsRoughness = getSplatWeights(vRoughnessMapUv);
          float grassRoughness = texture2D(roughnessMap, vRoughnessMapUv).g;
          float brickRoughness = texture2D(tBrickRoughness, vRoughnessMapUv).g;
          float dirtRoughness = texture2D(tDirtRoughness, vRoughnessMapUv).g;
          roughnessFactor *= dot(
            vec3(grassRoughness, brickRoughness, dirtRoughness),
            splatWeightsRoughness
          );
        #endif
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
        `
        vec3 splatWeightsNormal = getSplatWeights(vNormalMapUv);
        vec3 grassNormalSample = texture2D(normalMap, vNormalMapUv).xyz;
        vec3 brickNormalSample = texture2D(tBrickNormal, vNormalMapUv).xyz;
        vec3 dirtNormalSample = texture2D(tDirtNormal, vNormalMapUv).xyz;
        vec3 mapN = (
          grassNormalSample * splatWeightsNormal.x
          + brickNormalSample * splatWeightsNormal.y
          + dirtNormalSample * splatWeightsNormal.z
        ) * 2.0 - 1.0;
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <aomap_fragment>',
        `
        #ifdef USE_AOMAP
          vec3 splatWeightsAo = getSplatWeights(vAoMapUv);
          float grassAoSample = texture2D(aoMap, vAoMapUv).r;
          float brickAoSample = texture2D(tBrickAo, vAoMapUv).r;
          float dirtAoSample = texture2D(tDirtAo, vAoMapUv).r;
          float mixedAo = dot(vec3(grassAoSample, brickAoSample, dirtAoSample), splatWeightsAo);
          float ambientOcclusion = (mixedAo - 1.0) * aoMapIntensity + 1.0;
          reflectedLight.indirectDiffuse *= ambientOcclusion;

          #if defined( USE_CLEARCOAT )
            clearcoatSpecularIndirect *= ambientOcclusion;
          #endif
          #if defined( USE_SHEEN )
            sheenSpecularIndirect *= ambientOcclusion;
          #endif
          #if defined( USE_ENVMAP ) && defined( STANDARD )
            float dotNV = saturate(dot(geometryNormal, geometryViewDir));
            reflectedLight.indirectSpecular *= computeSpecularOcclusion(dotNV, ambientOcclusion, material.roughness);
          #endif
        #endif
        `,
      );
    },
    [brickAo, dirtAo, loaded, repeat],
  );

  const collisionEnabled = config.collision?.enabled !== false;

  return (
    <RigidBody type='fixed' colliders={false} position={position}>
      <mesh geometry={terrain.geometry} receiveShadow>
        <meshStandardMaterial
          map={loaded.grassColor}
          normalMap={loaded.grassNormal}
          roughnessMap={loaded.grassRoughness}
          aoMap={grassAo}
          onBeforeCompile={customizeShader}
          customProgramCacheKey={() => 'three-layer-splat-terrain-v1'}
        />
      </mesh>
      {collisionEnabled && (
        <HeightfieldCollider
          args={[segments[1], segments[0], terrain.colliderHeights, { x: size[0], y: heightScale, z: size[1] }]}
          position={[0, heightOffset, 0]}
        />
      )}
    </RigidBody>
  );
}

function LegacySplatFloor({ rotation, position, args, textures, repeat }: LegacyFloorProps) {
  const mode: 'splat' | 'single' =
    textures?.length === 7 ? 'splat' : textures?.length && textures.length >= 3 ? 'single' : 'splat';
  const loaded = useTexture(mode === 'splat' ? (textures?.length === 7 ? textures : DEFAULT_TEXTURES) : textures!);
  const loadedArray = Array.isArray(loaded) ? loaded : [loaded];

  if (mode === 'single') {
    const [colorMap, normalMap, roughnessMap, aoMap] = loadedArray;
    [colorMap, normalMap, roughnessMap, aoMap]
      .filter((texture): texture is THREE.Texture => Boolean(texture))
      .forEach((texture, index) => configureRepeatedTexture(texture, repeat, index === 0));

    return (
      <RigidBody type='fixed'>
        <mesh position={position} receiveShadow rotation={rotation}>
          <planeGeometry args={args} />
          <meshStandardMaterial map={colorMap} normalMap={normalMap} roughnessMap={roughnessMap} aoMap={aoMap} />
        </mesh>
      </RigidBody>
    );
  }

  const [grassColor, grassNormal, grassRoughness, brickColor, brickNormal, brickRoughness, maskMap] =
    loadedArray as THREE.Texture[];

  [grassColor, grassNormal, grassRoughness, brickColor, brickNormal, brickRoughness].forEach((texture, index) =>
    configureRepeatedTexture(texture, repeat, index === 0 || index === 3),
  );
  maskMap.wrapS = THREE.ClampToEdgeWrapping;
  maskMap.wrapT = THREE.ClampToEdgeWrapping;
  maskMap.colorSpace = THREE.NoColorSpace;

  return (
    <RigidBody type='fixed'>
      <mesh position={position} receiveShadow rotation={rotation}>
        <planeGeometry args={args} />
        <meshStandardMaterial
          map={grassColor}
          normalMap={grassNormal}
          roughnessMap={grassRoughness}
          onBeforeCompile={(shader) => {
            shader.uniforms.tBrickColor = { value: brickColor };
            shader.uniforms.tBrickNormal = { value: brickNormal };
            shader.uniforms.tBrickRoughness = { value: brickRoughness };
            shader.uniforms.tMask = { value: maskMap };
            shader.uniforms.uSplatRepeat = { value: new THREE.Vector2(repeat[0], repeat[1]) };

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `
              #include <common>
              #if defined( GL_ES ) && (__VERSION__ >= 300)
              #define texture2D texture
              #endif
              uniform sampler2D tBrickColor;
              uniform sampler2D tBrickNormal;
              uniform sampler2D tBrickRoughness;
              uniform sampler2D tMask;
              uniform vec2 uSplatRepeat;
              `,
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `
              #ifdef USE_MAP
                vec4 legacyGrassColor = texture2D(map, vMapUv);
                vec4 legacyBrickColor = texture2D(tBrickColor, vMapUv);
                float legacyMaskColor = texture2D(tMask, vMapUv / uSplatRepeat).r;
                diffuseColor *= mix(legacyGrassColor, legacyBrickColor, legacyMaskColor);
              #endif
              `,
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <roughnessmap_fragment>',
              `
              float roughnessFactor = roughness;
              #ifdef USE_ROUGHNESSMAP
                float legacyMaskRoughness = texture2D(tMask, vRoughnessMapUv / uSplatRepeat).r;
                float legacyGrassRoughness = texture2D(roughnessMap, vRoughnessMapUv).g;
                float legacyBrickRoughness = texture2D(tBrickRoughness, vRoughnessMapUv).g;
                roughnessFactor *= mix(legacyGrassRoughness, legacyBrickRoughness, legacyMaskRoughness);
              #endif
              `,
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
              `
              float legacyMaskNormal = texture2D(tMask, vNormalMapUv / uSplatRepeat).r;
              vec3 legacyGrassNormal = texture2D(normalMap, vNormalMapUv).xyz;
              vec3 legacyBrickNormal = texture2D(tBrickNormal, vNormalMapUv).xyz;
              vec3 mapN = mix(legacyGrassNormal, legacyBrickNormal, legacyMaskNormal) * 2.0 - 1.0;
              `,
            );
          }}
          customProgramCacheKey={() => 'legacy-two-layer-splat-floor-v2'}
        />
      </mesh>
    </RigidBody>
  );
}

export function SplatFloor({ config }: SplatFloorProps) {
  const position = asVector3(config?.position, DEFAULT_POSITION);
  const rotation = asVector3(config?.rotation, DEFAULT_ROTATION);
  const args = asVector2(config?.args, DEFAULT_SIZE);
  const repeat = asVector2(config?.repeat, DEFAULT_REPEAT);
  const hasTerrainConfig = Boolean(config?.materials && config.splatMap && config.heightMap);

  if (config && hasTerrainConfig) return <TerrainFloor config={config} />;

  return <LegacySplatFloor position={position} rotation={rotation} args={args} repeat={repeat} textures={config?.texture} />;
}
