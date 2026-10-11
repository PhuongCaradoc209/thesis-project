import { Billboard } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import type { ArtifactAnnotation } from '../../types/scene.types';
import { AnnotationMarkerVisual } from '../annotation/AnnotationMarkerVisual';
import { ArtifactAnnotationTooltip } from './ArtifactAnnotationTooltip';
import { toVector3 } from './preview.utils';
import { useAnnotationVisibility } from './useAnnotationVisibility';

type ArtifactAnnotationMarkerProps = {
  annotation: ArtifactAnnotation;
  modelRef: RefObject<THREE.Group | null>;
};

export function ArtifactAnnotationMarker({ annotation, modelRef }: ArtifactAnnotationMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const gl = useThree((state) => state.gl);
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const position = useMemo(() => toVector3(annotation.position, [0, 0, 0]), [annotation.position]);
  const isVisible = useAnnotationVisibility(groupRef, modelRef);

  useEffect(
    () => () => {
      gl.domElement.style.cursor = '';
    },
    [gl],
  );

  useEffect(() => {
    if (isVisible) return;

    setIsHovered(false);
    setIsTooltipHovered(false);
    setIsSelected(false);
    gl.domElement.style.cursor = '';
  }, [gl, isVisible]);

  const showTooltip = isHovered || isTooltipHovered || isSelected;

  return (
    <Billboard position={position}>
      <group ref={groupRef}>
        <AnnotationMarkerVisual
          active={isHovered || isSelected}
          interactive
          visible={isVisible}
          onPointerDown={(event) => {
            event.stopPropagation();
            setIsSelected((current) => !current);
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            setIsHovered(false);
            gl.domElement.style.cursor = '';
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            setIsHovered(true);
            gl.domElement.style.cursor = 'pointer';
          }}
        />
      </group>

      {showTooltip && <ArtifactAnnotationTooltip annotation={annotation} onHoverChange={setIsTooltipHovered} />}
    </Billboard>
  );
}
