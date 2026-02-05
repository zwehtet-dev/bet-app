// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],
  
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'
    }
  },
  
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  },
  
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    componentIslands: false
  },
  
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false
      }
    ]
  },
  
  vite: {
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router'],
      esbuildOptions: {
        target: 'es2020'
      }
    }
  },
  
  nitro: {
    compressPublicAssets: true,
    minify: true
  },
  
  vue: {
    propsDestructure: true
  },
  
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
      title: '2D3D Betting',
      meta: [
        { name: 'description', content: 'Myanmar 2D3D Lottery Betting App' },
        { name: 'theme-color', content: '#000000' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    pageTransition: false,
    layoutTransition: false
  },
  
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=86400' } }
  }
})
