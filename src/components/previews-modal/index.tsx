import { ArrowCounterClockwiseIcon, CaretLeftIcon, CaretRightIcon, InfoIcon, XIcon } from '@phosphor-icons/react';
import { useGLTF, useProgress, View } from '@react-three/drei';
import { AnimatePresence, motion } from 'motion/react';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelErrorBoundary } from '../3d/ModelErrorBoundary';
import ModelLoadingBar from '../loading/ModelLoadingBar';
import { useArtifactData } from '../../hooks/useArtifacts';
import { pickLang } from '../../utils/pickLang';
import { useTourismStore } from '../../store/useTourismStore';
import { ArtifactPreviewScene } from './ModelPreviewCanvas';

type InspectModalProps = {
  guidedAnnotationId?: string | null;
  onAnnotationOpen?: (artifactId: string, annotationId: string) => void;
};

function InspectModal({ guidedAnnotationId, onAnnotationOpen }: InspectModalProps) {
  const { t, i18n } = useTranslation();
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);
  const clear = useTourismStore((state) => state.clear);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [previewAttempt, setPreviewAttempt] = useState(0);
  const [previewError, setPreviewError] = useState<Error | null>(null);
  const [cameraResetRequest, setCameraResetRequest] = useState(0);
  const { active: isModelLoading } = useProgress();

  const { data: previewConfig, isLoading, isError, refetch } = useArtifactData(selectedArtifactId);
  const previewAnnotations = Object.values(previewConfig?.annotation ?? {});
  const artifactFacts = [
    { label: t('artifact.dynasty'), value: previewConfig?.dynasty },
    { label: t('artifact.material'), value: previewConfig?.material },
    { label: t('artifact.year'), value: previewConfig?.year },
  ]
    .filter((fact) => fact.value !== undefined && fact.value !== null && fact.value !== '')
    .map((fact) => ({ label: fact.label, value: t(String(fact.value)) }));

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className='absolute inset-0 z-20'
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={clear}>
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className='text-on-surface relative flex h-full w-full flex-col overflow-hidden bg-transparent shadow-2xl'
          exit={{ opacity: 0, scale: 0.98, y: 18 }}
          initial={{ opacity: 0, scale: 0.985, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}>
          <motion.header
            animate={{ opacity: 1, y: 0 }}
            className='relative z-30 flex h-18 items-center justify-between border-b border-amber-950/12 bg-[#f3e7cf] px-4 md:px-6'
            initial={{ opacity: 0, y: -16 }}
            transition={{ delay: 0.08, duration: 0.26 }}>
            <div className='min-w-0'>
              {previewConfig?.type && (
                <p className='text-secondary text-[0.7rem] font-semibold tracking-[0.24em] uppercase'>{t(previewConfig.type)}</p>
              )}
              <h1 className='font-headline text-primary truncate text-xl font-semibold md:text-2xl'>
                {previewConfig ? t(pickLang(previewConfig.title, i18n.language)) : ''}
              </h1>
            </div>

            <button
              type='button'
              aria-label={t('artifact.close')}
              className='text-on-surface-variant flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-amber-950/5'
              onClick={clear}>
              <XIcon size={20} />
            </button>
          </motion.header>

          <div className='relative flex min-h-0 flex-1 overflow-hidden'>
            <motion.section
              animate={{ opacity: 1, x: 0 }}
              className='relative min-w-0 flex-1 border-r border-white/8'
              initial={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.14, duration: 0.32 }}>
              <div className='flex h-full min-h-0 flex-col bg-transparent'>
                <div className='relative min-h-0 flex-1 overflow-hidden border-white/10 bg-transparent'>
                  {isLoading ? (
                    <div className='relative h-full'>
                      <ModelLoadingBar label={t('loading.status.preparing')} />
                    </div>
                  ) : isError ? (
                    <div className='bg-surface/90 text-on-surface flex h-full flex-col items-center justify-center gap-4 px-6 text-center backdrop-blur-sm'>
                      <p className='font-headline text-primary text-base font-semibold'>{t('artifact.dataLoadError')}</p>
                      <button
                        type='button'
                        className='bg-primary hover:bg-primary-container rounded-md px-5 py-2 font-semibold text-white'
                        onClick={() => void refetch()}>
                        {t('artifact.retry')}
                      </button>
                    </div>
                  ) : previewConfig ? (
                    <View className='h-full w-full'>
                      <ModelErrorBoundary
                        resetKey={`${previewConfig.modelUrl}:${previewAttempt}`}
                        onError={(error) => {
                          console.error(`[InspectModal] Failed to load artifact model ${selectedArtifactId}`, error);
                          setPreviewError(error);
                        }}
                        fallback={() => null}>
                        <Suspense fallback={null}>
                          <ArtifactPreviewScene
                            modelUrl={previewConfig.modelUrl}
                            cameraPosition={previewConfig.cameraPosition}
                            modelPosition={previewConfig.modelPosition}
                            orbitTarget={previewConfig.orbitTarget}
                            annotations={previewAnnotations}
                            resetRequest={cameraResetRequest}
                            guidedAnnotationId={guidedAnnotationId}
                            onAnnotationOpen={(annotationId) => {
                              if (selectedArtifactId) onAnnotationOpen?.(selectedArtifactId, annotationId);
                            }}
                          />
                        </Suspense>
                      </ModelErrorBoundary>
                    </View>
                  ) : (
                    <div className='text-on-surface-variant flex h-full items-center justify-center bg-[#f3e7cf]/90 px-6 text-center'>
                      {t('artifact.missingConfig')}
                    </div>
                  )}

                  {!isLoading && previewConfig && previewError && (
                    <div className='bg-surface/90 text-on-surface absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center backdrop-blur-sm'>
                      <p className='font-headline text-primary text-base font-semibold'>{t('artifact.modelLoadError')}</p>
                      <button
                        type='button'
                        className='bg-primary hover:bg-primary-container rounded-md px-5 py-2 font-semibold text-white'
                        onClick={() => {
                          useGLTF.clear(previewConfig.modelUrl);
                          setPreviewError(null);
                          setPreviewAttempt((current) => current + 1);
                        }}>
                        {t('artifact.retry')}
                      </button>
                    </div>
                  )}

                  <AnimatePresence>
                    {!isLoading && previewConfig && !previewError && isModelLoading && (
                      <motion.div
                        key='model-loading-bar'
                        className='pointer-events-none absolute inset-0 z-20'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}>
                        <ModelLoadingBar label={t('artifact.loadingModel')} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {!isLoading && !isError && previewConfig && !previewError && !isModelLoading && (
                  <div className='text-on-surface-variant relative flex shrink-0 items-center border-t border-amber-950/12 bg-[#ead7b5]/95 px-4 py-2 text-xs'>
                    <p className='pointer-events-none flex-1 text-center'>{t('previewControls')}</p>
                    <button
                      type='button'
                      aria-label={t('artifact.resetCamera')}
                      title={t('artifact.resetCamera')}
                      className='text-primary absolute right-3 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-semibold transition-colors hover:bg-white/40'
                      onClick={() => setCameraResetRequest((current) => current + 1)}>
                      <ArrowCounterClockwiseIcon size={16} />
                      <span className='hidden sm:inline'>{t('artifact.resetCamera')}</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.section>

            <motion.aside
              animate={{ width: isPanelCollapsed ? 28 : 360 }}
              className='relative flex h-full shrink-0 border-l border-[#b69462]/55 bg-[#f3e7cf]'
              initial={false}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <button
                aria-label={isPanelCollapsed ? t('artifact.expandPanel') : t('artifact.collapsePanel')}
                className='text-primary absolute top-1/2 -left-4 z-20 flex h-14 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#b69462]/55 bg-[#f3e7cf] shadow-[0_8px_24px_rgba(20,12,7,0.2)] transition-colors hover:bg-[#f8edd9]'
                onClick={() => setIsPanelCollapsed((previous) => !previous)}>
                {isPanelCollapsed ? <CaretLeftIcon size={18} /> : <CaretRightIcon size={18} />}
              </button>

              <AnimatePresence initial={false} mode='wait'>
                {!isPanelCollapsed ? (
                  <motion.div
                    key='panel-open'
                    animate={{ opacity: 1, x: 0 }}
                    className='flex h-full w-full min-w-0 flex-col overflow-y-auto p-4 md:p-5'
                    exit={{ opacity: 0, x: 24 }}
                    initial={{ opacity: 0, x: 32 }}
                    transition={{ duration: 0.22 }}>
                    {isLoading ? (
                      <div className='animate-pulse space-y-4'>
                        <div className='h-6 w-1/2 rounded bg-amber-950/10' />
                        <div className='h-4 w-1/3 rounded bg-amber-950/10' />
                        <div className='space-y-2'>
                          <div className='h-4 w-full rounded bg-amber-950/10' />
                          <div className='h-4 w-full rounded bg-amber-950/10' />
                          <div className='h-4 w-3/4 rounded bg-amber-950/10' />
                        </div>
                      </div>
                    ) : previewConfig ? (
                      <>
                        <h2 className='font-headline text-primary flex items-center gap-2 text-xl font-semibold'>
                          <InfoIcon size={20} />
                          {t('artifact.statistics')}
                        </h2>
                        <div className='mt-2 mb-4 flex items-center gap-1.5' aria-hidden='true'>
                          <span className='bg-secondary h-px w-10' />
                          <span className='border-secondary h-1.5 w-1.5 rotate-45 border' />
                        </div>
                        {/* Chỉ hiện trường có dữ liệu, không in "Chưa rõ" cho từng dòng */}
                        {artifactFacts.length > 0 && (
                          <dl className='mb-4 border-t border-amber-950/12'>
                            {artifactFacts.map((fact) => (
                              <div
                                key={fact.label}
                                className='flex justify-between gap-4 border-b border-amber-950/12 py-2.5 text-sm'>
                                <dt className='text-on-surface-variant'>{fact.label}</dt>
                                <dd className='text-right font-semibold'>{fact.value}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        <p className='text-on-surface-variant text-[15px] leading-7'>
                          {previewConfig.history
                            ? t(pickLang(previewConfig.history, i18n.language))
                            : t('artifact.noInformation')}
                        </p>
                      </>
                    ) : (
                      <div className='text-on-surface-variant text-center'>{t('artifact.noDetails')}</div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key='panel-collapsed'
                    animate={{ opacity: 1 }}
                    className='flex h-full w-full items-center justify-center'
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}>
                    <div className='text-on-surface-variant -rotate-90 text-[0.7rem] tracking-[0.35em] whitespace-nowrap uppercase'>
                      {t('artifact.reviewPanel')}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.aside>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default InspectModal;
