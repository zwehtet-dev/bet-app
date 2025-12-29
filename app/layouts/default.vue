<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { t } = useLanguage()
const { userBalance, userName } = useAuth()

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
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="w-full min-h-screen max-w-[430px] relative mx-auto bg-cover bg-center bg-fixed" 
         style="background-image: url('/images/bg-10.jpeg');">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90"></div>
      
      <!-- Header -->
      <header class="sticky top-0 z-30 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div class="px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink v-if="!isMainPage" to="/" class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95">
              <svg class="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </NuxtLink>
            <div v-else class="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <span class="text-[10px] font-black text-white">2D</span>
            </div>
            <div>
              <h1 class="text-[15px] font-bold text-white">{{ t(currentPage.title) }}</h1>
              <p v-if="userName && isMainPage" class="text-[10px] text-white/40">Welcome back!</p>
            </div>
          </div>
          <div class="bg-white/10 rounded-xl px-3 py-2 border border-white/5">
            <p class="text-[9px] text-white/40 font-medium">BALANCE</p>
            <p class="text-sm font-black text-amber-400">{{ formatBalance(userBalance) }}</p>
          </div>
        </div>
      </header>
      
      <!-- Content -->
      <main class="relative z-10 pb-24">
        <slot />
      </main>

      <!-- Bottom Nav -->
      <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/80 backdrop-blur-xl border-t border-white/5 z-40 pb-safe">
        <div class="flex items-center justify-around py-2">
          <NuxtLink v-for="item in navItems" :key="item.name" :to="item.path" 
                    class="flex flex-col items-center py-2 px-5 rounded-2xl transition-all"
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
.pb-safe { padding-bottom: max(env(safe-area-inset-bottom), 8px); }
</style>
