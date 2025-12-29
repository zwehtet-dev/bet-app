// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false }, // Disable in production for performance
  
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vite-pwa/nuxt'
  ],
  
  // PWA Configuration
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '2D3D Betting',
      short_name: '2D3D',
      description: 'Myanmar 2D3D Lottery Betting App',
      theme_color: '#1e3a8a',
      background_color: '#000000',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable any'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico,woff,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/2d3d\.pnpmyanmar\.com\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 5 // 5 minutes
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/luke\.2dboss\.com\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'live-results-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 30 // 30 seconds for live data
            }
          }
        },
        {
          urlPattern: /^https:\/\/api\.2dboss\.com\/api\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'results-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 10 // 10 minutes
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600 // Check for updates every hour
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://2d3d.pnpmyanmar.com'
    }
  },
  
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  },
  
  // Performance optimizations
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: true
  },
  
  // Enable lazy loading for all pages
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false
      }
    ]
  },
  
  // Vite optimizations for mobile
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'ui': ['reka-ui', 'class-variance-authority', 'clsx', 'tailwind-merge'],
            'carousel': ['embla-carousel-vue']
          }
        }
      },
      // Reduce chunk size for mobile
      chunkSizeWarningLimit: 500
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', '@vueuse/core']
    }
  },
  
  // Nitro server optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true,
    prerender: {
      crawlLinks: false
    }
  },
  
  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
      title: '2D3D Betting',
      meta: [
        { name: 'description', content: 'Myanmar 2D3D Lottery Betting App' },
        { name: 'theme-color', content: '#1e3a8a' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: '2D3D' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#1e3a8a' },
        { name: 'msapplication-tap-highlight', content: 'no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  
  // Route rules for caching
  routeRules: {
    '/': { prerender: false },
    '/login': { prerender: false },
    '/signup': { prerender: false },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=86400' } },
    '/icons/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  }
})
