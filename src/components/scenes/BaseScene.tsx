import { KeyboardControls, PointerLockControls, View } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import PreviewBackground from '../../assets/scenes/tuduc/BackgroundTuDucTomb.jpg';
import { useTourismStore } from '../../store/useTourismStore';
import type { Scene } from '../../types/scene.types';
import Player, { DEFAULT_KILL_Y } from '../player/Player';
import { AnimateSky } from './AnimateSky';
import Lights from './Lights';
import { SplatFloor } from './SplatFloor';

type BaseSceneProps = {
  children?: ReactNode;
  sceneConfig?: Scene;
  loading?: boolean;
  onFirstFrame?: () => void;
  eventSource?: HTMLElement;
};

type WebGLContextEventsProps = {
  onLost: () => void;
  onRestored: () => void;
};

function WebGLContextEvents({ onLost, onRestored }: WebGLContextEventsProps) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    const handleRestored = () => onRestored();

    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
    };
  }, [gl, onLost, onRestored]);

  return null;
}

function FullCanvasViewport({ active }: { active: boolean }) {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);

  useFrame(() => {
    if (!active) return;

    // Drei View renders with a scissored viewport. Its unmount cleanup clears
    // the old view but can leave that smaller viewport active for the main
    // scene, producing black strips where the preview header/sidebar used to be.
    gl.setScissorTest(false);
    gl.setViewport(0, 0, size.width, size.height);
    gl.setScissor(0, 0, size.width, size.height);
  }, -100);

  return null;
}

function FirstFrameReporter({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const renderedFrames = useRef(0);
  const reported = useRef(false);

  useFrame(() => {
    if (reported.current || !onFirstFrame) return;

    renderedFrames.current += 1;
    if (renderedFrames.current >= 2) {
      reported.current = true;
      onFirstFrame();
    }
  });

  return null;
}

type SceneContentsProps = {
  children?: ReactNode;
  sceneConfig?: Scene;
  initialPlayerPos?: [number, number, number];
  killY: number;
  active: boolean;
  visible: boolean;
  sunPosition: [number, number, number];
};

function SceneContents({ children, sceneConfig, initialPlayerPos, killY, active, visible, sunPosition }: SceneContentsProps) {
  return (
    <group visible={visible}>
      <AnimateSky />
      <Lights sunPosition={sunPosition} />
      <SplatFloor config={sceneConfig?.floorConfig} />
      <Player active={active} initialPosition={initialPlayerPos} killY={killY} />
      {children}
    </group>
  );
}

function DevelopmentSceneContents({
  defaultSun,
  ...props
}: Omit<SceneContentsProps, 'sunPosition'> & { defaultSun: [number, number, number] }) {
  const { sunPosition, perfVisible } = useControls('Environment', {
    sunPosition: {
      value: defaultSun,
      step: 0.1,
    },
    perfVisible: {
      value: true,
    },
  });

  return (
    <>
      {perfVisible && <Perf position='top-left' />}
      <SceneContents {...props} sunPosition={sunPosition as [number, number, number]} />
    </>
  );
}

function BaseScene({ children, sceneConfig, loading = false, onFirstFrame, eventSource }: BaseSceneProps) {
  const { t } = useTranslation();
  const pause = useTourismStore((state) => state.pause);
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);
  const [canvasGeneration, setCanvasGeneration] = useState(0);
  const [isContextLost, setIsContextLost] = useState(false);
  const handleContextLost = useCallback(() => setIsContextLost(true), []);
  const handleContextRestored = useCallback(() => setIsContextLost(false), []);

  // Use scene config defaults or fallback
  const defaultSun: [number, number, number] = (sceneConfig?.environmentConfig?.sunPosition as [number, number, number]) || [
    10, 10, 10,
  ];
  const defaultFogColor = sceneConfig?.environmentConfig?.fogColor || '#ffffff';
  const defaultFogNear = sceneConfig?.environmentConfig?.fogNear || 30;
  const defaultFogFar = sceneConfig?.environmentConfig?.fogFar || 100;
  const initialPlayerPos = sceneConfig?.playerConfig?.position as [number, number, number] | undefined;
  const configuredKillY = sceneConfig?.playerConfig?.killY;
  const killY = Number.isFinite(configuredKillY) ? (configuredKillY as number) : DEFAULT_KILL_Y;
  const sceneContentsProps = {
    children,
    sceneConfig,
    initialPlayerPos,
    killY,
    active: !pause && !loading,
    visible: !selectedArtifactId,
  };

  useEffect(() => {
    if (pause || loading) {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
  }, [loading, pause]);

  return (
    <div className='relative h-screen w-screen'>
      {selectedArtifactId && (
        <div className='pointer-events-none absolute inset-0 overflow-hidden bg-black'>
          <div
            className='absolute -inset-6 scale-105 bg-cover bg-center blur-xl'
            style={{ backgroundImage: `url('${PreviewBackground}')` }}
          />
          <div className='absolute inset-0 bg-white/50' />
        </div>
      )}
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          { name: 'jump', keys: ['Space'] },
        ]}>
        <Canvas
          key={canvasGeneration}
          eventSource={eventSource}
          eventPrefix='client'
          shadows={!pause}
          dpr={[1, 1.5]}
          frameloop='always'
          className='relative z-10'
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            stencil: false,
            toneMapping: THREE.ACESFilmicToneMapping,
          }}>
          <WebGLContextEvents onLost={handleContextLost} onRestored={handleContextRestored} />
          <FirstFrameReporter onFirstFrame={onFirstFrame} />
          <FullCanvasViewport active={!selectedArtifactId} />
          {pause || loading || <PointerLockControls makeDefault />}
          <fog attach='fog' args={[defaultFogColor, defaultFogNear, defaultFogFar]} />
          <Physics paused={pause || loading}>
            {import.meta.env.DEV ? (
              <DevelopmentSceneContents {...sceneContentsProps} defaultSun={defaultSun} />
            ) : (
              <SceneContents {...sceneContentsProps} sunPosition={defaultSun} />
            )}
          </Physics>
          <View.Port />
        </Canvas>
      </KeyboardControls>

      {isContextLost && (
        <div className='absolute inset-0 z-100 flex items-center justify-center bg-black/85 px-6 text-center text-white'>
          <div className='max-w-md rounded-2xl border border-white/15 bg-neutral-950 p-6 shadow-2xl'>
            <p className='text-lg font-semibold'>{t('webgl.contextLost')}</p>
            <p className='mt-2 text-sm text-white/70'>{t('webgl.restoring')}</p>
            <button
              type='button'
              className='bg-primary hover:bg-primary-container mt-5 rounded-md px-5 py-2 font-semibold text-white'
              onClick={() => {
                setCanvasGeneration((current) => current + 1);
                setIsContextLost(false);
              }}>
              {t('webgl.resetCanvas')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BaseScene;
