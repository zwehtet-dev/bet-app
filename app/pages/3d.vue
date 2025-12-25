<template>
  <div class="text-white">
    <!-- Timer -->
    <div class="px-4 py-3">
      <div class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] text-white/50">{{ t('nextDraw') }}</p>
            <p class="text-sm font-bold">{{ t('eveningSession') }}</p>
            <p class="text-[10px] text-white/40">6:30 PM</p>
          </div>
          <div class="bg-purple-500/20 px-4 py-2 rounded-xl">
            <p class="text-2xl font-black text-purple-400 font-mono">{{ timer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mode Toggle -->
    <div class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/5">
        <button @click="mode = 'manual'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', mode === 'manual' ? 'bg-purple-500 shadow-lg' : 'text-white/50']">
          {{ t('manualInput') }}
        </button>
        <button @click="mode = 'grid'" :class="['flex-1 py-2.5 rounded-lg text-xs font-bold transition-all', mode === 'grid' ? 'bg-purple-500 shadow-lg' : 'text-white/50']">
          {{ t('numberGrid') }}
        </button>
      </div>
    </div>

    <!-- Manual Input -->
    <div v-if="mode === 'manual'" class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-5 border border-white/5">
        <div class="flex justify-center gap-3 mb-4">
          <input v-for="i in 3" :key="i" v-model="digits[i-1]" @input="onDigit($event, i-1)" maxlength="1"
                 class="w-14 h-14 bg-white/10 rounded-xl text-2xl font-black text-center border-2 border-white/20 focus:border-purple-400 focus:outline-none">
        </div>
        <div class="text-center">
          <p class="text-xs text-white/40 mb-1">{{ t('your3DNumber') }}</p>
          <p class="text-4xl font-black text-purple-400">{{ currentNum }}</p>
        </div>
        <div v-if="isValid && perms.length" class="mt-4 pt-4 border-t border-white/10">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] text-white/40">Permutations:</span>
            <button @click="addPerms" class="text-[10px] bg-orange-500 px-2.5 py-1 rounded-lg font-bold active:scale-95">+{{ perms.length }}</button>
          </div>
          <div class="flex flex-wrap gap-1">
            <span v-for="p in perms.slice(0, 5)" :key="p" class="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">{{ p.toString().padStart(3, '0') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Input -->
    <div v-if="mode === 'grid'" class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-3">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs text-white/50">{{ t('selectedNumbers') }} <span class="text-purple-400">({{ selected.length }})</span></p>
          <button v-if="selected.length" @click="selected = []" class="text-[10px] text-red-400 font-medium">{{ t('clearAll') }}</button>
        </div>
        <div class="flex flex-wrap gap-1.5 min-h-[32px]">
          <span v-for="n in selected" :key="n" class="bg-purple-500 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            {{ n.toString().padStart(3, '0') }}
            <button @click="selected = selected.filter(x => x !== n)" class="text-white/60 hover:text-white">×</button>
          </span>
          <span v-if="!selected.length" class="text-xs text-white/30">Tap numbers below</span>
        </div>
      </div>
      
      <!-- Quick Pick -->
      <div class="flex gap-2 mb-3">
        <button v-for="c in [1, 3, 5]" :key="c" @click="quickPick(c)" class="flex-1 bg-green-500/20 text-green-400 py-2.5 rounded-xl text-xs font-bold border border-green-500/30 active:scale-95">
          🎲 Lucky {{ c }}
        </button>
      </div>
      
      <!-- Ranges -->
      <div class="space-y-2 max-h-[250px] overflow-y-auto">
        <div v-for="r in ranges" :key="r.label" class="bg-white/5 rounded-xl p-2.5 border border-white/5">
          <p class="text-[10px] text-white/40 mb-1.5">{{ r.label }}</p>
          <div class="grid grid-cols-10 gap-0.5">
            <button v-for="n in r.nums" :key="n" @click="toggleGrid(n)"
                    :class="['aspect-square rounded text-[8px] font-bold transition-all active:scale-90', selected.includes(n) ? 'bg-purple-500' : 'bg-white/5 text-white/40 hover:bg-white/10']">
              {{ n.toString().padStart(3, '0') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Amount -->
    <div class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs text-white/50">{{ t('amountPerNumber') }}</p>
          <p class="text-sm font-black text-amber-400">{{ formatBalance(amount) }} {{ t('mmk') }}</p>
        </div>
        <div class="flex gap-2 mb-3">
          <button v-for="a in [500, 1000, 2000, 5000]" :key="a" @click="amount = a" 
                  :class="['flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95', amount === a ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60']">
            {{ formatBalance(a) }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button @click="amount = Math.max(500, amount - 100)" class="w-11 h-11 bg-red-500/20 text-red-400 rounded-xl text-lg font-bold active:scale-95">−</button>
          <input v-model.number="amount" type="number" min="500" class="flex-1 bg-white/5 rounded-xl px-3 py-2.5 text-center text-sm font-bold border border-white/10 focus:border-purple-500 focus:outline-none">
          <button @click="amount += 100" class="w-11 h-11 bg-green-500/20 text-green-400 rounded-xl text-lg font-bold active:scale-95">+</button>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="px-4 py-2 pb-6">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-white/50">{{ t('totalBet') }}:</span>
          <span class="font-black text-amber-400">{{ formatBalance(total) }} {{ t('mmk') }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-white/50">{{ t('potentialWin') }}:</span>
          <span class="font-black text-green-400">{{ formatBalance(total * 500) }} {{ t('mmk') }}</span>
        </div>
      </div>
      <button @click="placeBet" :disabled="!canBet || loading" 
              :class="['w-full py-4 rounded-xl text-sm font-bold transition-all active:scale-[0.98]', canBet && !loading ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' : 'bg-white/10 text-white/30']">
        {{ loading ? 'Placing...' : betText }}
      </button>
    </div>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { userBalance, isLoggedIn } = useAuth()

const mode = ref('manual')
const digits = ref(['', '', ''])
const selected = ref([])
const amount = ref(1000)
const timer = ref('06:30:45')
const loading = ref(false)
const toast = ref(null)

const ranges = Array.from({ length: 10 }, (_, i) => ({ label: `${i}00-${i}99`, nums: Array.from({ length: 100 }, (_, j) => i * 100 + j) }))

const currentNum = computed(() => digits.value.map(d => d || '0').join(''))
const isValid = computed(() => digits.value.every(d => d !== ''))
const count = computed(() => mode.value === 'manual' ? (isValid.value ? 1 : 0) : selected.value.length)
const total = computed(() => count.value * amount.value)
const canBet = computed(() => count.value > 0 && total.value <= userBalance.value && isLoggedIn.value)
const betText = computed(() => {
  if (!isLoggedIn.value) return 'Please Login'
  if (!count.value) return mode.value === 'manual' ? t('enter3Digits') : t('selectNumbers')
  if (total.value > userBalance.value) return t('insufficientBalance')
  return `${t('placeBet')} - ${formatBalance(total.value)} ${t('mmk')}`
})

const perms = computed(() => {
  if (!isValid.value) return []
  const d = digits.value.map(Number), set = new Set()
  const permute = (arr, l = 0) => {
    if (l === arr.length - 1) { set.add(parseInt(arr.join(''))); return }
    for (let i = l; i < arr.length; i++) { [arr[l], arr[i]] = [arr[i], arr[l]]; permute([...arr], l + 1) }
  }
  permute(d)
  set.delete(parseInt(currentNum.value))
  return Array.from(set).filter(p => !selected.value.includes(p))
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)
const onDigit = (e, i) => { if (!/^[0-9]$/.test(e.target.value) && e.target.value !== '') { e.target.value = ''; digits.value[i] = '' } }
const toggleGrid = (n) => { const i = selected.value.indexOf(n); i > -1 ? selected.value.splice(i, 1) : selected.value.push(n) }
const quickPick = (c) => { selected.value = []; while (selected.value.length < c) { const n = Math.floor(Math.random() * 1000); if (!selected.value.includes(n)) selected.value.push(n) } }
const addPerms = () => { perms.value.forEach(p => { if (!selected.value.includes(p)) selected.value.push(p) }); mode.value = 'grid' }
const showToast = (msg, type = 'success') => { toast.value = { msg, type }; setTimeout(() => toast.value = null, 3000) }

const placeBet = async () => {
  if (!canBet.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  showToast('3D bet placed!', 'success')
  digits.value = ['', '', '']
  selected.value = []
  loading.value = false
}

let timerInterval
onMounted(() => {
  timerInterval = setInterval(() => {
    const [h, m, s] = timer.value.split(':').map(Number)
    let t = h * 3600 + m * 60 + s - 1
    if (t < 0) t = 18.5 * 3600 - 1
    timer.value = `${Math.floor(t/3600).toString().padStart(2,'0')}:${Math.floor((t%3600)/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`
  }, 1000)
})
onUnmounted(() => clearInterval(timerInterval))
</script>

<style>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
