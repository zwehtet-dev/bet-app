<template>
  <div class="min-h-screen text-white">
    <!-- Draw Time Info -->
    <div class="px-4 py-2">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold">{{ t('nextDraw') }}</p>
            <p class="text-xs opacity-70">{{ t('morningSession') }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-yellow-400">{{ nextDrawTime }}</p>
            <p class="text-xs opacity-70">12:00 PM</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Number Selection -->
    <div class="px-4 py-2">
      <!-- <h2 class="text-lg font-bold mb-4">{{ t('selectNumbers') }}</h2> -->

      <!-- Selected Numbers Display -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-semibold">{{ t('selectedNumbers') }}</p>
          <button @click="clearSelections" class="text-red-400 text-sm">{{ t('clearAll') }}</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <div v-for="number in selectedNumbers" :key="number"
            class="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center">
            {{ number.toString().padStart(2, '0') }}
            <button @click="removeNumber(number)" class="ml-2 text-white/70 hover:text-white">×</button>
          </div>
          <div v-if="selectedNumbers.length === 0" class="text-white/50 text-sm">
            {{ t('noNumbersSelected') }}
          </div>
        </div>
        <!-- Reverse Preview -->
        <div v-if="selectedNumbers.length > 0 && getReverseNumbers().length > 0" class="mt-3 pt-3 border-t border-white/10">
          <p class="text-xs opacity-70 mb-1">{{ t('reverseHint') }}:</p>
          <div class="flex flex-wrap gap-1">
            <span v-for="number in getReverseNumbers()" :key="number"
                  class="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
              {{ number.toString().padStart(2, '0') }}
            </span>
          </div>
        </div>
      </div>

      <!-- R Button Row -->
      <div v-if="selectedNumbers.length > 0" class="mb-4">
        <button @click="addReverseNumbers" 
                class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full">
          R
        </button>
      </div>

      <!-- Special Patterns -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-3">
          <button @click="showPatterns = !showPatterns" 
                  class="flex items-center space-x-2 text-sm font-semibold hover:text-purple-400 transition-colors">
            <span>{{ t('specialPatterns') }}</span>
            <svg :class="['w-4 h-4 transition-transform', showPatterns ? 'rotate-180' : '']" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div class="flex items-center space-x-2">
            
            <button v-if="showPatterns" @click="clearPatterns" class="text-red-400 text-xs">{{ t('clearPatterns') }}</button>
          </div>
        </div>

        <!-- Collapsible Pattern Content -->
        <div v-if="showPatterns" class="space-y-3">
          <!-- Pattern Grid -->
          <div class="grid grid-cols-3 gap-2">
            <button v-for="pattern in patterns" :key="pattern.id" @click="selectPattern(pattern.id)" :class="[
              'px-3 py-2 rounded-lg text-xs font-medium transition-all border',
              'bg-white/5 border-white/20 text-white hover:bg-purple-500/30 hover:border-purple-500'
            ]">
              <div class="flex items-center justify-between">
                <span>{{ pattern.name }}</span>
                <span class="text-xs opacity-60">({{ getPatternCount(pattern.id) }})</span>
              </div>
            </button>
          </div>

          <!-- Reverse Hint -->
          <div v-if="selectedNumbers.length > 0" class="mt-3">
            <p class="text-xs opacity-70">
              {{ t('reverseHint') }}: {{ getReverseNumbers().map(n => n.toString().padStart(2, '0')).join(', ') }}
            </p>
          </div>
        </div>
      </div>



      <!-- Number Grid -->
      <div class="grid grid-cols-10 gap-2 mb-4">
        <button v-for="number in 100" :key="number - 1" @click="toggleNumber(number - 1)" :class="[
          'aspect-square rounded-lg text-sm font-bold transition-all',
          selectedNumbers.includes(number - 1)
            ? 'bg-blue-500 text-white'
            : 'bg-white/10 text-white hover:bg-white/20'
        ]">
          {{ (number - 1).toString().padStart(2, '0') }}
        </button>
      </div>
    </div>

    <!-- Bet Amount -->
    <div class="px-4 py-2">
      <!-- <h3 class="text-lg font-bold mb-3">{{ t('betAmount') }}</h3> -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm">{{ t('amountPerNumber') }}</p>
          <p class="text-sm font-bold">{{ formatBalance(betAmount) }} {{ t('mmk') }}</p>
        </div>
        <div class="flex gap-2 mb-3">
          <button v-for="amount in [100, 500, 1000, 5000]" :key="amount" @click="setBetAmount(amount)" :class="[
            'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
            betAmount === amount
              ? 'bg-yellow-500 text-black'
              : 'bg-white/20 text-white hover:bg-white/30'
          ]">
            {{ formatBalance(amount) }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button @click="decreaseBet"
            class="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <input v-model.number="betAmount" type="number" min="100" step="100"
            class="flex-1 bg-white/20 text-white rounded-lg px-3 py-2 text-center font-bold">
          <button @click="increaseBet"
            class="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
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
            <span class="font-bold">{{ selectedNumbers.length }}</span>
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
            <span class="font-bold text-green-400">{{ formatBalance(totalBet * 85) }} {{ t('mmk') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Place Bet Button -->
    <div class="px-4 pb-6">
      <button @click="placeBet" :disabled="!canPlaceBet || bettingLoading" :class="[
        'w-full py-4 rounded-xl text-lg font-bold transition-all',
        !canPlaceBet || bettingLoading
          ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
      ]">
        <div v-if="bettingLoading" class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Placing Bet...
        </div>
        <span v-else>{{ getBetButtonText }}</span>
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

const selectedNumbers = ref([])
const betAmount = ref(1000)
const nextDrawTime = ref('02:30:45')
const message = ref('')
const messageType = ref('success')
const showPatterns = ref(false)
const bettingLoading = ref(false)

// Simplified patterns
const patterns = [
  { id: 'power', name: 'Power', generate: () => [11, 22, 33, 44, 55, 66, 77, 88, 99] },
  { id: 'lucky', name: 'Lucky', generate: () => [7, 17, 27, 37, 47, 57, 67, 77, 87, 97] },
  { id: 'even', name: 'Even', generate: () => Array.from({length: 10}, (_, i) => i * 2 + 2).filter(n => n < 100) }
]

const totalBet = computed(() => selectedNumbers.value.length * betAmount.value)

const canPlaceBet = computed(() => {
  return selectedNumbers.value.length > 0 &&
    totalBet.value <= userBalance.value &&
    totalBet.value > 0 &&
    isLoggedIn.value
})

const getBetButtonText = computed(() => {
  if (!isLoggedIn.value) return 'Please Login'
  if (selectedNumbers.value.length === 0) return t('selectNumbers')
  if (totalBet.value > userBalance.value) return t('insufficientBalance')
  return `${t('placeBet')} - ${formatBalance(totalBet.value)} ${t('mmk')}`
})

const formatBalance = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount || 0)
}

