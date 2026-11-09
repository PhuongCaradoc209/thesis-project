import { SpeakerHighIcon, SpeakerSlashIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioStore } from '../../store/useAudioStore';

const STORAGE_KEY = 'background-music';
const MUSIC_URL = '/common/music/background_music.mp3';
const VOLUME = 0.3;
const DUCKED_VOLUME = 0.08;

const readEnabled = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
};

export default function BackgroundMusic() {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(readEnabled);
  const isNarrating = useAudioStore((state) => state.isNarrating);
  const volume = isNarrating ? DUCKED_VOLUME : VOLUME;

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    } catch {
      return;
    }
  }, [enabled]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!enabled) {
      audio.pause();
      return;
    }

    const play = () => {
      audio.play().catch(() => undefined);
    };
    const playOnFirstInput = () => {
      play();
      window.removeEventListener('pointerdown', playOnFirstInput);
      window.removeEventListener('keydown', playOnFirstInput);
    };

    audio.play().catch(() => {
      window.addEventListener('pointerdown', playOnFirstInput);
      window.addEventListener('keydown', playOnFirstInput);
    });

    return () => {
      window.removeEventListener('pointerdown', playOnFirstInput);
      window.removeEventListener('keydown', playOnFirstInput);
    };
  }, [enabled]);

  const label = enabled ? t('music.off') : t('music.on');

  return (
    <>
      <audio ref={audioRef} src={MUSIC_URL} loop preload='none' />
      <button
        type='button'
        aria-label={label}
        aria-pressed={enabled}
        title={label}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          setEnabled((current) => !current);
        }}
        className='bg-surface-bright border-on-background text-on-background hover:bg-on-background hover:text-background fixed bottom-4 left-4 z-60 grid size-11 place-items-center border-[1.5px] transition-colors md:bottom-6 md:left-6'>
        {enabled ? <SpeakerHighIcon size={20} weight='bold' /> : <SpeakerSlashIcon size={20} weight='bold' />}
      </button>
    </>
  );
}
