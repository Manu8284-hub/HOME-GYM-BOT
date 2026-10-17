import React, { useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';

export default function SplashScreen() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const particles = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198,241,53,${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div
      className="min-h-screen text-[#F5F5F5] flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: '#080808' }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(198,241,53,0.07) 0%, transparent 70%)'
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Logo */}
        <div className="relative mb-8">
          <span className="absolute inset-0 rounded-2xl animate-ping"
            style={{ background: 'rgba(198,241,53,0.2)' }} />
          <div
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: '#C6F135', boxShadow: '0 0 40px rgba(198,241,53,0.4)' }}
          >
            <Zap className="w-10 h-10 fill-current" style={{ color: '#080808' }} />
          </div>
        </div>

        <h1 className="font-display text-6xl tracking-widest mb-1" style={{ color: '#C6F135' }}>
          FITBOT
        </h1>
        <p className="text-sm font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: '#888' }}>
          AI Power Mode
        </p>
        <p className="text-sm leading-relaxed max-w-xs mb-10" style={{ color: '#555' }}>
          Personalized home workouts · Natural nutrition · BMI-aware AI coach
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-[200px] h-[2px] rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
          <div className="loader-bar h-full w-1/3 rounded-full" style={{ background: '#C6F135' }} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] mt-4" style={{ color: '#333' }}>
          Initializing
        </p>
      </div>
    </div>
  );
}
