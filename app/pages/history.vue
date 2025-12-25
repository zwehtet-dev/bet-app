<template>
  <div class="min-h-screen text-white">

    <!-- Summary Cards -->
    <div class="px-4 py-3">
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-green-400">{{ summary.totalWins }}</p>
          <p class="text-xs opacity-70">Total Wins</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-red-400">{{ summary.totalLosses }}</p>
          <p class="text-xs opacity-70">Total Losses</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p class="text-lg font-bold text-yellow-400">{{ summary.totalBetAmount.toLocaleString() }}</p>
          <p class="text-xs opacity-70">Total Bet (MMK)</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p :class="[
            'text-lg font-bold',
            summary.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
          ]">
            {{ summary.netProfit >= 0 ? '+' : '' }}{{ summary.netProfit.toLocaleString() }}
          </p>
          <p class="text-xs opacity-70">Net P&L (MMK)</p>
        </div>
      </div>
    </div>

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
          All Bets
        </button>
        <button @click="activeFilter = 'won'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeFilter === 'won' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          Won
        </button>
        <button @click="activeFilter = 'lost'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeFilter === 'lost' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          Lost
        </button>
        <button @click="activeFilter = 'pending'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeFilter === 'pending' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          Pending
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
                bet.type === '2D' ? 'bg-blue-500' : 'bg-purple-500'
              ]">
                {{ bet.type }}
              </div>
              <div>
                <p class="text-sm font-semibold">{{ bet.session }}</p>
                <p class="text-xs opacity-70">{{ bet.date }} - {{ bet.time }}</p>
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
              <span class="text-sm opacity-70">Numbers:</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="number in bet.numbers" :key="number" 
                      :class="[
                        'px-2 py-1 rounded text-xs font-bold',
                        bet.type === '2D' ? 'bg-blue-500/30 text-blue-300' : 'bg-purple-500/30 text-purple-300'
                      ]">
                  {{ number }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm opacity-70">Bet Amount:</span>
              <span class="text-sm font-bold">{{ bet.betAmount.toLocaleString() }} MMK</span>
            </div>

            <div v-if="bet.status === 'won'" class="flex items-center justify-between">
              <span class="text-sm opacity-70">Winning Number:</span>
              <span class="text-sm font-bold text-yellow-400">{{ bet.winningNumber }}</span>
            </div>

            <div v-if="bet.status === 'won'" class="flex items-center justify-between">
              <span class="text-sm opacity-70">Prize Won:</span>
              <span class="text-sm font-bold text-green-400">+{{ bet.prizeWon.toLocaleString() }} MMK</span>
            </div>

            <div v-if="bet.status === 'pending'" class="flex items-center justify-between">
              <span class="text-sm opacity-70">Draw Time:</span>
              <span class="text-sm font-bold text-yellow-400">{{ bet.drawTime }}</span>
            </div>
          </div>

          <!-- Bet Footer -->
          <div class="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs opacity-70">
            <span>Ticket #{{ bet.ticketNumber }}</span>
            <span>{{ bet.drawNumber }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div class="px-4 py-4">
      <button @click="loadMore" 
              class="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
        Load More History
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredBets.length === 0" class="px-4 py-8 text-center">
      <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-white/70 text-sm">No {{ activeFilter === 'all' ? '' : activeFilter }} bets found</p>
      <p class="text-white/50 text-xs mt-1">Start betting to see your history here</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeFilter = ref('all')

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
    winningNumber: '47',
    prizeWon: 85000,
    ticketNumber: 'T2024001234',
    drawNumber: 'D2024001',
    drawTime: null
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
    winningNumber: '736',
    prizeWon: 0,
    ticketNumber: 'T2024001235',
    drawNumber: 'D2024002',
    drawTime: null
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
    winningNumber: '23',
    prizeWon: 0,
    ticketNumber: 'T2024001236',
    drawNumber: 'D2024003',
    drawTime: null
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
    winningNumber: null,
    prizeWon: 0,
    ticketNumber: 'T2024001237',
    drawNumber: 'D2024004',
    drawTime: '6:30 PM'
  },
  {
    id: 5,
    type: '2D',
    session: 'Morning Draw',
    date: '2 days ago',
    time: '12:00 PM',
    numbers: ['77', '88'],
    betAmount: 2000,
    status: 'lost',
    winningNumber: '91',
    prizeWon: 0,
    ticketNumber: 'T2024001238',
    drawNumber: 'D2024005',
    drawTime: null
  }
])

const summary = computed(() => {
  const totalWins = bets.value.filter(bet => bet.status === 'won').length
  const totalLosses = bets.value.filter(bet => bet.status === 'lost').length
  const totalBetAmount = bets.value.reduce((sum, bet) => sum + bet.betAmount, 0)
  const totalWinnings = bets.value.reduce((sum, bet) => sum + bet.prizeWon, 0)
  const netProfit = totalWinnings - totalBetAmount

  return {
    totalWins,
    totalLosses,
    totalBetAmount,
    netProfit
  }
})

const filteredBets = computed(() => {
  if (activeFilter.value === 'all') return bets.value
  return bets.value.filter(bet => bet.status === activeFilter.value)
})

const loadMore = () => {
  // Simulate loading more bet history
  const newBets = [
    {
      id: bets.value.length + 1,
      type: Math.random() > 0.5 ? '2D' : '3D',
      session: Math.random() > 0.5 ? 'Morning Draw' : 'Evening Draw',
      date: '3 days ago',
      time: Math.random() > 0.5 ? '12:00 PM' : '6:30 PM',
      numbers: [
        Math.random() > 0.5 ? 
          Math.floor(Math.random() * 100).toString().padStart(2, '0') :
          Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      ],
      betAmount: Math.floor(Math.random() * 3000) + 1000,
      status: Math.random() > 0.8 ? 'won' : 'lost',
      winningNumber: Math.random() > 0.5 ? 
        Math.floor(Math.random() * 100).toString().padStart(2, '0') :
        Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      prizeWon: Math.random() > 0.8 ? Math.floor(Math.random() * 50000) + 10000 : 0,
      ticketNumber: `T2024${(bets.value.length + 1).toString().padStart(6, '0')}`,
      drawNumber: `D2024${(bets.value.length + 1).toString().padStart(3, '0')}`,
      drawTime: null
    }
  ]
  bets.value.push(...newBets)
}
</script>