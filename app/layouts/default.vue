<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { t } = useLanguage()
const { userBalance, userName, isLoggedIn } = useAuth()

const formatBalance = (balance: number) => new Intl.NumberFormat('en-US').format(balance || 0)

const pageConfig: Record<string, { title: string; color: string }> = {
  'index': { title: 'home', color: 'amber' },
  '2d': { title: '2dBetting', color: 'blue' },
  '3d': { title: '3dBetting', color: 'purple' },
  'bawdi': { title: 'bawdiBetting', color: 'green' },
  'maung': { title: 'maungBetting', color: 'orange' },
  'wallet': { title: 'wallet', color: 'green' },
  'history': { title: 'betHistory', color: 'purple' },
  'profile': { title: 'profile', color: 'blue' },
  'results': { title: 'results', color: 'amber' }
}

const currentPage = computed(() => pageConfig[route.name as string] || { title: 'App', color: 'amber' })
const isMainPage = computed(() => ['index', 'wallet', 'history', 'profile'].includes(route.name as string))

const navItems = [
  { name: 'index', path: '/', icon: 'home', label: 'home', color: 'blue' },
  { name: 'wallet', path: '/wallet', icon: 'wallet', label: 'wallet', color: 'green' },
  { name: 'history', path: '/history', icon: 'history', label: 'history', color: 'purple' },
  { name: 'profile', path: '/profile', icon: 'profile', label: 'profile', color: 'orange' }
]
</script>

<template>
  <div class="min-h-screen min-h-[100dvh] flex items-center justify-center bg-black">
    <div class="w-full min-h-screen min-h-[100dvh] max-w-[430px] relative mx-auto flex flex-col bg-cover bg-center bg-fixed" 
         style="background-image: url('/images/bg-10.jpeg');">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90 pointer-events-none"></div>
      
      <!-- Header -->
      <header class="sticky top-0 z-30 bg-black/60 backdrop-blur-xl border-b border-white/5 flex-shrink-0" style="contain: layout style;">
        <div class="px-4 py-3 flex items-center justify-between safe-area-top">
          <div class="flex items-center gap-3">
            <NuxtLink v-if="!isMainPage" to="/" class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95 touch-manipulation">
              <svg class="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </NuxtLink>
            <div v-else class="w-9 h-9 rounded-xl overflow-hidden shadow-lg">
              <img src="/images/logo.jpg" alt="Logo" class="w-full h-full object-cover" loading="eager" fetchpriority="high">
            </div>
            <div>
              <h1 class="text-[15px] font-bold text-white">{{ t(currentPage.title) }}</h1>
              <p v-if="isLoggedIn && userName && isMainPage" class="text-[10px] text-white/40">Welcome back!</p>
              <p v-else-if="!isLoggedIn && isMainPage" class="text-[10px] text-white/40">Please sign in</p>
            </div>
          </div>
          <div v-if="isLoggedIn" class="bg-white/10 rounded-xl px-3 py-2 border border-white/5">
            <p class="text-[9px] text-white/40 font-medium">BALANCE</p>
            <p class="text-sm font-black text-amber-400">{{ formatBalance(userBalance) }}</p>
          </div>
          <NuxtLink v-else to="/login" class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl px-4 py-2 border border-amber-500/20 text-sm font-bold text-white shadow-lg shadow-orange-500/25 active:scale-95 transition-transform touch-manipulation">
            Login
          </NuxtLink>
        </div>
      </header>
      
      <!-- Content - flex-1 to fill remaining space -->
      <main class="relative z-10 flex-1 overflow-y-auto pb-[72px]" style="-webkit-overflow-scrolling: touch;">
        <slot />
      </main>

      <!-- Bottom Nav - Absolute positioned within container -->
      <nav class="absolute max-w-[430px] bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/5 z-40 mx-auto">
        <div class="flex items-center justify-around py-2 safe-area-bottom">
          <NuxtLink v-for="item in navItems" :key="item.name" :to="item.path" 
                    class="flex flex-col items-center py-2 px-5 rounded-2xl transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
                    :class="route.name === item.name ? `bg-${item.color}-500/15` : 'active:bg-white/5'">
            <svg v-if="item.icon === 'home'" class="w-6 h-6 mb-0.5" :class="route.name === item.name ? `text-${item.color}-400` : 'text-white/35'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <svg v-if="item.icon === 'wallet'" class="w-6 h-6 mb-0.5" :class="route.name === item.name ? `text-${item.color}-400` : 'text-white/35'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <svg v-if="item.icon === 'history'" class="w-6 h-6 mb-0.5" :class="route.name === item.name ? `text-${item.color}-400` : 'text-white/35'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-if="item.icon === 'profile'" class="w-6 h-6 mb-0.5" :class="route.name === item.name ? `text-${item.color}-400` : 'text-white/35'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-[10px] font-semibold" :class="route.name === item.name ? `text-${item.color}-400` : 'text-white/35'">{{ t(item.label) }}</span>
          </NuxtLink>
        </div>
      </nav>
    </div>
  </div>
</template>

<style>
/* Safe area handling for notched devices */
.safe-area-top { padding-top: env(safe-area-inset-top, 0); }
.safe-area-bottom { padding-bottom: max(env(safe-area-inset-bottom), 8px); }

/* Touch optimization */
.touch-manipulation { touch-action: manipulation; }

/* Optimize backdrop blur for mobile */
@supports (backdrop-filter: blur(12px)) {
  .backdrop-blur-xl { backdrop-filter: blur(12px); }
}
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-xl { background-color: rgba(0, 0, 0, 0.95); }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Fix for iOS Safari 100vh issue */
@supports (-webkit-touch-callout: none) {
  .min-h-\[100dvh\] {
    min-height: -webkit-fill-available;
  }
}
</style>
