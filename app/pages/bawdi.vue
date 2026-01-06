<template>
  <div class="text-white">
    <!-- Loading Skeleton -->
    <div v-if="loading && !matches.length" class="px-4 py-4 space-y-3">
      <div v-for="i in 5" :key="i" class="bg-white/5 rounded-xl p-4 border border-white/5 animate-pulse">
        <div class="flex items-center justify-between mb-3">
          <div class="h-4 w-20 bg-white/10 rounded"></div>
          <div class="h-3 w-16 bg-white/10 rounded"></div>
        </div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1 text-center"><div class="h-4 w-24 bg-white/10 rounded mx-auto"></div></div>
          <div class="px-4"><div class="h-3 w-6 bg-white/10 rounded"></div></div>
          <div class="flex-1 text-center"><div class="h-4 w-24 bg-white/10 rounded mx-auto"></div></div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="h-10 bg-white/10 rounded-lg"></div>
          <div class="h-10 bg-white/10 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && !matches.length" class="px-4 py-8 text-center">
      <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3"><img src="/images/bawdi_icon.png" alt="Bawdi" class="w-8 h-8 object-contain" /></div>
      <p class="text-sm text-white/40">No matches available</p>
      <button @click="refreshMatches" class="mt-4 px-4 py-2 bg-white/10 rounded-xl text-xs font-medium touch-manipulation active:scale-95">
        Refresh
      </button>
    </div>

    <!-- Matches List with Infinite Scroll -->
    <div v-else class="px-4 py-2 space-y-3">
      <div v-for="match in matches" :key="match.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex space-x-3">
            <span class="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
              {{ match.leagueGroupName || match.league }}
            </span>
            <span :class="['text-xs px-2 py-1 rounded', getStatusColor(match.status)]">
              {{ getStatusText(match.status) }}
            </span>
          </div>
          <span class="text-[10px] text-white/40">{{ formatMatchDate(match.startDateInMilliSeconds) }}</span>
        </div>
        
        <!-- Clickable Team Names for Home/Away selection -->
        <div class="flex items-stretch gap-2 mb-4">
          <button 
            @click="selectBet(match, 'home')" 
            :disabled="!match.betOpen"
            :class="['flex-1 flex flex-col items-center justify-center py-3 rounded-lg transition-colors active:scale-95 touch-manipulation border min-h-[60px] relative',
              !match.betOpen ? 'cursor-not-allowed opacity-50' :
              isSelected(match.id, 'home') ? 'bg-green-500/20 border-green-500' : 'border-white/10 hover:bg-white/5']">
            <span v-if="match.homeBet" class="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{{ match.homeBet }}</span>
            <p class="text-sm font-bold text-center leading-tight">{{ match.homeTeam?.nameInMM || match.homeTeam?.nameInEng || 'Home Team' }}</p>
          </button>
          <div class="flex items-center justify-center px-2">
            <span class="text-xs text-white/40">VS</span>
          </div>
          <button 
            @click="selectBet(match, 'away')" 
            :disabled="!match.betOpen"
            :class="['flex-1 flex flex-col items-center justify-center py-3 rounded-lg transition-colors active:scale-95 touch-manipulation border min-h-[60px] relative',
              !match.betOpen ? 'cursor-not-allowed opacity-50' :
              isSelected(match.id, 'away') ? 'bg-green-500/20 border-green-500' : 'border-white/10 hover:bg-white/5']">
            <span v-if="match.awayBet" class="absolute -top-2 -left-2 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{{ match.awayBet }}</span>
            <p class="text-sm font-bold text-center leading-tight">{{ match.awayTeam?.nameInMM || match.awayTeam?.nameInEng || 'Away Team' }}</p>
          </button>
        </div>

        <!-- Over/Under betting row -->
        <div class="flex items-center gap-2 mb-3">
          <button 
            @click="selectBet(match, 'over')" 
            :disabled="!match.betOpen"
            :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors active:scale-95 touch-manipulation border',
              !match.betOpen ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600' :
              isSelected(match.id, 'over') ? 'bg-green-500 border-green-500' : 'bg-white/10 border-white/20']">
            ဂိုးပေါ်
          </button>
          <div class="text-xs text-amber-400 font-bold min-w-[60px] text-center">
            {{ match.gp || '0' }}
          </div>
          <button 
            @click="selectBet(match, 'under')" 
            :disabled="!match.betOpen"
            :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors active:scale-95 touch-manipulation border',
              !match.betOpen ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600' :
              isSelected(match.id, 'under') ? 'bg-green-500 border-green-500' : 'bg-white/10 border-white/20']">
            ဂိုးအောက်
          </button>
        </div>

        <!-- Amount input for selected match -->
        <div v-if="getSelectedBet(match.id).length" class="space-y-2 mt-3">
          <div v-for="bet in getSelectedBet(match.id)" :key="bet.type" class="flex items-center gap-2">
            <span class="text-[10px] text-white/40 min-w-[60px]">{{ getBetTypeLabel(bet.type) }}:</span>
            <input 
              v-model.number="bet.amount" 
              type="number" 
              min="100"
              inputmode="numeric"
              :disabled="!match.betOpen"
              class="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-center border border-white/10 focus:border-green-500 focus:outline-none disabled:bg-gray-600 disabled:text-gray-400">
          </div>
        </div>
      </div>

      <!-- Loading More Indicator -->
      <div v-if="loadingMore" class="py-4 flex justify-center">
        <div class="w-6 h-6 border-2 border-white/20 border-t-green-500 rounded-full animate-spin"></div>
      </div>

      <!-- Infinite Scroll Trigger -->
      <div ref="infiniteScrollTrigger" class="h-4"></div>
    </div>

    <!-- Selected Bets Summary -->
    <div v-if="selectedBets.length" class="px-4 py-4 pb-6">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-white/50">Selected:</span>
          <span class="font-bold">{{ selectedBets.length }} bets</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-white/50">Total:</span>
          <span class="font-black text-amber-400">{{ formatBalance(totalAmount) }} MMK</span>
        </div>
      </div>
      <button @click="placeBetHandler" :disabled="!canPlaceBet || bettingLoading" :class="['w-full py-4 rounded-xl text-sm font-bold transition-colors active:scale-[0.98] touch-manipulation min-h-[52px]', canPlaceBet && !bettingLoading ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25' : 'bg-white/10 text-white/30']">
        {{ bettingLoading ? 'Placing...' : 'Place Bawdi Bet' }}
      </button>
    </div>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto">
          <div :class="['p-4 rounded-xl text-center font-medium text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">{{ toast.msg }}</div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSoccerBetting } from '~/composables/useSoccerBetting'

