<template>
  <div class="min-h-screen text-white">
    <!-- Filter Tabs -->
    <div class="px-4 py-2">
      <div class="flex gap-2 mb-4">
        <button @click="activeFilter = 'all'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeFilter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          {{ t('allBets') }}
        </button>
        <button @click="activeFilter = 'won'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeFilter === 'won' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          {{ t('won') }}
        </button>
        <button @click="activeFilter = 'lost'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeFilter === 'lost' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          {{ t('lost') }}
        </button>
        <button @click="activeFilter = 'pending'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeFilter === 'pending' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          {{ t('pending') }}
        </button>
      </div>
    </div>

    <!-- Bet History List -->
    <div class="px-4 py-2">
      <div class="space-y-3">
        <div v-for="bet in filteredBets" :key="bet.id" 
             class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <!-- Bet Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                bet.type === '2D' ? 'bg-blue-500' : 
                bet.type === '3D' ? 'bg-purple-500' : 'bg-green-500'
              ]">
                {{ bet.type }}
              </div>
              <div>
                <p class="text-sm font-semibold">{{ bet.session || bet.type }}</p>
                <p class="text-xs opacity-70">{{ formatDate(bet.date) }} - {{ bet.time }}</p>
              </div>
            </div>
            <div :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              bet.status === 'won' ? 'bg-green-500 text-white' :
              bet.status === 'lost' ? 'bg-red-500 text-white' :
              'bg-yellow-500 text-black'
            ]">
              {{ bet.status.toUpperCase() }}
            </div>
          </div>

          <!-- Bet Details -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm opacity-70">{{ t('numbers') }}:</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="number in getNumbers(bet)" :key="number" 
                      :class="[
                        'px-2 py-1 rounded text-xs font-bold',
                        bet.type === '2D' ? 'bg-blue-500/30 text-blue-300' : 
                        bet.type === '3D' ? 'bg-purple-500/30 text-purple-300' : 'bg-green-500/30 text-green-300'
                      ]">
                  {{ number }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm opacity-70">{{ t('betAmount') }}:</span>
              <span class="text-sm font-bold">{{ formatBalance(bet.betAmount) }} {{ t('mmk') }}</span>
            </div>

            <div v-if="bet.status === 'won'" class="flex items-center justify-between">
              <span class="text-sm opacity-70">{{ t('prizeWon') }}:</span>
              <span class="text-sm font-bold text-green-400">+{{ formatBalance(bet.prizeWon) }} {{ t('mmk') }}</span>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredBets.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-white/70 text-sm">{{ t('noBetsFound') }}</p>
          <p class="text-white/50 text-xs mt-1">{{ t('startBettingToSeeHistory') }}</p>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="filteredBets.length > 0" class="px-4 py-4">
      <button @click="loadMore" 
              class="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
        {{ t('loadMoreHistory') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { userBalance } = useAuth()

const activeFilter = ref('all')

// Simplified demo bets data
const bets = ref([
  {
    id: 1,
    type: '2D',
    session: 'Morning Draw',
    date: 'Today',
    time: '12:00 PM',
    numbers: ['47', '23', '91'],
    betAmount: 3000,
    status: 'won',
    prizeWon: 85000
  },
  {
    id: 2,
    type: '3D',
    session: 'Evening Draw',
    date: 'Yesterday',
    time: '6:30 PM',
    numbers: ['582', '149'],
    betAmount: 2000,
    status: 'lost',
    prizeWon: 0
  },
  {
    id: 3,
    type: '2D',
    session: 'Evening Draw',
    date: 'Yesterday',
    time: '6:00 PM',
    numbers: ['15', '68', '32'],
    betAmount: 1500,
    status: 'lost',
    prizeWon: 0
  },
  {
    id: 4,
    type: '3D',
    session: 'Evening Draw',
    date: 'Today',
    time: '6:30 PM',
    numbers: ['123', '456'],
    betAmount: 2000,
    status: 'pending',
    prizeWon: 0
  }
])

const filteredBets = computed(() => {
  if (activeFilter.value === 'all') return bets.value
  return bets.value.filter(bet => bet.status === activeFilter.value)
})

const formatBalance = (balance) => {
  return new Intl.NumberFormat('en-US').format(balance || 0)
}

const formatDate = (dateString) => {
  if (dateString === 'Today') return t('today')
  if (dateString === 'Yesterday') return t('yesterday')
  return dateString
}

const getNumbers = (bet) => {
  return bet.numbers || []
}

const loadMore = () => {
  // Simulate loading more bets
  const newBet = {
    id: bets.value.length + 1,
    type: Math.random() > 0.5 ? '2D' : '3D',
    session: Math.random() > 0.5 ? 'Morning Draw' : 'Evening Draw',
    date: '2 days ago',
    time: Math.random() > 0.5 ? '12:00 PM' : '6:30 PM',
    numbers: [Math.floor(Math.random() * 100).toString().padStart(2, '0')],
    betAmount: Math.floor(Math.random() * 3000) + 1000,
    status: Math.random() > 0.7 ? 'won' : 'lost',
    prizeWon: Math.random() > 0.7 ? Math.floor(Math.random() * 50000) + 10000 : 0
  }
  bets.value.push(newBet)
}
</script>