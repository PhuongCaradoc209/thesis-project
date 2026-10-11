import { Html } from '@react-three/drei';
import { motion } from 'motion/react';
import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { SCENE_INTERACTION_HTML_Z_INDEX_RANGE } from '../interactions/sceneInteraction.constants';
import { useSceneInteraction } from '../interactions/useSceneInteraction';

type InteractPointProps = {
  interactionId: string;
  position: [number, number, number];
  artifactId: string;
  onInspect: (id: string) => void;
  guidedTarget?: boolean;
};

export function InteractPoint({ interactionId, position, artifactId, onInspect, guidedTarget = false }: InteractPointProps) {
  const pointRef = useRef<THREE.Group>(null);
  const handleInteract = useCallback(() => onInspect(artifactId), [artifactId, onInspect]);
  const interactionState = useSceneInteraction({
    id: interactionId,
    objectRef: pointRef,
    maxDistance: 5,
    onInteract: handleInteract,
  });
  const isFocused = interactionState === 'focused';

  return (
    <group ref={pointRef} position={position}>
      {(interactionState !== 'far' || guidedTarget) && (
        <Html distanceFactor={10} center zIndexRange={SCENE_INTERACTION_HTML_Z_INDEX_RANGE}>
          <motion.div
            className='border-primary flex h-8 w-8 items-center justify-center rounded-full border'
            style={{
              background: 'radial-gradient(circle,rgba(255, 255, 255, 0) 0%, rgba(233, 196, 0, 0.5) 100%)',
            }}
            animate={{
              opacity: isFocused || guidedTarget ? 1 : 0.55,
              y: [0, -4, 0],
              scale: isFocused || guidedTarget ? [1, 1.1, 1] : 0.9,
            }}
            transition={{
              opacity: { duration: 0.18 },
              y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
              scale: isFocused || guidedTarget ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.18 },
            }}>
            {isFocused && (
              <div className='bg-primary absolute -top-9 flex aspect-square items-center justify-center rounded-md p-0.5'>
                <span className='bg-secondary/50 flex aspect-square h-6 w-6 items-center justify-center rounded-sm border-gray-200 text-center text-white shadow-[0px_0px_24px_17px_rgba(0,0,0,0.1)]'>
                  F
                </span>
              </div>
            )}
            <motion.div
              className='h-4 w-4 rounded-full bg-white'
              animate={{ scale: isFocused ? [1, 0.8, 1] : 0.85 }}
              transition={isFocused ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.18 }}
            />
          </motion.div>
        </Html>
      )}
    </group>
  );
}
