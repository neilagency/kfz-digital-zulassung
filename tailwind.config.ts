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
        primary: {
          DEFAULT: '#0D5581',
          50: '#E8F0F3',
          100: '#D1E1E7',
          200: '#A3C3CF',
          300: '#75A5B7',
          400: '#47879F',
          500: '#0D5581',
          600: '#0B4A70',
          700: '#093E5F',
          800: '#07334E',
          900: '#05273D',
        },
        accent: {
          DEFAULT: '#8BC34A',
          50: '#F2F9E8',
          100: '#E5F3D1',
          200: '#CBE7A3',
          300: '#B1DB75',
          400: '#97CF47',
          500: '#8BC34A',
          600: '#7BB33E',
          700: '#6BA332',
          800: '#5B9326',
          900: '#4B831A',
        },
        dark: {
          DEFAULT: '#0A1628',
          50: '#1a2a40',
          100: '#0F1D32',
          200: '#0A1628',
          300: '#070F1E',
          400: '#040914',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
