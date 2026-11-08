import { LockKeyIcon, XIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuidedTour, GuidedTourDiscovery } from '../../types/guidedTour.types';

type GuidedTourJournalProps = {
  tour: GuidedTour;
  completedStepIds: string[];
  onClose: () => void;
};

type JournalEntry = GuidedTourDiscovery & {
  stepId: string;
  unlocked: boolean;
};

const journalStyle = { '--journal-paper': '#F3E7CF' } as CSSProperties;

export function GuidedTourJournal({ tour, completedStepIds, onClose }: GuidedTourJournalProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const entries = useMemo<JournalEntry[]>(
    () =>
      tour.steps.map((step) => ({
        stepId: step.stepId,
        discoveryId: step.discovery?.discoveryId ?? step.stepId,
        title: step.discovery?.title ?? step.instruction,
        summary: step.discovery?.summary ?? 'guidedTour.journal.fallbackSummary',
        images: step.discovery?.images,
        unlocked: completedStepIds.includes(step.stepId),
      })),
    [completedStepIds, tour.steps],
  );
  const firstUnlockedId = entries.find((entry) => entry.unlocked)?.discoveryId ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(firstUnlockedId);
  const selectedEntry = entries.find((entry) => entry.discoveryId === selectedId && entry.unlocked) ?? null;

  useEffect(() => {
    if (selectedEntry || !firstUnlockedId) return;
    setSelectedId(firstUnlockedId);
  }, [firstUnlockedId, selectedEntry]);

  return (
    <motion.div
      className='absolute inset-0 z-60 flex items-center justify-center bg-black/45 p-3 backdrop-blur-[2px] sm:p-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.section
        role='dialog'
        aria-modal='true'
        aria-labelledby='guided-journal-title'
        style={journalStyle}
        className='text-on-surface relative grid max-h-[calc(100vh-7rem)] w-full max-w-5xl overflow-hidden border border-amber-950/20 bg-[var(--journal-paper)] md:grid-cols-[0.8fr_1.2fr]'
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.99 }}>
        <button
          type='button'
          aria-label={t('guidedTour.journal.close')}
          className='text-on-surface-variant absolute top-3 right-3 z-10 rounded-full bg-white/45 p-2 transition-colors hover:bg-white/75'
          onClick={onClose}>
          <XIcon size={19} />
        </button>

        <aside className='border-on-background/20 min-h-0 border-b bg-[#ead8b8] p-5 md:border-r md:border-b-0 md:p-8'>
          <div className='mb-6 pr-10'>
            <p className='text-[0.65rem] font-semibold tracking-[0.24em] text-amber-950/55 uppercase'>
              {t('guidedTour.journal.title')}
            </p>
            <h2 id='guided-journal-title' className='font-headline mt-1 text-2xl font-semibold text-amber-950'>
              {t('guidedTour.journal.contents')}
            </h2>
            <div className='mt-4 flex items-center gap-2' aria-hidden='true'>
              <span className='h-px w-12 bg-amber-900/55' />
              <span className='h-1.5 w-1.5 rotate-45 border border-amber-900/55' />
              <span className='h-px flex-1 bg-amber-900/15' />
            </div>
          </div>

          <nav className='guided-journal-scrollbar flex max-h-40 gap-1 overflow-x-auto overflow-y-auto pb-1 md:max-h-[55vh] md:flex-col md:gap-0 md:overflow-x-hidden'>
            {entries.map((entry, index) => (
              <button
                key={entry.discoveryId}
                type='button'
                disabled={!entry.unlocked}
                className={`group border-on-background/20 relative flex min-w-56 items-center gap-4 border-b px-2 py-4 text-left transition-colors md:min-w-0 ${
                  entry.unlocked
                    ? entry.discoveryId === selectedEntry?.discoveryId
                      ? 'bg-amber-50/35 text-amber-950 before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:bg-amber-800'
                      : 'text-amber-950/70 hover:bg-amber-50/20 hover:text-amber-950'
                    : 'cursor-not-allowed text-amber-950/35'
                }`}
                onClick={() => entry.unlocked && setSelectedId(entry.discoveryId)}>
                <span className='font-headline w-8 shrink-0 text-lg text-amber-900/55 tabular-nums'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className='line-clamp-2 flex-1 text-sm leading-5 font-semibold'>{t(entry.title)}</span>
                {!entry.unlocked && <LockKeyIcon className='shrink-0 opacity-65' size={14} />}
              </button>
            ))}
          </nav>
        </aside>

        <div
          className='guided-journal-scrollbar relative min-h-72 overflow-y-auto bg-cover bg-center p-6 md:max-h-[70vh] md:p-10'
          style={{ backgroundImage: "url('/common/image/note_bg.jpg')" }}>
          <div className='pointer-events-none absolute inset-y-0 left-0 hidden w-8 bg-linear-to-r from-amber-950/8 to-transparent md:block' />
          <AnimatePresence mode='wait'>
            {selectedEntry ? (
              <motion.article
                key={selectedEntry.discoveryId}
                initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}>
                <p className='mb-2 text-xs font-semibold tracking-[0.16em] text-amber-900/55 uppercase'>
                  {t('guidedTour.journal.unlockedEntry')}
                </p>
                <h3 className='font-headline text-2xl leading-tight font-semibold text-amber-950 sm:text-3xl'>
                  {t(selectedEntry.title)}
                </h3>
                <div className='my-5 h-px bg-amber-900/15' />
                <p className='text-sm leading-7 text-amber-950/75 sm:text-base'>{t(selectedEntry.summary)}</p>

                {selectedEntry.images && selectedEntry.images.length > 0 && (
                  <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                    {selectedEntry.images.map((image) => (
                      <img
                        key={image}
                        src={image}
                        alt={t(selectedEntry.title)}
                        className='border-on-background/20 aspect-4/3 w-full border object-cover'
                      />
                    ))}
                  </div>
                )}
              </motion.article>
            ) : (
              <div className='flex min-h-64 flex-col items-center justify-center text-center text-amber-950/45'>
                <LockKeyIcon size={30} />
                <p className='mt-3 max-w-xs text-sm leading-6'>{t('guidedTour.journal.empty')}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </motion.div>
  );
}
