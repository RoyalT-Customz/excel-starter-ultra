/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'baby-pink': '#FFB6C1',
        'baby-pink-light': '#FFD6DE',
        'baby-pink-dark': '#FF91A4',
        'dark': '#0f0f0f',
        'dark-card': '#1a1a1a',
        'dark-surface': '#252525',
        'dark-border': '#333333',
        'dark-hover': '#2a2a2a',
      },
      boxShadow: {
        'pink-glow': '0 0 20px rgba(255, 182, 193, 0.15)',
        'pink-glow-lg': '0 0 40px rgba(255, 182, 193, 0.2)',
      },
    },
  },
  plugins: [],
}
