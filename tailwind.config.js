/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        // Blue Ocean Theme
        'theme': {
          'primary': '#1e3a8a',
          'secondary': '#1e40af', 
          'tertiary': '#1d4ed8'
        }
      },
      backgroundImage: {
        'theme-gradient': 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 30%, #1d4ed8 100%)',
        'main-bg': "url('/images/bg-1.jpeg')",
      },
      backgroundSize: {
        'cover': 'cover',
        'contain': 'contain',
      }
    },
  },
  plugins: [],
}