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
      <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3"><img src="/images/maung_icon.png" alt="Maung" class="w-8 h-8 object-contain" /></div>
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
            <span class="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
              {{ match.leagueGroupName || match.league }}
            </span>
            <span :class="['text-xs px-2 py-1 rounded', getStatusColor(match.status)]">
              {{ getStatusText(match.status) }}
            </span>
          </div>
          <span class="text-[10px] text-white/40">{{ formatMatchDate(match.startDateInMilliSeconds) }}</span>
        </div>
        
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1 text-center">
            <p class="text-sm font-bold">{{ match.homeTeam?.nameInMM || match.homeTeam?.nameInEng || 'Home Team' }}</p>
            <p v-if="match.homeBet" class="text-[10px] text-amber-400">{{ match.homeBet }}</p>
          </div>
          <div class="px-4"><span class="text-xs text-white/40">VS</span></div>
          <div class="flex-1 text-center">
            <p class="text-sm font-bold">{{ match.awayTeam?.nameInMM || match.awayTeam?.nameInEng || 'Away Team' }}</p>
            <p v-if="match.awayBet" class="text-[10px] text-amber-400">{{ match.awayBet }}</p>
          </div>
        </div>

        <!-- Home/Away betting row -->
        <div class="flex items-center gap-2 mb-2">
          <button 
            @click="toggleSelection(match, 'home')" 
            :disabled="!match.betOpen"
            :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors active:scale-95 touch-manipulation border', 
              !match.betOpen ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600' :
              isSelected(match.id, 'home') ? 'bg-orange-500 border-orange-500' : 'bg-white/10 border-white/20']">
            အိမ်ကွင်း
          </button>
          <div class="text-xs text-amber-400 font-bold min-w-[60px] text-center">
            {{ match.homeBet || '0' }}
          </div>
          <button 
            @click="toggleSelection(match, 'away')" 
            :disabled="!match.betOpen"
            :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors active:scale-95 touch-manipulation border',
              !match.betOpen ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600' :
              isSelected(match.id, 'away') ? 'bg-orange-500 border-orange-500' : 'bg-white/10 border-white/20']">
            အဝေးကွင်း
          </button>
        </div>

        <!-- Over/Under betting row -->
        <div class="flex items-center gap-2">
          <button 
            @click="toggleSelection(match, 'over')" 
            :disabled="!match.betOpen"
            :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors active:scale-95 touch-manipulation border', 
              !match.betOpen ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600' :
              isSelected(match.id, 'over') ? 'bg-orange-500 border-orange-500' : 'bg-white/10 border-white/20']">
            ဂိုးပေါ်
          </button>
          <div class="text-xs text-amber-400 font-bold min-w-[60px] text-center">
            {{ match.gp || '0' }}
          </div>
          <button 
            @click="toggleSelection(match, 'under')" 
            :disabled="!match.betOpen"
            :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors active:scale-95 touch-manipulation border',
              !match.betOpen ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600' :
              isSelected(match.id, 'under') ? 'bg-orange-500 border-orange-500' : 'bg-white/10 border-white/20']">
            ဂိုးအောက်
          </button>
        </div>
      </div>

      <!-- Loading More Indicator -->
      <div v-if="loadingMore" class="py-4 flex justify-center">
        <div class="w-6 h-6 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin"></div>
      </div>

      <!-- Infinite Scroll Trigger -->
      <div ref="infiniteScrollTrigger" class="h-4"></div>
    </div>

    <!-- Selected Bets Panel -->
    <div v-if="selectedBets.length" class="px-4 py-4">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-white/50">Selected: {{ selectedBets.length }}/10</span>
          <button @click="selectedBets = []" class="text-[10px] text-red-400 touch-manipulation">Clear All</button>
        </div>
        <div class="flex flex-wrap gap-1 mb-4 max-h-20 overflow-y-auto">
          <span v-for="bet in selectedBets" :key="`${bet.matchId}-${bet.type}`" class="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-1 rounded flex items-center gap-1">
            {{ getTeamName(bet.match.homeTeam).slice(0, 3) }} vs {{ getTeamName(bet.match.awayTeam).slice(0, 3) }} ({{ getBetTypeLabel(bet.type) }})
            <button @click="removeBet(bet.matchId, bet.type)" class="text-white/60 hover:text-white touch-manipulation">×</button>
          </span>
        </div>
        
        <div class="mb-4">
          <label class="block text-xs text-white/50 mb-2">Bet Amount</label>
          <div class="flex gap-2 mb-2">
            <button v-for="a in [1000, 2000, 5000, 10000]" :key="a" @click="betAmount = a" :class="['flex-1 py-2 rounded-lg text-xs font-bold touch-manipulation active:scale-95', betAmount === a ? 'bg-orange-500' : 'bg-white/10']">{{ formatBalance(a) }}</button>
          </div>
          <input v-model.number="betAmount" type="number" min="100" inputmode="numeric" class="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-center border border-white/10 focus:border-orange-500 focus:outline-none">
        </div>

        <div class="flex justify-between text-sm"><span class="text-white/50">Total:</span><span class="font-black text-amber-400">{{ formatBalance(betAmount) }} MMK</span></div>
      </div>
      
      <div v-if="selectedBets.length < 3" class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4 text-center">
        <p class="text-xs text-yellow-400">Select at least 3 matches for Maung bet</p>
      </div>
      
      <button @click="placeBetHandler" :disabled="!canPlaceBet || bettingLoading" :class="['w-full py-4 rounded-xl text-sm font-bold transition-colors active:scale-[0.98] touch-manipulation min-h-[52px]', canPlaceBet && !bettingLoading ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/25' : 'bg-white/10 text-white/30']">
        {{ bettingLoading ? 'Placing...' : 'Place Maung Bet' }}
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

