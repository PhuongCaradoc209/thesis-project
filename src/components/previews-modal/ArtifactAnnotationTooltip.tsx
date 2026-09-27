import { Html } from '@react-three/drei';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ArtifactAnnotation } from '../../types/scene.types';

type ArtifactAnnotationTooltipProps = {
  annotation: ArtifactAnnotation;
  onHoverChange: (hovered: boolean) => void;
};

type AnnotationImageProps = {
  alt: string;
  className: string;
  src: string;
};

function AnnotationImage({ alt, className, src }: AnnotationImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.img
      alt={alt}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      className={className}
      decoding='async'
      initial={false}
      loading='lazy'
      src={src}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
      onLoad={() => setIsLoaded(true)}
    />
  );
}

export function ArtifactAnnotationTooltip({ annotation, onHoverChange }: ArtifactAnnotationTooltipProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const title = t(annotation.title);
  const images = Object.values(annotation.images ?? {}).filter((url) => typeof url === 'string' && url.length > 0);
  return (
    <Html position={[0.3, 0, 0]}>
      <div
        className='-translate-y-1/2 pl-5'
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        onPointerEnter={() => onHoverChange(true)}
        onPointerLeave={() => onHoverChange(false)}
        onWheel={(event) => event.stopPropagation()}>
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className='annotation-scrollbar border-secondary/25 bg-surface/95 text-on-surface max-h-[min(24rem,70vh)] w-64 origin-left overflow-y-auto overscroll-contain rounded-lg border text-left shadow-xl backdrop-blur-sm'
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 6 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}>
          {images.length > 0 && (
            <div className={images.length === 1 ? 'bg-surface-container-low h-32' : 'grid grid-cols-2 gap-px bg-black/5'}>
              {images.slice(0, 4).map((url, index) => (
                <AnnotationImage
                  key={`${url}-${index}`}
                  alt={`${title} ${index + 1}`}
                  className={images.length === 1 ? 'h-full w-full object-cover' : 'h-24 w-full object-cover'}
                  src={url}
                />
              ))}
            </div>
          )}

          <div className='px-3 py-2'>
            <p className='font-headline text-secondary text-md font-semibold'>{title}</p>
            {annotation.description && (
              <p className='text-on-surface-variant mt-1 text-sm leading-5'>{t(annotation.description)}</p>
            )}
          </div>
        </motion.div>
      </div>
    </Html>
  );
}
