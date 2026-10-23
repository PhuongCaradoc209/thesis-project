import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { FloorConfig } from '../../types/scene.types';

type InstancedGrassFieldProps = {
  config: FloorConfig;
  count?: number;
};

type TexturePixels = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

function asVector2(value: number[] | undefined, fallback: [number, number]): [number, number] {
  return value?.length === 2 ? [value[0], value[1]] : fallback;
}

function asVector3(value: number[] | undefined, fallback: [number, number, number]): [number, number, number] {
  return value?.length === 3 ? [value[0], value[1], value[2]] : fallback;
}

function readTexturePixels(texture: THREE.Texture): TexturePixels {
  const image = texture.image as CanvasImageSource & {
    naturalWidth?: number;
    naturalHeight?: number;
    width: number;
    height: number;
  };
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Could not read grass placement textures.');

  context.drawImage(image, 0, 0, width, height);
  return { data: context.getImageData(0, 0, width, height).data, width, height };
}

function sampleRedChannel(texture: TexturePixels, u: number, v: number) {
  const x = Math.min(texture.width - 1, Math.floor(u * texture.width));
  const y = Math.min(texture.height - 1, Math.floor(v * texture.height));
  return texture.data[(y * texture.width + x) * 4] / 255;
}

function sampleGrassWeight(texture: TexturePixels, u: number, v: number) {
  const x = Math.min(texture.width - 1, Math.floor(u * texture.width));
  const y = Math.min(texture.height - 1, Math.floor(v * texture.height));
  const pixelIndex = (y * texture.width + x) * 4;
  const brickWeight = texture.data[pixelIndex] / 255;
  const dirtWeight = texture.data[pixelIndex + 1] / 255;
  return Math.max(1 - brickWeight - dirtWeight, 0);
}

function createRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Renders thousands of small grass blades as one instanced draw call. */
export function InstancedGrassField({ config, count = 16000 }: InstancedGrassFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const shaderRef = useRef<THREE.WebGLProgramParametersWithUniforms | null>(null);
  const [heightTexture, splatTexture] = useTexture([config.heightMap!, config.splatMap!]);
  const size = useMemo(() => asVector2(config.args, [30, 30]), [config.args]);
  const fieldPosition = useMemo(() => asVector3(config.position, [0, 0, 0]), [config.position]);
  const heightScale = config.heightScale ?? 0;
  const heightOffset = config.heightOffset ?? 0;

  const geometry = useMemo(() => {
    const bladeGeometry = new THREE.PlaneGeometry(0.045, 0.32, 1, 6);
    bladeGeometry.translate(0, 0.16, 0);
    return bladeGeometry;
  }, []);

  const grass = useMemo(() => {
    const heightPixels = readTexturePixels(heightTexture);
    const splatPixels = readTexturePixels(splatTexture);
    const random = createRandom(19860209);
    const matrices: THREE.Matrix4[] = [];
    const bends: number[] = [];
    const phases: number[] = [];
    const colors: THREE.Color[] = [];
    const dummy = new THREE.Object3D();
    const darkGrassColor = new THREE.Color('#294321');
    const lightGrassColor = new THREE.Color('#597640');
    const maximumAttempts = count * 20;

    for (let attempt = 0; attempt < maximumAttempts && matrices.length < count; attempt += 1) {
      const u = random();
      const v = random();
      const grassWeight = sampleGrassWeight(splatPixels, u, v);

      if (grassWeight < 0.55 || random() > grassWeight) continue;

      const x = (u - 0.5) * size[0];
      const z = (v - 0.5) * size[1];
      const y = sampleRedChannel(heightPixels, u, v) * heightScale + heightOffset + 0.015;
      const widthScale = 0.7 + random() * 0.55;
      const heightVariation = 0.65 + random() * 0.65;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, random() * Math.PI * 2, 0);
      dummy.scale.set(widthScale, heightVariation, widthScale);
      dummy.updateMatrix();

      matrices.push(dummy.matrix.clone());
      bends.push(0.045 + random() * 0.085);
      phases.push(random() * Math.PI * 2);
      colors.push(darkGrassColor.clone().lerp(lightGrassColor, random()));
    }

    geometry.setAttribute('aBend', new THREE.InstancedBufferAttribute(new Float32Array(bends), 1));
    geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(new Float32Array(phases), 1));
    return { colors, matrices };
  }, [count, geometry, heightOffset, heightScale, heightTexture, size, splatTexture]);

  const customizeShader = useCallback((shader: THREE.WebGLProgramParametersWithUniforms) => {
    shaderRef.current = shader;
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uDroop = { value: 0.035 };
    shader.uniforms.uWindStrength = { value: 0.018 };

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uTime;
      uniform float uDroop;
      uniform float uWindStrength;
      attribute float aBend;
      attribute float aPhase;
      `,
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      float heightProgress = clamp(position.y / 0.32, 0.0, 1.0);
      float tipInfluence = pow(heightProgress, 2.0);
      vec3 transformed = vec3(position);

      transformed.x *= mix(1.0, 0.04, smoothstep(0.0, 1.0, heightProgress));
      transformed.x += aBend * tipInfluence;
      transformed.y -= uDroop * pow(heightProgress, 3.0);

      float wind = sin(uTime * 1.7 + aPhase + heightProgress * 2.4) * uWindStrength * tipInfluence;
      transformed.x += wind;
      transformed.z += wind * 0.35;
      `,
    );
  }, []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    grass.matrices.forEach((matrix, index) => {
      mesh.setMatrixAt(index, matrix);
      mesh.setColorAt(index, grass.colors[index]);
    });
    mesh.count = grass.matrices.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [grass]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (shaderRef.current) shaderRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} position={fieldPosition} frustumCulled={false}>
      <meshStandardMaterial
        color='#ffffff'
        roughness={0.95}
        side={THREE.DoubleSide}
        onBeforeCompile={customizeShader}
        customProgramCacheKey={() => 'instanced-curved-grass-v1'}
      />
    </instancedMesh>
  );
}
