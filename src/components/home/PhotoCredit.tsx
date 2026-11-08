import { useTranslation } from 'react-i18next';
import type { AssetCredit } from '../../constants/credits';

const PhotoCredit = ({ credit }: { credit: AssetCredit }) => {
  const { t } = useTranslation();

  return (
    <a
      href={credit.sourceUrl}
      target='_blank'
      rel='noreferrer'
      className='bg-on-background/60 hover:bg-on-background/80 absolute right-2 bottom-2 z-10 px-1.5 py-0.5 font-mono text-[10.5px] text-white transition-colors hover:text-white'>
      {t('home.photo', { author: credit.author, license: credit.license })}
    </a>
  );
};

export default PhotoCredit;
