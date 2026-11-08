import { CompassIcon, MapPinSimpleAreaIcon, XIcon } from '@phosphor-icons/react';
import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'motion/react';
import { Fragment, Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import DynamicSceneRenderer from '../../components/3d/DynamicSceneRenderer';
import { GalleryExhibits } from '../../components/gallery/GalleryExhibits';
import { ModelErrorBoundary } from '../../components/3d/ModelErrorBoundary';
import { InstancedGrassField } from '../../components/grass/InstancedGrassField';
import { DevelopmentGuidedCameraDirector, GuidedCameraDirector } from '../../components/guided-tour/GuidedCameraDirector';
import { GuidedReachTarget } from '../../components/guided-tour/GuidedReachTarget';
import { GuidedTourUi } from '../../components/guided-tour/GuidedTourUi';
import { InteractPoint } from '../../components/interact-point';
import { SCENE_ANNOTATION_INTERACTION_DISTANCE } from '../../components/interactions/sceneInteraction.constants';
import SceneLoadingOverlay from '../../components/loading/SceneLoadingOverlay';
import InspectModal from '../../components/previews-modal';
import { SceneAnnotationPanel, type SceneAnnotationPreview } from '../../components/scene-annotation/SceneAnnotationPanel';
import { SceneAnnotationPoint } from '../../components/scene-annotation/SceneAnnotationPoint';
import BaseScene from '../../components/scenes/BaseScene';
import IndoorScene from '../../components/scenes/indoor/IndoorScene';
import { getViewpoint } from '../../components/scenes/indoor/roomLayout';
import { SettingsPanel } from '../../components/settings/SettingsPanel';
import ControlsHint from '../../components/tour/ControlsHint';
import TourControlsOnboarding from '../../components/tour/TourControlsOnboarding';
import { TourToolbar } from '../../components/tour/TourToolbar';
import TeleportTransition from '../../components/transitions/TeleportTransition';
import { SCENE_IDS } from '../../constants/markers';
import { useGalleryArtifacts } from '../../hooks/useArtifacts';
import { useGuidedTours } from '../../hooks/useGuidedTours';
import { useSceneData } from '../../hooks/useScenes';
import { NAV_PATH } from '../../router/paths';
import { useTourismStore } from '../../store/useTourismStore';
import { useGuidedTourStore } from '../../store/useGuidedTourStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { pickLang } from '../../utils/pickLang';
import { getScenePresentation } from '../../utils/scenePresentation';

const CONTROLS_ONBOARDING_KEY = 'tour-controls-onboarding-seen:v1';

export default function TourPage() {
  const { t, i18n } = useTranslation();
  const { sceneId } = useParams<{ sceneId: string }>();
  const { data, isLoading, isError } = useSceneData(sceneId || null);
  const { data: guidedTours = [], isError: isGuidedToursError } = useGuidedTours(sceneId || null);
  const { data: galleryArtifacts = [] } = useGalleryArtifacts(sceneId ?? '', data?.scene.layout === 'indoor');
  const { active: assetsActive, progress: assetsProgress } = useProgress();
  const [eventSource, setEventSource] = useState<HTMLDivElement | null>(null);

  const [isTeleportMapOpen, setIsTeleportMapOpen] = useState(false);
  const [selectedSceneAnnotation, setSelectedSceneAnnotation] = useState<SceneAnnotationPreview | null>(null);
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
  const guidedTour = useGuidedTourStore((state) => state.tour);
  const guidedStatus = useGuidedTourStore((state) => state.status);
  const guidedStepIndex = useGuidedTourStore((state) => state.currentStepIndex);
  const isGuidedIntroOpen = useGuidedTourStore((state) => state.isIntroOpen);
  const isGuidedCompletionOpen = useGuidedTourStore((state) => state.isCompletionOpen);
  const isGuidedJournalOpen = useGuidedTourStore((state) => state.isJournalOpen);
  const isSettingsOpen = useSettingsStore((state) => state.isSettingsOpen);
  const openSettings = useSettingsStore((state) => state.openSettings);
  const closeSettings = useSettingsStore((state) => state.closeSettings);
  const openGuidedJournal = useGuidedTourStore((state) => state.openJournal);
  const closeGuidedJournal = useGuidedTourStore((state) => state.closeJournal);
  const guidedCompletionPending = useGuidedTourStore((state) => state.completionPending);
  const attachGuidedTour = useGuidedTourStore((state) => state.attachTour);
  const detachGuidedTour = useGuidedTourStore((state) => state.detachTour);
  const reportGuidedEvent = useGuidedTourStore((state) => state.reportEvent);
  const showGuidedCompletion = useGuidedTourStore((state) => state.showPendingCompletion);
  const presentation = getScenePresentation(sceneId || null, t);
  const handleFirstFrame = useCallback(() => setFirstFrameRendered(true), []);
  const currentGuidedStep = guidedTour?.steps[guidedStepIndex];

  useEffect(() => {
    setFirstFrameRendered(false);
    setIsSceneReady(false);
    setShowLoadingOverlay(true);
    setIsLoadingOverlayGone(false);
    setHasAssetActivity(false);
    setTrackedAssetsProgress(0);
    setIsTeleportMapOpen(false);
    setSelectedSceneAnnotation(null);
    clearTourState();
  }, [clearTourState, sceneId]);

  useEffect(() => () => detachGuidedTour(), [detachGuidedTour, sceneId]);

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

  useEffect(() => {
    if (!isSceneReady || showLoadingOverlay || !isLoadingOverlayGone || !hasSeenControls) return;

    const sceneTour = guidedTours[0];
    if (sceneTour) attachGuidedTour(sceneTour, true);
  }, [attachGuidedTour, guidedTours, hasSeenControls, isLoadingOverlayGone, isSceneReady, showLoadingOverlay]);

  useEffect(() => {
    if (!isGuidedToursError) return;
    console.error(`[GuidedTour] Failed to load tours for scene ${sceneId}.`);
  }, [isGuidedToursError, sceneId]);

  useEffect(() => {
    const guidedOverlayOpen = isGuidedIntroOpen || isGuidedCompletionOpen || isGuidedJournalOpen || guidedStatus === 'cinematic';
    if (guidedOverlayOpen || isSettingsOpen) {
      setPause(true);
      return;
    }

    if (!selectedArtifactId && !selectedSceneAnnotation && !isTeleportMapOpen) setPause(false);
  }, [
    guidedStatus,
    isGuidedCompletionOpen,
    isGuidedIntroOpen,
    isGuidedJournalOpen,
    isSettingsOpen,
    isTeleportMapOpen,
    selectedArtifactId,
    selectedSceneAnnotation,
    setPause,
  ]);

  useEffect(() => {
    if (
      guidedStatus === 'completed' &&
      guidedCompletionPending &&
      !selectedArtifactId &&
      !selectedSceneAnnotation &&
      !isTeleportMapOpen
    ) {
      showGuidedCompletion();
    }
  }, [
    guidedCompletionPending,
    guidedStatus,
    isTeleportMapOpen,
    selectedArtifactId,
    selectedSceneAnnotation,
    showGuidedCompletion,
  ]);

  const openSceneAnnotation = useCallback(
    (annotation: SceneAnnotationPreview) => {
      setSelectedSceneAnnotation(annotation);
      setPause(true);
      reportGuidedEvent({ type: 'scene_point_opened', targetId: annotation.pointId });
    },
    [reportGuidedEvent, setPause],
  );

  const closeSceneAnnotation = useCallback(() => {
    setSelectedSceneAnnotation(null);
    if (!selectedArtifactId && !isTeleportMapOpen) setPause(false);
  }, [isTeleportMapOpen, selectedArtifactId, setPause]);

  // If there's an error or no sceneId provided, fallback to map
  if (!sceneId || isError) {
    return <Navigate to={NAV_PATH.MAP} replace />;
  }

  if (isLoading || !data) {
    return <SceneLoadingOverlay presentation={presentation} progress={8} statusText={t('loading.status.preparing')} />;
  }

  const { scene, interactionPoints, teleportPoints } = data;
  const teleportList: { teleportId: string; label: string; position: number[]; lookAt: number[] }[] =
    scene.layout === 'indoor'
      ? galleryArtifacts
          .filter((artifact) => artifact.spot !== undefined)
          .map((artifact) => ({
            teleportId: artifact.artifactId,
            label: pickLang(artifact.title, i18n.language),
            ...getViewpoint(artifact.mount === 'wall', artifact.spot ?? 0),
          }))
      : teleportPoints;
  // Ngoài trời (mặc định) hay phòng trong nhà, theo trường `layout` của scene trên Firestore
  const SceneView = scene.layout === 'indoor' ? IndoorScene : BaseScene;
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
    reportGuidedEvent({ type: 'artifact_opened', targetId: artifactId });
  };

  const closeTeleportMap = () => {
    setIsTeleportMapOpen(false);
    if (!selectedArtifactId && !selectedSceneAnnotation) setPause(false);
  };

  const toggleTeleportMap = () => {
    const next = !isTeleportMapOpen;
    setIsTeleportMapOpen(next);
    // Keep external store updates in the event handler. Calling setPause from
    // inside a React state updater can update BaseScene during TourPage render.
    setPause(next || Boolean(selectedArtifactId) || Boolean(selectedSceneAnnotation));
  };

  const toggleJournal = () => (isGuidedJournalOpen ? closeGuidedJournal() : openGuidedJournal());

  const toggleSettings = () => {
    if (isSettingsOpen) {
      closeSettings();
      return;
    }
    // Panel cài đặt phủ góc phải nên đóng bản đồ trước; pause do effect isSettingsOpen đảm nhận
    setIsTeleportMapOpen(false);
    openSettings();
  };

  const replayControlsOnboarding = () => {
    closeSettings();
    setHasSeenControls(false);
  };

  const dismissControlsOnboarding = () => {
    setHasSeenControls(true);
    try {
      window.localStorage.setItem(CONTROLS_ONBOARDING_KEY, 'true');
    } catch {
      // Keep the current visit usable if storage is unavailable.
    }
  };

  const isHudVisible =
    isLoadingOverlayGone &&
    guidedStatus !== 'cinematic' &&
    !isGuidedIntroOpen &&
    !isGuidedCompletionOpen &&
    !isGuidedJournalOpen &&
    !selectedArtifactId &&
    !selectedSceneAnnotation;

  return (
    <div ref={setEventSource} className='relative h-screen w-screen overflow-hidden bg-black text-white'>
      <TeleportTransition />
      <SceneView
        key={sceneId}
        sceneConfig={scene}
        loading={!isSceneReady}
        onFirstFrame={handleFirstFrame}
        eventSource={eventSource ?? undefined}>
        <DynamicSceneRenderer sceneId={sceneId} />

        {/* Phòng trưng bày: hiện vật lấy từ Firestore, đặt lên bục theo số `pedestal` */}
        {scene.layout === 'indoor' && <GalleryExhibits sceneId={sceneId} onInspect={handleInspect} />}

        {sceneId === SCENE_IDS.TU_DUC && scene.floorConfig?.heightMap && scene.floorConfig.splatMap && (
          <ModelErrorBoundary
            resetKey={`${scene.floorConfig.heightMap}:${scene.floorConfig.splatMap}`}
            fallback={() => null}
            onError={(error) => console.error('[Grass] Failed to create the grass field.', error)}>
            <Suspense fallback={null}>
              <InstancedGrassField config={scene.floorConfig} />
            </Suspense>
          </ModelErrorBoundary>
        )}

        {guidedTour?.intro && (import.meta.env.DEV ? <DevelopmentGuidedCameraDirector /> : <GuidedCameraDirector />)}

        {guidedStatus !== 'cinematic' &&
          interactionPoints.map((point) => {
            const position: [number, number, number] = [
              point.positionOffset[0],
              point.positionOffset[1],
              point.positionOffset[2],
            ];

            if (point.type === 'scene_annotation') {
              const annotation: SceneAnnotationPreview = {
                pointId: point.pointId,
                position,
                title: point.title,
                description: point.description,
                images: point.images ?? [],
              };
              const isReachTarget =
                guidedStatus === 'active' &&
                currentGuidedStep?.type === 'reach_scene_point' &&
                currentGuidedStep.targetId === point.pointId;

              return (
                <Fragment key={point.pointId}>
                  {isReachTarget && <GuidedReachTarget targetId={point.pointId} />}
                  <SceneAnnotationPoint
                    interactionId={point.pointId}
                    title={point.title}
                    position={position}
                    maxDistance={isReachTarget ? (currentGuidedStep.radius ?? SCENE_ANNOTATION_INTERACTION_DISTANCE) : undefined}
                    guidedTarget={
                      isReachTarget ||
                      (guidedStatus === 'active' &&
                        currentGuidedStep?.type === 'inspect_scene_point' &&
                        currentGuidedStep.targetId === point.pointId)
                    }
                    onInteract={() => openSceneAnnotation(annotation)}
                  />
                </Fragment>
              );
            }

            return (
              <InteractPoint
                key={point.pointId}
                interactionId={point.pointId}
                position={position}
                artifactId={point.artifactId}
                guidedTarget={
                  guidedStatus === 'active' &&
                  currentGuidedStep?.type === 'inspect_artifact' &&
                  currentGuidedStep.targetId === point.artifactId
                }
                onInspect={handleInspect}
              />
            );
          })}
      </SceneView>

      <AnimatePresence>
        {isTeleportMapOpen && (
          <motion.div
            role='dialog'
            aria-labelledby='teleport-title'
            className='text-on-surface border-on-background bg-surface-bright absolute right-22 bottom-4 z-30 flex max-h-[28rem] w-80 flex-col overflow-hidden border-[1.5px] md:right-25 md:bottom-6'
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}>
            <div className='border-on-background flex items-center justify-between border-b-[1.5px] px-4 py-3'>
              <h2
                id='teleport-title'
                className='font-headline text-on-background flex items-center gap-2 text-lg font-extrabold uppercase [font-stretch:80%]'>
                <CompassIcon size={20} />
                {t('teleport.title')}
              </h2>
              <button
                type='button'
                className='text-on-surface-variant rounded-md p-1.5 transition-colors hover:bg-amber-950/5'
                onClick={closeTeleportMap}
                aria-label={t('teleport.close')}>
                <XIcon size={18} />
              </button>
            </div>

            <div className='annotation-scrollbar min-h-0 w-full flex-1 overflow-y-auto overscroll-contain p-2'>
              {teleportList.length ? (
                <ul className='space-y-1'>
                  {teleportList.map((point) => (
                    <li key={point.teleportId}>
                      <button
                        type='button'
                        onClick={() => {
                          triggerTeleport({
                            position: point.position as [number, number, number],
                            lookAt: point.lookAt as [number, number, number],
                          });
                          reportGuidedEvent({ type: 'teleport_selected', targetId: point.teleportId });
                          closeTeleportMap();
                        }}
                        className='hover:bg-surface-container-high flex w-full items-center gap-3 px-3 py-3 text-left transition-colors'>
                        <span className='bg-primary text-on-primary flex h-9 w-9 shrink-0 items-center justify-center'>
                          <MapPinSimpleAreaIcon size={18} />
                        </span>
                        <span className='font-headline text-[15px]'>{t(point.label)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-on-surface-variant p-4 text-sm leading-6'>{t('teleport.empty')}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isHudVisible && hasSeenControls && !isTeleportMapOpen && <ControlsHint />}

      <TourToolbar
        visible={isHudVisible}
        shortcutsEnabled={
          isLoadingOverlayGone &&
          guidedStatus !== 'cinematic' &&
          !isGuidedIntroOpen &&
          !isGuidedCompletionOpen &&
          !selectedArtifactId &&
          !selectedSceneAnnotation
        }
        showJournal={Boolean(guidedTour)}
        isMapOpen={isTeleportMapOpen}
        isJournalOpen={isGuidedJournalOpen}
        isSettingsOpen={isSettingsOpen}
        onToggleMap={toggleTeleportMap}
        onToggleJournal={toggleJournal}
        onToggleSettings={toggleSettings}
      />

      <AnimatePresence>
        {isSettingsOpen && <SettingsPanel onClose={closeSettings} onReplayControls={replayControlsOnboarding} />}
      </AnimatePresence>

      {isSceneReady &&
        !showLoadingOverlay &&
        isLoadingOverlayGone &&
        !hasSeenControls &&
        !selectedArtifactId &&
        !selectedSceneAnnotation &&
        !isTeleportMapOpen &&
        guidedStatus !== 'cinematic' &&
        !isGuidedJournalOpen && (
          <div className='pointer-events-none absolute bottom-28 left-4 z-30 w-[min(24rem,calc(100vw-2rem))] sm:bottom-4'>
            <TourControlsOnboarding onDismiss={dismissControlsOnboarding} />
          </div>
        )}

      {/* Artifact Inspection Overlay */}
      {selectedArtifactId && (
        <InspectModal
          guidedAnnotationId={
            guidedStatus === 'active' &&
            currentGuidedStep?.type === 'view_artifact_annotation' &&
            currentGuidedStep.artifactId === selectedArtifactId
              ? currentGuidedStep.targetId
              : null
          }
          onAnnotationOpen={(artifactId, annotationId) =>
            reportGuidedEvent({ type: 'artifact_annotation_opened', artifactId, targetId: annotationId })
          }
        />
      )}

      <AnimatePresence>
        {selectedSceneAnnotation && <SceneAnnotationPanel annotation={selectedSceneAnnotation} onClose={closeSceneAnnotation} />}
      </AnimatePresence>

      <AnimatePresence onExitComplete={() => setIsLoadingOverlayGone(true)}>
        {showLoadingOverlay && (
          <SceneLoadingOverlay presentation={presentation} progress={loadingProgress} statusText={loadingStatus} />
        )}
      </AnimatePresence>

      <GuidedTourUi
        hideHud={Boolean(selectedSceneAnnotation || isTeleportMapOpen)}
        hideLauncher={Boolean(selectedArtifactId || selectedSceneAnnotation || isTeleportMapOpen)}
      />
    </div>
  );
}
