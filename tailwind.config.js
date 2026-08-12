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
        // Spacetoon-inspired candy palette — warm, vibrant, high-energy, kid-safe.
        candy: {
          sky: '#5ED4F4',      // bright cartoon sky blue (Spacetoon energy)
          cream: '#FFF6E9',    // warm paper/cream background
          sun: '#FFD23F',      // sunny yellow
          orange: '#FF9A3C',   // warm mandarin
          coral: '#FF6B8A',    // punchy pink/red
          mint: '#4BE0A2',     // fresh green
          grass: '#58C778',    // playground green
          grape: '#B07BF0',    // soft violet
          berry: '#FF7BB0',    // candy pink
          ink: '#2A2E45',      // soft deep text (not harsh black)
          navy: '#3A4A8F',     // deep blue accent
          cloud: '#FFFFFF',
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
