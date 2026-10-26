import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import DenHungImage from '../../assets/scenes/denhung/DenHung.jpg';
import TuDucImage from '../../assets/scenes/tuduc/TuDuc.jpg';
import TuDucPavilionImage from '../../assets/scenes/tuduc/TuDucLoading.jpg';
import { ComingSoonGrid, SiteCard } from '../../components/heritage/SiteCards';
import { MARKER_DATA } from '../../constants/markers';
import { NAV_PATH } from '../../router/paths';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className='relative flex h-screen w-full items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 z-0 bg-gray-100'>
        <video
          className='h-full w-full object-cover'
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          src='/common/video/heroSection.mp4'
        />
      </div>
      <div className='relative z-10 px-4 text-center'>
        <h1 className='font-headline mb-6 text-5xl font-bold tracking-tight text-white md:text-8xl'>{t('home.hero.title')}</h1>
        <p className='font-label mx-auto max-w-2xl text-lg leading-relaxed font-light text-white/90 md:text-2xl'>
          {t('home.hero.subtitle')}
        </p>
        <div className='mt-12'>
          <Link
            to={NAV_PATH.MAP}
            className='bg-primary text-on-primary font-label inline-block px-10 py-4 text-sm font-bold tracking-widest uppercase shadow-xl transition-transform hover:scale-105 active:scale-95'>
            {t('actions.startExploring')}
          </Link>
        </div>
      </div>
    </section>
  );
};

const DestinationsGrid = () => {
  const { t } = useTranslation();

  return (
    <section className='mx-auto max-w-7xl px-8 py-24'>
      <div className='mb-16 flex flex-col items-center'>
        <span className='font-label text-secondary mb-4 text-xs tracking-[0.3em] uppercase'>
          {t('home.destinations.sectionLabel')}
        </span>
        <h2 className='font-headline text-on-background text-4xl font-bold italic md:text-5xl'>
          {t('home.destinations.sectionTitle')}
        </h2>
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
        {MARKER_DATA.map((marker, index) => (
          <SiteCard key={marker.id} marker={marker} featured={index === 0} />
        ))}
      </div>

      <h3 className='font-label text-secondary mt-16 mb-6 text-xs tracking-[0.3em] uppercase'>
        {t('home.destinations.comingSoonTitle')}
      </h3>
      <ComingSoonGrid />
    </section>
  );
};

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className='bg-surface-container relative overflow-hidden py-24'>
      <div className='lac-viet-mask pointer-events-none absolute inset-0 opacity-[0.03]'></div>
      <div className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-8 lg:grid-cols-2'>
        <div className='order-2 lg:order-1'>
          <span className='text-primary mb-6 block text-xs font-bold tracking-widest uppercase'>
            {t('home.about.sectionLabel')}
          </span>
          <h2 className='font-headline text-on-background mb-8 text-5xl leading-tight'>
            {t('home.about.heading.line1')} <br />
            <span className='text-secondary italic'>{t('home.about.heading.line2')}</span>
          </h2>
          <div className='text-on-surface-variant space-y-6 leading-relaxed'>
            <p>
              {t('home.about.p1.beforeBrand')}
              <strong>{t('brand.name')}</strong>
              {t('home.about.p1.afterBrand')}
            </p>
            <p>{t('home.about.p2')}</p>
          </div>
          <div className='border-outline/10 mt-10 grid grid-cols-2 gap-8 border-t pt-10'>
            <div>
              <div className='font-headline text-primary mb-2 text-3xl font-bold'>{MARKER_DATA.length}</div>
              <p className='font-label text-on-surface-variant text-xs tracking-wider uppercase'>
                {t('home.about.stats.sitesLabel')}
              </p>
            </div>
            <div>
              <div className='font-headline text-primary mb-2 text-3xl font-bold'>{t('home.about.stats.languagesValue')}</div>
              <p className='font-label text-on-surface-variant text-xs tracking-wider uppercase'>
                {t('home.about.stats.languagesLabel')}
              </p>
            </div>
          </div>
          <Link
            to={NAV_PATH.ABOUT}
            className='bg-on-background group hover:bg-primary font-label mt-12 inline-flex items-center gap-3 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-colors'>
            {t('actions.learnMore')}{' '}
            <span className='material-symbols-outlined transition-transform group-hover:translate-x-2'>trending_flat</span>
          </Link>
        </div>
        <div className='relative order-1 lg:order-2'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='overflow-hidden rounded-lg shadow-2xl'>
              <img className='h-full w-full object-cover' alt={t('home.about.imageAlt.tuDucPavilion')} src={TuDucPavilionImage} />
            </div>
            <div className='space-y-4'>
              <div className='overflow-hidden rounded-lg shadow-2xl'>
                <img className='aspect-square w-full object-cover' alt={t('home.about.imageAlt.tuDuc')} src={TuDucImage} />
              </div>
              <div className='overflow-hidden rounded-lg shadow-2xl'>
                <img className='aspect-square w-full object-cover' alt={t('home.about.imageAlt.denHung')} src={DenHungImage} />
              </div>
            </div>
          </div>
          <div className='bg-secondary/10 absolute -right-10 -bottom-10 -z-10 h-64 w-64 rounded-full blur-3xl'></div>
        </div>
      </div>
    </section>
  );
};

const VietnamVirtualHomePage = () => {
  return (
    <div className='bg-background text-on-background font-body min-h-screen'>
      <Hero />
      <DestinationsGrid />
      <AboutSection />
    </div>
  );
};

export default VietnamVirtualHomePage;
