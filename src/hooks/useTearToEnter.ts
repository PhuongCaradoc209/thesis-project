import { useReducedMotion } from 'motion/react';
import { useEffect, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';

const TEAR_DURATION_MS = 750;

export const useTearToEnter = (path: string) => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [isTearing, setIsTearing] = useState(false);

  useEffect(() => {
    if (!isTearing) return;
    const timer = window.setTimeout(() => navigate(path), TEAR_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [isTearing, navigate, path]);

  const startTear = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return false;
    event.preventDefault();
    if (isTearing) return false;
    if (reduceMotion) {
      navigate(path);
      return false;
    }
    setIsTearing(true);
    return true;
  };

  return { isTearing, startTear };
};
