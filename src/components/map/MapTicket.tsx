import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { SITE_DETAILS, formatCoords } from '../../constants/siteDetails';
import { useTearToEnter } from '../../hooks/useTearToEnter';
import type { MarkerData } from '../../types/marker';
import { PICTURE_EDGE, STUB_EDGE, STUB_MOTION, STUB_REST, TEAR_TRANSITION } from '../../utils/ticketTear';
import { getTourPath } from '../../utils/tourPath';
import PhotoCredit from '../home/PhotoCredit';

type MapTicketProps = {
  marker: MarkerData;
  no: string;
  onHoverChange: (id: string | null) => void;
};

const NOTCH = 'bg-background border-on-background absolute -left-3 z-10 size-6 rounded-full border-[1.5px]';

export const MapTicket = ({ marker, no, onHoverChange }: MapTicketProps) => {
  const { t } = useTranslation();
  const { isTearing, startTear } = useTearToEnter(getTourPath(marker));
  const detail = SITE_DETAILS[marker.id];
  const name = t(marker.nameKey);

  const facts = [
    { label: t('home.tickets.coords'), value: formatCoords(marker) },
    { label: t(`home.tickets.${detail.countKey}`), value: String(detail.count) },
    {
      label: t('home.tickets.duration'),
      value: detail.minutes ? t('home.tickets.minutes', { count: detail.minutes }) : t('home.tickets.free'),
    },
  ];

  return (
    <article
      className='grid grid-cols-[1fr_72px] md:grid-cols-[1fr_78px]'
      onMouseEnter={() => onHoverChange(marker.id)}
      onMouseLeave={() => onHoverChange(null)}>
      <div
        className='bg-surface-bright border-on-background border-[1.5px] border-r-0'
        style={{ clipPath: isTearing ? PICTURE_EDGE.side : undefined }}>
        <div className='border-on-background relative h-[200px] overflow-hidden border-b-[1.5px] md:h-[230px]'>
          <img
            className='h-full w-full object-cover'
            style={{ objectPosition: detail.imagePosition }}
            src={detail.image}
            alt={name}
          />
          <span className='bg-primary text-on-primary absolute top-3 left-3 px-[9px] py-[5px] font-mono text-[11.5px] font-semibold tracking-[.1em] uppercase'>
            {t(`home.tickets.sites.${marker.id}.tag`)}
          </span>
          <PhotoCredit credit={detail.credit} />
        </div>
        <div className='px-[18px] pt-3.5 pb-4'>
          <div className='text-on-surface-variant font-mono text-[11.5px] tracking-[.12em] uppercase'>
            {t('home.tickets.number', { no })} · {t(marker.nameKey.replace('.name', '.city'))}
          </div>
          <h2 className='font-headline mt-1.5 text-[28px] leading-[1.05] font-extrabold uppercase [font-stretch:78%] md:text-[32px]'>
            {name}
          </h2>
          <dl className='mt-3 font-mono text-xs'>
            {facts.map((fact) => (
              <div key={fact.label} className='flex justify-between gap-2 border-t border-black/15 py-[7px]'>
                <dt className='text-on-surface-variant tracking-[.06em] uppercase'>{fact.label}</dt>
                <dd className='text-right font-semibold'>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <motion.div
        className='relative'
        style={{ clipPath: isTearing ? STUB_EDGE.side : undefined }}
        initial={false}
        animate={isTearing ? STUB_MOTION.side : STUB_REST}
        transition={TEAR_TRANSITION}>
        <span className={`${NOTCH} -top-3 [clip-path:inset(50%_0_0_0)]`} />
        <span className={`${NOTCH} -bottom-3 [clip-path:inset(0_0_50%_0)]`} />
        <Link
          to={getTourPath(marker)}
          onClick={startTear}
          aria-label={`${t('home.tickets.enter')}: ${name}`}
          className='bg-primary text-on-primary border-on-background hover:bg-on-background hover:text-background flex h-full items-center justify-center border-[1.5px] border-l-0 transition-colors'>
          <span className='font-mono text-[15px] font-semibold tracking-[.2em] uppercase [writing-mode:vertical-rl]'>
            {t('home.tickets.enter')} →
          </span>
        </Link>
        <span className='border-on-background pointer-events-none absolute inset-y-0 left-0 border-l-2 border-dashed' />
      </motion.div>
    </article>
  );
};

type MapTicketStripProps = {
  marker: MarkerData;
  no: string;
  onSelect: (id: string) => void;
  onHoverChange: (id: string | null) => void;
};

export const MapTicketStrip = ({ marker, no, onSelect, onHoverChange }: MapTicketStripProps) => {
  const { t } = useTranslation();
  const detail = SITE_DETAILS[marker.id];

  return (
    <button
      type='button'
      onClick={() => onSelect(marker.id)}
      onMouseEnter={() => onHoverChange(marker.id)}
      onMouseLeave={() => onHoverChange(null)}
      className='group grid w-full grid-cols-[1fr_72px] text-left md:grid-cols-[1fr_78px]'>
      <span className='bg-surface-bright border-on-background group-hover:bg-surface-container-high grid grid-cols-[88px_1fr] items-center border-[1.5px] border-r-0 transition-colors md:grid-cols-[100px_1fr]'>
        <img className='border-on-background h-[88px] w-full border-r-[1.5px] object-cover' src={detail.image} alt='' />
        <span className='px-4 py-2'>
          <span className='text-on-surface-variant block font-mono text-[11.5px] tracking-[.12em] uppercase'>
            {t('home.tickets.number', { no })} · {t(marker.nameKey.replace('.name', '.city'))}
          </span>
          <span className='font-headline mt-1 block text-[22px] leading-[1.1] font-extrabold uppercase [font-stretch:80%]'>
            {t(marker.nameKey)}
          </span>
        </span>
      </span>
      <span className='bg-surface-bright border-on-background group-hover:bg-surface-container-high relative grid place-items-center border-[1.5px] border-l-2 border-l-transparent transition-colors'>
        <span className='border-on-background absolute inset-y-0 -left-0.5 border-l-2 border-dashed' />
        <span className='font-mono text-[11.5px] font-semibold tracking-[.14em] uppercase [writing-mode:vertical-rl]'>
          {t('mapPage.flyTo')}
        </span>
      </span>
    </button>
  );
};
