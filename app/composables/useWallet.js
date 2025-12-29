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
  const currentPage = ref(0)
  const hasMoreTransactions = ref(true)

  const loadPaymentMethods = async () => {
    paymentMethodsLoading.value = true

    try {
      const response = await api.getPaymentMethods()

      if (response.msgState === 'data') {
        paymentMethods.value = response.data
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Failed to load payment methods' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      paymentMethodsLoading.value = false
    }
  }

  const loadTransactionHistory = async (filters = {}) => {
    transactionLoading.value = true
    currentPage.value = 0

    try {
      const params = { page: 0, size: 20, ...filters }
      const response = await api.getTransactionHistory(params)

      if (response.msgState === 'data') {
        transactions.value = response.data
        hasMoreTransactions.value = response.pageState !== 'noMore'
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Failed to load transaction history' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      transactionLoading.value = false
    }
  }

  const loadMoreTransactions = async (filters = {}) => {
    if (!hasMoreTransactions.value || transactionLoading.value) return

    transactionLoading.value = true
    const nextPage = currentPage.value + 1

    try {
      const params = { page: nextPage, size: 20, ...filters }
      const response = await api.getTransactionHistory(params)

      if (response.msgState === 'data' && response.data.length > 0) {
        transactions.value.push(...response.data)
        currentPage.value = nextPage
        hasMoreTransactions.value = response.pageState !== 'noMore'
        return { success: true, hasMore: hasMoreTransactions.value }
      }
      hasMoreTransactions.value = false
      return { success: true, hasMore: false }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      transactionLoading.value = false
    }
  }

  // Deposit request - POST /api/balance-transaction with type: "In"
  const requestDeposit = async (paymentMethodId, transactionId) => {
    if (!auth.isLoggedIn.value) {
      return { success: false, error: 'Please login first' }
    }

    transactionLoading.value = true

    try {
      const response = await api.balanceTransaction({
        type: 'deposit',
        paymentMethodId,
        transactionId
      })

      if (response.msgState === 'data') {
        await loadTransactionHistory()
        return { success: true, data: response.data, message: 'Deposit request submitted successfully' }
      }
      return { success: false, error: 'Failed to submit deposit request' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      transactionLoading.value = false
    }
  }

  // Withdrawal request - POST /api/balance-transaction with type: "Out"
  const requestWithdrawal = async (paymentMethodId, amount, phoneNo) => {
    if (!auth.isLoggedIn.value) {
      return { success: false, error: 'Please login first' }
    }

    if (amount > auth.userBalance.value) {
      return { success: false, error: 'Insufficient balance' }
    }

    transactionLoading.value = true

    try {
      const response = await api.balanceTransaction({
        type: 'withdrawal',
        paymentMethodId,
        amount,
        phoneNo
      })

      if (response.msgState === 'data') {
        await loadTransactionHistory()
        await auth.refreshProfile()
        return { success: true, data: response.data, message: 'Withdrawal request submitted successfully' }
      }
      return { success: false, error: 'Failed to submit withdrawal request' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      transactionLoading.value = false
    }
  }

  // Legacy function for backward compatibility
  const processBalanceTransaction = async (transactionData) => {
    if (transactionData.type === 'deposit') {
      return requestDeposit(transactionData.paymentMethodId, transactionData.transactionId)
    } else {
      return requestWithdrawal(transactionData.paymentMethodId, transactionData.amount, transactionData.phoneNo)
    }
  }

  const formatAmount = (amount) => new Intl.NumberFormat('en-US').format(amount)
  const getTransactionIcon = (type) => type === 'deposit' ? '↗️' : '↙️'
  const getTransactionColor = (type) => type === 'deposit' ? 'text-green-400' : 'text-red-400'
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white'
      case 'pending': return 'bg-yellow-500 text-black'
      case 'failed': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const activePaymentMethods = computed(() => paymentMethods.value.filter(m => m.isActive))
  const totalTransactions = computed(() => transactions.value.length)
  const totalDeposits = computed(() => transactions.value.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))
  const totalWithdrawals = computed(() => transactions.value.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))
  const pendingTransactions = computed(() => transactions.value.filter(t => t.status === 'pending'))
  const recentTransactions = computed(() => transactions.value.slice(0, 5))
  const canLoadMore = computed(() => hasMoreTransactions.value && !transactionLoading.value)

  const getMonthlyStats = (month, year) => {
    const monthly = transactions.value.filter(t => {
      const d = new Date(t.createdAt)
      return d.getMonth() === month && d.getFullYear() === year && t.status === 'completed'
    })
    const deposits = monthly.filter(t => t.type === 'deposit')
    const withdrawals = monthly.filter(t => t.type === 'withdrawal')
    return {
      totalDeposits: deposits.reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: withdrawals.reduce((sum, t) => sum + t.amount, 0),
      totalTransactions: monthly.length,
      netAmount: deposits.reduce((sum, t) => sum + t.amount, 0) - withdrawals.reduce((sum, t) => sum + t.amount, 0)
    }
  }

  const filterTransactions = (filters) => {
    let filtered = [...transactions.value]
    if (filters.type) filtered = filtered.filter(t => t.type === filters.type)
    if (filters.status) filtered = filtered.filter(t => t.status === filters.status)
    if (filters.paymentMethodId) filtered = filtered.filter(t => t.paymentMethodId === filters.paymentMethodId)
    if (filters.fromDate) filtered = filtered.filter(t => new Date(t.createdAt) >= new Date(filters.fromDate))
    if (filters.toDate) filtered = filtered.filter(t => new Date(t.createdAt) <= new Date(filters.toDate))
    return filtered
  }

  return {
    paymentMethods, transactions, paymentMethodsLoading, transactionLoading, canLoadMore,
    loadPaymentMethods, loadTransactionHistory, loadMoreTransactions, requestDeposit, requestWithdrawal, processBalanceTransaction,
    formatAmount, getTransactionIcon, getTransactionColor, getStatusBadgeColor, getMonthlyStats, filterTransactions,
    activePaymentMethods, totalTransactions, totalDeposits, totalWithdrawals, pendingTransactions, recentTransactions
  }
}
