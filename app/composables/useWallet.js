import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export const useWallet = () => {
  const api = useApi()
  const auth = useAuth()
  
  const paymentMethods = ref([])
  const transactions = ref([])
  const paymentMethodsLoading = ref(false)
  const transactionLoading = ref(false)
  const currentPage = ref(1)
  const hasMoreTransactions = ref(true)
  
  // Load payment methods
  const loadPaymentMethods = async () => {
    paymentMethodsLoading.value = true
    
    try {
      const response = await api.getPaymentMethods()
      
      if (response.msgState === 'data') {
        paymentMethods.value = response.data
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Failed to load payment methods' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      paymentMethodsLoading.value = false
    }
  }
  
  // Load transaction history
  const loadTransactionHistory = async (filters = {}) => {
    transactionLoading.value = true
    currentPage.value = 1
    
    try {
      const params = {
        page: 1,
        size: 20,
        ...filters
      }
      
      const response = await api.getTransactionHistory(params)
      
      if (response.msgState === 'data') {
        transactions.value = response.data
        hasMoreTransactions.value = response.pageState !== 'noMore'
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Failed to load transaction history' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      transactionLoading.value = false
    }
  }
  
  // Load more transactions (pagination)
  const loadMoreTransactions = async (filters = {}) => {
    if (!hasMoreTransactions.value || transactionLoading.value) return
    
    transactionLoading.value = true
    const nextPage = currentPage.value + 1
    
    try {
      const params = {
        page: nextPage,
        size: 20,
        ...filters
      }
      
      const response = await api.getTransactionHistory(params)
      
      if (response.msgState === 'data' && response.data.length > 0) {
        transactions.value.push(...response.data)
        currentPage.value = nextPage
        hasMoreTransactions.value = response.pageState !== 'noMore'
        return { success: true, hasMore: hasMoreTransactions.value }
      } else {
        hasMoreTransactions.value = false
        return { success: true, hasMore: false }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      transactionLoading.value = false
    }
  }
  
  // Process balance transaction (deposit/withdrawal)
  const processBalanceTransaction = async (transactionData) => {
    if (!auth.isLoggedIn.value) {
      return { success: false, error: 'Please login first' }
    }
    
    transactionLoading.value = true
    
    try {
      // API call: POST /balance-transaction
      const response = await api.balanceTransaction(transactionData)
      
      if (response.msgState === 'data') {
        // Add to local transaction history
        transactions.value.unshift(response.data)
        
        // If it's a completed deposit, update balance
        if (transactionData.type === 'deposit' && response.data.status === 'completed') {
          auth.addBalance(transactionData.amount)
        }
        
        return { 
          success: true, 
          data: response.data,
          message: getTransactionMessage(transactionData.type, 'success')
        }
      } else {
        return { 
          success: false, 
          error: getTransactionMessage(transactionData.type, 'failed')
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error'
      }
    } finally {
      transactionLoading.value = false
    }
  }
  
  // Get transaction success/error messages
  const getTransactionMessage = (type, status) => {
    const messages = {
      deposit: {
        success: 'Deposit request submitted successfully',
        failed: 'Failed to process deposit'
      },
      withdrawal: {
        success: 'Withdrawal request submitted successfully', 
        failed: 'Failed to process withdrawal'
      }
    }
    
    return messages[type]?.[status] || 'Transaction processed'
  }
  
  // Utility functions
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount)
  }
  
  const getTransactionIcon = (type) => {
    return type === 'deposit' ? '↗️' : '↙️'
  }
  
  const getTransactionColor = (type) => {
    return type === 'deposit' ? 'text-green-400' : 'text-red-400'
  }
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white'
      case 'pending': return 'bg-yellow-500 text-black'
      case 'failed': return 'bg-red-500 text-white'
      case 'cancelled': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }
  
  // Computed properties
  const activePaymentMethods = computed(() => {
    return paymentMethods.value.filter(method => method.isActive)
  })
  
  const totalTransactions = computed(() => transactions.value.length)
  
  const totalDeposits = computed(() => {
    return transactions.value
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  })
  
  const totalWithdrawals = computed(() => {
    return transactions.value
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  })
  
  const pendingTransactions = computed(() => {
    return transactions.value.filter(t => t.status === 'pending')
  })
  
  const recentTransactions = computed(() => {
    return transactions.value.slice(0, 5)
  })
  
  const canLoadMore = computed(() => {
    return hasMoreTransactions.value && !transactionLoading.value
  })
  
  // Monthly statistics
  const getMonthlyStats = (month, year) => {
    const monthlyTransactions = transactions.value.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt)
      return transactionDate.getMonth() === month && 
             transactionDate.getFullYear() === year &&
             transaction.status === 'completed'
    })
    
    const deposits = monthlyTransactions.filter(t => t.type === 'deposit')
    const withdrawals = monthlyTransactions.filter(t => t.type === 'withdrawal')
    
    return {
      totalDeposits: deposits.reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: withdrawals.reduce((sum, t) => sum + t.amount, 0),
      totalTransactions: monthlyTransactions.length,
      netAmount: deposits.reduce((sum, t) => sum + t.amount, 0) - 
                withdrawals.reduce((sum, t) => sum + t.amount, 0)
    }
  }
  
  // Filter transactions
  const filterTransactions = (filters) => {
    let filtered = [...transactions.value]
    
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type)
    }
    
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status)
    }
    
    if (filters.paymentMethodId) {
      filtered = filtered.filter(t => t.paymentMethodId === filters.paymentMethodId)
    }
    
    if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate)
      filtered = filtered.filter(t => new Date(t.createdAt) >= fromDate)
    }
    
    if (filters.toDate) {
      const toDate = new Date(filters.toDate)
      filtered = filtered.filter(t => new Date(t.createdAt) <= toDate)
    }
    
    return filtered
  }
  
  return {
    // State
    paymentMethods,
    transactions,
    paymentMethodsLoading,
    transactionLoading,
    canLoadMore,
    
    // Actions
    loadPaymentMethods,
    loadTransactionHistory,
    loadMoreTransactions,
    processBalanceTransaction,
    
    // Utilities
    formatAmount,
    getTransactionIcon,
    getTransactionColor,
    getStatusBadgeColor,
    getMonthlyStats,
    filterTransactions,
    
    // Computed
    activePaymentMethods,
    totalTransactions,
    totalDeposits,
    totalWithdrawals,
    pendingTransactions,
    recentTransactions
  }
}