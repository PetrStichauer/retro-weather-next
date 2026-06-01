module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          bg: '#000000',
          teal: '#00aaaa',
          pink: '#ff00ff',
          yellow: '#ffff00',
          cyan: '#00ffff',
          gray: '#c0c0c0',
          darkGray: '#808080',
        }
      },
      fontFamily: {
        retro: ['"Courier New"', 'Courier', 'monospace'],
      }
    },
  },
  plugins: [],
}
