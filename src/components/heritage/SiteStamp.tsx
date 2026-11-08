import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { SITE_DETAILS } from '../../constants/siteDetails';
import type { MarkerData } from '../../types/marker';
import { getTourPath } from '../../utils/tourPath';
import PhotoCredit from '../home/PhotoCredit';
import Postmark from './Postmark';

type SiteStampProps = {
  marker: MarkerData;
  no: string;
  tilt: 'left' | 'right';
};

const SiteStamp = ({ marker, no, tilt }: SiteStampProps) => {
  const { t } = useTranslation();
  const detail = SITE_DETAILS[marker.id];
  const name = t(marker.nameKey);
  const city = t(marker.nameKey.replace('.name', '.city'));

  const meta =
    detail.countKey === 'stops'
      ? `${t('heritagePage.stops', { count: detail.count })} · ${t('home.tickets.minutes', { count: detail.minutes })}`
      : `${t('heritagePage.artifacts', { count: detail.count })} · ${t('heritagePage.freeRoam')}`;

  return (
    <div className='relative h-full'>
      <div className='stamp-bold h-full'>
        <div className='bg-surface-bright border-on-background flex h-full flex-col border-[1.5px] p-3 md:p-3.5'>
          <div className='border-on-background relative aspect-[16/10] overflow-hidden border-[1.5px]'>
            <img
              className='h-full w-full object-cover'
              style={{ objectPosition: detail.imagePosition }}
              src={detail.image}
              alt={name}
            />
            <PhotoCredit credit={detail.credit} />
          </div>
          <div className='mt-3.5 flex items-baseline justify-between gap-2.5'>
            <h2 className='font-headline text-[28px] leading-[1.05] font-extrabold uppercase [font-stretch:80%] md:text-[34px]'>
              {name}
            </h2>
            <span className='text-primary font-mono text-[12.5px] font-bold whitespace-nowrap'>No.{no}</span>
          </div>
          <p className='text-on-surface-variant mt-1.5 font-mono text-xs'>
            {city} · {t(`heritagePage.sites.${marker.id}`)}
          </p>
          <div className='mt-auto flex flex-wrap items-center justify-between gap-3 pt-4'>
            <span className='text-on-surface-variant font-mono text-[12.5px]'>{meta}</span>
            <Link
              to={getTourPath(marker)}
              className='bg-on-background text-background hover:bg-primary hover:text-on-primary inline-flex h-12 items-center gap-3 px-5 font-mono text-[13px] font-semibold tracking-[.08em] uppercase transition-colors'>
              {t('home.tickets.enter')} <span aria-hidden='true'>→</span>
            </Link>
          </div>
        </div>
      </div>
      <Postmark
        city={city}
        note={`${marker.latitude.toFixed(2)}°N`}
        className={`-top-8 -right-6 w-[240px] md:-top-10 md:w-[330px] ${tilt === 'left' ? '-rotate-9 md:-right-14' : 'rotate-7 md:-right-12'}`}
      />
    </div>
  );
};

export default SiteStamp;
