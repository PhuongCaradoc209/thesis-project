import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { MODEL_CREDITS, TEXTURE_CREDITS, getLicenseUrl, type AssetCredit } from '../../constants/credits';
import { NAV_PATH } from '../../router/paths';

const STEPS = ['map', 'walk', 'journal'] as const;
const TECHNOLOGIES = [
  'React · TypeScript · Vite',
  'Three.js · React Three Fiber',
  'Rapier',
  'Firebase Firestore',
  'MapLibre · MapTiler',
];
const SOURCE_URL = 'https://baotanglichsu.vn/vi/Articles/3096/9778/djoc-djao-tam-bia-dja-cao-va-nang-nhat-viet-nam.html';

function CreditList({ title, credits }: { title: string; credits: AssetCredit[] }) {
  const { t } = useTranslation();

  return (
    <div className='mt-8'>
      <h3 className='font-label text-secondary mb-2 text-xs tracking-[0.2em] uppercase'>{title}</h3>
      <ul className='border-outline/20 border-t'>
        {credits.map((credit) => {
          const licenseUrl = getLicenseUrl(credit.license);
          return (
            <li key={credit.sourceUrl} className='border-outline/20 border-b py-3'>
              <a
                href={credit.sourceUrl}
                target='_blank'
                rel='noreferrer'
                className='text-on-surface font-semibold underline-offset-4 hover:underline'>
                {credit.name} ↗
              </a>
              <p className='text-on-surface-variant mt-1 text-sm'>
                {t('aboutPage.credits.by', { author: credit.author })} ·{' '}
                {licenseUrl ? (
                  <a
                    href={licenseUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='text-on-surface-variant underline underline-offset-4 hover:no-underline'>
                    {credit.license}
                  </a>
                ) : (
                  credit.license
                )}
              </p>
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
    <div className='bg-background text-on-background font-body min-h-screen'>
      <article className='mx-auto max-w-3xl px-8 pt-36 pb-24'>
        <span className='font-label text-secondary mb-4 block text-xs tracking-[0.3em] uppercase'>{t('aboutPage.label')}</span>
        <h1 className='font-headline mb-6 text-5xl font-bold'>{t('aboutPage.title')}</h1>
        <p className='text-on-surface-variant text-lg leading-relaxed'>{t('aboutPage.intro')}</p>

        <section className='mt-16'>
          <h2 className='font-headline mb-6 text-2xl font-semibold'>{t('aboutPage.howTo.title')}</h2>
          <ol className='space-y-6'>
            {STEPS.map((step, index) => (
              <li key={step} className='flex gap-5'>
                <span className='font-headline text-primary w-8 shrink-0 text-2xl'>{index + 1}</span>
                <div>
                  <h3 className='mb-1 font-semibold'>{t(`aboutPage.howTo.${step}.title`)}</h3>
                  <p className='text-on-surface-variant leading-relaxed'>{t(`aboutPage.howTo.${step}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className='mt-16'>
          <h2 className='font-headline mb-4 text-2xl font-semibold'>{t('aboutPage.content.title')}</h2>
          <p className='text-on-surface-variant mb-4 leading-relaxed'>{t('aboutPage.content.body')}</p>
          <a
            href={SOURCE_URL}
            target='_blank'
            rel='noreferrer'
            className='text-primary font-semibold underline underline-offset-4 hover:no-underline'>
            {t('aboutPage.content.sourceLink')}
          </a>
        </section>

        <section className='mt-16'>
          <h2 className='font-headline mb-4 text-2xl font-semibold'>{t('aboutPage.tech.title')}</h2>
          <p className='text-on-surface-variant mb-4 leading-relaxed'>{t('aboutPage.tech.body')}</p>
          <ul className='flex flex-wrap gap-2'>
            {TECHNOLOGIES.map((tech) => (
              <li key={tech} className='bg-surface-container text-on-surface rounded-md px-3 py-1.5 text-sm'>
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section id='credits' className='mt-16 scroll-mt-28'>
          <h2 className='font-headline mb-4 text-2xl font-semibold'>{t('aboutPage.credits.title')}</h2>
          <p className='text-on-surface-variant leading-relaxed'>{t('aboutPage.credits.body')}</p>
          <CreditList title={t('aboutPage.credits.models')} credits={MODEL_CREDITS} />
          <CreditList title={t('aboutPage.credits.textures')} credits={TEXTURE_CREDITS} />
        </section>

        <div className='border-outline/20 mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-10'>
          <p className='text-on-surface-variant text-sm'>{t('aboutPage.thesis')}</p>
          <Link
            to={NAV_PATH.MAP}
            className='bg-primary text-on-primary hover:bg-primary-container rounded-md px-5 py-3 text-sm font-semibold transition-colors'>
            {t('aboutPage.cta')}
          </Link>
        </div>
      </article>
    </div>
  );
};

export default AboutPage;
