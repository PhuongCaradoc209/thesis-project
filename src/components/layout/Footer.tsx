import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className='bg-on-background w-full px-8 py-12'>
      <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row md:items-end'>
        <div className='text-center md:text-left'>
          <div className='font-headline text-secondary-fixed-dim mb-3 text-2xl font-bold tracking-[0.12em] uppercase'>
            {t('brand.name')}
          </div>
          <p className='font-body text-inverse-on-surface/75 max-w-sm text-sm'>{t('footer.tagline')}</p>
        </div>
        <p className='font-body text-inverse-on-surface/60 text-xs'>
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
