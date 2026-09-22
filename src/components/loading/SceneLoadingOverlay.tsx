import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import LoadingBackground from '../../assets/loading.png';
import TuDucLoading from '../../assets/scenes/tuduc/TuDucLoading.jpg';
import type { ScenePresentation } from '../../utils/scenePresentation';

type SceneLoadingOverlayProps = {
  presentation: ScenePresentation | null;
  progress: number;
  statusText: string;
};

export default function SceneLoadingOverlay({ presentation, progress, statusText }: SceneLoadingOverlayProps) {
  const { t } = useTranslation();
  const loadingImage = presentation?.loadingBackground ?? TuDucLoading;

  return (
    <motion.div
      className='fixed inset-0 z-90 overflow-hidden text-white'
      style={{ backgroundImage: `url(${LoadingBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}>
      <main className='flex min-h-screen flex-col items-center justify-center'>
        <div className='flex w-full max-w-md flex-col items-center space-y-4 px-6 text-center'>
          <h1 className='text-primary font-headline text-4xl font-bold'>{presentation?.name ?? t('loading.title')}</h1>

          <img
            src={loadingImage}
            alt={presentation?.name ?? t('loading.title')}
            className='mt-4 h-64 w-64 rounded-t-full object-cover shadow-lg'
          />

          <div className='mb-8 w-full'>
            <div className='border-secondary/50 relative mb-4 w-full overflow-hidden rounded-full border p-[2px]'>
              <div
                className='from-primary to-secondary-container h-2 rounded-full bg-gradient-to-r transition-all duration-300 ease-out'
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className='text-secondary text-2xl font-medium tabular-nums'>{Math.round(progress)}%</p>
            <p className='text-secondary text-lg font-medium tabular-nums'>{statusText}</p>
          </div>

          <p className='text-md animate-pulse text-gray-500 italic'>
            {presentation?.description ? `${t('loading.didYouKnow')} ${presentation.description}` : t('loading.didYouKnow')}
          </p>
        </div>
      </main>
    </motion.div>
  );
}
