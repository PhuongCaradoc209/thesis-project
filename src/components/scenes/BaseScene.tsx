import { useControls } from 'leva';
import type { Scene } from '../../types/scene.types';
import { AnimateSky } from './AnimateSky';
import Lights from './Lights';
import SceneShell, { type SceneShellProps } from './SceneShell';
import { SplatFloor } from './SplatFloor';

type BaseSceneProps = Omit<SceneShellProps, 'environment' | 'atmosphere' | 'playerConfig'> & {
  sceneConfig?: Scene;
};

type OutdoorEnvironmentProps = {
  sunPosition: [number, number, number];
  floorConfig?: Scene['floorConfig'];
};

function OutdoorEnvironment({ sunPosition, floorConfig }: OutdoorEnvironmentProps) {
  return (
    <>
      <AnimateSky />
      <Lights sunPosition={sunPosition} />
      <SplatFloor config={floorConfig} />
    </>
  );
}

function DevelopmentOutdoorEnvironment({ sunPosition: defaultSun, floorConfig }: OutdoorEnvironmentProps) {
  const { sunPosition } = useControls('Environment', {
    sunPosition: { value: defaultSun, step: 0.1 },
  });

  return <OutdoorEnvironment sunPosition={sunPosition as [number, number, number]} floorConfig={floorConfig} />;
}

type FogSettings = { color: string; near: number; far: number };

function DevelopmentFog({ color, near, far }: FogSettings) {
  const fog = useControls('Environment', {
    fogColor: color,
    fogNear: { value: near, min: 0, max: 300, step: 1 },
    fogFar: { value: far, min: 10, max: 600, step: 1 },
  });

  return <fog attach='fog' args={[fog.fogColor, fog.fogNear, fog.fogFar]} />;
}

/** Scene ngoài trời: bầu trời, mặt trời, fog và mặt đất, đặt trên vỏ chung SceneShell. */
function BaseScene({ sceneConfig, children, ...shellProps }: BaseSceneProps) {
  const sunPosition: [number, number, number] = (sceneConfig?.environmentConfig?.sunPosition as [number, number, number]) || [
    10, 14, 10,
  ];
  const fog: FogSettings = {
    color: sceneConfig?.environmentConfig?.fogColor || '#d0dbe7',
    near: sceneConfig?.environmentConfig?.fogNear || 40,
    far: sceneConfig?.environmentConfig?.fogFar || 140,
  };
  const floorConfig = sceneConfig?.floorConfig;

  return (
    <SceneShell
      {...shellProps}
      playerConfig={sceneConfig?.playerConfig}
      atmosphere={import.meta.env.DEV ? <DevelopmentFog {...fog} /> : <fog attach='fog' args={[fog.color, fog.near, fog.far]} />}
      environment={
        import.meta.env.DEV ? (
          <DevelopmentOutdoorEnvironment sunPosition={sunPosition} floorConfig={floorConfig} />
        ) : (
          <OutdoorEnvironment sunPosition={sunPosition} floorConfig={floorConfig} />
        )
      }>
      {children}
    </SceneShell>
  );
}

export default BaseScene;
