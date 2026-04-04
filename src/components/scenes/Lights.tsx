const Lights = () => {
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight
        castShadow
        position={[10, 20, 10]}
        shadow-radius={6}
        intensity={1.5}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}>
        {/* <orthographicCamera attach='shadow-camera' args={[-20, 20, 20, -20, 0.1, 50]} /> */}
      </directionalLight>
    </>
  );
};

export default Lights;
