import { useEffect, useCallback, useRef } from 'react';

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];

/**
 * Activates "Beast Mode" on the Konami code.
 * Also exposes a manual trigger for long-press.
 * Beast Mode: adds `.beast-mode` class to <html>, animates a shake.
 */
export function useBeastMode() {
  const sequence = useRef([]);
  const active = useRef(false);

  const activate = useCallback(() => {
    if (active.current) return;
    active.current = true;
    document.documentElement.classList.add('beast-mode');
    document.documentElement.classList.add('shake');
    setTimeout(() => document.documentElement.classList.remove('shake'), 600);

    // Auto-deactivate after 30 seconds
    setTimeout(() => {
      active.current = false;
      document.documentElement.classList.remove('beast-mode');
    }, 30_000);
  }, []);

  const deactivate = useCallback(() => {
    active.current = false;
    document.documentElement.classList.remove('beast-mode');
  }, []);

  useEffect(() => {
    const handler = (e) => {
      sequence.current.push(e.key);
      if (sequence.current.length > KONAMI.length) {
        sequence.current.shift();
      }
      if (sequence.current.join(',') === KONAMI.join(',')) {
        activate();
        sequence.current = [];
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activate]);

  return { activate, deactivate };
}
