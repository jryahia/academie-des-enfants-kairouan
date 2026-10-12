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
        // Playground palette, sampled from the real academy photos: bright
        // yellow mats, lime floors, orange platforms, primary-blue rolls.
        play: {
          yellow: '#FFD21F',
          lime: '#8CD62B',
          orange: '#FF8A1F',
          blue: '#1E63FF',
          pink: '#FF4FA3',
          sky: '#BFE3FF',
        },
        // Semantic tokens used across components (names kept, values bright).
        candy: {
          sky: '#BFE3FF',      // soft sky accent
          cream: '#FFF9E8',    // page background, warm cream
          sun: '#FFD21F',      // bright yellow
          orange: '#FF8A1F',   // orange accent
          coral: '#FF8A1F',    // primary CTA (orange)
          mint: '#3FA215',     // lime, darkened for readable links
          grass: '#8CD62B',
          grape: '#1E63FF',    // primary blue
          berry: '#FF4FA3',
          ink: '#13235B',      // deep navy text
          navy: '#3D4B7A',     // secondary text
          cloud: '#FFFFFF',    // surface / card
        },
        // Anime hair/outfit splash colors for the 9 crew characters
        crew: {
          straw: '#F2A33C',    // pirate rubber — straw hat orange
          spiky: '#F5C518',    // energy kid — spiky golden
          jungle: '#3FBF77',   // jungle boy — green
          spongeY: '#FFD93D',  // sponge kid — sunny yellow
          watchTeal: '#2FBFB0',// watch hero — teal
          catBlue: '#4A8FE7',  // sci-fi cat — blue
          candyPink: '#FF7BB0',// fairy — pink
          robot: '#8A96C2',    // robot — cool steel
          star: '#F4793A',     // dragon star — warm red-orange
        },
      },
      fontFamily: {
        arabic: ['"Cairo"', '"Tajawal"', 'sans-serif'],
        latin: ['"Inter"', 'sans-serif'],
        display: ['"Baloo 2"', '"Baloo Bhaijaan 2"', '"Cairo"', 'sans-serif'],
      },
      borderRadius: {
        blob: '42% 58% 55% 45% / 48% 42% 58% 52%',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(6deg)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
