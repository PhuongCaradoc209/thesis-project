import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { MapArt } from './StepArt';

const STEPS = ['map', 'walk', 'inspect'];
const FACE = 'border-on-background col-start-1 row-start-1 border-[1.5px] backface-hidden';
const NOTCH = 'bg-background hidden md:block border-on-background absolute z-10 size-7 rounded-full border-[1.5px]';

const Notches = () => (
  <>
    <span className={`${NOTCH} -top-3.5 right-[58px] [clip-path:inset(50%_0_0_0)] md:right-[82px]`} />
    <span className={`${NOTCH} right-[58px] -bottom-3.5 [clip-path:inset(0_0_50%_0)] md:right-[82px]`} />
  </>
);

const GuideTicket = () => {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState(false);

  const facts = [
    { label: t('home.steps.front.price'), value: t('home.steps.front.priceValue') },
    { label: t('home.steps.front.hours'), value: t('home.steps.front.hoursValue') },
    { label: t('home.steps.front.need'), value: t('home.steps.front.needValue') },
  ];

  return (
    <div
      role='button'
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={t('home.steps.front.flip')}
      onPointerEnter={(event) => event.pointerType === 'mouse' && setFlipped(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && setFlipped(false)}
      onPointerUp={(event) => event.pointerType !== 'mouse' && setFlipped((current) => !current)}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        setFlipped((current) => !current);
      }}
      className='mx-auto max-w-[1040px] cursor-pointer outline-none perspective-[2000px]'>
      <div
        className={`grid transition-transform duration-700 ease-[cubic-bezier(.3,.7,.2,1)] transform-3d motion-reduce:transition-none ${
          flipped ? 'rotate-y-180' : ''
        }`}>
        <div
          className={`${FACE} bg-surface-bright relative grid grid-cols-[1fr_72px] grid-rows-[auto_1fr] md:grid-cols-[260px_1fr_96px] md:grid-rows-1`}>
          <div className='border-on-background col-span-2 h-[220px] border-b-[1.5px] bg-[#fbe7c2] md:col-span-1 md:h-auto md:border-r-[1.5px] md:border-b-0'>
            <MapArt />
          </div>
          <div className='px-6 py-6 md:px-9 md:py-8'>
            <div className='text-on-surface-variant font-mono text-xs tracking-[.14em] uppercase'>
              {t('home.steps.front.kind')}
            </div>
            <div className='font-headline mt-2 text-[40px] leading-[1.1] font-extrabold uppercase [font-stretch:75%] md:text-[56px]'>
              Vietnam Virtual
            </div>
            <dl className='mt-5 font-mono text-[13px]'>
              {facts.map((fact) => (
                <div key={fact.label} className='flex justify-between gap-3 border-t border-black/15 py-2.5'>
                  <dt className='text-on-surface-variant tracking-[.06em] uppercase'>{fact.label}</dt>
                  <dd className='text-right font-semibold'>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className='bg-primary text-on-primary relative grid place-items-center'>
            <span className='border-on-background absolute inset-y-0 left-0 border-l-2 border-dashed' />
            <span className='font-mono text-sm font-semibold tracking-[.2em] uppercase [writing-mode:vertical-rl]'>
              {t('home.steps.front.flip')} ↻
            </span>
          </div>
          <Notches />
        </div>

        <div className={`${FACE} relative grid rotate-y-180 grid-cols-[1fr_72px] bg-[#fbe7c2] md:grid-cols-[1fr_96px]`}>
          <div className='flex flex-col px-6 py-6 md:px-9 md:py-8'>
            <div className='font-headline text-[26px] leading-[1.1] font-extrabold uppercase [font-stretch:80%]'>
              {t('home.steps.back.title')}
            </div>
            <ol className='mt-4 mb-6 grid gap-5 md:grid-cols-3 md:gap-8'>
              {STEPS.map((step) => (
                <li key={step} className='border-on-background border-t-[1.5px] pt-3'>
                  <div className='font-semibold'>{t(`home.steps.${step}.title`)}</div>
                  <p className='text-on-surface-variant mt-1.5 text-[14.5px] leading-[1.65]'>
                    <Trans
                      i18nKey={`home.steps.${step}.text`}
                      components={{
                        k: (
                          <kbd className='bg-surface-bright border-on-background border-[1.5px] border-b-[3px] px-1.5 py-px font-mono text-xs font-semibold' />
                        ),
                      }}
                    />
                  </p>
                </li>
              ))}
            </ol>
            <p className='text-on-surface-variant mt-auto border-t border-dashed border-black/30 pt-3 font-mono text-[11.5px] leading-5'>
              {t('home.steps.back.note')}
            </p>
          </div>
          <div className='relative bg-[#f3dcae]'>
            <span className='border-on-background absolute inset-y-0 left-0 border-l-2 border-dashed' />
          </div>
          <Notches />
        </div>
      </div>
    </div>
  );
};

export default GuideTicket;
