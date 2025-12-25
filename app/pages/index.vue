<template>
  <div class="min-h-screen text-white">
    <!-- Marquee Announcements -->
    <div class="px-4 pt-3 pb-2">
      <div class="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <!-- Loading State -->
        <div v-if="announcementsLoading" class="p-3 text-center">
          <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white/30"></div>
        </div>
        
        <!-- Marquee Text -->
        <div v-else-if="announcements.length > 0" class="py-3 overflow-hidden">
          <div class="whitespace-nowrap animate-marquee">
            <span v-for="(announcement, index) in announcements" :key="announcement.id" 
                  class="text-sm text-white/90 mr-16">
              {{ announcement.message }}
            </span>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="p-3 text-center">
          <p class="text-sm text-white/50">{{ t('noAnnouncements') }}</p>
        </div>
      </div>
    </div>

    <!-- Balance Card -->
    <div class="px-4 py-3">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex-1">
            <p class="text-white text-xs opacity-60 mb-1">{{ t('availableBalance') }}</p>
            <p class="text-white text-2xl font-bold">{{ formatBalance(userBalance) }} {{ t('mmk') }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <button @click="showTopUpModal = true" 
                class="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 text-sm font-semibold flex items-center justify-center transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          {{ t('topUpBalance') }}
        </button>
      </div>
    </div>

    <!-- Carousel -->
    <div class="px-4 py-3">
      <div class="relative overflow-hidden rounded-xl">
        <!-- Loading State -->
        <div v-if="carouselLoading" class="bg-white/10 backdrop-blur-sm rounded-xl h-48 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        
        <!-- Carousel Container -->
        <div v-else-if="carouselImages.length > 0" 
             class="relative h-48 rounded-xl overflow-hidden"
             @touchstart="handleTouchStart"
             @touchmove="handleTouchMove"
             @touchend="handleTouchEnd">
          
          <!-- Slides -->
          <div class="flex transition-transform duration-500 ease-in-out h-full"
               :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="(image, index) in carouselImages" :key="image.id"
                 class="w-full h-full flex-shrink-0 relative">
              
              <!-- Background Gradient -->
              <div :class="[
                'absolute inset-0 bg-gradient-to-r opacity-90',
                image.bgColor || 'from-blue-600 to-purple-600'
              ]"></div>
              
              <!-- Background Image (if available) -->
              <img v-if="image.imageUrl" 
                   :src="image.imageUrl" 
                   :alt="image.title"
                   class="absolute inset-0 w-full h-full object-cover opacity-30"
                   @error="handleImageError">
              
              <!-- Content Overlay -->
              <div class="absolute inset-0 flex items-center justify-center p-6">
                <div class="text-center">
                  <h3 class="text-xl font-bold text-white mb-2">{{ image.title }}</h3>
                  <p v-if="image.subtitle" class="text-sm text-white/80">{{ image.subtitle }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Navigation Arrows -->
          <button v-if="carouselImages.length > 1"
                  @click="prevSlide"
                  class="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button v-if="carouselImages.length > 1"
                  @click="nextSlide"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Dots Indicator -->
          <div v-if="carouselImages.length > 1" 
               class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button v-for="(image, index) in carouselImages" :key="`dot-${image.id}`"
                    @click="goToSlide(index)"
                    :class="[
                      'w-2 h-2 rounded-full transition-all',
                      currentSlide === index 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/70'
                    ]">
            </button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="bg-white/10 backdrop-blur-sm rounded-xl h-48 flex items-center justify-center">
          <div class="text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-white/70 text-sm">No promotional content available</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Results -->
    <div class="px-4 py-3">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">{{ t('todayResults') }}</h2>
        <NuxtLink to="/results" class="text-yellow-400 text-sm font-medium">{{ t('viewAll') }}</NuxtLink>
      </div>
      
      <!-- Loading State -->
      <div v-if="resultsLoading" class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white/30"></div>
      </div>
      
      <!-- Results Content -->
      <div v-else class="space-y-3">
        <!-- Today's 2D Results -->
        <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-sm font-bold text-white">2D</span>
              </div>
              <div>
                <h3 class="text-base font-semibold text-white">{{ t('today') }}</h3>
                <p class="text-xs text-white/60">{{ getCurrentDate() }}</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <!-- Morning Result -->
            <div class="bg-white/5 rounded-xl p-4 text-center border border-white/5">
              <p class="text-xs text-white/60 mb-2">{{ t('morning') }}</p>
              <p class="text-xs text-white/60 mb-1">12:00 PM</p>
              <div v-if="todayMorning2D" class="text-2xl font-bold text-blue-400">
                {{ todayMorning2D }}
              </div>
              <div v-else class="text-white/30 text-sm py-2">
                {{ t('pending') }}
              </div>
            </div>
            
            <!-- Evening Result -->
            <div class="bg-white/5 rounded-xl p-4 text-center border border-white/5">
              <p class="text-xs text-white/60 mb-2">{{ t('evening') }}</p>
              <p class="text-xs text-white/60 mb-1">4:30 PM</p>
              <div v-if="todayEvening2D" class="text-2xl font-bold text-blue-400">
                {{ todayEvening2D }}
              </div>
              <div v-else class="text-white/30 text-sm py-2">
                {{ t('pending') }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Latest 3D Result -->
        <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-sm font-bold text-white">3D</span>
              </div>
              <div>
                <h3 class="text-base font-semibold text-white">{{ t('latest3D') }}</h3>
                <p v-if="latest3DResult" class="text-xs text-white/60">
                  {{ formatDate(latest3DResult.date) }} - {{ latest3DResult.time }}
                </p>
                <p v-else class="text-xs text-white/60">{{ t('noResults') }}</p>
              </div>
            </div>
            <div class="text-right">
              <div v-if="latest3DResult" class="text-3xl font-bold text-purple-400">
                {{ latest3DResult.number }}
              </div>
              <div v-else class="text-white/30 text-lg">
                ---
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Selection -->
    <div class="px-4 py-2">
      <h2 class="text-lg font-bold mb-4">{{ t('selectGameType') }}</h2>
      <div class="grid grid-cols-2 gap-3">
        <!-- 2D Game -->
        <NuxtLink to="/2d" class="block">
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-all border border-white/10">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span class="text-lg font-bold text-white">2D</span>
            </div>
            <h3 class="font-bold text-sm mb-1">{{ t('2dBetting') }}</h3>
            <p class="text-xs opacity-60">{{ t('pick2Digits') }}</p>
            <p class="text-xs opacity-60">{{ t('winUpTo85x') }}</p>
          </div>
        </NuxtLink>

        <!-- 3D Game -->
        <NuxtLink to="/3d" class="block">
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-all border border-white/10">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span class="text-lg font-bold text-white">3D</span>
            </div>
            <h3 class="font-bold text-sm mb-1">{{ t('3dBetting') }}</h3>
            <p class="text-xs opacity-60">{{ t('pick3Digits') }}</p>
            <p class="text-xs opacity-60">{{ t('winUpTo500x') }}</p>
          </div>
        </NuxtLink>

        <!-- BawDi Game -->
        <NuxtLink to="/bawdi" class="block">
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-all border border-white/10">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="font-bold text-sm mb-1">{{ t('bawdiBetting') }}</h3>
            <p class="text-xs opacity-60">{{ t('footballBetting') }}</p>
            <p class="text-xs opacity-60">{{ t('bodyStyle') }}</p>
          </div>
        </NuxtLink>

        <!-- Maung Game -->
        <NuxtLink to="/maung" class="block">
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-all border border-white/10">
            <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="font-bold text-sm mb-1">{{ t('maungBetting') }}</h3>
            <p class="text-xs opacity-60">{{ t('footballBetting') }}</p>
            <p class="text-xs opacity-60">{{ t('maungStyle') }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="px-4 py-2">
      <h2 class="text-lg font-bold mb-4">{{ t('quickActions') }}</h2>
      <div class="grid grid-cols-3 gap-3">
        <!-- Wallet -->
        <NuxtLink to="/wallet" class="block">
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-all border border-white/10">
            <div class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="font-bold text-xs mb-1">{{ t('wallet') }}</h3>
            <p class="text-xs opacity-60">{{ t('manageBalance') }}</p>
          </div>
        </NuxtLink>

        <!-- History -->
        <NuxtLink to="/history" class="block">
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-all border border-white/10">
            <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="font-bold text-xs mb-1">{{ t('betHistory') }}</h3>
            <p class="text-xs opacity-60">{{ t('viewBetHistory') }}</p>
          </div>
        </NuxtLink>

        <!-- Profile -->
        <NuxtLink to="/profile" class="block">
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-all border border-white/10">
            <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="font-bold text-xs mb-1">{{ t('profile') }}</h3>
            <p class="text-xs opacity-60">{{ t('accountSettings') }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Demo Login Modal (for testing) -->
    <div v-if="!isLoggedIn && showLoginModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 m-4 w-full max-w-sm">
        <h3 class="text-lg font-bold mb-4 text-center">Demo Login</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Phone Number</label>
            <input v-model="loginForm.phone" type="text" placeholder="09123456789"
                   class="w-full bg-white/20 text-white rounded-lg px-3 py-2 placeholder-white/50">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input v-model="loginForm.password" type="password" placeholder="password"
                   class="w-full bg-white/20 text-white rounded-lg px-3 py-2 placeholder-white/50">
          </div>
          <div class="flex gap-2">
            <button @click="handleLogin" :disabled="authLoading"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50">
              {{ authLoading ? 'Logging in...' : 'Login' }}
            </button>
            <button @click="showLoginModal = false"
                    class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold">
              Cancel
            </button>
          </div>
          <p class="text-xs text-center text-white/70">
            Demo credentials: 09123456789 / password
          </p>
        </div>
      </div>
    </div>

    <!-- Top Up Modal -->
    <div v-if="showTopUpModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 m-4 w-full max-w-sm">
        <h3 class="text-lg font-bold mb-4 text-center">{{ t('topUpBalance') }}</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Amount (MMK)</label>
            <input v-model.number="topUpAmount" type="number" placeholder="10000"
                   class="w-full bg-white/20 text-white rounded-lg px-3 py-2 placeholder-white/50">
          </div>
          <div class="flex gap-2">
            <button @click="handleTopUp" :disabled="!topUpAmount || topUpAmount < 1000"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50">
              Top Up
            </button>
            <button @click="showTopUpModal = false"
                    class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold">
              Cancel
            </button>
          </div>
          <p class="text-xs text-center text-white/70">
            Demo: This will instantly add balance
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'
import { useBetting } from '~/composables/useBetting'
import { useCarousel } from '~/composables/useCarousel'
import { useResults } from '~/composables/useResults'
import { useAnnouncements } from '~/composables/useAnnouncements'

const { t } = useLanguage()
const { isLoggedIn, userBalance, authLoading, login, addBalance, initAuth } = useAuth()
const { recentResults, getAllResults } = useBetting()
const { 
  carouselImages, 
  currentSlide, 
  loading: carouselLoading,
  goToSlide,
  nextSlide,
  prevSlide,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
} = useCarousel()
const {
  recent2DResults,
  recent3DResults,
  next2DDraw,
  next3DDraw,
  timeUntilNext2D,
  timeUntilNext3D,
  loadResults,
  formatDate
} = useResults()
const {
  announcements,
  loading: announcementsLoading
} = useAnnouncements()

// Computed properties for today's results
const todayMorning2D = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const morningResult = recent2DResults.value.find(result => 
    result.date === today && result.session === 'Morning'
  )
  return morningResult?.number || null
})

const todayEvening2D = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const eveningResult = recent2DResults.value.find(result => 
    result.date === today && result.session === 'Evening'
  )
  return eveningResult?.number || null
})