// Lazy load - define page meta
definePageMeta({
  keepalive: true
})

const { userBalance, isLoggedIn, refreshProfile, initAuth } = useAuth()

const { matches, loading, loadingMore, bettingLoading, matchesHasMore, loadMatches, loadMoreMatches, placeBodyBet } = useSoccerBetting()

const selectedBets = ref([])
const toast = ref(null)
const infiniteScrollTrigger = ref(null)
let observer = null

const totalAmount = computed(() => selectedBets.value.reduce((sum, bet) => sum + (bet.amount || 0), 0))
const canPlaceBet = computed(() => 
  selectedBets.value.length > 0 && 
  totalAmount.value > 0 && 
  totalAmount.value <= userBalance.value && 
  isLoggedIn.value && 
  selectedBets.value.every(b => b.amount >= 100)
)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatMatchDate = (ms) => ms ? new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const getBetTypeLabel = (type) => {
  switch (type) {
    case 'home': return 'အိမ်ကွင်း'
    case 'away': return 'အဝေးကွင်း'
    case 'over': return 'ဂိုးပေါ်'
    case 'under': return 'ဂိုးအောက်'
    default: return type
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'On_Progress': return 'bg-green-500/20 text-green-400'
    case 'Finished': return 'bg-gray-500/20 text-gray-400'
    default: return 'bg-yellow-500/20 text-yellow-400'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'On_Progress': return 'Open'
    case 'Finished': return 'Finished'
    default: return 'Unknown Status'
  }
}

