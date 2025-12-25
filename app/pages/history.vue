<template>
  <div class="text-white">
    <!-- Filter Tabs -->
    <section class="px-4 py-3">
      <div class="flex gap-2">
        <button v-for="filter in filters" :key="filter.value" @click="activeFilter = filter.value"
                :class="['flex-1 py-2 rounded-xl text-xs font-semibold transition-colors', 
                         activeFilter === filter.value ? filter.activeClass : 'bg-white/5 text-white/60 hover:bg-white/10']">
          {{ t(filter.label) }}
        </button>
      </div>
    </section>

    <!-- Stats Summary -->
    <section class="px-4 py-2">
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-lg font-bold text-white">{{ stats.totalBets }}</p>
          <p class="text-[10px] text-white/50">{{ t('totalBets') }}</p>
        </div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-lg font-bold text-green-400">{{ formatBalance(stats.totalWon) }}</p>
          <p class="text-[10px] text-white/50">{{ t('totalWon') }}</p>
        </div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-lg font-bold" :class="stats.profit >= 0 ? 'text-green-400' : 'text-red-400'">
            {{ stats.profit >= 0 ? '+' : '' }}{{ formatBalance(stats.profit) }}
          </p>
          <p class="text-[10px] text-white/50">{{ t('profit') }}</p>
        </div>
      </div>
    </section>

    <!-- Bet History List -->
    <section class="px-4 py-2">
      <div class="space-y-2">
        <div v-for="bet in filteredBets" :key="bet.id" class="bg-white/5 rounded-xl p-3 border border-white/5">
          <div class="flex items-center gap-3">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold', getTypeClass(bet.type)]">
              {{ bet.type }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="text-sm font-medium">{{ bet.session }}</p>
                <span :class="['text-[10px] px-1.5 py-0.5 rounded', getStatusClass(bet.status)]">{{ bet.status }}</span>
              </div>
              <p class="text-[10px] text-white/50">{{ formatDate(bet.date) }} • {{ bet.time }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-white/60">{{ formatBalance(bet.betAmount) }} {{ t('mmk') }}</p>
              <p v-if="bet.status === 'won'" class="text-sm font-bold text-green-400">+{{ formatBalance(bet.prizeWon) }}</p>
            </div>
          </div>
          
          <!-- Numbers -->
          <div class="mt-3 pt-3 border-t border-white/5">
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-white/50">{{ t('numbers') }}:</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="num in bet.numbers" :key="num" 
                      :class="['px-2 py-0.5 rounded text-xs font-bold', getTypeClass(bet.type, true)]">
                  {{ num }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredBets.length === 0" class="text-center py-12">
          <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm text-white/50">{{ t('noBetsFound') }}</p>
          <p class="text-xs text-white/30 mt-1">{{ t('startBettingToSeeHistory') }}</p>
        </div>
      </div>
    </section>

    <!-- Load More -->
    <section v-if="filteredBets.length > 0" class="px-4 py-4">
      <button @click="loadMore" class="w-full bg-white/5 hover:bg-white/10 text-white/70 py-3 rounded-xl text-sm font-medium transition-colors">
        {{ t('loadMoreHistory') }}
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()

const activeFilter = ref('all')

const filters = [
  { value: 'all', label: 'allBets', activeClass: 'bg-blue-500 text-white' },
  { value: 'won', label: 'won', activeClass: 'bg-green-500 text-white' },
  { value: 'lost', label: 'lost', activeClass: 'bg-red-500 text-white' },
  { value: 'pending', label: 'pending', activeClass: 'bg-yellow-500 text-black' }
]

const bets = ref([
  { id: 1, type: '2D', session: 'Morning Draw', date: 'Today', time: '12:00 PM', numbers: ['47', '23', '91'], betAmount: 3000, status: 'won', prizeWon: 85000 },
  { id: 2, type: '3D', session: 'Evening Draw', date: 'Yesterday', time: '6:30 PM', numbers: ['582', '149'], betAmount: 2000, status: 'lost', prizeWon: 0 },
  { id: 3, type: '2D', session: 'Evening Draw', date: 'Yesterday', time: '6:00 PM', numbers: ['15', '68', '32'], betAmount: 1500, status: 'lost', prizeWon: 0 },
  { id: 4, type: '3D', session: 'Evening Draw', date: 'Today', time: '6:30 PM', numbers: ['123', '456'], betAmount: 2000, status: 'pending', prizeWon: 0 }
])

const stats = computed(() => {
  const totalBets = bets.value.length
  const totalWon = bets.value.filter(b => b.status === 'won').reduce((sum, b) => sum + b.prizeWon, 0)
  const totalBet = bets.value.reduce((sum, b) => sum + b.betAmount, 0)
  return { totalBets, totalWon, profit: totalWon - totalBet }
})

const filteredBets = computed(() => {
  if (activeFilter.value === 'all') return bets.value
  return bets.value.filter(bet => bet.status === activeFilter.value)
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const formatDate = (d) => {
  if (d === 'Today') return t('today')
  if (d === 'Yesterday') return t('yesterday')
  return d
}

const getTypeClass = (type, light = false) => {
  if (type === '2D') return light ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500'
  if (type === '3D') return light ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500'
  return light ? 'bg-green-500/20 text-green-400' : 'bg-green-500'
}

const getStatusClass = (s) => {
  if (s === 'won') return 'bg-green-500/20 text-green-400'
  if (s === 'lost') return 'bg-red-500/20 text-red-400'
  return 'bg-yellow-500/20 text-yellow-400'
}

const loadMore = () => {
  bets.value.push({
    id: bets.value.length + 1,
    type: Math.random() > 0.5 ? '2D' : '3D',
    session: Math.random() > 0.5 ? 'Morning Draw' : 'Evening Draw',
    date: '2 days ago',
    time: Math.random() > 0.5 ? '12:00 PM' : '6:30 PM',
    numbers: [Math.floor(Math.random() * 100).toString().padStart(2, '0')],
    betAmount: Math.floor(Math.random() * 3000) + 1000,
    status: Math.random() > 0.7 ? 'won' : 'lost',
    prizeWon: Math.random() > 0.7 ? Math.floor(Math.random() * 50000) + 10000 : 0
  })
}
</script>
