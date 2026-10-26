import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

type CurvedGrassBladeProps = {
  height?: number;
  width?: number;
  bend?: number;
  droop?: number;
  segments?: number;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

function createCurvedBladeGeometry({
  height,
  width,
  bend,
  droop,
  segments,
}: Required<Pick<CurvedGrassBladeProps, 'height' | 'width' | 'bend' | 'droop' | 'segments'>>) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const start = new THREE.Vector2(0, 0);

  const control = new THREE.Vector2(bend * 0.4, height * 1.05);
  const end = new THREE.Vector2(bend, height - droop);

  const center = new THREE.Vector2();
  const tangent = new THREE.Vector2();
  const side = new THREE.Vector2();

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const inverseT = 1 - t;

    center.set(
      inverseT * inverseT * start.x + 2 * inverseT * t * control.x + t * t * end.x,
      inverseT * inverseT * start.y + 2 * inverseT * t * control.y + t * t * end.y,
    );

    // Đạo hàm của đường Bézier, dùng để biết hướng thân lá.
    tangent.set(
      2 * inverseT * (control.x - start.x) + 2 * t * (end.x - control.x),
      2 * inverseT * (control.y - start.y) + 2 * t * (end.y - control.y),
    );

    tangent.normalize();

    // Vector vuông góc với thân lá để tạo mép trái/phải.
    side.set(-tangent.y, tangent.x);

    // Chân rộng, đầu thuôn dần về 0.
    const halfWidth = (width * Math.pow(1 - t, 1.35)) / 2;

    const leftX = center.x + side.x * halfWidth;
    const leftY = center.y + side.y * halfWidth;
    const rightX = center.x - side.x * halfWidth;
    const rightY = center.y - side.y * halfWidth;

    positions.push(leftX, leftY, 0);
    positions.push(rightX, rightY, 0);

    uvs.push(0, t);
    uvs.push(1, t);

    if (index < segments) {
      const currentLeft = index * 2;
      const currentRight = currentLeft + 1;
      const nextLeft = currentLeft + 2;
      const nextRight = currentLeft + 3;

      indices.push(currentLeft, currentRight, nextLeft);
      indices.push(currentRight, nextRight, nextLeft);
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
}

export function CurvedGrassBlade({
  height = 0.65,
  width = 0.1,
  bend = 0.32,
  droop = 0.08,
  segments = 7,
  color = '#587447',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: CurvedGrassBladeProps) {
  const geometry = useMemo(
    () =>
      createCurvedBladeGeometry({
        height,
        width,
        bend,
        droop,
        segments,
      }),
    [bend, droop, height, segments, width],
  );

  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry],
  );

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} castShadow={false} receiveShadow>
      <meshStandardMaterial color={color} roughness={0.95} metalness={0} side={THREE.DoubleSide} />
    </mesh>
  );
}
