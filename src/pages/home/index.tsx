import { useTranslation } from 'react-i18next';

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
          <button className='bg-primary text-on-primary font-label px-10 py-4 text-sm font-bold tracking-widest uppercase shadow-xl transition-transform hover:scale-105 active:scale-95'>
            {t('actions.startExploring')}
          </button>
        </div>
      </div>
    </section>
  );
};

const BentoCardSmall = ({ title, img, alt }: { title: string; img: string; alt: string }) => {
  const { t } = useTranslation();

  return (
    <div className='group relative aspect-square overflow-hidden rounded-lg shadow-lg md:col-span-4'>
      <img className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110' alt={alt} src={img} />
      <div className='bg-on-background/40 group-hover:bg-on-background/20 absolute inset-0 transition-colors'></div>
      <div className='absolute inset-0 flex flex-col justify-end p-6 text-white'>
        <h3 className='font-headline mb-4 text-2xl'>{title}</h3>
        <button className='border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-tighter uppercase backdrop-blur-md'>
          {t('actions.view3dTour')}
        </button>
      </div>
    </div>
  );
};

const BentoCardLarge = ({ title, description, img, alt }: { title: string; description: string; img: string; alt: string }) => {
  const { t } = useTranslation();

  return (
    <div className='group relative aspect-video overflow-hidden rounded-lg shadow-lg md:col-span-8'>
      <img className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110' alt={alt} src={img} />
      <div className='from-on-background absolute inset-0 bg-linear-to-t to-transparent opacity-80'></div>
      <div className='absolute bottom-0 p-8 text-white'>
        <h3 className='font-headline mb-2 text-3xl'>{title}</h3>
        <p className='font-body mb-6 max-w-md text-sm text-white/80'>{description}</p>
        <button className='text-secondary-fixed flex items-center gap-2 text-xs font-bold tracking-widest uppercase'>
          {t('actions.view3dTour')} <span className='material-symbols-outlined text-sm'>arrow_forward</span>
        </button>
      </div>
    </div>
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
        <BentoCardLarge
          title={t('home.destinations.hue.title')}
          description={t('home.destinations.hue.description')}
          img='https://lh3.googleusercontent.com/aida-public/AB6AXuDJiaa8GgPLZI-USn7QyTz8R3clBasrPZSmvY9_2aYqRm7MnC1HkotDmcD-xUHuaej4hUYyMznvoh_IG_aJO3LAYvIJwzcDjlbt809aCo17FMC4zoEPhw2ztQviJGEUz00x02Df0z76caTI-pKxRnkZQI8WW3VhSGmZ3k3Cf3Ewyf1mIL_9VwZph2BrsoFJR0KfDrsnKG9nhAYvk6hxV50rj2JqyOpT4l1UeqUDodAgpyzRpNpDiloESTMTqBKOQk4qJN9n443ByeQ'
          alt={t('home.destinations.hue.alt')}
        />
        <BentoCardSmall
          title={t('home.destinations.hoiAn.title')}
          img='https://lh3.googleusercontent.com/aida-public/AB6AXuA4e0NS_y4WOQuYPUfg42Mnz-3dXBaHFGCl6h9PuYl9__r3-oAXtbsPgDHzT4gKmdEBqmiNQhn2op2WSLjr4eolYam3sqwwz2OsojqcV34c2FgnvK2t52wvpZobiDkyWMgQSsaCpKnhuvZKVLCr-Y2ChQzmiHGgF1H8Jf9tKPmz1wEuBvcPBv1XAdQLChPpQtKoYSVUT4llPaGTtpoTfPJaZApa5eSm5iqDh9gY3-wAuCYZFJjpqAJ8hXix4_SaeOGGl7QHl7zaeFk'
          alt={t('home.destinations.hoiAn.alt')}
        />
        <BentoCardSmall
          title={t('home.destinations.fansipan.title')}
          img='https://lh3.googleusercontent.com/aida-public/AB6AXuCAdNAcyWMcAY9SzC9A5wBGmareHDKu8oS7Olmuy0otBuhB5YYoF_WoTWwpt9hh5-qAWeYGuStkq97bNbnZycD9PiXsCE5QNxXJKJ8caTmb8TjfEJ-Cy_m3YVDJxUKL92GD_cKTLdzI0VXo-BvKzV4z2mykY9IsZk3toFLxKkCmnIxUfflcasIKrOgbkn0PDTRPrlhhC3xJ_OuVvzS3otD24m4cgSDizUZnzmS0FfbbBN66XpU9VHSZL0iGtyE1e8t1b5b2-mKQRbo'
          alt={t('home.destinations.fansipan.alt')}
        />
        <BentoCardLarge
          title={t('home.destinations.trangAn.title')}
          description={t('home.destinations.trangAn.description')}
          img='https://lh3.googleusercontent.com/aida-public/AB6AXuDkszAPCBl9F8IbBxUGq27ooGFvx3OkvyQYYY7sanUH1CYpm2Ntug2MkIMGMgXONJwSewL1x0cEmUjmJ8xyoHC3sLQAkFnAKy0IL1UEemcp79Vvg9mauKTiI7uJKQacRQCtVZ-K_K7eQYkHFMthilb70XAHKUQTM1grvPE91xv93qq3qVMrkm37XCJ5HtkrDsjv-rSBTs11AbZaIaesZ3H3cs0c3CpTVRUNZXpqs4OgXqxrRwBu5rgfeYAJcIPGFHrfvECvPn2nbxs'
          alt={t('home.destinations.trangAn.alt')}
        />
      </div>
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
              <div className='font-headline text-primary mb-2 text-3xl font-bold'>{t('home.about.stats.panoramicValue')}</div>
              <p className='font-label text-xs tracking-wider text-stone-500 uppercase'>{t('home.about.stats.panoramicLabel')}</p>
            </div>
            <div>
              <div className='font-headline text-primary mb-2 text-3xl font-bold'>{t('home.about.stats.resolutionValue')}</div>
              <p className='font-label text-xs tracking-wider text-stone-500 uppercase'>
                {t('home.about.stats.resolutionLabel')}
              </p>
            </div>
          </div>
          <button className='bg-on-background group hover:bg-primary font-label mt-12 flex items-center gap-3 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-colors'>
            {t('actions.learnMore')}{' '}
            <span className='material-symbols-outlined transition-transform group-hover:translate-x-2'>trending_flat</span>
          </button>
        </div>

        <div className='relative order-1 grid grid-cols-2 gap-4 lg:order-2'>
          <div className='space-y-4 pt-12'>
            <div className='overflow-hidden rounded-lg shadow-2xl'>
              <img
                className='aspect-3/4 w-full object-cover'
                alt={t('home.about.imageAlt.dragonRelief')}
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuAj6Nmzj3CuJ6LtEltY2uHd7tpHmwU1jG-E-f8h4wvA_ilyybUK-rNIjvDmcAbYb8PgLOFISHaMzi6xPOTCj4dFUMbCBhEs546PgxjaHyCfIRw6cDi9BScCKMA9JnCe-leW7rTlSqzkpusujjdeP07wwDXjlH_Un5C0BiAxWtEMjpE1cCT8Fh1rA-w_hIOlgRTHhPii1eQnHhr4O29JveOgkcfypTREZKOfIGcCHPXmOEnG4wPS1fHQdXgWB6zWHzHSUP_1gKJtYbw'
              />
            </div>
            <div className='overflow-hidden rounded-lg shadow-2xl'>
              <img
                className='aspect-square w-full object-cover'
                alt={t('home.about.imageAlt.aoDaiEmbroidery')}
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuDzlgZ2jw7hz9g7FjoHChXQxw1_UsmECq7IvQgqT2TsEJ1rxGr0dUgvOc4tCIHPMpgS4Qh7e9D4a30izuZrgWeIEQAxuuNK9DJes1_DQTGwVHdGYylO737kJS_XiVTmmBe9lh4bUS6Qeq236hdLjFziHzussZWHyEhKL5pMNRta3_tAUH5AgEP1-CeZg5HUZ9aunFWIjybUolg2gCkhElejQJNYstzHtfd_LgLkVEQm6PUOggPluoNF46SuiChs2C2L5mLZ6fUXFT4'
              />
            </div>
          </div>
          <div className='space-y-4'>
            <div className='overflow-hidden rounded-lg shadow-2xl'>
              <img
                className='aspect-square w-full object-cover'
                alt={t('home.about.imageAlt.bronzeDrum')}
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuACYf1DWbbl9CCN1ZVKxc44Tc6qO_zW91COj0RUrCfGFsWUJ8YOZy4Xvq7yXwjEBPtQqUbCM5zIa5j-cXZ_WRuKBN5o32HNG9fLfibXsNSgFFBuEWR3-6q-rQ6xc1F9AIa3PPyknxodRey_cLvTwsxZKM5evcC5aV52TOvwUgKISbaBCi-YCWbxEAjHyfIPcYrMLeXDqpBnyAhGIth7tHy45nk1aqOuAy1d8hCuSn8Y0r3BD8FPSp4425gMNwmL3US38YLKmjuxQdI'
              />
            </div>
            <div className='overflow-hidden rounded-lg shadow-2xl'>
              <img
                className='aspect-3/4 w-full object-cover'
                alt={t('home.about.imageAlt.huePavilion')}
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuDxDL0suPZW-QVlSsVmOWc9mWMloXfed3Pnz5_fvt7If3ZkAj3T5jJevJykh0MxyDPdfr_D67CmRKWlM_2V1Q3-E4KMstMwu2r4giShNXZt9g2awWvAIwwpYuD4dUh9JUJ8NU9MqnC6xpLm2haaAZx3Irf9LxPTGGw4lfwxlY6aXpb9Z-FJkaDoJbt3ORDa-qxsYVy--rEF6AKCYsfddv9kDGs_plq5w2AC71WmwX3iDRmPMj0GekNADRqtTbdoHa-S55ei_V-JJro'
              />
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
