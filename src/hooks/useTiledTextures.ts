import { useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export type TextureUrls = Record<string, string>;

export function useTiledTextures(urls: TextureUrls, repeatX: number, repeatY: number) {
  const textures = useTexture(urls) as Record<string, THREE.Texture>;

  const tiled = useMemo(() => {
    const result: Record<string, THREE.Texture> = {};
    for (const [key, texture] of Object.entries(textures)) {
      const copy = texture.clone();
      copy.wrapS = THREE.RepeatWrapping;
      copy.wrapT = THREE.RepeatWrapping;
      copy.repeat.set(repeatX, repeatY);
      copy.colorSpace = key === 'map' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      result[key] = copy;
    }
    return result;
  }, [textures, repeatX, repeatY]);

  useEffect(() => () => Object.values(tiled).forEach((texture) => texture.dispose()), [tiled]);

  return tiled;
}
