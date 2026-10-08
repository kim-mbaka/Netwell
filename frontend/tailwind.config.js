module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // New brand blue (replaces the old #02287F navy) — used for solid
        // fills and text on light surfaces.
        navy: '#17306b',
        lime: '#77CD0C',
      },
      backgroundImage: {
        // Royal-blue gradient used for the dark shell (navbar, hero, footer, body).
        'brand-gradient': 'linear-gradient(135deg, #0e2150 0%, #17306b 48%, #2a52b0 100%)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
