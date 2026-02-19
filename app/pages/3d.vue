<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-4 max-w-md">
      
      <!-- Session Info Bar (no balance for agents) -->
      <div v-if="session" class="mb-4 flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5">
        <div v-if="user?.role !== 'agent'">
          <p class="text-xs text-muted-foreground mb-1">Balance</p>
          <p class="text-2xl font-bold">{{ formatBalance(balance) }}</p>
        </div>
        <div v-else>
          <p class="text-xs text-muted-foreground mb-1">3D Betting</p>
          <p class="text-lg font-bold">{{ session.session_type }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-muted-foreground mb-1">{{ session.session_code }}</p>
          <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span class="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoadingSession && !session" class="text-center py-12">
        <div class="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p class="text-sm text-muted-foreground">Loading...</p>
      </div>

      <!-- No Session -->
      <div v-if="!isLoadingSession && !session" class="text-center py-12">
        <p class="text-muted-foreground">No active session</p>
      </div>

      <template v-if="session">
        
        <!-- Mode Toggle -->
        <div class="mb-4">
          <div class="bg-muted/50 rounded-xl p-1 flex gap-1 border border-border/50">
            <button 
              @click="mode = 'manual'" 
              :class="[
                'flex-1 py-2.5 rounded-lg text-xs font-bold transition-all',
                mode === 'manual' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'
              ]"
            >
              Manual Input
            </button>
            <button 
              @click="mode = 'grid'" 
              :class="[
                'flex-1 py-2.5 rounded-lg text-xs font-bold transition-all',
                mode === 'grid' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'
              ]"
            >
              Number Grid
            </button>
          </div>
        </div>

        <!-- Manual Mode -->
        <div v-if="mode === 'manual'" class="mb-4">
          <div class="bg-card rounded-2xl p-5 border">
            <div class="flex justify-center gap-3 mb-4">
              <input
                v-for="(digit, index) in digits"
                :key="index"
                :ref="el => digitRefs[index] = el"
                v-model="digits[index]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-14 h-14 bg-muted rounded-xl text-2xl font-black text-center border-2 border-border focus:border-primary focus:outline-none transition-colors"
                @input="handleDigitInput(index, $event)"
                @keydown="handleKeyDown(index, $event)"
                @paste="handlePaste"
              />
            </div>
            <div class="text-center">
              <p class="text-xs text-muted-foreground mb-1">Your 3D Number</p>
              <p class="text-4xl font-black text-primary">{{ currentNumber }}</p>
            </div>

            <!-- Permutations -->
            <div v-if="isValidNumber && permutations.length" class="mt-4 pt-4 border-t">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-muted-foreground">Permutations:</span>
                <button 
                  @click="addPermutations" 
                  class="text-xs bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded-lg font-bold active:scale-95 transition-all"
                >
                  +R
                </button>
              </div>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="p in permutations.slice(0, 5)" 
                  :key="p" 
                  class="text-xs bg-orange-500/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded"
                >
                  {{ p.toString().padStart(3, '0') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid Mode -->
        <div v-if="mode === 'grid'" class="mb-4">
          <!-- Selected Numbers Display -->
          <div class="bg-card rounded-2xl p-4 border mb-3">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs text-muted-foreground">
                Selected Numbers <span class="text-primary">({{ selectedNumbers.length }})</span>
              </p>
              <button 
                v-if="selectedNumbers.length" 
                @click="selectedNumbers = []" 
                class="text-xs text-destructive font-medium hover:underline"
              >
                Clear All
              </button>
            </div>
            <div class="flex flex-wrap gap-1.5 min-h-[32px] max-h-20 overflow-y-auto">
              <span 
                v-for="n in selectedNumbers.slice(0, 20)" 
                :key="n" 
                class="bg-primary text-primary-foreground px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                {{ n.toString().padStart(3, '0') }}
                <button @click="removeFromSelected(n)" class="hover:text-primary-foreground/70">×</button>
              </span>
              <span v-if="selectedNumbers.length > 20" class="text-xs text-muted-foreground">
                +{{ selectedNumbers.length - 20 }} more
              </span>
              <span v-if="!selectedNumbers.length" class="text-xs text-muted-foreground">
                Tap numbers below
              </span>
            </div>
          </div>

          <!-- Range Selector -->
          <div class="mb-3">
            <select 
              v-model="expandedRange" 
              class="w-full bg-card text-foreground rounded-xl px-4 py-3 text-sm font-bold border focus:border-primary focus:outline-none appearance-none cursor-pointer"
              style="background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%239ca3af%22 stroke-width=%222%22%3E%3Cpath d=%22M6 9l6 6 6-6%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 12px center; background-size: 20px;"
            >
              <option value="-1">Select number range...</option>
              <option v-for="i in 10" :key="i-1" :value="i-1">
                {{ (i-1) }}00 - {{ (i-1) }}99
              </option>
            </select>
          </div>

          <!-- Number Grid -->
          <div v-if="expandedRange >= 0" class="bg-card rounded-2xl p-3 border">
            <p class="text-xs text-muted-foreground mb-2">{{ expandedRange }}00-{{ expandedRange }}99</p>
            <div class="grid grid-cols-10 gap-1">
              <button
                v-for="n in 100"
                :key="expandedRange * 100 + n - 1"
                @click="toggleGridNumber(expandedRange * 100 + n - 1)"
                :class="[
                  'aspect-square rounded text-[8px] font-bold transition-all active:scale-90',
                  selectedNumbersSet.has(expandedRange * 100 + n - 1) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                ]"
              >
                {{ (expandedRange * 100 + n - 1).toString().padStart(3, '0') }}
              </button>
            </div>
          </div>
          <div v-else class="bg-card rounded-2xl p-4 border text-center">
            <p class="text-xs text-muted-foreground">Select a range above to pick numbers</p>
          </div>
        </div>

        <!-- Amount Selection -->
        <div class="mb-4">
          <div class="bg-card rounded-2xl p-4 border">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs text-muted-foreground">Amount Per Number</p>
              <p class="text-sm font-black text-amber-500">{{ formatBalance(amountInput) }} MMK</p>
            </div>
            <div class="grid grid-cols-4 gap-2 mb-3">
              <button
                v-for="amt in [500, 1000, 2000, 5000]"
                :key="amt"
                @click="amountInput = amt"
                :class="[
                  'py-2 rounded-lg text-xs font-bold transition-all active:scale-95',
                  amountInput === amt 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-muted text-muted-foreground'
                ]"
              >
                {{ formatShortBalance(amt) }}
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="amountInput = Math.max(500, amountInput - 100)" 
                class="w-11 h-11 bg-destructive/20 text-destructive rounded-xl text-lg font-bold active:scale-95 transition-all"
              >
                −
              </button>
              <input 
                v-model.number="amountInput" 
                type="number" 
                min="500" 
                class="flex-1 bg-muted rounded-xl px-3 py-2.5 text-center text-sm font-bold border focus:border-primary focus:outline-none"
              />
              <button 
                @click="amountInput += 100" 
                class="w-11 h-11 bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-lg font-bold active:scale-95 transition-all"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Summary & Place Bet -->
        <div class="mb-6">
          <div class="bg-card rounded-2xl p-4 border mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Total Bet:</span>
              <span class="font-black text-amber-500">{{ formatBalance(totalAmount) }} MMK</span>
            </div>
          </div>
          <button
            @click="placeBetHandler"
            :disabled="isPlacingBet || !canPlaceBet"
            :class="[
              'w-full py-4 rounded-xl text-sm font-bold transition-all active:scale-[0.98]',
              canPlaceBet && !isPlacingBet 
                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            ]"
          >
            <span v-if="isPlacingBet" class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
            <span v-else>{{ betText }}</span>
          </button>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { getCurrentSession, placeBet: placeBetApi } = use3DBetting()
