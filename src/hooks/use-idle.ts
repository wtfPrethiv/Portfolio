'use client';

import { useState, useEffect } from 'react';

export const useIdle = (timeout: number): boolean => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsIdle(true);
      }, timeout);
    };

    handleActivity();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [timeout]);

  return isIdle;
};
