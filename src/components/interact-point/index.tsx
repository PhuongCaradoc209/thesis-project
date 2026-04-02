import { Html } from '@react-three/drei';
import { CuboidCollider } from '@react-three/rapier';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTourismStore } from '../../store/useTourismStore';

type InteractPointProps = {
  position: [number, number, number];
  artifactId: string;
  onInspect: (id: string) => void;
};

export function InteractPoint({ position, artifactId, onInspect }: InteractPointProps) {
  const [isNear, setIsNear] = useState(false);
  const pause = useTourismStore((state) => state.pause);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!pause && isNear && event.key.toLowerCase() === 'f') {
        onInspect(artifactId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pause, isNear, artifactId, onInspect]);

  return (
    <group position={position}>
      <CuboidCollider
        args={[3.5, 1, 3.5]}
        sensor
        onIntersectionEnter={() => {
          setIsNear(true);
        }}
        onIntersectionExit={() => {
          setIsNear(false);
        }}
      />

      {isNear && !pause && (
        <Html distanceFactor={10} center zIndexRange={[100, 0]}>
          <motion.div
            className='border-primary flex h-8 w-8 items-center justify-center rounded-full border'
            style={{
              background: 'radial-gradient(circle,rgba(255, 255, 255, 0) 0%, rgba(233, 196, 0, 0.5) 100%)',
            }}
            animate={{
              y: [0, -4, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}>
            <div className='bg-primary absolute -top-9 flex aspect-square items-center justify-center rounded-md p-0.5'>
              <span className='bg-secondary/50 flex aspect-square h-6 w-6 items-center justify-center rounded-sm border-gray-200 text-center text-white shadow-[0px_0px_24px_17px_rgba(0,0,0,0.1)]'>
                F
              </span>
            </div>
            <motion.div
              className='h-4 w-4 rounded-full bg-white'
              animate={{
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </Html>
      )}
    </group>
  );
}
