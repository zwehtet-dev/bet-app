<template>
  <div class="text-white">
    <div class="px-4 py-3">
      <div class="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/20">
        <div class="flex items-center justify-between">
          <div><p class="text-[10px] text-white/50">Maung Betting</p><p class="text-sm font-bold">🏆 Parlay</p><p class="text-[10px] text-white/40">Min 3, Max 10 selections</p></div>
          <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center"><span class="text-2xl">🏆</span></div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="px-4 py-8 text-center"><p class="text-sm text-white/40">Loading matches...</p></div>

    <div v-else-if="!matches.length" class="px-4 py-8 text-center">
      <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3"><span class="text-2xl">🏆</span></div>
      <p class="text-sm text-white/40">No matches available</p>
    </div>

    <div v-else class="px-4 py-2 space-y-3">
      <div v-for="match in matches" :key="match.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">{{ match.league }}</span>
          <span class="text-[10px] text-white/40">{{ formatMatchDate(match.startDate) }}</span>
        </div>
        
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1 text-center">
            <p class="text-sm font-bold">{{ match.homeTeam }}</p>
            <p v-if="match.homeBet" class="text-[10px] text-amber-400">{{ match.homeBet > 0 ? '+' : '' }}{{ match.homeBet }}</p>
          </div>
          <div class="px-4"><span class="text-xs text-white/40">VS</span></div>
          <div class="flex-1 text-center">
            <p class="text-sm font-bold">{{ match.awayTeam }}</p>
            <p v-if="match.awayBet" class="text-[10px] text-amber-400">{{ match.awayBet > 0 ? '+' : '' }}{{ match.awayBet }}</p>
          </div>
        </div>

        <div v-if="match.gp" class="text-center mb-3"><span class="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">GP: {{ match.gp }}</span></div>

        <div class="grid grid-cols-2 gap-2">
          <button @click="toggleSelection(match, 'home')" :class="['py-2.5 rounded-lg text-xs font-bold transition-all', isSelected(match.id, 'home') ? 'bg-orange-500' : 'bg-white/10 hover:bg-white/20']">Home</button>
          <button @click="toggleSelection(match, 'away')" :class="['py-2.5 rounded-lg text-xs font-bold transition-all', isSelected(match.id, 'away') ? 'bg-orange-500' : 'bg-white/10 hover:bg-white/20']">Away</button>
        </div>
      </div>
    </div>

    <div v-if="selectedBets.length" class="px-4 py-4">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-white/50">Selected: {{ selectedBets.length }}/10</span>
          <button @click="selectedBets = []" class="text-[10px] text-red-400">Clear All</button>
        </div>
        <div class="flex flex-wrap gap-1 mb-4">
          <span v-for="bet in selectedBets" :key="bet.matchId" class="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-1 rounded flex items-center gap-1">
            {{ bet.match.homeTeam.slice(0, 3) }} vs {{ bet.match.awayTeam.slice(0, 3) }} ({{ bet.type }})
            <button @click="removeBet(bet.matchId)" class="text-white/60 hover:text-white">×</button>
          </span>
        </div>
        
        <div class="mb-4">
          <label class="block text-xs text-white/50 mb-2">Bet Amount</label>
          <div class="flex gap-2 mb-2"><button v-for="a in [1000, 2000, 5000, 10000]" :key="a" @click="betAmount = a" :class="['flex-1 py-2 rounded-lg text-xs font-bold', betAmount === a ? 'bg-orange-500' : 'bg-white/10']">{{ formatBalance(a) }}</button></div>
          <input v-model.number="betAmount" type="number" min="100" class="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-center border border-white/10 focus:border-orange-500 focus:outline-none">
        </div>

        <div class="flex justify-between text-sm"><span class="text-white/50">Total:</span><span class="font-black text-amber-400">{{ formatBalance(betAmount) }} MMK</span></div>
      </div>
      
      <div v-if="selectedBets.length < 3" class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4 text-center"><p class="text-xs text-yellow-400">Select at least 3 matches for Maung bet</p></div>
      
      <button @click="placeBetHandler" :disabled="!canPlaceBet || bettingLoading" :class="['w-full py-4 rounded-xl text-sm font-bold transition-all active:scale-[0.98]', canPlaceBet && !bettingLoading ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/25' : 'bg-white/10 text-white/30']">{{ bettingLoading ? 'Placing...' : 'Place Maung Bet' }}</button>
    </div>

    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto"><div :class="['p-4 rounded-xl text-center font-medium text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">{{ toast.msg }}</div></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSoccerBetting } from '~/composables/useSoccerBetting'

const { userBalance, isLoggedIn, refreshProfile } = useAuth()
const { matches, loading, bettingLoading, loadMatches, placeMaungBet } = useSoccerBetting()

const selectedBets = ref([])
const betAmount = ref(1000)
const toast = ref(null)

const canPlaceBet = computed(() => selectedBets.value.length >= 3 && selectedBets.value.length <= 10 && betAmount.value >= 100 && betAmount.value <= userBalance.value && isLoggedIn.value)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatMatchDate = (ms) => ms ? new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const isSelected = (matchId, type) => selectedBets.value.some(b => b.matchId === matchId && b.type === type)

const toggleSelection = (match, type) => {
  if (selectedBets.value.length >= 10 && !isSelected(match.id, type)) {
    showToast('Maximum 10 selections allowed', 'error')
    return
  }
  
  const existingIndex = selectedBets.value.findIndex(b => b.matchId === match.id)
  
  if (existingIndex > -1) {
    if (selectedBets.value[existingIndex].type === type) {
      selectedBets.value.splice(existingIndex, 1)
    } else {
      selectedBets.value[existingIndex].type = type
      selectedBets.value[existingIndex].betTeamId = type === 'home' ? match.homeTeamId : match.awayTeamId
    }
  } else {
    selectedBets.value.push({
      matchId: match.id,
      gameId: match.id,
      type,
      betTeamId: type === 'home' ? match.homeTeamId : match.awayTeamId,
      betUnder: false,
      match
    })
  }
}

const removeBet = (matchId) => {
  const index = selectedBets.value.findIndex(b => b.matchId === matchId)
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

onMounted(() => loadMatches('Maung'))
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
