export type ArtifactPreviewConfig = {
  artifactId: string;
  title: string;
  type?: string;
  subtitle: string;
  modelUrl: string;
  cameraPosition?: [number, number, number];
  dynasty?: string;
  material?: string;
  year?: number | string;
  history?: string;
};

export const artifactPreviewConfigs: Record<string, ArtifactPreviewConfig> = {
  bia_da_01: {
    artifactId: 'bia_da_01',
    title: 'Bia Khiêm Cung Ký',
    type: 'Bảo vật quốc gia',
    subtitle: 'Bia Khiêm Cung Ký là một di sản văn hóa quý báu, ghi lại những thông tin lịch sử quan trọng về cuộc đời và sự nghiệp của vua Tự Đức.',
    modelUrl: '/tuduc/Khiem_Cung_Ky_Stele.glb',
    cameraPosition: [0, 1.2, 4.5],
    dynasty: 'Triều Nguyễn',
    material: 'Đá Thanh',
    year: 1875,
    history: 'Bia được dựng vào năm 1875, do chính vua Tự Đức soạn thảo. Nội dung văn bia là một bản tự thuật của nhà vua về cuộc đời, sự nghiệp, cũng như những trăn trở, suy tư của ông về đất nước và nhân dân.'
  },
};

export function getArtifactPreviewConfig(artifactId: string | null) {
  if (!artifactId) return null;
  return artifactPreviewConfigs[artifactId] ?? null;
}