const { connect, disconnect } = useWebSocket()
const { success, error } = useToast()
const { user } = useAuth()

const session = ref<any>(null)
const balance = ref(0)
const mode = ref<'manual' | 'grid'>('manual')
const digits = ref(['', '', ''])
const digitRefs = ref<any[]>([])
const selectedNumbers = ref<number[]>([])
const amountInput = ref(1000)
const expandedRange = ref(-1)

const isLoadingSession = ref(false)
const isPlacingBet = ref(false)

// Computed
const selectedNumbersSet = computed(() => new Set(selectedNumbers.value))

const currentNumber = computed(() => digits.value.map(d => d || '0').join(''))

const isValidNumber = computed(() => digits.value.every(d => d !== ''))

const permutations = computed(() => {
  if (!isValidNumber.value) return []
  const d = digits.value.map(Number)
  const set = new Set<number>()
  
  const permute = (arr: number[], l = 0) => {
    if (l === arr.length - 1) {
      set.add(parseInt(arr.join('')))
      return
    }
    for (let i = l; i < arr.length; i++) {
      [arr[l], arr[i]] = [arr[i], arr[l]]
      permute([...arr], l + 1)
    }
  }
  
  permute(d)
  set.delete(parseInt(currentNumber.value))
  return Array.from(set).filter(p => !selectedNumbers.value.includes(p))
})

