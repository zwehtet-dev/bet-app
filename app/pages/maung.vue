<template>
  <div class="text-white">
    <!-- Info Header -->
    <section class="px-4 py-3">
      <div class="relative overflow-hidden bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-2xl p-4 border border-orange-500/30 backdrop-blur-sm">
        <div class="absolute -top-10 -right-10 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"></div>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-xl shadow-orange-500/30">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-base font-black">{{ t('maungBetting') }}</h1>
            <p class="text-xs text-white/60">{{ t('maungDescription') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bet Amount -->
    <section class="px-4 py-2">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs text-white/60 font-medium">{{ t('betAmount') }} <span class="text-white/40">({{ t('perSelection') }})</span></p>
          <p class="text-base font-black text-amber-400">{{ formatBalance(betAmount) }} <span class="text-xs text-white/40">{{ t('mmk') }}</span></p>
        </div>
        <div class="flex gap-2 mb-3">
          <button v-for="amt in [2000, 5000, 10000, 20000]" :key="amt" @click="betAmount = amt"
                  :class="['flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95',
                           betAmount === amt ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white/10 text-white/70 hover:bg-white/15']">
            {{ formatBalance(amt) }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button @click="betAmount = Math.max(1000, betAmount - 500)" 
                  class="w-12 h-12 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl flex items-center justify-center font-black text-lg transition-all active:scale-95">−</button>
          <input v-model.number="betAmount" type="number" min="1000" 
                 class="flex-1 bg-white/10 text-white rounded-xl px-4 py-3 text-center text-sm font-black border border-white/10 focus:border-orange-500 focus:outline-none">
          <button @click="betAmount += 500" 
                  class="w-12 h-12 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl flex items-center justify-center font-black text-lg transition-all active:scale-95">+</button>
        </div>
      </div>
    </section>

    <!-- Matches Header -->
    <section class="px-4 py-2">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold">{{ t('availableMatches') }}</h2>
        <button @click="loadMatches" :disabled="loading" 
                class="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1">
          <svg class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('refresh') }}
        </button>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="px-4 py-12 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-3"></div>
      <p class="text-sm text-white/50">{{ t('loadingMatches') }}</p>
    </div>
    
    <!-- Matches List -->
    <section v-else class="px-4 py-2 space-y-3">
      <div v-for="match in matches" :key="match.id" 
           class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        <!-- Match Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <p class="text-sm font-bold mb-1">{{ match.homeTeam }}</p>
            <p class="text-xs text-white/40">vs</p>
            <p class="text-sm font-bold mt-1">{{ match.awayTeam }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-white/50 mb-1">{{ match.league }}</p>
            <p class="text-xs font-medium text-amber-400">{{ formatDate(match.matchDate) }}</p>
            <p class="text-sm font-bold">{{ formatTime(match.matchTime) }}</p>
          </div>
        </div>
        
        <!-- Match Result (1X2) -->
        <div class="mb-3">
          <p class="text-[10px] text-white/40 mb-2 font-medium">{{ t('matchResult') }}</p>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="opt in [
              { id: 'home', label: '1', sublabel: t('home'), odds: match.homeOdds },
              { id: 'draw', label: 'X', sublabel: t('draw'), odds: match.drawOdds },
              { id: 'away', label: '2', sublabel: t('away'), odds: match.awayOdds }
            ]" :key="opt.id" @click="selectBet(match, opt, '1x2')"
               :class="['p-3 rounded-xl text-center transition-all border active:scale-95',
                        isSelected(match.id, opt.id) 
                          ? 'bg-orange-500/30 border-orange-500/50 shadow-lg shadow-orange-500/20' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10']">
              <p class="text-lg font-black">{{ opt.label }}</p>
              <p class="text-[10px] text-white/50">{{ opt.sublabel }}</p>
              <p class="text-sm font-bold text-amber-400 mt-1">{{ opt.odds }}</p>
            </button>
          </div>
        </div>
        
        <!-- Over/Under -->
        <div v-if="match.overUnderOptions?.length" class="mb-3">
          <p class="text-[10px] text-white/40 mb-2 font-medium">{{ t('overUnder') }}</p>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="opt in match.overUnderOptions.slice(0, 2)" :key="opt.id" 
                    @click="selectBet(match, opt, 'over_under')"
                    :class="['p-2.5 rounded-xl text-center transition-all border active:scale-95',
                             isSelected(match.id, opt.id) 
                               ? 'bg-purple-500/30 border-purple-500/50' 
                               : 'bg-white/5 border-white/10 hover:bg-white/10']">
              <p class="text-xs font-medium text-white/70">{{ opt.label }}</p>
              <p class="text-sm font-bold text-amber-400">{{ opt.odds }}</p>
            </button>
          </div>
        </div>
        
        <!-- Handicap -->
        <div v-if="match.handicapOptions?.length">
          <p class="text-[10px] text-white/40 mb-2 font-medium">{{ t('handicap') }}</p>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="opt in match.handicapOptions.slice(0, 2)" :key="opt.id" 
                    @click="selectBet(match, opt, 'handicap')"
                    :class="['p-2.5 rounded-xl text-center transition-all border active:scale-95',
                             isSelected(match.id, opt.id) 
                               ? 'bg-green-500/30 border-green-500/50' 
                               : 'bg-white/5 border-white/10 hover:bg-white/10']">
              <p class="text-xs font-medium text-white/70">{{ opt.label }}</p>
              <p class="text-sm font-bold text-amber-400">{{ opt.odds }}</p>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="matches.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">🏆</span>
        </div>
        <p class="text-sm text-white/50 font-medium">{{ t('noMatchesAvailable') }}</p>
        <p class="text-xs text-white/30 mt-1">{{ t('checkBackLater') }}</p>
      </div>
    </section>

    <!-- Bet Slip (Fixed Bottom) -->
    <Transition name="slide">
      <section v-if="selectedBets.length > 0" class="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-20">
        <div class="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs text-white/60 font-medium">{{ t('selectedBets') }} <span class="text-orange-400">({{ selectedBets.length }})</span></p>
            <button @click="selectedBets = []" class="text-xs text-red-400 font-medium">{{ t('clearAll') }}</button>
          </div>
          
          <!-- Bet Items -->
          <div class="max-h-32 overflow-y-auto space-y-2 mb-3">
            <div v-for="bet in selectedBets" :key="`${bet.matchId}-${bet.optionId}`" 
                 class="bg-white/5 rounded-xl p-2.5 flex items-center justify-between">
              <div class="flex-1 min-w-0 mr-2">
                <p class="text-xs font-medium truncate">{{ bet.homeTeam }} vs {{ bet.awayTeam }}</p>
                <p class="text-[10px] text-white/50">{{ bet.betLabel }} @ <span class="text-amber-400 font-bold">{{ bet.odds }}</span></p>
              </div>
              <button @click="removeBet(bet)" class="text-red-400 hover:text-red-300 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Summary -->
          <div class="flex items-center justify-between text-xs mb-3 py-2 border-t border-white/10">
            <div>
              <span class="text-white/50">{{ selectedBets.length }} × {{ formatBalance(betAmount) }} =</span>
              <span class="font-black text-amber-400 ml-1">{{ formatBalance(totalBetAmount) }}</span>
            </div>
            <div>
              <span class="text-white/50">Win:</span>
              <span class="font-black text-green-400 ml-1">{{ formatBalance(potentialWin) }}</span>
            </div>
          </div>
          
          <!-- Place Bet Button -->
          <button @click="placeSoccerBet" :disabled="!canPlaceBet || bettingLoading"
                  :class="['w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98]',
                           canPlaceBet && !bettingLoading 
                             ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' 
                             : 'bg-white/10 text-white/30 cursor-not-allowed']">
            {{ bettingLoading ? 'Placing...' : getBetButtonText }}
          </button>
        </div>
      </section>
    </Transition>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto">
          <div :class="['p-4 rounded-2xl text-center font-semibold text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">
            {{ toast.message }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { userBalance, isLoggedIn } = useAuth()

const betAmount = ref(5000)
const loading = ref(false)
const bettingLoading = ref(false)
const selectedBets = ref([])
const toast = ref({ show: false, message: '', type: 'success' })

const matches = ref([
  { id: 1, homeTeam: 'Manchester United', awayTeam: 'Liverpool', league: 'Premier League', matchDate: '2024-12-25', matchTime: '20:00', homeOdds: '2.10', drawOdds: '3.20', awayOdds: '2.80', overUnderOptions: [{ id: 'over_2_5', label: 'Over 2.5', odds: '1.85' }, { id: 'under_2_5', label: 'Under 2.5', odds: '1.95' }], handicapOptions: [{ id: 'home_plus_0_5', label: 'Home +0.5', odds: '1.75' }, { id: 'away_minus_0_5', label: 'Away -0.5', odds: '2.05' }] },
  { id: 2, homeTeam: 'Barcelona', awayTeam: 'Real Madrid', league: 'La Liga', matchDate: '2024-12-26', matchTime: '22:00', homeOdds: '1.95', drawOdds: '3.40', awayOdds: '3.10', overUnderOptions: [{ id: 'over_2_5_2', label: 'Over 2.5', odds: '1.75' }, { id: 'under_2_5_2', label: 'Under 2.5', odds: '2.05' }], handicapOptions: [{ id: 'home_plus_0_5_2', label: 'Home +0.5', odds: '1.65' }, { id: 'away_minus_0_5_2', label: 'Away -0.5', odds: '2.15' }] },
  { id: 3, homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', league: 'Bundesliga', matchDate: '2024-12-27', matchTime: '18:30', homeOdds: '1.65', drawOdds: '3.80', awayOdds: '4.20', overUnderOptions: [{ id: 'over_2_5_3', label: 'Over 2.5', odds: '1.90' }, { id: 'under_2_5_3', label: 'Under 2.5', odds: '1.90' }], handicapOptions: [{ id: 'home_minus_0_5_3', label: 'Home -0.5', odds: '2.30' }, { id: 'away_plus_0_5_3', label: 'Away +0.5', odds: '1.60' }] }
])

const totalBetAmount = computed(() => selectedBets.value.length * betAmount.value)
const potentialWin = computed(() => selectedBets.value.reduce((sum, b) => sum + (betAmount.value * parseFloat(b.odds)), 0))
const canPlaceBet = computed(() => selectedBets.value.length > 0 && totalBetAmount.value <= userBalance.value && isLoggedIn.value)

const getBetButtonText = computed(() => {
  if (!isLoggedIn.value) return t('pleaseLogin')
  if (selectedBets.value.length === 0) return t('selectBets')
  if (totalBetAmount.value > userBalance.value) return t('insufficientBalance')
  return `${t('placeBet')} - ${formatBalance(totalBetAmount.value)} ${t('mmk')}`
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatDate = (d) => new Date(d).toDateString() === new Date().toDateString() ? t('today') : new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const formatTime = (t) => { const [h, m] = t.split(':'); return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}` }
const isSelected = (matchId, optionId) => selectedBets.value.some(b => b.matchId === matchId && b.optionId === optionId)

const selectBet = (match, option, betType) => {
  const idx = selectedBets.value.findIndex(b => b.matchId === match.id && b.optionId === option.id)
  if (idx > -1) { selectedBets.value.splice(idx, 1); return }
  selectedBets.value.push({
    matchId: match.id, homeTeam: match.homeTeam, awayTeam: match.awayTeam,
    optionId: option.id, betLabel: option.sublabel || option.label, odds: option.odds, betType,
    amount: betAmount.value
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

<style>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-20px); }
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(100%); }
</style>
