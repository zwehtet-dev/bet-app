<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Session Info -->
    <Card v-if="session">
      <CardContent class="pt-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-muted-foreground">Session</p>
            <p class="font-semibold">{{ session.session_code }} - {{ session.session_type }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-muted-foreground">Balance</p>
            <p class="font-bold text-lg">{{ formatBalance(balance) }} MMK</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Loading State -->
    <Card v-if="isLoading && !session">
      <CardContent class="pt-6 text-center">
        <p class="text-muted-foreground">Loading session...</p>
      </CardContent>
    </Card>

    <!-- No Session -->
    <Card v-if="!isLoading && !session">
      <CardContent class="pt-6 text-center">
        <p class="text-muted-foreground">No active 2D session available</p>
      </CardContent>
    </Card>

    <template v-if="session">
      <!-- Selected Numbers Card -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="text-base">Selected Numbers</CardTitle>
            <Button v-if="selected.length" @click="selected = []" variant="ghost" size="sm">
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap gap-2 min-h-[25px]">
            <Badge v-for="n in selected" :key="n" class="text-sm">
              {{ n.toString().padStart(2, '0') }}
              <button @click="toggle(n)" class="ml-1.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
            <span v-if="!selected.length" class="text-sm text-muted-foreground py-0.5">
              Select numbers below
            </span>
          </div>
          
          <div v-if="reverseNums.length" class="pt-4 border-t space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Reverse Numbers</span>
              <Button @click="addReverse" size="sm" variant="outline">
                +R ({{ reverseNums.length }})
              </Button>
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="n in reverseNums.slice(0, 10)" :key="n" variant="secondary" class="text-xs">
                {{ n.toString().padStart(2, '0') }}
              </Badge>
              <span v-if="reverseNums.length > 10" class="text-xs text-muted-foreground py-0.5">
                +{{ reverseNums.length - 10 }} more
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Number Grid -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Pick Your Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-10 gap-1.5">
            <Button 
              v-for="n in 100" 
              :key="n-1" 
              @click="toggle(n-1)" 
              :variant="selectedSet.has(n-1) ? 'default' : 'outline'"
              :disabled="isNumberBlocked(n-1)"
              size="sm"
              class="aspect-square p-0 text-xs font-semibold"
              :class="{ 'opacity-50 cursor-not-allowed': isNumberBlocked(n-1) }"
            >{{ (n-1).toString().padStart(2, '0') }}</Button>
          </div>
        </CardContent>
      </Card>

      <!-- Amount Selection -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="text-base">Amount Per Number</CardTitle>
            <span class="text-lg font-bold">{{ formatBalance(amount) }} MMK</span>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-4 gap-2">
            <Button v-for="a in [100, 500, 1000, 5000]" :key="a" @click="amount = a" 
              :variant="amount === a ? 'default' : 'outline'"
              size="sm">
              {{ formatBalance(a) }}
            </Button>
          </div>
          
          <div class="flex items-center gap-3">
            <Button @click="amount = Math.max(100, amount - 100)" variant="outline" size="icon">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </Button>
            <Input v-model.number="amount" type="number" min="100" step="100" class="text-center font-semibold" />
            <Button @click="amount += 100" variant="outline" size="icon">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Bet Summary -->
      <Card>
        <CardContent class="pt-6 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">Total Bet</span>
            <span class="text-xl font-bold">{{ formatBalance(total) }} MMK</span>
          </div>
          <div class="flex justify-between items-center pt-3 border-t">
            <span class="text-sm text-muted-foreground">Potential Win</span>
            <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ formatBalance(total * 85) }} MMK</span>
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
import { useToast } from 'vue-toastification'

definePageMeta({
  middleware: 'auth',
  keepalive: true
})

const { getCurrentSession, placeBet, isLoading: isBettingLoading } = use2DBetting()
const { user } = useAuth()
const { connect, disconnect, isConnected } = useWebSocket()
const toast = useToast()

const selected = ref([])
const amount = ref(1000)
const session = ref(null)
const balance = ref(0)
const blockedNumbers = ref([])
const isPlacingBet = ref(false)