const count = computed(() => {
  if (mode.value === 'manual') {
    return isValidNumber.value ? 1 : 0
  }
  return selectedNumbers.value.length
})

const totalAmount = computed(() => count.value * amountInput.value)

const maxWin = computed(() => totalAmount.value * 500)

const canPlaceBet = computed(() => {
  return count.value > 0 && 
    totalAmount.value <= balance.value && 
    session.value?.status === 'open'
})

const betText = computed(() => {
  if (!count.value) return mode.value === 'manual' ? 'Enter 3 Digits' : 'Select Numbers'
  if (totalAmount.value > balance.value) return 'Insufficient Balance'
  return `Place Bet - ${formatBalance(totalAmount.value)} MMK`
})

// Methods
const handleDigitInput = (index: number, event: any) => {
  const value = event.target.value
  
  if (value.length > 1) {
    digits.value[index] = value.slice(-1)
  }
  
  if (!/^\d*$/.test(digits.value[index])) {
    digits.value[index] = ''
    return
  }
  
  if (digits.value[index] && index < 2) {
    digitRefs.value[index + 1]?.focus()
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    digitRefs.value[index - 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const numbers = pastedData.replace(/\D/g, '').slice(0, 3)
  
  for (let i = 0; i < 3; i++) {
    digits.value[i] = numbers[i] || ''
  }
}

const addPermutations = () => {
  const original = parseInt(currentNumber.value)
  if (!selectedNumbers.value.includes(original)) {
    selectedNumbers.value.push(original)
  }
  permutations.value.forEach(p => {
    if (!selectedNumbers.value.includes(p)) {
      selectedNumbers.value.push(p)
    }
  })
  mode.value = 'grid'
}

const toggleGridNumber = (n: number) => {
  const index = selectedNumbers.value.indexOf(n)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  } else {
    selectedNumbers.value.push(n)
  }
}

const removeFromSelected = (n: number) => {
  selectedNumbers.value = selectedNumbers.value.filter(x => x !== n)
}

const loadSession = async () => {
  isLoadingSession.value = true
  try {
    const data = await getCurrentSession()
    if (data) {
      session.value = data
    }
  } catch (err: any) {
    console.error('Failed to load session:', err)
    error('Failed to load session')
  } finally {
    isLoadingSession.value = false
  }
}

const loadBalance = async () => {
  if (user.value?.role === 'agent' && user.value?.agent) {
    // For agents, use payable + available credit
    balance.value = (user.value.agent.payable || 0) + (user.value.agent.available_credit || 0)
  } else if (user.value?.wallet) {
    // For regular users, use wallet balance
    balance.value = user.value.wallet.balance || 0
  }
}

const placeBetHandler = async () => {
  if (!canPlaceBet.value || isPlacingBet.value) return

  isPlacingBet.value = true
  try {
    let numbers: number[] = []
    
    if (mode.value === 'manual' && isValidNumber.value) {
      numbers = [parseInt(currentNumber.value)]
    } else {
      numbers = selectedNumbers.value
    }

    const items = numbers.map(num => ({
      number: num.toString().padStart(3, '0'),
      amount: amountInput.value
    }))

    const response = await placeBetApi(items)
    
    if (response.success) {
      // Show success toast with bet slip details
      const slipNumber = response.data?.slip_number || 'N/A'
      const totalAmount = response.data?.total_amount || items.reduce((sum, item) => sum + item.amount, 0)
      const potentialWin = response.data?.potential_win
      const status = response.data?.status
      
      let message = `Slip: ${slipNumber} | Amount: ${formatBalance(totalAmount)} MMK`
      if (potentialWin) {
        message += ` | Potential Win: ${formatBalance(potentialWin)} MMK`
      }
      if (status === 'accepted') {
        message += ' | Status: Accepted'
      } else if (status === 'pending') {
        message += ' | Status: Pending Approval'
      }
      
      success('3D bet placed successfully!', message)
      balance.value -= totalAmount
      digits.value = ['', '', '']
      selectedNumbers.value = []
      await loadSession()
    } else {
      error(response.message || 'Failed to place bet')
    }
  } catch (err: any) {
    error(err.data?.message || err.message || 'Failed to place bet')
  } finally {
    isPlacingBet.value = false
  }
}

const formatBalance = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount || 0)
}

const formatShortBalance = (amount: number) => {
  if (amount >= 1000) {
    return `${amount / 1000}K`
  }
  return amount.toString()
}

// Lifecycle
onMounted(async () => {
  await loadSession()
  await loadBalance()
  
  if (user.value) {
    connect()
  }
})

onUnmounted(() => {
  disconnect()
})

useHead({
  title: '3D Betting - 2D3D'
})
</script>
