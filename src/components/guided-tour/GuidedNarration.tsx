import { useEffect, useRef } from 'react';
import { useAudioStore } from '../../store/useAudioStore';
import { useGuidedTourStore } from '../../store/useGuidedTourStore';

export function GuidedNarration() {
  const narration = useGuidedTourStore((state) => state.narration);
  const setNarrating = useAudioStore((state) => state.setNarrating);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.onplay = () => setNarrating(true);
    audio.onpause = () => setNarrating(false);
    audio.onended = () => setNarrating(false);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audioRef.current = null;
      setNarrating(false);
    };
  }, [setNarrating]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!narration) {
      audio.pause();
      return;
    }

    audio.src = narration.url;
    audio.play().catch((error) => console.error('[GuidedNarration] Could not play narration.', error));
  }, [narration]);

  return null;
}
