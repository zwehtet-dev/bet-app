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
      // Simulate API call to GET /soccer-games?type={gameType}
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo data - in real implementation, this would call the API
      const demoMatches = [
        {
          id: 1,
          homeTeam: 'Manchester United',
          awayTeam: 'Liverpool',
          league: 'Premier League',
          matchDate: '2024-12-25',
          matchTime: '20:00',
          homeOdds: '2.10',
          drawOdds: '3.20',
          awayOdds: '2.80',
          status: 'upcoming',
          overUnderOptions: [
            { id: 'over_2_5', label: 'Over 2.5', odds: '1.85', betUnder: '2.5' },
            { id: 'under_2_5', label: 'Under 2.5', odds: '1.95', betUnder: '2.5' },
            { id: 'over_3_5', label: 'Over 3.5', odds: '2.75', betUnder: '3.5' },
            { id: 'under_3_5', label: 'Under 3.5', odds: '1.45', betUnder: '3.5' }
          ]
        },
        {
          id: 2,
          homeTeam: 'Barcelona',
          awayTeam: 'Real Madrid',
          league: 'La Liga',
          matchDate: '2024-12-26',
          matchTime: '22:00',
          homeOdds: '1.95',
          drawOdds: '3.40',
          awayOdds: '3.10',
          status: 'upcoming',
          overUnderOptions: [
            { id: 'over_2_5_2', label: 'Over 2.5', odds: '1.75', betUnder: '2.5' },
            { id: 'under_2_5_2', label: 'Under 2.5', odds: '2.05', betUnder: '2.5' }
          ]
        },
        {
          id: 3,
          homeTeam: 'Bayern Munich',
          awayTeam: 'Borussia Dortmund',
          league: 'Bundesliga',
          matchDate: '2024-12-27',
          matchTime: '18:30',
          homeOdds: '1.65',
          drawOdds: '3.80',
          awayOdds: '4.20',
          status: 'upcoming',
          overUnderOptions: [
            { id: 'over_2_5_3', label: 'Over 2.5', odds: '1.90', betUnder: '2.5' },
            { id: 'under_2_5_3', label: 'Under 2.5', odds: '1.90', betUnder: '2.5' }
          ]
        }
      ]
      
      matches.value = demoMatches
      return { success: true, data: demoMatches }
    } catch (error) {
      return { success: false, error: 'Failed to load matches' }
    } finally {
      loading.value = false
    }
  }
  
  // Place soccer bet (Maung style - single amount for all bets)
  const placeMaungBet = async (gameType, amount, soccerBetDetails) => {
    if (!auth.isLoggedIn.value) {
      return { success: false, error: 'Please login first' }
    }
    
    const totalAmount = amount * soccerBetDetails.length
    
    if (auth.userBalance.value < totalAmount) {
      return { success: false, error: 'Insufficient balance' }
    }
    
    bettingLoading.value = true
    
    try {
      // API call: POST /soccer-bet
      const betData = {
        gameType,
        amount,
        soccerBetDetails
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real implementation:
      // const response = await api.placeSoccerBet(betData)
      
      // Simulate successful response
      const newBet = {
        id: Date.now(),
        gameType,
        amount,
        soccerBetDetails,
        status: 'pending',
        createdAt: new Date().toISOString(),
        totalAmount
      }
      
      // Deduct balance
      auth.deductBalance(totalAmount)
      
      // Add to bet history
      soccerBetHistory.value.unshift(newBet)
      
      return { 
        success: true, 
        data: newBet,
        message: `Soccer bet placed successfully! Total: ${totalAmount.toLocaleString()} MMK`
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      bettingLoading.value = false
    }
  }
  
  // Place soccer bet (Body style - individual amounts per bet)
  const placeBodyBet = async (gameType, soccerBetDetails) => {
    if (!auth.isLoggedIn.value) {
      return { success: false, error: 'Please login first' }
    }
    
    const totalAmount = soccerBetDetails.reduce((sum, bet) => sum + (bet.amount || 0), 0)
    
    if (auth.userBalance.value < totalAmount) {
      return { success: false, error: 'Insufficient balance' }
    }
    
    bettingLoading.value = true
    
    try {
      // API call: POST /soccer-bet
      const betData = {
        gameType,
        soccerBetDetails
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real implementation:
      // const response = await api.placeSoccerBet(betData)
      
      // Simulate successful response
      const newBet = {
        id: Date.now(),
        gameType,
        soccerBetDetails,
        status: 'pending',
        createdAt: new Date().toISOString(),
        totalAmount
      }
      
      // Deduct balance
      auth.deductBalance(totalAmount)
      
      // Add to bet history
      soccerBetHistory.value.unshift(newBet)
      
      return { 
        success: true, 
        data: newBet,
        message: `Soccer bet placed successfully! Total: ${totalAmount.toLocaleString()} MMK`
      }
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
      return await placeMaungBet(gameType, amount, soccerBetDetails)
    } else {
      return await placeBodyBet(gameType, soccerBetDetails)
    }
  }
  
  // Get soccer bet history
  const getSoccerBetHistory = async (status = null) => {
    loading.value = true
    
    try {
      // API call: GET /soccer-bets?status={status}
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo data
      const demoBets = [
        {
          id: 1,
          gameType: 'Body',
          status: 'won',
          totalAmount: 5000,
          winAmount: 12500,
          createdAt: '2024-12-24T15:30:00Z',
          soccerBetDetails: [
            {
              gameId: 1,
              homeTeam: 'Manchester United',
              awayTeam: 'Liverpool',
              betType: '1x2',
              betLabel: 'Home',
              odds: '2.10',
              amount: 2000
            },
            {
              gameId: 2,
              homeTeam: 'Barcelona',
              awayTeam: 'Real Madrid',
              betType: 'over_under',
              betLabel: 'Over 2.5',
              odds: '1.75',
              amount: 3000
            }
          ]
        },
        {
          id: 2,
          gameType: 'Maung',
          status: 'lost',
          amount: 2000,
          totalAmount: 4000,
          winAmount: 0,
          createdAt: '2024-12-23T18:00:00Z',
          soccerBetDetails: [
            {
              gameId: 3,
              homeTeam: 'Bayern Munich',
              awayTeam: 'Borussia Dortmund',
              betType: '1x2',
              betLabel: 'Away',
              odds: '4.20'
            },
            {
              gameId: 1,
              homeTeam: 'Manchester United',
              awayTeam: 'Liverpool',
              betType: '1x2',
              betLabel: 'Draw',
              odds: '3.20'
            }
          ]
        }
      ]
      
      let filteredBets = demoBets
      if (status) {
        filteredBets = demoBets.filter(bet => bet.status === status)
      }
      
      soccerBetHistory.value = filteredBets
      return { success: true, data: filteredBets }
    } catch (error) {
      return { success: false, error: 'Failed to load bet history' }
    } finally {
      loading.value = false
    }
  }
  
  // Utility functions for bet management
  const addBet = (bet) => {
    const existingIndex = selectedBets.value.findIndex(
      b => b.matchId === bet.matchId && b.optionId === bet.optionId
    )
    
    if (existingIndex > -1) {
      selectedBets.value.splice(existingIndex, 1)
    } else {
      selectedBets.value.push(bet)
    }
  }
  
  const removeBet = (bet) => {
    const index = selectedBets.value.findIndex(
      b => b.matchId === bet.matchId && b.optionId === bet.optionId
    )
    
    if (index > -1) {
      selectedBets.value.splice(index, 1)
    }
  }
  
  const clearSelectedBets = () => {
    selectedBets.value = []
  }
  
  const updateBetAmount = (matchId, optionId, amount) => {
    const bet = selectedBets.value.find(
      b => b.matchId === matchId && b.optionId === optionId
    )
    
    if (bet) {
      bet.amount = amount
    }
  }
  
  // Computed properties
  const totalSelectedBets = computed(() => selectedBets.value.length)
  
  const totalBetAmount = computed(() => {
    return selectedBets.value.reduce((sum, bet) => sum + (bet.amount || 0), 0)
  })
  
  const potentialWin = computed(() => {
    return selectedBets.value.reduce((sum, bet) => {
      const amount = bet.amount || 0
      const odds = parseFloat(bet.odds) || 1
      return sum + (amount * odds)
    }, 0)
  })
  
  const canPlaceBet = computed(() => {
    return selectedBets.value.length > 0 && 
           totalBetAmount.value > 0 &&
           totalBetAmount.value <= auth.userBalance.value &&
           auth.isLoggedIn.value
  })
  
  // Format utilities
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount)
  }
  
  const formatOdds = (odds) => {
    return parseFloat(odds).toFixed(2)
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
  
  return {
    // State
    loading,
    bettingLoading,
    matches,
    selectedBets,
    soccerBetHistory,
    
    // Actions
    loadMatches,
    placeSoccerBet,
    getSoccerBetHistory,
    addBet,
    removeBet,
    clearSelectedBets,
    updateBetAmount,
    
    // Computed
    totalSelectedBets,
    totalBetAmount,
    potentialWin,
    canPlaceBet,
    
    // Utilities
    formatAmount,
    formatOdds,
    getBetStatusColor,
    getBetStatusBg
  }
}