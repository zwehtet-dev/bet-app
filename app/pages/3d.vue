<template>
  <div class="min-h-screen text-white">
    <!-- Draw Time Info -->
    <div class="px-4 py-3">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold">{{ t('nextDraw') }}</p>
            <p class="text-xs opacity-70">{{ t('eveningSession') }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-yellow-400">{{ nextDrawTime }}</p>
            <p class="text-xs opacity-70">6:30 PM</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Number Input Method Selection -->
    <div class="px-4 py-2">
      <div class="flex gap-2 mb-4">
        <button @click="inputMethod = 'manual'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  inputMethod === 'manual' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          {{ t('manualInput') }}
        </button>
        <button @click="inputMethod = 'grid'" 
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  inputMethod === 'grid' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                ]">
          {{ t('numberGrid') }}
        </button>
      </div>
    </div>

    <!-- Manual Input Method -->
    <div v-if="inputMethod === 'manual'" class="px-4 py-2">
    
      <!-- Number Input -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div class="flex items-center justify-center gap-2 mb-4">
          <input v-model="digit1" @input="validateDigit($event, 0)" maxlength="1" 
                 class="w-16 h-16 bg-white/20 text-white text-2xl font-bold text-center rounded-lg border-2 border-transparent focus:border-purple-400 focus:outline-none">
          <input v-model="digit2" @input="validateDigit($event, 1)" maxlength="1"
                 class="w-16 h-16 bg-white/20 text-white text-2xl font-bold text-center rounded-lg border-2 border-transparent focus:border-purple-400 focus:outline-none">
          <input v-model="digit3" @input="validateDigit($event, 2)" maxlength="1"
                 class="w-16 h-16 bg-white/20 text-white text-2xl font-bold text-center rounded-lg border-2 border-transparent focus:border-purple-400 focus:outline-none">
        </div>
        <div class="text-center">
          <p class="text-sm opacity-70 mb-2">{{ t('your3DNumber') }}</p>
          <p class="text-3xl font-bold text-yellow-400">{{ currentNumber }}</p>
        </div>
        
        <!-- Permutation Preview -->
        <div v-if="isValidNumber && getManualPermutations().length > 0" class="mt-3 pt-3 border-t border-white/10">
          <p class="text-xs opacity-70 mb-1">{{ t('permutationHint') }}:</p>
          <div class="flex flex-wrap gap-1">
            <span v-for="number in getManualPermutations()" :key="number"
                  class="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
              {{ number.toString().padStart(3, '0') }}
            </span>
          </div>
        </div>
      </div>

      <!-- R Button Row for Manual Input -->
      <div v-if="isValidNumber" class="mb-4">
        <button @click="addPermutations" 
                class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full">
          {{ t('addPermutations') }}
        </button>
      </div>

    </div>

    <!-- Grid Input Method -->
    <div v-if="inputMethod === 'grid'" class="px-4 py-2">
      
      <!-- Selected Numbers Display -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-semibold">{{ t('selectedNumbers') }}</p>
          <button @click="clearGridSelections" class="text-red-400 text-sm">{{ t('clearAll') }}</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <div v-for="number in selectedNumbers" :key="number" 
               class="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center">
            {{ number.toString().padStart(3, '0') }}
            <button @click="removeGridNumber(number)" class="ml-2 text-white/70 hover:text-white">×</button>
          </div>
          <div v-if="selectedNumbers.length === 0" class="text-white/50 text-sm">
            {{ t('noNumbersSelected') }}
          </div>
        </div>
        
        <!-- Permutation Preview -->
        <div v-if="selectedNumbers.length > 0 && getGridPermutations().length > 0" class="mt-3 pt-3 border-t border-white/10">
          <p class="text-xs opacity-70 mb-1">{{ t('permutationHint') }}:</p>
          <div class="flex flex-wrap gap-1">
            <span v-for="number in getGridPermutations().slice(0, 10)" :key="number"
                  class="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
              {{ number.toString().padStart(3, '0') }}
            </span>
            <span v-if="getGridPermutations().length > 10" class="text-xs opacity-70">
              +{{ getGridPermutations().length - 10 }} more
            </span>
          </div>
        </div>
      </div>

      <!-- R Button Row for Grid Input -->
      <div v-if="selectedNumbers.length > 0" class="mb-4">
        <button @click="addPermutations" 
                class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full">
          {{ t('addPermutations') }}
        </button>
      </div>

      <!-- Quick Pick Options -->
      <div class="mb-4">
        <p class="text-sm font-semibold mb-2">{{ t('quickPick') }}</p>
        <div class="flex gap-2">
          <button @click="quickPickGrid(1)" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            {{ t('lucky1') }}
          </button>
          <button @click="quickPickGrid(3)" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            {{ t('lucky3') }}
          </button>
          <button @click="quickPickGrid(5)" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            {{ t('lucky5') }}
          </button>
        </div>
      </div>

      <!-- Simplified Number Grid (showing ranges) -->
      <div class="space-y-3">
        <div v-for="range in numberRanges" :key="range.label" class="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <p class="text-sm font-semibold mb-2">{{ range.label }}</p>
          <div class="grid grid-cols-10 gap-1">
            <button v-for="number in range.numbers" :key="number"
                    @click="toggleGridNumber(number)"
                    :class="[
                      'aspect-square rounded text-xs font-bold transition-all',
                      selectedNumbers.includes(number) 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    ]">
              {{ number.toString().padStart(3, '0') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bet Amount -->
    <div class="px-4 py-2">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm">{{ inputMethod === 'manual' ? t('amountForNumber') : t('amountPerNumber') }}</p>
          <p class="text-sm font-bold">{{ formatBalance(betAmount) }} {{ t('mmk') }}</p>
        </div>
        <div class="flex gap-2 mb-3">
          <button v-for="amount in [500, 1000, 2000, 5000]" :key="amount"
                  @click="setBetAmount(amount)"
                  :class="[
                    'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                    betAmount === amount 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  ]">
            {{ amount.toLocaleString() }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button @click="decreaseBet" class="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <input v-model.number="betAmount" type="number" min="500" step="100"
                 class="flex-1 bg-white/20 text-white rounded-lg px-3 py-2 text-center font-bold">
          <button @click="increaseBet" class="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Bet Summary -->
    <div class="px-4 py-2">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <h3 class="text-sm font-semibold mb-3">{{ t('betSummary') }}</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>{{ t('numbersSelected') }}:</span>
            <span class="font-bold">{{ inputMethod === 'manual' ? (isValidNumber ? 1 : 0) : selectedNumbers.length }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ t('amountPerNumber') }}:</span>
            <span class="font-bold">{{ formatBalance(betAmount) }} {{ t('mmk') }}</span>
          </div>
          <div class="flex justify-between border-t border-white/20 pt-2">
            <span class="font-semibold">{{ t('totalBet') }}:</span>
            <span class="font-bold text-yellow-400">{{ formatBalance(totalBet) }} {{ t('mmk') }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ t('potentialWin') }}:</span>
            <span class="font-bold text-green-400">{{ formatBalance(totalBet * 500) }} {{ t('mmk') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Place Bet Button -->
    <div class="px-4 pb-6">
      <button @click="placeBet" 
              :disabled="!canPlaceBet"
              :class="[
                'w-full py-4 rounded-xl text-lg font-bold transition-all',
                !canPlaceBet
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
              ]">
        {{ getBetButtonText }}
      </button>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="fixed top-4 left-4 right-4 z-50">
      <div :class="[
        'p-4 rounded-lg text-center font-semibold',
        messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useAuth } from '~/composables/useAuth'

const { t } = useLanguage()
const { userBalance, isLoggedIn } = useAuth()

const inputMethod = ref('manual')
const digit1 = ref('')
const digit2 = ref('')
const digit3 = ref('')
const selectedNumbers = ref([])
const betAmount = ref(1000)
const nextDrawTime = ref('06:30:45')
const message = ref('')
const messageType = ref('success')
const bettingLoading = ref(false)

// Simplified number ranges for grid selection - showing all numbers with step 1
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

const currentNumber = computed(() => {
  return `${digit1.value || '0'}${digit2.value || '0'}${digit3.value || '0'}`
})

const isValidNumber = computed(() => {
  return digit1.value !== '' && digit2.value !== '' && digit3.value !== ''
})

const totalBet = computed(() => {
  if (inputMethod.value === 'manual') {
    return isValidNumber.value ? betAmount.value : 0
  } else {
    return selectedNumbers.value.length * betAmount.value
  }
})

const canPlaceBet = computed(() => {
  if (inputMethod.value === 'manual') {
    return isValidNumber.value && totalBet.value <= userBalance.value && isLoggedIn.value
  } else {
    return selectedNumbers.value.length > 0 && totalBet.value <= userBalance.value && isLoggedIn.value
  }
})

const getBetButtonText = computed(() => {
  if (!isLoggedIn.value) return 'Please Login'
  if (inputMethod.value === 'manual') {
    if (!isValidNumber.value) return t('enter3Digits')
    if (totalBet.value > userBalance.value) return t('insufficientBalance')
    return `${t('placeBet')} - ${formatBalance(totalBet.value)} ${t('mmk')}`
  } else {
    if (selectedNumbers.value.length === 0) return t('selectNumbers')
    if (totalBet.value > userBalance.value) return t('insufficientBalance')
    return `${t('placeBet')} - ${formatBalance(totalBet.value)} ${t('mmk')}`
  }
})

const formatBalance = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount || 0)
}

