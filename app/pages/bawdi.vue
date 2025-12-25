<template>
  <div class="text-white">
    <!-- Mode Toggle -->
    <div class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
        <button @click="mode = 'Body'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', mode === 'Body' ? 'bg-green-500 shadow-lg' : 'text-white/50']">
          ⚽ {{ t('bodyStyle') }}
        </button>
        <button @click="mode = 'Maung'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', mode === 'Maung' ? 'bg-blue-500 shadow-lg' : 'text-white/50']">
          🏆 {{ t('maungStyle') }}
        </button>
      </div>
    </div>

    <!-- Amount (Maung) -->
    <div v-if="mode === 'Maung'" class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs text-white/50">{{ t('betAmount') }}</p>
          <p class="text-sm font-black text-amber-400">{{ formatBalance(amount) }} {{ t('mmk') }}</p>
        </div>
        <div class="flex gap-2">
          <button v-for="a in [1000, 2000, 5000, 10000]" :key="a" @click="amount = a" 
                  :class="['flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95', amount === a ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60']">
            {{ formatBalance(a) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Matches -->
    <div class="px-4 py-2">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold">{{ t('availableMatches') }}</h2>
        <button @click="refresh" :disabled="loading" class="text-xs text-green-400 font-medium flex items-center gap-1">
          <svg :class="['w-3.5 h-3.5', loading && 'animate-spin']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-3"></div>
        <p class="text-sm text-white/40">Loading...</p>
      </div>
      
      <div v-else class="space-y-3">
        <div v-for="m in matches" :key="m.id" class="bg-white/5 rounded-xl p-4 border border-white/5">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-sm font-bold">{{ m.home }}</p>
              <p class="text-[10px] text-white/30 my-0.5">vs</p>
              <p class="text-sm font-bold">{{ m.away }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-white/40">{{ m.league }}</p>
              <p class="text-xs text-amber-400 font-medium">{{ formatDate(m.date) }}</p>
              <p class="text-sm font-bold">{{ formatTime(m.time) }}</p>
            </div>
          </div>
          
          <!-- 1X2 -->
          <div class="grid grid-cols-3 gap-2 mb-2">
            <button v-for="o in [{ id: 'home', l: '1', s: t('home'), odds: m.homeOdds }, { id: 'draw', l: 'X', s: t('draw'), odds: m.drawOdds }, { id: 'away', l: '2', s: t('away'), odds: m.awayOdds }]" 
                    :key="o.id" @click="toggleBet(m, o)"
                    :class="['p-2.5 rounded-xl text-center border transition-all active:scale-95', isSelected(m.id, o.id) ? 'bg-green-500/30 border-green-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10']">
              <p class="text-lg font-black">{{ o.l }}</p>
              <p class="text-[10px] text-white/40">{{ o.s }}</p>
              <p class="text-sm font-bold text-amber-400">{{ o.odds }}</p>
            </button>
          </div>
          
          <!-- O/U -->
          <div v-if="m.ou?.length" class="grid grid-cols-2 gap-2">
            <button v-for="o in m.ou.slice(0, 2)" :key="o.id" @click="toggleBet(m, o)"
                    :class="['p-2 rounded-xl text-center border transition-all active:scale-95', isSelected(m.id, o.id) ? 'bg-purple-500/30 border-purple-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10']">
              <p class="text-xs text-white/60">{{ o.label }}</p>
              <p class="text-sm font-bold text-amber-400">{{ o.odds }}</p>
            </button>
          </div>
        </div>
        
        <div v-if="!matches.length" class="text-center py-12">
          <p class="text-3xl mb-3">⚽</p>
          <p class="text-sm text-white/40">No matches available</p>
        </div>
      </div>
    </div>

    <!-- Bet Slip -->
    <Transition name="slide-up">
      <div v-if="selected.length" class="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-20">
        <div class="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs text-white/50">Selections <span class="text-green-400">({{ selected.length }})</span></p>
            <button @click="selected = []" class="text-[10px] text-red-400 font-medium">Clear</button>
          </div>
          
          <div class="max-h-28 overflow-y-auto space-y-2 mb-3">
            <div v-for="b in selected" :key="`${b.matchId}-${b.optionId}`" class="bg-white/5 rounded-lg p-2.5 flex items-center justify-between">
              <div class="flex-1 min-w-0 mr-2">
                <p class="text-xs font-medium truncate">{{ b.home }} vs {{ b.away }}</p>
                <p class="text-[10px] text-white/40">{{ b.label }} @ <span class="text-amber-400 font-bold">{{ b.odds }}</span></p>
                <input v-if="mode === 'Body'" v-model.number="b.amount" type="number" min="1000" placeholder="Amount"
                       class="mt-1.5 w-full bg-white/10 rounded px-2 py-1 text-xs border border-white/10 focus:border-green-500 focus:outline-none">
              </div>
              <button @click="removeBet(b)" class="text-red-400 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-xs mb-3 py-2 border-t border-white/10">
            <span class="text-white/50">Total: <span class="font-black text-amber-400">{{ formatBalance(total) }}</span></span>
            <span class="text-white/50">Win: <span class="font-black text-green-400">{{ formatBalance(potentialWin) }}</span></span>
          </div>
          
          <button @click="placeBet" :disabled="!canBet || betting" 
                  :class="['w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98]', canBet && !betting ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25' : 'bg-white/10 text-white/30']">
            {{ betting ? 'Placing...' : betText }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto">
          <div :class="['p-4 rounded-xl text-center font-medium text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">{{ toast.msg }}</div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { userBalance, isLoggedIn } = useAuth()

const mode = ref('Body')
const amount = ref(2000)
const loading = ref(false)
const betting = ref(false)
const selected = ref([])
const toast = ref(null)

const matches = ref([
  { id: 1, home: 'Man United', away: 'Liverpool', league: 'Premier League', date: '2024-12-25', time: '20:00', homeOdds: '2.10', drawOdds: '3.20', awayOdds: '2.80', ou: [{ id: 'o25', label: 'Over 2.5', odds: '1.85' }, { id: 'u25', label: 'Under 2.5', odds: '1.95' }] },
  { id: 2, home: 'Barcelona', away: 'Real Madrid', league: 'La Liga', date: '2024-12-26', time: '22:00', homeOdds: '1.95', drawOdds: '3.40', awayOdds: '3.10', ou: [{ id: 'o25_2', label: 'Over 2.5', odds: '1.75' }, { id: 'u25_2', label: 'Under 2.5', odds: '2.05' }] },
  { id: 3, home: 'Bayern', away: 'Dortmund', league: 'Bundesliga', date: '2024-12-27', time: '18:30', homeOdds: '1.65', drawOdds: '3.80', awayOdds: '4.20', ou: [{ id: 'o25_3', label: 'Over 2.5', odds: '1.90' }, { id: 'u25_3', label: 'Under 2.5', odds: '1.90' }] }
])

const total = computed(() => mode.value === 'Maung' ? selected.value.length * amount.value : selected.value.reduce((s, b) => s + (b.amount || 0), 0))
const potentialWin = computed(() => selected.value.reduce((s, b) => s + ((mode.value === 'Maung' ? amount.value : (b.amount || 0)) * parseFloat(b.odds)), 0))
const canBet = computed(() => selected.value.length > 0 && total.value <= userBalance.value && isLoggedIn.value && (mode.value === 'Maung' || selected.value.every(b => b.amount > 0)))
const betText = computed(() => {
  if (!isLoggedIn.value) return 'Please Login'
  if (!selected.value.length) return 'Select bets'
  if (total.value > userBalance.value) return t('insufficientBalance')
  return `Place Bet - ${formatBalance(total.value)} ${t('mmk')}`
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const formatDate = (d) => new Date(d).toDateString() === new Date().toDateString() ? 'Today' : new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const formatTime = (t) => { const [h, m] = t.split(':'); return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}` }
const isSelected = (mId, oId) => selected.value.some(b => b.matchId === mId && b.optionId === oId)
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const toggleBet = (m, o) => {
  const idx = selected.value.findIndex(b => b.matchId === m.id && b.optionId === o.id)
  if (idx > -1) { selected.value.splice(idx, 1); return }
  selected.value.push({ matchId: m.id, home: m.home, away: m.away, optionId: o.id, label: o.s || o.label, odds: o.odds, amount: mode.value === 'Body' ? 2000 : amount.value })
}

const removeBet = (b) => { selected.value = selected.value.filter(x => !(x.matchId === b.matchId && x.optionId === b.optionId)) }
const refresh = () => { loading.value = true; setTimeout(() => loading.value = false, 500) }

const placeBet = async () => {
  if (!canBet.value) return
  betting.value = true
  await new Promise(r => setTimeout(r, 1000))
  showToast('Bet placed!', 'success')
  selected.value = []
  betting.value = false
}

onMounted(refresh)
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(100%); }
</style>
