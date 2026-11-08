import {
  ArrowCounterClockwiseIcon,
  BookOpenIcon,
  FlagBannerIcon,
  LightbulbIcon,
  PauseIcon,
  PlayIcon,
  XIcon,
} from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTourismStore } from '../../store/useTourismStore';
import { useGuidedTourStore } from '../../store/useGuidedTourStore';
import { GuidedCinematicOverlay } from './GuidedCinematicOverlay';
import { GuidedTourJournal } from './GuidedTourJournal';

type GuidedTourUiProps = {
  hideHud?: boolean;
  hideLauncher?: boolean;
};

export function GuidedTourUi({ hideHud = false, hideLauncher = false }: GuidedTourUiProps) {
  const isInspecting = useTourismStore((state) => Boolean(state.selectedArtifactId));
  const cornerPosition = isInspecting ? 'top-4 left-4 md:top-6 md:left-6' : 'top-32 left-4 md:top-36 md:left-6';
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const tour = useGuidedTourStore((state) => state.tour);
  const status = useGuidedTourStore((state) => state.status);
  const currentStepIndex = useGuidedTourStore((state) => state.currentStepIndex);
  const completedStepIds = useGuidedTourStore((state) => state.completedStepIds);
  const isIntroOpen = useGuidedTourStore((state) => state.isIntroOpen);
  const isCompletionOpen = useGuidedTourStore((state) => state.isCompletionOpen);
  const isJournalOpen = useGuidedTourStore((state) => state.isJournalOpen);
  const feedback = useGuidedTourStore((state) => state.feedback);
  const openIntro = useGuidedTourStore((state) => state.openIntro);
  const beginTour = useGuidedTourStore((state) => state.beginTour);
  const exploreFreely = useGuidedTourStore((state) => state.exploreFreely);
  const pauseTour = useGuidedTourStore((state) => state.pauseTour);
  const resumeTour = useGuidedTourStore((state) => state.resumeTour);
  const exitTour = useGuidedTourStore((state) => state.exitTour);
  const closeCompletion = useGuidedTourStore((state) => state.closeCompletion);
  const openJournal = useGuidedTourStore((state) => state.openJournal);
  const closeJournal = useGuidedTourStore((state) => state.closeJournal);
  const clearFeedback = useGuidedTourStore((state) => state.clearFeedback);
  const [isHintVisible, setIsHintVisible] = useState(false);

  const currentStep = tour?.steps[currentStepIndex];
  const canResume = status !== 'completed' && (status === 'paused' || currentStepIndex > 0 || completedStepIds.length > 0);

  useEffect(() => setIsHintVisible(false), [currentStep?.stepId]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(clearFeedback, 1800);
    return () => window.clearTimeout(timer);
  }, [clearFeedback, feedback]);

  if (!tour) return null;

  return (
    <>
      <AnimatePresence>{status === 'cinematic' && <GuidedCinematicOverlay />}</AnimatePresence>

      <AnimatePresence>
        {isIntroOpen && (
          <motion.div
            className='absolute inset-0 z-40 flex items-center justify-center bg-[#170f09]/55 px-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.section
              role='dialog'
              aria-modal='true'
              aria-labelledby='guided-tour-intro-title'
              className='text-on-surface border-on-background bg-surface-bright w-full max-w-xl overflow-hidden border-[1.5px]'
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}>
              <div className='px-7 pt-7 pb-5 sm:px-9 sm:pt-9'>
                <div className='text-secondary mb-3 text-[0.65rem] font-semibold tracking-[0.28em] uppercase'>
                  {t('guidedTour.intro.eyebrow')}
                </div>
                <h2 id='guided-tour-intro-title' className='font-headline text-primary text-3xl leading-tight font-semibold'>
                  {t(tour.title)}
                </h2>
                <div className='mt-5 flex items-center gap-2' aria-hidden='true'>
                  <span className='bg-secondary h-px w-16' />
                  <span className='border-secondary h-2 w-2 rotate-45 border' />
                  <span className='h-px flex-1 bg-amber-950/15' />
                </div>
              </div>

              <div className='px-7 pb-7 sm:px-9'>
                <p className='text-on-surface-variant max-w-lg text-sm leading-7'>{t(tour.description)}</p>
                <div className='border-on-background/20 mt-6 flex items-center gap-5 border-y py-3 text-xs tracking-wide text-amber-950/65 uppercase'>
                  <span>{t('guidedTour.intro.steps', { count: tour.steps.length })}</span>
                  <span className='h-3 w-px bg-amber-950/20' />
                  <span>{t('guidedTour.intro.estimatedTime')}</span>
                </div>
              </div>

              <div className='border-on-background/20 flex flex-col-reverse gap-2 border-t bg-[#ead7b5]/60 px-7 py-4 sm:flex-row sm:justify-end sm:px-9'>
                <button
                  type='button'
                  className='text-on-surface-variant px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/30'
                  onClick={exploreFreely}>
                  {t('guidedTour.actions.freeExplore')}
                </button>
                {canResume && (
                  <button
                    type='button'
                    className='border-primary/50 text-primary border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/30'
                    onClick={resumeTour}>
                    {t('guidedTour.actions.continue')}
                  </button>
                )}
                <button
                  type='button'
                  className='bg-primary hover:bg-primary-container px-5 py-2.5 text-sm font-semibold text-white transition-colors'
                  onClick={() => beginTour(status === 'completed' || canResume)}>
                  {status === 'completed' || canResume ? t('guidedTour.actions.restart') : t('guidedTour.actions.start')}
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!hideHud &&
          !isIntroOpen &&
          !isCompletionOpen &&
          !isJournalOpen &&
          (status === 'active' || status === 'paused') &&
          currentStep && (
            <motion.aside
              className={`text-on-surface border-on-background bg-surface-bright absolute z-40 w-[min(25rem,calc(100vw-2rem))] overflow-hidden border-[1.5px] ${cornerPosition}`}
              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}>
              <div className='flex items-start gap-3 px-5 py-4'>
                <div className='min-w-0 flex-1'>
                  <p className='text-secondary text-[0.65rem] font-semibold tracking-[0.2em] uppercase'>
                    {t('guidedTour.hud.step', { current: currentStepIndex + 1, total: tour.steps.length })}
                  </p>
                  <div
                    role='progressbar'
                    aria-valuemin={0}
                    aria-valuemax={tour.steps.length}
                    aria-valuenow={completedStepIds.length}
                    aria-label={t('guidedTour.hud.step', { current: currentStepIndex + 1, total: tour.steps.length })}
                    className='mt-2 flex gap-1'>
                    {tour.steps.map((step, index) => (
                      <span
                        key={step.stepId}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          completedStepIds.includes(step.stepId)
                            ? 'bg-[#9e0027]'
                            : index === currentStepIndex
                              ? 'bg-[#c79f00]'
                              : 'bg-amber-950/15'
                        }`}
                      />
                    ))}
                  </div>
                  <p className='font-headline mt-2.5 text-base leading-6 font-semibold'>{t(currentStep.instruction)}</p>
                </div>
                <button
                  type='button'
                  aria-label={t('guidedTour.actions.exit')}
                  className='text-on-surface-variant p-1.5 transition-colors hover:bg-amber-950/5'
                  onClick={exitTour}>
                  <XIcon size={17} />
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isHintVisible && (
                  <motion.p
                    className='text-on-surface-variant mx-5 mb-4 border-l border-amber-800/45 pl-3 text-xs leading-5'
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}>
                    {t(currentStep.hint)}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className='border-on-background/20 flex items-center justify-between border-t bg-[#ead7b5]/55 px-3 py-2'>
                <button
                  type='button'
                  className='text-primary flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold transition-colors hover:bg-white/30'
                  onClick={() => setIsHintVisible((visible) => !visible)}>
                  <LightbulbIcon size={16} />
                  {isHintVisible ? t('guidedTour.actions.hideHint') : t('guidedTour.actions.hint')}
                </button>
                <button
                  type='button'
                  className='text-on-surface-variant flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold transition-colors hover:bg-white/30'
                  onClick={status === 'active' ? pauseTour : resumeTour}>
                  {status === 'active' ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                  {status === 'active' ? t('guidedTour.actions.pause') : t('guidedTour.actions.continue')}
                </button>
              </div>
            </motion.aside>
          )}
      </AnimatePresence>

      <AnimatePresence>
        {!hideLauncher &&
          !isIntroOpen &&
          !isCompletionOpen &&
          !isJournalOpen &&
          (status === 'idle' || status === 'completed') && (
            <motion.button
              type='button'
              className={`text-primary border-on-background bg-surface-bright hover:bg-surface-container-high absolute z-30 flex items-center gap-2 border-[1.5px] px-4 py-3 text-sm font-semibold transition-colors ${cornerPosition}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              onClick={openIntro}>
              {status === 'completed' ? <ArrowCounterClockwiseIcon size={18} /> : <FlagBannerIcon size={18} weight='fill' />}
              {status === 'completed' ? t('guidedTour.actions.replay') : t('guidedTour.actions.open')}
            </motion.button>
          )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback.id}
            className='text-on-surface border-on-background bg-surface-bright absolute top-6 left-1/2 z-50 -translate-x-1/2 border-[1.5px] px-4 py-2.5 text-sm font-semibold'
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}>
            {feedback.kind === 'discovery-unlocked'
              ? t('guidedTour.feedback.discoveryUnlocked')
              : feedback.kind === 'step-complete'
                ? t('guidedTour.feedback.stepComplete')
                : t('guidedTour.feedback.wrongTarget')}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCompletionOpen && (
          <motion.div
            className='absolute inset-0 z-40 flex items-center justify-center bg-[#170f09]/55 px-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.section
              role='dialog'
              aria-modal='true'
              className='text-on-surface border-on-background bg-surface-bright w-full max-w-md border-[1.5px] p-8 text-center'
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}>
              <div className='mx-auto flex items-center justify-center gap-2' aria-hidden='true'>
                <span className='h-px w-12 bg-amber-900/35' />
                <span className='h-3 w-3 rotate-45 border border-amber-800' />
                <span className='h-px w-12 bg-amber-900/35' />
              </div>
              <h2 className='font-headline text-primary mt-5 text-2xl font-semibold'>{t('guidedTour.completion.title')}</h2>
              <p className='text-on-surface-variant mt-3 text-sm leading-6'>{t('guidedTour.completion.description')}</p>
              <div className='mt-6 flex flex-col-reverse justify-center gap-2 sm:flex-row'>
                <button
                  type='button'
                  className='text-primary px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/30'
                  onClick={closeCompletion}>
                  {t('guidedTour.actions.freeExplore')}
                </button>
                <button
                  type='button'
                  className='border-secondary text-secondary flex items-center justify-center gap-2 border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/30'
                  onClick={openJournal}>
                  <BookOpenIcon size={18} />
                  {t('guidedTour.actions.openJournal')}
                </button>
                <button
                  type='button'
                  className='bg-primary hover:bg-primary-container px-5 py-2.5 text-sm font-semibold text-white transition-colors'
                  onClick={() => beginTour(true)}>
                  {t('guidedTour.actions.restart')}
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isJournalOpen && <GuidedTourJournal tour={tour} completedStepIds={completedStepIds} onClose={closeJournal} />}
      </AnimatePresence>
    </>
  );
}
