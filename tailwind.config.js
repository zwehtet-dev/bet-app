/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  safelist: [
    // Dynamic gradient classes
    'from-cyan-500', 'from-violet-500', 'from-emerald-500', 'from-orange-500',
    'to-blue-500', 'to-fuchsia-500', 'to-teal-500', 'to-rose-500',
    // Shadow classes
    'shadow-cyan-500/20', 'shadow-violet-500/20', 'shadow-emerald-500/20', 'shadow-orange-500/20',
    // Background classes
    'bg-cyan-500/20', 'bg-violet-500/20', 'bg-emerald-500/20', 'bg-orange-500/20',
    // Text classes
    'text-cyan-400', 'text-violet-400', 'text-emerald-400', 'text-orange-400'
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
        }
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
  corePlugins: {
    container: false,
    float: false,
    clear: false,
  }
}
