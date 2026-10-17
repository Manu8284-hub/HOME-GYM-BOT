/** @type {import('tailwindcss').Config} */
// NEON POWER MODE — design tokens
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core background
        neon: {
          bg:       '#080808',
          surface:  '#111111',
          surface2: '#181818',
          border:   '#222222',
          border2:  '#333333',
          // Primary accent — volt lime
          volt:     '#C6F135',
          voltDim:  '#9DC41A',
          voltGlow: 'rgba(198,241,53,0.18)',
          // Secondary accent — cyan
          cyan:     '#00E5FF',
          cyanDim:  '#00B8CC',
          cyanGlow: 'rgba(0,229,255,0.15)',
          // Danger / Beast Mode
          red:      '#FF1744',
          redGlow:  'rgba(255,23,68,0.20)',
          // Text
          text:     '#F5F5F5',
          muted:    '#888888',
          muted2:   '#555555',
        },
        // Override Tailwind defaults so existing classes still compile
        emerald: {
          50: 'rgba(198,241,53,0.08)', 100: 'rgba(198,241,53,0.15)',
          200: 'rgba(198,241,53,0.25)', 300: '#9DC41A',
          400: '#B5D832', 500: '#C6F135', 600: '#A8CC1F',
          700: '#8AAE10', 800: '#6C9000', 900: '#4E7200',
        },
        cyan: {
          50: 'rgba(0,229,255,0.07)', 100: 'rgba(0,229,255,0.14)',
          200: 'rgba(0,229,255,0.25)', 300: '#00B8CC',
          400: '#00CCDD', 500: '#00E5FF', 600: '#00C8E0',
          700: '#00AABF', 800: '#008C9E', 900: '#006E7D',
        },
        amber: {
          50: 'rgba(255,170,0,0.08)', 100: 'rgba(255,170,0,0.15)',
          500: '#FFAA00', 600: '#EE9900',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        heading: ['"Inter"', 'sans-serif'],
        sans:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '8xl':  ['6rem',   { lineHeight: '1' }],
        '9xl':  ['8rem',   { lineHeight: '1' }],
        '10xl': ['10rem',  { lineHeight: '0.95' }],
      },
      boxShadow: {
        volt:   '0 0 20px rgba(198,241,53,0.35), 0 0 60px rgba(198,241,53,0.12)',
        voltSm: '0 0 8px rgba(198,241,53,0.4)',
        cyan:   '0 0 20px rgba(0,229,255,0.30), 0 0 60px rgba(0,229,255,0.10)',
        cyanSm: '0 0 8px rgba(0,229,255,0.35)',
        red:    '0 0 20px rgba(255,23,68,0.35), 0 0 60px rgba(255,23,68,0.12)',
        glass:  '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      keyframes: {
        // Text slam-in
        slamIn: {
          '0%':   { transform: 'translateY(80px) skewY(6deg)', opacity: '0' },
          '100%': { transform: 'translateY(0) skewY(0deg)', opacity: '1' },
        },
        // Magnetic pulse on CTA button
        magneticPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(198,241,53,0.45)' },
          '50%':      { boxShadow: '0 0 0 16px rgba(198,241,53,0)' },
        },
        // Progress ring draw
        ringDraw: {
          '0%':   { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--ring-offset, 0)' },
        },
        // Count up (handled in JS)
        // Heartbeat line
        heartbeat: {
          '0%, 100%': { transform: 'scaleX(1)' },
          '10%':      { transform: 'scaleX(1.4)' },
          '20%':      { transform: 'scaleX(0.9)' },
          '30%':      { transform: 'scaleX(1.2)' },
        },
        // Glow pulse
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        // Screen shake (Beast Mode)
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%':      { transform: 'translateX(-6px) rotate(-1deg)' },
          '20%':      { transform: 'translateX(6px) rotate(1deg)' },
          '30%':      { transform: 'translateX(-4px)' },
          '40%':      { transform: 'translateX(4px)' },
          '50%':      { transform: 'translateX(-2px)' },
          '60%':      { transform: 'translateX(2px)' },
        },
        // Confetti drop
        confettiFall: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(300px) rotate(720deg)', opacity: '0' },
        },
        // Typing dot
        typingDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.3' },
          '40%':           { transform: 'scale(1)', opacity: '1' },
        },
        // Loader slide
        loaderSlide: {
          '0%':   { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(320%)' },
        },
        // Float
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        // Spin slow
        spinSlow: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Flame flicker
        flameFlicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)' },
          '25%':      { transform: 'scaleY(1.04) scaleX(0.97)' },
          '75%':      { transform: 'scaleY(0.96) scaleX(1.03)' },
        },
        // Countdown pulse
        countdownPulse: {
          '0%':   { transform: 'scale(1)', opacity: '1' },
          '50%':  { transform: 'scale(1.06)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Draw chart line
        drawIn: {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        // Slide up fade
        slideUpFade: {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Scale in
        scaleIn: {
          '0%':   { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Grain
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%':      { transform: 'translate(-2%, -3%)' },
          '20%':      { transform: 'translate(3%, 2%)' },
          '30%':      { transform: 'translate(-1%, 4%)' },
          '40%':      { transform: 'translate(4%, -1%)' },
          '50%':      { transform: 'translate(-3%, 1%)' },
          '60%':      { transform: 'translate(2%, -4%)' },
          '70%':      { transform: 'translate(-4%, 3%)' },
          '80%':      { transform: 'translate(1%, -2%)' },
          '90%':      { transform: 'translate(3%, 4%)' },
        },
        // Shimmer skeleton
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Spotlight follow (handled via JS vars)
        // XP bar fill
        xpFill: {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--xp-width, 60%)' },
        },
        // Badge reveal
        badgeReveal: {
          '0%':   { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '70%':  { transform: 'scale(1.15) rotate(3deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
      animation: {
        slamIn:         'slamIn 0.6s cubic-bezier(0.22,1,0.36,1) both',
        slamIn2:        'slamIn 0.6s 0.15s cubic-bezier(0.22,1,0.36,1) both',
        slamIn3:        'slamIn 0.6s 0.30s cubic-bezier(0.22,1,0.36,1) both',
        magneticPulse:  'magneticPulse 2s ease-in-out infinite',
        glowPulse:      'glowPulse 2s ease-in-out infinite',
        heartbeat:      'heartbeat 1.2s ease-in-out infinite',
        shake:          'shake 0.5s cubic-bezier(.36,.07,.19,.97)',
        confettiFall:   'confettiFall 1.5s ease-in forwards',
        typingDot:      'typingDot 1.4s infinite ease-in-out both',
        loaderSlide:    'loaderSlide 1.4s cubic-bezier(0.45,0,0.55,1) infinite',
        float:          'float 3s ease-in-out infinite',
        spinSlow:       'spinSlow 8s linear infinite',
        flameFlicker:   'flameFlicker 0.4s ease-in-out infinite',
        countdownPulse: 'countdownPulse 1s ease-in-out infinite',
        drawIn:         'drawIn 1.5s ease-out forwards',
        slideUpFade:    'slideUpFade 0.5s cubic-bezier(0.22,1,0.36,1) both',
        scaleIn:        'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
        grain:          'grain 0.5s steps(1) infinite',
        shimmer:        'shimmer 1.8s linear infinite',
        xpFill:         'xpFill 1.5s cubic-bezier(0.22,1,0.36,1) forwards',
        badgeReveal:    'badgeReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        ringDraw:       'ringDraw 1.2s cubic-bezier(0.22,1,0.36,1) forwards',
      },
    },
  },
  plugins: [],
}
