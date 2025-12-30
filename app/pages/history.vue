<template>
  <div class="text-white">
    <!-- Loading State -->
    <div v-if="!pageReady" class="px-4 py-12 text-center">
      <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <svg class="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-sm text-white/50">Loading...</p>
    </div>

    <template v-else>
      <!-- Game Type Tabs -->
      <div class="px-4 py-3">
        <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
          <button v-for="tab in gameTabs" :key="tab.value" @click="switchTab(tab.value)" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', activeGameTab === tab.value ? tab.class : 'text-white/50']">{{ tab.label }}</button>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="px-4 py-2">
        <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
          <button v-for="f in filters" :key="f.value" @click="switchFilter(f.value)" :class="['flex-1 py-2 rounded-lg text-[10px] font-bold transition-all', activeFilter === f.value ? f.class : 'text-white/50']">{{ t(f.label) }}</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="px-4 py-2">
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-lg font-black">{{ totalBetsCount }}</p><p class="text-[10px] text-white/40">Total Bets</p></div>
          <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-lg font-black text-green-400">{{ formatBalance(totalWinAmountCalc) }}</p><p class="text-[10px] text-white/40">Won</p></div>
          <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-lg font-black" :class="netProfitCalc >= 0 ? 'text-green-400' : 'text-red-400'">{{ netProfitCalc >= 0 ? '+' : '' }}{{ formatBalance(netProfitCalc) }}</p><p class="text-[10px] text-white/40">Profit</p></div>
        </div>
      </div>

      <!-- Initial Loading Skeleton -->
      <div v-if="initialLoading" class="px-4 py-3 space-y-3">
        <SkeletonLoader v-for="i in 5" :key="i" type="list-item" />
      </div>

      <!-- 2D/3D Bets -->
      <div v-else-if="activeGameTab === '2d3d'" class="px-4 py-3 space-y-3">
        <div v-for="bet in filteredBets" :key="bet.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shadow-lg overflow-hidden', bet.gameType === '2D' ? 'bg-blue-500 shadow-blue-500/25' : 'bg-purple-500 shadow-purple-500/25']"><img :src="bet.gameType === '2D' ? '/images/2d_icon.png' : '/images/3d_icon.png'" :alt="bet.gameType" class="w-full h-full object-cover" /></div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5"><p class="text-sm font-bold">{{ bet.gameType }} Bet</p><span :class="['text-[10px] px-1.5 py-0.5 rounded font-bold', getBetStatusBg(bet.status)]">{{ bet.status.toUpperCase() }}</span></div>
              <p class="text-[10px] text-white/40">{{ formatDate(bet.createdAt) }}</p>
            </div>
            <div class="text-right"><p class="text-xs text-white/50">{{ formatBalance(bet.totalAmount) }}</p><p v-if="bet.status === 'won'" class="text-sm font-black text-green-400">+{{ formatBalance(bet.winAmount) }}</p></div>
          </div>
          <div class="bg-white/5 rounded-lg p-2.5 flex items-center gap-2">
            <span class="text-[10px] text-white/40">Numbers:</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="d in bet.betDetails" :key="d.id" :class="['px-2 py-0.5 rounded text-xs font-bold', d.isWin ? 'bg-green-500/30 text-green-400' : bet.gameType === '2D' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400']">{{ d.digit }} ({{ formatBalance(d.amount) }})</span>
            </div>
          </div>
        </div>
        <div v-if="!filteredBets.length && !initialLoading" class="text-center py-12">
          <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3"><svg class="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <p class="text-sm text-white/40">No bets found</p>
        </div>
      </div>

      <!-- Soccer Bets -->
      <div v-else class="px-4 py-3 space-y-3">
        <div v-for="bet in filteredSoccerBets" :key="bet.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shadow-lg overflow-hidden', bet.gameType === 'Maung' ? 'bg-orange-500 shadow-orange-500/25' : 'bg-green-500 shadow-green-500/25']"><img :src="bet.gameType === 'Maung' ? '/images/maung_icon.png' : '/images/bawdi_icon.png'" :alt="bet.gameType" class="w-full h-full object-cover" /></div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <p class="text-sm font-bold">{{ bet.gameType === 'Body' ? 'Bawdi' : bet.gameType }} Bet</p>
                <span :class="['text-[10px] px-1.5 py-0.5 rounded font-bold', getBetStatusBg(bet.status)]">{{ bet.status.toUpperCase() }}</span>
              </div>
              <p class="text-[10px] text-white/40">{{ formatDate(bet.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-white/50">{{ formatBalance(bet.amount || bet.totalAmount) }}</p>
              <p v-if="bet.status === 'won'" class="text-sm font-black text-green-400">+{{ formatBalance(bet.winAmount) }}</p>
            </div>
          </div>
          
          <!-- Simple Soccer Bet Details Display -->
          <div class="bg-white/5 rounded-lg p-2.5">
            <div v-if="bet.soccerBetDetails && bet.soccerBetDetails.length" class="space-y-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[10px] text-white/40">Matches:</span>
                <span class="text-[10px] text-white/60">{{ bet.soccerBetDetails.length }} selection{{ bet.soccerBetDetails.length > 1 ? 's' : '' }}</span>
              </div>
              
              <!-- Simple list of selections -->
              <div v-for="(detail, index) in bet.soccerBetDetails" :key="index" class="text-xs text-white/70">
                <span class="text-white/90">Match {{ detail.gameId || index + 1 }}</span>
                <span v-if="detail.amount" class="ml-2 text-amber-400">({{ formatBalance(detail.amount) }} MMK)</span>
                <span v-if="detail.isWin === true" class="ml-2 text-green-400">✓ Won</span>
                <span v-else-if="detail.isWin === false" class="ml-2 text-red-400">✗ Lost</span>
                <span v-else class="ml-2 text-yellow-400">⏳ Pending</span>
              </div>
            </div>
            
            <!-- Fallback for bets without details -->
            <div v-else class="text-[10px] text-white/40">
              {{ bet.gameType }} bet - No details available
            </div>
          </div>
        </div>
        
        <div v-if="!filteredSoccerBets.length && !initialLoading" class="text-center py-12">
          <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <img src="/images/bawdi_icon.png" alt="Soccer" class="w-full h-full object-cover" />
          </div>
          <p class="text-sm text-white/40">No soccer bets found</p>
          <p class="text-xs text-white/30 mt-2">
            Raw soccer history count: {{ soccerBetHistory.length }}
          </p>
        </div>
      </div>

      <!-- Loading More Skeleton -->
      <div v-if="loadingMore" class="px-4 py-3 space-y-3">
        <SkeletonLoader v-for="i in 3" :key="i" type="list-item" />
      </div>

      <!-- Infinite Scroll Trigger -->
      <div ref="infiniteScrollTrigger" class="h-4"></div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useBetting } from '~/composables/useBetting'
import { useSoccerBetting } from '~/composables/useSoccerBetting'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  keepalive: true
})

