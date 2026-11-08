import { useId } from 'react';
import { useTranslation } from 'react-i18next';

const RED = '#b14c26';
const WAVES = [-36, -18, 0, 18, 36];

type PostmarkProps = {
  city: string;
  note: string;
  className?: string;
};

const Postmark = ({ city, note, className = '' }: PostmarkProps) => {
  const { t } = useTranslation();
  const ringId = useId().replace(/:/g, '');

  return (
    <svg
      viewBox='-70 -70 300 140'
      className={`pointer-events-none absolute opacity-90 mix-blend-multiply ${className}`}
      aria-hidden='true'>
      <defs>
        <path id={ringId} d='M0 0 m-49 0 a49 49 0 1 1 98 0 a49 49 0 1 1 -98 0' />
      </defs>
      <g fill='none' stroke={RED}>
        <circle r='64' strokeWidth='5' />
        <circle r='38' strokeWidth='3' />
        {WAVES.map((y) => (
          <path key={y} d={`M70 ${y} q 14 -9 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0`} strokeWidth='4.5' />
        ))}
      </g>
      <text fill={RED} fontFamily='IBM Plex Mono' fontWeight='700' fontSize='11.5' letterSpacing='3'>
        <textPath href={`#${ringId}`}>{t('heritagePage.postmark')}</textPath>
      </text>
      <text
        y='-6'
        fill={RED}
        fontFamily='Archivo'
        fontWeight='900'
        fontSize={city.length > 4 ? 15 : 21}
        textAnchor='middle'
        style={{ fontStretch: '75%' }}>
        {city.toLocaleUpperCase('vi')}
      </text>
      <rect x='-30' y='2' width='60' height='2.5' fill={RED} />
      <text y='20' fill={RED} fontFamily='IBM Plex Mono' fontWeight='700' fontSize='11' textAnchor='middle'>
        {note}
      </text>
    </svg>
  );
};

export default Postmark;
