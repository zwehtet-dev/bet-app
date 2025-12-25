<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { t } = useLanguage()
const { userBalance, userName } = useAuth()

const formatBalance = (balance: number) => {
  return new Intl.NumberFormat('en-US').format(balance || 0)
}

const getPageTitle = () => {
  const routeName = route.name as string
  switch (routeName) {
    case 'index': return t('home')
    case '2d': return t('2dBetting')
    case '3d': return t('3dBetting')
    case 'bawdi': return t('bawdiBetting')
    case 'maung': return t('maungBetting')
    case 'wallet': return t('wallet')
    case 'history': return t('betHistory')
    case 'profile': return t('profile')
    case 'results': return t('results')
    default: return 'App'
  }
}

const showBackButton = () => {
  const mainPages = ['index', 'wallet', 'history', 'profile']
  return !mainPages.includes(route.name as string)
}

const goBack = () => {
  navigateTo('/')
}

// Navigation items for bottom nav
const navItems = [
  { name: 'index', path: '/', icon: 'home', label: 'home', color: 'blue' },
  { name: 'wallet', path: '/wallet', icon: 'wallet', label: 'wallet', color: 'green' },
  { name: 'history', path: '/history', icon: 'history', label: 'history', color: 'purple' },
  { name: 'profile', path: '/profile', icon: 'profile', label: 'profile', color: 'orange' }
]

const isActive = (name: string) => route.name === name
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="w-full min-h-screen max-w-[430px] overflow-hidden relative mx-auto bg-center bg-cover"
      style="background-image: url(images/bg-14.jpeg);"
    >
      <!-- Header -->
      <header class="sticky top-0 z-20 px-4 py-3 bg-slate-900/95 backdrop-blur-sm border-b border-white/5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button v-if="showBackButton()" @click="goBack" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div v-else class="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span class="text-xs font-bold text-white">2D</span>
            </div>
            <div>
              <h1 class="text-base font-semibold text-white">{{ getPageTitle() }}</h1>
              <p v-if="userName && !showBackButton()" class="text-xs text-white/50">{{ userName }}</p>
            </div>
          </div>
          <div class="bg-white/5 rounded-lg px-3 py-1.5">
            <p class="text-[10px] text-white/50 uppercase tracking-wide">{{ t('balance') }}</p>
            <p class="text-sm font-bold text-amber-400">{{ formatBalance(userBalance) }} <span class="text-xs text-white/50">{{ t('mmk') }}</span></p>
          </div>
        </div>
      </header>
      
      <!-- Content -->
      <main class="pb-20 min-h-[calc(100vh-140px)]">
        <slot />
      </main>

      <!-- Bottom Navigation -->
      <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-slate-900/95 backdrop-blur-md border-t border-white/5 z-30 safe-area-pb">
        <div class="flex items-center justify-around py-2 px-4">
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.name"
            :to="item.path" 
            class="flex flex-col items-center py-2 px-3 rounded-xl transition-all"
            :class="isActive(item.name) ? 'bg-white/5' : 'hover:bg-white/5'"
          >
            <!-- Home Icon -->
            <svg v-if="item.icon === 'home'" class="w-6 h-6 mb-1" :class="isActive(item.name) ? 'text-blue-400' : 'text-white/40'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <!-- Wallet Icon -->
            <svg v-if="item.icon === 'wallet'" class="w-6 h-6 mb-1" :class="isActive(item.name) ? 'text-green-400' : 'text-white/40'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <!-- History Icon -->
            <svg v-if="item.icon === 'history'" class="w-6 h-6 mb-1" :class="isActive(item.name) ? 'text-purple-400' : 'text-white/40'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Profile Icon -->
            <svg v-if="item.icon === 'profile'" class="w-6 h-6 mb-1" :class="isActive(item.name) ? 'text-orange-400' : 'text-white/40'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-[10px] font-medium" :class="isActive(item.name) ? `text-${item.color}-400` : 'text-white/40'">
              {{ t(item.label) }}
            </span>
          </NuxtLink>
        </div>
      </nav>
    </div>
  </div>
</template>

<style>
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
