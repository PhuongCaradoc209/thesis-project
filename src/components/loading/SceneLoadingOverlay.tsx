import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingBackground from '../../assets/loading.png';
import TuDucLoading from '../../assets/scenes/tuduc/TuDucLoading.jpg';
import type { ScenePresentation } from '../../utils/scenePresentation';

type SceneLoadingOverlayProps = {
  presentation: ScenePresentation | null;
  progress: number;
  statusText: string;
};

const IMAGE_WIDTH = 1345;
const IMAGE_HEIGHT = 784;
const CIRCLE_X = 695;
const CIRCLE_Y = 424;
const CIRCLE_RADIUS = 326;

const getCircle = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = Math.max(width / IMAGE_WIDTH, height / IMAGE_HEIGHT);

  return {
    x: width / 2 + (CIRCLE_X - IMAGE_WIDTH / 2) * scale,
    y: height / 2 + (CIRCLE_Y - IMAGE_HEIGHT / 2) * scale,
    radius: CIRCLE_RADIUS * scale,
  };
};

export default function SceneLoadingOverlay({ presentation, progress, statusText }: SceneLoadingOverlayProps) {
  const { t } = useTranslation();
  const [circle, setCircle] = useState(getCircle);
  const loadingImage = presentation?.loadingBackground ?? TuDucLoading;
  const name = presentation?.name ?? t('loading.title');
  const percent = Math.round(progress);
  const circumference = 2 * Math.PI * circle.radius;
  const photoSize = Math.min(circle.radius * 0.95, 320);

  useEffect(() => {
    const handleResize = () => setCircle(getCircle());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      className='text-on-background fixed inset-0 z-90 overflow-hidden'
      style={{ backgroundImage: `url(${LoadingBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}>
      <svg className='pointer-events-none absolute inset-0 h-full w-full' aria-hidden='true'>
        <circle
          cx={circle.x}
          cy={circle.y}
          r={circle.radius}
          fill='none'
          stroke='#b14c26'
          strokeWidth='4'
          strokeLinecap='round'
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
          transform={`rotate(-90 ${circle.x} ${circle.y})`}
          className='transition-[stroke-dashoffset] duration-300 ease-out'
        />
      </svg>

      <div
        className='absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center px-6 text-center'
        style={{ left: circle.x, top: circle.y, width: circle.radius * 1.7 }}>
        <div className='relative' style={{ width: photoSize, height: photoSize }}>
          <img
            src={loadingImage}
            alt={name}
            className='border-on-background h-full w-full rounded-full border-[1.5px] object-cover'
          />
          <span
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className='bg-on-background text-background absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-3 py-1 font-mono text-[13px] font-semibold tabular-nums'>
            {percent}%
          </span>
        </div>
        <h1 className='font-headline mt-9 text-3xl leading-[1.15] font-extrabold uppercase [font-stretch:75%] md:text-4xl'>
          {name}
        </h1>
        <p className='text-on-surface-variant mt-2 font-mono text-[12.5px] tracking-[.06em]'>{statusText}</p>
      </div>
    </motion.div>
  );
}
