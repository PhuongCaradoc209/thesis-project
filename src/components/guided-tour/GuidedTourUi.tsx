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
import { useGuidedTourStore } from '../../store/useGuidedTourStore';
import { GuidedCinematicOverlay } from './GuidedCinematicOverlay';
import { GuidedTourJournal } from './GuidedTourJournal';

type GuidedTourUiProps = {
  hideHud?: boolean;
  hideLauncher?: boolean;
};

export function GuidedTourUi({ hideHud = false, hideLauncher = false }: GuidedTourUiProps) {
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
            className='absolute inset-x-0 top-20 bottom-0 z-40 flex items-center justify-center bg-[#170f09]/55 px-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.section
              role='dialog'
              aria-modal='true'
              aria-labelledby='guided-tour-intro-title'
              className='text-on-surface w-full max-w-xl overflow-hidden rounded-xl border border-[#b69462]/55 bg-[#f3e7cf] shadow-[0_24px_80px_rgba(18,10,5,0.4)]'
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
                <div className='mt-6 flex items-center gap-5 border-y border-amber-950/15 py-3 text-xs tracking-wide text-amber-950/65 uppercase'>
                  <span>{t('guidedTour.intro.steps', { count: tour.steps.length })}</span>
                  <span className='h-3 w-px bg-amber-950/20' />
                  <span>{t('guidedTour.intro.estimatedTime')}</span>
                </div>
              </div>

              <div className='flex flex-col-reverse gap-2 border-t border-amber-950/15 bg-[#ead7b5]/60 px-7 py-4 sm:flex-row sm:justify-end sm:px-9'>
                <button
                  type='button'
                  className='text-on-surface-variant rounded-md px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/30'
                  onClick={exploreFreely}>
                  {t('guidedTour.actions.freeExplore')}
                </button>
                {canResume && (
                  <button
                    type='button'
                    className='border-primary/50 text-primary rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/30'
                    onClick={resumeTour}>
                    {t('guidedTour.actions.continue')}
                  </button>
                )}
                <button
                  type='button'
                  className='bg-primary hover:bg-primary-container rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-colors'
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
              className='text-on-surface absolute top-24 left-4 z-40 w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-l-4 border-amber-950/20 border-l-[#9e0027] bg-[#f3e7cf]/95 shadow-[0_14px_40px_rgba(20,12,7,0.25)]'
              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}>
              <div className='flex items-start gap-3 px-5 py-4'>
                <div className='min-w-0 flex-1'>
                  <p className='text-secondary text-[0.65rem] font-semibold tracking-[0.2em] uppercase'>
                    {t('guidedTour.hud.step', { current: currentStepIndex + 1, total: tour.steps.length })}
                  </p>
                  <p className='font-headline mt-1.5 text-base leading-6 font-semibold'>{t(currentStep.instruction)}</p>
                </div>
                <button
                  type='button'
                  aria-label={t('guidedTour.actions.exit')}
                  className='text-on-surface-variant rounded-md p-1.5 transition-colors hover:bg-amber-950/5'
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

              <div className='flex items-center justify-between border-t border-amber-950/15 bg-[#ead7b5]/55 px-3 py-2'>
                <div className='flex items-center gap-1'>
                  <button
                    type='button'
                    className='text-primary flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors hover:bg-white/30'
                    onClick={() => setIsHintVisible((visible) => !visible)}>
                    <LightbulbIcon size={16} />
                    {isHintVisible ? t('guidedTour.actions.hideHint') : t('guidedTour.actions.hint')}
                  </button>
                  {completedStepIds.length > 0 && (
                    <button
                      type='button'
                      className='text-secondary flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors hover:bg-white/30'
                      onClick={openJournal}>
                      <BookOpenIcon size={16} />
                      {t('guidedTour.actions.journal')}
                    </button>
                  )}
                </div>
                <button
                  type='button'
                  className='text-on-surface-variant flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors hover:bg-white/30'
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
              className='text-primary absolute top-24 left-4 z-30 flex items-center gap-2 rounded-lg border border-l-4 border-amber-950/20 border-l-[#9e0027] bg-[#f3e7cf]/95 px-4 py-3 text-sm font-semibold shadow-lg transition-colors hover:bg-[#f8edd9]'
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
            className='text-on-surface absolute top-24 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-l-4 border-amber-950/20 border-l-[#c79f00] bg-[#f3e7cf]/95 px-4 py-2.5 text-sm font-semibold shadow-lg'
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
            className='absolute inset-x-0 top-20 bottom-0 z-40 flex items-center justify-center bg-[#170f09]/55 px-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.section
              role='dialog'
              aria-modal='true'
              className='text-on-surface w-full max-w-md rounded-xl border border-[#b69462]/55 bg-[#f3e7cf] p-8 text-center shadow-2xl'
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
                  className='text-primary rounded-md px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/30'
                  onClick={closeCompletion}>
                  {t('guidedTour.actions.freeExplore')}
                </button>
                <button
                  type='button'
                  className='border-secondary text-secondary flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/30'
                  onClick={openJournal}>
                  <BookOpenIcon size={18} />
                  {t('guidedTour.actions.openJournal')}
                </button>
                <button
                  type='button'
                  className='bg-primary hover:bg-primary-container rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-colors'
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
