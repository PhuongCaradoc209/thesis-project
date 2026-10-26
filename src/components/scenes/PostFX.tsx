import { EffectComposer, N8AO, SMAA, ToneMapping } from '@react-three/postprocessing';
import { useControls } from 'leva';
import { ToneMappingMode } from 'postprocessing';

type PostFXProps = {
  aoRadius?: number;
  aoIntensity?: number;
  aoOnly?: boolean;
};

// Hậu kỳ cho scene chính, chỉ được gắn khi cài đặt bật AO.
// EffectComposer vẽ scene vào render target trước, nên tone mapping của renderer không còn
// được áp dụng: phải thêm ToneMapping (giữ ACES như Canvas) ở cuối chuỗi.
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

export function DevelopmentPostFX() {
  const settings = useControls('Post FX', {
    aoRadius: { value: 4, min: 0.1, max: 10, step: 0.1 },
    aoIntensity: { value: 5, min: 0, max: 10, step: 0.1 },
    aoOnly: false,
  });

  return <PostFX {...settings} />;
}