const { t } = useLanguage()
const { isLoggedIn, initAuth } = useAuth()
const { betHistory, bettingLoading, getBetHistory, loadMoreBetHistory, getBetStatusBg } = useBetting()
const { soccerBetHistory, loading: soccerLoading, getSoccerBetHistory } = useSoccerBetting()

const activeGameTab = ref('2d3d')
const activeFilter = ref('all')
const initialLoading = ref(false)
const loadingMore = ref(false)
const hasMoreData = ref(true)
const infiniteScrollTrigger = ref(null)
const observer = ref(null)
const pageReady = ref(false)

const gameTabs = [
  { value: '2d3d', label: '2D/3D', class: 'bg-blue-500 shadow-lg' },
  { value: 'soccer', label: 'Football', class: 'bg-green-500 shadow-lg' }
]

const filters = [
  { value: 'all', label: 'allBets', class: 'bg-white/20' },
  { value: 'won', label: 'won', class: 'bg-green-500' },
  { value: 'lost', label: 'lost', class: 'bg-red-500' },
  { value: 'pending', label: 'pending', class: 'bg-yellow-500 text-black' }
]

const allBets = computed(() => activeGameTab.value === '2d3d' ? betHistory.value : soccerBetHistory.value)
const filteredBets = computed(() => activeFilter.value === 'all' ? betHistory.value : betHistory.value.filter(b => b.status === activeFilter.value))
const filteredSoccerBets = computed(() => activeFilter.value === 'all' ? soccerBetHistory.value : soccerBetHistory.value.filter(b => b.status === activeFilter.value))

