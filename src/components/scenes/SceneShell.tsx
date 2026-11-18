import { KeyboardControls, PointerLockControls, View } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import PreviewBackground from '../../assets/scenes/tuduc/BackgroundTuDucTomb.jpg';
import { RESOLUTION_DPR } from '../../constants/settings';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTourismStore } from '../../store/useTourismStore';
import type { Scene } from '../../types/scene.types';
import { ModelErrorBoundary } from '../3d/ModelErrorBoundary';
import { SceneInteractionProvider } from '../interactions/SceneInteractionManager';
import Player, { DEFAULT_KILL_Y } from '../player/Player';
import { DevelopmentPostFX, PostFX } from './PostFX';

export type SceneShellProps = {
  children?: ReactNode;
  environment?: ReactNode;
  atmosphere?: ReactNode;
  playerConfig?: Scene['playerConfig'];
  ao?: { radius: number; intensity: number };
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
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    if (!active) return;

    const aspect = size.width / size.height;
    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.aspect - aspect) > 0.001) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }

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

function DevelopmentPerf() {
  const { perfVisible } = useControls('Environment', { perfVisible: { value: true } });
  return perfVisible ? (
    <Perf position='top-left' style={{ top: 'auto', bottom: 24, left: '50%', transform: 'translateX(-50%)' }} />
  ) : null;
}

/**
 * Vỏ chung cho mọi scene: Canvas, điều khiển, vật lý, người chơi, hậu kỳ, preview hiện vật
 * và xử lý mất WebGL. Môi trường (ngoài trời hay trong nhà) truyền vào qua `environment`.
 */
export default function SceneShell({
  children,
  environment,
  atmosphere,
  playerConfig,
  ao,
  loading = false,
  onFirstFrame,
  eventSource,
}: SceneShellProps) {
  const { t } = useTranslation();
  const pause = useTourismStore((state) => state.pause);
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);
  const graphics = useSettingsStore((state) => state.graphics);
  const [canvasGeneration, setCanvasGeneration] = useState(0);
  const [isContextLost, setIsContextLost] = useState(false);
  const handleContextLost = useCallback(() => setIsContextLost(true), []);
  const handleContextRestored = useCallback(() => setIsContextLost(false), []);

  const initialPlayerPos = playerConfig?.position as [number, number, number] | undefined;
  const configuredKillY = playerConfig?.killY;
  const killY = Number.isFinite(configuredKillY) ? (configuredKillY as number) : DEFAULT_KILL_Y;
  const active = !pause && !loading;

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
          shadows={!pause && graphics.shadows !== 'off'}
          dpr={RESOLUTION_DPR[graphics.resolution]}
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
          {atmosphere}
          <SceneInteractionProvider active={active}>
            <Physics paused={pause || loading}>
              {import.meta.env.DEV && <DevelopmentPerf />}
              <group visible={!selectedArtifactId}>
                {environment}
                <Player active={active} initialPosition={initialPlayerPos} killY={killY} />
                {children}
              </group>
            </Physics>
          </SceneInteractionProvider>
          {/* Không gắn AO khi mất WebGL context: lúc đó getContextAttributes() trả về null và
              EffectComposer crash. Lỗi AO nào khác cũng chỉ tắt AO, không làm sập cả trang. */}
          {graphics.ambientOcclusion && !selectedArtifactId && !isContextLost && (
            <ModelErrorBoundary
              resetKey={canvasGeneration}
              fallback={() => null}
              onError={(error) => console.error('[PostFX] Ambient occlusion failed, rendering without it.', error)}>
              {import.meta.env.DEV ? (
                <DevelopmentPostFX aoRadius={ao?.radius} aoIntensity={ao?.intensity} />
              ) : (
                <PostFX aoRadius={ao?.radius} aoIntensity={ao?.intensity} />
              )}
            </ModelErrorBoundary>
          )}
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
