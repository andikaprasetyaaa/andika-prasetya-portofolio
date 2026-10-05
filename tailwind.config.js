/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terraria: {
          skyDay: '#60a5fa',
          skyNight: '#0a0d1a',
          grass: '#58a038',
          grassDark: '#386a24',
          dirt: '#865439',
          dirtDark: '#563524',
          stone: '#5b616a',
          wood: '#965a3e',
          gold: '#eab308',
          goldLight: '#fef08a',
          heart: '#ef4444',
          mana: '#3b82f6',
          nightAccent: '#818cf8',
          shroomBlue: '#38bdf8',
          lava: '#f97316',
          obsidian: '#18181b',
        },
      },
      fontFamily: {
        sans: ['"Silkscreen"', '"Pixelify Sans"', '"Press Start 2P"', 'monospace'],
        body: ['"Silkscreen"', '"Pixelify Sans"', 'monospace'],
        mono: ['"Press Start 2P"', '"Silkscreen"', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
        silkscreen: ['"Silkscreen"', 'monospace'],
        pixelify: ['"Pixelify Sans"', 'monospace'],
        vt: ['"VT323"', 'monospace'],
      },
      animation: {
        'sway-slow': 'pixelSway 4s ease-in-out infinite',
        'sway-fast': 'pixelSway 2.5s ease-in-out infinite',
        'cloud-slow': 'cloudDrift 80s linear infinite',
        'cloud-mid': 'cloudDrift 48s linear infinite',
        'cloud-fast': 'cloudDrift 28s linear infinite',
        'star-pulse': 'starPulse 2s ease-in-out infinite',
        'float-slow': 'float 3s ease-in-out infinite',
        'sun-glow': 'sunGlow 4s ease-in-out infinite',
      },
      keyframes: {
        pixelSway: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(2.5deg) skewX(1deg)' },
        },
        cloudDrift: {
          '0%': { transform: 'translateX(-260px)' },
          '100%': { transform: 'translateX(calc(100vw + 260px))' },
        },
        starPulse: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sunGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 12px rgba(250, 204, 21, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 24px rgba(250, 204, 21, 0.9))' },
        },
      },
    },
  },
  plugins: [],
};