const toggleNumber = (number) => {
  const index = selectedNumbers.value.indexOf(number)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  } else {
    selectedNumbers.value.push(number)
  }
}

const removeNumber = (number) => {
  const index = selectedNumbers.value.indexOf(number)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  }
}

const clearSelections = () => {
  selectedNumbers.value = []
}

const getReverseNumbers = () => {
  return selectedNumbers.value.map(number => {
    const first = Math.floor(number / 10)
    const second = number % 10
    return second * 10 + first
  }).filter(reverseNum => !selectedNumbers.value.includes(reverseNum))
}

const addReverseNumbers = () => {
  const reverseNumbers = getReverseNumbers()
  reverseNumbers.forEach(number => {
    if (!selectedNumbers.value.includes(number)) {
      selectedNumbers.value.push(number)
    }
  })
}

const selectPattern = (patternId) => {
  const pattern = patterns.find(p => p.id === patternId)
  if (pattern) {
    const patternNumbers = pattern.generate()
    patternNumbers.forEach(number => {
      if (!selectedNumbers.value.includes(number)) {
        selectedNumbers.value.push(number)
      }
    })
  }
}

const clearPatterns = () => {
  selectedNumbers.value = []
}

const getPatternCount = (patternId) => {
  const pattern = patterns.find(p => p.id === patternId)
  return pattern ? pattern.generate().length : 0
}

const setBetAmount = (amount) => {
  betAmount.value = amount
}

const increaseBet = () => {
  betAmount.value += 100
}

const decreaseBet = () => {
  if (betAmount.value > 100) {
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
    
    showMessage('2D bet placed successfully!', 'success')
    clearSelections()
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

    if (totalSeconds < 0) totalSeconds = 12 * 3600 - 1 // Reset to 12 hours

    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60

    nextDrawTime.value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, 1000)
})
</script>