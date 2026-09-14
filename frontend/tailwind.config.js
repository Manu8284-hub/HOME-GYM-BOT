/** @type {import('tailwindcss').Config} */

// Soft-monochrome palette. Every accent family (emerald/teal/cyan/amber/rose/
// yellow/purple/indigo) is remapped to this single grayscale ramp so the whole
// UI renders black & white without touching 170+ utility classes across files.
//  - 50-300  : near-white backgrounds + soft borders
//  - 400     : mid-gray (gradients, focus rings)
//  - 500/600 : near-black (primary buttons, dark text)
//  - 700-950 : pure black (headings, strongest text)
// `red` is intentionally left as Tailwind's default so the medical disclaimer
// keeps a faint red — the only color in the app.
const mono = {
  50: '#f7f7f7',
  100: '#efefef',
  200: '#e4e4e4',
  300: '#d1d1d1',
  400: '#9e9e9e',
  500: '#1a1a1a',
  600: '#0d0d0d',
  700: '#000000',
  800: '#000000',
  900: '#000000',
  950: '#000000',
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: mono,
        teal: mono,
        cyan: mono,
        amber: mono,
        rose: mono,
        yellow: mono,
        purple: mono,
        indigo: mono,
        brand: {
          bg: "#f7f7f7", surface: "#ffffff", border: "#e4e4e4",
          muted: "#9e9e9e", text: "#0a0a0a", accent: "#1a1a1a",
          accentHover: "#000000", accentLight: "#efefef",
          cyan: "#1a1a1a", amber: "#1a1a1a", rose: "#1a1a1a"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
