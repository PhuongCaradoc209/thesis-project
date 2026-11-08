import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { NAV_PATH } from '../../router/paths';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className='bg-background text-on-surface-variant border-on-background/85 w-full border-t-[1.5px] pt-12 pb-14'>
      <div className='mx-auto flex max-w-[1312px] flex-col justify-between gap-6 px-5 font-mono text-[13px] leading-relaxed md:flex-row md:items-end md:px-16'>
        <div>
          <div className='font-headline bg-primary text-on-primary mb-3.5 inline-block px-[11px] py-[7px] text-lg font-extrabold tracking-[.06em] uppercase'>
            {t('brand.name')}
          </div>
          <p className='max-w-sm'>{t('footer.tagline')}</p>
        </div>
        <div className='md:text-right'>
          <Link
            to={`${NAV_PATH.ABOUT}#credits`}
            className='text-on-background hover:text-primary underline underline-offset-4 transition-colors'>
            {t('footer.credits')}
          </Link>
          <p>{t('footer.photoSources')}</p>
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
