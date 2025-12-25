<template>
  <div class="min-h-screen text-white">
    <!-- Balance Display -->
    <div class="px-4 py-3">
      <div class="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
        <div class="flex items-center justify-between mb-3">
          <div class="flex-1">
            <p class="text-white text-xs opacity-60 mb-1">{{ t('availableBalance') }}</p>
            <p class="text-white text-3xl font-bold">{{ formatBalance(userBalance) }} {{ t('mmk') }}</p>
          </div>
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button @click="showDepositModal = true" 
                  class="bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 text-sm font-semibold flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ t('deposit') }}
          </button>
          <button @click="showWithdrawModal = true" 
                  class="bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 text-sm font-semibold flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
            {{ t('withdraw') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="px-4 py-2">
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <p class="text-lg font-bold text-green-400">{{ formatBalance(monthlyStats.totalDeposits) }}</p>
          <p class="text-xs opacity-70">{{ t('thisMonth') }}</p>
          <p class="text-xs opacity-70">{{ t('deposits') }}</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <p class="text-lg font-bold text-red-400">{{ formatBalance(monthlyStats.totalWithdrawals) }}</p>
          <p class="text-xs opacity-70">{{ t('thisMonth') }}</p>
          <p class="text-xs opacity-70">{{ t('withdrawals') }}</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <p class="text-lg font-bold text-blue-400">{{ monthlyStats.totalTransactions }}</p>
          <p class="text-xs opacity-70">{{ t('thisMonth') }}</p>
          <p class="text-xs opacity-70">{{ t('transactions') }}</p>
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="px-4 py-2">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">{{ t('paymentMethods') }}</h2>
        <button @click="loadPaymentMethods" :disabled="paymentMethodsLoading" class="text-sm text-blue-400 hover:text-blue-300">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('refresh') }}
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="paymentMethodsLoading" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      </div>
      
      <!-- Payment Methods Grid -->
      <div v-else class="grid grid-cols-2 gap-3">
        <div v-for="method in paymentMethods" :key="method.id"
             :class="[
               'bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border transition-colors',
               method.isActive 
                 ? 'border-green-500/30 hover:bg-white/20' 
                 : 'border-gray-500/30 opacity-50'
             ]">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p class="text-sm font-semibold">{{ method.name }}</p>
          <p class="text-xs opacity-70">{{ method.type }}</p>
          <div v-if="method.isActive" class="mt-2">
            <span class="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
            <span class="text-xs text-green-400">{{ t('active') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="px-4 py-2">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">{{ t('transactionHistory') }}</h2>
        <div class="flex items-center space-x-2">
          <!-- Filter Dropdown -->
          <select v-model="transactionFilter" @change="loadTransactionHistory" 
                  class="bg-white/20 text-white rounded-lg px-3 py-1 text-sm border border-white/30">
            <option value="all">{{ t('allTransactions') }}</option>
            <option value="deposit">{{ t('deposits') }}</option>
            <option value="withdrawal">{{ t('withdrawals') }}</option>
            <option value="completed">{{ t('completed') }}</option>
            <option value="pending">{{ t('pending') }}</option>
          </select>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="transactionLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p class="text-sm opacity-70 mt-2">{{ t('loadingTransactions') }}</p>
      </div>
      
      <!-- Transaction List -->
      <div v-else class="space-y-3">
        <div v-for="transaction in transactions" :key="transaction.id"
             class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                transaction.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'
              ]">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="transaction.type === 'deposit'" 
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 4v16m8-8H4" />
                  <path v-else 
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M20 12H4" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold">{{ getTransactionTitle(transaction) }}</p>
                <p class="text-xs opacity-70">{{ formatDateTime(transaction.createdAt) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p :class="[
                'text-lg font-bold',
                transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
              ]">
                {{ transaction.type === 'deposit' ? '+' : '-' }}{{ formatBalance(transaction.amount) }}
              </p>
              <div :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                getStatusColor(transaction.status)
              ]">
                {{ getStatusText(transaction.status) }}
              </div>
            </div>
          </div>
          
          <!-- Transaction Details -->
          <div class="bg-white/5 rounded-lg p-3 mt-3">
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="opacity-70">{{ t('transactionId') }}:</span>
                <span class="font-mono ml-1">#{{ transaction.id }}</span>
              </div>
              <div>
                <span class="opacity-70">{{ t('paymentMethod') }}:</span>
                <span class="ml-1">{{ transaction.paymentMethod || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="transactions.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-white/70 text-sm">{{ t('noTransactionsFound') }}</p>
          <p class="text-white/50 text-xs mt-1">{{ t('startTransactingToSeeHistory') }}</p>
        </div>
      </div>
      
      <!-- Load More Button -->
      <div v-if="transactions.length > 0 && canLoadMore" class="px-4 py-4">
        <button @click="loadMoreTransactions" 
                :disabled="transactionLoading"
                class="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
          {{ transactionLoading ? t('loading') : t('loadMore') }}
        </button>
      </div>
    </div>

    <!-- Deposit Modal -->
    <div v-if="showDepositModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full max-w-md border border-white/20">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ t('deposit') }}</h3>
          <button @click="closeDepositModal" class="text-white/70 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Amount Input -->
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('amount') }} ({{ t('mmk') }})</label>
            <input v-model.number="depositForm.amount" type="number" min="1000" step="1000"
                   class="w-full bg-white/20 text-white rounded-lg px-3 py-3 placeholder-white/50 border border-white/30 focus:border-green-500 focus:outline-none">
            <div class="flex gap-2 mt-2">
              <button v-for="amount in [10000, 50000, 100000, 500000]" :key="amount"
                      @click="depositForm.amount = amount"
                      class="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors">
                {{ formatBalance(amount) }}
              </button>
            </div>
          </div>
          
          <!-- Payment Method Selection -->
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('paymentMethod') }}</label>
            <select v-model="depositForm.paymentMethodId" 
                    class="w-full bg-white/20 text-white rounded-lg px-3 py-3 border border-white/30 focus:border-green-500 focus:outline-none">
              <option value="">{{ t('selectPaymentMethod') }}</option>
              <option v-for="method in activePaymentMethods" :key="method.id" :value="method.id">
                {{ method.name }}
              </option>
            </select>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button @click="processDeposit" 
                    :disabled="!canProcessDeposit || transactionLoading"
                    :class="[
                      'flex-1 py-3 rounded-lg font-semibold transition-colors',
                      canProcessDeposit && !transactionLoading
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    ]">
              <div v-if="transactionLoading" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ t('processing') }}
              </div>
              <span v-else>{{ t('deposit') }}</span>
            </button>
            <button @click="closeDepositModal" 
                    class="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
              {{ t('cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Withdraw Modal -->
    <div v-if="showWithdrawModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full max-w-md border border-white/20">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ t('withdraw') }}</h3>
          <button @click="closeWithdrawModal" class="text-white/70 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Available Balance Info -->
          <div class="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <p class="text-sm text-blue-300">{{ t('availableBalance') }}</p>
            <p class="text-xl font-bold">{{ formatBalance(userBalance) }} {{ t('mmk') }}</p>
          </div>
          
          <!-- Amount Input -->
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('withdrawAmount') }} ({{ t('mmk') }})</label>
            <input v-model.number="withdrawForm.amount" type="number" min="1000" :max="userBalance" step="1000"
                   class="w-full bg-white/20 text-white rounded-lg px-3 py-3 placeholder-white/50 border border-white/30 focus:border-red-500 focus:outline-none">
            <div class="flex gap-2 mt-2">
              <button v-for="percentage in [25, 50, 75, 100]" :key="percentage"
                      @click="withdrawForm.amount = Math.floor(userBalance * percentage / 100)"
                      class="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors">
                {{ percentage }}%
              </button>
            </div>
          </div>
          
          <!-- Payment Method Selection -->
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('withdrawTo') }}</label>
            <select v-model="withdrawForm.paymentMethodId" 
                    class="w-full bg-white/20 text-white rounded-lg px-3 py-3 border border-white/30 focus:border-red-500 focus:outline-none">
              <option value="">{{ t('selectPaymentMethod') }}</option>
              <option v-for="method in activePaymentMethods" :key="method.id" :value="method.id">
                {{ method.name }}
              </option>
            </select>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button @click="processWithdraw" 
                    :disabled="!canProcessWithdraw || transactionLoading"
                    :class="[
                      'flex-1 py-3 rounded-lg font-semibold transition-colors',
                      canProcessWithdraw && !transactionLoading
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    ]">
              <div v-if="transactionLoading" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ t('processing') }}
              </div>
              <span v-else>{{ t('withdraw') }}</span>
            </button>
            <button @click="closeWithdrawModal" 
                    class="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
              {{ t('cancel') }}
            </button>
          </div>
        </div>
      </div>
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
import { useWallet } from '~/composables/useWallet'

