<template>
  <div class="text-white">
    <div class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
        <button @click="activeTab = '2d3d'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', activeTab === '2d3d' ? 'bg-blue-500 shadow-lg' : 'text-white/50']">2D/3D</button>
        <button @click="activeTab = 'soccer'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', activeTab === 'soccer' ? 'bg-green-500 shadow-lg' : 'text-white/50']">Football</button>
      </div>
    </div>

    <div v-if="activeTab === '2d3d'" class="px-4 py-3 space-y-3">
      <div v-for="bet in demoBets" :key="bet.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center gap-3 mb-3">
          <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shadow-lg overflow-hidden', bet.gameType === '2D' ? 'bg-blue-500 shadow-blue-500/25' : 'bg-purple-500 shadow-purple-500/25']"><img :src="bet.gameType === '2D' ? '/images/2d_icon.png' : '/images/3d_icon.png'" :alt="bet.gameType" class="w-full h-full object-cover rounded-lg" /></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5"><p class="text-sm font-bold">{{ bet.gameType }} Bet</p><span :class="['text-[10px] px-1.5 py-0.5 rounded font-bold', bet.status === 'won' ? 'bg-green-500' : bet.status === 'lost' ? 'bg-red-500' : 'bg-yellow-500 text-black']">{{ bet.status.toUpperCase() }}</span></div>
            <p class="text-[10px] text-white/40">{{ bet.date }}</p>
          </div>
          <div class="text-right"><p class="text-xs text-white/50">{{ formatBalance(bet.amount) }}</p><p v-if="bet.status === 'won'" class="text-sm font-black text-green-400">+{{ formatBalance(bet.winAmount) }}</p></div>
        </div>
        <div class="bg-white/5 rounded-lg p-2.5 flex items-center gap-2">
          <span class="text-[10px] text-white/40">Numbers:</span>
          <div class="flex flex-wrap gap-1">
            <span v-for="n in bet.numbers" :key="n" :class="['px-2 py-0.5 rounded text-xs font-bold', bet.gameType === '2D' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400']">{{ n }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="px-4 py-3 space-y-3">
      <div v-for="bet in demoSoccerBets" :key="bet.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center gap-3">
          <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shadow-lg overflow-hidden', bet.type === 'Maung' ? 'bg-orange-500 shadow-orange-500/25' : 'bg-green-500 shadow-green-500/25']">
            <img :src="bet.type === 'Maung' ? '/images/maung_icon.png' : '/images/bawdi_icon.png'" :alt="bet.type" class="w-full h-full object-cover rounded-lg" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <p class="text-sm font-bold">{{ bet.type }} Bet</p>
              <span :class="['text-[10px] px-1.5 py-0.5 rounded font-bold', bet.status === 'won' ? 'bg-green-500' : bet.status === 'lost' ? 'bg-red-500' : 'bg-yellow-500 text-black']">{{ bet.status.toUpperCase() }}</span>
            </div>
            <p class="text-[10px] text-white/40">{{ bet.date }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold">{{ formatBalance(bet.amount) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  keepalive: true
})

const activeTab = ref('2d3d')

const demoBets = [
  { id: 1, gameType: '2D', status: 'won', amount: 5000, winAmount: 425000, date: 'Jan 27, 12:01 PM', numbers: ['47', '82', '35'] },
  { id: 2, gameType: '3D', status: 'pending', amount: 3000, date: 'Jan 26, 04:30 PM', numbers: ['456', '789'] },
  { id: 3, gameType: '2D', status: 'lost', amount: 2000, date: 'Jan 25, 12:01 PM', numbers: ['12', '34'] }
]

const demoSoccerBets = [
  { id: 1, type: 'Bawdi', status: 'won', amount: 10000, date: 'Jan 27, 03:00 PM' },
  { id: 2, type: 'Maung', status: 'pending', amount: 15000, date: 'Jan 26, 07:00 PM' }
]

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
</script>
