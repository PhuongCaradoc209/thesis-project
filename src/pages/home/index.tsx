import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import HeroPoster from '../../assets/home/hero-poster.jpg';
import TuDucLakeImage from '../../assets/home/tuduc-lake.jpg';
import PhotoCredit from '../../components/home/PhotoCredit';
import DriftStamp from '../../components/home/DriftStamp';
import GuideTicket from '../../components/home/GuideTicket';
import TicketCard from '../../components/home/TicketCard';
import { PHOTO_CREDITS } from '../../constants/credits';
import { COMING_SOON_SITES } from '../../constants/comingSoon';
import { MARKER_DATA } from '../../constants/markers';
import { ARTIFACT_COUNT, GALLERY_ITEMS, SITE_DETAILS, formatCoords, formatTicketNumber } from '../../constants/siteDetails';
import { NAV_PATH } from '../../router/paths';

const WRAP = 'mx-auto max-w-[1312px] px-5 md:px-16';
const LABEL = 'text-on-surface-variant font-mono text-[12.5px] tracking-[.12em] uppercase';
const DISPLAY = 'font-headline font-extrabold uppercase';
const BUTTON =
  'inline-flex h-14 items-center justify-center gap-3 px-7 font-mono text-sm font-semibold tracking-[.08em] uppercase transition-colors';
const BUTTON_PRIMARY = `${BUTTON} bg-primary text-on-primary hover:bg-on-background hover:text-background`;
const BUTTON_GHOST = `${BUTTON} bg-surface-bright border-on-background text-on-background hover:bg-surface-container-high border-[1.5px]`;
const SECTION = 'border-on-background/85 border-b-[1.5px] py-18 md:py-28';

type SectionHeadProps = {
  label: string;
  title: string;
  intro: string;
};

const SectionHead = ({ label, title, intro }: SectionHeadProps) => (
  <div className='mb-12 flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12'>
    <div>
      <div className={LABEL}>{label}</div>
      <h2 className={`${DISPLAY} mt-7 text-[42px] leading-[1.15] [font-stretch:75%] md:text-6xl lg:text-[72px]`}>{title}</h2>
    </div>
    <p className='text-on-surface-variant max-w-[400px] text-[16.5px] leading-[1.65]'>{intro}</p>
  </div>
);

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className='relative mt-17 grid h-[calc(100svh-68px)] max-h-[860px] min-h-[620px] place-items-center overflow-hidden text-center text-white'>
      <video
        className='absolute inset-0 h-full w-full object-cover'
        autoPlay
        loop
        muted
        playsInline
        preload='auto'
        poster={HeroPoster}
        src='/common/video/heroSection.mp4'
      />
      <div className='from-on-background/20 to-on-background/40 absolute inset-0 bg-linear-to-b' />
      <div className='relative z-10 px-6'>
        <div className='font-mono text-[13px] font-semibold tracking-[.12em] text-[#fbe7c2] uppercase'>
          {t('home.hero.eyebrow')}
        </div>
        <h1
          className={`${DISPLAY} mt-7 text-[60px] leading-[1.15] [font-stretch:72%] [text-shadow:0_2px_30px_rgba(0,0,0,.3)] md:mt-9 md:text-[124px]`}>
          {t('home.hero.title')}
          <br />
          <span className='text-secondary-fixed'>{t('home.hero.titleAccent')}</span>
        </h1>
        <p className='mx-auto mt-6 max-w-[600px] text-lg leading-relaxed [text-shadow:0_1px_14px_rgba(0,0,0,.55)] md:text-xl'>
          {t('home.hero.subtitle')}
        </p>
        <div className='mt-8 flex flex-col justify-center gap-3.5 md:flex-row'>
          <Link to={NAV_PATH.MAP} className={BUTTON_PRIMARY}>
            {t('actions.startExploring')} <span aria-hidden='true'>→</span>
          </Link>
          <a
            href='#tickets'
            className={`${BUTTON} border-[1.5px] border-[#fffaf0] bg-[#fffaf0]/10 text-[#fffaf0] hover:bg-[#fffaf0]/25 hover:text-[#fffaf0]`}>
            {t('home.hero.secondary')}
          </a>
        </div>
      </div>
    </section>
  );
};

const Ticker = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-primary text-on-primary'>
      <div
        className={`${WRAP} flex h-13 items-center justify-between font-mono text-[11px] tracking-[.1em] uppercase md:text-[13px]`}>
        <span>{t('home.ticker.open', { count: MARKER_DATA.length })}</span>
        <span>{t('home.ticker.artifacts', { count: ARTIFACT_COUNT })}</span>
        <span className='hidden sm:inline'>{t('home.ticker.soon', { count: COMING_SOON_SITES.length })}</span>
        <span className='hidden md:inline'>{t('home.ticker.always')}</span>
      </div>
    </div>
  );
};

