<template>
  <div class="text-white">
    <div class="px-4 py-3">
      <div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/20">
        <div class="flex items-center justify-between">
          <div><p class="text-[10px] text-white/50">Body Betting</p><p class="text-sm font-bold">⚽ Football</p><p class="text-[10px] text-white/40">Individual bets</p></div>
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center"><span class="text-2xl">⚽</span></div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="px-4 py-8 text-center"><p class="text-sm text-white/40">Loading matches...</p></div>

    <div v-else-if="!matches.length" class="px-4 py-8 text-center">
      <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3"><span class="text-2xl">⚽</span></div>
      <p class="text-sm text-white/40">No matches available</p>
    </div>

    <div v-else class="px-4 py-2 space-y-3">
      <div v-for="match in matches" :key="match.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">{{ match.league }}</span>
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

        <div class="grid grid-cols-2 gap-2 mb-3">
          <button @click="selectBet(match, 'home')" :class="['py-2.5 rounded-lg text-xs font-bold transition-all', isSelected(match.id, 'home') ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20']">Home</button>
          <button @click="selectBet(match, 'away')" :class="['py-2.5 rounded-lg text-xs font-bold transition-all', isSelected(match.id, 'away') ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20']">Away</button>
        </div>

        <div v-if="getSelectedBet(match.id)" class="flex items-center gap-2">
          <span class="text-[10px] text-white/40">Amount:</span>
          <input v-model.number="getSelectedBet(match.id).amount" type="number" min="100" class="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-center border border-white/10 focus:border-green-500 focus:outline-none">
        </div>
      </div>
    </div>

    <div v-if="selectedBets.length" class="px-4 py-4 pb-6">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex justify-between text-sm mb-2"><span class="text-white/50">Selected:</span><span class="font-bold">{{ selectedBets.length }} bets</span></div>
        <div class="flex justify-between text-sm"><span class="text-white/50">Total:</span><span class="font-black text-amber-400">{{ formatBalance(totalAmount) }} MMK</span></div>
      </div>
      <button @click="placeBetHandler" :disabled="!canPlaceBet || bettingLoading" :class="['w-full py-4 rounded-xl text-sm font-bold transition-all active:scale-[0.98]', canPlaceBet && !bettingLoading ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25' : 'bg-white/10 text-white/30']">{{ bettingLoading ? 'Placing...' : 'Place Body Bet' }}</button>
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
const { matches, loading, bettingLoading, loadMatches, placeBodyBet } = useSoccerBetting()

const selectedBets = ref([])
const toast = ref(null)

const totalAmount = computed(() => selectedBets.value.reduce((sum, bet) => sum + (bet.amount || 0), 0))
const canPlaceBet = computed(() => selectedBets.value.length > 0 && totalAmount.value > 0 && totalAmount.value <= userBalance.value && isLoggedIn.value && selectedBets.value.every(b => b.amount >= 100))

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatMatchDate = (ms) => ms ? new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const isSelected = (matchId, type) => selectedBets.value.some(b => b.matchId === matchId && b.type === type)
const getSelectedBet = (matchId) => selectedBets.value.find(b => b.matchId === matchId)

const selectBet = (match, type) => {
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
    showToast(result.message || 'Body bet placed successfully!', 'success')
    selectedBets.value = []
    await refreshProfile()
  } else {
    showToast(result.error || 'Failed to place bet', 'error')
  }
}

onMounted(() => loadMatches('Body'))
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
