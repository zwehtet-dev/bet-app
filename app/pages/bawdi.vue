<template>
  <div class="text-white">
    <!-- Game Type Toggle -->
    <section class="px-4 py-3">
      <div class="flex gap-2">
        <button @click="gameType = 'Body'" 
                :class="['flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                         gameType === 'Body' ? 'bg-green-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10']">
          {{ t('bodyStyle') }}
        </button>
        <button @click="gameType = 'Maung'" 
                :class="['flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                         gameType === 'Maung' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10']">
          {{ t('maungStyle') }}
        </button>
      </div>
    </section>

    <!-- Bet Amount (Maung only) -->
    <section v-if="gameType === 'Maung'" class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-3 border border-white/5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-white/60">{{ t('betAmount') }}</p>
          <p class="text-sm font-bold text-amber-400">{{ formatBalance(betAmount) }} {{ t('mmk') }}</p>
        </div>
        <div class="flex gap-2">
          <button v-for="amt in [1000, 2000, 5000, 10000]" :key="amt" @click="betAmount = amt"
                  :class="['flex-1 py-2 rounded-lg text-xs font-medium transition-colors',
                           betAmount === amt ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10']">
            {{ formatBalance(amt) }}
          </button>
        </div>
      </div>
    </section>

    <!-- Matches -->
    <section class="px-4 py-2">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-white/80">{{ t('availableMatches') }}</h2>
        <button @click="loadMatches" class="text-xs text-green-400 hover:text-green-300">{{ t('refresh') }}</button>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
      </div>
      
      <div v-else class="space-y-3">
        <div v-for="match in matches" :key="match.id" class="bg-white/5 rounded-xl p-3 border border-white/5">
          <!-- Match Header -->
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-sm font-medium">{{ match.homeTeam }} vs {{ match.awayTeam }}</p>
              <p class="text-[10px] text-white/50">{{ match.league }} • {{ formatDate(match.matchDate) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-white/50">{{ t('kickoff') }}</p>
              <p class="text-sm font-bold">{{ formatTime(match.matchTime) }}</p>
            </div>
          </div>
          
          <!-- 1X2 Options -->
          <div class="grid grid-cols-3 gap-2 mb-2">
            <button v-for="opt in [
              { id: 'home', label: t('home'), odds: match.homeOdds, color: 'blue' },
              { id: 'draw', label: t('draw'), odds: match.drawOdds, color: 'yellow' },
              { id: 'away', label: t('away'), odds: match.awayOdds, color: 'red' }
            ]" :key="opt.id" @click="selectBet(match, opt, '1x2')"
               :class="['p-2 rounded-lg text-center transition-colors border',
                        isSelected(match.id, opt.id) ? `bg-${opt.color}-500/30 border-${opt.color}-500/50` : 'bg-white/5 border-white/10 hover:bg-white/10']">
              <p class="text-[10px] text-white/60">{{ opt.label }}</p>
              <p class="text-sm font-bold">{{ opt.odds }}</p>
            </button>
          </div>
          
          <!-- Over/Under -->
          <div v-if="match.overUnderOptions?.length" class="grid grid-cols-2 gap-2">
            <button v-for="opt in match.overUnderOptions.slice(0, 2)" :key="opt.id" @click="selectBet(match, opt, 'over_under')"
                    :class="['p-2 rounded-lg text-center transition-colors border',
                             isSelected(match.id, opt.id) ? 'bg-purple-500/30 border-purple-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10']">
              <p class="text-[10px] text-white/60">{{ opt.label }}</p>
              <p class="text-sm font-bold">{{ opt.odds }}</p>
            </button>
          </div>
        </div>
        
        <div v-if="matches.length === 0" class="text-center py-8">
          <p class="text-sm text-white/50">{{ t('noMatchesAvailable') }}</p>
        </div>
      </div>
    </section>

    <!-- Selected Bets -->
    <section v-if="selectedBets.length > 0" class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-3 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs text-white/60">{{ t('selectedBets') }} ({{ selectedBets.length }})</p>
          <button @click="selectedBets = []" class="text-xs text-red-400">{{ t('clearAll') }}</button>
        </div>
        
        <div class="space-y-2 mb-3">
          <div v-for="bet in selectedBets" :key="`${bet.matchId}-${bet.optionId}`" class="bg-white/5 rounded-lg p-2 flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium truncate">{{ bet.homeTeam }} vs {{ bet.awayTeam }}</p>
              <p class="text-[10px] text-white/50">{{ bet.betLabel }} @ {{ bet.odds }}</p>
              <input v-if="gameType === 'Body'" v-model.number="bet.amount" type="number" min="1000" placeholder="Amount"
                     class="mt-1 w-full bg-white/10 text-white rounded px-2 py-1 text-xs border border-white/10">
            </div>
            <button @click="removeBet(bet)" class="text-red-400 hover:text-red-300 ml-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Summary -->
        <div class="border-t border-white/10 pt-3 space-y-1 text-xs">
          <div class="flex justify-between"><span class="text-white/50">{{ t('totalBets') }}:</span><span class="font-bold">{{ selectedBets.length }}</span></div>
          <div class="flex justify-between"><span class="text-white/50">{{ t('totalAmount') }}:</span><span class="font-bold text-amber-400">{{ formatBalance(totalBetAmount) }} {{ t('mmk') }}</span></div>
          <div class="flex justify-between"><span class="text-white/50">{{ t('potentialWin') }}:</span><span class="font-bold text-green-400">{{ formatBalance(potentialWin) }} {{ t('mmk') }}</span></div>
        </div>
      </div>
    </section>

    <!-- Place Bet -->
    <section v-if="selectedBets.length > 0" class="px-4 py-2 pb-6">
      <button @click="placeSoccerBet" :disabled="!canPlaceBet || bettingLoading"
              :class="['w-full py-4 rounded-xl text-sm font-bold transition-all',
                       canPlaceBet && !bettingLoading ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-white/10 text-white/30 cursor-not-allowed']">
        {{ bettingLoading ? 'Placing...' : getBetButtonText }}
      </button>
    </section>

    <!-- Toast -->
    <Teleport to="body">
      <div v-if="toast.show" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto">
        <div :class="['p-4 rounded-xl text-center font-medium text-sm', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">
          {{ toast.message }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { userBalance, isLoggedIn } = useAuth()

const gameType = ref('Body')
const betAmount = ref(2000)
const loading = ref(false)
const bettingLoading = ref(false)
const selectedBets = ref([])
const toast = ref({ show: false, message: '', type: 'success' })

const matches = ref([
  { id: 1, homeTeam: 'Manchester United', awayTeam: 'Liverpool', league: 'Premier League', matchDate: '2024-12-25', matchTime: '20:00', homeOdds: '2.10', drawOdds: '3.20', awayOdds: '2.80', overUnderOptions: [{ id: 'over_2_5', label: 'Over 2.5', odds: '1.85' }, { id: 'under_2_5', label: 'Under 2.5', odds: '1.95' }] },
  { id: 2, homeTeam: 'Barcelona', awayTeam: 'Real Madrid', league: 'La Liga', matchDate: '2024-12-26', matchTime: '22:00', homeOdds: '1.95', drawOdds: '3.40', awayOdds: '3.10', overUnderOptions: [{ id: 'over_2_5_2', label: 'Over 2.5', odds: '1.75' }, { id: 'under_2_5_2', label: 'Under 2.5', odds: '2.05' }] },
  { id: 3, homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', league: 'Bundesliga', matchDate: '2024-12-27', matchTime: '18:30', homeOdds: '1.65', drawOdds: '3.80', awayOdds: '4.20', overUnderOptions: [{ id: 'over_2_5_3', label: 'Over 2.5', odds: '1.90' }, { id: 'under_2_5_3', label: 'Under 2.5', odds: '1.90' }] }
])

const totalBetAmount = computed(() => gameType.value === 'Maung' ? selectedBets.value.length * betAmount.value : selectedBets.value.reduce((sum, b) => sum + (b.amount || 0), 0))
const potentialWin = computed(() => selectedBets.value.reduce((sum, b) => sum + ((gameType.value === 'Maung' ? betAmount.value : (b.amount || 0)) * parseFloat(b.odds)), 0))
const canPlaceBet = computed(() => selectedBets.value.length > 0 && totalBetAmount.value <= userBalance.value && isLoggedIn.value && (gameType.value === 'Maung' || selectedBets.value.every(b => b.amount > 0)))
const getBetButtonText = computed(() => {
  if (!isLoggedIn.value) return t('pleaseLogin')
  if (selectedBets.value.length === 0) return t('selectBets')
  if (totalBetAmount.value > userBalance.value) return t('insufficientBalance')
  return `${t('placeBet')} - ${formatBalance(totalBetAmount.value)} ${t('mmk')}`
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatDate = (d) => { const date = new Date(d); return date.toDateString() === new Date().toDateString() ? t('today') : date.toLocaleDateString() }
const formatTime = (t) => { const [h, m] = t.split(':'); return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}` }
const isSelected = (matchId, optionId) => selectedBets.value.some(b => b.matchId === matchId && b.optionId === optionId)

const selectBet = (match, option, betType) => {
  const idx = selectedBets.value.findIndex(b => b.matchId === match.id && b.optionId === option.id)
  if (idx > -1) { selectedBets.value.splice(idx, 1); return }
  selectedBets.value.push({
    matchId: match.id, homeTeam: match.homeTeam, awayTeam: match.awayTeam,
    optionId: option.id, betLabel: option.label, odds: option.odds, betType,
    amount: gameType.value === 'Body' ? 2000 : betAmount.value
  })
}

const removeBet = (bet) => { selectedBets.value = selectedBets.value.filter(b => !(b.matchId === bet.matchId && b.optionId === bet.optionId)) }
const loadMatches = () => { loading.value = true; setTimeout(() => loading.value = false, 500) }

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

const placeSoccerBet = async () => {
  if (!canPlaceBet.value) return
  bettingLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  showToast(t('betPlacedSuccessfully'), 'success')
  selectedBets.value = []
  bettingLoading.value = false
}

onMounted(loadMatches)
</script>
