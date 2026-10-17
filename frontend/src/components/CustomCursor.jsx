import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor: small volt dot + larger ring that follows.
 * Expands when hovering interactive elements.
 * Desktop only — hidden on touch devices.
 */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    // Don't render on touch-primary devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.body.style.cursor = 'none';
    setVisible(true);

    const move = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (dotRef.current)  { dotRef.current.style.left  = x + 'px'; dotRef.current.style.top  = y + 'px'; }
      if (ringRef.current) { ringRef.current.style.left = x + 'px'; ringRef.current.style.top = y + 'px'; }

      // Spotlight
      document.documentElement.style.setProperty('--spotlight-x', x + 'px');
      document.documentElement.style.setProperty('--spotlight-y', y + 'px');
    };

    const onEnterInteractive = () => setExpand(true);
    const onLeaveInteractive = () => setExpand(false);

    const interactives = () =>
      document.querySelectorAll('a, button, [role="button"], input, select, textarea, [data-cursor-expand]');

    const attach = () => {
      interactives().forEach(el => {
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    };

    // Observe DOM changes to attach to new elements
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { subtree: true, childList: true });
    attach();

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      observer.disconnect();
      document.body.style.cursor = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: 1 }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${expand ? 'expand' : ''}`}
      />
      {/* Spotlight glow */}
      <div className="spotlight" aria-hidden="true" />
    </>
  );
}
