import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#020617',
          deep: '#01040f',
          surface: '#030b1f',
          card: 'rgba(3, 15, 38, 0.75)',
          'card-hover': 'rgba(6, 24, 60, 0.85)',
          elevated: '#06132d',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        cyan: {
          neon: '#00B4FF',
          accent: '#22D3EE',
          glow: 'rgba(0, 180, 255, 0.35)',
        },
        border: {
          subtle: 'rgba(37, 99, 235, 0.2)',
          glow: 'rgba(34, 211, 238, 0.4)',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(37, 99, 235, 0.35)',
        'neon-cyan': '0 0 25px rgba(0, 180, 255, 0.4)',
        'neon-cyan-lg': '0 0 40px rgba(34, 211, 238, 0.45)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'cyan-blue-gradient': 'linear-gradient(135deg, #2563EB 0%, #00B4FF 100%)',
        'cyan-blue-gradient-hover': 'linear-gradient(135deg, #1D4ED8 0%, #22D3EE 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.25) 0%, rgba(2, 6, 23, 0) 75%)',
        'radial-spotlight': 'radial-gradient(circle at center, rgba(0, 180, 255, 0.15) 0%, rgba(2, 6, 23, 0) 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