const validateDigit = (event, position) => {
  const value = event.target.value
  if (!/^[0-9]$/.test(value) && value !== '') {
    event.target.value = ''
    if (position === 0) digit1.value = ''
    if (position === 1) digit2.value = ''
    if (position === 2) digit3.value = ''
  }
}

const clearNumber = () => {
  digit1.value = ''
  digit2.value = ''
  digit3.value = ''
}

const toggleGridNumber = (number) => {
  const index = selectedNumbers.value.indexOf(number)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  } else {
    selectedNumbers.value.push(number)
  }
}

const removeGridNumber = (number) => {
  const index = selectedNumbers.value.indexOf(number)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  }
}

const clearGridSelections = () => {
  selectedNumbers.value = []
}

const quickPickGrid = (count) => {
  clearGridSelections()
  const numbers = []
  while (numbers.length < count) {
    const num = Math.floor(Math.random() * 1000)
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  selectedNumbers.value = numbers
}

const setBetAmount = (amount) => {
  betAmount.value = amount
}

const increaseBet = () => {
  betAmount.value += 100
}

const decreaseBet = () => {
  if (betAmount.value > 500) {
    betAmount.value -= 100
  }
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const placeBet = async () => {
  if (!canPlaceBet.value) return
  
  bettingLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showMessage('3D bet placed successfully!', 'success')
    if (inputMethod.value === 'manual') {
      clearNumber()
    } else {
      clearGridSelections()
    }
  } catch (error) {
    showMessage('Failed to place bet', 'error')
  } finally {
    bettingLoading.value = false
  }
}

// Simulate countdown timer
onMounted(() => {
  setInterval(() => {
    const [hours, minutes, seconds] = nextDrawTime.value.split(':').map(Number)
    let totalSeconds = hours * 3600 + minutes * 60 + seconds - 1
    
    if (totalSeconds < 0) totalSeconds = 18.5 * 3600 - 1 // Reset to 18:30
    
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    
    nextDrawTime.value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, 1000)
})
</script>