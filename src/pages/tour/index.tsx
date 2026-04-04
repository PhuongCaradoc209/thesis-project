import { Navigate, useParams } from 'react-router';
import { InteractPoint } from '../../components/interact-point';
import InspectModal from '../../components/previews-modal';
import TuducTombs from '../../components/model/TuducTombs';
import BaseScene from '../../components/scenes/BaseScene';
import { useSceneData } from '../../hooks/useScenes';
import { NAV_PATH } from '../../router/paths';
import { useTourismStore } from '../../store/useTourismStore';

// Clean, React-friendly Tour Page component
export default function TourPage() {
  const { sceneId } = useParams<{ sceneId: string }>();
  const { data, isLoading, isError } = useSceneData(sceneId || null);

  const openInspect = useTourismStore((state) => state.openInspect);
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);

  // If there's an error or no sceneId provided, fallback to map
  if (!sceneId || isError) {
    return <Navigate to={NAV_PATH.MAP} replace />;
  }

  if (isLoading || !data) {
    return (
      <div className='flex h-screen w-screen items-center justify-center bg-black'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
      </div>
    );
  }

  const { scene, interactionPoints } = data;

  const handleInspect = (artifactId: string) => {
    openInspect(artifactId);
  };

  return (
    <div className='relative h-screen w-screen overflow-hidden bg-black text-white'>
      {/* 3D Environment Canvas */}
      <BaseScene sceneConfig={scene}>
        {/* Render Pre-defined Scene Models */}
        {sceneId === 'DvuvR5oMnH9hwief9pqn' && <TuducTombs />}

        {/* Render interaction points/hotspots using predefined InteractPoint */}
        {interactionPoints.map((point) => {
          // Hotspot absolute position = placement pos + offset
          const position: [number, number, number] = [point.positionOffset[0], point.positionOffset[1], point.positionOffset[2]];

          return (
            <InteractPoint key={point.pointId} position={position} artifactId={point.artifactId} onInspect={handleInspect} />
          );
        })}
      </BaseScene>

      {/* Artifact Inspection Overlay */}
      {selectedArtifactId && <InspectModal />}
    </div>
  );
}