const { t } = useLanguage()
const { userBalance, isLoggedIn } = useAuth()
const {
  paymentMethods,
  transactions,
  paymentMethodsLoading,
  transactionLoading,
  loadPaymentMethods,
  loadTransactionHistory,
  processBalanceTransaction,
  loadMoreTransactions,
  canLoadMore
} = useWallet()

// Modal states
const showDepositModal = ref(false)
const showWithdrawModal = ref(false)
const message = ref('')
const messageType = ref('success')

// Filter state
const transactionFilter = ref('all')

// Form states
const depositForm = ref({
  amount: 10000,
  paymentMethodId: ''
})

const withdrawForm = ref({
  amount: 0,
  paymentMethodId: ''
})

// Monthly stats (computed from transactions)
const monthlyStats = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyTransactions = transactions.value.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt)
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear
  })
  
  const deposits = monthlyTransactions.filter(t => t.type === 'deposit')
  const withdrawals = monthlyTransactions.filter(t => t.type === 'withdrawal')
  
  return {
    totalDeposits: deposits.reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: withdrawals.reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: monthlyTransactions.length
  }
})

// Active payment methods
const activePaymentMethods = computed(() => {
  return paymentMethods.value.filter(method => method.isActive)
})

// Form validation
const canProcessDeposit = computed(() => {
  return depositForm.value.amount >= 1000 && 
         depositForm.value.paymentMethodId && 
         isLoggedIn.value
})

