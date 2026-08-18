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
        // Batman Studio dark palette — near-black + gold, cinematic and chic.
        candy: {
          sky: '#2b3a5e',      // deep steel blue (rare accent)
          cream: '#0a0a0c',    // page background — Gotham black
          sun: '#f0c75e',      // light gold
          orange: '#e5b63e',   // gold accent
          coral: '#e5b63e',    // gold — primary CTA
          mint: '#4a9d86',     // muted teal (secondary links)
          grass: '#4a9d86',
          grape: '#7a6bb5',    // muted violet
          berry: '#a35a7a',
          ink: '#ece8de',      // warm off-white text
          navy: '#a7a2b5',     // muted lavender-gray (secondary text)
          cloud: '#141419',    // surface / card
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
        latin: ['"Inter"', '"Playfair Display"', 'sans-serif'],
        display: ['"Playfair Display"', '"Cairo"', 'serif'],
      },
      borderRadius: {
        blob: '42% 58% 55% 45% / 48% 42% 58% 52%',
      },
    },
  },
  plugins: [],
}
