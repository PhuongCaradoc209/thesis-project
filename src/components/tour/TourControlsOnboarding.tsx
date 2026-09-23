import { MapTrifoldIcon, XIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

type TourControlsOnboardingProps = {
  onDismiss: () => void;
};

export default function TourControlsOnboarding({ onDismiss }: TourControlsOnboardingProps) {
  const { t } = useTranslation();

  return (
    <aside
      aria-label={t('tourControls.title')}
      className='pointer-events-auto max-h-[calc(100vh-8rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-amber-200/30 bg-neutral-950/90 p-4 text-white shadow-2xl backdrop-blur-md sm:max-h-[calc(100vh-2rem)]'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h2 className='font-headline text-secondary-container text-lg font-semibold'>{t('tourControls.title')}</h2>
          <p className='mt-1 text-xs text-white/65'>{t('tourControls.subtitle')}</p>
        </div>
        <button
          type='button'
          aria-label={t('tourControls.dismiss')}
          className='rounded-md p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white'
          onClick={onDismiss}>
          <XIcon size={18} />
        </button>
      </div>

      <dl className='mt-4 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 text-sm'>
        <dt>
          <kbd className='rounded border border-amber-200/35 px-2 py-1 text-amber-100'>W/A/S/D</kbd>
        </dt>
        <dd>{t('tourControls.move')}</dd>
        <dt>
          <kbd className='rounded border border-amber-200/35 px-2 py-1 text-amber-100'>{t('tourControls.mouse')}</kbd>
        </dt>
        <dd>{t('tourControls.look')}</dd>
        <dt>
          <kbd className='rounded border border-amber-200/35 px-2 py-1 text-amber-100'>Space</kbd>
        </dt>
        <dd>{t('tourControls.jump')}</dd>
        <dt>
          <kbd className='rounded border border-amber-200/35 px-2 py-1 text-amber-100'>F</kbd>
        </dt>
        <dd>{t('tourControls.inspect')}</dd>
        <dt>
          <MapTrifoldIcon size={22} className='text-amber-200' aria-hidden='true' />
        </dt>
        <dd>{t('tourControls.map')}</dd>
      </dl>

      <p className='mt-4 text-xs text-white/55'>{t('tourControls.unlockMouse')}</p>
      <button
        type='button'
        className='bg-primary hover:bg-primary-container mt-4 w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors'
        onClick={onDismiss}>
        {t('tourControls.dismiss')}
      </button>
    </aside>
  );
}
