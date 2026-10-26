import { XIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

type TourControlsOnboardingProps = {
  onDismiss: () => void;
};

export default function TourControlsOnboarding({ onDismiss }: TourControlsOnboardingProps) {
  const { t } = useTranslation();

  return (
    <aside
      aria-label={t('tourControls.title')}
      className='text-on-surface pointer-events-auto max-h-[calc(100vh-8rem)] w-full max-w-sm overflow-y-auto rounded-xl border border-[#b69462]/55 bg-[#f3e7cf] p-5 shadow-[0_14px_40px_rgba(20,12,7,0.25)] sm:max-h-[calc(100vh-2rem)]'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h2 className='font-headline text-primary text-lg font-semibold'>{t('tourControls.title')}</h2>
          <p className='text-on-surface-variant mt-1 text-xs'>{t('tourControls.subtitle')}</p>
        </div>
        <button
          type='button'
          aria-label={t('tourControls.dismiss')}
          className='text-on-surface-variant rounded-md p-1 transition-colors hover:bg-amber-950/5'
          onClick={onDismiss}>
          <XIcon size={18} />
        </button>
      </div>

      <dl className='mt-4 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 text-sm'>
        <dt>
          <kbd className='rounded border border-amber-950/25 bg-[#faf3e3] px-2 py-1 font-sans text-xs font-semibold'>W/A/S/D</kbd>
        </dt>
        <dd>{t('tourControls.move')}</dd>
        <dt>
          <kbd className='rounded border border-amber-950/25 bg-[#faf3e3] px-2 py-1 font-sans text-xs font-semibold'>
            {t('tourControls.mouse')}
          </kbd>
        </dt>
        <dd>{t('tourControls.look')}</dd>
        <dt>
          <kbd className='rounded border border-amber-950/25 bg-[#faf3e3] px-2 py-1 font-sans text-xs font-semibold'>Space</kbd>
        </dt>
        <dd>{t('tourControls.jump')}</dd>
        <dt>
          <kbd className='rounded border border-amber-950/25 bg-[#faf3e3] px-2 py-1 font-sans text-xs font-semibold'>F</kbd>
        </dt>
        <dd>{t('tourControls.inspect')}</dd>
        <dt>
          <kbd className='rounded border border-amber-950/25 bg-[#faf3e3] px-2 py-1 font-sans text-xs font-semibold'>M</kbd>
        </dt>
        <dd>{t('tourControls.map')}</dd>
        <dt>
          <kbd className='rounded border border-amber-950/25 bg-[#faf3e3] px-2 py-1 font-sans text-xs font-semibold'>J</kbd>
        </dt>
        <dd>{t('tourControls.journal')}</dd>
        <dt>
          <kbd className='rounded border border-amber-950/25 bg-[#faf3e3] px-2 py-1 font-sans text-xs font-semibold'>O</kbd>
        </dt>
        <dd>{t('tourControls.settings')}</dd>
      </dl>

      <p className='text-on-surface-variant mt-4 text-xs'>{t('tourControls.unlockMouse')}</p>
      <button
        type='button'
        className='bg-primary hover:bg-primary-container text-on-primary mt-4 w-full rounded-md px-4 py-2 text-sm font-semibold transition-colors'
        onClick={onDismiss}>
        {t('tourControls.dismiss')}
      </button>
    </aside>
  );
}
