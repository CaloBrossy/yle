import React, { useEffect, useRef } from 'react';

/**
 * GlobalAudio Component
 * Mounts once at the root level of the application.
 * Manages a single continuous HTML5 <audio> instance that persists across
 * all scenes, transitions, camera movements, and component updates.
 *
 * Features:
 *  - Single persistent <audio> element
 *  - audio.loop = true for seamless continuous loop
 *  - Eager autoplay attempt on mount
 *  - Elegant silent fallback to first user interaction (pointerdown / touchstart / keydown)
 *  - Smooth exponential/linear fade-in over 1.8 seconds
 *  - Absolutely zero restarts or pauses during stage changes
 */
export const GlobalAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedRef = useRef<boolean>(false);
  const fadeAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0; // Start at 0 for smooth fade-in

    const fadeIn = () => {
      const duration = 1800; // 1.8s smooth transition
      const targetVolume = 0.7;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        if (audioRef.current) {
          audioRef.current.volume = progress * targetVolume;
        }
        if (progress < 1) {
          fadeAnimationRef.current = requestAnimationFrame(step);
        }
      };

      fadeAnimationRef.current = requestAnimationFrame(step);
    };

    const startPlayback = () => {
      if (hasStartedRef.current) return;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasStartedRef.current = true;
            fadeIn();
            cleanupListeners();
          })
          .catch(() => {
            // Browser blocked autoplay; fallback will trigger on first interaction
          });
      }
    };

    const handleFirstInteraction = () => {
      startPlayback();
    };

    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };

    // 1. Try immediate autoplay
    startPlayback();

    // 2. Elegant silent fallback if browser requires user gesture
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true });

    return () => {
      cleanupListeners();
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/audio/gymnopedie.ogg"
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};
