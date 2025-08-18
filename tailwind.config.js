/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './constants/**/*.{js,jsx,ts,tsx,md,mdx}',
    './hooks/**/*.{js,jsx,ts,tsx,md,mdx}',
    './services/**/*.{js,jsx,ts,tsx,md,mdx}',
    './store/**/*.{js,jsx,ts,tsx,md,mdx}',
    './styles/**/*.{js,jsx,ts,tsx,md,mdx}',
    './utils/**/*.{js,jsx,ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          500: '#FEE500',
        },
        cream: {
          200: '#FFFCF6',
        },
        brown: {
          200: '#936C49',
        },
        grayscale: {
          black: '#000000',
          white: '#FFFFFF',
          0: '#FBFBFB',
          50: '#F1F1F1',
          100: '#FBFBFB',
          200: '#EBEBEB',
          300: '#C1C1C1',
          350: '#BABABA',
          400: '#A3A3A3',
          450: '#9D9D9D',
          500: '#868686',
          600: '#777777',
          700: '#555555',
          900: '#3C3C3C',
          950: '#282828',
        },
        green: {
          '000': '#FBFFFC',
          '050': '#F2FFF4',
          100: '#E4FAE8',
          200: '#CBF1D3',
          300: '#4DE3A3',
          400: '#50D766',
          500: '#0FD380',
          550: '#19BC77',
          600: '#00A775',
          'warm-050': '#E4F2E6',
          'warm-100': '#DAECDD',
          'warm-300': '#A6DCCC',
          'muted-600': '#729177',
        },
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      fontSize: {
        '15px': ['15px', { lineHeight: 'normal' }],
        '24px': ['24px', { lineHeight: 'normal' }],
        '16px': ['16px', { lineHeight: '24px' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
};
