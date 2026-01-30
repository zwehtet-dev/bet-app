<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Session Info -->
    <SkeletonLoader v-if="isLoadingSession" type="card" />
    <Card v-else-if="session">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-lg">{{ session.session_type }} Session</CardTitle>
            <CardDescription>{{ formatDate(session.session_date) }}</CardDescription>
          </div>
          <div :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            session.status === 'open' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
          ]">
            {{ session.status.toUpperCase() }}
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-3">
        <div class="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p class="text-muted-foreground">Opens</p>
            <p class="font-medium">{{ formatTime(session.open_time) }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Closes</p>
            <p class="font-medium">{{ formatTime(session.close_time) }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Result</p>
            <p class="font-medium">{{ formatTime(session.result_time) }}</p>
          </div>
        </div>
        
        <!-- Countdown Timer -->
        <div v-if="session.status === 'open'" class="p-3 rounded-lg bg-primary/10 text-center">
          <p class="text-xs text-muted-foreground mb-1">Time Remaining</p>
          <p class="text-2xl font-bold text-primary">{{ countdown }}</p>
        </div>
      </CardContent>
    </Card>

    <!-- Balance Card -->
    <SkeletonLoader v-if="isLoadingBalance" type="balance" />
    <Card v-else-if="balance">
      <CardHeader>
        <CardDescription>Available Balance</CardDescription>
        <CardTitle class="text-3xl font-bold">
          {{ formatBalance(balance.available_balance) }}
          <span class="text-lg text-muted-foreground font-normal">MMK</span>
        </CardTitle>
      </CardHeader>
    </Card>

    <!-- Number Grid -->
    <Card>
      <CardHeader>
        <CardTitle>Select Numbers</CardTitle>
        <CardDescription>Tap numbers to add to your bet</CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonLoader v-if="isLoadingDigits" type="card" />
        <VirtualNumberGrid
          v-else
          ref="gridRef"
          :digit-status="digitStatusMap"
          :blocked-numbers="session?.blocked_numbers || []"
          @select="handleNumberSelect"
        />
      </CardContent>
    </Card>

    <!-- Bet Cart -->
    <Card v-if="betCart.length > 0">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Your Bets ({{ betCart.length }})</CardTitle>
          <Button variant="ghost" size="sm" @click="clearCart">Clear All</Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-3">
        <div v-for="(item, index) in betCart" :key="index" class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <span class="text-lg font-bold text-primary">{{ item.number }}</span>
          </div>
          <div class="flex-1">
            <Input
              v-model.number="item.amount"
              type="number"
              placeholder="Amount"
              min="100"
              max="50000"
              class="w-full"
            />
          </div>
          <Button variant="ghost" size="icon" @click="removeFromCart(index)">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <!-- Summary -->
        <div class="pt-3 border-t space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Total Amount</span>
            <span class="font-semibold">{{ formatBalance(totalAmount) }} MMK</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Potential Win (80x)</span>
            <span class="font-semibold text-green-600 dark:text-green-400">{{ formatBalance(potentialWin) }} MMK</span>
          </div>
        </div>

        <!-- Place Bet Button -->
        <Button
          @click="placeBet"
          class="w-full"
          size="lg"
          :disabled="isPlacingBet || !canPlaceBet"
        >
          {{ isPlacingBet ? 'Placing Bet...' : 'Place Bet' }}
        </Button>
      </CardContent>
    </Card>

    <!-- Recent Results -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Recent Results</CardTitle>
          <NuxtLink to="/results">
            <Button variant="ghost" size="sm">View All</Button>
          </NuxtLink>
        </div>
      </CardHeader>
      <CardContent>
        <SkeletonLoader v-if="isLoadingResults" type="list-item" />
        <div v-else-if="recentResults.length > 0" class="space-y-2">
          <div
            v-for="result in recentResults.slice(0, 5)"
            :key="result.session_code"
            class="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          >
            <div>
              <p class="font-medium">{{ result.session_type }} - {{ formatDate(result.session_date) }}</p>
              <p class="text-xs text-muted-foreground">{{ formatTime(result.result_time) }}</p>
            </div>
            <div class="text-2xl font-bold text-primary">{{ result.result_number }}</div>
          </div>
        </div>
        <p v-else class="text-center text-muted-foreground py-4">No results yet</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import VirtualNumberGrid from '@/components/VirtualNumberGrid.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

definePageMeta({
  middleware: 'auth'
})

const { getCurrentSession, getAvailableDigits, placeBet: placeBetApi, getRecentResults } = use2DBetting()
const { user } = useAuth()
const { connect, disconnect } = useWebSocket()

const session = ref<any>(null)
const balance = ref<any>(null)
const digitStatus = ref<any[]>([])
const recentResults = ref<any[]>([])
const betCart = ref<Array<{ number: string, amount: number }>>([])
const gridRef = ref<any>(null)
const countdown = ref('')
const countdownInterval = ref<any>(null)

const isLoadingSession = ref(false)
const isLoadingBalance = ref(false)
const isLoadingDigits = ref(false)
const isLoadingResults = ref(false)
const isPlacingBet = ref(false)

// Computed
const digitStatusMap = computed(() => {
  const map: Record<string, any> = {}
  digitStatus.value.forEach((digit: any) => {
    map[digit.digit] = digit
  })
  return map
})

const totalAmount = computed(() => {
  return betCart.value.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const potentialWin = computed(() => {
  return totalAmount.value * 80
})

const canPlaceBet = computed(() => {
  return betCart.value.length > 0 &&
    betCart.value.every(item => item.amount >= 100 && item.amount <= 50000) &&
    totalAmount.value <= (balance.value?.available_balance || 0) &&
    session.value?.status === 'open'
})

// Methods
const loadSession = async () => {
  isLoadingSession.value = true
  try {
    session.value = await getCurrentSession()
    startCountdown()
  } catch (error: any) {
    console.error('Failed to load session:', error)
  } finally {
    isLoadingSession.value = false
  }
}

const loadBalance = async () => {
  isLoadingBalance.value = true
  try {
    const api = useApi()
    const response: any = await api.get('/api/betting/2d/balance')
    balance.value = response.data
  } catch (error) {
    console.error('Failed to load balance:', error)
  } finally {
    isLoadingBalance.value = false
  }
}

const loadDigitStatus = async () => {
  isLoadingDigits.value = true
  try {
    const data = await getAvailableDigits()
    digitStatus.value = data.digits
  } catch (error) {
    console.error('Failed to load digit status:', error)
  } finally {
    isLoadingDigits.value = false
  }
}

const loadRecentResults = async () => {
  isLoadingResults.value = true
  try {
    recentResults.value = await getRecentResults(5)
  } catch (error) {
    console.error('Failed to load recent results:', error)
  } finally {
    isLoadingResults.value = false
  }
}

const handleNumberSelect = (number: string) => {
  const index = betCart.value.findIndex(item => item.number === number)
  if (index > -1) {
    betCart.value.splice(index, 1)
  } else {
    betCart.value.push({ number, amount: 1000 })
  }
}

const removeFromCart = (index: number) => {
  betCart.value.splice(index, 1)
}

const clearCart = () => {
  betCart.value = []
  gridRef.value?.clearSelection()
}

const placeBet = async () => {
  if (!canPlaceBet.value) return

  isPlacingBet.value = true
  try {
    const items = betCart.value.map(item => ({
      number: item.number,
      amount: item.amount
    }))

    const response = await placeBetApi(items)
    
    // Show success message
    alert(`Bet placed successfully! Slip Number: ${response.data.slip_number}`)
    
    // Clear cart and reload data
    clearCart()
    await Promise.all([loadBalance(), loadDigitStatus()])
  } catch (error: any) {
    alert(error.data?.message || 'Failed to place bet. Please try again.')
  } finally {
    isPlacingBet.value = false
  }
}

const startCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }

  const updateCountdown = () => {
    if (!session.value?.close_time) return

    const now = new Date().getTime()
    const closeTime = new Date(session.value.close_time).getTime()
    const distance = closeTime - now

    if (distance < 0) {
      countdown.value = 'CLOSED'
      clearInterval(countdownInterval.value)
      return
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    countdown.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  updateCountdown()
  countdownInterval.value = setInterval(updateCountdown, 1000)
}

const formatBalance = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount || 0)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// Lifecycle
onMounted(async () => {
  connect()
  await Promise.all([
    loadSession(),
    loadBalance(),
    loadDigitStatus(),
    loadRecentResults()
  ])

  // Listen for WebSocket events
  window.addEventListener('bet-updated', () => {
    loadBalance()
    loadDigitStatus()
  })

  window.addEventListener('session-resulted', () => {
    loadSession()
    loadRecentResults()
  })

  window.addEventListener('balance-updated', () => {
    loadBalance()
  })
})

onUnmounted(() => {
  disconnect()
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  
  window.removeEventListener('bet-updated', () => {})
  window.removeEventListener('session-resulted', () => {})
  window.removeEventListener('balance-updated', () => {})
})

useHead({
  title: '2D Betting - 2D3D'
})
</script>
