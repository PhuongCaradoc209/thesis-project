import { EffectComposer, N8AO, SMAA, ToneMapping } from '@react-three/postprocessing';
import { useControls } from 'leva';
import { ToneMappingMode } from 'postprocessing';

type PostFXProps = {
  aoRadius?: number;
  aoIntensity?: number;
  aoOnly?: boolean;
};

export function PostFX({ aoRadius = 4, aoIntensity = 5, aoOnly = false }: PostFXProps) {
  return (
    <EffectComposer multisampling={0}>
      <N8AO
        aoRadius={aoRadius}
        intensity={aoIntensity}
        distanceFalloff={1}
        quality='performance'
        halfRes
        renderMode={aoOnly ? 1 : 0}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <SMAA />
    </EffectComposer>
  );
}

export function DevelopmentPostFX({ aoRadius = 1.5, aoIntensity = 2.6 }: PostFXProps) {
  const settings = useControls('Post FX', {
    aoRadius: { value: aoRadius, min: 0.1, max: 10, step: 0.1 },
    aoIntensity: { value: aoIntensity, min: 0, max: 10, step: 0.1 },
    aoOnly: false,
  });

  return <PostFX {...settings} />;
}
