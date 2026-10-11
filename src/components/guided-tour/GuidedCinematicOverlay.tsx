import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useGuidedTourStore } from '../../store/useGuidedTourStore';

export function GuidedCinematicOverlay() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const intro = useGuidedTourStore((state) => state.tour?.intro);
  const progress = useGuidedTourStore((state) => state.cinematicProgress);
  const requestSkip = useGuidedTourStore((state) => state.requestCinematicSkip);

  if (!intro) return null;

  const edgeFade = progress < 0.1 ? 1 - progress / 0.1 : progress > 0.9 ? (progress - 0.9) / 0.1 : 0;
  const backdropOpacity = 0.12 + edgeFade * 0.88;

  return (
    <motion.div
      className='pointer-events-none absolute inset-0 z-40 flex flex-col justify-end px-5 pt-24 pb-7 text-white sm:px-10 sm:pb-9'
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <div className='absolute inset-0 bg-black' style={{ opacity: backdropOpacity }} />
      <div className='absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/75' />

      <div className='relative mb-8 max-w-2xl border-l-2 border-amber-300/80 pl-5 drop-shadow-lg sm:pl-7'>
        <p className='mb-2 text-[0.65rem] font-semibold tracking-[0.28em] text-amber-200 uppercase'>
          {t('guidedTour.cinematic.eyebrow')}
        </p>
        <h2 className='font-headline text-3xl leading-tight font-semibold sm:text-5xl'>{t(intro.title)}</h2>
        {intro.caption && <p className='mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base'>{t(intro.caption)}</p>}
      </div>

      <div className='relative flex w-full items-center gap-4 border-t border-white/20 pt-4'>
        <span className='font-headline text-xs text-white/60 tabular-nums'>
          {String(Math.round(progress * 100)).padStart(2, '0')}
        </span>
        <div className='h-px flex-1 overflow-hidden bg-white/25'>
          <div className='h-full bg-amber-300 transition-[width] duration-100' style={{ width: `${progress * 100}%` }} />
        </div>
        {intro.skippable !== false && (
          <button
            type='button'
            className='pointer-events-auto rounded-md border border-white/35 bg-black/20 px-4 py-2 text-xs font-semibold transition-colors hover:bg-black/45'
            onClick={requestSkip}>
            {t('guidedTour.actions.skipCinematic')}
          </button>
        )}
      </div>
    </motion.div>
  );
}
