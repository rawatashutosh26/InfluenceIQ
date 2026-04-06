/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        ink: '#0A0A0F',
        paper: '#F5F0E8',
        accent: '#FF3B00',
        gold: '#FFB800',
        muted: '#6B6B7B',
      },
    },
  },
  plugins: [],
};