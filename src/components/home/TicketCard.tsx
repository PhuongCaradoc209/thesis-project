import { motion } from 'motion/react';
import { useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { AssetCredit } from '../../constants/credits';
import type { MarkerData } from '../../types/marker';
import { useTearToEnter } from '../../hooks/useTearToEnter';
import { PICTURE_EDGE, STUB_EDGE, STUB_MOTION, STUB_REST, TEAR_TRANSITION, type TearDirection } from '../../utils/ticketTear';
import { getTourPath } from '../../utils/tourPath';
import PhotoCredit from './PhotoCredit';

export type TicketFact = {
  label: string;
  value: string;
};

type TicketCardProps = {
  marker: MarkerData;
  no: string;
  image: string;
  imagePosition?: string;
  credit: AssetCredit;
  facts: TicketFact[];
};

const TicketCard = ({ marker, no, image, imagePosition, credit, facts }: TicketCardProps) => {
  const { t } = useTranslation();
  const [tear, setTear] = useState<TearDirection | null>(null);

  const name = t(marker.nameKey);
  const { startTear } = useTearToEnter(getTourPath(marker));

  const handleEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    if (startTear(event)) setTear(window.matchMedia('(min-width: 768px)').matches ? 'side' : 'down');
  };

  return (
    <article className='grid min-h-[380px] grid-cols-1 md:grid-cols-[1fr_270px]'>
      <div
        className='border-on-background relative min-h-60 border-[1.5px] border-b-0 bg-[#fbe7c2] md:min-h-0 md:border-r-0 md:border-b-[1.5px]'
        style={{ clipPath: tear ? PICTURE_EDGE[tear] : undefined }}>
        <div className='group absolute inset-0 overflow-hidden'>
          <img
            className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
            style={{ objectPosition: imagePosition }}
            src={image}
            alt={name}
          />
        </div>
        <span className='bg-primary text-on-primary absolute top-3.5 left-3.5 z-10 px-[9px] py-[5px] font-mono text-[11.5px] font-semibold tracking-[.1em] uppercase'>
          {t(`home.tickets.sites.${marker.id}.tag`)}
        </span>
        <PhotoCredit credit={credit} />
        <span className='border-on-background pointer-events-none absolute inset-x-0 bottom-0 z-10 border-b-2 border-dashed md:inset-x-auto md:inset-y-0 md:right-0 md:border-r-2 md:border-b-0' />
        {!tear && (
          <>
            <span className='bg-background border-on-background absolute -top-3 -right-3 z-20 hidden size-6 rounded-full border-[1.5px] [clip-path:inset(50%_0_0_0)] md:block' />
            <span className='bg-background border-on-background absolute -right-3 -bottom-3 z-20 hidden size-6 rounded-full border-[1.5px] [clip-path:inset(0_0_50%_0)] md:block' />
          </>
        )}
      </div>

      <motion.div
        className='bg-surface-bright border-on-background flex flex-col border-[1.5px] border-t-0 px-[22px] pt-6 pb-[22px] md:border-t-[1.5px] md:border-l-0'
        style={{ clipPath: tear ? STUB_EDGE[tear] : undefined }}
        initial={false}
        animate={tear ? STUB_MOTION[tear] : STUB_REST}
        transition={TEAR_TRANSITION}>
        <div className='text-on-surface-variant font-mono text-xs tracking-[.12em] uppercase'>
          {t('home.tickets.number', { no })}
        </div>
        <h3 className='font-headline mt-2 text-[32px] leading-[1.05] font-extrabold uppercase [font-stretch:80%]'>{name}</h3>
        <p className='text-on-surface-variant mt-3 text-sm leading-relaxed'>{t(`home.tickets.sites.${marker.id}.text`)}</p>
        <dl className='mt-3.5 font-mono text-xs'>
          {facts.map((fact) => (
            <div key={fact.label} className='flex justify-between gap-2 border-t border-black/15 py-[7px]'>
              <dt className='text-on-surface-variant tracking-[.06em] uppercase'>{fact.label}</dt>
              <dd className='text-right font-semibold'>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className='mt-auto pt-6'>
          <Link
            to={getTourPath(marker)}
            onClick={handleEnter}
            aria-label={`${t('home.tickets.enter')}: ${name}`}
            className='bg-on-background text-background hover:bg-primary hover:text-on-primary flex h-12 items-center justify-between px-4 font-mono text-[13px] font-semibold tracking-[.1em] uppercase transition-colors'>
            {t('home.tickets.enter')} <span aria-hidden='true'>→</span>
          </Link>
        </div>
      </motion.div>
    </article>
  );
};

export default TicketCard;
