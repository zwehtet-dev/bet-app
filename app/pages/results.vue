<template>
  <div class="text-white">
    <!-- Filter Tabs -->
    <section class="px-4 py-3">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10">
        <div class="flex gap-1">
          <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
                  :class="['flex-1 py-2.5 rounded-xl text-xs font-bold transition-all',
                           activeTab === tab.value ? tab.activeClass : 'text-white/60 hover:text-white']">
            {{ tab.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Latest Winner Banner -->
    <section class="px-4 py-2">
      <div class="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div class="relative flex items-center justify-between">
          <div>
            <p class="text-black/70 text-xs font-bold mb-1">🎉 Latest Winner</p>
            <p class="text-black/60 text-[10px]">2D Morning Draw</p>
            <p class="text-black/60 text-[10px]">Today 12:00 PM</p>
          </div>
          <div class="text-right">
            <p class="text-black text-4xl font-black">47</p>
            <p class="text-black/60 text-[10px]">Winning Number</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Results List -->
    <section class="px-4 py-3">
      <h2 class="text-sm font-bold mb-3">Recent Results</h2>
      <div class="space-y-2">
        <div v-for="result in filteredResults" :key="result.id" 
             class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div class="flex items-center gap-4">
            <div :class="['w-14 h-14 rounded-xl flex items-center justify-center text-sm font-black shadow-lg', 
                          result.type === '2D' ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30' : 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30']">
              {{ result.type }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold">{{ result.session }}</p>
              <p class="text-[10px] text-white/50">{{ result.date }} • {{ result.time }}</p>
              <div class="flex items-center gap-3 mt-1 text-[10px] text-white/40">
                <span>Bets: {{ result.totalBets.toLocaleString() }}</span>
                <span>Winners: {{ result.winners }}</span>
              </div>
            </div>
            <div class="text-right">
              <p :class="['text-3xl font-black', result.type === '2D' ? 'text-blue-400' : 'text-purple-400']">
                {{ result.number }}
              </p>
              <p class="text-[10px] text-white/40">#{{ result.drawNumber }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Load More -->
    <section class="px-4 py-3">
      <button @click="loadMore" 
              class="w-full bg-white/10 hover:bg-white/15 text-white/70 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98]">
        Load More Results
      </button>
    </section>

    <!-- Statistics -->
    <section class="px-4 py-3">
      <h2 class="text-sm font-bold mb-3">Today's Statistics</h2>
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
          <p class="text-2xl font-black text-blue-400">{{ stats.total2D }}</p>
          <p class="text-[10px] text-white/50">2D Draws</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
          <p class="text-2xl font-black text-purple-400">{{ stats.total3D }}</p>
          <p class="text-[10px] text-white/50">3D Draws</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
          <p class="text-2xl font-black text-green-400">{{ stats.totalWinners }}</p>
          <p class="text-[10px] text-white/50">Total Winners</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
          <p class="text-2xl font-black text-amber-400">{{ formatNumber(stats.totalPayout) }}</p>
          <p class="text-[10px] text-white/50">Total Payout</p>
        </div>
      </div>
    </section>

    <!-- Hot Numbers -->
    <section class="px-4 py-3 pb-6">
      <h2 class="text-sm font-bold mb-3">🔥 Hot Numbers (This Week)</h2>
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        <!-- 2D Hot Numbers -->
        <div class="mb-4">
          <p class="text-xs text-white/60 mb-2 font-medium">2D Hot Numbers</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="n in hotNumbers2D" :key="n.number" 
                  class="bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-black border border-blue-500/30">
              {{ n.number }} <span class="text-blue-400/60 font-medium">({{ n.count }}×)</span>
            </span>
          </div>
        </div>
        
        <!-- 3D Hot Numbers -->
        <div>
          <p class="text-xs text-white/60 mb-2 font-medium">3D Hot Numbers</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="n in hotNumbers3D" :key="n.number" 
                  class="bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-black border border-purple-500/30">
              {{ n.number }} <span class="text-purple-400/60 font-medium">({{ n.count }}×)</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')

const tabs = [
  { value: 'all', label: 'All', activeClass: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' },
  { value: '2d', label: '2D Only', activeClass: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' },
  { value: '3d', label: '3D Only', activeClass: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' }
]

const results = ref([
  { id: 1, type: '2D', session: 'Morning Draw', date: 'Today', time: '12:00 PM', number: '47', drawNumber: '2024001', totalBets: 125000, winners: 23 },
  { id: 2, type: '3D', session: 'Evening Draw', date: 'Yesterday', time: '6:30 PM', number: '582', drawNumber: '2024002', totalBets: 89000, winners: 5 },
  { id: 3, type: '2D', session: 'Evening Draw', date: 'Yesterday', time: '6:00 PM', number: '23', drawNumber: '2024003', totalBets: 156000, winners: 31 },
  { id: 4, type: '3D', session: 'Morning Draw', date: 'Yesterday', time: '12:30 PM', number: '149', drawNumber: '2024004', totalBets: 67000, winners: 8 },
  { id: 5, type: '2D', session: 'Morning Draw', date: '2 days ago', time: '12:00 PM', number: '91', drawNumber: '2024005', totalBets: 134000, winners: 19 }
])

const stats = ref({ total2D: 4, total3D: 2, totalWinners: 98, totalPayout: 15750000 })
const hotNumbers2D = ref([{ number: '47', count: 3 }, { number: '23', count: 2 }, { number: '91', count: 2 }, { number: '15', count: 1 }])
const hotNumbers3D = ref([{ number: '582', count: 2 }, { number: '149', count: 1 }, { number: '736', count: 1 }])

const filteredResults = computed(() => {
  if (activeTab.value === 'all') return results.value
  return results.value.filter(r => r.type === activeTab.value.toUpperCase())
})

const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return n.toLocaleString()
}

const loadMore = () => {
  results.value.push({
    id: results.value.length + 1,
    type: Math.random() > 0.5 ? '2D' : '3D',
    session: Math.random() > 0.5 ? 'Morning Draw' : 'Evening Draw',
    date: '3 days ago',
    time: Math.random() > 0.5 ? '12:00 PM' : '6:30 PM',
    number: Math.random() > 0.5 ? Math.floor(Math.random() * 100).toString().padStart(2, '0') : Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
    drawNumber: `2024${(results.value.length + 1).toString().padStart(3, '0')}`,
    totalBets: Math.floor(Math.random() * 100000) + 50000,
    winners: Math.floor(Math.random() * 30) + 5
  })
}
</script>
