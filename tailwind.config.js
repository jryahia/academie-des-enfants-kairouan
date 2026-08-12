/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0A0F1F',
          surface: '#121A2E',
          indigo: '#6C5CE7',
          blue: '#5B8DEF',
          mint: '#3DDC97',
          sun: '#FFB86B',
          coral: '#FF6B6B',
          lavender: '#B388FF',
        },
      },
      fontFamily: {
        arabic: ['"Cairo"', '"Tajawal"', 'sans-serif'],
        latin: ['"Nunito"', '"Baloo 2"', 'sans-serif'],
        display: ['"Baloo 2"', '"Cairo"', 'sans-serif'],
      },
      borderRadius: {
        blob: '42% 58% 55% 45% / 48% 42% 58% 52%',
      },
    },
  },
  plugins: [],
}
