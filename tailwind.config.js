/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        // Dusk base — never pure black, so neon accents stay easy on the eyes.
        night: {
          950: '#07040d',
          900: '#0c0716',
          850: '#110a1f',
          800: '#170d2a',
          700: '#211338',
          600: '#2e1b4d',
          500: '#3f2666',
        },
        ink: {
          DEFAULT: '#fff6f2',
          soft: '#dfd3ea',
          mute: '#9f91b5',
          faint: '#726589',
        },
        vice: {
          pink: '#ff5fa8',
          magenta: '#e24a9e',
          coral: '#ff8a5c',
          amber: '#ffc46b',
          gold: '#ffd98a',
          violet: '#9d6bff',
          teal: '#45e3d0',
          sky: '#72c6ff',
          mint: '#8ff0c8',
        },
      },
      fontFamily: {
        display: ['Oswald', '"Barlow Condensed"', 'system-ui', 'sans-serif'],
        poster: ['"Bebas Neue"', 'Oswald', 'system-ui', 'sans-serif'],
        hud: ['"Barlow Condensed"', 'Oswald', 'system-ui', 'sans-serif'],
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        script: ['Yellowtail', 'cursive'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        shell: 'clamp(1240px, calc(1240px + (100vw - 1440px) * 0.22), 1480px)',
      },
      spacing: {
        gutter: 'clamp(1.25rem, 4vw, 3.5rem)',
      },
      backgroundImage: {
        sunset: 'linear-gradient(100deg, #ffd98a 0%, #ff8a5c 32%, #ff5fa8 66%, #9d6bff 100%)',
        'sunset-soft': 'linear-gradient(100deg, rgba(255,217,138,.16) 0%, rgba(255,95,168,.16) 60%, rgba(157,107,255,.16) 100%)',
      },
      boxShadow: {
        panel: '0 24px 60px -24px rgba(4, 2, 10, 0.85), 0 2px 0 0 rgba(255,255,255,0.03) inset',
        glow: '0 0 0 1px rgba(255,95,168,.35), 0 10px 40px -10px rgba(255,95,168,.45)',
        'glow-teal': '0 0 0 1px rgba(69,227,208,.35), 0 10px 40px -12px rgba(69,227,208,.4)',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        'ping-soft': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '80%, 100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'spin-slow-rev': {
          to: { transform: 'rotate(-360deg)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(220%) skewX(-18deg)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        'neon-breathe': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.82' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.6s ease-in-out infinite',
        'ping-soft': 'ping-soft 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
        marquee: 'marquee 38s linear infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
        'spin-slow-rev': 'spin-slow-rev 60s linear infinite',
        sweep: 'sweep 1.1s ease-out',
        bob: 'bob 2.4s ease-in-out infinite',
        'neon-breathe': 'neon-breathe 5s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-smooth': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
};
