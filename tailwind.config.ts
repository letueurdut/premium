import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'roulette-black':  '#0A0A0A',
        'roulette-dark':   '#141414',
        'roulette-card':   '#1A1A1A',
        'roulette-border': '#2A2A2A',
        'roulette-muted':  '#737373',
        'roulette-red':    '#DC2626',
        'roulette-gold':   '#D4A843',
        // Legacy aliases
        'p-black':   '#0A0A0A',
        'p-surface': '#141414',
        'p-card':    '#1A1A1A',
        'p-border':  '#2A2A2A',
        'p-muted':   '#2A2A2A',
        'p-red':     '#DC2626',
        'p-red-hover': '#B91C1C',
        'p-red-dim':   'rgba(220,38,38,0.12)',
        'p-text':      '#F5F5F5',
        'p-text-muted':'#737373',
        'p-text-dim':  '#404040',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'red-glow':    '0 0 30px rgba(220,38,38,0.25), 0 0 60px rgba(220,38,38,0.08)',
        'red-glow-sm': '0 0 12px rgba(220,38,38,0.2)',
        'card':        '0 1px 3px rgba(0,0,0,0.6)',
        'red':         '0 0 30px rgba(220,38,38,0.3), 0 0 60px rgba(220,38,38,0.1)',
      },
      animation: {
        'shimmer':     'shimmer 1.8s infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':     'fadeIn 0.3s ease-out forwards',
        'slide-up':    'slideUp 0.4s ease-out forwards',
        'pulse-glow':  'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220,38,38,0.2)' },
          '50%':      { boxShadow: '0 0 40px rgba(220,38,38,0.4)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;