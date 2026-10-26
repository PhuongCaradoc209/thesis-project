import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ComingSoonGrid } from '../../components/heritage/SiteCards';
import { MARKER_DATA } from '../../constants/markers';
import { NAV_PATH } from '../../router/paths';
import { getTourPath } from '../../utils/tourPath';

const HeritagePage = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-background text-on-background font-body min-h-screen'>
      <div className='mx-auto max-w-7xl px-8 pt-36 pb-24'>
        <header className='mb-16 max-w-2xl'>
          <span className='font-label text-secondary mb-4 block text-xs tracking-[0.3em] uppercase'>
            {t('heritagePage.label')}
          </span>
          <h1 className='font-headline mb-6 text-5xl font-bold'>{t('heritagePage.title')}</h1>
          <p className='text-on-surface-variant text-lg leading-relaxed'>{t('heritagePage.intro')}</p>
        </header>

        <ul className='space-y-12'>
          {MARKER_DATA.map((marker) => (
            <li key={marker.id} className='grid grid-cols-1 items-center gap-8 md:grid-cols-12'>
              <Link to={getTourPath(marker)} className='group overflow-hidden rounded-lg shadow-lg md:col-span-5'>
                <img
                  className='aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-105'
                  alt={t(marker.nameKey)}
                  src={marker.thumbnail}
                />
              </Link>
              <div className='md:col-span-7'>
                <h2 className='font-headline text-primary mb-4 text-3xl font-semibold'>{t(marker.nameKey)}</h2>
                <p className='text-on-surface-variant mb-3 max-w-xl leading-relaxed'>{t(marker.descriptionKey)}</p>
                <p className='mb-8 max-w-xl text-sm font-semibold'>{t(`home.destinations.sites.${marker.id}`)}</p>
                <div className='flex flex-wrap gap-3'>
                  <Link
                    to={getTourPath(marker)}
                    className='bg-primary text-on-primary hover:bg-primary-container rounded-md px-5 py-3 text-sm font-semibold transition-colors'>
                    {t('home.destinations.enter')}
                  </Link>
                  <Link
                    to={NAV_PATH.MAP}
                    className='border-outline/40 text-on-surface hover:bg-surface-container rounded-md border px-5 py-3 text-sm font-semibold transition-colors'>
                    {t('heritagePage.viewOnMap')}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <section className='mt-24'>
          <h2 className='font-headline mb-3 text-3xl font-semibold'>{t('home.destinations.comingSoonTitle')}</h2>
          <p className='text-on-surface-variant mb-8 max-w-2xl leading-relaxed'>{t('heritagePage.comingSoonIntro')}</p>
          <ComingSoonGrid />
        </section>
      </div>
    </div>
  );
};

export default HeritagePage;
