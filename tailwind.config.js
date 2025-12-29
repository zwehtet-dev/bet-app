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
  // Optimize for production - only include used classes
  safelist: [
    // Dynamic color classes used in navigation
    'bg-blue-500/15', 'bg-green-500/15', 'bg-purple-500/15', 'bg-orange-500/15',
    'text-blue-400', 'text-green-400', 'text-purple-400', 'text-orange-400',
    // Gradient classes
    'from-blue-500', 'from-purple-500', 'from-green-500', 'from-orange-500',
    'to-blue-600', 'to-purple-600', 'to-green-600', 'to-red-500',
    // Shadow classes
    'shadow-blue-500/25', 'shadow-purple-500/25', 'shadow-green-500/25', 'shadow-orange-500/25'
  ],
  theme: {
    extend: {
      colors: {
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
      // Optimize animations for mobile
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      // Mobile-first spacing
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      }
    },
  },
  plugins: [],
  // Reduce CSS output size
  corePlugins: {
    // Disable unused utilities for smaller bundle
    container: false,
    float: false,
    clear: false,
  }
}
