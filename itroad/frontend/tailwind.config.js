/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Corporate Blue - primary brand
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#598dff',
          500: '#3366ff',
          600: '#1f47f5',
          700: '#1735e1',
          800: '#192db6',
          900: '#1a2c8f',
          950: '#151c57',
        },
        // Electric Blue - secondary
        electric: {
          50: '#ecfdff',
          100: '#cff7fe',
          200: '#a5effc',
          300: '#67e3f9',
          400: '#22ccee',
          500: '#06acd0',
          600: '#0889af',
          700: '#0e6e8e',
          800: '#155a74',
          900: '#164b62',
          950: '#083140',
        },
        // Cyan accent
        cyan: {
          50: '#ecfeff',
          100: '#cff7fe',
          200: '#a5effc',
          300: '#67e3f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Deep Navy - dark sections
        navy: {
          50: '#f2f5fb',
          100: '#e3e9f5',
          200: '#c5d1ea',
          300: '#9badd9',
          400: '#6b85c2',
          500: '#4a64a8',
          600: '#3a4f8c',
          700: '#314272',
          800: '#1e2a4a',
          900: '#131d36',
          950: '#0a1124',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px -8px rgba(15, 23, 42, 0.08)',
        elevated: '0 4px 12px -2px rgba(15, 23, 42, 0.1), 0 24px 48px -12px rgba(15, 23, 42, 0.12)',
        glow: '0 0 40px -8px rgba(51, 102, 255, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'scroll-x': 'scrollX 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        scrollX: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
