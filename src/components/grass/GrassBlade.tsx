import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type GrassBladeProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  height?: number;
  width?: number;
  bend?: number;
  droop?: number;
  windStrength?: number;
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBend;
  uniform float uDroop;
  uniform float uWindStrength;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    float heightProgress = uv.y;
    float tipInfluence = pow(heightProgress, 2.0);
    vec3 transformed = position;

    // Keep the base broad and taper both sides into a pointed tip.
    transformed.x *= mix(1.0, 0.04, smoothstep(0.0, 1.0, heightProgress));

    // The root barely moves while the upper section curves and droops.
    transformed.x += uBend * tipInfluence;
    transformed.y -= uDroop * pow(heightProgress, 3.0);

    // A small secondary motion makes the blade feel alive without moving its root.
    float wind = sin(uTime * 1.7 + heightProgress * 2.4) * uWindStrength * tipInfluence;
    transformed.x += wind;
    transformed.z += wind * 0.35;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBaseColor;
  uniform vec3 uTipColor;

  varying vec2 vUv;

  void main() {
    vec3 color = mix(uBaseColor, uTipColor, smoothstep(0.0, 1.0, vUv.y));
    float centerLight = 1.0 - abs(vUv.x * 2.0 - 1.0);
    color += centerLight * 0.06;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** A single curved grass blade. The vertex shader owns its shape and wind motion. */
export function GrassBlade({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  height = 0.85,
  width = 0.13,
  bend = 0.34,
  droop = 0.08,
  windStrength = 0.025,
}: GrassBladeProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const bladeGeometry = new THREE.PlaneGeometry(width, height, 1, 8);
    bladeGeometry.translate(0, height / 2, 0);
    return bladeGeometry;
  }, [height, width]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBend: { value: bend },
      uDroop: { value: droop },
      uWindStrength: { value: windStrength },
      uBaseColor: { value: new THREE.Color('#35552d') },
      uTipColor: { value: new THREE.Color('#789856') },
    }),
    [bend, droop, windStrength],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh position={position} rotation={rotation} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
        toneMapped
      />
    </mesh>
  );
}
