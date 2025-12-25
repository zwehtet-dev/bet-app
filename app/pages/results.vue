<template>
  <div class="min-h-screen text-white">

    <!-- Filter Tabs -->
    <div class="px-4 py-3">
      <div class="flex gap-2">
        <button @click="activeTab = 'all'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeTab === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          All Results
        </button>
        <button @click="activeTab = '2d'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeTab === '2d' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          2D Only
        </button>
        <button @click="activeTab = '3d'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  activeTab === '3d' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          3D Only
        </button>
      </div>
    </div>

    <!-- Latest Results -->
    <div class="px-4 py-2">
      <div class="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-black text-sm font-semibold">🎉 Latest Winner</p>
            <p class="text-black text-xs opacity-80">2D Morning - Today 12:00 PM</p>
          </div>
          <div class="text-right">
            <p class="text-black text-3xl font-bold">47</p>
            <p class="text-black text-xs opacity-80">Winning Number</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Results List -->
    <div class="px-4 py-2">
      <h2 class="text-lg font-bold mb-4">Recent Results</h2>
      <div class="space-y-3">
        <div v-for="result in filteredResults" :key="result.id" 
             class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                result.type === '2D' ? 'bg-blue-500' : 'bg-purple-500'
              ]">
                {{ result.type }}
              </div>
              <div>
                <p class="text-sm font-semibold">{{ result.session }}</p>
                <p class="text-xs opacity-70">{{ result.date }} - {{ result.time }}</p>
              </div>
            </div>
            <div class="text-right">
              <p :class="[
                'text-2xl font-bold',
                result.type === '2D' ? 'text-blue-400' : 'text-purple-400'
              ]">
                {{ result.number }}
              </p>
              <p class="text-xs opacity-70">Draw #{{ result.drawNumber }}</p>
            </div>
          </div>
          
          <!-- Additional Info -->
          <div class="flex items-center justify-between text-xs opacity-70 pt-2 border-t border-white/10">
            <span>Total Bets: {{ result.totalBets.toLocaleString() }}</span>
            <span>Winners: {{ result.winners }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div class="px-4 py-4">
      <button @click="loadMore" 
              class="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
        Load More Results
      </button>
    </div>

    <!-- Statistics -->
    <div class="px-4 py-2">
      <h2 class="text-lg font-bold mb-4">Statistics</h2>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-blue-400">{{ stats.total2D }}</p>
          <p class="text-xs opacity-70">2D Draws Today</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-purple-400">{{ stats.total3D }}</p>
          <p class="text-xs opacity-70">3D Draws Today</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-green-400">{{ stats.totalWinners }}</p>
          <p class="text-xs opacity-70">Total Winners</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-yellow-400">{{ stats.totalPayout.toLocaleString() }}</p>
          <p class="text-xs opacity-70">Total Payout (MMK)</p>
        </div>
      </div>
    </div>

    <!-- Hot Numbers -->
    <div class="px-4 py-2 pb-6">
      <h2 class="text-lg font-bold mb-4">Hot Numbers (This Week)</h2>
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div class="mb-3">
          <p class="text-sm font-semibold mb-2">2D Hot Numbers</p>
          <div class="flex flex-wrap gap-2">
            <div v-for="number in hotNumbers2D" :key="number.number" 
                 class="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
              <span class="font-bold">{{ number.number }}</span>
              <span class="text-xs opacity-70 ml-1">({{ number.count }}x)</span>
            </div>
          </div>
        </div>
        <div>
          <p class="text-sm font-semibold mb-2">3D Hot Numbers</p>
          <div class="flex flex-wrap gap-2">
            <div v-for="number in hotNumbers3D" :key="number.number" 
                 class="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm">
              <span class="font-bold">{{ number.number }}</span>
              <span class="text-xs opacity-70 ml-1">({{ number.count }}x)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')

const results = ref([
  {
    id: 1,
    type: '2D',
    session: 'Morning Draw',
    date: 'Today',
    time: '12:00 PM',
    number: '47',
    drawNumber: '2024001',
    totalBets: 125000,
    winners: 23
  },
  {
    id: 2,
    type: '3D',
    session: 'Evening Draw',
    date: 'Yesterday',
    time: '6:30 PM',
    number: '582',
    drawNumber: '2024002',
    totalBets: 89000,
    winners: 5
  },
  {
    id: 3,
    type: '2D',
    session: 'Evening Draw',
    date: 'Yesterday',
    time: '6:00 PM',
    number: '23',
    drawNumber: '2024003',
    totalBets: 156000,
    winners: 31
  },
  {
    id: 4,
    type: '3D',
    session: 'Morning Draw',
    date: 'Yesterday',
    time: '12:30 PM',
    number: '149',
    drawNumber: '2024004',
    totalBets: 67000,
    winners: 8
  },
  {
    id: 5,
    type: '2D',
    session: 'Morning Draw',
    date: '2 days ago',
    time: '12:00 PM',
    number: '91',
    drawNumber: '2024005',
    totalBets: 134000,
    winners: 19
  },
  {
    id: 6,
    type: '3D',
    session: 'Evening Draw',
    date: '2 days ago',
    time: '6:30 PM',
    number: '736',
    drawNumber: '2024006',
    totalBets: 78000,
    winners: 12
  }
])

const stats = ref({
  total2D: 4,
  total3D: 2,
  totalWinners: 98,
  totalPayout: 15750000
})

const hotNumbers2D = ref([
  { number: '47', count: 3 },
  { number: '23', count: 2 },
  { number: '91', count: 2 },
  { number: '15', count: 1 },
  { number: '68', count: 1 }
])

const hotNumbers3D = ref([
  { number: '582', count: 2 },
  { number: '149', count: 1 },
  { number: '736', count: 1 },
  { number: '204', count: 1 }
])

const filteredResults = computed(() => {
  if (activeTab.value === 'all') return results.value
  return results.value.filter(result => result.type === activeTab.value.toUpperCase())
})

const loadMore = () => {
  // Simulate loading more results
  const newResults = [
    {
      id: results.value.length + 1,
      type: Math.random() > 0.5 ? '2D' : '3D',
      session: Math.random() > 0.5 ? 'Morning Draw' : 'Evening Draw',
      date: '3 days ago',
      time: Math.random() > 0.5 ? '12:00 PM' : '6:30 PM',
      number: Math.random() > 0.5 ? 
        Math.floor(Math.random() * 100).toString().padStart(2, '0') :
        Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      drawNumber: `2024${(results.value.length + 1).toString().padStart(3, '0')}`,
      totalBets: Math.floor(Math.random() * 100000) + 50000,
      winners: Math.floor(Math.random() * 30) + 5
    }
  ]
  results.value.push(...newResults)
}
</script>