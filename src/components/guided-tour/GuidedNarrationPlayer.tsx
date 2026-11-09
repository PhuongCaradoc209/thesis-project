import { useEffect } from 'react';
import { useGuidedTourStore } from '../../store/useGuidedTourStore';
import { useSettingsStore } from '../../store/useSettingsStore';

/**
 * Plays the guided tour narration. It renders nothing.
 *
 * - The intro clip starts with the cinematic and stops if the visitor skips it.
 * - A step clip starts when the visitor completes that step and replaces any clip still playing.
 * - The completion clip waits until the last step clip has finished.
 */
export function GuidedNarrationPlayer() {
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    let queue: string[] = [];

    const stop = () => {
      queue = [];
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };

    const playNow = (url: string) => {
      if (!useSettingsStore.getState().narration) return;
      queue = [];
      audio.src = url;
      audio.currentTime = 0;
      audio.play().catch((error: unknown) => {
        // The browser can block playback before the first click; the tour still works without sound.
        console.warn('[GuidedNarration] Could not play', url, error);
      });
    };

    const playAfterCurrent = (url: string) => {
      if (!useSettingsStore.getState().narration) return;
      if (audio.src && !audio.paused && !audio.ended) queue.push(url);
      else playNow(url);
    };

    const handleEnded = () => {
      const next = queue.shift();
      if (next) playNow(next);
    };
    audio.addEventListener('ended', handleEnded);

    const unsubscribeTour = useGuidedTourStore.subscribe((state, previous) => {
      const tour = state.tour;
      if (!tour || state.status === 'idle') {
        if (previous.tour || previous.status !== 'idle') stop();
        return;
      }

      if (state.status === 'cinematic' && previous.status !== 'cinematic') {
        stop();
        if (tour.intro?.audioUrl) playNow(tour.intro.audioUrl);
        return;
      }

      if (state.cinematicSkipRequested && !previous.cinematicSkipRequested) {
        stop();
        return;
      }

      if (state.status === 'paused' && previous.status !== 'paused') audio.pause();
      if (state.status === 'active' && previous.status === 'paused' && audio.src && !audio.ended) {
        audio.play().catch(() => undefined);
      }

      const isSameTour = previous.tour?.tourId === tour.tourId;
      if (isSameTour && state.completedStepIds.length > previous.completedStepIds.length) {
        const completedId = state.completedStepIds[state.completedStepIds.length - 1];
        const step = tour.steps.find((candidate) => candidate.stepId === completedId);
        if (step?.audioUrl) playNow(step.audioUrl);
      }

      if (state.status === 'completed' && previous.status !== 'completed' && tour.completionAudioUrl) {
        playAfterCurrent(tour.completionAudioUrl);
      }
    });

    const unsubscribeSettings = useSettingsStore.subscribe((state, previous) => {
      if (!state.narration && previous.narration) stop();
    });

    return () => {
      unsubscribeTour();
      unsubscribeSettings();
      audio.removeEventListener('ended', handleEnded);
      stop();
    };
  }, []);

  return null;
}