const canProcessWithdraw = computed(() => {
  return withdrawForm.value.amount >= 1000 && 
         withdrawForm.value.amount <= userBalance.value &&
         withdrawForm.value.paymentMethodId && 
         isLoggedIn.value
})

// Utility functions
const formatBalance = (balance) => {
  return new Intl.NumberFormat('en-US').format(balance)
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionTitle = (transaction) => {
  const baseTitle = transaction.type === 'deposit' ? t('deposit') : t('withdrawal')
  return `${baseTitle} - ${transaction.paymentMethod || 'N/A'}`
}

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'bg-green-500 text-white'
    case 'pending': return 'bg-yellow-500 text-black'
    case 'failed': return 'bg-red-500 text-white'
    case 'cancelled': return 'bg-gray-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed': return t('completed')
    case 'pending': return t('pending')
    case 'failed': return t('failed')
    case 'cancelled': return t('cancelled')
    default: return status
  }
}

// Modal functions
const closeDepositModal = () => {
  showDepositModal.value = false
  depositForm.value = {
    amount: 10000,
    paymentMethodId: ''
  }
}

const closeWithdrawModal = () => {
  showWithdrawModal.value = false
  withdrawForm.value = {
    amount: 0,
    paymentMethodId: ''
  }
}

// Transaction processing
const processDeposit = async () => {
  if (!canProcessDeposit.value) return
  
  try {
    const transactionData = {
      type: 'deposit',
      amount: depositForm.value.amount,
      paymentMethodId: depositForm.value.paymentMethodId
    }
    
    const result = await processBalanceTransaction(transactionData)
    
    if (result.success) {
      showMessage(t('depositRequestSubmitted'), 'success')
      closeDepositModal()
      await loadTransactionHistory()
    } else {
      showMessage(result.error || t('depositFailed'), 'error')
    }
  } catch (error) {
    showMessage(t('errorProcessingDeposit'), 'error')
  }
}

const processWithdraw = async () => {
  if (!canProcessWithdraw.value) return
  
  try {
    const transactionData = {
      type: 'withdrawal',
      amount: withdrawForm.value.amount,
      paymentMethodId: withdrawForm.value.paymentMethodId
    }
    
    const result = await processBalanceTransaction(transactionData)
    
    if (result.success) {
      showMessage(t('withdrawalRequestSubmitted'), 'success')
      closeWithdrawModal()
      await loadTransactionHistory()
    } else {
      showMessage(result.error || t('withdrawalFailed'), 'error')
    }
  } catch (error) {
    showMessage(t('errorProcessingWithdrawal'), 'error')
  }
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// Load data on mount
onMounted(async () => {
  if (isLoggedIn.value) {
    await Promise.all([
      loadPaymentMethods(),
      loadTransactionHistory()
    ])
  }
})

// Watch for filter changes
const handleFilterChange = async () => {
  const filters = {}
  
  if (transactionFilter.value !== 'all') {
    if (['deposit', 'withdrawal'].includes(transactionFilter.value)) {
      filters.type = transactionFilter.value
    } else if (['completed', 'pending', 'failed', 'cancelled'].includes(transactionFilter.value)) {
      filters.status = transactionFilter.value
    }
  }
  
  await loadTransactionHistory(filters)
}

// Update the loadTransactionHistory call to use the filter
const loadTransactionHistoryWithFilter = () => {
  handleFilterChange()
}
</script>