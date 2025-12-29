<template>
  <div class="text-white min-h-screen pb-20">
    <!-- Header with Tabs -->
    <section class="px-4 py-3 sticky top-0 z-10 bg-gradient-to-b from-slate-900 to-slate-900/95 backdrop-blur-sm">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-lg font-bold">ရလဒ်များ</h1>
        <button @click="refreshResults" :disabled="loading" 
                class="p-2 bg-white/10 rounded-xl hover:bg-white/15 transition-all disabled:opacity-50 active:scale-95">
          <svg :class="['w-5 h-5', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
      <div class="bg-white/5 rounded-xl p-1 border border-white/5">
        <div class="flex gap-1">
          <button @click="activeTab = '2d'"
                  :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all',
                           activeTab === '2d' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'text-white/50 hover:text-white']">
            2D ရလဒ်များ
          </button>
          <button @click="activeTab = '3d'"
                  :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all',
                           activeTab === '3d' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'text-white/50 hover:text-white']">
            3D ရလဒ်များ
          </button>
        </div>
      </div>
    </section>

    <!-- 2D Tab Content -->
    <section v-if="activeTab === '2d'" class="px-4 space-y-4">
      <!-- Skeleton Loading for 2D -->
      <template v-if="loading && !hasAny2DData">
        <div v-for="i in 3" :key="`skeleton-2d-${i}`">
          <SkeletonLoader type="result-2d" />
        </div>
      </template>

      <!-- Empty State -->
      <div v-else-if="!loading && displayed2DResults.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-sm text-white/40">No 2D results found</p>
      </div>
      
      <!-- 2D Results List -->
      <template v-else>
        <div v-for="day in displayed2DResults" :key="day.date" class="space-y-3">
          <!-- Date Badge -->
          <div class="flex justify-center pt-2">
            <span class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-500/25">
              {{ day.displayDate }}
            </span>
          </div>

          <!-- Main Results (12:01 PM and 4:30 PM) -->
          <template v-for="slot in getMainSlots(day)" :key="`${day.date}-${slot.timeKey}`">
            <div class="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
              <div class="text-center py-2.5 border-b border-white/5 bg-white/5">
                <p class="text-white text-sm font-bold">{{ slot.time }}</p>
              </div>
              <div class="grid grid-cols-3 py-4 px-3">
                <div class="text-center">
                  <p class="text-white/40 text-[10px] mb-1">Set</p>
                  <p class="text-white/80 text-sm font-bold">{{ slot.set || '-' }}</p>
                </div>
                <div class="text-center border-x border-white/5">
                  <p class="text-white/40 text-[10px] mb-1">Val</p>
                  <p class="text-white/80 text-sm font-bold">{{ slot.value || '-' }}</p>
                </div>
                <div class="text-center">
                  <p class="text-white/40 text-[10px] mb-1">2D</p>
                  <p class="text-blue-400 text-2xl font-black">{{ slot.result }}</p>
                </div>
              </div>
            </div>
          </template>

          <!-- Modern/Internet Results -->
          <template v-for="slot in getModernSlots(day)" :key="`${day.date}-mi-${slot.timeKey}`">
            <div class="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-xl border border-emerald-500/20 overflow-hidden">
              <div class="text-center py-2 bg-emerald-500/10">
                <p class="text-emerald-400 text-xs font-bold">{{ slot.time }}</p>
              </div>
              <div class="grid grid-cols-3 py-3 px-3">
                <div class="text-center">
                  <p class="text-white/40 text-[10px] mb-1">Modern</p>
                  <p class="text-amber-400 text-lg font-black">{{ slot.modern || '-' }}</p>
                </div>
                <div class="text-center border-x border-white/10">
                  <p class="text-white/40 text-[10px] mb-1">Internet</p>
                  <p class="text-amber-400 text-lg font-black">{{ slot.internet || '-' }}</p>
                </div>
                <div class="text-center">
                  <p class="text-white/40 text-[10px] mb-1">{{ slot.timeKey === '930' ? '11:00 AM' : '03:00 PM' }}</p>
                  <p class="text-amber-400 text-lg font-black">{{ slot.timeKey === '930' ? get1100Result(day) : get300Result(day) }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Load More Trigger for 2D -->
        <div v-if="hasMore2D" ref="loadMore2DTrigger" class="py-4 text-center">
          <div v-if="loadingMore" class="flex justify-center">
            <div class="w-6 h-6 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p v-else class="text-xs text-white/30">Scroll for more</p>
        </div>
      </template>
    </section>

    <!-- 3D Tab Content -->
    <section v-else-if="activeTab === '3d'" class="px-4 space-y-3">
      <!-- Skeleton Loading for 3D -->
      <template v-if="loading && !hasAny3DData">
        <SkeletonLoader v-for="i in 5" :key="`skeleton-3d-${i}`" type="result-3d" />
      </template>

      <!-- Empty State -->
      <div v-else-if="!loading && displayed3DResults.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-sm text-white/40">No 3D results found</p>
      </div>
      
      <!-- 3D Results List -->
      <template v-else>
        <div v-for="result in displayed3DResults" :key="result.date" 
             class="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
          <div class="flex items-center justify-between px-4 py-4">
            <div>
              <p class="text-white/40 text-[10px] mb-0.5">Date</p>
              <p class="text-white font-bold text-sm">{{ result.displayDate || result.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-white/40 text-[10px] mb-0.5">3D Result</p>
              <p class="text-purple-400 text-3xl font-black">{{ result.number }}</p>
            </div>
          </div>
        </div>

        <!-- Load More Trigger for 3D -->
        <div v-if="hasMore3D" ref="loadMore3DTrigger" class="py-4 text-center">
          <div v-if="loadingMore" class="flex justify-center">
            <div class="w-6 h-6 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <p v-else class="text-xs text-white/30">Scroll for more</p>
        </div>
      </template>
    </section>

    <!-- Error Toast -->
    <Transition name="slide-up">
      <div v-if="errorMessage" class="fixed bottom-20 left-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm text-center z-50">
        {{ errorMessage }}
        <button @click="errorMessage = ''" class="ml-2 underline">Dismiss</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useResults } from '~/composables/useResults'

// Lazy load - define page meta
definePageMeta({
  keepalive: true
})

const { 
  results2D, 
  results3D, 
  hasData,
  loadResults, 
  refreshLive2D
} = useResults()

const activeTab = ref('2d')
const loading = ref(true)
const loadingMore = ref(false)
const errorMessage = ref('')

// Pagination state
const PAGE_SIZE = 5
const current2DPage = ref(1)
const current3DPage = ref(1)

// Refs for infinite scroll
const loadMore2DTrigger = ref(null)
const loadMore3DTrigger = ref(null)

// Check if we have any data
const hasAny2DData = computed(() => results2D.value.length > 0)
const hasAny3DData = computed(() => results3D.value.length > 0)

// Paginated results
const displayed2DResults = computed(() => {
  return results2D.value.slice(0, current2DPage.value * PAGE_SIZE)
})

const displayed3DResults = computed(() => {
  return results3D.value.slice(0, current3DPage.value * PAGE_SIZE)
})

// Check if there's more data
const hasMore2D = computed(() => displayed2DResults.value.length < results2D.value.length)
const hasMore3D = computed(() => displayed3DResults.value.length < results3D.value.length)

// Slot helpers
const getMainSlots = (day) => {
  return day.slots.filter(s => !s.isModernInternet && (s.timeKey === '1200' || s.timeKey === '430'))
}

const getModernSlots = (day) => {
  return day.slots.filter(s => s.isModernInternet)
}

const get1100Result = (day) => {
  const slot = day.slots.find(s => s.timeKey === '1100')
  return slot?.result || '-'
}

const get300Result = (day) => {
  const slot = day.slots.find(s => s.timeKey === '300')
  return slot?.result || '-'
}

// Load more
const loadMore2D = () => {
  if (loadingMore.value || !hasMore2D.value) return
  loadingMore.value = true
  setTimeout(() => {
    current2DPage.value++
    loadingMore.value = false
  }, 200)
}

const loadMore3D = () => {
  if (loadingMore.value || !hasMore3D.value) return
  loadingMore.value = true
  setTimeout(() => {
    current3DPage.value++
    loadingMore.value = false
  }, 200)
}

// Intersection Observer
let observer2D = null
let observer3D = null

const setupObservers = () => {
  const options = { root: null, rootMargin: '100px', threshold: 0.1 }

  observer2D = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore2D.value) loadMore2D()
  }, options)

  observer3D = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore3D.value) loadMore3D()
  }, options)
}

