import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export const useBetting = () => {
  const api = useApi()
  const auth = useAuth()
  
  const bettingLoading = ref(false)
  const betHistory = ref([])
  const results2D = ref([])
  const results3D = ref([])
  
  // Place 2D/3D Bet
  const placeBet = async (gameType, betDetails) => {
    if (!auth.isLoggedIn.value) {
      return { success: false, error: 'Please login first' }
    }
    
    // Calculate total amount
    const totalAmount = betDetails.reduce((sum, bet) => sum + parseInt(bet.amount), 0)
    
    // Check balance
    if (auth.userBalance.value < totalAmount) {
      return { success: false, error: 'Insufficient balance' }
    }
    
    bettingLoading.value = true
    
    try {
      const response = await api.placeBet(gameType, betDetails)
      
      if (response.msgState === 'data') {
        // Deduct balance
        auth.deductBalance(totalAmount)
        
        // Add to local bet history
        betHistory.value.unshift(response.data)
        
        return { 
          success: true, 
          data: response.data,
          message: `${gameType} bet placed successfully!`
        }
      } else {
        return { success: false, error: 'Failed to place bet' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      bettingLoading.value = false
    }
  }
  
  // Get bet history with filters
  const getBetHistory = async (filters = {}) => {
    bettingLoading.value = true
    
    try {
      const response = await api.getBetHistory({
        page: 1,
        size: 50,
        ...filters
      })
      
      if (response.msgState === 'data') {
        betHistory.value = response.data
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Failed to load bet history' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      bettingLoading.value = false
    }
  }
  
  // Load more bet history (pagination)
  const loadMoreBetHistory = async (filters = {}) => {
    const currentPage = Math.ceil(betHistory.value.length / 10) + 1
    
    try {
      const response = await api.getBetHistory({
        page: currentPage,
        size: 10,
        ...filters
      })
      
      if (response.msgState === 'data' && response.data.length > 0) {
        betHistory.value.push(...response.data)
        return { success: true, hasMore: response.pageState !== 'noMore' }
      } else {
        return { success: true, hasMore: false }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }
  
  // Get 2D live results
  const get2DResults = async () => {
    try {
      const response = await api.get2DLiveResults()
      
      if (response.msgState === 'data') {
        results2D.value = response.data
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Failed to load 2D results' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }
  
  // Get 3D results
  const get3DResults = async () => {
    try {
      const response = await api.get3DResults()
      
      if (response.msgState === 'data') {
        results3D.value = response.data
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Failed to load 3D results' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }
  
  // Get combined results
  const getAllResults = async () => {
    const [results2D, results3D] = await Promise.all([
      get2DResults(),
      get3DResults()
    ])
    
    return {
      results2D: results2D.success ? results2D.data : [],
      results3D: results3D.success ? results3D.data : []
    }
  }
  
  // Utility functions
  const formatBetAmount = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount)
  }
  
  const calculatePotentialWin = (gameType, amount) => {
    const multiplier = gameType === '2D' ? 85 : 500
    return amount * multiplier
  }
  
  const getBetStatusColor = (status) => {
    switch (status) {
      case 'won': return 'text-green-400'
      case 'lost': return 'text-red-400'
      case 'pending': return 'text-yellow-400'
      default: return 'text-white'
    }
  }
  
  const getBetStatusBg = (status) => {
    switch (status) {
      case 'won': return 'bg-green-500'
      case 'lost': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }
  
  // Computed properties
  const totalBets = computed(() => betHistory.value.length)
  const totalWins = computed(() => betHistory.value.filter(bet => bet.status === 'won').length)
  const totalLosses = computed(() => betHistory.value.filter(bet => bet.status === 'lost').length)
  const pendingBets = computed(() => betHistory.value.filter(bet => bet.status === 'pending').length)
  
  const totalBetAmount = computed(() => {
    return betHistory.value.reduce((sum, bet) => {
      if (bet.betDetails) {
        return sum + bet.betDetails.reduce((betSum, detail) => betSum + parseInt(detail.amount), 0)
      }
      return sum + (bet.amount || 0)
    }, 0)
  })
  
  const totalWinAmount = computed(() => {
    return betHistory.value
      .filter(bet => bet.status === 'won')
      .reduce((sum, bet) => sum + (bet.winAmount || 0), 0)
  })
  
  const netProfit = computed(() => totalWinAmount.value - totalBetAmount.value)
  
  const winRate = computed(() => {
    if (totalBets.value === 0) return 0
    return Math.round((totalWins.value / totalBets.value) * 100)
  })
  
  // Recent results for home page
  const recentResults = computed(() => {
    const recent2D = results2D.value.slice(0, 2)
    const recent3D = results3D.value.slice(0, 2)
    
    return [
      ...recent2D.map(result => ({ ...result, gameType: '2D' })),
      ...recent3D.map(result => ({ ...result, gameType: '3D' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
  })
  
  return {
    // State
    bettingLoading,
    betHistory,
    results2D,
    results3D,
    
    // Actions
    placeBet,
    getBetHistory,
    loadMoreBetHistory,
    get2DResults,
    get3DResults,
    getAllResults,
    
    // Utilities
    formatBetAmount,
    calculatePotentialWin,
    getBetStatusColor,
    getBetStatusBg,
    
    // Computed
    totalBets,
    totalWins,
    totalLosses,
    pendingBets,
    totalBetAmount,
    totalWinAmount,
    netProfit,
    winRate,
    recentResults
  }
}