import { Center, OrbitControls, Sparkles, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
function PortalScene() {
  const { nodes } = useGLTF('./portal/portal.glb');

  const bakedTexture = useTexture('./portal/baked.jpg');

  return (
    <Center>
      <color args={['#201919']} attach={'background'} />

      <OrbitControls makeDefault />

      <mesh geometry={(nodes.baked as THREE.Mesh).geometry}>
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>

      <Sparkles size={6} scale={[4, 2, 4]} speed={0.2} color='#ffffff' position-y={1} />
    </Center>
  );
}

export default PortalScene;
