module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // New brand blue (replaces the old #02287F navy). STATIC — used for
        // text on lime buttons/badges so contrast holds in both themes.
        navy: '#17306b',
        lime: '#77CD0C',
        // Theme tokens — flip between light and dark via CSS vars (index.css).
        page: 'var(--page)',          // page / section background
        surface: 'var(--surface)',    // cards / panels
        'surface-2': 'var(--surface-2)', // insets / alt panels
        ink: 'var(--ink)',            // primary text
        'ink-soft': 'var(--ink-soft)',   // secondary text
        line: 'var(--line)',          // borders
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
