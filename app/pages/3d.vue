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
    <Card v-if="isLoadingSession && !session">
      <CardContent class="pt-6 text-center">
        <p class="text-muted-foreground">Loading session...</p>
      </CardContent>
    </Card>

    <!-- No Session -->
    <Card v-if="!isLoadingSession && !session">
      <CardContent class="pt-6 text-center">
        <p class="text-muted-foreground">No active 3D session available</p>
      </CardContent>
    </Card>

    <template v-if="session">

      <!-- Number Input -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Enter Numbers</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="flex gap-2">
            <Input
              v-model="numberInput"
              type="text"
              placeholder="000"
              maxlength="3"
              class="text-center text-3xl font-bold h-14"
              @keyup.enter="addNumber"
            />
            <Input
              v-model.number="amountInput"
              type="number"
              placeholder="Amount"
              min="100"
              max="100000"
              class="text-center text-xl font-semibold h-14"
            />
            <Button @click="addNumber" size="lg" class="h-14 px-6">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <Button
              v-for="amt in [1000, 2000, 5000, 10000]"
              :key="amt"
              @click="amountInput = amt"
              :variant="amountInput === amt ? 'default' : 'outline'"
              size="sm"
            >
              {{ formatBalance(amt) }}
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Bet Cart -->
      <Card v-if="betCart.length > 0">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="text-base">Selected Numbers ({{ betCart.length }})</CardTitle>
            <Button variant="ghost" size="sm" @click="clearCart">Clear All</Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div v-for="(item, index) in betCart" :key="index" class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div class="flex-shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
              <span class="text-2xl font-bold text-primary">{{ item.number }}</span>
            </div>
            <div class="flex-1">
              <Input
                v-model.number="item.amount"
                type="number"
                placeholder="Amount"
                min="100"
                max="100000"
                class="w-full h-10"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Max Win: {{ formatBalance(item.amount * 500) }} MMK
              </p>
            </div>
            <Button variant="ghost" size="icon" @click="removeFromCart(index)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
            <span class="text-xl font-bold">{{ formatBalance(totalAmount) }} MMK</span>
          </div>
          <div class="flex justify-between items-center pt-3 border-t">
            <span class="text-sm text-muted-foreground">Potential Win</span>
            <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ formatBalance(maxWin) }} MMK</span>
          </div>
          <Button
            @click="placeBet"
            class="w-full"
            size="lg"
            :disabled="isPlacingBet || !canPlaceBet"
          >
            {{ betText }}
          </Button>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

definePageMeta({
  middleware: 'auth'
})

const { getCurrentSession, placeBet: placeBetApi } = use3DBetting()
const { connect, disconnect } = useWebSocket()
const toast = useToast()

const session = ref<any>(null)
const balance = ref(0)
const betCart = ref<Array<{ number: string, amount: number }>>([])
const numberInput = ref('')
const amountInput = ref(1000)

const isLoadingSession = ref(false)
const isPlacingBet = ref(false)

// Computed
const totalAmount = computed(() => {
  return betCart.value.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const maxWin = computed(() => {
  return totalAmount.value * 500
})

const canPlaceBet = computed(() => {
  return betCart.value.length > 0 &&
    betCart.value.every(item => item.amount >= 100 && item.amount <= 100000) &&
    totalAmount.value <= balance.value &&
    session.value?.status === 'open'
})

const betText = computed(() => {
  if (!session.value) return 'No Active Session'
  if (!betCart.value.length) return 'Add Numbers First'
  if (totalAmount.value > balance.value) return 'Insufficient Balance'
  if (isPlacingBet.value) return 'Placing Bet...'
  return `Place Bet - ${formatBalance(totalAmount.value)} MMK`
})

// Methods
const loadSession = async () => {
  isLoadingSession.value = true
  try {
    const data = await getCurrentSession()
    if (data) {
      session.value = data
    }
  } catch (error: any) {
    console.error('Failed to load session:', error)
    toast.showToast(error.message || 'Failed to load session', 'error')
  } finally {
    isLoadingSession.value = false
  }
}

const loadBalance = async () => {
  const { user } = useAuth()
  if (user.value?.wallet) {
    balance.value = user.value.wallet.balance || 0
  }
}

const addNumber = () => {
  if (!/^\d{3}$/.test(numberInput.value)) {
    toast.showToast('Enter a valid 3-digit number', 'error')
    return
  }

  if (betCart.value.some(item => item.number === numberInput.value)) {
    toast.showToast('Number already in cart', 'error')
    return
  }

  betCart.value.push({
    number: numberInput.value,
    amount: amountInput.value || 1000
  })

  numberInput.value = ''
}

const removeFromCart = (index: number) => {
  betCart.value.splice(index, 1)
}

const clearCart = () => {
  betCart.value = []
}

const placeBet = async () => {
  if (!canPlaceBet.value || isPlacingBet.value) return

  isPlacingBet.value = true
  try {
    const items = betCart.value.map(item => ({
      number: item.number,
      amount: item.amount
    }))

    const response = await placeBetApi(items)
    
    if (response.success) {
      toast.showToast('Bet placed successfully!', 'success')
      
      // Update balance
      balance.value -= totalAmount.value
      
      // Clear cart
      clearCart()
      
      // Reload session
      await loadSession()
    } else {
      toast.showToast(response.message || 'Failed to place bet', 'error')
    }
  } catch (error: any) {
    toast.showToast(error.data?.message || error.message || 'Failed to place bet', 'error')
  } finally {
    isPlacingBet.value = false
  }
}

const formatBalance = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount || 0)
}

const handleBetCreated = (event: any) => {
  const { user } = useAuth()
  const bet = event.detail
  if (bet.user_id === user.value?.id) {
    toast.showToast('Your bet has been received', 'info')
  }
}

const handleBetUpdated = (event: any) => {
  const { user } = useAuth()
  const bet = event.detail
  if (bet.user_id === user.value?.id) {
    if (bet.status === 'accepted') {
      toast.showToast('Your bet has been accepted', 'success')
    } else if (bet.status === 'rejected') {
      toast.showToast('Your bet has been rejected', 'error')
      // Refund balance
      balance.value += bet.total_amount
    }
  }
}

const handleBalanceUpdated = (event: any) => {
  const { user } = useAuth()
  const data = event.detail
  if (data.user_id === user.value?.id) {
    balance.value = data.balance
  }
}

const handleSessionResulted = (event: any) => {
  const data = event.detail
  toast.showToast(`Result declared: ${data.result_number}`, 'info')
  // Reload session
  loadSession()
}

// Lifecycle
onMounted(async () => {
  const { user } = useAuth()
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

useHead({
  title: '3D Betting - 2D3D'
})
</script>
