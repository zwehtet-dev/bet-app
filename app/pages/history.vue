<template>
  <div class="text-white">
    <!-- Not Logged In -->
    <div v-if="!isLoggedIn" class="px-4 py-12 text-center">
      <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p class="text-sm text-white/50 mb-4">Please login to view your bet history</p>
      <NuxtLink to="/" class="inline-block bg-amber-500 px-6 py-2.5 rounded-xl text-sm font-bold">Go to Login</NuxtLink>
    </div>

    <template v-else>
      <!-- Game Type Tabs -->
      <div class="px-4 py-3">
        <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
          <button v-for="tab in gameTabs" :key="tab.value" @click="activeGameTab = tab.value; loadHistory()" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', activeGameTab === tab.value ? tab.class : 'text-white/50']">{{ tab.label }}</button>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="px-4 py-2">
        <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
          <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value; loadHistory()" :class="['flex-1 py-2 rounded-lg text-[10px] font-bold transition-all', activeFilter === f.value ? f.class : 'text-white/50']">{{ t(f.label) }}</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="px-4 py-2">
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-lg font-black">{{ totalBetsCount }}</p><p class="text-[10px] text-white/40">Total Bets</p></div>
          <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-lg font-black text-green-400">{{ formatBalance(totalWinAmountCalc) }}</p><p class="text-[10px] text-white/40">Won</p></div>
          <div class="bg-white/5 rounded-xl p-3 text-center border border-white/5"><p class="text-lg font-black" :class="netProfitCalc >= 0 ? 'text-green-400' : 'text-red-400'">{{ netProfitCalc >= 0 ? '+' : '' }}{{ formatBalance(netProfitCalc) }}</p><p class="text-[10px] text-white/40">Profit</p></div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading && !allBets.length" class="px-4 py-12 text-center"><p class="text-sm text-white/40">Loading...</p></div>

      <!-- 2D/3D Bets -->
      <div v-else-if="activeGameTab === '2d3d'" class="px-4 py-3 space-y-3">
        <div v-for="bet in filteredBets" :key="bet.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black shadow-lg', bet.gameType === '2D' ? 'bg-blue-500 shadow-blue-500/25' : 'bg-purple-500 shadow-purple-500/25']">{{ bet.gameType }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5"><p class="text-sm font-bold">{{ bet.gameType }} Bet</p><span :class="['text-[10px] px-1.5 py-0.5 rounded font-bold', getBetStatusBg(bet.status)]">{{ bet.status.toUpperCase() }}</span></div>
              <p class="text-[10px] text-white/40">{{ formatDate(bet.createdAt) }}</p>
            </div>
            <div class="text-right"><p class="text-xs text-white/50">{{ formatBalance(bet.totalAmount) }}</p><p v-if="bet.status === 'won'" class="text-sm font-black text-green-400">+{{ formatBalance(bet.winAmount) }}</p></div>
          </div>
          <div class="bg-white/5 rounded-lg p-2.5 flex items-center gap-2">
            <span class="text-[10px] text-white/40">Numbers:</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="d in bet.betDetails" :key="d.id" :class="['px-2 py-0.5 rounded text-xs font-bold', d.isWin ? 'bg-green-500/30 text-green-400' : bet.gameType === '2D' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400']">{{ d.digit }} ({{ formatBalance(d.amount) }})</span>
            </div>
          </div>
        </div>
        <div v-if="!filteredBets.length && !loading" class="text-center py-12">
          <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3"><svg class="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <p class="text-sm text-white/40">No bets found</p>
        </div>
      </div>

      <!-- Soccer Bets -->
      <div v-else class="px-4 py-3 space-y-3">
        <div v-for="bet in filteredSoccerBets" :key="bet.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-lg', bet.gameType === 'Maung' ? 'bg-orange-500 shadow-orange-500/25' : 'bg-green-500 shadow-green-500/25']">{{ bet.gameType === 'Maung' ? '🏆' : '⚽' }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5"><p class="text-sm font-bold">{{ bet.gameType }} Bet</p><span :class="['text-[10px] px-1.5 py-0.5 rounded font-bold', getBetStatusBg(bet.status)]">{{ bet.status.toUpperCase() }}</span></div>
              <p class="text-[10px] text-white/40">{{ formatDate(bet.createdAt) }}</p>
            </div>
            <div class="text-right"><p class="text-xs text-white/50">{{ formatBalance(bet.amount || bet.totalAmount) }}</p><p v-if="bet.status === 'won'" class="text-sm font-black text-green-400">+{{ formatBalance(bet.winAmount) }}</p></div>
          </div>
          <div v-if="bet.soccerBetDetails && bet.soccerBetDetails.length" class="bg-white/5 rounded-lg p-2.5">
            <span class="text-[10px] text-white/40">Selections: {{ bet.soccerBetDetails.length }}</span>
          </div>
        </div>
        <div v-if="!filteredSoccerBets.length && !loading" class="text-center py-12">
          <div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3"><span class="text-2xl">⚽</span></div>
          <p class="text-sm text-white/40">No soccer bets found</p>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="allBets.length" class="px-4 py-4">
        <button @click="loadMoreHistory" :disabled="loading" class="w-full bg-white/5 hover:bg-white/10 py-3.5 rounded-xl text-sm font-bold text-white/60 active:scale-[0.98] disabled:opacity-50">{{ loading ? 'Loading...' : 'Load More' }}</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useBetting } from '~/composables/useBetting'
import { useSoccerBetting } from '~/composables/useSoccerBetting'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { isLoggedIn } = useAuth()
const { betHistory, bettingLoading, getBetHistory, loadMoreBetHistory, getBetStatusBg } = useBetting()
const { soccerBetHistory, loading: soccerLoading, getSoccerBetHistory } = useSoccerBetting()

const activeGameTab = ref('2d3d')
const activeFilter = ref('all')
const loading = computed(() => bettingLoading.value || soccerLoading.value)

const gameTabs = [
  { value: '2d3d', label: '2D/3D', class: 'bg-blue-500 shadow-lg' },
  { value: 'soccer', label: 'Football', class: 'bg-green-500 shadow-lg' }
]

const filters = [
  { value: 'all', label: 'allBets', class: 'bg-white/20' },
  { value: 'won', label: 'won', class: 'bg-green-500' },
  { value: 'lost', label: 'lost', class: 'bg-red-500' },
  { value: 'pending', label: 'pending', class: 'bg-yellow-500 text-black' }
]

const allBets = computed(() => activeGameTab.value === '2d3d' ? betHistory.value : soccerBetHistory.value)
const filteredBets = computed(() => activeFilter.value === 'all' ? betHistory.value : betHistory.value.filter(b => b.status === activeFilter.value))
const filteredSoccerBets = computed(() => activeFilter.value === 'all' ? soccerBetHistory.value : soccerBetHistory.value.filter(b => b.status === activeFilter.value))

const totalBetsCount = computed(() => allBets.value.length)
const totalWinAmountCalc = computed(() => allBets.value.filter(b => b.status === 'won').reduce((sum, b) => sum + (b.winAmount || 0), 0))
const netProfitCalc = computed(() => {
  const totalBet = allBets.value.reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0)
  return totalWinAmountCalc.value - totalBet
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''

const loadHistory = async () => {
  if (!isLoggedIn.value) return
  
  // Map frontend filter to API status
  const statusMap = { all: null, won: 'Pay', lost: 'Gain', pending: 'Unfinish' }
  const status = statusMap[activeFilter.value]
  
  if (activeGameTab.value === '2d3d') {
    await getBetHistory(status ? { status } : {})
  } else {
    await getSoccerBetHistory(status ? { status } : {})
  }
}

const loadMoreHistory = async () => {
  const statusMap = { all: null, won: 'Pay', lost: 'Gain', pending: 'Unfinish' }
  const status = statusMap[activeFilter.value]
  
  if (activeGameTab.value === '2d3d') {
    await loadMoreBetHistory(status ? { status } : {})
  }
}

onMounted(() => loadHistory())
</script>
