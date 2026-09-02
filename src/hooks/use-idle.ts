'use client';

import { useState, useEffect, useRef } from 'react';

export const useIdle = (timeout: number): boolean => {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isIdleRef = useRef(false);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        isIdleRef.current = true;
        setIsIdle(true);
      }, timeout);
    };

    const handleActivity = () => {
      // Only update state if transitioning from idle → active.
      // Avoids 100+ state updates/sec from mousemove while already active.
      if (isIdleRef.current) {
        isIdleRef.current = false;
        setIsIdle(false);
      }
      resetTimer();
    };

    handleActivity();

    const opts = { passive: true } as AddEventListenerOptions;
    window.addEventListener('mousemove', handleActivity, opts);
    window.addEventListener('keydown', handleActivity, opts);
    window.addEventListener('touchstart', handleActivity, opts);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [timeout]);

  return isIdle;
};
