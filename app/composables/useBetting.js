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
  const gameSettings = ref({})
  const betAmounts = ref({})

  const loadGameSettings = async () => {
    try {
      const response = await api.getGameSettings()
      if (response.msgState === 'data') {
        response.data.forEach(setting => {
          gameSettings.value[setting.name] = setting.value
        })
        return { success: true, data: gameSettings.value }
      }
      return { success: false, error: 'Failed to load game settings' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const loadBetAmounts = async (gameType) => {
    try {
      const response = await api.getBetAmountByDigit(gameType)
      if (response.msgState === 'data') {
        betAmounts.value = response.data
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Failed to load bet amounts' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const placeBet = async (gameType, betDetails) => {
    if (!auth.isLoggedIn.value) {
      return { success: false, error: 'Please login first' }
    }

    const totalAmount = betDetails.reduce((sum, bet) => sum + parseInt(bet.amount), 0)

    if (auth.userBalance.value < totalAmount) {
      return { success: false, error: 'Insufficient balance' }
    }

    bettingLoading.value = true

    try {
      const response = await api.placeBet(gameType, betDetails)

      if (response.msgState === 'data') {
        await auth.refreshProfile()
        return { success: true, data: response.data, message: `${gameType} bet placed successfully!` }
      } else {
        return { success: false, error: response.errState || 'Failed to place bet' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      bettingLoading.value = false
    }
  }

  const mapBetStatus = (status) => {
    switch (status) {
      case 'Pay': return 'won'
      case 'Gain': return 'lost'
      case 'Unfinish': return 'pending'
      default: return 'pending'
    }
  }

  const getBetHistory = async (filters = {}) => {
    if (!auth.isLoggedIn.value) {
      console.log('User not logged in, skipping bet history fetch')
      return { success: false, error: 'Not logged in' }
    }
    
    bettingLoading.value = true

    try {
      console.log('Fetching bet history with filters:', filters)
      
      // Fetch both 2D and 3D bets
      const [response2D, response3D] = await Promise.all([
        api.getBetHistory({ page: 0, size: 50, gameType: '2D', ...filters }),
        api.getBetHistory({ page: 0, size: 50, gameType: '3D', ...filters })
      ])

      console.log('2D response:', response2D)
      console.log('3D response:', response3D)

      const bets2D = response2D.msgState === 'data' ? (response2D.data || []) : []
      const bets3D = response3D.msgState === 'data' ? (response3D.data || []) : []
      
      console.log('2D bets count:', bets2D.length)
      console.log('3D bets count:', bets3D.length)
      
      const allBets = [...bets2D, ...bets3D]
      
      // Sort by date descending
      allBets.sort((a, b) => (b.createdDateInMilliSeconds || 0) - (a.createdDateInMilliSeconds || 0))

      betHistory.value = allBets.map(bet => ({
        id: bet.id,
        token: bet.token,
        gameType: bet.gameType,
        status: mapBetStatus(bet.status),
        createdAt: bet.createdDateInMilliSeconds ? new Date(bet.createdDateInMilliSeconds).toISOString() : null,
        announcementId: bet.announcementId,
        betDetails: (bet.betDetails || []).map(detail => ({
          id: detail.id, digit: detail.digit, amount: detail.amount, isWin: detail.isWin, refundAmount: detail.refundAmount
        })),
        totalAmount: (bet.betDetails || []).reduce((sum, d) => sum + d.amount, 0),
        winAmount: (bet.betDetails || []).filter(d => d.isWin).reduce((sum, d) => sum + (d.amount * (bet.gameType === '2D' ? 85 : 500)), 0)
      }))
      
      console.log('Processed bet history:', betHistory.value.length, 'bets')
      return { success: true, data: betHistory.value }
    } catch (error) {
      console.error('Failed to load bet history:', error)
      return { success: false, error: 'Network error' }
    } finally {
      bettingLoading.value = false
    }
  }

  const loadMoreBetHistory = async (filters = {}) => {
    const currentPage = Math.ceil(betHistory.value.length / 20) // 10 per game type

    try {
      const [response2D, response3D] = await Promise.all([
        api.getBetHistory({ page: currentPage, size: 10, gameType: '2D', ...filters }),
        api.getBetHistory({ page: currentPage, size: 10, gameType: '3D', ...filters })
      ])

      const bets2D = response2D.msgState === 'data' ? (response2D.data || []) : []
      const bets3D = response3D.msgState === 'data' ? (response3D.data || []) : []
      
      if (bets2D.length > 0 || bets3D.length > 0) {
        const newBets = [...bets2D, ...bets3D]
          .sort((a, b) => (b.createdDateInMilliSeconds || 0) - (a.createdDateInMilliSeconds || 0))
          .map(bet => ({
            id: bet.id, token: bet.token, gameType: bet.gameType, status: mapBetStatus(bet.status),
            createdAt: bet.createdDateInMilliSeconds ? new Date(bet.createdDateInMilliSeconds).toISOString() : null,
            betDetails: (bet.betDetails || []).map(d => ({ id: d.id, digit: d.digit, amount: d.amount, isWin: d.isWin })),
            totalAmount: (bet.betDetails || []).reduce((sum, d) => sum + d.amount, 0),
            winAmount: (bet.betDetails || []).filter(d => d.isWin).reduce((sum, d) => sum + (d.amount * (bet.gameType === '2D' ? 85 : 500)), 0)
          }))
        betHistory.value.push(...newBets)
        return { success: true, hasMore: newBets.length >= 10 }
      }
      return { success: true, hasMore: false }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const get2DResults = async () => {
    try {
      const response = await api.get2DLiveResults()
      if (response.msgState === 'data') {
        results2D.value = response.data
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Failed to load 2D results' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const get3DResults = async () => {
    try {
      const response = await api.get3DResults()
      if (response.msgState === 'data') {
        results3D.value = response.data
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Failed to load 3D results' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const getAllResults = async () => {
    const [res2D, res3D] = await Promise.all([get2DResults(), get3DResults()])
    return { results2D: res2D.success ? res2D.data : [], results3D: res3D.success ? res3D.data : [] }
  }

  const formatBetAmount = (amount) => new Intl.NumberFormat('en-US').format(amount)
  const calculatePotentialWin = (gameType, amount) => amount * (gameSettings.value[gameType] || (gameType === '2D' ? 85 : 500))
  const getBetStatusColor = (status) => status === 'won' ? 'text-green-400' : status === 'lost' ? 'text-red-400' : 'text-yellow-400'
  const getBetStatusBg = (status) => status === 'won' ? 'bg-green-500' : status === 'lost' ? 'bg-red-500' : 'bg-yellow-500'
  const isDigitLimited = (gameType, digit) => {
    const limit = gameSettings.value[`${gameType} limit`]
    return limit && (betAmounts.value[digit] || 0) >= limit
  }
  const getMultiplier = (gameType) => gameSettings.value[gameType] || (gameType === '2D' ? 85 : 500)

  const totalBets = computed(() => betHistory.value.length)
  const totalWins = computed(() => betHistory.value.filter(bet => bet.status === 'won').length)
  const totalLosses = computed(() => betHistory.value.filter(bet => bet.status === 'lost').length)
  const pendingBets = computed(() => betHistory.value.filter(bet => bet.status === 'pending').length)
  const totalBetAmount = computed(() => betHistory.value.reduce((sum, bet) => sum + (bet.totalAmount || 0), 0))
  const totalWinAmount = computed(() => betHistory.value.filter(bet => bet.status === 'won').reduce((sum, bet) => sum + (bet.winAmount || 0), 0))
  const netProfit = computed(() => totalWinAmount.value - totalBetAmount.value)
  const winRate = computed(() => {
    const completed = totalWins.value + totalLosses.value
    return completed === 0 ? 0 : Math.round((totalWins.value / completed) * 100)
  })
  const recentResults = computed(() => {
    const recent2D = results2D.value.slice(0, 2).map(r => ({ ...r, gameType: '2D' }))
    const recent3D = results3D.value.slice(0, 2).map(r => ({ ...r, gameType: '3D' }))
    return [...recent2D, ...recent3D].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
  })

  return {
    bettingLoading, betHistory, results2D, results3D, gameSettings, betAmounts,
    loadGameSettings, loadBetAmounts, placeBet, getBetHistory, loadMoreBetHistory, get2DResults, get3DResults, getAllResults,
    formatBetAmount, calculatePotentialWin, getBetStatusColor, getBetStatusBg, isDigitLimited, getMultiplier,
    totalBets, totalWins, totalLosses, pendingBets, totalBetAmount, totalWinAmount, netProfit, winRate, recentResults
  }
}
