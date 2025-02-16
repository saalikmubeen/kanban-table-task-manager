// // tailwind.config.js
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     require('@headlessui/tailwindcss')
//   ],
// }

import defaultTheme from 'tailwindcss/defaultTheme';
import headlessui from '@headlessui/tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontSize: {
      'body-md': [
        '0.75rem',
        { lineHeight: '1.25', fontWeight: 'bold' },
      ],
      'body-lg': ['0.8125rem', '1.7692'],
      'heading-sm': [
        '0.75rem',
        {
          lineHeight: '1.25',
          fontWeight: 'bold',
          letterSpacing: '0.2em',
        },
      ],
      'heading-md': [
        '0.9375rem',
        { lineHeight: '1.2667', fontWeight: 'bold' },
      ],
      'heading-lg': [
        '1.125rem',
        { lineHeight: '1.2778', fontWeight: 'bold' },
      ],
      'heading-xl': [
        '1.5rem',
        { lineHeight: '1.25', fontWeight: 'bold' },
      ],
    },
    fontFamily: {
      sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      neutral: {
        400: 'hsl(216deg, 15%, 57%)',
        600: 'hsl(236deg, 11%, 27%)',
        700: 'hsl(235deg, 12%, 19%)',
        800: 'hsl(235deg, 16%, 15%)',
        900: 'hsl(237deg, 100%, 4%)',
      },
      blue: {
        100: 'hsl(220deg, 69%, 97%)',
        200: 'hsl(221deg, 69%, 94%)',
      },
      purple: {
        300: 'hsl(243deg, 100%, 82%)',
        500: 'hsl(242deg, 48%, 58%)',
      },
      red: {
        300: 'hsl(0deg, 100%, 80%)',
        600: 'hsl(0deg, 78%, 63%)',
      },
      white: 'hsl(0deg, 0%, 100%)',
      black: 'hsl(0deg, 0%, 0%)',
      transparent: 'hsl(0deg, 0%, 0%, 0%)',
      translucent: 'hsl(0deg, 0%, 0%, 50%)',
      current: 'currentColor',
      'blue-start': 'hsl(219deg, 63%, 95%)',
      'blue-stop': 'hsl(218deg, 66%, 95%, 50%)',
    },
    boxShadow: {
      task: '0px 4px 6px 0px rgba(54, 78, 126, 0.10)',
    },
  },
  plugins: [headlessui({ prefix: 'ui' })],
};
