import { useTranslation } from 'react-i18next';

const KBD =
  'bg-surface-bright border-on-background border-[1.5px] border-b-[3px] px-1.5 font-mono text-[11px] leading-5 font-semibold';

export default function ControlsHint() {
  const { t } = useTranslation();

  return (
    <div className='bg-surface-bright/90 border-on-background text-on-background pointer-events-none absolute bottom-4 left-18 z-30 hidden items-center gap-4 border-[1.5px] px-3.5 py-2 text-[13px] md:bottom-6 md:left-21 md:flex'>
      <span className='flex items-center gap-1'>
        {['W', 'A', 'S', 'D'].map((key) => (
          <kbd key={key} className={KBD}>
            {key}
          </kbd>
        ))}
        <span className='ml-1'>{t('tourHud.walk')}</span>
      </span>
      <span className='flex items-center gap-1'>
        <kbd className={KBD}>Esc</kbd>
        <span className='ml-1'>{t('tourHud.cursor')}</span>
      </span>
    </div>
  );
}
