import { CaretLeftIcon, CaretRightIcon, InfoIcon, XIcon } from '@phosphor-icons/react';
import { useGLTF, useProgress, View } from '@react-three/drei';
import { AnimatePresence, motion } from 'motion/react';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelErrorBoundary } from '../3d/ModelErrorBoundary';
import ModelLoadingBar from '../loading/ModelLoadingBar';
import { useArtifactData } from '../../hooks/useArtifacts';
import { useTourismStore } from '../../store/useTourismStore';
import { ArtifactPreviewScene } from './ModelPreviewCanvas';

function InspectModal() {
  const { t } = useTranslation();
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);
  const clear = useTourismStore((state) => state.clear);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [previewAttempt, setPreviewAttempt] = useState(0);
  const [previewError, setPreviewError] = useState<Error | null>(null);
  const { active: isModelLoading } = useProgress();

  const { data: previewConfig, isLoading, isError, refetch } = useArtifactData(selectedArtifactId);

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
          className='relative flex h-full w-full flex-col overflow-hidden bg-transparent text-slate-50 shadow-2xl'
          exit={{ opacity: 0, scale: 0.98, y: 18 }}
          initial={{ opacity: 0, scale: 0.985, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}>
          <motion.header
            animate={{ opacity: 1, y: 0 }}
            className='relative z-30 flex h-18 items-center justify-between border-b border-slate-200/60 bg-white/95 px-4 backdrop-blur-md md:px-6'
            initial={{ opacity: 0, y: -16 }}
            transition={{ delay: 0.08, duration: 0.26 }}>
            <div className='flex min-w-0 items-center gap-3 md:gap-6'>
              <h1 className='font-headline text-xl font-bold tracking-tighter text-red-800 uppercase'>VIETNAM VIRTUAL</h1>
            </div>

            <button
              className='bg-primary hover:bg-primary-container cursor-pointer rounded-full p-2 transition-colors'
              onClick={clear}>
              <XIcon size={20} className='transition-colors hover:text-slate-200' color='white' />
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
                            cameraPosition={previewConfig.cameraPosition as [number, number, number]}
                          />
                        </Suspense>
                      </ModelErrorBoundary>
                    </View>
                  ) : (
                    <div className='flex h-full items-center justify-center border border-dashed border-white/15 bg-slate-950/40 px-6 text-center text-slate-400'>
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

                  {!isLoading && previewConfig && (
                    <div className='bg-contrast/70 absolute top-3 left-6 space-y-1 rounded-xl border-gray-200 px-6 py-4'>
                      <h2 className='title truncate text-lg font-semibold text-white italic md:text-xl'>{previewConfig.title}</h2>
                      {previewConfig.type && <span className='text-secondary text-sm uppercase'>{previewConfig.type}</span>}
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            <motion.aside
              animate={{ width: isPanelCollapsed ? 28 : 360 }}
              className='relative flex h-full shrink-0 border-l bg-gray-100 backdrop-blur-xl'
              initial={false}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <button
                aria-label={isPanelCollapsed ? t('artifact.expandPanel') : t('artifact.collapsePanel')}
                className='bg-button-primary hover:bg-primary absolute top-1/2 -left-4 z-20 flex h-14 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-slate-100 shadow-lg transition-colors'
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
                        <div className='h-6 w-1/2 rounded bg-gray-300' />
                        <div className='h-4 w-1/3 rounded bg-gray-300' />
                        <div className='space-y-2'>
                          <div className='h-4 w-full rounded bg-gray-300' />
                          <div className='h-4 w-full rounded bg-gray-300' />
                          <div className='h-4 w-3/4 rounded bg-gray-300' />
                        </div>
                      </div>
                    ) : previewConfig ? (
                      <>
                        <div className='flex items-center gap-2'>
                          <InfoIcon size={20} className='text-primary' />
                          <p className='title text-primary text-xl'>{t('artifact.statistics')}</p>
                        </div>
                        <p className='text-secondary mt-1 text-sm uppercase'>
                          {t('artifact.dynasty')} <span>{previewConfig.dynasty ?? t('artifact.unknown')}</span>
                        </p>

                        <div className='border-l-primary mt-6 border-l-4 pl-2'>
                          <p className='text-neutral-900'>
                            {t('artifact.material')}: <span>{previewConfig.material ?? t('artifact.unknown')}</span>
                          </p>
                        </div>
                        <div className='border-l-primary mt-6 border-l-4 pl-2'>
                          <p className='text-neutral-900'>
                            {t('artifact.year')}: <span>{previewConfig.year ?? t('artifact.unknown')}</span>
                          </p>
                        </div>

                        <div className='mt-4 rounded-md bg-[#FFF1EA] p-2 text-neutral-900'>
                          <p className='mt-1 text-sm leading-6'>{previewConfig.history ?? t('artifact.noInformation')}</p>
                        </div>
                      </>
                    ) : (
                      <div className='text-center text-slate-500'>{t('artifact.noDetails')}</div>
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
                    <div className='-rotate-90 text-[0.7rem] tracking-[0.35em] whitespace-nowrap text-slate-400 uppercase'>
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
