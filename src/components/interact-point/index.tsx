import { Html } from '@react-three/drei';
import { motion } from 'motion/react';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import { useArtifactData } from '../../hooks/useArtifacts';
import { pickLang } from '../../utils/pickLang';
import { InteractionPrompt } from '../interactions/InteractionPrompt';
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
  const { t, i18n } = useTranslation();
  const pointRef = useRef<THREE.Group>(null);
  const handleInteract = useCallback(() => onInspect(artifactId), [artifactId, onInspect]);
  const interactionState = useSceneInteraction({
    id: interactionId,
    objectRef: pointRef,
    maxDistance: 5,
    onInteract: handleInteract,
  });
  // Dùng chung cache với InspectModal nên mở modal sau đó không phải tải lại
  const { data: artifact } = useArtifactData(interactionState === 'far' ? null : artifactId);
  const isFocused = interactionState === 'focused';
  const title = pickLang(artifact?.title, i18n.language);
  const label = title ? t('interaction.inspect', { name: t(title) }) : t('interaction.inspectArtifact');

  return (
    <group ref={pointRef} position={position}>
      {(interactionState !== 'far' || guidedTarget) && (
        <Html distanceFactor={10} center zIndexRange={SCENE_INTERACTION_HTML_Z_INDEX_RANGE}>
          <div className='relative flex flex-col items-center'>
            {isFocused && (
              <div className='absolute bottom-full mb-3'>
                <InteractionPrompt label={label} />
              </div>
            )}
            <motion.div
              className='border-primary/80 flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] bg-[#f3e7cf]/90 shadow-[0_4px_12px_rgba(20,12,7,0.3)]'
              animate={{
                opacity: isFocused || guidedTarget ? 1 : 0.6,
                y: [0, -4, 0],
                scale: isFocused || guidedTarget ? [1, 1.1, 1] : 0.9,
              }}
              transition={{
                opacity: { duration: 0.18 },
                y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
                scale: isFocused || guidedTarget ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.18 },
              }}>
              <span className='bg-primary h-2.5 w-2.5 rounded-full' />
            </motion.div>
          </div>
        </Html>
      )}
    </group>
  );
}
