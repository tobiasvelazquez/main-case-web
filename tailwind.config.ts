import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        horror: {
          bg: '#0a0806',
          surface: '#110e09',
          card: '#191410',
          border: '#272018',
          red: '#8b1a1a',
          'red-dim': '#5a1010',
          'red-bright': '#a82020',
          green: '#3a4e1e',
          text: '#c4b28e',
          'text-muted': '#65594a',
          'text-dim': '#3a3028',
          gold: '#8a7040',
          'gold-bright': '#a08848',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"VT323"', 'monospace'],
        body: ['"Special Elite"', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 2%)' },
          '30%': { transform: 'translate(-1%, 3%)' },
          '40%': { transform: 'translate(3%, -1%)' },
          '50%': { transform: 'translate(-3%, 1%)' },
          '60%': { transform: 'translate(2%, 3%)' },
          '70%': { transform: 'translate(-2%, 1%)' },
          '80%': { transform: 'translate(1%, -2%)' },
          '90%': { transform: 'translate(3%, 2%)' },
        },
        flicker: {
          '0%, 89%, 91%, 93%, 95%, 100%': { opacity: '1' },
          '90%': { opacity: '0.75' },
          '92%': { opacity: '0.9' },
          '94%': { opacity: '0.8' },
        },
        'scanline-move': {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(200vh)' },
        },
      },
      animation: {
        grain: 'grain 0.4s steps(1) infinite',
        flicker: 'flicker 6s linear infinite',
        'scanline-move': 'scanline-move 10s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
