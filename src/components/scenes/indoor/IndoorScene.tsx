import type { Scene } from '../../../types/scene.types';
import SceneShell, { type SceneShellProps } from '../SceneShell';
import { GalleryRoom } from './GalleryRoom';
import { IndoorLights } from './IndoorLights';

type IndoorSceneProps = Omit<SceneShellProps, 'environment' | 'atmosphere' | 'playerConfig'> & {
  sceneConfig?: Scene;
};

export default function IndoorScene({ sceneConfig, children, ...shellProps }: IndoorSceneProps) {
  return (
    <SceneShell
      {...shellProps}
      playerConfig={sceneConfig?.playerConfig}
      ao={{ radius: 2.5, intensity: 2.2 }}
      environment={
        <>
          <IndoorLights />
          <GalleryRoom />
        </>
      }>
      {children}
    </SceneShell>
  );
}