const totalBetsCount = computed(() => allBets.value.length)
const totalWinAmountCalc = computed(() => allBets.value.filter(b => b.status === 'won').reduce((sum, b) => sum + (b.winAmount || 0), 0))
const netProfitCalc = computed(() => {
  const totalBet = allBets.value.reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0)
  return totalWinAmountCalc.value - totalBet
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''

const loadHistory = async () => {
  if (!isLoggedIn.value) return
  
  initialLoading.value = true
  hasMoreData.value = true
  
  console.log('Loading history for tab:', activeGameTab.value, 'filter:', activeFilter.value)
  
  try {
    // Map frontend filter to API status
    const statusMap = { all: null, won: 'Pay', lost: 'Gain', pending: 'Unfinish' }
    const status = statusMap[activeFilter.value]
    
    if (activeGameTab.value === '2d3d') {
      console.log('Loading 2D/3D bet history')
      await getBetHistory(status ? { status } : {})
    } else {
      console.log('Loading soccer bet history')
      // Try without status first, then with status if needed
      const params = {}
      if (status) {
        params.status = status
      }
      const result = await getSoccerBetHistory(params)
      console.log('Soccer bet history result:', result)
    }
  } catch (error) {
    console.error('Error loading history:', error)
  } finally {
    initialLoading.value = false
  }
}

const loadMoreHistory = async () => {
  if (loadingMore.value || !hasMoreData.value) return
  
  loadingMore.value = true
  
  try {
    const statusMap = { all: null, won: 'Pay', lost: 'Gain', pending: 'Unfinish' }
    const status = statusMap[activeFilter.value]
    
    if (activeGameTab.value === '2d3d') {
      const currentCount = betHistory.value.length
      await loadMoreBetHistory(status ? { status } : {})
      // Check if we got new data
      if (betHistory.value.length === currentCount) {
        hasMoreData.value = false
      }
    } else {
      // For soccer, we don't have pagination yet, so disable more loading
      hasMoreData.value = false
    }
  } catch (error) {
    console.error('Error loading more history:', error)
  } finally {
    loadingMore.value = false
  }
}

const switchTab = async (tab) => {
  if (activeGameTab.value === tab) return
  activeGameTab.value = tab
  await loadHistory()
}

const switchFilter = async (filter) => {
  if (activeFilter.value === filter) return
  activeFilter.value = filter
  await loadHistory()
}

const setupInfiniteScroll = () => {
  if (!infiniteScrollTrigger.value) return
  
  observer.value = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && hasMoreData.value && !loadingMore.value && !initialLoading.value) {
        loadMoreHistory()
      }
    },
    {
      rootMargin: '100px'
    }
  )
  
  observer.value.observe(infiniteScrollTrigger.value)
}

const cleanupInfiniteScroll = () => {
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }
}

onMounted(async () => {
  // Initialize auth first
  await initAuth()
  
  // Check if logged in after auth is initialized
  if (!isLoggedIn.value) {
    await navigateTo('/login')
    return
  }
  
  pageReady.value = true
  await loadHistory()
  await nextTick()
  setupInfiniteScroll()
})

onUnmounted(() => {
  cleanupInfiniteScroll()
})
</script>
