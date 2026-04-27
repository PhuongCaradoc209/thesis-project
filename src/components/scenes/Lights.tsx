type LightsProps = {
  sunPosition?: [number, number, number];
};

const Lights = ({ sunPosition = [10, 20, 10] }: LightsProps) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow
        position={sunPosition}
        shadow-radius={6}
        intensity={4}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}>
        <orthographicCamera attach='shadow-camera' args={[-50, 50, 50, -50, 0.1, 100]} />
      </directionalLight>
    </>
  );
};

export default Lights;
