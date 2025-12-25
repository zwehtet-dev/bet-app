<template>
  <div class="text-white">
    <!-- Draw Timer -->
    <section class="px-4 py-3">
      <div class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-3 border border-purple-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-white/60">{{ t('nextDraw') }}</p>
            <p class="text-sm font-medium">{{ t('eveningSession') }} • 6:30 PM</p>
          </div>
          <div class="bg-purple-500/20 px-3 py-1.5 rounded-lg">
            <p class="text-lg font-bold text-purple-400 font-mono">{{ nextDrawTime }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Input Method Toggle -->
    <section class="px-4 py-2">
      <div class="flex gap-2">
        <button @click="inputMethod = 'manual'" 
                :class="['flex-1 py-2 rounded-xl text-xs font-semibold transition-colors',
                         inputMethod === 'manual' ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10']">
          {{ t('manualInput') }}
        </button>
        <button @click="inputMethod = 'grid'" 
                :class="['flex-1 py-2 rounded-xl text-xs font-semibold transition-colors',
                         inputMethod === 'grid' ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10']">
          {{ t('numberGrid') }}
        </button>
      </div>
    </section>

    <!-- Manual Input -->
    <section v-if="inputMethod === 'manual'" class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-4 border border-white/5">
        <div class="flex items-center justify-center gap-2 mb-4">
          <input v-for="(_, i) in 3" :key="i" v-model="digits[i]" @input="validateDigit($event, i)" maxlength="1"
                 class="w-14 h-14 bg-white/10 text-white text-2xl font-bold text-center rounded-xl border-2 border-transparent focus:border-purple-400 focus:outline-none">
        </div>
        <div class="text-center">
          <p class="text-xs text-white/50 mb-1">{{ t('your3DNumber') }}</p>
          <p class="text-3xl font-bold text-purple-400">{{ currentNumber }}</p>
        </div>
        
        <!-- Permutations -->
        <div v-if="isValidNumber && permutations.length > 0" class="mt-3 pt-3 border-t border-white/5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] text-white/40">{{ t('permutationHint') }}:</span>
            <button @click="addPermutations" class="text-[10px] bg-orange-500 hover:bg-orange-600 text-white px-2 py-0.5 rounded transition-colors">
              +{{ permutations.length }} {{ t('addPermutations') }}
            </button>
          </div>
          <div class="flex flex-wrap gap-1">
            <span v-for="p in permutations.slice(0, 6)" :key="p" class="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">
              {{ p.toString().padStart(3, '0') }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Grid Input -->
    <section v-if="inputMethod === 'grid'" class="px-4 py-2">
      <!-- Selected Numbers -->
      <div class="bg-white/5 rounded-xl p-3 border border-white/5 mb-3">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-white/60">{{ t('selectedNumbers') }} ({{ selectedNumbers.length }})</p>
          <button v-if="selectedNumbers.length > 0" @click="selectedNumbers = []" class="text-xs text-red-400">{{ t('clearAll') }}</button>
        </div>
        <div class="flex flex-wrap gap-1.5 min-h-[32px]">
          <span v-for="num in selectedNumbers" :key="num" class="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            {{ num.toString().padStart(3, '0') }}
            <button @click="selectedNumbers = selectedNumbers.filter(n => n !== num)" class="text-white/70 hover:text-white">×</button>
          </span>
          <span v-if="selectedNumbers.length === 0" class="text-xs text-white/30">{{ t('noNumbersSelected') }}</span>
        </div>
      </div>

      <!-- Quick Pick -->
      <div class="flex gap-2 mb-3">
        <button v-for="c in [1, 3, 5]" :key="c" @click="quickPick(c)"
                class="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded-lg text-xs font-medium transition-colors">
          {{ t('lucky') }} {{ c }}
        </button>
      </div>

      <!-- Number Ranges -->
      <div class="space-y-2 max-h-[300px] overflow-y-auto">
        <div v-for="range in numberRanges" :key="range.label" class="bg-white/5 rounded-xl p-2 border border-white/5">
          <p class="text-[10px] text-white/50 mb-1.5">{{ range.label }}</p>
          <div class="grid grid-cols-10 gap-0.5">
            <button v-for="n in range.numbers" :key="n" @click="toggleGridNumber(n)"
                    :class="['aspect-square rounded text-[9px] font-bold transition-all',
                             selectedNumbers.includes(n) ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10']">
              {{ n.toString().padStart(3, '0') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Bet Amount -->
    <section class="px-4 py-3">
      <div class="bg-white/5 rounded-xl p-3 border border-white/5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-white/60">{{ t('amountPerNumber') }}</p>
          <p class="text-sm font-bold text-amber-400">{{ formatBalance(betAmount) }} {{ t('mmk') }}</p>
        </div>
        <div class="flex gap-2 mb-2">
          <button v-for="amt in [500, 1000, 2000, 5000]" :key="amt" @click="betAmount = amt"
                  :class="['flex-1 py-2 rounded-lg text-xs font-medium transition-colors',
                           betAmount === amt ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10']">
            {{ formatBalance(amt) }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button @click="betAmount = Math.max(500, betAmount - 100)" class="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center justify-center">−</button>
          <input v-model.number="betAmount" type="number" min="500" class="flex-1 bg-white/5 text-white rounded-lg px-3 py-2 text-center text-sm font-bold border border-white/10">
          <button @click="betAmount += 100" class="w-10 h-10 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex items-center justify-center">+</button>
        </div>
      </div>
    </section>

    <!-- Summary & Place Bet -->
    <section class="px-4 py-2 pb-6">
      <div class="bg-white/5 rounded-xl p-3 border border-white/5 mb-3">
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="flex justify-between"><span class="text-white/50">{{ t('numbersSelected') }}:</span><span class="font-bold">{{ numberCount }}</span></div>
          <div class="flex justify-between"><span class="text-white/50">{{ t('totalBet') }}:</span><span class="font-bold text-amber-400">{{ formatBalance(totalBet) }}</span></div>
          <div class="flex justify-between col-span-2"><span class="text-white/50">{{ t('potentialWin') }}:</span><span class="font-bold text-green-400">{{ formatBalance(totalBet * 500) }} {{ t('mmk') }}</span></div>
        </div>
      </div>
      
      <button @click="placeBet" :disabled="!canPlaceBet || loading"
              :class="['w-full py-4 rounded-xl text-sm font-bold transition-all',
                       canPlaceBet && !loading ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' : 'bg-white/10 text-white/30 cursor-not-allowed']">
        {{ loading ? 'Placing...' : getBetButtonText }}
      </button>
    </section>

    <!-- Toast -->
    <Teleport to="body">
      <div v-if="toast.show" class="fixed top-4 left-4 right-4 z-50 max-w-[400px] mx-auto">
        <div :class="['p-4 rounded-xl text-center font-medium text-sm', toast.type === 'success' ? 'bg-green-500' : 'bg-red-500']">
          {{ toast.message }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { userBalance, isLoggedIn } = useAuth()

const inputMethod = ref('manual')
const digits = ref(['', '', ''])
const selectedNumbers = ref([])
const betAmount = ref(1000)
const nextDrawTime = ref('06:30:45')
const loading = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

const numberRanges = [
  { label: '000-099', numbers: Array.from({length: 100}, (_, i) => i) },
  { label: '100-199', numbers: Array.from({length: 100}, (_, i) => 100 + i) },
  { label: '200-299', numbers: Array.from({length: 100}, (_, i) => 200 + i) },
  { label: '300-399', numbers: Array.from({length: 100}, (_, i) => 300 + i) },
  { label: '400-499', numbers: Array.from({length: 100}, (_, i) => 400 + i) },
  { label: '500-599', numbers: Array.from({length: 100}, (_, i) => 500 + i) },
  { label: '600-699', numbers: Array.from({length: 100}, (_, i) => 600 + i) },
  { label: '700-799', numbers: Array.from({length: 100}, (_, i) => 700 + i) },
  { label: '800-899', numbers: Array.from({length: 100}, (_, i) => 800 + i) },
  { label: '900-999', numbers: Array.from({length: 100}, (_, i) => 900 + i) }
]

const currentNumber = computed(() => digits.value.map(d => d || '0').join(''))
const isValidNumber = computed(() => digits.value.every(d => d !== ''))
const numberCount = computed(() => inputMethod.value === 'manual' ? (isValidNumber.value ? 1 : 0) : selectedNumbers.value.length)
const totalBet = computed(() => numberCount.value * betAmount.value)
const canPlaceBet = computed(() => numberCount.value > 0 && totalBet.value <= userBalance.value && isLoggedIn.value)

const getBetButtonText = computed(() => {
  if (!isLoggedIn.value) return 'Please Login'
  if (numberCount.value === 0) return inputMethod.value === 'manual' ? t('enter3Digits') : t('selectNumbers')
  if (totalBet.value > userBalance.value) return t('insufficientBalance')
  return `${t('placeBet')} - ${formatBalance(totalBet.value)} ${t('mmk')}`
})

const permutations = computed(() => {
  if (!isValidNumber.value) return []
  const num = parseInt(currentNumber.value)
  const d = digits.value.map(Number)
  const perms = new Set()
  const permute = (arr, l = 0) => {
    if (l === arr.length - 1) { perms.add(parseInt(arr.join(''))); return }
    for (let i = l; i < arr.length; i++) {
      [arr[l], arr[i]] = [arr[i], arr[l]]
      permute([...arr], l + 1)
    }
  }
  permute(d)
  perms.delete(num)
  return Array.from(perms).filter(p => !selectedNumbers.value.includes(p))
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const validateDigit = (e, i) => {
  const v = e.target.value
  if (!/^[0-9]$/.test(v) && v !== '') { e.target.value = ''; digits.value[i] = '' }
}

const toggleGridNumber = (n) => {
  const idx = selectedNumbers.value.indexOf(n)
  idx > -1 ? selectedNumbers.value.splice(idx, 1) : selectedNumbers.value.push(n)
}

const quickPick = (count) => {
  selectedNumbers.value = []
  while (selectedNumbers.value.length < count) {
    const n = Math.floor(Math.random() * 1000)
    if (!selectedNumbers.value.includes(n)) selectedNumbers.value.push(n)
  }
}

const addPermutations = () => {
  permutations.value.forEach(p => { if (!selectedNumbers.value.includes(p)) selectedNumbers.value.push(p) })
  inputMethod.value = 'grid'
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

const placeBet = async () => {
  if (!canPlaceBet.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  showToast('3D bet placed successfully!', 'success')
  digits.value = ['', '', '']
  selectedNumbers.value = []
  loading.value = false
}

let timer
onMounted(() => {
  timer = setInterval(() => {
    const [h, m, s] = nextDrawTime.value.split(':').map(Number)
    let total = h * 3600 + m * 60 + s - 1
    if (total < 0) total = 18.5 * 3600 - 1
    const nh = Math.floor(total / 3600), nm = Math.floor((total % 3600) / 60), ns = total % 60
    nextDrawTime.value = `${nh.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}:${ns.toString().padStart(2, '0')}`
  }, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>
