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
    default: return 'App'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full min-h-screen max-w-[430px] overflow-hidden relative mx-auto bg-cover bg-center bg-no-repeat" 
         style="background-image: url('/images/bg-14.jpeg');">
      <!-- Background overlay for better text readability -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
      
      <!-- Header -->
      <div class="relative z-20 px-4 py-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span class="text-sm font-bold text-white">2D</span>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white">{{ getPageTitle() }}</h1>
              <p v-if="userName" class="text-xs text-white/70">{{ userName }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-white/70">{{ t('balance') }}</p>
            <p class="text-sm font-bold text-white">{{ formatBalance(userBalance) }} {{ t('mmk') }}</p>
          </div>
        </div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 pb-20">
        <slot />
      </div>

      <!-- Bottom Navigation -->
      <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-black/90 backdrop-blur-md border-t border-white/20 z-30">
        <div class="flex items-center justify-around py-3 px-2">
          <!-- Home -->
          <NuxtLink to="/" class="flex flex-col items-center py-2 px-4 rounded-xl transition-all hover:bg-white/10">
            <div :class="[
              'w-6 h-6 mb-1 flex items-center justify-center',
              route.name === 'index' ? 'text-blue-400' : 'text-white/60'
            ]">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span :class="[
              'text-xs font-medium',
              route.name === 'index' ? 'text-blue-400' : 'text-white/60'
            ]">
              {{ t('home') }}
            </span>
            <div v-if="route.name === 'index'" class="w-1 h-1 bg-blue-400 rounded-full mt-1"></div>
          </NuxtLink>

          <!-- Wallet -->
          <NuxtLink to="/wallet" class="flex flex-col items-center py-2 px-4 rounded-xl transition-all hover:bg-white/10">
            <div :class="[
              'w-6 h-6 mb-1 flex items-center justify-center',
              route.name === 'wallet' ? 'text-green-400' : 'text-white/60'
            ]">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span :class="[
              'text-xs font-medium',
              route.name === 'wallet' ? 'text-green-400' : 'text-white/60'
            ]">
              {{ t('wallet') }}
            </span>
            <div v-if="route.name === 'wallet'" class="w-1 h-1 bg-green-400 rounded-full mt-1"></div>
          </NuxtLink>

          <!-- History -->
          <NuxtLink to="/history" class="flex flex-col items-center py-2 px-4 rounded-xl transition-all hover:bg-white/10">
            <div :class="[
              'w-6 h-6 mb-1 flex items-center justify-center',
              route.name === 'history' ? 'text-purple-400' : 'text-white/60'
            ]">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span :class="[
              'text-xs font-medium',
              route.name === 'history' ? 'text-purple-400' : 'text-white/60'
            ]">
              {{ t('history') }}
            </span>
            <div v-if="route.name === 'history'" class="w-1 h-1 bg-purple-400 rounded-full mt-1"></div>
          </NuxtLink>

          <!-- Profile -->
          <NuxtLink to="/profile" class="flex flex-col items-center py-2 px-4 rounded-xl transition-all hover:bg-white/10">
            <div :class="[
              'w-6 h-6 mb-1 flex items-center justify-center',
              route.name === 'profile' ? 'text-orange-400' : 'text-white/60'
            ]">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span :class="[
              'text-xs font-medium',
              route.name === 'profile' ? 'text-orange-400' : 'text-white/60'
            ]">
              {{ t('profile') }}
            </span>
            <div v-if="route.name === 'profile'" class="w-1 h-1 bg-orange-400 rounded-full mt-1"></div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
