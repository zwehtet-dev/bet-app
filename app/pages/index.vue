<template>
  <div class="text-white">
    <!-- Announcements Marquee -->
    <div v-if="announcements.length" class="px-4 pt-3">
      <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl overflow-hidden">
        <div class="py-2.5 overflow-hidden">
          <div class="whitespace-nowrap animate-marquee flex">
            <span v-for="(a, i) in [...announcements, ...announcements]" :key="i" class="text-sm text-amber-300 mx-8">📢 {{ a.message }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Balance Card -->
    <div class="px-4 py-3">
      <div class="relative bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent rounded-2xl p-5 border border-amber-500/20 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative flex justify-between items-start mb-4">
          <div>
            <p class="text-xs text-white/50 mb-1">{{ t('availableBalance') }}</p>
            <template v-if="balanceLoading">
              <div class="h-9 w-32 bg-white/10 rounded animate-pulse mb-1"></div>
            </template>
            <template v-else>
              <p class="text-3xl font-black">{{ formatBalance(userBalance) }}</p>
            </template>
            <p class="text-xs text-white/40">{{ t('mmk') }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/25">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <NuxtLink to="/wallet" class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-green-500/25 active:scale-[0.98] transition-transform touch-manipulation">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
          {{ t('topUpBalance') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Carousel -->
    <div class="px-4 py-2">
      <div class="relative rounded-2xl overflow-hidden touch-manipulation" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
        <div v-if="carouselLoading" class="h-40 bg-white/5 rounded-2xl animate-pulse"></div>
        <div v-else-if="slides.length" class="relative h-40">
          <div class="flex h-full transition-transform duration-300 ease-out will-change-transform" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="(s, i) in slides" :key="i" class="w-full h-full flex-shrink-0 relative">
              <div :class="['absolute inset-0 bg-gradient-to-br', s.bgColor || 'from-blue-600 to-purple-600']"></div>
              <img v-if="s.imageUrl" :src="s.imageUrl" class="absolute inset-0 w-full h-full object-cover" loading="lazy" @error="(e) => e.target.style.display = 'none'" />
              <div v-if="s.title" class="absolute inset-0 flex items-center justify-center text-center p-6 bg-black/30">
                <div><p class="text-2xl font-black mb-1">{{ s.title }}</p><p class="text-sm text-white/70">{{ s.subtitle }}</p></div>
              </div>
            </div>
          </div>
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            <button v-for="(_, i) in slides" :key="i" @click="currentSlide = i" :class="['h-1.5 rounded-full transition-all touch-manipulation', currentSlide === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40']" :aria-label="`Go to slide ${i + 1}`"></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Today Results -->
    <div class="px-4 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold">{{ t('todayResults') }}</h2>
        <NuxtLink to="/results" class="text-xs text-amber-400 font-medium touch-manipulation">{{ t('viewAll') }} →</NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <!-- 2D Results -->
        <div class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] font-black">2D</div>
            <span class="text-[10px] text-white/40">{{ t('today') }}</span>
          </div>
          <div v-if="resultsLoading" class="space-y-2">
            <div class="flex justify-between items-center"><div class="h-3 w-10 bg-white/10 rounded animate-pulse"></div><div class="h-6 w-12 bg-white/10 rounded animate-pulse"></div></div>
            <div class="flex justify-between items-center"><div class="h-3 w-10 bg-white/10 rounded animate-pulse"></div><div class="h-6 w-12 bg-white/10 rounded animate-pulse"></div></div>
          </div>
          <div v-else class="space-y-2">
            <div class="flex justify-between items-center"><span class="text-[10px] text-white/40">12:00</span><span class="text-lg font-black text-blue-400">{{ results.morning2D || '--' }}</span></div>
            <div class="flex justify-between items-center"><span class="text-[10px] text-white/40">16:30</span><span class="text-lg font-black text-blue-400">{{ results.evening2D || '--' }}</span></div>
            <div v-if="isLive2DOpen && results.live2D && results.live2D !== '--'" class="flex justify-between items-center pt-1 border-t border-white/10"><span class="text-[10px] text-green-400">LIVE</span><span class="text-lg font-black text-green-400 animate-pulse">{{ results.live2D }}</span></div>
            <div v-else-if="!isLive2DOpen" class="flex justify-between items-center pt-1 border-t border-white/10"><span class="text-[10px] text-red-400">LIVE</span><span class="text-xs font-medium text-red-400/80">Closed</span></div>
          </div>
        </div>
        <!-- 3D Results -->
        <div class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center text-[10px] font-black">3D</div>
            <span class="text-[10px] text-white/40">{{ t('latest') }}</span>
          </div>
          <div v-if="resultsLoading" class="text-center py-1">
            <div class="h-8 w-16 bg-white/10 rounded animate-pulse mx-auto mb-1"></div>
            <div class="h-3 w-20 bg-white/10 rounded animate-pulse mx-auto"></div>
          </div>
          <div v-else class="text-center py-1">
            <p class="text-2xl font-black text-purple-400">{{ results.latest3D || '---' }}</p>
            <p class="text-[10px] text-white/30 mt-1">{{ results.latest3DDate || 'No results' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Selection -->
    <div class="px-4 py-3">
      <h2 class="text-sm font-bold mb-3">{{ t('selectGameType') }}</h2>
      <div class="grid grid-cols-2 gap-3">
        <NuxtLink v-for="g in games" :key="g.path" :to="g.path" class="group touch-manipulation">
          <div class="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/5 transition-colors active:scale-[0.98]">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg transition-transform group-hover:scale-110', g.gradient, g.shadow]"><span class="text-lg font-black">{{ g.label }}</span></div>
            <p class="font-bold text-sm mb-0.5">{{ t(g.title) }}</p><p class="text-[10px] text-white/40">{{ t(g.subtitle) }}</p><p class="text-[10px] text-green-400 font-bold mt-1">{{ g.multiplier }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Login Prompt -->
    <div v-if="!isLoggedIn && !authLoading" class="px-4 py-6">
      <div class="bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent rounded-2xl p-6 border border-amber-500/20 text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/25">
          <span class="text-xl font-black text-white">2D</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Welcome to 2D3D Betting!</h3>
        <p class="text-white/60 mb-6">Sign in to start betting and win big prizes</p>
        <div class="space-y-3">
          <NuxtLink to="/login" class="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-transform flex items-center justify-center touch-manipulation">Sign In</NuxtLink>
          <NuxtLink to="/signup" class="w-full bg-white/10 hover:bg-white/15 py-3.5 rounded-xl font-medium text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all active:scale-[0.98] flex items-center justify-center touch-manipulation">Create New Account</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'
import { useCarousel } from '~/composables/useCarousel'
import { useResults } from '~/composables/useResults'

// Lazy load - define page meta
definePageMeta({
  keepalive: true
})

const { t } = useLanguage()
const { isLoggedIn, userBalance, authLoading, initAuth } = useAuth()
const { carouselImages, loadCarouselImages } = useCarousel()
const { results3D, loadResults, hasData } = useResults()

const currentSlide = ref(0)
const touchStart = ref(0)
const announcements = ref([{ message: 'Welcome! Get 20% bonus on first deposit.' }])
const slides = ref([])
const results = ref({ morning2D: null, evening2D: null, live2D: null, latest3D: null, latest3DDate: null })

const balanceLoading = ref(true)
const carouselLoading = ref(true)
const resultsLoading = ref(true)
const isLive2DOpen = ref(false)

const games = [
  { path: '/2d', title: '2dBetting', subtitle: 'pick2Digits', multiplier: 'Win 85x', label: '2D', gradient: 'bg-gradient-to-br from-blue-500 to-blue-600', shadow: 'shadow-blue-500/25' },
  { path: '/3d', title: '3dBetting', subtitle: 'pick3Digits', multiplier: 'Win 500x', label: '3D', gradient: 'bg-gradient-to-br from-purple-500 to-purple-600', shadow: 'shadow-purple-500/25' },
  { path: '/bawdi', title: 'bawdiBetting', subtitle: 'footballBetting', multiplier: 'Body Style', label: '⚽', gradient: 'bg-gradient-to-br from-green-500 to-green-600', shadow: 'shadow-green-500/25' },
  { path: '/maung', title: 'maungBetting', subtitle: 'footballBetting', multiplier: 'Maung Style', label: '🏆', gradient: 'bg-gradient-to-br from-orange-500 to-red-500', shadow: 'shadow-orange-500/25' }
]

const defaultSlides = [
  { title: '🎉 Welcome Bonus', subtitle: '20% on first deposit!', bgColor: 'from-blue-600 to-purple-600' },
  { title: '🔥 Hot Numbers', subtitle: 'Check lucky numbers', bgColor: 'from-orange-500 to-red-500' },
  { title: '⚽ Football', subtitle: 'Bet on your teams', bgColor: 'from-green-500 to-emerald-600' }
]

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

// Debounced touch handlers for better mobile performance
let touchTimeout
const onTouchStart = (e) => { touchStart.value = e.touches[0].clientX }
const onTouchEnd = (e) => {
  if (touchTimeout) clearTimeout(touchTimeout)
  touchTimeout = setTimeout(() => {
    const diff = touchStart.value - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50 && slides.value.length > 0) {
      currentSlide.value = (currentSlide.value + (diff > 0 ? 1 : -1) + slides.value.length) % slides.value.length
    }
  }, 10)
}

const checkLive2DAvailability = () => {
  const now = new Date()
  const myanmarOffset = 6.5 * 60
  const utcOffset = now.getTimezoneOffset()
  const myanmarTime = new Date(now.getTime() + (myanmarOffset + utcOffset) * 60 * 1000)
  const day = myanmarTime.getDay()
  const hour = myanmarTime.getHours()
  isLive2DOpen.value = day >= 1 && day <= 5 && hour >= 10 && hour < 22
}

const updateResults = async () => {
  try {
    const response = await fetch('https://luke.2dboss.com/api/luke/twod-result-live', {
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    if (response.ok) {
      const data = await response.json()
      if (data.result === 1 && data.data) {
        results.value.morning2D = data.data.result_1200 || '--'
        results.value.evening2D = data.data.result_430 || '--'
        results.value.live2D = data.data.live || '--'
      }
    }
  } catch (error) {
    if (error.name !== 'AbortError') console.error('Failed to fetch live 2D:', error)
  }
  
  if (results3D.value.length > 0) {
    results.value.latest3D = results3D.value[0].number
    results.value.latest3DDate = results3D.value[0].displayDate || results3D.value[0].date
  }
}

watch([results3D], () => {
  if (results3D.value.length > 0) {
    results.value.latest3D = results3D.value[0].number
    results.value.latest3DDate = results3D.value[0].displayDate || results3D.value[0].date
  }
}, { deep: true })

let slideTimer, liveRefreshTimer, availabilityTimer

onMounted(async () => {
  checkLive2DAvailability()
  availabilityTimer = setInterval(checkLive2DAvailability, 60000)
  
  await initAuth()
  balanceLoading.value = false
  
  // Load carousel
  loadCarouselImages().then(() => {
    if (carouselImages.value?.length > 0) {
      slides.value = carouselImages.value.map((img, index) => ({
        id: img.id,
        imageUrl: img.imageUrl || img.link,
        title: img.title || '',
        subtitle: img.subtitle || '',
        bgColor: img.bgColor || ['from-blue-600 to-purple-600', 'from-green-600 to-blue-600', 'from-yellow-600 to-red-600'][index % 3]
      }))
    } else {
      slides.value = defaultSlides
    }
    carouselLoading.value = false
  })
  
  if (hasData.value) resultsLoading.value = false
  
  updateResults().then(() => { resultsLoading.value = false })
  loadResults(false)
  
  // Carousel auto-slide every 5 seconds
  slideTimer = setInterval(() => { 
    if (slides.value.length > 0) currentSlide.value = (currentSlide.value + 1) % slides.value.length 
  }, 5000)
  
  // Reduced refresh rate: 30 seconds instead of 10 for better mobile performance
  liveRefreshTimer = setInterval(updateResults, 30000)
})

onUnmounted(() => {
  clearInterval(slideTimer)
  clearInterval(liveRefreshTimer)
  clearInterval(availabilityTimer)
  if (touchTimeout) clearTimeout(touchTimeout)
})
</script>

<style>
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.animate-marquee { animation: marquee 20s linear infinite; will-change: transform; }
.touch-manipulation { touch-action: manipulation; }
</style>
