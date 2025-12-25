<template>
  <div class="text-white">
    <!-- Draw Timer -->
    <section class="px-4 py-3">
      <div class="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-3 border border-blue-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-white/60">{{ t('nextDraw') }}</p>
            <p class="text-sm font-medium">{{ t('morningSession') }} • 12:00 PM</p>
          </div>
          <div class="bg-blue-500/20 px-3 py-1.5 rounded-lg">
            <p class="text-lg font-bold text-blue-400 font-mono">{{ nextDrawTime }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Selected Numbers -->
    <section class="px-4 py-2">
      <div class="bg-white/5 rounded-xl p-3 border border-white/5">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-white/60">{{ t('selectedNumbers') }} ({{ selectedNumbers.length }})</p>
          <button v-if="selectedNumbers.length > 0" @click="clearSelections" class="text-xs text-red-400 hover:text-red-300">{{ t('clearAll') }}</button>
        </div>
        <div class="flex flex-wrap gap-1.5 min-h-[32px]">
          <span v-for="num in selectedNumbers" :key="num" 
                class="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            {{ num.toString().padStart(2, '0') }}
            <button @click="removeNumber(num)" class="text-white/70 hover:text-white">×</button>
          </span>
          <span v-if="selectedNumbers.length === 0" class="text-xs text-white/30">{{ t('noNumbersSelected') }}</span>
        </div>
        
        <!-- Reverse Preview -->
        <div v-if="reverseNumbers.length > 0" class="mt-2 pt-2 border-t border-white/5">
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-white/40">R:</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="num in reverseNumbers" :key="num" class="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">
                {{ num.toString().padStart(2, '0') }}
              </span>
            </div>
            <button @click="addReverseNumbers" class="text-[10px] bg-orange-500 hover:bg-orange-600 text-white px-2 py-0.5 rounded transition-colors">+R</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Patterns -->
    <section class="px-4 py-2">
      <button @click="showPatterns = !showPatterns" class="flex items-center gap-2 text-xs text-white/60 hover:text-white/80 mb-2">
        <span>{{ t('specialPatterns') }}</span>
        <svg :class="['w-3 h-3 transition-transform', showPatterns ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-if="showPatterns" class="flex flex-wrap gap-2">
        <button v-for="p in patterns" :key="p.id" @click="selectPattern(p.id)"
                class="bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 px-3 py-1.5 rounded-lg text-xs transition-colors">
          {{ p.name }} <span class="text-white/40">({{ p.count }})</span>
        </button>
      </div>
    </section>

    <!-- Number Grid -->
    <section class="px-4 py-2">
      <div class="grid grid-cols-10 gap-1">
        <button v-for="n in 100" :key="n - 1" @click="toggleNumber(n - 1)"
                :class="['aspect-square rounded text-[11px] font-bold transition-all',
                         selectedNumbers.includes(n - 1) ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10']">
          {{ (n - 1).toString().padStart(2, '0') }}
        </button>
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
          <button v-for="amt in [100, 500, 1000, 5000]" :key="amt" @click="betAmount = amt"
                  :class="['flex-1 py-2 rounded-lg text-xs font-medium transition-colors',
                           betAmount === amt ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10']">
            {{ formatBalance(amt) }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button @click="betAmount = Math.max(100, betAmount - 100)" class="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center justify-center">−</button>
          <input v-model.number="betAmount" type="number" min="100" class="flex-1 bg-white/5 text-white rounded-lg px-3 py-2 text-center text-sm font-bold border border-white/10">
          <button @click="betAmount += 100" class="w-10 h-10 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex items-center justify-center">+</button>
        </div>
      </div>
    </section>

    <!-- Summary & Place Bet -->
    <section class="px-4 py-2 pb-6">
      <div class="bg-white/5 rounded-xl p-3 border border-white/5 mb-3">
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="flex justify-between"><span class="text-white/50">{{ t('numbersSelected') }}:</span><span class="font-bold">{{ selectedNumbers.length }}</span></div>
          <div class="flex justify-between"><span class="text-white/50">{{ t('totalBet') }}:</span><span class="font-bold text-amber-400">{{ formatBalance(totalBet) }}</span></div>
          <div class="flex justify-between col-span-2"><span class="text-white/50">{{ t('potentialWin') }}:</span><span class="font-bold text-green-400">{{ formatBalance(totalBet * 85) }} {{ t('mmk') }}</span></div>
        </div>
      </div>
      
      <button @click="placeBet" :disabled="!canPlaceBet || loading"
              :class="['w-full py-4 rounded-xl text-sm font-bold transition-all',
                       canPlaceBet && !loading ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' : 'bg-white/10 text-white/30 cursor-not-allowed']">
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

const selectedNumbers = ref([])
const betAmount = ref(1000)
const nextDrawTime = ref('02:30:45')
const showPatterns = ref(false)
const loading = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

const patterns = [
  { id: 'power', name: 'Power', count: 9, generate: () => [11, 22, 33, 44, 55, 66, 77, 88, 99] },
  { id: 'lucky', name: 'Lucky 7', count: 10, generate: () => [7, 17, 27, 37, 47, 57, 67, 77, 87, 97] },
  { id: 'even', name: 'Even', count: 9, generate: () => [2, 4, 6, 8, 10, 12, 14, 16, 18] }
]

const totalBet = computed(() => selectedNumbers.value.length * betAmount.value)
const canPlaceBet = computed(() => selectedNumbers.value.length > 0 && totalBet.value <= userBalance.value && isLoggedIn.value)
const getBetButtonText = computed(() => {
  if (!isLoggedIn.value) return 'Please Login'
  if (selectedNumbers.value.length === 0) return t('selectNumbers')
  if (totalBet.value > userBalance.value) return t('insufficientBalance')
  return `${t('placeBet')} - ${formatBalance(totalBet.value)} ${t('mmk')}`
})

const reverseNumbers = computed(() => {
  return selectedNumbers.value.map(n => {
    const first = Math.floor(n / 10), second = n % 10
    return second * 10 + first
  }).filter(r => !selectedNumbers.value.includes(r))
})

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const toggleNumber = (n) => {
  const idx = selectedNumbers.value.indexOf(n)
  idx > -1 ? selectedNumbers.value.splice(idx, 1) : selectedNumbers.value.push(n)
}

const removeNumber = (n) => {
  const idx = selectedNumbers.value.indexOf(n)
  if (idx > -1) selectedNumbers.value.splice(idx, 1)
}

const clearSelections = () => selectedNumbers.value = []

const addReverseNumbers = () => {
  reverseNumbers.value.forEach(n => {
    if (!selectedNumbers.value.includes(n)) selectedNumbers.value.push(n)
  })
}

const selectPattern = (id) => {
  const p = patterns.find(p => p.id === id)
  if (p) p.generate().forEach(n => { if (!selectedNumbers.value.includes(n)) selectedNumbers.value.push(n) })
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

const placeBet = async () => {
  if (!canPlaceBet.value) return
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  showToast('2D bet placed successfully!', 'success')
  clearSelections()
  loading.value = false
}

let timer
onMounted(() => {
  timer = setInterval(() => {
    const [h, m, s] = nextDrawTime.value.split(':').map(Number)
    let total = h * 3600 + m * 60 + s - 1
    if (total < 0) total = 12 * 3600 - 1
    const nh = Math.floor(total / 3600), nm = Math.floor((total % 3600) / 60), ns = total % 60
    nextDrawTime.value = `${nh.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}:${ns.toString().padStart(2, '0')}`
  }, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>
