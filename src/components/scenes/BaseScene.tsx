import { KeyboardControls, PointerLockControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';
import { useEffect, type ReactNode } from 'react';
import { useTourismStore } from '../../store/useTourismStore';
import type { Scene } from '../../types/scene.types';
import Player from '../player/Player';
import Lights from './Lights';
import { SplatFloor } from './SplatFloor';
import { AnimateSky } from './AnimateSky';

type BaseSceneProps = {
  children?: ReactNode;
  sceneConfig?: Scene;
};

function BaseScene({ children, sceneConfig }: BaseSceneProps) {
  const pause = useTourismStore((state) => state.pause);

  // Use scene config defaults or fallback
  const defaultSun: [number, number, number] = (sceneConfig?.environmentConfig?.sunPosition as [number, number, number]) || [
    10, 10, 10,
  ];
  const defaultFogColor = sceneConfig?.environmentConfig?.fogColor || '#ffffff';
  const defaultFogNear = sceneConfig?.environmentConfig?.fogNear || 30;
  const defaultFogFar = sceneConfig?.environmentConfig?.fogFar || 100;
  const initialPlayerPos = sceneConfig?.playerConfig?.position as [number, number, number] | undefined;

  const { sunPosition, perfVisible } = useControls('Environment', {
    sunPosition: {
      value: defaultSun,
      step: 0.1,
    },
    perfVisible: {
      value: true,
    },
  });

  useEffect(() => {
    if (pause) {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
  }, [pause]);

  return (
    <div className='h-screen w-screen'>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          { name: 'jump', keys: ['Space'] },
        ]}>
        <Canvas flat shadows dpr={[1, 1.5]}>
          {pause || <PointerLockControls makeDefault />}
          <fog attach='fog' args={[defaultFogColor, defaultFogNear, defaultFogFar]} />
          <Physics paused={pause}>
            {perfVisible && <Perf position='top-left' />}
            <group visible={!pause}>
              <AnimateSky />
              <Lights sunPosition={sunPosition as [number, number, number]} />
              <SplatFloor
                position={(sceneConfig?.floorConfig?.position as [number, number, number]) || [-0.2, -3.52, 0]}
                args={(sceneConfig?.floorConfig?.args as [number, number]) || [30, 30]}
                textures={sceneConfig?.floorConfig?.texture}
              />
              <Player active={!pause} initialPosition={initialPlayerPos} />
              {children}
            </group>
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default BaseScene;
