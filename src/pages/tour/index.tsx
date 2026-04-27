import { CompassIcon, MapPinSimpleAreaIcon, MapTrifoldIcon, XIcon } from '@phosphor-icons/react';
import { Navigate, useParams } from 'react-router';
import DynamicSceneRenderer from '../../components/3d/DynamicSceneRenderer';
import { InteractPoint } from '../../components/interact-point';
import InspectModal from '../../components/previews-modal';
import BaseScene from '../../components/scenes/BaseScene';
import TeleportTransition from '../../components/transitions/TeleportTransition';
import { useSceneData } from '../../hooks/useScenes';
import { NAV_PATH } from '../../router/paths';
import { useTourismStore } from '../../store/useTourismStore';

// Clean, React-friendly Tour Page component
export default function TourPage() {
  const { sceneId } = useParams<{ sceneId: string }>();
  const { data, isLoading, isError } = useSceneData(sceneId || null);

  const openInspect = useTourismStore((state) => state.openInspect);
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);
  const triggerTeleport = useTourismStore((state) => state.triggerTeleport);

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
      <TeleportTransition />
      <BaseScene sceneConfig={scene}>
        <DynamicSceneRenderer sceneId={sceneId} />

        {interactionPoints.map((point) => {
          const position: [number, number, number] = [point.positionOffset[0], point.positionOffset[1], point.positionOffset[2]];

          return (
            <InteractPoint key={point.pointId} position={position} artifactId={point.artifactId} onInspect={handleInspect} />
          );
        })}
      </BaseScene>

      {/* <div className='absolute right-4 bottom-30 h-120 w-80 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur-lg'>
        <div className='flex h-14 w-full items-center justify-between bg-neutral-800 p-4'>
          <div className='font-headline text-secondary-container flex items-center gap-2'>
            <CompassIcon />
            <p>Bản đồ di chuyển</p>
          </div>
          <XIcon size={18} />
        </div>
        <div className='h-50 w-full bg-black'></div>
        <div className='h-full w-full space-y-2 overflow-y-auto p-2'>
          {data.teleportPoints.map((point) => (
            <div
              key={point.teleportId}
              onClick={() =>
                triggerTeleport({
                  position: point.position as [number, number, number],
                  lookAt: point.lookAt as [number, number, number],
                })
              }
              className='group flex w-full cursor-pointer space-x-4 rounded-2xl p-4 transition-all duration-200 ease-in-out hover:bg-white/10'>
              <div className='bg-primary aspect-square rounded-xl p-4'>
                <MapPinSimpleAreaIcon size={20} />
              </div>
              <div className='space-y-2'>
                <p className='font-headline text-white'>{point.label}</p>
                <p className='font-manrope group-hover:text-secondary-container text-xs text-gray-500 uppercase transition-all ease-in-out'>
                  {point.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <div className='text-secondary-fixed-dim bg-primary hover:bg-primary-container absolute right-4 bottom-4 cursor-pointer rounded-2xl border-4 border-amber-700 p-4 transition-all duration-300 ease-in-out'>
        <MapTrifoldIcon size={48} weight='fill' />
      </div>

      {/* Artifact Inspection Overlay */}
      {selectedArtifactId && <InspectModal />}
    </div>
  );
}
