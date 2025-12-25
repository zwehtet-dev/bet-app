<template>
  <div class="text-white">
    <!-- Filter Tabs -->
    <section class="px-4 py-3">
      <div class="flex gap-2">
        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
                :class="['flex-1 py-2 rounded-xl text-xs font-semibold transition-colors',
                         activeTab === tab.value ? tab.activeClass : 'bg-white/5 text-white/60 hover:bg-white/10']">
          {{ tab.label }}
        </button>
      </div>
    </section>

    <!-- Latest Winner -->
    <section class="px-4 py-2">
      <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-black/70 text-xs font-medium">🎉 Latest Winner</p>
            <p class="text-black/60 text-[10px]">2D Morning - Today 12:00 PM</p>
          </div>
          <div class="text-right">
            <p class="text-black text-3xl font-bold">47</p>
            <p class="text-black/60 text-[10px]">Winning Number</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Results List -->
    <section class="px-4 py-2">
      <h2 class="text-sm font-semibold text-white/80 mb-3">Recent Results</h2>
      <div class="space-y-2">
        <div v-for="result in filteredResults" :key="result.id" class="bg-white/5 rounded-xl p-3 border border-white/5">
          <div class="flex items-center gap-3">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold', result.type === '2D' ? 'bg-blue-500' : 'bg-purple-500']">
              {{ result.type }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium">{{ result.session }}</p>
              <p class="text-[10px] text-white/50">{{ result.date }} • {{ result.time }}</p>
            </div>
            <div class="text-right">
              <p :class="['text-xl font-bold', result.type === '2D' ? 'text-blue-400' : 'text-purple-400']">{{ result.number }}</p>
              <p class="text-[10px] text-white/40">#{{ result.drawNumber }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between text-[10px] text-white/40 mt-2 pt-2 border-t border-white/5">
            <span>Bets: {{ result.totalBets.toLocaleString() }}</span>
            <span>Winners: {{ result.winners }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Load More -->
    <section class="px-4 py-3">
      <button @click="loadMore" class="w-full bg-white/5 hover:bg-white/10 text-white/70 py-3 rounded-xl text-sm font-medium transition-colors">
        Load More Results
      </button>
    </section>

    <!-- Statistics -->
    <section class="px-4 py-2">
      <h2 class="text-sm font-semibold text-white/80 mb-3">Statistics</h2>
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-xl font-bold text-blue-400">{{ stats.total2D }}</p>
          <p class="text-[10px] text-white/50">2D Draws Today</p>
        </div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-xl font-bold text-purple-400">{{ stats.total3D }}</p>
          <p class="text-[10px] text-white/50">3D Draws Today</p>
        </div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-xl font-bold text-green-400">{{ stats.totalWinners }}</p>
          <p class="text-[10px] text-white/50">Total Winners</p>
        </div>
        <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p class="text-xl font-bold text-amber-400">{{ stats.totalPayout.toLocaleString() }}</p>
          <p class="text-[10px] text-white/50">Total Payout</p>
        </div>
      </div>
    </section>

    <!-- Hot Numbers -->
    <section class="px-4 py-3 pb-6">
      <h2 class="text-sm font-semibold text-white/80 mb-3">Hot Numbers (This Week)</h2>
      <div class="bg-white/5 rounded-xl p-3 border border-white/5">
        <div class="mb-3">
          <p class="text-xs text-white/60 mb-2">2D Hot Numbers</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="n in hotNumbers2D" :key="n.number" class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">
              {{ n.number }} <span class="text-blue-400/60">({{ n.count }}x)</span>
            </span>
          </div>
        </div>
        <div>
          <p class="text-xs text-white/60 mb-2">3D Hot Numbers</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="n in hotNumbers3D" :key="n.number" class="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-bold">
              {{ n.number }} <span class="text-purple-400/60">({{ n.count }}x)</span>
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
  { value: 'all', label: 'All', activeClass: 'bg-blue-500 text-white' },
  { value: '2d', label: '2D Only', activeClass: 'bg-blue-500 text-white' },
  { value: '3d', label: '3D Only', activeClass: 'bg-purple-500 text-white' }
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
