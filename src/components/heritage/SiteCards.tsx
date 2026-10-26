import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { MarkerData } from '../../types/marker';
import { getTourPath } from '../../utils/tourPath';

const HueImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJiaa8GgPLZI-USn7QyTz8R3clBasrPZSmvY9_2aYqRm7MnC1HkotDmcD-xUHuaej4hUYyMznvoh_IG_aJO3LAYvIJwzcDjlbt809aCo17FMC4zoEPhw2ztQviJGEUz00x02Df0z76caTI-pKxRnkZQI8WW3VhSGmZ3k3Cf3Ewyf1mIL_9VwZph2BrsoFJR0KfDrsnKG9nhAYvk6hxV50rj2JqyOpT4l1UeqUDodAgpyzRpNpDiloESTMTqBKOQk4qJN9n443ByeQ';
const HoiAnImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4e0NS_y4WOQuYPUfg42Mnz-3dXBaHFGCl6h9PuYl9__r3-oAXtbsPgDHzT4gKmdEBqmiNQhn2op2WSLjr4eolYam3sqwwz2OsojqcV34c2FgnvK2t52wvpZobiDkyWMgQSsaCpKnhuvZKVLCr-Y2ChQzmiHGgF1H8Jf9tKPmz1wEuBvcPBv1XAdQLChPpQtKoYSVUT4llPaGTtpoTfPJaZApa5eSm5iqDh9gY3-wAuCYZFJjpqAJ8hXix4_SaeOGGl7QHl7zaeFk';
const FansipanImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAdNAcyWMcAY9SzC9A5wBGmareHDKu8oS7Olmuy0otBuhB5YYoF_WoTWwpt9hh5-qAWeYGuStkq97bNbnZycD9PiXsCE5QNxXJKJ8caTmb8TjfEJ-Cy_m3YVDJxUKL92GD_cKTLdzI0VXo-BvKzV4z2mykY9IsZk3toFLxKkCmnIxUfflcasIKrOgbkn0PDTRPrlhhC3xJ_OuVvzS3otD24m4cgSDizUZnzmS0FfbbBN66XpU9VHSZL0iGtyE1e8t1b5b2-mKQRbo';
const TrangAnImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDkszAPCBl9F8IbBxUGq27ooGFvx3OkvyQYYY7sanUH1CYpm2Ntug2MkIMGMgXONJwSewL1x0cEmUjmJ8xyoHC3sLQAkFnAKy0IL1UEemcp79Vvg9mauKTiI7uJKQacRQCtVZ-K_K7eQYkHFMthilb70XAHKUQTM1grvPE91xv93qq3qVMrkm37XCJ5HtkrDsjv-rSBTs11AbZaIaesZ3H3cs0c3CpTVRUNZXpqs4OgXqxrRwBu5rgfeYAJcIPGFHrfvECvPn2nbxs';

// Địa điểm thuộc lộ trình: chưa có scene nên không bấm được và được đánh dấu rõ là "Sắp ra mắt"
const COMING_SOON_SITES = [
  { key: 'hue', img: HueImage },
  { key: 'hoiAn', img: HoiAnImage },
  { key: 'fansipan', img: FansipanImage },
  { key: 'trangAn', img: TrangAnImage },
] as const;

type SiteCardProps = {
  marker: MarkerData;
  featured: boolean;
};

export const SiteCard = ({ marker, featured }: SiteCardProps) => {
  const { t } = useTranslation();
  const name = t(marker.nameKey);

  return (
    <Link
      to={getTourPath(marker)}
      className={`group relative block overflow-hidden rounded-lg shadow-lg ${
        featured ? 'aspect-video md:col-span-8' : 'aspect-square md:col-span-4'
      }`}>
      <img
        className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
        alt={name}
        src={marker.thumbnail}
      />
      <div className='from-on-background absolute inset-0 bg-linear-to-t to-transparent opacity-80'></div>
      <div className='absolute bottom-0 p-8 text-white'>
        <h3 className={`font-headline mb-2 ${featured ? 'text-3xl' : 'text-2xl'}`}>{name}</h3>
        <p className='font-body mb-6 max-w-md text-sm text-white/85'>{t(`home.destinations.sites.${marker.id}`)}</p>
        <span className='text-secondary-fixed flex items-center gap-2 text-xs font-bold tracking-widest uppercase'>
          {t('home.destinations.enter')} <span className='material-symbols-outlined text-sm'>arrow_forward</span>
        </span>
      </div>
    </Link>
  );
};

const ComingSoonCard = ({ siteKey, img }: { siteKey: string; img: string }) => {
  const { t } = useTranslation();

  return (
    <div className='relative aspect-4/3 overflow-hidden rounded-lg md:col-span-3'>
      <img className='h-full w-full object-cover grayscale-[60%]' alt={t(`home.destinations.${siteKey}.alt`)} src={img} />
      <div className='bg-on-background/55 absolute inset-0'></div>
      <div className='absolute inset-0 flex flex-col justify-between p-5 text-white'>
        <span className='bg-surface/90 text-on-surface self-start rounded px-2 py-1 text-xs font-semibold'>
          {t('home.destinations.comingSoon')}
        </span>
        <h3 className='font-headline text-xl'>{t(`home.destinations.${siteKey}.title`)}</h3>
      </div>
    </div>
  );
};

export const ComingSoonGrid = () => (
  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-12'>
    {COMING_SOON_SITES.map((site) => (
      <ComingSoonCard key={site.key} siteKey={site.key} img={site.img} />
    ))}
  </div>
);
