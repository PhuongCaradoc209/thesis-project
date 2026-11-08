import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { MODEL_CREDITS, PHOTO_CREDITS, TEXTURE_CREDITS, getLicenseUrl, type AssetCredit } from '../../constants/credits';
import { NAV_PATH } from '../../router/paths';

function CreditGroup({ title, credits }: { title: string; credits: AssetCredit[] }) {
  return (
    <div className='mt-8'>
      <h3 className='text-on-surface-variant font-mono text-xs tracking-[.1em] uppercase'>
        {title} · {credits.length}
      </h3>
      <ul className='border-on-background mt-2 border-t-[1.5px]'>
        {credits.map((credit) => {
          const licenseUrl = getLicenseUrl(credit.license);
          return (
            <li
              key={credit.sourceUrl}
              className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-black/10 py-2.5'>
              <a
                href={credit.sourceUrl}
                target='_blank'
                rel='noreferrer'
                className='text-on-background hover:text-primary text-[15px] font-medium transition-colors'>
                {credit.name}
              </a>
              <span className='text-on-surface-variant font-mono text-xs'>
                {credit.author} ·{' '}
                {licenseUrl ? (
                  <a
                    href={licenseUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='text-primary hover:text-on-background underline underline-offset-2'>
                    {credit.license}
                  </a>
                ) : (
                  credit.license
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const AboutPage = () => {
  const { t } = useTranslation();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <div className='bg-background text-on-background font-body min-h-screen pt-17'>
      <div className='mx-auto max-w-3xl px-5 pt-16 pb-24 md:px-8'>
        <div className='text-on-surface-variant font-mono text-xs tracking-[.12em] uppercase'>{t('aboutPage.label')}</div>
        <h1 className='font-headline mt-3 text-[42px] leading-[1.15] font-extrabold uppercase [font-stretch:75%] md:text-5xl'>
          {t('brand.name')}
        </h1>
        <div className='mt-6 space-y-4 text-lg leading-relaxed'>
          <p>{t('aboutPage.p1')}</p>
          <p>{t('aboutPage.p2')}</p>
          <p className='text-on-surface-variant'>{t('aboutPage.p3')}</p>
        </div>

        <Link
          to={NAV_PATH.MAP}
          className='bg-primary text-on-primary hover:bg-on-background hover:text-background mt-8 inline-flex h-12 items-center gap-3 px-6 font-mono text-[13px] font-semibold tracking-[.08em] uppercase transition-colors'>
          {t('aboutPage.cta')} <span aria-hidden='true'>→</span>
        </Link>

        <section id='credits' className='mt-20 scroll-mt-24'>
          <h2 className='font-headline text-3xl leading-[1.15] font-extrabold uppercase [font-stretch:80%]'>
            {t('aboutPage.credits.title')}
          </h2>
          <CreditGroup title={t('aboutPage.credits.models')} credits={MODEL_CREDITS} />
          <CreditGroup title={t('aboutPage.credits.textures')} credits={TEXTURE_CREDITS} />
          <CreditGroup title={t('aboutPage.credits.photos')} credits={Object.values(PHOTO_CREDITS)} />
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
