import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { NAV_PATH } from '../../router/paths';

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
        <div className='flex flex-col items-center gap-2 md:items-end'>
          <Link
            to={`${NAV_PATH.ABOUT}#credits`}
            className='font-body text-inverse-on-surface/75 hover:text-inverse-on-surface text-xs underline underline-offset-4'>
            {t('footer.credits')}
          </Link>
          <p className='font-body text-inverse-on-surface/60 text-xs'>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
