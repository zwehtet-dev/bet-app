<template>
  <div class="text-white">
    <!-- Announcements -->
    <div v-if="announcements.length" class="px-4 pt-3">
      <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl overflow-hidden">
        <div class="py-2.5 overflow-hidden">
          <div class="whitespace-nowrap animate-marquee flex">
            <span v-for="(a, i) in [...announcements, ...announcements]" :key="i" class="text-sm text-amber-300 mx-8">📢 {{ a.message }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Balance -->
    <div class="px-4 py-3">
      <div class="relative bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent rounded-2xl p-5 border border-amber-500/20 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative flex justify-between items-start mb-4">
          <div>
            <p class="text-xs text-white/50 mb-1">{{ t('availableBalance') }}</p>
            <p class="text-3xl font-black">{{ formatBalance(userBalance) }}</p>
            <p class="text-xs text-white/40">{{ t('mmk') }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/25">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <NuxtLink to="/wallet" class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-green-500/25 active:scale-[0.98] transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          {{ t('topUpBalance') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Carousel -->
    <div class="px-4 py-2">
      <div class="relative rounded-2xl overflow-hidden" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <div v-if="slides.length" class="relative h-40">
          <div class="flex h-full transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="(s, i) in slides" :key="i" class="w-full h-full flex-shrink-0 relative">
              <div :class="['absolute inset-0 bg-gradient-to-br', s.bg]"></div>
              <div class="absolute inset-0 flex items-center justify-center text-center p-6">
                <div>
                  <p class="text-2xl font-black mb-1">{{ s.title }}</p>
                  <p class="text-sm text-white/70">{{ s.subtitle }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            <button v-for="(_, i) in slides" :key="i" @click="currentSlide = i" 
                    :class="['h-1.5 rounded-full transition-all', currentSlide === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40']"></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="px-4 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold">{{ t('todayResults') }}</h2>
        <NuxtLink to="/results" class="text-xs text-amber-400 font-medium">{{ t('viewAll') }} →</NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] font-black">2D</div>
            <span class="text-[10px] text-white/40">{{ t('today') }}</span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center"><span class="text-[10px] text-white/40">12:00</span><span class="text-lg font-black text-blue-400">{{ results.morning2D || '--' }}</span></div>
            <div class="flex justify-between items-center"><span class="text-[10px] text-white/40">16:30</span><span class="text-lg font-black text-blue-400">{{ results.evening2D || '--' }}</span></div>
          </div>
        </div>
        <div class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center text-[10px] font-black">3D</div>
            <span class="text-[10px] text-white/40">{{ t('latest') }}</span>
          </div>
          <div class="text-center py-1">
            <p class="text-2xl font-black text-purple-400">{{ results.latest3D || '---' }}</p>
            <p class="text-[10px] text-white/30 mt-1">{{ results.latest3DDate || 'No results' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Games -->
    <div class="px-4 py-3">
      <h2 class="text-sm font-bold mb-3">{{ t('selectGameType') }}</h2>
      <div class="grid grid-cols-2 gap-3">
        <NuxtLink v-for="g in games" :key="g.path" :to="g.path" class="group">
          <div class="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/5 transition-all active:scale-[0.98]">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg transition-transform group-hover:scale-110', g.gradient, g.shadow]">
              <span v-if="g.icon === 'text'" class="text-lg font-black">{{ g.label }}</span>
              <component v-else :is="g.icon" class="w-6 h-6" />
            </div>
            <p class="font-bold text-sm mb-0.5">{{ t(g.title) }}</p>
            <p class="text-[10px] text-white/40">{{ t(g.subtitle) }}</p>
            <p class="text-[10px] text-green-400 font-bold mt-1">{{ g.multiplier }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Login Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showLogin" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 w-full max-w-sm border border-white/10">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span class="text-xl font-black">2D</span>
              </div>
              <h3 class="text-xl font-bold">Welcome!</h3>
              <p class="text-sm text-white/40 mt-1">Login to continue</p>
            </div>
            <div class="space-y-4">
              <input v-model="loginForm.phone" type="text" placeholder="Phone Number" class="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm border border-white/10 focus:border-amber-500 focus:outline-none">
              <input v-model="loginForm.password" type="password" placeholder="Password" class="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm border border-white/10 focus:border-amber-500 focus:outline-none">
              <button @click="handleLogin" :disabled="authLoading" class="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-transform disabled:opacity-50">
                {{ authLoading ? 'Loading...' : 'Login' }}
              </button>
              <p class="text-[10px] text-center text-white/30">Demo: 09123456789 / password</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { isLoggedIn, userBalance, authLoading, login, initAuth } = useAuth()

const showLogin = ref(false)
const loginForm = ref({ phone: '09123456789', password: 'password' })
const currentSlide = ref(0)
const touchStart = ref(0)

const announcements = ref([{ message: 'Welcome! Get 20% bonus on first deposit.' }])
const slides = ref([
  { title: '🎉 Welcome Bonus', subtitle: '20% on first deposit!', bg: 'from-blue-600 to-purple-600' },
  { title: '🔥 Hot Numbers', subtitle: 'Check lucky numbers', bg: 'from-orange-500 to-red-500' },
  { title: '⚽ Football', subtitle: 'Bet on your teams', bg: 'from-green-500 to-emerald-600' }
])
const results = ref({ morning2D: '47', evening2D: null, latest3D: '582', latest3DDate: 'Yesterday' })
const games = [
  { path: '/2d', title: '2dBetting', subtitle: 'pick2Digits', multiplier: 'Win 85x', label: '2D', icon: 'text', gradient: 'bg-gradient-to-br from-blue-500 to-blue-600', shadow: 'shadow-blue-500/25' },
  { path: '/3d', title: '3dBetting', subtitle: 'pick3Digits', multiplier: 'Win 500x', label: '3D', icon: 'text', gradient: 'bg-gradient-to-br from-purple-500 to-purple-600', shadow: 'shadow-purple-500/25' },
  { path: '/bawdi', title: 'bawdiBetting', subtitle: 'footballBetting', multiplier: 'Body Style', label: '⚽', icon: 'text', gradient: 'bg-gradient-to-br from-green-500 to-green-600', shadow: 'shadow-green-500/25' },
  { path: '/maung', title: 'maungBetting', subtitle: 'footballBetting', multiplier: 'Maung Style', label: '🏆', icon: 'text', gradient: 'bg-gradient-to-br from-orange-500 to-red-500', shadow: 'shadow-orange-500/25' }
]

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const onTouchStart = (e) => { touchStart.value = e.touches[0].clientX }
const onTouchEnd = (e) => {
  const diff = touchStart.value - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) currentSlide.value = (currentSlide.value + (diff > 0 ? 1 : -1) + slides.value.length) % slides.value.length
}

const handleLogin = async () => {
  const res = await login(loginForm.value.phone, loginForm.value.password)
  if (res.success) showLogin.value = false
}

let slideTimer
onMounted(async () => {
  await initAuth()
  if (!isLoggedIn.value) showLogin.value = true
  slideTimer = setInterval(() => { currentSlide.value = (currentSlide.value + 1) % slides.value.length }, 5000)
})
onUnmounted(() => clearInterval(slideTimer))
</script>

<style>
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.animate-marquee { animation: marquee 20s linear infinite; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
