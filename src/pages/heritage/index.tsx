import { useTranslation } from 'react-i18next';
import SiteStamp from '../../components/heritage/SiteStamp';
import { MARKER_DATA } from '../../constants/markers';
import { GALLERY_ITEMS, formatTicketNumber } from '../../constants/siteDetails';

const WRAP = 'mx-auto max-w-[1312px] px-5 md:px-16';
const DISPLAY = 'font-headline font-extrabold uppercase [font-stretch:75%]';

const HeritagePage = () => {
  const { t } = useTranslation();
  const galleryNo = formatTicketNumber(MARKER_DATA.findIndex((marker) => marker.id === 'gallery'));

  return (
    <div className='bg-background text-on-background font-body min-h-screen overflow-x-clip pt-17'>
      <section className={`${WRAP} flex items-end justify-between gap-6 pt-11 pb-9`}>
        <div>
          <div className='text-on-surface-variant font-mono text-[12.5px] tracking-[.12em] uppercase'>
            {t('heritagePage.label')}
          </div>
          <h1 className={`${DISPLAY} mt-4 text-5xl leading-[1.15] md:text-[76px]`}>
            {t('heritagePage.title')}
            <br />
            <span className='text-primary'>{t('heritagePage.titleAccent')}</span>
          </h1>
        </div>
        <div className='text-on-surface-variant text-right font-mono text-[13px]'>
          <b className={`${DISPLAY} text-primary block text-[56px] leading-none`}>
            {String(MARKER_DATA.length).padStart(2, '0')}
          </b>
          {t('heritagePage.stamped')}
        </div>
      </section>

      <section className={`${WRAP} grid grid-cols-1 gap-14 pb-16 lg:grid-cols-2 lg:gap-11`}>
        {MARKER_DATA.map((marker, index) => (
          <SiteStamp key={marker.id} marker={marker} no={formatTicketNumber(index)} tilt={index % 2 === 0 ? 'left' : 'right'} />
        ))}
      </section>

      <section className='bg-surface-container border-on-background/85 border-t-[1.5px] pt-11 pb-18'>
        <div className={WRAP}>
          <div className='text-on-surface-variant font-mono text-[12.5px] tracking-[.12em] uppercase'>
            {t('heritagePage.insideLabel', { no: galleryNo })}
          </div>
          <h2 className={`${DISPLAY} mt-3 text-3xl leading-[1.15] md:text-4xl`}>
            {t('heritagePage.insideTitle')} <span className='text-primary'>{t('heritagePage.insideAccent')}</span>
          </h2>
          <div className='mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-[22px]'>
            {GALLERY_ITEMS.map((item) => (
              <div key={item.key} className='stamp-bold-mini'>
                <div className='bg-surface-bright border-on-background border p-2'>
                  <img
                    className='border-on-background aspect-square w-full border object-cover'
                    src={item.img}
                    alt={t(`home.collection.items.${item.key}.name`)}
                    loading='lazy'
                  />
                  <b className='font-headline mt-2 block text-[14.5px] leading-[1.05] font-extrabold uppercase [font-stretch:85%]'>
                    {t(`home.collection.items.${item.key}.name`)}
                  </b>
                  <span className='text-on-surface-variant mt-0.5 block font-mono text-[10.5px]'>
                    {t(`home.collection.items.${item.key}.era`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeritagePage;