watch([loadMore2DTrigger, activeTab], () => {
  nextTick(() => {
    if (observer2D && loadMore2DTrigger.value && activeTab.value === '2d') {
      observer2D.observe(loadMore2DTrigger.value)
    }
  })
}, { immediate: true })

watch([loadMore3DTrigger, activeTab], () => {
  nextTick(() => {
    if (observer3D && loadMore3DTrigger.value && activeTab.value === '3d') {
      observer3D.observe(loadMore3DTrigger.value)
    }
  })
}, { immediate: true })

watch(activeTab, () => {
  current2DPage.value = 1
  current3DPage.value = 1
})

// Initial load with skeleton
const initLoad = async () => {
  // Show skeleton while loading
  loading.value = true
  
  // If cached data exists, show it immediately (no skeleton)
  if (hasData.value) {
    loading.value = false
  }
  
  try {
    const result = await loadResults(false)
    if (!result.live2D && !result.result3D && !hasData.value) {
      errorMessage.value = 'Unable to load results'
      setTimeout(() => { errorMessage.value = '' }, 3000)
    }
  } catch (err) {
    if (!hasData.value) {
      errorMessage.value = 'Network error'
      setTimeout(() => { errorMessage.value = '' }, 3000)
    }
  } finally {
    loading.value = false
  }
}

// Manual refresh
const refreshResults = async () => {
  loading.value = true
  current2DPage.value = 1
  current3DPage.value = 1
  
  try {
    const result = await loadResults(true)
    if (!result.live2D && !result.result3D) {
      errorMessage.value = 'Unable to refresh'
      setTimeout(() => { errorMessage.value = '' }, 3000)
    }
  } catch (err) {
    errorMessage.value = 'Network error'
    setTimeout(() => { errorMessage.value = '' }, 3000)
  } finally {
    loading.value = false
  }
}

// Trading hours check
const isInTradingHours = () => {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  if (day === 0 || day === 6) return false
  return hour >= 9 && hour < 17
}

let refreshInterval = null

onMounted(async () => {
  setupObservers()
  await initLoad()
  
  if (isInTradingHours()) {
    refreshInterval = setInterval(() => {
      if (isInTradingHours()) refreshLive2D()
    }, 60000)
  }
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
  if (observer2D) observer2D.disconnect()
  if (observer3D) observer3D.disconnect()
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
