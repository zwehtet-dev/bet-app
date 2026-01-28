<template>
  <div class="text-white">
    <div class="px-4 py-3">
      <div class="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/20">
        <h2 class="text-lg font-bold mb-1">Maung Style</h2>
        <p class="text-xs text-white/60">Parlay betting - Select 3-10 matches with one amount</p>
      </div>
    </div>

    <div class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-white/50">Selected Matches <span class="text-orange-400">({{ selectedCount }})</span></p>
          <p class="text-[10px] text-white/40">Min: 3, Max: 10</p>
        </div>
        <div class="flex flex-wrap gap-1.5 min-h-[32px]">
          <span v-for="s in selected" :key="s" class="bg-orange-500 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">{{ s }}<button @click="removeSelection(s)" class="text-white/60">×</button></span>
          <span v-if="!selected.length" class="text-xs text-white/30">Select matches below</span>
        </div>
      </div>
    </div>

    <div class="px-4 py-3 space-y-3">
      <div v-for="match in demoMatches" :key="match.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ match.home }} vs {{ match.away }}</p>
            <p class="text-[10px] text-white/40">{{ match.league }} • {{ match.time }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button @click="toggleSelection(`${match.home}`)" :class="['py-3 rounded-lg text-sm font-bold active:scale-95', selected.includes(match.home) ? 'bg-orange-500 text-white' : 'bg-green-500/20 text-green-400']">
            {{ match.home }}
          </button>
          <button @click="toggleSelection(`${match.away}`)" :class="['py-3 rounded-lg text-sm font-bold active:scale-95', selected.includes(match.away) ? 'bg-orange-500 text-white' : 'bg-blue-500/20 text-blue-400']">
            {{ match.away }}
          </button>
        </div>
      </div>
    </div>

    <div class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <p class="text-xs text-white/50 mb-3">Bet Amount (for all selections)</p>
        <div class="flex gap-2 mb-3">
          <button v-for="a in [5000, 10000, 20000, 50000]" :key="a" @click="amount = a" :class="['flex-1 py-2 rounded-lg text-xs font-bold active:scale-95', amount === a ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60']">{{ formatBalance(a) }}</button>
        </div>
      </div>
    </div>

    <div class="px-4 py-4">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex justify-between text-sm mb-2"><span class="text-white/50">Total Bet:</span><span class="font-black text-amber-400">{{ formatBalance(amount) }} MMK</span></div>
        <div class="flex justify-between text-sm"><span class="text-white/50">Potential Win:</span><span class="font-black text-green-400">{{ formatBalance(amount * selectedCount * 2) }} MMK</span></div>
      </div>
      <button @click="placeBet" :disabled="!canBet" :class="['w-full py-4 rounded-xl text-sm font-bold active:scale-[0.98]', canBet ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/25' : 'bg-white/10 text-white/30']">{{ betText }}</button>
    </div>

    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto"><div :class="['p-4 rounded-xl text-center font-medium text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">{{ toast.msg }}</div></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  keepalive: true
})

const selected = ref([])
const amount = ref(10000)
const toast = ref(null)

const demoMatches = [
  { id: 1, home: 'Man United', away: 'Liverpool', league: 'Premier League', time: 'Today 8:00 PM' },
  { id: 2, home: 'Barcelona', away: 'Real Madrid', league: 'La Liga', time: 'Tomorrow 10:00 PM' },
  { id: 3, home: 'Bayern', away: 'Dortmund', league: 'Bundesliga', time: 'Jan 29, 9:00 PM' },
  { id: 4, home: 'PSG', away: 'Monaco', league: 'Ligue 1', time: 'Jan 30, 9:00 PM' }
]

const selectedCount = computed(() => selected.value.length)
const canBet = computed(() => selectedCount.value >= 3 && selectedCount.value <= 10)
const betText = computed(() => {
  if (selectedCount.value < 3) return 'Select at least 3 matches'
  if (selectedCount.value > 10) return 'Maximum 10 matches'
  return `Place Maung Bet - ${formatBalance(amount.value)} MMK`
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const toggleSelection = (team) => {
  const idx = selected.value.indexOf(team)
  if (idx > -1) selected.value.splice(idx, 1)
  else if (selectedCount.value < 10) selected.value.push(team)
}
const removeSelection = (team) => {
  const idx = selected.value.indexOf(team)
  if (idx > -1) selected.value.splice(idx, 1)
}
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }
const placeBet = () => {
  if (!canBet.value) return
  showToast(`Demo: Maung bet placed for ${selectedCount.value} matches!`, 'success')
  selected.value = []
}
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
