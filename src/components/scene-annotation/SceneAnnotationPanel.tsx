import { InfoIcon, XIcon } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type SceneAnnotationPreview = {
  pointId: string;
  position: [number, number, number];
  title: string;
  description: string;
  images?: string[];
};

type SceneAnnotationPanelProps = {
  annotation: SceneAnnotationPreview;
  onClose: () => void;
};

export function SceneAnnotationPanel({ annotation, onClose }: SceneAnnotationPanelProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const images = useMemo(() => (annotation.images ?? []).filter((image) => image.trim().length > 0), [annotation.images]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const title = t(annotation.title);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [annotation.pointId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className='pointer-events-none absolute inset-x-0 top-20 bottom-0 z-30 flex justify-end bg-[#170f09]/15'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}>
      <motion.aside
        role='dialog'
        aria-modal='true'
        aria-label={title}
        className='text-on-surface pointer-events-auto m-4 flex h-[calc(100%-2rem)] w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-[#b69462]/55 bg-[#f3e7cf] shadow-[0_24px_80px_rgba(18,10,5,0.3)]'
        initial={reduceMotion ? false : { x: '100%' }}
        animate={{ x: 0 }}
        exit={reduceMotion ? undefined : { x: '100%' }}
        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}>
        <header className='flex shrink-0 items-center justify-between border-b border-amber-950/12 px-5 py-4'>
          <div className='flex min-w-0 items-center gap-3'>
            <InfoIcon size={21} className='text-primary shrink-0' />
            <div className='min-w-0'>
              <h2 className='font-headline text-primary truncate text-xl font-semibold'>{title}</h2>
              <p className='text-on-surface-variant mt-0.5 text-xs'>{t('sceneAnnotation.category')}</p>
            </div>
          </div>
          <button
            type='button'
            aria-label={t('sceneAnnotation.close')}
            className='text-on-surface-variant ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-amber-950/5'
            onClick={onClose}>
            <XIcon size={20} />
          </button>
        </header>

        <div className='annotation-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain'>
          {images.length > 0 && (
            <div className='border-b border-amber-950/12 p-4'>
              <div className='aspect-video overflow-hidden rounded-lg bg-[#ead7b5]'>
                <img
                  src={images[selectedImageIndex]}
                  alt={`${title} ${selectedImageIndex + 1}`}
                  className='h-full w-full object-cover'
                  decoding='async'
                />
              </div>

              {images.length > 1 && (
                <div className='mt-3 flex gap-2 overflow-x-auto pb-1'>
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type='button'
                      aria-label={`${title} ${index + 1}`}
                      aria-pressed={selectedImageIndex === index}
                      className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}>
                      <img src={image} alt='' className='h-full w-full object-cover' loading='lazy' decoding='async' />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className='px-5 py-6'>
            <p className='text-on-surface-variant font-body text-[15px] leading-7'>{t(annotation.description)}</p>
          </div>
        </div>

        <footer className='flex shrink-0 justify-end border-t border-amber-950/12 bg-[#ead7b5] px-5 py-3'>
          <button
            type='button'
            className='text-primary font-body rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/30'
            onClick={onClose}>
            {t('sceneAnnotation.continue')}
          </button>
        </footer>
      </motion.aside>
    </motion.div>
  );
}