const isSelected = (matchId, type) => selectedBets.value.some(b => b.matchId === matchId && b.type === type)
const getSelectedBet = (matchId) => selectedBets.value.filter(b => b.matchId === matchId)

const selectBet = (match, type) => {
  if (!match.betOpen) {
    showToast('Betting is closed for this match', 'error')
    return
  }
  
  const isTeamBet = type === 'home' || type === 'away'
  const isGoalBet = type === 'over' || type === 'under'
  
  // Find any existing bet for this match (only ONE bet per match allowed)
  const existingIndex = selectedBets.value.findIndex(b => b.matchId === match.id)
  
  // API Logic:
  // - Team bets (home/away): betUnder = false, betTeamId = selected team
  // - Over bet: betUnder = true, betTeamId = homeTeamId
  // - Under bet: betUnder = true, betTeamId = awayTeamId
  const getBetTeamId = () => {
    if (isTeamBet) {
      return type === 'home' ? match.homeTeamId : match.awayTeamId
    }
    // For over/under: over = homeTeamId, under = awayTeamId
    return type === 'over' ? match.homeTeamId : match.awayTeamId
  }
  
  const getBetUnder = () => {
    // betUnder is true for goal bets (over/under), false for team bets
    return isGoalBet
  }
  
  if (existingIndex > -1) {
    if (selectedBets.value[existingIndex].type === type) {
      // Same type clicked - remove the bet
      selectedBets.value.splice(existingIndex, 1)
    } else {
      // Different type - update the bet
      selectedBets.value[existingIndex].type = type
      selectedBets.value[existingIndex].betTeamId = getBetTeamId()
      selectedBets.value[existingIndex].betUnder = getBetUnder()
      selectedBets.value[existingIndex].isOverUnder = isGoalBet
    }
  } else {
    // Add new bet
    selectedBets.value.push({
      matchId: match.id,
      gameId: match.id,
      type,
      betTeamId: getBetTeamId(),
      betUnder: getBetUnder(),
      isOverUnder: isGoalBet,
      amount: 1000,
      match
    })
  }
}

const placeBetHandler = async () => {
  if (!canPlaceBet.value) return
  
  const betDetails = selectedBets.value.map(bet => ({
    gameId: bet.gameId,
    betTeamId: bet.betTeamId,
    betUnder: bet.betUnder,
    amount: bet.amount
  }))
  
  const result = await placeBodyBet(betDetails)
  
  if (result.success) {
    showToast(result.message || 'Bawdi bet placed successfully!', 'success')
    selectedBets.value = []
    await refreshProfile()
  } else {
    showToast(result.error || 'Failed to place bet', 'error')
  }
}

const refreshMatches = () => loadMatches('Body', true)

// Infinite scroll setup with proper cleanup
const setupInfiniteScroll = () => {
  if (!infiniteScrollTrigger.value) return
  
  // Disconnect existing observer if any
  if (observer) {
    observer.disconnect()
  }
  
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && matchesHasMore.value && !loadingMore.value && !loading.value) {
        loadMoreMatches()
      }
    },
    { rootMargin: '100px', threshold: 0.1 }
  )
  
  observer.observe(infiniteScrollTrigger.value)
}

onMounted(async () => {
  // Initialize auth first
  await initAuth()
  
  // Check if logged in after auth is initialized
  if (!isLoggedIn.value) {
    await navigateTo('/login')
    return
  }
  
  await loadMatches('Body')
  await nextTick()
  setupInfiniteScroll()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  // Clear selected bets to free memory
  selectedBets.value = []
})
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
.touch-manipulation { touch-action: manipulation; }
</style>
