<template>
  <div class="min-h-screen text-white">
    <!-- Balance Display -->
    <div class="px-4 py-3">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
        <div>
          <p class="text-xs opacity-70">{{ t('balance') }}</p>
          <p class="text-lg font-bold">{{ formatBalance(userBalance) }} {{ t('mmk') }}</p>
        </div>
        <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Game Info -->
    <div class="px-4 py-2">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold">{{ t('maungBetting') }}</h1>
            <p class="text-sm opacity-70">{{ t('footballBetting') }} - {{ t('maungStyle') }}</p>
          </div>
        </div>
        <div class="bg-white/5 rounded-lg p-3">
          <p class="text-sm text-center opacity-80">
            {{ t('maungDescription') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Bet Amount Selection (Maung style - single amount for all bets) -->
    <div class="px-4 py-2">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm">{{ t('betAmount') }} ({{ t('perSelection') }})</p>
          <p class="text-sm font-bold">{{ formatBalance(betAmount) }} {{ t('mmk') }}</p>
        </div>
        <div class="flex gap-2 mb-3">
          <button v-for="amount in [2000, 5000, 10000, 20000]" :key="amount"
                  @click="setBetAmount(amount)"
                  :class="[
                    'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                    betAmount === amount 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  ]">
            {{ formatBalance(amount) }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button @click="decreaseBet" class="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <input v-model.number="betAmount" type="number" min="1000" step="500"
                 class="flex-1 bg-white/20 text-white rounded-lg px-3 py-2 text-center font-bold">
          <button @click="increaseBet" class="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Available Matches -->
    <div class="px-4 py-2">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">{{ t('availableMatches') }}</h2>
        <button @click="loadMatches" :disabled="loading" class="text-sm text-orange-400 hover:text-orange-300">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('refresh') }}
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p class="text-sm opacity-70 mt-2">{{ t('loadingMatches') }}</p>
      </div>
      
      <!-- Matches List -->
      <div v-else class="space-y-3">
        <div v-for="match in matches" :key="match.id" 
             class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold">{{ match.homeTeam }} vs {{ match.awayTeam }}</p>
                <p class="text-xs opacity-70">{{ match.league }} - {{ formatDate(match.matchDate) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs opacity-70">{{ t('kickoff') }}</p>
              <p class="text-sm font-bold">{{ formatTime(match.matchTime) }}</p>
            </div>
          </div>
          
          <!-- Betting Options -->
          <div class="space-y-3">
            <!-- 1X2 Options -->
            <div>
              <p class="text-xs opacity-70 mb-2">{{ t('matchResult') }}</p>
              <div class="grid grid-cols-3 gap-2">
                <button @click="selectBet(match, { id: 'home', label: t('home'), odds: match.homeOdds }, '1x2')"
                        :class="[
                          'p-3 rounded-lg text-center transition-colors border',
                          selectedBets.some(bet => bet.optionId === 'home' && bet.matchId === match.id) 
                            ? 'bg-blue-500 border-blue-400 text-white' 
                            : 'bg-blue-500/20 border-blue-500/30 text-white hover:bg-blue-500/30'
                        ]">
                  <p class="text-xs opacity-70">{{ t('home') }}</p>
                  <p class="text-sm font-bold">{{ match.homeOdds }}</p>
                </button>
                <button @click="selectBet(match, { id: 'draw', label: t('draw'), odds: match.drawOdds }, '1x2')"
                        :class="[
                          'p-3 rounded-lg text-center transition-colors border',
                          selectedBets.some(bet => bet.optionId === 'draw' && bet.matchId === match.id) 
                            ? 'bg-yellow-500 border-yellow-400 text-black' 
                            : 'bg-yellow-500/20 border-yellow-500/30 text-white hover:bg-yellow-500/30'
                        ]">
                  <p class="text-xs opacity-70">{{ t('draw') }}</p>
                  <p class="text-sm font-bold">{{ match.drawOdds }}</p>
                </button>
                <button @click="selectBet(match, { id: 'away', label: t('away'), odds: match.awayOdds }, '1x2')"
                        :class="[
                          'p-3 rounded-lg text-center transition-colors border',
                          selectedBets.some(bet => bet.optionId === 'away' && bet.matchId === match.id) 
                            ? 'bg-red-500 border-red-400 text-white' 
                            : 'bg-red-500/20 border-red-500/30 text-white hover:bg-red-500/30'
                        ]">
                  <p class="text-xs opacity-70">{{ t('away') }}</p>
                  <p class="text-sm font-bold">{{ match.awayOdds }}</p>
                </button>
              </div>
            </div>

            <!-- Over/Under Options -->
            <div v-if="match.overUnderOptions && match.overUnderOptions.length > 0">
              <p class="text-xs opacity-70 mb-2">{{ t('overUnder') }}</p>
              <div class="grid grid-cols-2 gap-2">
                <button v-for="option in match.overUnderOptions" :key="option.id"
                        @click="selectBet(match, option, 'over_under')"
                        :class="[
                          'p-2 rounded-lg text-center transition-colors border',
                          selectedBets.some(bet => bet.optionId === option.id) 
                            ? 'bg-purple-500 border-purple-400 text-white' 
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        ]">
                  <p class="text-xs">{{ option.label }}</p>
                  <p class="text-sm font-bold">{{ option.odds }}</p>
                </button>
              </div>
            </div>

            <!-- Handicap Options -->
            <div v-if="match.handicapOptions && match.handicapOptions.length > 0">
              <p class="text-xs opacity-70 mb-2">{{ t('handicap') }}</p>
              <div class="grid grid-cols-2 gap-2">
                <button v-for="option in match.handicapOptions" :key="option.id"
                        @click="selectBet(match, option, 'handicap')"
                        :class="[
                          'p-2 rounded-lg text-center transition-colors border',
                          selectedBets.some(bet => bet.optionId === option.id) 
                            ? 'bg-green-500 border-green-400 text-white' 
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        ]">
                  <p class="text-xs">{{ option.label }}</p>
                  <p class="text-sm font-bold">{{ option.odds }}</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Matches State -->
        <div v-if="matches.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-white/70 text-sm">{{ t('noMatchesAvailable') }}</p>
          <p class="text-white/50 text-xs mt-1">{{ t('checkBackLater') }}</p>
        </div>
      </div>
    </div>

    <!-- Selected Bets Summary -->
    <div v-if="selectedBets.length > 0" class="px-4 py-2">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold">{{ t('selectedBets') }}</h3>
          <button @click="clearSelectedBets" class="text-red-400 text-sm">{{ t('clearAll') }}</button>
        </div>
        
        <div class="space-y-2 mb-4">
          <div v-for="bet in selectedBets" :key="`${bet.matchId}-${bet.optionId}`"
               class="bg-white/5 rounded-lg p-3 flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium">{{ bet.homeTeam }} vs {{ bet.awayTeam }}</p>
              <p class="text-xs opacity-70">{{ bet.betLabel }} - {{ bet.odds }}</p>
            </div>
            <button @click="removeBet(bet)" class="text-red-400 hover:text-red-300 ml-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Bet Summary -->
        <div class="border-t border-white/20 pt-3">
          <div class="flex justify-between text-sm mb-2">
            <span>{{ t('totalBets') }}:</span>
            <span class="font-bold">{{ selectedBets.length }}</span>
          </div>
          <div class="flex justify-between text-sm mb-2">
            <span>{{ t('amountPerBet') }}:</span>
            <span class="font-bold">{{ formatBalance(betAmount) }} {{ t('mmk') }}</span>
          </div>
          <div class="flex justify-between text-sm mb-2">
            <span>{{ t('totalAmount') }}:</span>
            <span class="font-bold text-yellow-400">{{ formatBalance(totalBetAmount) }} {{ t('mmk') }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>{{ t('potentialWin') }}:</span>
            <span class="font-bold text-green-400">{{ formatBalance(potentialWin) }} {{ t('mmk') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Place Bet Button -->
    <div v-if="selectedBets.length > 0" class="px-4 pb-6">
      <button @click="placeSoccerBet" 
              :disabled="!canPlaceBet || bettingLoading"
              :class="[
                'w-full py-4 rounded-xl text-lg font-bold transition-all',
                !canPlaceBet || bettingLoading
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
              ]">
        <div v-if="bettingLoading" class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          {{ t('placingBet') }}...
        </div>
        <span v-else>{{ getBetButtonText }}</span>
      </button>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="fixed top-4 left-4 right-4 z-50">
      <div :class="[
        'p-4 rounded-lg text-center font-semibold',
        messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'
import { useSoccerBetting } from '~/composables/useSoccerBetting'

const { t } = useLanguage()
const { userBalance, isLoggedIn } = useAuth()
const { 
  loading, 
  matches, 
  selectedBets, 
  bettingLoading,
  loadMatches: loadSoccerMatches,
  placeSoccerBet: placeSoccerBetAPI,
  clearSelectedBets,
  removeBet
} = useSoccerBetting()

const betAmount = ref(5000) // Maung style - single amount for all bets
const message = ref('')
const messageType = ref('success')

// Enhanced demo matches data for Maung style
const demoMatches = [
  {
    id: 1,
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    league: 'Premier League',
    matchDate: '2024-12-25',
    matchTime: '20:00',
    homeOdds: '2.10',
    drawOdds: '3.20',
    awayOdds: '2.80',
    overUnderOptions: [
      { id: 'over_2_5', label: 'Over 2.5', odds: '1.85', betUnder: '2.5' },
      { id: 'under_2_5', label: 'Under 2.5', odds: '1.95', betUnder: '2.5' },
      { id: 'over_3_5', label: 'Over 3.5', odds: '2.75', betUnder: '3.5' },
      { id: 'under_3_5', label: 'Under 3.5', odds: '1.45', betUnder: '3.5' }
    ],
    handicapOptions: [
      { id: 'home_plus_0_5', label: 'Home +0.5', odds: '1.75', handicap: '+0.5' },
      { id: 'away_minus_0_5', label: 'Away -0.5', odds: '2.05', handicap: '-0.5' },
      { id: 'home_plus_1', label: 'Home +1.0', odds: '1.55', handicap: '+1.0' },
      { id: 'away_minus_1', label: 'Away -1.0', odds: '2.45', handicap: '-1.0' }
    ]
  },
  {
    id: 2,
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    league: 'La Liga',
    matchDate: '2024-12-26',
    matchTime: '22:00',
    homeOdds: '1.95',
    drawOdds: '3.40',
    awayOdds: '3.10',
    overUnderOptions: [
      { id: 'over_2_5_2', label: 'Over 2.5', odds: '1.75', betUnder: '2.5' },
      { id: 'under_2_5_2', label: 'Under 2.5', odds: '2.05', betUnder: '2.5' },
      { id: 'over_1_5_2', label: 'Over 1.5', odds: '1.25', betUnder: '1.5' },
      { id: 'under_1_5_2', label: 'Under 1.5', odds: '3.75', betUnder: '1.5' }
    ],
    handicapOptions: [
      { id: 'home_plus_0_5_2', label: 'Home +0.5', odds: '1.65', handicap: '+0.5' },
      { id: 'away_minus_0_5_2', label: 'Away -0.5', odds: '2.15', handicap: '-0.5' }
    ]
  },
  {
    id: 3,
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    league: 'Bundesliga',
    matchDate: '2024-12-27',
    matchTime: '18:30',
    homeOdds: '1.65',
    drawOdds: '3.80',
    awayOdds: '4.20',
    overUnderOptions: [
      { id: 'over_2_5_3', label: 'Over 2.5', odds: '1.90', betUnder: '2.5' },
      { id: 'under_2_5_3', label: 'Under 2.5', odds: '1.90', betUnder: '2.5' }
    ],
    handicapOptions: [
      { id: 'home_minus_0_5_3', label: 'Home -0.5', odds: '2.30', handicap: '-0.5' },
      { id: 'away_plus_0_5_3', label: 'Away +0.5', odds: '1.60', handicap: '+0.5' }
    ]
  }
]

const formatBalance = (balance) => {
  return new Intl.NumberFormat('en-US').format(balance)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return t('today')
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return t('tomorrow')
  } else {
    return date.toLocaleDateString()
  }
}

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const setBetAmount = (amount) => {
  betAmount.value = amount
}

const increaseBet = () => {
  betAmount.value += 500
}

const decreaseBet = () => {
  if (betAmount.value > 1000) {
    betAmount.value -= 500
  }
}

const selectBet = (match, option, betType) => {
  const betData = {
    matchId: match.id,
    gameId: match.id,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    optionId: option.id,
    betLabel: option.label,
    odds: option.odds,
    betType: betType,
    betUnder: option.betUnder || option.handicap || null,
    betTeamId: getBetTeamId(option.id, match),
    amount: betAmount.value // Maung style uses the global bet amount
  }
  
  // Check if bet already selected
  const existingBetIndex = selectedBets.value.findIndex(
    bet => bet.matchId === match.id && bet.optionId === option.id
  )
  
  if (existingBetIndex > -1) {
    // Remove if already selected
    selectedBets.value.splice(existingBetIndex, 1)
  } else {
    // Add new bet
    selectedBets.value.push(betData)
  }
}

const getBetTeamId = (optionId, match) => {
  switch (optionId) {
    case 'home': return match.id * 10 + 1
    case 'away': return match.id * 10 + 2
    case 'draw': return match.id * 10 + 3
    default: return match.id * 10 + 4 // For over/under and handicap
  }
}

const totalBetAmount = computed(() => {
  return selectedBets.value.length * betAmount.value
})

const potentialWin = computed(() => {
  return selectedBets.value.reduce((sum, bet) => {
    const odds = parseFloat(bet.odds)
    return sum + (betAmount.value * odds)
  }, 0)
})

const canPlaceBet = computed(() => {
  return selectedBets.value.length > 0 && 
         totalBetAmount.value <= userBalance.value && 
         isLoggedIn.value
})

const getBetButtonText = computed(() => {
  if (!isLoggedIn.value) return t('pleaseLogin')
  if (selectedBets.value.length === 0) return t('selectBets')
  if (totalBetAmount.value > userBalance.value) return t('insufficientBalance')
  return `${t('placeBet')} - ${formatBalance(totalBetAmount.value)} ${t('mmk')}`
})

const loadMatches = async () => {
  // For demo, use local data
  matches.value = demoMatches
  
  // In real implementation, this would call the API
  // await loadSoccerMatches('Maung')
}

const placeSoccerBet = async () => {
  if (!canPlaceBet.value) return
  
  try {
    const soccerBetDetails = selectedBets.value.map(bet => ({
      gameId: bet.gameId,
      betTeamId: bet.betTeamId,
      betUnder: bet.betUnder,
      betType: bet.betType
    }))
    
    const betData = {
      gameType: 'Maung',
      amount: betAmount.value,
      soccerBetDetails
    }
    
    // For demo, simulate success
    showMessage(t('betPlacedSuccessfully'), 'success')
    clearSelectedBets()
    
    // In real implementation:
    // const result = await placeSoccerBetAPI(betData)
    // if (result.success) {
    //   showMessage(result.message, 'success')
    //   clearSelectedBets()
    // } else {
    //   showMessage(result.error, 'error')
    // }
  } catch (error) {
    showMessage(t('errorPlacingBet'), 'error')
  }
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(() => {
  loadMatches()
})
</script>