import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import TuDucLoading from '../../assets/scenes/tuduc/TuDucLoading.jpg';
import { useSceneData } from '../../hooks/useScenes';
import { NAV_PATH } from '../../router/paths';

/**
 * LoadingPage Component
 * A premium, full-screen loading experience for 3D model processing.
 * Designed to be driven by real-time progress data.
 */
interface LoadingPageProps {
  initialProgress?: number;
  statusText?: string;
}

function LoadingPage({ initialProgress = 0, statusText }: LoadingPageProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(initialProgress);
  const [currentStatus, setCurrentStatus] = useState(statusText ?? t('loading.status.preparing'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sceneId = searchParams.get('sceneId');

  const { isSuccess, isLoading, isError } = useSceneData(sceneId);

  useEffect(() => {
    if (initialProgress > 0 || isSuccess) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;

        if (prev > 30 && prev < 35) setCurrentStatus(t('loading.status.optimizingMeshes'));
        if (prev > 60 && prev < 65) setCurrentStatus(t('loading.status.loadingTextures'));

        return prev + Math.random() * 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [initialProgress, isSuccess, t]);

  useEffect(() => {
    if (isSuccess && sceneId) {
      setProgress(100);
      setCurrentStatus(t('loading.status.finalizingScene'));
      const timer = setTimeout(() => {
        navigate(NAV_PATH.TOUR.replace(':sceneId', sceneId), { replace: true });
      }, 1000); // reduced wait time
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, sceneId, t]);

  return (
    <div className='flex w-full max-w-md flex-col items-center space-y-4 px-6 text-center'>
      <h1 className='text-primary font-headline text-4xl font-bold'>{t('loading.title')}</h1>

      <img src={TuDucLoading} className='mt-4 h-64 w-64 rounded-t-full object-cover shadow-lg'></img>

      <div className='mb-8 w-full'>
        <div className='border-secondary/50 relative mb-4 w-full overflow-hidden rounded-full border p-[2px]'>
          <div
            className='from-primary to-secondary-container h-2 rounded-full bg-gradient-to-r transition-all duration-300 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className='text-secondary text-2xl font-medium tabular-nums'>{Math.round(progress)}%</p>

        <p className='text-secondary text-lg font-medium tabular-nums'>{currentStatus}</p>
      </div>

      <p className='text-md animate-pulse text-gray-500 italic'>{t('loading.didYouKnow')}</p>
    </div>
  );
}

export default LoadingPage;