const latest3DResult = computed(() => {
  return recent3DResults.value[0] || null
})

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const showLoginModal = ref(false)
const showTopUpModal = ref(false)
const resultsLoading = ref(false)
const topUpAmount = ref(10000)

const loginForm = ref({
  phone: '09123456789',
  password: 'password'
})

const formatBalance = (balance) => {
  return new Intl.NumberFormat('en-US').format(balance)
}

const handleLogin = async () => {
  const result = await login(loginForm.value.phone, loginForm.value.password)
  if (result.success) {
    showLoginModal.value = false
    await loadAllData()
  } else {
    alert(result.error)
  }
}

const handleTopUp = () => {
  if (topUpAmount.value >= 1000) {
    addBalance(topUpAmount.value)
    showTopUpModal.value = false
    topUpAmount.value = 10000
  }
}

const handleImageError = (event) => {
  // Hide broken images gracefully
  event.target.style.display = 'none'
}

const loadAllData = async () => {
  resultsLoading.value = true
  try {
    await Promise.all([
      getAllResults(),
      loadResults()
    ])
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    resultsLoading.value = false
  }
}

onMounted(async () => {
  await initAuth()
  
  if (!isLoggedIn.value) {
    showLoginModal.value = true
  } else {
    await loadAllData()
  }
})
</script>
