import { ArrowCounterClockwiseIcon, XIcon } from '@phosphor-icons/react';
import { useGLTF, useProgress, View } from '@react-three/drei';
import { AnimatePresence, motion } from 'motion/react';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelErrorBoundary } from '../3d/ModelErrorBoundary';
import ModelLoadingBar from '../loading/ModelLoadingBar';
import { getLicenseUrl } from '../../constants/credits';
import { useArtifactData } from '../../hooks/useArtifacts';
import { pickLang } from '../../utils/pickLang';
import { useTourismStore } from '../../store/useTourismStore';
import { ArtifactPreviewScene } from './ModelPreviewCanvas';

type InspectModalProps = {
  guidedAnnotationId?: string | null;
  onAnnotationOpen?: (artifactId: string, annotationId: string) => void;
};

const RETRY_BUTTON =
  'bg-primary text-on-primary hover:bg-on-background px-5 py-2.5 font-mono text-[13px] font-semibold tracking-[.06em] uppercase transition-colors';
const ERROR_TITLE = 'font-headline text-on-background text-lg font-extrabold uppercase [font-stretch:80%]';

function InspectModal({ guidedAnnotationId, onAnnotationOpen }: InspectModalProps) {
  const { t, i18n } = useTranslation();
  const selectedArtifactId = useTourismStore((state) => state.selectedArtifactId);
  const clear = useTourismStore((state) => state.clear);
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
  const credit = previewConfig?.credit?.author ? previewConfig.credit : null;
  const licenseUrl = credit ? getLicenseUrl(credit.license) : undefined;

  const title = previewConfig ? t(pickLang(previewConfig.title, i18n.language)) : '';
  const otherTitle =
    previewConfig && typeof previewConfig.title === 'object'
      ? ((i18n.language.startsWith('en') ? previewConfig.title.vi : previewConfig.title.en) ?? '').trim()
      : '';
  const showViewerTools = !isLoading && !isError && Boolean(previewConfig) && !previewError && !isModelLoading;

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className='absolute inset-0 z-20'
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={clear}>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className='text-on-surface relative flex h-full w-full flex-col overflow-hidden md:flex-row'
          exit={{ opacity: 0, y: 18 }}
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}>
          <section className='relative min-h-0 min-w-0 flex-1'>
            {isLoading ? (
              <div className='relative h-full'>
                <ModelLoadingBar label={t('loading.status.preparing')} />
              </div>
            ) : isError ? (
              <div className='bg-surface-bright/90 flex h-full flex-col items-center justify-center gap-4 px-6 text-center'>
                <p className={ERROR_TITLE}>{t('artifact.dataLoadError')}</p>
                <button type='button' className={RETRY_BUTTON} onClick={() => void refetch()}>
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
                      rotationX={previewConfig.display?.rotationX}
                      rotationY={previewConfig.display?.rotationY}
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
              <div className='text-on-surface-variant bg-surface-bright/90 flex h-full items-center justify-center px-6 text-center'>
                {t('artifact.missingConfig')}
              </div>
            )}

            {!isLoading && previewConfig && previewError && (
              <div className='bg-surface-bright/90 absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center'>
                <p className={ERROR_TITLE}>{t('artifact.modelLoadError')}</p>
                <button
                  type='button'
                  className={RETRY_BUTTON}
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

            {showViewerTools && (
              <div className='bg-surface-bright border-on-background text-on-background absolute bottom-4 left-18 z-30 flex items-center border-[1.5px] text-[13px] md:bottom-6 md:left-21'>
                <span className='hidden px-3.5 py-2 sm:block'>{t('previewControls')}</span>
                <button
                  type='button'
                  title={t('artifact.resetCamera')}
                  className='border-on-background hover:bg-on-background hover:text-background flex items-center gap-1.5 px-3.5 py-2 font-mono text-xs font-semibold tracking-[.06em] uppercase transition-colors sm:border-l-[1.5px]'
                  onClick={() => setCameraResetRequest((current) => current + 1)}>
                  <ArrowCounterClockwiseIcon size={15} weight='bold' />
                  {t('artifact.resetCamera')}
                </button>
              </div>
            )}
          </section>

          <motion.aside
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 32 }}
            transition={{ delay: 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className='bg-surface-bright border-on-background text-on-background annotation-scrollbar relative flex max-h-[45%] w-full shrink-0 flex-col overflow-y-auto border-t-[1.5px] px-6 py-6 md:h-full md:max-h-none md:w-[440px] md:border-t-0 md:border-l-[1.5px] md:px-8 md:py-7'>
            <div className='flex items-start justify-between gap-4'>
              <div className='text-on-surface-variant pt-1 font-mono text-xs tracking-[.12em] uppercase'>
                {previewConfig?.type ? t(previewConfig.type) : t('artifact.reviewPanel')}
              </div>
              <button
                type='button'
                aria-label={t('artifact.close')}
                className='border-on-background hover:bg-on-background hover:text-background grid size-11 shrink-0 place-items-center border-[1.5px] transition-colors'
                onClick={clear}>
                <XIcon size={20} />
              </button>
            </div>

            {isLoading ? (
              <div className='mt-4 animate-pulse space-y-3'>
                <div className='bg-on-background/10 h-9 w-3/4' />
                <div className='bg-on-background/10 h-4 w-1/2' />
                <div className='bg-on-background/10 mt-6 h-4 w-full' />
                <div className='bg-on-background/10 h-4 w-full' />
              </div>
            ) : previewConfig ? (
              <>
                <h1 className='font-headline mt-3 text-[34px] leading-[1.15] font-extrabold uppercase [font-stretch:75%] md:text-[40px]'>
                  {title}
                </h1>
                {otherTitle && otherTitle !== title.trim() && <p className='text-on-surface-variant mt-1 italic'>{otherTitle}</p>}

                {artifactFacts.length > 0 && (
                  <dl className='border-on-background mt-6 border-t-2 text-[15px]'>
                    {artifactFacts.map((fact) => (
                      <div key={fact.label} className='grid grid-cols-[120px_1fr] gap-3 border-b border-black/15 py-2.5'>
                        <dt className='text-on-surface-variant pt-0.5 font-mono text-[11.5px] tracking-[.1em] uppercase'>
                          {fact.label}
                        </dt>
                        <dd className='font-semibold'>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <p className='text-on-surface-variant mt-5 text-[15px] leading-[1.7]'>
                  {previewConfig.history ? t(pickLang(previewConfig.history, i18n.language)) : t('artifact.noInformation')}
                </p>

                {credit && (
                  <p className='text-on-surface-variant mt-auto border-t border-black/20 pt-3.5 font-mono text-[11.5px] leading-5'>
                    {t('artifact.credit', { author: credit.author })} ·{' '}
                    {licenseUrl ? (
                      <a
                        href={licenseUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='text-primary hover:text-on-background font-semibold underline underline-offset-2'>
                        {credit.license}
                      </a>
                    ) : (
                      credit.license
                    )}
                    {credit.sourceUrl && (
                      <>
                        {' · '}
                        <a
                          href={credit.sourceUrl}
                          target='_blank'
                          rel='noreferrer'
                          className='text-on-background hover:text-primary underline underline-offset-2'>
                          {t('artifact.creditSource')} ↗
                        </a>
                      </>
                    )}
                  </p>
                )}
              </>
            ) : (
              <p className='text-on-surface-variant mt-6'>{t('artifact.noDetails')}</p>
            )}
          </motion.aside>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default InspectModal;
