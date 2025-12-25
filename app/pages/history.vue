<template>
  <div class="text-white">
    <!-- Filters -->
    <div class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
        <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
                :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', activeFilter === f.value ? f.class : 'text-white/50']">
          {{ t(f.label) }}
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="px-4 py-2">
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-lg font-black">{{ stats.total }}</p>
          <p class="text-[10px] text-white/40">Total Bets</p>
        </div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-lg font-black text-green-400">{{ formatBalance(stats.won) }}</p>
          <p class="text-[10px] text-white/40">Won</p>
        </div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-lg font-black" :class="stats.profit >= 0 ? 'text-green-400' : 'text-red-400'">{{ stats.profit >= 0 ? '+' : '' }}{{ formatBalance(stats.profit) }}</p>
          <p class="text-[10px] text-white/40">Profit</p>
        </div>
      </div>
    </div>

    <!-- Bets -->
    <div class="px-4 py-3">
      <div class="space-y-3">
        <div v-for="bet in filteredBets" :key="bet.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black shadow-lg', bet.type === '2D' ? 'bg-blue-500 shadow-blue-500/25' : 'bg-purple-500 shadow-purple-500/25']">
              {{ bet.type }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <p class="text-sm font-bold">{{ bet.session }}</p>
                <span :class="['text-[10px] px-1.5 py-0.5 rounded font-bold', getStatusClass(bet.status)]">{{ bet.status.toUpperCase() }}</span>
              </div>
              <p class="text-[10px] text-white/40">{{ bet.date }} • {{ bet.time }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-white/50">{{ formatBalance(bet.betAmount) }}</p>
              <p v-if="bet.status === 'won'" class="text-sm font-black text-green-400">+{{ formatBalance(bet.prizeWon) }}</p>
            </div>
          </div>
          <div class="bg-white/5 rounded-lg p-2.5 flex items-center gap-2">
            <span class="text-[10px] text-white/40">Numbers:</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="n in bet.numbers" :key="n" :class="['px-2 py-0.5 rounded text-xs font-bold', bet.type === '2D' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400']">{{ n }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="!filteredBets.length" class="text-center py-12">
          <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm text-white/40">No bets found</p>
        </div>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="filteredBets.length" class="px-4 py-4">
      <button @click="loadMore" class="w-full bg-white/5 hover:bg-white/10 py-3.5 rounded-xl text-sm font-bold text-white/60 active:scale-[0.98]">
        Load More
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()

const activeFilter = ref('all')
const filters = [
  { value: 'all', label: 'allBets', class: 'bg-blue-500 shadow-lg' },
  { value: 'won', label: 'won', class: 'bg-green-500 shadow-lg' },
  { value: 'lost', label: 'lost', class: 'bg-red-500 shadow-lg' },
  { value: 'pending', label: 'pending', class: 'bg-yellow-500 text-black shadow-lg' }
]

const bets = ref([
  { id: 1, type: '2D', session: 'Morning', date: 'Today', time: '12:00 PM', numbers: ['47', '23', '91'], betAmount: 3000, status: 'won', prizeWon: 85000 },
  { id: 2, type: '3D', session: 'Evening', date: 'Yesterday', time: '6:30 PM', numbers: ['582', '149'], betAmount: 2000, status: 'lost', prizeWon: 0 },
  { id: 3, type: '2D', session: 'Evening', date: 'Yesterday', time: '6:00 PM', numbers: ['15', '68'], betAmount: 1500, status: 'lost', prizeWon: 0 },
  { id: 4, type: '3D', session: 'Evening', date: 'Today', time: '6:30 PM', numbers: ['123'], betAmount: 2000, status: 'pending', prizeWon: 0 }
])

const stats = computed(() => ({
  total: bets.value.length,
  won: bets.value.filter(b => b.status === 'won').reduce((s, b) => s + b.prizeWon, 0),
  profit: bets.value.filter(b => b.status === 'won').reduce((s, b) => s + b.prizeWon, 0) - bets.value.reduce((s, b) => s + b.betAmount, 0)
}))

const filteredBets = computed(() => activeFilter.value === 'all' ? bets.value : bets.value.filter(b => b.status === activeFilter.value))

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const getStatusClass = (s) => s === 'won' ? 'bg-green-500/20 text-green-400' : s === 'lost' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-500'

const loadMore = () => {
  bets.value.push({
    id: bets.value.length + 1,
    type: Math.random() > 0.5 ? '2D' : '3D',
    session: Math.random() > 0.5 ? 'Morning' : 'Evening',
    date: '2 days ago',
    time: '12:00 PM',
    numbers: [Math.floor(Math.random() * 100).toString().padStart(2, '0')],
    betAmount: Math.floor(Math.random() * 3000) + 1000,
    status: Math.random() > 0.7 ? 'won' : 'lost',
    prizeWon: Math.random() > 0.7 ? Math.floor(Math.random() * 50000) + 10000 : 0
  })
}
</script>
