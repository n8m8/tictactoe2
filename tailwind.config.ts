import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        whiteboard: {
          bg: '#FDFCFA',
          grid: '#E8E6E3',
          marker: {
            black: '#1A1A1A',
            blue: '#0066CC',
            red: '#E63946',
            green: '#06A77D',
            purple: '#7B2CBF',
            orange: '#F77F00',
          },
          shadow: {
            light: 'rgba(0, 0, 0, 0.06)',
            marker: 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
      fontFamily: {
        marker: ['var(--font-marker)', 'cursive'],
        handwritten: ['var(--font-handwritten)', 'cursive'],
      },
      animation: {
        'draw-x': 'drawX 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'draw-o': 'drawO 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'win-line': 'winLine 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-cell': 'pulseCell 600ms ease-in-out infinite',
        fadeIn: 'fadeIn 300ms ease-in forwards',
      },
      keyframes: {
        drawX: {
          '0%': {
            transform: 'scale(0) rotate(-45deg)',
            opacity: '0',
          },
          '60%': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1',
          },
        },
        drawO: {
          '0%': {
            transform: 'scale(0)',
            opacity: '0',
          },
          '60%': {
            transform: 'scale(1.15)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        winLine: {
          '0%': {
            transform: 'scaleX(0)',
            opacity: '0',
          },
          '100%': {
            transform: 'scaleX(1)',
            opacity: '1',
          },
        },
        pulseCell: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.8',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      boxShadow: {
        marker: '2px 2px 4px rgba(0, 0, 0, 0.08)',
        'cell-hover': '0 2px 8px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    float: false,
    clear: false,
    skew: false,
    caretColor: false,
    sepia: false,
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
  },
}

export default config
