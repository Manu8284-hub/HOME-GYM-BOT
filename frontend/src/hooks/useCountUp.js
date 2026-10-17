import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Respects prefers-reduced-motion — if true, jumps immediately to target.
 */
export function useCountUp(target, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (reducedMotion) { setValue(target); return; }
    const timeout = setTimeout(() => {
      const start = performance.now();
      const from = 0;
      const to = Number(target) || 0;

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        setValue(Math.round(from + (to - from) * ease));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, duration, delay, reducedMotion]);

  return value;
}