const selectedSet = computed(() => new Set(selected.value))
const total = computed(() => selected.value.length * amount.value)
const canBet = computed(() => selected.value.length > 0 && total.value <= balance.value && session.value)
const betText = computed(() => {
  if (!session.value) return 'No Active Session'
  if (!selected.value.length) return 'Select Numbers First'
  if (total.value > balance.value) return 'Insufficient Balance'
  if (isPlacingBet.value) return 'Placing Bet...'
  return `Place Bet - ${formatBalance(total.value)} MMK`
})
const reverseNums = computed(() => selected.value.map(n => (n % 10) * 10 + Math.floor(n / 10)).filter(r => !selected.value.includes(r)))
const isLoading = computed(() => isBettingLoading.value)

const formatBalance = (n) => new Intl.NumberFormat('en-US').format(n || 0)

const toggle = (n) => { 
  if (isNumberBlocked(n)) {
    const numStr = n.toString().padStart(2, '0')
    toast.warning(`Number ${numStr} is blocked and cannot be selected`)
    return
  }
  const i = selected.value.indexOf(n)
  i > -1 ? selected.value.splice(i, 1) : selected.value.push(n)
}

const addReverse = () => {
  const blockedReverse = []
  reverseNums.value.forEach(n => { 
    if (isNumberBlocked(n)) {
      blockedReverse.push(n.toString().padStart(2, '0'))
    } else if (!selected.value.includes(n)) {
      selected.value.push(n)
    }
  })
  
  if (blockedReverse.length > 0) {
    toast.warning(`Blocked numbers skipped: ${blockedReverse.join(', ')}`)
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
    toast.error(error.message || 'Failed to load session')
  }
}

const loadBalance = async () => {
  if (user.value?.wallet) {
    balance.value = user.value.wallet.balance || 0
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
      toast.success('Bet placed successfully!')
      
      // Update balance
      balance.value -= total.value
      
      // Clear selections
      selected.value = []
      amount.value = 1000
      
      // Reload session to get updated blocked numbers
      await loadSession()
    } else {
      toast.error(response.message || 'Failed to place bet')
    }
  } catch (error) {
    console.error('Failed to place bet:', error)
    toast.error(error.data?.message || error.message || 'Failed to place bet')
  } finally {
    isPlacingBet.value = false
  }
}

const handleBetCreated = (event) => {
  const bet = event.detail
  if (bet.user_id === user.value?.id) {
    toast.info('Your bet has been received')
  }
}

const handleBetUpdated = (event) => {
  const bet = event.detail
  if (bet.user_id === user.value?.id) {
    if (bet.status === 'accepted') {
      toast.success('Your bet has been accepted')
    } else if (bet.status === 'rejected') {
      toast.error('Your bet has been rejected')
      // Refund balance
      balance.value += bet.total_amount
    }
  }
}

const handleBalanceUpdated = (event) => {
  const data = event.detail
  if (data.user_id === user.value?.id) {
    balance.value = data.balance
  }
}

const handleSessionResulted = (event) => {
  const data = event.detail
  toast.info(`Result declared: ${data.result_number}`)
  // Reload session
  loadSession()
}

onMounted(async () => {
  await loadSession()
  await loadBalance()
  
  // Connect WebSocket
  if (user.value) {
    connect()
  }
  
  // Listen to WebSocket events
  window.addEventListener('bet-created', handleBetCreated)
  window.addEventListener('bet-updated', handleBetUpdated)
  window.addEventListener('balance-updated', handleBalanceUpdated)
  window.addEventListener('session-resulted', handleSessionResulted)
})

onUnmounted(() => {
  disconnect()
  
  // Remove event listeners
  window.removeEventListener('bet-created', handleBetCreated)
  window.removeEventListener('bet-updated', handleBetUpdated)
  window.removeEventListener('balance-updated', handleBalanceUpdated)
  window.removeEventListener('session-resulted', handleSessionResulted)
})
</script>
