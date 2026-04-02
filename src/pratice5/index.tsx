import { Physics } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import Player from './player';

function Practice5() {
  return (
    <>
      <Perf position='top-left' />
      {/* <OrbitControls makeDefault /> */}
      <directionalLight castShadow position={[1.5, 2, 0]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics debug>
        <Player />
      </Physics>
    </>
  );
}

export default Practice5;
