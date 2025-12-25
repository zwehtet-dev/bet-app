import { ref } from 'vue'

// Response Model Structure
const createResponse = (data = null, msgState = 'data', errState = null, pageState = null) => {
  return {
    msgState,
    errState,
    pageState,
    data
  }
}

// Demo data storage
const demoData = {
  user: {
    id: 1,
    name: 'John Doe',
    secretName: '09123456789',
    phoneNo: '09123456789',
    balance: 100000,
    createdAt: '2024-01-01'
  },
  
  token: 'demo_access_token_12345',
  refreshToken: 'demo_refresh_token_67890',
  
  bets: [
    {
      id: 1,
      gameType: '2D',
      amount: 1000,
      digit: '47',
      status: 'won',
      createdAt: '2024-12-24T12:00:00Z',
      session: 'Morning',
      winAmount: 85000,
      drawNumber: 'D2024001'
    },
    {
      id: 2,
      gameType: '3D',
      amount: 2000,
      digit: '582',
      status: 'lost',
      createdAt: '2024-12-23T18:30:00Z',
      session: 'Evening',
      winAmount: 0,
      drawNumber: 'D2024002'
    },
    {
      id: 3,
      gameType: '2D',
      amount: 1500,
      digit: '23',
      status: 'pending',
      createdAt: '2024-12-24T18:00:00Z',
      session: 'Evening',
      winAmount: 0,
      drawNumber: 'D2024003'
    }
  ],
  
  results: {
    '2d': [
      { date: '2024-12-24', session: 'Morning', number: '47', time: '12:00 PM' },
      { date: '2024-12-23', session: 'Evening', number: '23', time: '6:00 PM' },
      { date: '2024-12-23', session: 'Morning', number: '91', time: '12:00 PM' }
    ],
    '3d': [
      { date: '2024-12-23', session: 'Evening', number: '582', time: '6:30 PM' },
      { date: '2024-12-22', session: 'Evening', number: '149', time: '6:30 PM' },
      { date: '2024-12-21', session: 'Evening', number: '736', time: '6:30 PM' }
    ]
  },
  
  transactions: [
    {
      id: 1,
      type: 'deposit',
      amount: 50000,
      status: 'completed',
      paymentMethod: 'KBZ Pay',
      createdAt: '2024-12-20T10:00:00Z'
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: 25000,
      status: 'pending',
      paymentMethod: 'Wave Money',
      createdAt: '2024-12-22T14:30:00Z'
    }
  ],
  
  paymentMethods: [
    { id: 1, name: 'KBZ Pay', type: 'mobile_banking', isActive: true },
    { id: 2, name: 'Wave Money', type: 'mobile_banking', isActive: true },
    { id: 3, name: 'CB Pay', type: 'mobile_banking', isActive: true },
    { id: 4, name: 'AYA Pay', type: 'mobile_banking', isActive: true }
  ],
  
  carouselImages: [
    { 
      id: 1, 
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=400&fit=crop&crop=center', 
      title: '2D3D လောင်းကစား', 
      subtitle: 'ယနေ့ပဲ စတင်လိုက်ပါ',
      isActive: true,
      bgColor: 'from-blue-600 to-purple-600'
    },
    { 
      id: 2, 
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center', 
      title: 'ကံကောင်းသော နံပါတ်များ', 
      subtitle: 'သင့်အတွက် အကောင်းဆုံး',
      isActive: true,
      bgColor: 'from-green-600 to-blue-600'
    },
    { 
      id: 3, 
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop&crop=center', 
      title: 'ကြီးမားသော ဆုငွေများ', 
      subtitle: 'အနိုင်ရဖို့ အခွင့်အလမ်း',
      isActive: true,
      bgColor: 'from-yellow-600 to-red-600'
    },
    { 
      id: 4, 
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop&crop=center', 
      title: 'လုံခြုံသော ငွေပေးချေမှု', 
      subtitle: 'မိုဘိုင်းဘဏ်များ ပံ့ပိုးမှု',
      isActive: true,
      bgColor: 'from-purple-600 to-pink-600'
    },
    { 
      id: 5, 
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&crop=center', 
      title: '24/7 ဝန်ဆောင်မှု', 
      subtitle: 'အချိန်မရွေး လောင်းကစားပါ',
      isActive: true,
      bgColor: 'from-indigo-600 to-blue-600'
    }
  ],
  
  systemSettings: {
    servicePhoneNo: '09-123-456-789'
  }
}

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const useApi = () => {
  const loading = ref(false)
  const error = ref(null)
  
  // Authentication APIs
  const login = async (secretName, password) => {
    loading.value = true
    error.value = null
    
    try {
      await delay()
      
      // Simulate login validation
      if (secretName === '09123456789' && password === 'password') {
        // Store tokens in localStorage for demo
        localStorage.setItem('token', demoData.token)
        localStorage.setItem('refreshToken', demoData.refreshToken)
        
        return createResponse({
          user: demoData.user,
          token: demoData.token,
          refreshToken: demoData.refreshToken
        })
      } else {
        return createResponse(null, 'error', 'userErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  const signup = async (name, secretName, password, phoneNo) => {
    loading.value = true
    error.value = null
    
    try {
      await delay()
      
      const newUser = {
        ...demoData.user,
        name,
        secretName,
        phoneNo,
        id: Date.now()
      }
      
      return createResponse({
        user: newUser,
        token: demoData.token,
        refreshToken: demoData.refreshToken
      })
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  const refreshToken = async (refreshToken) => {
    loading.value = true
    
    try {
      await delay()
      
      const newToken = 'new_demo_token_' + Date.now()
      localStorage.setItem('token', newToken)
      
      return createResponse({
        token: newToken,
        refreshToken: demoData.refreshToken
      })
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  const changePassword = async (oldPassword, newPassword) => {
    loading.value = true
    
    try {
      await delay()
      return createResponse({ message: 'Password changed successfully' })
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  // User Management
  const getUserProfile = async () => {
    loading.value = true
    
    try {
      await delay()
      return createResponse(demoData.user)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  // Betting APIs
  const placeBet = async (gameType, betDetails) => {
    loading.value = true
    
    try {
      await delay()
      
      const newBet = {
        id: Date.now(),
        gameType,
        betDetails,
        status: 'pending',
        createdAt: new Date().toISOString(),
        drawNumber: 'D' + Date.now()
      }
      
      // Add to demo data
      demoData.bets.unshift(newBet)
      
      // Deduct balance
      const totalAmount = betDetails.reduce((sum, bet) => sum + parseInt(bet.amount), 0)
      demoData.user.balance -= totalAmount
      
      return createResponse(newBet)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  // History & Results
  const getBetHistory = async (params = {}) => {
    loading.value = true
    
    try {
      await delay()
      
      let filteredBets = [...demoData.bets]
      
      if (params.gameType) {
        filteredBets = filteredBets.filter(bet => bet.gameType === params.gameType)
      }
      
      if (params.status) {
        filteredBets = filteredBets.filter(bet => bet.status === params.status)
      }
      
      // Simulate pagination
      const page = params.page || 1
      const size = params.size || 10
      const startIndex = (page - 1) * size
      const endIndex = startIndex + size
      const paginatedBets = filteredBets.slice(startIndex, endIndex)
      
      const pageState = endIndex >= filteredBets.length ? 'noMore' : 'load'
      
      return createResponse(paginatedBets, 'data', null, pageState)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  const getTransactionHistory = async (params = {}) => {
    loading.value = true
    
    try {
      await delay()
      
      let filteredTransactions = [...demoData.transactions]
      
      if (params.type) {
        filteredTransactions = filteredTransactions.filter(tx => tx.type === params.type)
      }
      
      if (params.status) {
        filteredTransactions = filteredTransactions.filter(tx => tx.status === params.status)
      }
      
      return createResponse(filteredTransactions)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  // Financial Operations
  const balanceTransaction = async (transactionData) => {
    loading.value = true
    
    try {
      await delay()
      
      const newTransaction = {
        id: Date.now(),
        ...transactionData,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      
      demoData.transactions.unshift(newTransaction)
      
      return createResponse(newTransaction)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  const getPaymentMethods = async () => {
    loading.value = true
    
    try {
      await delay()
      return createResponse(demoData.paymentMethods)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  // System & Configuration
  const getCarouselImages = async () => {
    loading.value = true
    
    try {
      await delay()
      return createResponse(demoData.carouselImages)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  const getServicePhone = async () => {
    loading.value = true
    
    try {
      await delay()
      return createResponse(demoData.systemSettings.servicePhoneNo)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  // Soccer Betting APIs
  const getSoccerGames = async (gameType = 'Body') => {
    loading.value = true
    
    try {
      await delay()
      
      // Demo soccer games data
      const soccerGames = [
        {
          id: 1,
          homeTeam: 'Manchester United',
          awayTeam: 'Liverpool',
          league: 'Premier League',
          matchDate: '2024-12-25T20:00:00Z',
          homeOdds: '2.10',
          drawOdds: '3.20',
          awayOdds: '2.80',
          status: 'upcoming',
          gameType: gameType,
          overUnderOptions: [
            { id: 'over_2_5', label: 'Over 2.5', odds: '1.85', betUnder: '2.5' },
            { id: 'under_2_5', label: 'Under 2.5', odds: '1.95', betUnder: '2.5' }
          ]
        },
        {
          id: 2,
          homeTeam: 'Barcelona',
          awayTeam: 'Real Madrid',
          league: 'La Liga',
          matchDate: '2024-12-26T22:00:00Z',
          homeOdds: '1.95',
          drawOdds: '3.40',
          awayOdds: '3.10',
          status: 'upcoming',
          gameType: gameType,
          overUnderOptions: [
            { id: 'over_2_5_2', label: 'Over 2.5', odds: '1.75', betUnder: '2.5' },
            { id: 'under_2_5_2', label: 'Under 2.5', odds: '2.05', betUnder: '2.5' }
          ]
        }
      ]
      
      return createResponse(soccerGames)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  const placeSoccerBet = async (betData) => {
    loading.value = true
    
    try {
      await delay()
      
      const { gameType, amount, soccerBetDetails } = betData
      
      // Calculate total amount
      let totalAmount = 0
      if (gameType === 'Maung' && amount) {
        totalAmount = amount * soccerBetDetails.length
      } else {
        totalAmount = soccerBetDetails.reduce((sum, bet) => sum + (bet.amount || 0), 0)
      }
      
      // Check balance
      if (demoData.user.balance < totalAmount) {
        return createResponse(null, 'error', 'userErr')
      }
      
      const newSoccerBet = {
        id: Date.now(),
        gameType,
        amount: gameType === 'Maung' ? amount : undefined,
        soccerBetDetails,
        totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        drawNumber: 'SB' + Date.now()
      }
      
      // Add to demo data
      if (!demoData.soccerBets) {
        demoData.soccerBets = []
      }
      demoData.soccerBets.unshift(newSoccerBet)
      
      // Deduct balance
      demoData.user.balance -= totalAmount
      
      return createResponse(newSoccerBet)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  
  const getSoccerBetHistory = async (status = null) => {
    loading.value = true
    
    try {
      await delay()
      
      // Initialize demo soccer bets if not exists
      if (!demoData.soccerBets) {
        demoData.soccerBets = [
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
                amount: 2000,
                betTeamId: 11
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
                gameId: 2,
                homeTeam: 'Barcelona',
                awayTeam: 'Real Madrid',
                betType: '1x2',
                betLabel: 'Away',
                odds: '3.10',
                betTeamId: 22
              },
              {
                gameId: 1,
                homeTeam: 'Manchester United',
                awayTeam: 'Liverpool',
                betType: '1x2',
                betLabel: 'Draw',
                odds: '3.20',
                betTeamId: 13
              }
            ]
          }
        ]
      }
      
      let filteredBets = [...demoData.soccerBets]
      
      if (status) {
        filteredBets = filteredBets.filter(bet => bet.status === status)
      }
      
      return createResponse(filteredBets)
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }
  // External API simulations (2D/3D Results)
  const get2DLiveResults = async () => {
    loading.value = true
    
    try {
      await delay()
      return createResponse(demoData.results['2d'])
    } catch (err) {
      return createResponse(null, 'error', 'noConnectionErr')
    } finally {
      loading.value = false
    }
  }
  
  const get3DResults = async () => {
    loading.value = true
    
    try {
      await delay()
      return createResponse(demoData.results['3d'])
    } catch (err) {
      return createResponse(null, 'error', 'noConnectionErr')
    } finally {
      loading.value = false
    }
  }
  
  const get2DResultHistory = async () => {
    loading.value = true
    
    try {
      await delay()
      return createResponse([...demoData.results['2d']].reverse())
    } catch (err) {
      return createResponse(null, 'error', 'noConnectionErr')
    } finally {
      loading.value = false
    }
  }
  
  // Utility functions
  const isAuthenticated = () => {
    return !!localStorage.getItem('token')
  }
  
  const getToken = () => {
    return localStorage.getItem('token')
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }
  
  return {
    loading,
    error,
    
    // Auth
    login,
    signup,
    refreshToken,
    changePassword,
    
    // User
    getUserProfile,
    
    // Betting
    placeBet,
    
    // History
    getBetHistory,
    getTransactionHistory,
    
    // Financial
    balanceTransaction,
    getPaymentMethods,
    
    // System
    getCarouselImages,
    getServicePhone,
    
    // Soccer Betting
    getSoccerGames,
    placeSoccerBet,
    getSoccerBetHistory,
    
    // External Results
    get2DLiveResults,
    get3DResults,
    get2DResultHistory,
    
    // Utilities
    isAuthenticated,
    getToken,
    logout,
    
    // Demo data access
    demoData
  }
}