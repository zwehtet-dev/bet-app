<template>
  <div class="text-white">
    <!-- Announcements Marquee -->
    <div class="px-4 pt-3">
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
            <p class="text-xs text-white/50 mb-1">Available Balance</p>
            <p class="text-3xl font-black">{{ formatBalance(demoBalance) }}</p>
            <p class="text-xs text-white/40">MMK</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/25">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <NuxtLink to="/wallet" class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-green-500/25 active:scale-[0.98] transition-transform touch-manipulation">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
          Top Up Balance
        </NuxtLink>
      </div>
    </div>

    <!-- Carousel -->
    <div class="px-4 py-2">
      <div class="relative rounded-2xl overflow-hidden touch-manipulation" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
        <div class="relative h-40">
          <div class="flex h-full transition-transform duration-300 ease-out will-change-transform" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="(s, i) in slides" :key="i" class="w-full h-full flex-shrink-0 relative">
              <div :class="['absolute inset-0 bg-gradient-to-br', s.bgColor]"></div>
              <div class="absolute inset-0 flex items-center justify-center text-center p-6">
                <div><p class="text-2xl font-black mb-1">{{ s.title }}</p><p class="text-sm text-white/70">{{ s.subtitle }}</p></div>
              </div>
            </div>
          </div>
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            <button v-for="(_, i) in slides" :key="i" @click="currentSlide = i" :class="['h-1.5 rounded-full transition-all touch-manipulation', currentSlide === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40']"></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Today Results -->
    <div class="px-4 py-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold">Today's Results</h2>
        <NuxtLink to="/results" class="text-xs text-amber-400 font-medium touch-manipulation">View All →</NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <!-- 2D Results -->
        <div class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] font-black">2D</div>
            <span class="text-[10px] text-white/40">Today</span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center"><span class="text-[10px] text-white/40">12:00</span><span class="text-lg font-black text-blue-400">{{ results.morning2D }}</span></div>
            <div class="flex justify-between items-center"><span class="text-[10px] text-white/40">16:30</span><span class="text-lg font-black text-blue-400">{{ results.evening2D }}</span></div>
            <div class="flex justify-between items-center pt-1 border-t border-white/10"><span class="text-[10px] text-green-400">LIVE</span><span class="text-lg font-black text-green-400 animate-pulse">{{ results.live2D }}</span></div>
          </div>
        </div>
        <!-- 3D Results -->
        <div class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center text-[10px] font-black">3D</div>
            <span class="text-[10px] text-white/40">Latest</span>
          </div>
          <div class="text-center py-1">
            <p class="text-2xl font-black text-purple-400">{{ results.latest3D }}</p>
            <p class="text-[10px] text-white/30 mt-1">{{ results.latest3DDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Selection -->
    <div class="px-4 py-3">
      <h2 class="text-sm font-bold mb-3">Select Game Type</h2>
      <div class="grid grid-cols-2 gap-3">
        <NuxtLink v-for="g in games" :key="g.path" :to="g.path" class="group touch-manipulation">
          <div class="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center border border-white/5 transition-colors active:scale-[0.98]">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg transition-transform group-hover:scale-110 overflow-hidden', g.gradient, g.shadow]"><img :src="g.icon" :alt="g.title" class="w-full h-full object-cover" /></div>
            <p class="font-bold text-sm mb-0.5">{{ g.title }}</p><p class="text-[10px] text-white/40">{{ g.subtitle }}</p><p class="text-[10px] text-green-400 font-bold mt-1">{{ g.multiplier }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  keepalive: true
})

const currentSlide = ref(0)
const touchStart = ref(0)
const demoBalance = ref(500000)

const announcements = [
  { message: '🎉 Welcome to 2D3D Demo! This is a demo version with sample data.' },
  { message: '⚽ Try our football betting features - Bawdi and Maung styles!' },
  { message: '💰 Demo balance: 500,000 MMK for testing' }
]

const slides = [
  { title: '🎉 Welcome Bonus', subtitle: '20% on first deposit!', bgColor: 'from-blue-600 to-purple-600' },
  { title: '🔥 Hot Numbers', subtitle: 'Check lucky numbers', bgColor: 'from-orange-500 to-red-500' },
  { title: '⚽ Football', subtitle: 'Bet on your teams', bgColor: 'from-green-500 to-emerald-600' }
]

const results = ref({
  morning2D: '47',
  evening2D: '82',
  live2D: '35',
  latest3D: '456',
  latest3DDate: '16 Jan 2026'
})

const games = [
  { path: '/2d', title: '2D Betting', subtitle: 'Pick 2 digits', multiplier: 'Win 85x', icon: '/images/2d_icon.png', gradient: 'bg-gradient-to-br from-blue-500 to-blue-600', shadow: 'shadow-blue-500/25' },
  { path: '/3d', title: '3D Betting', subtitle: 'Pick 3 digits', multiplier: 'Win 500x', icon: '/images/3d_icon.png', gradient: 'bg-gradient-to-br from-purple-500 to-purple-600', shadow: 'shadow-purple-500/25' },
  { path: '/bawdi', title: 'Bawdi Betting', subtitle: 'Football betting', multiplier: 'Body Style', icon: '/images/bawdi_icon.png', gradient: 'bg-gradient-to-br from-green-500 to-green-600', shadow: 'shadow-green-500/25' },
  { path: '/maung', title: 'Maung Betting', subtitle: 'Football betting', multiplier: 'Maung Style', icon: '/images/maung_icon.png', gradient: 'bg-gradient-to-br from-orange-500 to-red-500', shadow: 'shadow-orange-500/25' }
]

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

let touchTimeout
const onTouchStart = (e) => { touchStart.value = e.touches[0].clientX }
const onTouchEnd = (e) => {
  if (touchTimeout) clearTimeout(touchTimeout)
  touchTimeout = setTimeout(() => {
    const diff = touchStart.value - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50 && slides.length > 0) {
      currentSlide.value = (currentSlide.value + (diff > 0 ? 1 : -1) + slides.length) % slides.length
    }
  }, 10)
}

let slideTimer

onMounted(() => {
  slideTimer = setInterval(() => { 
    if (slides.length > 0) currentSlide.value = (currentSlide.value + 1) % slides.length 
  }, 6000)
})

onUnmounted(() => {
  clearInterval(slideTimer)
  if (touchTimeout) clearTimeout(touchTimeout)
})
</script>

<style>
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.animate-marquee { animation: marquee 20s linear infinite; will-change: transform; }
.touch-manipulation { touch-action: manipulation; }
</style>
