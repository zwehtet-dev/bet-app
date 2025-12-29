import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

// Singleton state for pagination
const matchesPage = ref(0)
const matchesHasMore = ref(true)
const PAGE_SIZE = 10

export const useSoccerBetting = () => {
  const api = useApi()
  const auth = useAuth()

  const loading = ref(false)
  const loadingMore = ref(false)
  const bettingLoading = ref(false)
  const matches = ref([])
  const selectedBets = ref([])
  const soccerBetHistory = ref([])
  const currentGameType = ref('Body')

  // Transform API response to frontend format
  const transformMatch = (game, gameType) => ({
    id: game.id,
    token: game.token,
    homeTeam: game.homeTeam || { nameInMM: 'Home Team', nameInEng: 'Home Team' },
    awayTeam: game.awayTeam || { nameInMM: 'Away Team', nameInEng: 'Away Team' },
    homeTeamId: game.homeTeamId,
    awayTeamId: game.awayTeamId,
    leagueGroupName: game.leagueGroupName,
    leagueGroupId: game.leagueGroupId,
    startDateInMilliSeconds: game.startDateInMilliSeconds,
    endDateInMilliSeconds: game.endDateInMilliSeconds,
    homeBet: game.homeBet,
    awayBet: game.awayBet,
    gp: game.gp,
    status: game.status,
    betOpen: game.betOpen,
    gameOpen: game.gameOpen,
    liveOpen: game.liveOpen,
    liveLink: game.liveLink,
    liveCost: game.liveCost,
    homeResult: game.homeResult,
    awayResult: game.awayResult,
    matchClone: game.matchClone,
    gameType: gameType,
    createdDateInMilliSeconds: game.createdDateInMilliSeconds,
    updatedDateInMilliSeconds: game.updatedDateInMilliSeconds
  })

  // Load soccer matches with pagination support
  const loadMatches = async (gameType = 'Body', reset = true) => {
    if (reset) {
      loading.value = true
      matchesPage.value = 0
      matchesHasMore.value = true
      matches.value = []
    }
    
    currentGameType.value = gameType

    try {
      const response = await api.getSoccerGames(gameType)

      if (response.msgState === 'data') {
        const newMatches = (response.data || []).map(game => transformMatch(game, gameType))
        
        if (reset) {
          matches.value = newMatches
        } else {
          matches.value = [...matches.value, ...newMatches]
        }
        
        // Check if there's more data (API doesn't support pagination yet, so we load all)
        matchesHasMore.value = false
        
        return { success: true, data: matches.value }
      }
      return { success: false, error: 'Failed to load matches' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  // Load more matches (for infinite scroll - currently loads all at once since API doesn't paginate)
  const loadMoreMatches = async () => {
    if (loadingMore.value || !matchesHasMore.value) return { success: false }
    
    loadingMore.value = true
    matchesPage.value++
    
    // Since API doesn't support pagination, we just return
    loadingMore.value = false
    matchesHasMore.value = false
    return { success: true, hasMore: false }
  }

  // Place soccer bet (Maung style)
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

    if (auth.userBalance.value < amount) {
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
        return { success: true, data: response.data, message: `Maung bet placed successfully! Total: ${amount.toLocaleString()} MMK` }
      }
      return { success: false, error: response.errState || 'Failed to place bet' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      bettingLoading.value = false
    }
  }

  // Place soccer bet (Body style)
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
        return { success: true, data: response.data, message: `Bawdi bet placed successfully! Total: ${totalAmount.toLocaleString()} MMK` }
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
      return { success: false, error: 'Not logged in' }
    }
    
    loading.value = true

    try {
      const response = await api.getSoccerBetHistory(params)

      if (response.msgState === 'data') {
        const bets = response.data || []
        
        soccerBetHistory.value = bets.map(bet => ({
          id: bet.id,
          token: bet.token,
          gameType: bet.gameType || bet.soccerType,
          status: mapSoccerBetStatus(bet.status),
          amount: bet.amount,
          totalAmount: bet.totalAmount || bet.amount,
          winAmount: bet.winAmount || 0,
          createdAt: bet.createdDateInMilliSeconds ? new Date(bet.createdDateInMilliSeconds).toISOString() : null,
          soccerBetDetails: (bet.soccerBetDetails || []).map(detail => ({
            ...detail,
            homeTeamName: detail.homeTeamName || detail.homeTeam?.nameInMM || detail.homeTeam?.nameInEng || 'Home',
            awayTeamName: detail.awayTeamName || detail.awayTeam?.nameInMM || detail.awayTeam?.nameInEng || 'Away',
            matchDisplay: detail.homeTeamName && detail.awayTeamName 
              ? `${detail.homeTeamName} vs ${detail.awayTeamName}`
              : detail.gameId ? `Match #${detail.gameId}` : 'Football Match',
            betTypeDisplay: getBetTypeDisplayText(detail),
            gameId: detail.gameId,
            betTeamId: detail.betTeamId,
            betUnder: detail.betUnder,
            amount: detail.amount,
            isWin: detail.isWin,
            homeTeamId: detail.homeTeamId,
            awayTeamId: detail.awayTeamId
          }))
        }))
        
        return { success: true, data: soccerBetHistory.value }
      }
      return { success: false, error: 'Failed to load bet history' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      loading.value = false
    }
  }

  const getBetTypeDisplayText = (detail) => {
    let betType = 'Team Win'
    
    if (detail.betTeamId) {
      if (detail.homeTeamId && detail.betTeamId === detail.homeTeamId) {
        betType = 'Home Win'
      } else if (detail.awayTeamId && detail.betTeamId === detail.awayTeamId) {
        betType = 'Away Win'
      }
    }
    
    if (detail.betUnder === true) {
      betType += ' (Under)'
    } else if (detail.betUnder === false && detail.betType) {
      betType += ' (Over)'
    }
    
    return betType
  }

  const mapSoccerBetStatus = (status) => {
    switch (status) {
      case 'Pay': return 'won'
      case 'Gain': return 'lost'
      case 'Unfinish': return 'pending'
      default: return 'pending'
    }
  }

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
    loading, loadingMore, bettingLoading, matches, selectedBets, soccerBetHistory,
    matchesHasMore,
    loadMatches, loadMoreMatches, placeSoccerBet, placeMaungBet, placeBodyBet, 
    getSoccerBetHistory, getSoccerBetDetail,
    addBet, removeBet, clearSelectedBets, updateBetAmount,
    totalSelectedBets, totalBetAmount, potentialWin, canPlaceBet,
    formatAmount, formatOdds, getBetStatusColor, getBetStatusBg
  }
}
