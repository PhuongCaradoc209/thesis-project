import { CompassIcon, MapPinSimpleAreaIcon, MapTrifoldIcon, XIcon } from '@phosphor-icons/react';
import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import DynamicSceneRenderer from '../../components/3d/DynamicSceneRenderer';
import { InteractPoint } from '../../components/interact-point';
import SceneLoadingOverlay from '../../components/loading/SceneLoadingOverlay';
import InspectModal from '../../components/previews-modal';
import BaseScene from '../../components/scenes/BaseScene';
import TourControlsOnboarding from '../../components/tour/TourControlsOnboarding';
import TeleportTransition from '../../components/transitions/TeleportTransition';
import { useSceneData } from '../../hooks/useScenes';
import { NAV_PATH } from '../../router/paths';
import { useTourismStore } from '../../store/useTourismStore';
import { getScenePresentation } from '../../utils/scenePresentation';

const CONTROLS_ONBOARDING_KEY = 'tour-controls-onboarding-seen:v1';

// Clean, React-friendly Tour Page component
export default function TourPage() {
  const { t } = useTranslation();
  const { sceneId } = useParams<{ sceneId: string }>();
  const { data, isLoading, isError } = useSceneData(sceneId || null);
  const { active: assetsActive, progress: assetsProgress } = useProgress();
  const [eventSource, setEventSource] = useState<HTMLDivElement | null>(null);

  const [isTeleportMapOpen, setIsTeleportMapOpen] = useState(false);
  const [firstFrameRendered, setFirstFrameRendered] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);
  const [isLoadingOverlayGone, setIsLoadingOverlayGone] = useState(false);
  const [hasSeenControls, setHasSeenControls] = useState(() => {
    try {
      return window.localStorage.getItem(CONTROLS_ONBOARDING_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [hasAssetActivity, setHasAssetActivity] = useState(false);
  const [trackedAssetsProgress, setTrackedAssetsProgress] = useState(0);

  const openInspect = useTourismStore((state) => state.openInspect);
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);
  const triggerTeleport = useTourismStore((state) => state.triggerTeleport);
  const setPause = useTourismStore((state) => state.setPause);
  const clearTourState = useTourismStore((state) => state.clear);
  const presentation = getScenePresentation(sceneId || null, t);
  const handleFirstFrame = useCallback(() => setFirstFrameRendered(true), []);

  useEffect(() => {
    setFirstFrameRendered(false);
    setIsSceneReady(false);
    setShowLoadingOverlay(true);
    setIsLoadingOverlayGone(false);
    setHasAssetActivity(false);
    setTrackedAssetsProgress(0);
    setIsTeleportMapOpen(false);
    clearTourState();
  }, [clearTourState, sceneId]);

  useEffect(() => {
    if (!assetsActive) return;

    setHasAssetActivity(true);
    setTrackedAssetsProgress((current) => Math.max(current, assetsProgress));
  }, [assetsActive, assetsProgress, sceneId]);

  useEffect(() => {
    if (!data || !firstFrameRendered || assetsActive || isSceneReady) return;

    // Allow late loader registrations and the renderer's first shader work to
    // settle before declaring the scene interactive.
    const timer = setTimeout(() => setIsSceneReady(true), 300);
    return () => clearTimeout(timer);
  }, [assetsActive, data, firstFrameRendered, isSceneReady]);

  useEffect(() => {
    if (!isSceneReady) return;

    const timer = setTimeout(() => setShowLoadingOverlay(false), 350);
    return () => clearTimeout(timer);
  }, [isSceneReady]);

  // If there's an error or no sceneId provided, fallback to map
  if (!sceneId || isError) {
    return <Navigate to={NAV_PATH.MAP} replace />;
  }

  if (isLoading || !data) {
    return <SceneLoadingOverlay presentation={presentation} progress={8} statusText={t('loading.status.preparing')} />;
  }

  const { scene, interactionPoints, teleportPoints } = data;
  const loadingProgress = isSceneReady
    ? 100
    : firstFrameRendered && !assetsActive
      ? 98
      : hasAssetActivity
        ? Math.min(95, Math.max(15, 15 + trackedAssetsProgress * 0.8))
        : 15;
  const loadingStatus = assetsActive
    ? t('loading.status.loadingTextures')
    : firstFrameRendered
      ? t('loading.status.finalizingScene')
      : t('loading.status.optimizingMeshes');

  const handleInspect = (artifactId: string) => {
    openInspect(artifactId);
  };

  const closeTeleportMap = () => {
    setIsTeleportMapOpen(false);
    if (!selectedArtifactId) setPause(false);
  };

  const toggleTeleportMap = () => {
    const next = !isTeleportMapOpen;
    setIsTeleportMapOpen(next);
    // Keep external store updates in the event handler. Calling setPause from
    // inside a React state updater can update BaseScene during TourPage render.
    setPause(next || Boolean(selectedArtifactId));
  };

  const dismissControlsOnboarding = () => {
    setHasSeenControls(true);
    try {
      window.localStorage.setItem(CONTROLS_ONBOARDING_KEY, 'true');
    } catch {
      // Keep the current visit usable if storage is unavailable.
    }
  };

  return (
    <div ref={setEventSource} className='relative h-screen w-screen overflow-hidden bg-black text-white'>
      <TeleportTransition />
      <BaseScene
        key={sceneId}
        sceneConfig={scene}
        loading={!isSceneReady}
        onFirstFrame={handleFirstFrame}
        eventSource={eventSource ?? undefined}>
        <DynamicSceneRenderer sceneId={sceneId} />

        {interactionPoints.map((point) => {
          const position: [number, number, number] = [point.positionOffset[0], point.positionOffset[1], point.positionOffset[2]];

          return (
            <InteractPoint key={point.pointId} position={position} artifactId={point.artifactId} onInspect={handleInspect} />
          );
        })}
      </BaseScene>

      <AnimatePresence>
        {isTeleportMapOpen && (
          <motion.div
            className='absolute right-4 bottom-28 z-10 flex h-120 w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur-lg'
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}>
            <div className='flex h-14 w-full items-center justify-between bg-neutral-800 p-4'>
              <div className='font-headline text-secondary-container flex items-center gap-2'>
                <CompassIcon />
                <p>Bản đồ di chuyển</p>
              </div>
              <button className='cursor-pointer' onClick={closeTeleportMap} aria-label='Đóng bản đồ di chuyển'>
                <XIcon size={18} />
              </button>
            </div>

            <div className='h-40 w-full bg-black/40' />

            <div className='min-h-0 w-full flex-1 space-y-2 overflow-y-auto p-2'>
              {teleportPoints?.length ? (
                teleportPoints.map((point) => (
                  <div
                    key={point.teleportId}
                    onClick={() => {
                      triggerTeleport({
                        position: point.position as [number, number, number],
                        lookAt: point.lookAt as [number, number, number],
                      });
                      closeTeleportMap();
                    }}
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
                ))
              ) : (
                <div className='p-4 text-sm text-slate-300'>Chưa có điểm dịch chuyển.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type='button'
        onClick={toggleTeleportMap}
        className='text-secondary-fixed-dim bg-primary hover:bg-primary-container absolute right-4 bottom-4 z-10 cursor-pointer rounded-2xl border-4 border-amber-700 p-4 transition-all duration-300 ease-in-out'
        aria-label={isTeleportMapOpen ? 'Đóng bản đồ di chuyển' : 'Mở bản đồ di chuyển'}>
        <MapTrifoldIcon size={48} weight='fill' />
      </button>

      {isSceneReady &&
        !showLoadingOverlay &&
        isLoadingOverlayGone &&
        !hasSeenControls &&
        !selectedArtifactId &&
        !isTeleportMapOpen && (
          <div className='pointer-events-none absolute bottom-28 left-4 z-30 w-[min(24rem,calc(100vw-2rem))] sm:bottom-4'>
            <TourControlsOnboarding onDismiss={dismissControlsOnboarding} />
          </div>
        )}

      {/* Artifact Inspection Overlay */}
      {selectedArtifactId && <InspectModal />}

      <AnimatePresence onExitComplete={() => setIsLoadingOverlayGone(true)}>
        {showLoadingOverlay && (
          <SceneLoadingOverlay presentation={presentation} progress={loadingProgress} statusText={loadingStatus} />
        )}
      </AnimatePresence>
    </div>
  );
}
