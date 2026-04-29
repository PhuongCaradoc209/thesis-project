import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className='w-full bg-stone-950 px-8 py-12 dark:bg-black'>
      <div className='mx-auto flex max-w-7xl flex-col items-center justify-between border-t border-stone-800/50 pt-12 md:flex-row'>
        <div className='mb-8 md:mb-0'>
          <div className='font-headline mb-4 text-2xl tracking-[0.2em] text-yellow-600 uppercase italic dark:text-yellow-500'>
            {t('brand.name')}
          </div>
          <p className='font-label max-w-sm text-xs font-light text-stone-500'>{t('footer.tagline')}</p>
        </div>

        <div className='flex flex-col items-center gap-6 md:items-end'>
          <div className='flex gap-8'>
            <a className='font-body text-xs text-stone-500 transition-colors hover:text-stone-300' href='#'>
              {t('footer.links.privacy')}
            </a>
            <a className='font-body text-xs text-stone-500 transition-colors hover:text-stone-300' href='#'>
              {t('footer.links.terms')}
            </a>
            <a className='font-body text-xs text-stone-500 transition-colors hover:text-stone-300' href='#'>
              {t('footer.links.about')}
            </a>
          </div>
          <div className='font-label text-xs font-light text-yellow-600 dark:text-yellow-500'>{t('footer.copyright')}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
