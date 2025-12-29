import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export const useSoccerBetting = () => {
  const api = useApi()
  const auth = useAuth()

  const loading = ref(false)
  const bettingLoading = ref(false)
  const matches = ref([])
  const selectedBets = ref([])
  const soccerBetHistory = ref([])

  // Load soccer matches based on type (Body or Maung)
  const loadMatches = async (gameType = 'Body') => {
    loading.value = true

    try {
      const response = await api.getSoccerGames(gameType)

      if (response.msgState === 'data') {
        // Transform API response to frontend format
        matches.value = (response.data || []).map(game => ({
          id: game.id,
          token: game.token,
          homeTeam: game.homeTeamNameInEng || game.homeTeamNameInMM,
          homeTeamMM: game.homeTeamNameInMM,
          awayTeam: game.awayTeamNameInEng || game.awayTeamNameInMM,
          awayTeamMM: game.awayTeamNameInMM,
          homeTeamId: game.homeTeamId,
          awayTeamId: game.awayTeamId,
          league: game.leagueGroupName,
          leagueGroupId: game.leagueGroupId,
          matchDate: game.startDateInMilliSeconds ? new Date(game.startDateInMilliSeconds).toISOString().split('T')[0] : null,
          matchTime: game.startDateInMilliSeconds ? new Date(game.startDateInMilliSeconds).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
          startDate: game.startDateInMilliSeconds,
          endDate: game.endDateInMilliSeconds,
          homeBet: game.homeBet,
          awayBet: game.awayBet,
          gp: game.gp,
          status: game.status === 'On_Progress' ? 'upcoming' : game.status?.toLowerCase(),
          betOpen: game.betOpen,
          liveOpen: game.liveOpen,
          liveLink: game.liveLink,
          liveCost: game.liveCost,
          homeResult: game.homeResult,
          awayResult: game.awayResult,
          gameType: gameType
        }))
        return { success: true, data: matches.value }
      }
      return { success: false, error: 'Failed to load matches' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      loading.value = false
    }
  }

  // Place soccer bet (Maung style - single amount for all bets, min 3 max 10 selections)
  const placeMaungBet = async (amount, soccerBetDetails) => {
    if (!auth.isLoggedIn.value) {
      return { success: false, error: 'Please login first' }
    }

    if (soccerBetDetails.length < 3) {
      return { success: false, error: 'Minimum 3 selections required for Maung bet' }
    }

    if (soccerBetDetails.length > 10) {
      return { success: false, error: 'Maximum 10 selections allowed for Maung bet' }
    }

    const totalAmount = amount

    if (auth.userBalance.value < totalAmount) {
      return { success: false, error: 'Insufficient balance' }
    }

    bettingLoading.value = true

    try {
      const betData = {
        gameType: 'Maung',
        amount,
        soccerBetDetails: soccerBetDetails.map(bet => ({
          gameId: bet.gameId,
          betTeamId: bet.betTeamId,
          betUnder: bet.betUnder || false
        }))
      }

      const response = await api.placeSoccerBet(betData)

      if (response.msgState === 'data') {
        await auth.refreshProfile()
        clearSelectedBets()
        return { success: true, data: response.data, message: `Maung bet placed successfully! Total: ${totalAmount.toLocaleString()} MMK` }
      }
      return { success: false, error: response.errState || 'Failed to place bet' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      bettingLoading.value = false
    }
  }

  // Place soccer bet (Body style - individual amounts per bet)
  const placeBodyBet = async (soccerBetDetails) => {
    if (!auth.isLoggedIn.value) {
      return { success: false, error: 'Please login first' }
    }

    const totalAmount = soccerBetDetails.reduce((sum, bet) => sum + (bet.amount || 0), 0)

    if (auth.userBalance.value < totalAmount) {
      return { success: false, error: 'Insufficient balance' }
    }

    bettingLoading.value = true

    try {
      const betData = {
        gameType: 'Body',
        soccerBetDetails: soccerBetDetails.map(bet => ({
          gameId: bet.gameId,
          betTeamId: bet.betTeamId,
          betUnder: bet.betUnder || false,
          amount: bet.amount
        }))
      }

      const response = await api.placeSoccerBet(betData)

      if (response.msgState === 'data') {
        await auth.refreshProfile()
        clearSelectedBets()
        return { success: true, data: response.data, message: `Body bet placed successfully! Total: ${totalAmount.toLocaleString()} MMK` }
      }
      return { success: false, error: response.errState || 'Failed to place bet' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      bettingLoading.value = false
    }
  }

  // Generic place soccer bet function
  const placeSoccerBet = async (betData) => {
    const { gameType, amount, soccerBetDetails } = betData

    if (gameType === 'Maung' && amount) {
      return await placeMaungBet(amount, soccerBetDetails)
    } else {
      return await placeBodyBet(soccerBetDetails)
    }
  }

  // Get soccer bet history
  const getSoccerBetHistory = async (params = {}) => {
    if (!auth.isLoggedIn.value) {
      console.log('User not logged in, skipping soccer bet history fetch')
      return { success: false, error: 'Not logged in' }
    }
    
    loading.value = true

    try {
      console.log('Fetching soccer bet history with params:', params)
      const response = await api.getSoccerBetHistory(params)
      console.log('Soccer bet history response:', response)

      if (response.msgState === 'data') {
        const bets = response.data || []
        console.log('Soccer bets count:', bets.length)
        
        soccerBetHistory.value = bets.map(bet => ({
          id: bet.id,
          token: bet.token,
          gameType: bet.gameType || bet.soccerType,
          status: mapSoccerBetStatus(bet.status),
          amount: bet.amount,
          totalAmount: bet.totalAmount || bet.amount,
          winAmount: bet.winAmount || 0,
          createdAt: bet.createdDateInMilliSeconds ? new Date(bet.createdDateInMilliSeconds).toISOString() : null,
          soccerBetDetails: bet.soccerBetDetails || []
        }))
        return { success: true, data: soccerBetHistory.value }
      }
      return { success: false, error: 'Failed to load bet history' }
    } catch (error) {
      console.error('Failed to load soccer bet history:', error)
      return { success: false, error: 'Network error' }
    } finally {
      loading.value = false
    }
  }

  const mapSoccerBetStatus = (status) => {
    switch (status) {
      case 'Pay': return 'won'
      case 'Gain': return 'lost'
      case 'Unfinish': return 'pending'
      default: return 'pending'
    }
  }

  // Get bet detail
  const getSoccerBetDetail = async (betId) => {
    loading.value = true

    try {
      const response = await api.getSoccerBetDetail(betId)

      if (response.msgState === 'data') {
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Failed to load bet detail' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      loading.value = false
    }
  }

  // Bet selection management
  const addBet = (bet) => {
    const existingIndex = selectedBets.value.findIndex(b => b.matchId === bet.matchId && b.optionId === bet.optionId)
    if (existingIndex > -1) {
      selectedBets.value.splice(existingIndex, 1)
    } else {
      selectedBets.value.push(bet)
    }
  }

  const removeBet = (bet) => {
    const index = selectedBets.value.findIndex(b => b.matchId === bet.matchId && b.optionId === bet.optionId)
    if (index > -1) {
      selectedBets.value.splice(index, 1)
    }
  }

  const clearSelectedBets = () => {
    selectedBets.value = []
  }

  const updateBetAmount = (matchId, optionId, amount) => {
    const bet = selectedBets.value.find(b => b.matchId === matchId && b.optionId === optionId)
    if (bet) {
      bet.amount = amount
    }
  }

  // Computed properties
  const totalSelectedBets = computed(() => selectedBets.value.length)
  const totalBetAmount = computed(() => selectedBets.value.reduce((sum, bet) => sum + (bet.amount || 0), 0))
  const potentialWin = computed(() => selectedBets.value.reduce((sum, bet) => {
    const amount = bet.amount || 0
    const odds = parseFloat(bet.odds) || 1
    return sum + (amount * odds)
  }, 0))
  const canPlaceBet = computed(() => selectedBets.value.length > 0 && totalBetAmount.value > 0 && totalBetAmount.value <= auth.userBalance.value && auth.isLoggedIn.value)

  const formatAmount = (amount) => new Intl.NumberFormat('en-US').format(amount)
  const formatOdds = (odds) => parseFloat(odds).toFixed(2)
  const getBetStatusColor = (status) => status === 'won' ? 'text-green-400' : status === 'lost' ? 'text-red-400' : 'text-yellow-400'
  const getBetStatusBg = (status) => status === 'won' ? 'bg-green-500' : status === 'lost' ? 'bg-red-500' : 'bg-yellow-500'

  return {
    loading, bettingLoading, matches, selectedBets, soccerBetHistory,
    loadMatches, placeSoccerBet, placeMaungBet, placeBodyBet, getSoccerBetHistory, getSoccerBetDetail,
    addBet, removeBet, clearSelectedBets, updateBetAmount,
    totalSelectedBets, totalBetAmount, potentialWin, canPlaceBet,
    formatAmount, formatOdds, getBetStatusColor, getBetStatusBg
  }
}