const Tickets = () => {
  const { t } = useTranslation();

  return (
    <section id='tickets' className={`${SECTION} scroll-mt-17`}>
      <div className={WRAP}>
        <SectionHead label={t('home.tickets.label')} title={t('home.tickets.title')} intro={t('home.tickets.intro')} />
        <div className='grid grid-cols-1 gap-7 xl:grid-cols-2'>
          {MARKER_DATA.map((marker, index) => {
            const extra = SITE_DETAILS[marker.id];
            if (!extra) return null;
            const facts = [
              { label: t('home.tickets.coords'), value: formatCoords(marker) },
              { label: t(`home.tickets.${extra.countKey}`), value: String(extra.count) },
              {
                label: t('home.tickets.duration'),
                value: extra.minutes ? t('home.tickets.minutes', { count: extra.minutes }) : t('home.tickets.free'),
              },
            ];
            return (
              <TicketCard
                key={marker.id}
                marker={marker}
                no={formatTicketNumber(index)}
                image={extra.image}
                imagePosition={extra.imagePosition}
                credit={extra.credit}
                facts={facts}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Steps = () => {
  const { t } = useTranslation();

  return (
    <section className={`${SECTION} bg-[url(/common/image/background.webp)] bg-cover bg-center`}>
      <div className={WRAP}>
        <SectionHead label={t('home.steps.label')} title={t('home.steps.title')} intro={t('home.steps.intro')} />
        <GuideTicket />
      </div>
    </section>
  );
};

const Collection = () => {
  const { t } = useTranslation();

  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <SectionHead label={t('home.collection.label')} title={t('home.collection.title')} intro={t('home.collection.intro')} />
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
          {GALLERY_ITEMS.map((item) => {
            const name = t(`home.collection.items.${item.key}.name`);
            return (
              <DriftStamp key={item.key}>
                <div className='stamp-edge p-[7px] transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1'>
                  <div className='bg-surface-bright border border-black/10 px-3 pt-3 pb-3.5'>
                    <div className='border-on-background aspect-[4/3.4] overflow-hidden border-[1.5px] bg-[#fbe7c2]'>
                      <img className='block h-full w-full object-cover' src={item.img} alt={name} loading='lazy' />
                    </div>
                    <div className='mt-3 flex items-baseline justify-between gap-2'>
                      <b className={`${DISPLAY} text-[19px] leading-[1.05] [font-stretch:85%]`}>{name}</b>
                    </div>
                    <small className='text-on-surface-variant mt-1.5 block font-mono text-xs'>
                      {t(`home.collection.items.${item.key}.era`)}
                    </small>
                    <a
                      href={item.credit.sourceUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='text-on-surface-variant/80 hover:text-on-surface mt-1 block font-mono text-[10.5px]'>
                      {t('home.photo', { author: item.credit.author, license: item.credit.license })}
                    </a>
                  </div>
                </div>
              </DriftStamp>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Departures = () => {
  const { t } = useTranslation();
  const row = 'grid grid-cols-[84px_1fr_auto] items-center gap-x-3 lg:grid-cols-[90px_80px_1fr_220px_240px_140px] lg:gap-x-0';

  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <SectionHead label={t('home.board.label')} title={t('home.board.title')} intro={t('home.board.intro')} />
        <div className='border-on-background border-t-[1.5px] font-mono text-[13.5px]'>
          <div
            className={`${row} text-on-surface-variant hidden border-b border-black/20 py-3 text-[11.5px] tracking-[.12em] uppercase lg:grid`}>
            <span>{t('home.board.no')}</span>
            <span />
            <span>{t('home.board.site')}</span>
            <span>{t('home.board.province')}</span>
            <span>{t('home.board.kind')}</span>
            <span className='text-right'>{t('home.board.status')}</span>
          </div>
          {COMING_SOON_SITES.map((site) => (
            <div key={site.key} className={`${row} border-b border-black/20 py-3.5`}>
              <span className='hidden lg:block'>{site.no}</span>
              <span>
                <span className='border-on-background block h-14 w-18 overflow-hidden border-[1.5px]'>
                  <img
                    className='block h-full w-full object-cover saturate-[.85]'
                    src={site.img}
                    alt={t(`home.destinations.${site.key}.alt`)}
                    loading='lazy'
                  />
                </span>
              </span>
              <span className={`${DISPLAY} text-[22px] [font-stretch:85%] md:text-[26px]`}>
                {t(`home.destinations.${site.key}.title`)}
                <span className='text-on-surface-variant mt-0.5 block font-mono text-[10.5px] font-normal normal-case'>
                  {t('home.photo', { author: site.credit.author, license: site.credit.license })}
                </span>
              </span>
              <span className='hidden lg:block'>{t(`home.destinations.${site.key}.province`)}</span>
              <span className='hidden lg:block'>{t(`home.destinations.${site.key}.kind`)}</span>
              <span className='text-right'>
                <span className='border-on-background border-[1.5px] px-2 py-1 text-xs font-semibold tracking-[.06em] whitespace-nowrap uppercase'>
                  {t('home.destinations.comingSoon')}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCall = () => {
  const { t } = useTranslation();

  return (
    <section className='bg-surface-container-high py-18 md:py-26'>
      <div className={`${WRAP} grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-16`}>
        <div>
          <div className={LABEL}>{t('home.final.label')}</div>
          <h2 className={`${DISPLAY} mt-7 text-[42px] leading-[1.15] [font-stretch:75%] md:text-[84px]`}>
            {t('home.final.title')}
          </h2>
          <div className='mt-8 flex flex-col gap-3.5 md:flex-row'>
            <Link to={NAV_PATH.MAP} className={BUTTON_PRIMARY}>
              {t('actions.startExploring')} <span aria-hidden='true'>→</span>
            </Link>
            <Link to={NAV_PATH.ABOUT} className={BUTTON_GHOST}>
              {t('actions.learnMore')}
            </Link>
          </div>
        </div>
        <div className='border-on-background relative h-[420px] overflow-hidden border-[1.5px] bg-[#fbe7c2]'>
          <img
            className='absolute inset-0 h-full w-full object-cover'
            src={TuDucLakeImage}
            alt={t('sites.tuDuc.name')}
            loading='lazy'
          />
          <PhotoCredit credit={PHOTO_CREDITS.tuDucLake} />
        </div>
      </div>
    </section>
  );
};

const VietnamVirtualHomePage = () => {
  return (
    <div className='bg-background text-on-background font-body min-h-screen overflow-x-clip'>
      <Hero />
      <Ticker />
      <Tickets />
      <Steps />
      <Collection />
      <Departures />
      <FinalCall />
    </div>
  );
};

export default VietnamVirtualHomePage;
