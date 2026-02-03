<template>
  <div class="container mx-auto p-4 space-y-4 pb-24">
    <!-- Session Info -->
    <Card v-if="session">
      <CardContent class="pt-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-xs text-muted-foreground">Session</p>
            <p class="font-semibold text-sm">{{ session.session_code }} - {{ session.session_type }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-muted-foreground">Balance</p>
            <p class="font-bold text-lg">{{ formatBalance(userBalance) }} MMK</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Loading State -->
    <Card v-if="isLoading && !session">
      <CardContent class="pt-6 text-center">
        <SkeletonLoader type="list-item" />
      </CardContent>
    </Card>

    <!-- No Session -->
    <Card v-if="!isLoading && !session">
      <CardContent class="pt-6 text-center">
        <p class="text-muted-foreground">No active 2D session available</p>
      </CardContent>
    </Card>

    <template v-if="session">
      <!-- Selected Numbers -->
      <Card>
        <CardContent class="pt-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs text-muted-foreground">Selected Numbers <span class="text-primary">({{ selected.length }})</span></p>
            <Button v-if="selected.length" @click="selected = []" variant="ghost" size="sm" class="h-7 text-xs">
              Clear All
            </Button>
          </div>
          <div class="flex flex-wrap gap-1.5 min-h-[32px] max-h-24 overflow-y-auto">
            <Badge v-for="n in selected" :key="n" class="text-xs px-2 py-1">
              {{ n.toString().padStart(2, '0') }}
              <button @click="toggle(n)" class="ml-1 opacity-70 hover:opacity-100">×</button>
            </Badge>
            <span v-if="!selected.length" class="text-xs text-muted-foreground py-1">
              Tap numbers below
            </span>
          </div>
          
          <div v-if="reverseNums.length" class="mt-3 pt-3 border-t flex items-center justify-between">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-muted-foreground">R:</span>
              <Badge v-for="n in reverseNums.slice(0, 5)" :key="n" variant="secondary" class="text-xs">
                {{ n.toString().padStart(2, '0') }}
              </Badge>
              <span v-if="reverseNums.length > 5" class="text-xs text-muted-foreground">
                +{{ reverseNums.length - 5 }}
              </span>
            </div>
            <Button @click="addReverse" size="sm" variant="outline" class="h-7 text-xs">
              +R
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Special Patterns -->
      <Card>
        <CardContent class="pt-4">
          <button @click="showPatterns = !showPatterns" class="flex items-center gap-1 text-xs text-muted-foreground mb-3 w-full">
            Special Patterns
            <svg :class="['w-3 h-3 transition-transform', showPatterns && 'rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div v-if="showPatterns" class="space-y-3">
            <!-- Basic Patterns -->
            <div>
              <p class="text-[10px] text-muted-foreground mb-2">ပါတ် (Contains)</p>
              <div class="flex flex-wrap gap-1">
                <Button v-for="p in patterns.filter(p => p.id.startsWith('pathee'))" :key="p.id" @click="applyPattern(p)" 
                  variant="outline" size="sm" class="h-7 text-[10px] px-2">
                  {{ p.name }} <span class="text-muted-foreground ml-1">({{ p.nums.length }})</span>
                </Button>
              </div>
            </div>

            <!-- First/Last Digit Patterns -->
            <div>
              <p class="text-[10px] text-muted-foreground mb-2">ထိပ်/ပိတ် (First/Last)</p>
              <div class="flex flex-wrap gap-1">
                <Button v-for="p in patterns.filter(p => p.id.startsWith('htite') || p.id.startsWith('pate'))" :key="p.id" @click="applyPattern(p)" 
                  variant="outline" size="sm" class="h-7 text-[10px] px-2">
                  {{ p.name }} <span class="text-muted-foreground ml-1">({{ p.nums.length }})</span>
                </Button>
              </div>
            </div>

            <!-- Sum Patterns -->
            <div>
              <p class="text-[10px] text-muted-foreground mb-2">ဘရိတ် (Sum)</p>
              <div class="flex flex-wrap gap-1">
                <Button v-for="p in patterns.filter(p => p.id.startsWith('brake'))" :key="p.id" @click="applyPattern(p)" 
                  variant="outline" size="sm" class="h-7 text-[10px] px-2">
                  {{ p.name }} <span class="text-muted-foreground ml-1">({{ p.nums.length }})</span>
                </Button>
              </div>
            </div>

            <!-- Collection Patterns -->
            <div>
              <p class="text-[10px] text-muted-foreground mb-2">စုစည်းမှု (Collections)</p>
              <div class="flex flex-wrap gap-1">
                <Button v-for="p in patterns.filter(p => ['evenFirst', 'evenLast', 'oddFirst', 'oddLast', 'aPuu', 'evenEven', 'oddOdd', 'evenOdd', 'oddEven'].includes(p.id))" 
                  :key="p.id" @click="applyPattern(p)" 
                  variant="outline" size="sm" class="h-7 text-[10px] px-2">
                  {{ p.name }} <span class="text-muted-foreground ml-1">({{ p.nums.length }})</span>
                </Button>
              </div>
            </div>

            <!-- Special Patterns -->
            <div>
              <p class="text-[10px] text-muted-foreground mb-2">အထူး (Special)</p>
              <div class="flex flex-wrap gap-1">
                <Button v-for="p in patterns.filter(p => ['power', 'powerR', 'natKhat', 'natKhatR'].includes(p.id))" 
                  :key="p.id" @click="applyPattern(p)" 
                  variant="outline" size="sm" class="h-7 text-[10px] px-2">
                  {{ p.name }} <span class="text-muted-foreground ml-1">({{ p.nums.length }})</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Number Grid -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-sm">Pick Your Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-10 gap-1">
            <Button 
              v-for="n in 100" 
              :key="n-1" 
              @click="toggle(n-1)" 
              :variant="selectedSet.has(n-1) ? 'default' : 'outline'"
              :disabled="isNumberBlocked(n-1)"
              size="sm"
              class="aspect-square p-0 text-[11px] font-bold"
              :class="{ 'opacity-50 cursor-not-allowed': isNumberBlocked(n-1) }"
            >{{ (n-1).toString().padStart(2, '0') }}</button>
          </div>
        </CardContent>
      </Card>

      <!-- Amount Selection -->
      <Card>
        <CardContent class="pt-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs text-muted-foreground">Amount Per Number</p>
            <p class="text-sm font-bold text-amber-500">{{ formatBalance(amount) }} MMK</p>
          </div>
          <div class="grid grid-cols-4 gap-2 mb-3">
            <Button v-for="a in [100, 500, 1000, 5000]" :key="a" @click="amount = a" 
              :variant="amount === a ? 'default' : 'outline'"
              size="sm" class="text-xs">
              {{ formatBalance(a) }}
            </Button>
          </div>
          
          <div class="flex items-center gap-2">
            <Button @click="amount = Math.max(100, amount - 100)" variant="outline" size="icon" class="h-10 w-10">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </Button>
            <Input v-model.number="amount" type="number" min="100" step="100" class="text-center font-semibold text-sm" />
            <Button @click="amount += 100" variant="outline" size="icon" class="h-10 w-10">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Bet Summary -->
      <Card>
        <CardContent class="pt-4 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Total Bet:</span>
            <span class="font-bold text-amber-500">{{ formatBalance(total) }} MMK</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Potential Win:</span>
            <span class="font-bold text-green-500">{{ formatBalance(total * multiplier) }} MMK</span>
          </div>
          <Button @click="placeBetHandler" :disabled="!canBet || isPlacingBet" class="w-full" size="lg">
            {{ betText }}
          </Button>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

definePageMeta({
  middleware: 'auth',
  keepalive: true
})

const { getCurrentSession, placeBet, isLoading: isBettingLoading } = use2DBetting()
const { user } = useAuth()
const { connect, disconnect } = useWebSocket()
const { showToast } = useToast()

const selected = ref([])
const amount = ref(1000)
const session = ref(null)
const blockedNumbers = ref([])
const isPlacingBet = ref(false)
const multiplier = ref(85)
const showPatterns = ref(false)

const userBalance = computed(() => user.value?.wallet?.balance || 0)

// Generate all numbers 00-99
const allNumbers = Object.freeze(Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0')))

// Helper functions for pattern calculations
const getPathee = (digit) => allNumbers.filter(num => num.includes(digit))
const getHtiteSee = (digit) => allNumbers.filter(num => num.startsWith(digit))
const getNoutPate = (digit) => allNumbers.filter(num => num.endsWith(digit))
const getBrake = (digit) => {
  const index = parseInt(digit)
  if (index === 0) return ['00']
  return allNumbers.filter(num => {
    const a = parseInt(num[0])
    const b = parseInt(num[1])
    return (a + b === index) || (a + b === index + 10)
  })
}

// Pre-compute patterns
const patterns = Object.freeze([
  // Basic Patterns
  { id: 'pathee0', name: '0 ပါတ်', nums: getPathee('0').map(n => parseInt(n)) },
  { id: 'pathee1', name: '1 ပါတ်', nums: getPathee('1').map(n => parseInt(n)) },
  { id: 'pathee2', name: '2 ပါတ်', nums: getPathee('2').map(n => parseInt(n)) },
  { id: 'pathee3', name: '3 ပါတ်', nums: getPathee('3').map(n => parseInt(n)) },
  { id: 'pathee4', name: '4 ပါတ်', nums: getPathee('4').map(n => parseInt(n)) },
  { id: 'pathee5', name: '5 ပါတ်', nums: getPathee('5').map(n => parseInt(n)) },
  { id: 'pathee6', name: '6 ပါတ်', nums: getPathee('6').map(n => parseInt(n)) },
  { id: 'pathee7', name: '7 ပါတ်', nums: getPathee('7').map(n => parseInt(n)) },
  { id: 'pathee8', name: '8 ပါတ်', nums: getPathee('8').map(n => parseInt(n)) },
  { id: 'pathee9', name: '9 ပါတ်', nums: getPathee('9').map(n => parseInt(n)) },
  
  // First Digit Patterns
  { id: 'htite0', name: '0 ထိပ်', nums: getHtiteSee('0').map(n => parseInt(n)) },
  { id: 'htite1', name: '1 ထိပ်', nums: getHtiteSee('1').map(n => parseInt(n)) },
  { id: 'htite2', name: '2 ထိပ်', nums: getHtiteSee('2').map(n => parseInt(n)) },
  { id: 'htite3', name: '3 ထိပ်', nums: getHtiteSee('3').map(n => parseInt(n)) },
  { id: 'htite4', name: '4 ထိပ်', nums: getHtiteSee('4').map(n => parseInt(n)) },
  { id: 'htite5', name: '5 ထိပ်', nums: getHtiteSee('5').map(n => parseInt(n)) },
  { id: 'htite6', name: '6 ထိပ်', nums: getHtiteSee('6').map(n => parseInt(n)) },
  { id: 'htite7', name: '7 ထိပ်', nums: getHtiteSee('7').map(n => parseInt(n)) },
  { id: 'htite8', name: '8 ထိပ်', nums: getHtiteSee('8').map(n => parseInt(n)) },
  { id: 'htite9', name: '9 ထိပ်', nums: getHtiteSee('9').map(n => parseInt(n)) },
  
  // Last Digit Patterns
  { id: 'pate0', name: '0 ပိတ်', nums: getNoutPate('0').map(n => parseInt(n)) },
  { id: 'pate1', name: '1 ပိတ်', nums: getNoutPate('1').map(n => parseInt(n)) },
  { id: 'pate2', name: '2 ပိတ်', nums: getNoutPate('2').map(n => parseInt(n)) },
  { id: 'pate3', name: '3 ပိတ်', nums: getNoutPate('3').map(n => parseInt(n)) },
  { id: 'pate4', name: '4 ပိတ်', nums: getNoutPate('4').map(n => parseInt(n)) },
  { id: 'pate5', name: '5 ပိတ်', nums: getNoutPate('5').map(n => parseInt(n)) },
  { id: 'pate6', name: '6 ပိတ်', nums: getNoutPate('6').map(n => parseInt(n)) },
  { id: 'pate7', name: '7 ပိတ်', nums: getNoutPate('7').map(n => parseInt(n)) },
  { id: 'pate8', name: '8 ပိတ်', nums: getNoutPate('8').map(n => parseInt(n)) },
  { id: 'pate9', name: '9 ပိတ်', nums: getNoutPate('9').map(n => parseInt(n)) },
  
  // Sum Patterns (Brake)
  { id: 'brake0', name: '0 ဘရိတ်', nums: getBrake('0').map(n => parseInt(n)) },
  { id: 'brake1', name: '1 ဘရိတ်', nums: getBrake('1').map(n => parseInt(n)) },
  { id: 'brake2', name: '2 ဘရိတ်', nums: getBrake('2').map(n => parseInt(n)) },
  { id: 'brake3', name: '3 ဘရိတ်', nums: getBrake('3').map(n => parseInt(n)) },
  { id: 'brake4', name: '4 ဘရိတ်', nums: getBrake('4').map(n => parseInt(n)) },
  { id: 'brake5', name: '5 ဘရိတ်', nums: getBrake('5').map(n => parseInt(n)) },
  { id: 'brake6', name: '6 ဘရိတ်', nums: getBrake('6').map(n => parseInt(n)) },
  { id: 'brake7', name: '7 ဘရိတ်', nums: getBrake('7').map(n => parseInt(n)) },
  { id: 'brake8', name: '8 ဘရိတ်', nums: getBrake('8').map(n => parseInt(n)) },
  { id: 'brake9', name: '9 ဘရိတ်', nums: getBrake('9').map(n => parseInt(n)) },
  
  // Collection Patterns
  { id: 'evenFirst', name: 'ရှေစုံ', nums: allNumbers.filter(num => parseInt(num[0]) % 2 === 0).map(n => parseInt(n)) },
  { id: 'evenLast', name: 'နောက်စုံ', nums: allNumbers.filter(num => parseInt(num[1]) % 2 === 0).map(n => parseInt(n)) },
  { id: 'oddFirst', name: 'ရှေမ', nums: allNumbers.filter(num => parseInt(num[0]) % 2 === 1).map(n => parseInt(n)) },
  { id: 'oddLast', name: 'နောက်မ', nums: allNumbers.filter(num => parseInt(num[1]) % 2 === 1).map(n => parseInt(n)) },
  
  // Special Combinations
  { id: 'aPuu', name: 'အပူး', nums: allNumbers.filter(num => num[0] === num[1]).map(n => parseInt(n)) },
  { id: 'evenEven', name: 'စုံစုံ', nums: allNumbers.filter(num => parseInt(num[0]) % 2 === 0 && parseInt(num[1]) % 2 === 0).map(n => parseInt(n)) },
  { id: 'oddOdd', name: 'မမ', nums: allNumbers.filter(num => parseInt(num[0]) % 2 === 1 && parseInt(num[1]) % 2 === 1).map(n => parseInt(n)) },
  { id: 'evenOdd', name: 'စုံမ', nums: allNumbers.filter(num => parseInt(num[0]) % 2 === 0 && parseInt(num[1]) % 2 === 1).map(n => parseInt(n)) },
  { id: 'oddEven', name: 'မစုံ', nums: allNumbers.filter(num => parseInt(num[0]) % 2 === 1 && parseInt(num[1]) % 2 === 0).map(n => parseInt(n)) },
  
  // Mathematical Relationships
  { id: 'power', name: 'ပါ၀ါ', nums: allNumbers.filter(num => parseInt(num[0]) + 5 === parseInt(num[1])).map(n => parseInt(n)) },
  { id: 'powerR', name: 'ပါ၀ါ R', nums: allNumbers.filter(num => parseInt(num[1]) + 5 === parseInt(num[0])).map(n => parseInt(n)) },
  
  // Fixed Special Patterns
  { id: 'natKhat', name: 'နတ်ခတ်', nums: Object.freeze([7, 18, 24, 35, 69]) },
  { id: 'natKhatR', name: 'နတ်ခတ် R', nums: Object.freeze([70, 81, 42, 53, 96]) }
])

const selectedSet = computed(() => new Set(selected.value))
const total = computed(() => selected.value.length * amount.value)
const canBet = computed(() => selected.value.length > 0 && total.value <= userBalance.value && session.value)
const betText = computed(() => {
  if (!session.value) return 'No Active Session'
  if (!selected.value.length) return 'Select Numbers First'
  if (total.value > userBalance.value) return 'Insufficient Balance'
  if (isPlacingBet.value) return 'Placing Bet...'
  return `Place Bet - ${formatBalance(total.value)} MMK`
})
const reverseNums = computed(() => selected.value.map(n => (n % 10) * 10 + Math.floor(n / 10)).filter(r => !selected.value.includes(r)))
const isLoading = computed(() => isBettingLoading.value)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const toggle = (n) => { 
  if (isNumberBlocked(n)) {
    const numStr = n.toString().padStart(2, '0')
    showToast(`Number ${numStr} is blocked`, 'warning')
    return
  }
  const i = selected.value.indexOf(n)
  i > -1 ? selected.value.splice(i, 1) : selected.value.push(n)
}

const addReverse = () => {
  const blockedReverse = []
  const numsToAdd = []
  
  reverseNums.value.forEach(n => { 
    if (isNumberBlocked(n)) {
      blockedReverse.push(n.toString().padStart(2, '0'))
    } else if (!selected.value.includes(n)) {
      numsToAdd.push(n)
    }
  })
  
  // Add all numbers at once for better reactivity
  if (numsToAdd.length > 0) {
    selected.value = [...selected.value, ...numsToAdd]
  }
  
  if (blockedReverse.length > 0) {
    showToast(`Blocked numbers skipped: ${blockedReverse.join(', ')}`, 'warning')
  }
}

const applyPattern = (p) => {
  const blockedNums = []
  const numsToAdd = []
  
  p.nums.forEach(n => {
    if (isNumberBlocked(n)) {
      blockedNums.push(n.toString().padStart(2, '0'))
    } else if (!selected.value.includes(n)) {
      numsToAdd.push(n)
    }
  })
  
  // Add all numbers at once for better reactivity
  if (numsToAdd.length > 0) {
    selected.value = [...selected.value, ...numsToAdd]
  }
  
  if (blockedNums.length > 0) {
    showToast(`${blockedNums.length} blocked numbers skipped`, 'warning')
  }
}

const isNumberBlocked = (n) => {
  const numStr = n.toString().padStart(2, '0')
  return blockedNumbers.value.includes(numStr)
}

const loadSession = async () => {
  try {
    const data = await getCurrentSession()
    if (data) {
      session.value = data
      blockedNumbers.value = data.blocked_numbers || []
    }
  } catch (error) {
    console.error('Failed to load session:', error)
    showToast(error.message || 'Failed to load session', 'error')
  }
}

const placeBetHandler = async () => {
  if (!canBet.value || isPlacingBet.value) return

  try {
    isPlacingBet.value = true
    
    const items = selected.value.map(n => ({
      number: n.toString().padStart(2, '0'),
      amount: amount.value
    }))

    const response = await placeBet(items)
    
    if (response.success) {
      showToast('Bet placed successfully!', 'success')
      
      // Clear selections
      selected.value = []
      amount.value = 1000
      
      // Refresh user data to update balance
      const { fetchUser } = useAuth()
      await fetchUser()
      
      // Reload session to get updated blocked numbers
      await loadSession()
    } else {
      showToast(response.message || 'Failed to place bet', 'error')
    }
  } catch (error) {
    console.error('Failed to place bet:', error)
    showToast(error.data?.message || error.message || 'Failed to place bet', 'error')
  } finally {
    isPlacingBet.value = false
  }
}

const handleBetUpdated = (event) => {
  const bet = event.detail
  if (bet.status === 'accepted') {
    showToast('Your bet has been accepted', 'success')
  } else if (bet.status === 'rejected') {
    showToast('Your bet has been rejected', 'error')
    const { fetchUser } = useAuth()
    fetchUser()
  }
}

const handleBalanceUpdated = () => {
  const { fetchUser } = useAuth()
  fetchUser()
}

const handleSessionResulted = (event) => {
  const data = event.detail
  showToast(`Result declared: ${data.result_number}`, 'info')
  loadSession()
}

onMounted(async () => {
  await loadSession()
  
  // Connect WebSocket
  connect()
  
  // Listen to WebSocket events
  window.addEventListener('bet-updated', handleBetUpdated)
  window.addEventListener('balance-updated', handleBalanceUpdated)
  window.addEventListener('session-resulted', handleSessionResulted)
})

onUnmounted(() => {
  disconnect()
  
  // Remove event listeners
  window.removeEventListener('bet-updated', handleBetUpdated)
  window.removeEventListener('balance-updated', handleBalanceUpdated)
  window.removeEventListener('session-resulted', handleSessionResulted)
})

useHead({
  title: '2D Betting - 2D3D'
})
</script>
