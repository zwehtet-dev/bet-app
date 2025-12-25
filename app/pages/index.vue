<template>
  <div class="text-white">
    <!-- Balance Card -->
    <section class="px-4 py-3">
      <div class="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-4 border border-amber-500/20">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-xs text-white/60 mb-1">{{ t('availableBalance') }}</p>
            <p class="text-2xl font-bold text-white">{{ formatBalance(userBalance) }} <span class="text-sm text-white/60">{{ t('mmk') }}</span></p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <NuxtLink to="/wallet" class="block w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 text-sm font-semibold text-center transition-colors">
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ t('topUpBalance') }}
        </NuxtLink>
      </div>
    </section>

    <!-- Today's Results -->
    <section class="px-4 py-2">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-white/80">{{ t('todayResults') }}</h2>
        <NuxtLink to="/results" class="text-xs text-amber-400 hover:text-amber-300">{{ t('viewAll') }} →</NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <!-- 2D Results -->
        <div class="bg-white/5 rounded-xl p-3 border border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <span class="text-xs font-bold">2D</span>
            </div>
            <span class="text-xs text-white/60">{{ t('today') }}</span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-[10px] text-white/50">12:00 PM</span>
              <span class="text-lg font-bold text-blue-400">{{ todayMorning2D || '--' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[10px] text-white/50">4:30 PM</span>
              <span class="text-lg font-bold text-blue-400">{{ todayEvening2D || '--' }}</span>
            </div>
          </div>
        </div>
        <!-- 3D Results -->
        <div class="bg-white/5 rounded-xl p-3 border border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center">
              <span class="text-xs font-bold">3D</span>
            </div>
            <span class="text-xs text-white/60">{{ t('latest') }}</span>
          </div>
          <div class="text-center py-2">
            <span class="text-2xl font-bold text-purple-400">{{ latest3DResult?.number || '---' }}</span>
            <p v-if="latest3DResult" class="text-[10px] text-white/40 mt-1">{{ formatDate(latest3DResult.date) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Game Selection -->
    <section class="px-4 py-3">
      <h2 class="text-sm font-semibold text-white/80 mb-3">{{ t('selectGameType') }}</h2>
      <div class="grid grid-cols-2 gap-3">
        <!-- 2D -->
        <NuxtLink to="/2d" class="group">
          <div class="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/5 hover:border-blue-500/30 transition-all">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <span class="text-lg font-bold">2D</span>
            </div>
            <h3 class="font-semibold text-sm mb-0.5">{{ t('2dBetting') }}</h3>
            <p class="text-[10px] text-white/50">{{ t('winUpTo85x') }}</p>
          </div>
        </NuxtLink>
        <!-- 3D -->
        <NuxtLink to="/3d" class="group">
          <div class="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/5 hover:border-purple-500/30 transition-all">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <span class="text-lg font-bold">3D</span>
            </div>
            <h3 class="font-semibold text-sm mb-0.5">{{ t('3dBetting') }}</h3>
            <p class="text-[10px] text-white/50">{{ t('winUpTo500x') }}</p>
          </div>
        </NuxtLink>
        <!-- BawDi -->
        <NuxtLink to="/bawdi" class="group">
          <div class="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/5 hover:border-green-500/30 transition-all">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="font-semibold text-sm mb-0.5">{{ t('bawdiBetting') }}</h3>
            <p class="text-[10px] text-white/50">{{ t('bodyStyle') }}</p>
          </div>
        </NuxtLink>
        <!-- Maung -->
        <NuxtLink to="/maung" class="group">
          <div class="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/5 hover:border-orange-500/30 transition-all">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-sm mb-0.5">{{ t('maungBetting') }}</h3>
            <p class="text-[10px] text-white/50">{{ t('maungStyle') }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Login Modal -->
    <Teleport to="body">
      <div v-if="!isLoggedIn && showLoginModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div class="bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-white/10">
          <h3 class="text-lg font-bold mb-4 text-center">Demo Login</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs text-white/60 mb-1.5">Phone Number</label>
              <input v-model="loginForm.phone" type="text" placeholder="09123456789"
                     class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-blue-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-1.5">Password</label>
              <input v-model="loginForm.password" type="password" placeholder="••••••••"
                     class="w-full bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:border-blue-500 focus:outline-none">
            </div>
            <button @click="handleLogin" :disabled="authLoading"
                    class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white py-3 rounded-xl font-semibold transition-colors">
              {{ authLoading ? 'Logging in...' : 'Login' }}
            </button>
            <p class="text-[10px] text-center text-white/40">Demo: 09123456789 / password</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'
import { useResults } from '~/composables/useResults'

const { t } = useLanguage()
const { isLoggedIn, userBalance, authLoading, login, initAuth } = useAuth()
const { recent2DResults, recent3DResults, loadResults, formatDate } = useResults()

const showLoginModal = ref(false)
const loginForm = ref({ phone: '09123456789', password: 'password' })

const todayMorning2D = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return recent2DResults.value.find(r => r.date === today && r.session === 'Morning')?.number || null
})

const todayEvening2D = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return recent2DResults.value.find(r => r.date === today && r.session === 'Evening')?.number || null
})

const latest3DResult = computed(() => recent3DResults.value[0] || null)

const formatBalance = (balance) => new Intl.NumberFormat('en-US').format(balance || 0)

const handleLogin = async () => {
  const result = await login(loginForm.value.phone, loginForm.value.password)
  if (result.success) {
    showLoginModal.value = false
    await loadResults()
  }
}

onMounted(async () => {
  await initAuth()
  if (!isLoggedIn.value) {
    showLoginModal.value = true
  } else {
    await loadResults()
  }
})
</script>
