<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Balance Card -->
    <Card>
      <CardContent class="pt-6">
        <div class="text-center space-y-2">
          <p class="text-sm text-muted-foreground">Total Balance</p>
          <p class="text-4xl font-bold">{{ formatBalance(balance?.balance || 0) }}</p>
          <p class="text-xs text-muted-foreground">MMK</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
          <div class="text-center">
            <p class="text-xs text-muted-foreground mb-1">Available</p>
            <p class="text-lg font-semibold text-green-600 dark:text-green-400">
              {{ formatBalance((balance?.balance || 0) - (balance?.locked_balance || 0)) }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-xs text-muted-foreground mb-1">Locked</p>
            <p class="text-lg font-semibold text-orange-600 dark:text-orange-400">
              {{ formatBalance(balance?.locked_balance || 0) }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-6">
          <Button @click="showDepositModal = true" class="w-full">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Deposit
          </Button>
          <Button @click="showWithdrawModal = true" variant="outline" class="w-full">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Payment Requests -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Payment Requests</CardTitle>
          <Button variant="ghost" size="sm" @click="loadPaymentRequests">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SkeletonLoader v-if="isLoadingRequests" type="list-item" />
        <div v-else-if="paymentRequests.length > 0" class="space-y-3">
          <div v-for="request in paymentRequests" :key="request.id" class="p-3 rounded-lg bg-muted/50">
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="font-semibold">{{ request.type === 'deposit' ? 'Deposit' : 'Withdrawal' }}</p>
                <p class="text-xs text-muted-foreground">{{ formatDateTime(request.created_at) }}</p>
              </div>
              <div :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(request.status)]">
                {{ request.status.toUpperCase() }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Amount</span>
              <span class="font-semibold">{{ formatBalance(request.amount) }} MMK</span>
            </div>
            <div v-if="request.payment_method" class="flex items-center justify-between mt-1">
              <span class="text-sm text-muted-foreground">Method</span>
              <span class="text-sm">{{ request.payment_method.name }}</span>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-muted-foreground py-4">No payment requests</p>
      </CardContent>
    </Card>

    <!-- Transaction History -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <SkeletonLoader v-if="isLoadingTransactions && transactions.length === 0" type="list-item" />
        <div v-else-if="transactions.length > 0" class="space-y-2">
          <div v-for="tx in transactions" :key="tx.id" class="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p class="font-medium">{{ getTransactionLabel(tx.transaction_type) }}</p>
              <p class="text-xs text-muted-foreground">{{ formatDateTime(tx.created_at) }}</p>
            </div>
            <div class="text-right">
              <p :class="['font-semibold', tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']">
                {{ tx.amount > 0 ? '+' : '' }}{{ formatBalance(tx.amount) }}
              </p>
              <p class="text-xs text-muted-foreground">{{ formatBalance(tx.balance_after) }}</p>
            </div>
          </div>
          
          <!-- Loading more indicator -->
          <div v-if="isLoadingMore" class="text-center py-4">
            <SkeletonLoader type="list-item" />
          </div>
          
          <!-- Load more trigger -->
          <div ref="loadMoreTrigger" class="h-4"></div>
          
          <!-- End of list message -->
          <p v-if="!hasMoreTransactions && transactions.length > 0" class="text-center text-muted-foreground text-sm py-4">
            No more transactions
          </p>
        </div>
        <p v-else class="text-center text-muted-foreground py-4">No transactions yet</p>
      </CardContent>
    </Card>

    <!-- Deposit Modal -->
    <div v-if="showDepositModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="showDepositModal = false">
      <Card class="w-full max-w-md">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Deposit Request</CardTitle>
            <Button variant="ghost" size="icon" @click="showDepositModal = false">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">Amount (MMK)</label>
            <Input
              v-model.number="depositAmount"
              type="number"
              placeholder="Enter amount"
              min="1000"
              step="1000"
            />
          </div>

          <div>
            <label class="text-sm font-medium mb-2 block">Payment Method</label>
            <select v-model="selectedPaymentMethod" class="w-full p-2 rounded-lg border bg-background">
              <option value="">Select payment method</option>
              <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                {{ method.name }} - {{ method.account_number }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium mb-2 block">Transaction ID (Optional)</label>
            <Input
              v-model="transactionId"
              type="text"
              placeholder="Enter transaction ID"
            />
          </div>

          <div>
            <label class="text-sm font-medium mb-2 block">Note (Optional)</label>
            <textarea
              v-model="note"
              class="w-full p-2 rounded-lg border bg-background"
              rows="3"
              placeholder="Add any notes..."
            ></textarea>
          </div>

          <Button
            @click="submitDeposit"
            class="w-full"
            :disabled="isSubmitting || !depositAmount || !selectedPaymentMethod"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Withdraw Modal -->
    <div v-if="showWithdrawModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="showWithdrawModal = false">
      <Card class="w-full max-w-md">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Withdrawal Request</CardTitle>
            <Button variant="ghost" size="icon" @click="showWithdrawModal = false">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">Amount (MMK)</label>
            <Input
              v-model.number="withdrawAmount"
              type="number"
              placeholder="Enter amount"
              min="1000"
              step="1000"
              :max="(balance?.balance || 0) - (balance?.locked_balance || 0)"
            />
            <p class="text-xs text-muted-foreground mt-1">
              Available: {{ formatBalance((balance?.balance || 0) - (balance?.locked_balance || 0)) }} MMK
            </p>
          </div>

          <div>
            <label class="text-sm font-medium mb-2 block">Payment Method</label>
            <select v-model="selectedPaymentMethod" class="w-full p-2 rounded-lg border bg-background">
              <option value="">Select payment method</option>
              <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                {{ method.name }} - {{ method.account_number }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium mb-2 block">Note (Optional)</label>
            <textarea
              v-model="note"
              class="w-full p-2 rounded-lg border bg-background"
              rows="3"
              placeholder="Add any notes..."
            ></textarea>
          </div>

          <Button
            @click="submitWithdraw"
            class="w-full"
            :disabled="isSubmitting || !withdrawAmount || !selectedPaymentMethod"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()

const balance = ref<any>(null)
const paymentRequests = ref<any[]>([])
const transactions = ref<any[]>([])
const paymentMethods = ref<any[]>([])

const showDepositModal = ref(false)
const showWithdrawModal = ref(false)
const depositAmount = ref<number>(0)
const withdrawAmount = ref<number>(0)
const selectedPaymentMethod = ref('')
const transactionId = ref('')
const note = ref('')

const isLoadingRequests = ref(false)
const isLoadingTransactions = ref(false)
const isLoadingMore = ref(false)
const isSubmitting = ref(false)

// Pagination state
const currentPage = ref(1)
const perPage = 10
const hasMoreTransactions = ref(true)
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const loadBalance = async () => {
  try {
    const response: any = await api.get('/api/betting/2d/balance')
    balance.value = response.data
  } catch (error) {
    console.error('Failed to load balance:', error)
  }
}

const loadPaymentMethods = async () => {
  try {
    const response: any = await api.get('/api/payment-methods')
    paymentMethods.value = response.data
  } catch (error) {
    console.error('Failed to load payment methods:', error)
  }
}

const loadPaymentRequests = async () => {
  isLoadingRequests.value = true
  try {
    const response: any = await api.get('/api/payment-requests')
    paymentRequests.value = response.data
  } catch (error) {
    console.error('Failed to load payment requests:', error)
  } finally {
    isLoadingRequests.value = false
  }
}

const loadTransactions = async (page: number = 1) => {
  if (page === 1) {
    isLoadingTransactions.value = true
  } else {
    isLoadingMore.value = true
  }
  
  try {
    const response: any = await api.get(`/api/wallet/transactions?page=${page}&per_page=${perPage}`)
    
    if (response.success && response.data) {
      const newTransactions = response.data || []
      
      if (page === 1) {
        transactions.value = newTransactions
      } else {
        transactions.value = [...transactions.value, ...newTransactions]
      }
      
      // Check if there are more transactions using meta information
      if (response.meta) {
        hasMoreTransactions.value = response.meta.current_page < response.meta.last_page
      } else {
        hasMoreTransactions.value = newTransactions.length === perPage
      }
    }
    
  } catch (error) {
    console.error('Failed to load transactions:', error)
    if (page === 1) {
      transactions.value = []
    }
  } finally {
    isLoadingTransactions.value = false
    isLoadingMore.value = false
  }
}

const loadMoreTransactions = async () => {
  if (isLoadingMore.value || !hasMoreTransactions.value) return
  
  currentPage.value++
  await loadTransactions(currentPage.value)
}

const setupIntersectionObserver = () => {
  if (!loadMoreTrigger.value) return
  
  observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMoreTransactions.value && !isLoadingMore.value) {
        loadMoreTransactions()
      }
    },
    {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    }
  )
  
  observer.observe(loadMoreTrigger.value)
}

const submitDeposit = async () => {
  if (!depositAmount.value || !selectedPaymentMethod.value) return

  isSubmitting.value = true
  try {
    await api.post('/api/payment-requests', {
      type: 'deposit',
      amount: depositAmount.value,
      payment_method_id: selectedPaymentMethod.value,
      transaction_id: transactionId.value,
      note: note.value
    })

    alert('Deposit request submitted successfully!')
    showDepositModal.value = false
    depositAmount.value = 0
    selectedPaymentMethod.value = ''
    transactionId.value = ''
    note.value = ''
    
    await loadPaymentRequests()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to submit deposit request')
  } finally {
    isSubmitting.value = false
  }
}

const submitWithdraw = async () => {
  if (!withdrawAmount.value || !selectedPaymentMethod.value) return

  const availableBalance = (balance.value?.balance || 0) - (balance.value?.locked_balance || 0)
  if (withdrawAmount.value > availableBalance) {
    alert('Insufficient balance')
    return
  }

  isSubmitting.value = true
  try {
    await api.post('/api/payment-requests', {
      type: 'withdraw',
      amount: withdrawAmount.value,
      payment_method_id: selectedPaymentMethod.value,
      note: note.value
    })

    alert('Withdrawal request submitted successfully!')
    showWithdrawModal.value = false
    withdrawAmount.value = 0
    selectedPaymentMethod.value = ''
    note.value = ''
    
    await loadPaymentRequests()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to submit withdrawal request')
  } finally {
    isSubmitting.value = false
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    approved: 'bg-green-500/10 text-green-600 dark:text-green-400',
    rejected: 'bg-red-500/10 text-red-600 dark:text-red-400',
    completed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
  }
  return classes[status] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
}

const getTransactionLabel = (type: string) => {
  const labels: Record<string, string> = {
    deposit: 'Deposit',
    withdraw: 'Withdrawal',
    bet_placed: 'Bet Placed',
    bet_win: 'Bet Win',
    bet_refund: 'Bet Refund'
  }
  return labels[type] || type
}

const formatBalance = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount || 0)
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await Promise.all([
    loadBalance(),
    loadPaymentMethods(),
    loadPaymentRequests(),
    loadTransactions(1)
  ])
  
  // Setup intersection observer after initial load
  nextTick(() => {
    setupIntersectionObserver()
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

useHead({
  title: 'Wallet - 2D3D'
})
</script>
