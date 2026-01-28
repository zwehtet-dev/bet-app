<template>
  <div class="text-white">
    <div class="px-4 py-3">
      <div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/20">
        <h2 class="text-lg font-bold mb-1">Bawdi (Body Style)</h2>
        <p class="text-xs text-white/60">Bet on individual matches with custom amounts</p>
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
          <button @click="showToast(`Demo: Bet on ${match.home}`)" class="bg-green-500/20 hover:bg-green-500/30 py-3 rounded-lg text-sm font-bold text-green-400 active:scale-95">
            {{ match.home }}<br><span class="text-xs">{{ match.homeOdds }}</span>
          </button>
          <button @click="showToast(`Demo: Bet on ${match.away}`)" class="bg-blue-500/20 hover:bg-blue-500/30 py-3 rounded-lg text-sm font-bold text-blue-400 active:scale-95">
            {{ match.away }}<br><span class="text-xs">{{ match.awayOdds }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="px-4 py-4">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex justify-between text-sm mb-2"><span class="text-white/50">Selected Bets:</span><span class="font-black text-amber-400">0</span></div>
        <div class="flex justify-between text-sm"><span class="text-white/50">Total Amount:</span><span class="font-black text-green-400">0 MMK</span></div>
      </div>
      <button @click="showToast('Demo: Place Bawdi bet')" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-xl text-sm font-bold shadow-lg shadow-green-500/25 active:scale-[0.98]">Place Bawdi Bet</button>
    </div>

    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto"><div :class="['p-4 rounded-xl text-center font-medium text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">{{ toast.msg }}</div></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  keepalive: true
})

const toast = ref(null)

const demoMatches = [
  { id: 1, home: 'Man United', away: 'Liverpool', league: 'Premier League', time: 'Today 8:00 PM', homeOdds: '1.85', awayOdds: '2.10' },
  { id: 2, home: 'Barcelona', away: 'Real Madrid', league: 'La Liga', time: 'Tomorrow 10:00 PM', homeOdds: '1.95', awayOdds: '2.05' },
  { id: 3, home: 'Bayern', away: 'Dortmund', league: 'Bundesliga', time: 'Jan 29, 9:00 PM', homeOdds: '1.75', awayOdds: '2.25' }
]

const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