const { matches, loading, loadingMore, bettingLoading, matchesHasMore, loadMatches, loadMoreMatches, placeMaungBet } = useSoccerBetting()

const selectedBets = ref([])
const betAmount = ref(1000)
const toast = ref(null)
const infiniteScrollTrigger = ref(null)
let observer = null

const canPlaceBet = computed(() => 
  selectedBets.value.length >= 3 && 
  selectedBets.value.length <= 10 && 
  betAmount.value >= 100 && 
  betAmount.value <= userBalance.value && 
  isLoggedIn.value
)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatMatchDate = (ms) => ms ? new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const getBetTypeLabel = (type) => {
  switch (type) {
    case 'home': return 'အိမ်'
    case 'away': return 'အဝေး'
    case 'over': return 'ပေါ်'
    case 'under': return 'အောက်'
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

const getTeamName = (team) => {
  if (typeof team === 'string') return team
  if (team && typeof team === 'object') return team.nameInMM || team.nameInEng || 'Team'
  return 'Team'
}

const isSelected = (matchId, type) => selectedBets.value.some(b => b.matchId === matchId && b.type === type)

const toggleSelection = (match, type) => {
  if (!match.betOpen) {
    showToast('Betting is closed for this match', 'error')
    return
  }
  
  if (selectedBets.value.length >= 10 && !isSelected(match.id, type)) {
    showToast('Maximum 10 selections allowed', 'error')
    return
  }
  
  // Determine bet category: 'team' for home/away, 'goal' for over/under
  const isTeamBet = type === 'home' || type === 'away'
  const isGoalBet = type === 'over' || type === 'under'
  
  // Find existing bet of the same category for this match
  const existingIndex = selectedBets.value.findIndex(b => {
    if (b.matchId !== match.id) return false
    const existingIsTeamBet = b.type === 'home' || b.type === 'away'
    const existingIsGoalBet = b.type === 'over' || b.type === 'under'
    return (isTeamBet && existingIsTeamBet) || (isGoalBet && existingIsGoalBet)
  })
  
  if (existingIndex > -1) {
    if (selectedBets.value[existingIndex].type === type) {
      // Same type clicked - remove the bet
      selectedBets.value.splice(existingIndex, 1)
    } else {
      // Different type in same category - update the bet
      selectedBets.value[existingIndex].type = type
      if (isTeamBet) {
        selectedBets.value[existingIndex].betTeamId = type === 'home' ? match.homeTeamId : match.awayTeamId
        selectedBets.value[existingIndex].betUnder = false
      } else {
        selectedBets.value[existingIndex].betTeamId = null
        selectedBets.value[existingIndex].betUnder = type === 'under'
      }
    }
  } else {
    // Add new bet
    selectedBets.value.push({
      matchId: match.id,
      gameId: match.id,
      type,
      betTeamId: isTeamBet ? (type === 'home' ? match.homeTeamId : match.awayTeamId) : null,
      betUnder: isGoalBet ? (type === 'under') : false,
      isOverUnder: isGoalBet,
      match
    })
  }
}

const removeBet = (matchId, type) => {
  const index = selectedBets.value.findIndex(b => b.matchId === matchId && b.type === type)
  if (index > -1) selectedBets.value.splice(index, 1)
}

const placeBetHandler = async () => {
  if (!canPlaceBet.value) return
  
  const betDetails = selectedBets.value.map(bet => ({
    gameId: bet.gameId,
    betTeamId: bet.betTeamId,
    betUnder: bet.betUnder
  }))
  
  const result = await placeMaungBet(betAmount.value, betDetails)
  
  if (result.success) {
    showToast(result.message || 'Maung bet placed successfully!', 'success')
    selectedBets.value = []
    await refreshProfile()
  } else {
    showToast(result.error || 'Failed to place bet', 'error')
  }
}

const refreshMatches = () => loadMatches('Maung', true)

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
  
  await loadMatches('Maung')
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
