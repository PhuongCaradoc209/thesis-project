import { KeyboardControls, PointerLockControls, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';
import { useEffect, type ReactNode } from 'react';
import { useTourismStore } from '../store/useTourismStore';
import Floor from './Floor';
import Lights from './Lights';
import Player from './model/Player';

type BaseSceneProps = {
  children?: ReactNode;
};

function BaseScene({ children }: BaseSceneProps) {
  const pause = useTourismStore((state) => state.pause);
  const { sunPosition, perfVisible } = useControls('Environment', {
    sunPosition: {
      value: [10, 10, 10],
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
        <Canvas flat shadows>
          {pause || <PointerLockControls makeDefault />}
          {/* <color attach='background' args={['#b0c4de']} /> */}
          <fog attach='fog' args={['#ffffff', 30, 100]} />{' '}
          <Physics paused={pause}>
            {perfVisible && <Perf position='top-left' />}
            <group visible={!pause}>
              <Sky sunPosition={sunPosition} turbidity={8} rayleigh={0.5} />
              <Lights />
              <Floor />
              <Player active={!pause} />
              {children}
            </group>
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default BaseScene;
