<template>
  <div class="text-white">
    <div class="px-4 py-3">
      <div class="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/20">
        <div class="flex items-center justify-between">
          <div><p class="text-[10px] text-white/50">{{ t('nextDraw') }}</p><p class="text-sm font-bold">{{ t('morningSession') }}</p><p class="text-[10px] text-white/40">12:00 PM</p></div>
          <div class="bg-blue-500/20 px-4 py-2 rounded-xl"><p class="text-2xl font-black text-blue-400 font-mono">{{ timer }}</p></div>
        </div>
      </div>
    </div>

    <div class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs text-white/50">{{ t('selectedNumbers') }} <span class="text-blue-400">({{ selected.length }})</span></p>
          <button v-if="selected.length" @click="selected = []" class="text-[10px] text-red-400 font-medium">{{ t('clearAll') }}</button>
        </div>
        <div class="flex flex-wrap gap-1.5 min-h-[32px]">
          <span v-for="n in selected" :key="n" class="bg-blue-500 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">{{ n.toString().padStart(2, '0') }}<button @click="toggle(n)" class="text-white/60 hover:text-white">×</button></span>
          <span v-if="!selected.length" class="text-xs text-white/30">Tap numbers below</span>
        </div>
        <div v-if="reverseNums.length" class="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2 flex-wrap"><span class="text-[10px] text-white/40">R:</span><span v-for="n in reverseNums.slice(0, 5)" :key="n" class="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">{{ n.toString().padStart(2, '0') }}</span><span v-if="reverseNums.length > 5" class="text-[10px] text-white/30">+{{ reverseNums.length - 5 }}</span></div>
          <button @click="addReverse" class="text-[10px] bg-orange-500 px-2.5 py-1 rounded-lg font-bold active:scale-95">+R</button>
        </div>
      </div>
    </div>

    <div class="px-4 py-2">
      <button @click="showPatterns = !showPatterns" class="flex items-center gap-1 text-xs text-white/50 mb-2">{{ t('specialPatterns') }}<svg :class="['w-3 h-3 transition-transform', showPatterns && 'rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></button>
      <div v-if="showPatterns" class="flex flex-wrap gap-2">
        <button v-for="p in patterns" :key="p.id" @click="applyPattern(p)" class="bg-white/5 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 active:scale-95">{{ p.name }} <span class="text-white/40">({{ p.nums.length }})</span></button>
      </div>
    </div>

    <div class="px-4 py-2">
      <div class="grid grid-cols-10 gap-1">
        <button v-for="n in 100" :key="n-1" @click="toggle(n-1)" :class="['aspect-square rounded-lg text-[11px] font-bold transition-all active:scale-90', selected.includes(n-1) ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10']">{{ (n-1).toString().padStart(2, '0') }}</button>
      </div>
    </div>

    <div class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3"><p class="text-xs text-white/50">{{ t('amountPerNumber') }}</p><p class="text-sm font-black text-amber-400">{{ formatBalance(amount) }} {{ t('mmk') }}</p></div>
        <div class="flex gap-2 mb-3"><button v-for="a in [100, 500, 1000, 5000]" :key="a" @click="amount = a" :class="['flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95', amount === a ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60']">{{ formatBalance(a) }}</button></div>
        <div class="flex items-center gap-2">
          <button @click="amount = Math.max(100, amount - 100)" class="w-11 h-11 bg-red-500/20 text-red-400 rounded-xl text-lg font-bold active:scale-95">−</button>
          <input v-model.number="amount" type="number" min="100" class="flex-1 bg-white/5 rounded-xl px-3 py-2.5 text-center text-sm font-bold border border-white/10 focus:border-blue-500 focus:outline-none">
          <button @click="amount += 100" class="w-11 h-11 bg-green-500/20 text-green-400 rounded-xl text-lg font-bold active:scale-95">+</button>
        </div>
      </div>
    </div>

    <div class="px-4 py-2 pb-6">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex justify-between text-sm mb-2"><span class="text-white/50">{{ t('totalBet') }}:</span><span class="font-black text-amber-400">{{ formatBalance(total) }} {{ t('mmk') }}</span></div>
        <div class="flex justify-between text-sm"><span class="text-white/50">{{ t('potentialWin') }}:</span><span class="font-black text-green-400">{{ formatBalance(total * multiplier) }} {{ t('mmk') }}</span></div>
      </div>
      <button @click="placeBetHandler" :disabled="!canBet || loading" :class="['w-full py-4 rounded-xl text-sm font-bold transition-all active:scale-[0.98]', canBet && !loading ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25' : 'bg-white/10 text-white/30']">{{ loading ? 'Placing...' : betText }}</button>
    </div>

    <Teleport to="body">
      <Transition name="slide">
        <div v-if="toast" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto"><div :class="['p-4 rounded-xl text-center font-medium text-sm shadow-xl', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">{{ toast.msg }}</div></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useBetting } from '~/composables/useBetting'

const { t } = useLanguage()
const { userBalance, isLoggedIn, refreshProfile } = useAuth()
const api = useApi()
const { placeBet } = useBetting()

const selected = ref([])
const amount = ref(1000)
const timer = ref('02:30:45')
const showPatterns = ref(false)
const loading = ref(false)
const toast = ref(null)
const multiplier = ref(85)

const patterns = [
  { id: 'power', name: 'Power', nums: [11, 22, 33, 44, 55, 66, 77, 88, 99] },
  { id: 'lucky7', name: 'Lucky 7', nums: [7, 17, 27, 37, 47, 57, 67, 77, 87, 97] },
  { id: 'even', name: 'Even', nums: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20] }
]

const total = computed(() => selected.value.length * amount.value)
const canBet = computed(() => selected.value.length > 0 && total.value <= userBalance.value && isLoggedIn.value)
const betText = computed(() => {
  if (!isLoggedIn.value) return 'Please Login'
  if (!selected.value.length) return t('selectNumbers')
  if (total.value > userBalance.value) return t('insufficientBalance')
  return `${t('placeBet')} - ${formatBalance(total.value)} ${t('mmk')}`
})
const reverseNums = computed(() => selected.value.map(n => (n % 10) * 10 + Math.floor(n / 10)).filter(r => !selected.value.includes(r)))

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const toggle = (n) => { const i = selected.value.indexOf(n); i > -1 ? selected.value.splice(i, 1) : selected.value.push(n) }
const addReverse = () => reverseNums.value.forEach(n => { if (!selected.value.includes(n)) selected.value.push(n) })
const applyPattern = (p) => p.nums.forEach(n => { if (!selected.value.includes(n)) selected.value.push(n) })
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const placeBetHandler = async () => {
  if (!canBet.value) return
  loading.value = true
  
  const betDetails = selected.value.map(digit => ({
    digit: digit.toString().padStart(2, '0'),
    amount: amount.value
  }))
  
  const result = await placeBet('2D', betDetails)
  
  if (result.success) {
    showToast(result.message || '2D bet placed successfully!', 'success')
    selected.value = []
    await refreshProfile()
  } else {
    showToast(result.error || 'Failed to place bet', 'error')
  }
  
  loading.value = false
}

let timerInterval

const handleKeydown = (e) => {
  if (e.key === 'r' || e.key === 'R') {
    if (reverseNums.value.length > 0) {
      addReverse()
    }
  }
}

onMounted(async () => {
  try {
    const result = await api.getGameSettings()
    if (result.msgState === 'data' && result.data) {
      const setting2D = result.data.find(s => s.name === '2D')
      if (setting2D) {
        multiplier.value = setting2D.value
      }
    }
  } catch (error) {
    console.error('Failed to load game settings:', error)
  }
  
  window.addEventListener('keydown', handleKeydown)
  
  timerInterval = setInterval(() => {
    const [h, m, s] = timer.value.split(':').map(Number)
    let t = h * 3600 + m * 60 + s - 1
    if (t < 0) t = 12 * 3600 - 1
    timer.value = `${Math.floor(t/3600).toString().padStart(2,'0')}:${Math.floor((t%3600)/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timerInterval)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
