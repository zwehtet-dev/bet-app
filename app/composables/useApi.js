import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

// API Configuration - will use runtime config when available
const getApiBaseUrl = () => {
  try {
    const config = useRuntimeConfig()
    return config.public.apiBaseUrl || 'https://2d3d.pnpmyanmar.com'
  } catch {
    return 'https://2d3d.pnpmyanmar.com'
  }
}

// Response Model Structure
const createResponse = (data = null, msgState = 'data', errState = null, pageState = null) => {
  return { msgState, errState, pageState, data }
}

// HTTP Client - with optional auth
const httpClient = async (endpoint, options = {}, requireAuth = true) => {
  const baseUrl = getApiBaseUrl()
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  
  // If auth is required but no token, return early
  if (requireAuth && !token) {
    console.warn('No token available for authenticated request:', endpoint)
    return { ok: false, status: 401 }
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  }

  const config = {
    ...options,
    headers
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config)
    
    if (response.status === 401 && requireAuth) {
      // Token expired, try refresh
      const refreshed = await tryRefreshToken()
      if (refreshed) {
        // Retry with new token
        const newToken = localStorage.getItem('token')
        headers.Authorization = `Bearer ${newToken}`
        return fetch(`${baseUrl}${endpoint}`, { ...config, headers })
      }
      // Clear invalid tokens
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      }
    }

    return response
  } catch (err) {
    console.error('HTTP Client error:', err)
    throw err
  }
}

// Try to refresh token
const tryRefreshToken = async () => {
  if (typeof localStorage === 'undefined') return false
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return false

  try {
    const baseUrl = getApiBaseUrl()
    const response = await fetch(`${baseUrl}/api/auth/refresh-token/${refreshToken}`)
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      return true
    }
  } catch (e) {
    console.error('Token refresh failed:', e)
  }
  return false
}

export const useApi = () => {
  const loading = ref(false)
  const error = ref(null)

  // ==================== AUTH APIs ====================
  
  // POST /api/auth/login
  const login = async (secretName, password) => {
    loading.value = true
    error.value = null
    const baseUrl = getApiBaseUrl()

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretName, password })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        return createResponse({
          user: data.user,
          token: data.accessToken,
          refreshToken: data.refreshToken
        })
      } else {
        const errData = await response.json().catch(() => ({}))
        return createResponse(null, 'error', 'userErr')
      }
    } catch (err) {
      console.error('Login error:', err)
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // POST /api/auth/signup
  const signup = async (name, secretName, password, phoneNo) => {
    loading.value = true
    error.value = null
    const baseUrl = getApiBaseUrl()

    try {
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, secretName, password, phoneNo })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        return createResponse({
          user: data.user,
          token: data.accessToken,
          refreshToken: data.refreshToken
        })
      } else {
        return createResponse(null, 'error', 'userErr')
      }
    } catch (err) {
      console.error('Signup error:', err)
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/auth/refresh-token/{refreshToken}
  const refreshToken = async (token) => {
    loading.value = true
    const baseUrl = getApiBaseUrl()

    try {
      const response = await fetch(`${baseUrl}/api/auth/refresh-token/${token}`)

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        return createResponse({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user
        })
      } else {
        return createResponse(null, 'error', 'tokenErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // PUT /api/change-password
  const changePassword = async (oldPassword, newPassword) => {
    loading.value = true

    try {
      const response = await httpClient('/api/change-password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword })
      })

      if (response.ok) {
        return createResponse({ message: 'Password changed successfully' })
      } else {
        return createResponse(null, 'error', 'userErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // ==================== USER APIs ====================

  // GET /api/me
  const getUserProfile = async () => {
    loading.value = true

    try {
      const response = await httpClient('/api/me')

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        return createResponse(null, 'error', 'userErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // PUT /api/user
  const updateUser = async (userData) => {
    loading.value = true

    try {
      const response = await httpClient('/api/user', {
        method: 'PUT',
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        return createResponse({ message: 'User updated successfully' })
      } else {
        return createResponse(null, 'error', 'userErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // ==================== BETTING APIs ====================

  // POST /api/bet
  const placeBet = async (gameType, betDetails) => {
    loading.value = true

    try {
      const response = await httpClient('/api/bet', {
        method: 'POST',
        body: JSON.stringify({ gameType, betDetails })
      })

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        const errData = await response.json().catch(() => ({}))
        return createResponse(null, 'error', errData.message || 'betErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/bet-amount?gameType={gameType}
  const getBetAmountByDigit = async (gameType) => {
    loading.value = true

    try {
      const response = await httpClient(`/api/bet-amount?gameType=${gameType}`)

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        return createResponse(null, 'error', 'fetchErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/all-bets
  const getBetHistory = async (params = {}) => {
    loading.value = true

    try {
      const queryParams = new URLSearchParams()
      if (params.fromDate) queryParams.append('fromDate', params.fromDate)
      if (params.toDate) queryParams.append('toDate', params.toDate)
      if (params.username) queryParams.append('username', params.username)
      if (params.token) queryParams.append('token', params.token)
      if (params.gameType) queryParams.append('gameType', params.gameType)
      if (params.status) queryParams.append('status', params.status)
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size !== undefined) queryParams.append('size', params.size.toString())
      if (params.sort) queryParams.append('sort', params.sort)

      const url = `/api/all-bets?${queryParams.toString()}`
      console.log('Fetching bet history:', url)
      
      const response = await httpClient(url)

      if (response.ok) {
        const data = await response.json()
        console.log('Bet history response:', data)
        
        // Handle paginated response structure
        const betList = data.list || data || []
        const pageState = data.totalPages && data.page >= data.totalPages - 1 ? 'noMore' : 'load'
        return createResponse(betList, 'data', null, pageState)
      } else {
        console.error('Bet history error:', response.status)
        return createResponse([], 'error', 'fetchErr')
      }
    } catch (err) {
      console.error('Bet history exception:', err)
      return createResponse([], 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // ==================== BALANCE TRANSACTION APIs ====================

  // POST /api/balance-transaction
  const balanceTransaction = async (transactionData) => {
    loading.value = true

    try {
      const payload = {
        type: transactionData.type === 'deposit' ? 'In' : 'Out',
        paymentMethodId: transactionData.paymentMethodId
      }

      if (transactionData.type === 'deposit') {
        payload.transactionId = transactionData.transactionId
      } else {
        payload.outBalance = transactionData.amount
        payload.phoneNo = transactionData.phoneNo
      }

      const response = await httpClient('/api/balance-transaction', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        return createResponse(null, 'error', 'transactionErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/balance-transaction
  const getTransactionHistory = async (params = {}) => {
    loading.value = true

    try {
      const queryParams = new URLSearchParams()
      if (params.type) queryParams.append('type', params.type === 'deposit' ? 'In' : 'Out')
      if (params.paymentMethodId) queryParams.append('paymentMethodId', params.paymentMethodId)
      if (params.status) queryParams.append('status', params.status)
      if (params.username) queryParams.append('username', params.username)
      if (params.fromDate) queryParams.append('fromDate', params.fromDate)
      if (params.toDate) queryParams.append('toDate', params.toDate)
      if (params.page !== undefined) queryParams.append('page', params.page)
      if (params.size !== undefined) queryParams.append('size', params.size)

      const response = await httpClient(`/api/balance-transaction?${queryParams.toString()}`)

      if (response.ok) {
        const data = await response.json()
        // Transform API response to match frontend format
        const transactions = (data.list || []).map(tx => ({
          id: tx.id,
          type: tx.type === 'In' ? 'deposit' : 'withdrawal',
          amount: tx.type === 'In' ? tx.balance : tx.outBalance,
          status: tx.status === 'Confirm' ? 'completed' : tx.status === 'Reject' ? 'failed' : 'pending',
          paymentMethod: tx.paymentMethodName,
          paymentMethodId: tx.paymentMethodId,
          transactionId: tx.transactionId,
          phoneNo: tx.phoneNo,
          createdAt: new Date(tx.createdDateInMilliSeconds).toISOString()
        }))
        const pageState = data.page >= data.totalPages - 1 ? 'noMore' : 'load'
        return createResponse(transactions, 'data', null, pageState)
      } else {
        return createResponse(null, 'error', 'fetchErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // ==================== PAYMENT METHOD APIs ====================

  // GET /api/payment-method
  const getPaymentMethods = async () => {
    loading.value = true
    const baseUrl = getApiBaseUrl()

    try {
      // Try with token if available
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
      
      const response = await fetch(`${baseUrl}/api/payment-method`, { headers })

      if (response.ok) {
        const data = await response.json()
        // Transform to frontend format
        const methods = (Array.isArray(data) ? data : []).map(m => ({
          id: m.id,
          name: m.name,
          imageLink: m.imageLink,
          description: m.description,
          phoneNoList: m.phoneNoList || [],
          isActive: m.status === 'ACTIVE',
          type: 'mobile_banking'
        }))
        return createResponse(methods)
      } else {
        return createResponse([], 'data') // Return empty array
      }
    } catch (err) {
      return createResponse([], 'data')
    } finally {
      loading.value = false
    }
  }

  // ==================== SLIDER/CAROUSEL APIs ====================

  // GET /api/all-slider-images (no auth required for public display)
  const getCarouselImages = async () => {
    loading.value = true
    const baseUrl = getApiBaseUrl()

    try {
      // Try with token first if available, fallback to no auth
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
      
      const response = await fetch(`${baseUrl}/api/all-slider-images`, { headers })

      if (response.ok) {
        const data = await response.json()
        console.log('Raw slider API response:', data)
        
        // Handle both array response and potential wrapper object
        const imageArray = Array.isArray(data) ? data : (data.list || data.data || [])
        
        const images = imageArray
          .filter(img => img.status === 'ACTIVE')
          .sort((a, b) => (a.sortNo || 0) - (b.sortNo || 0))
          .map(img => ({
            id: img.id,
            imageUrl: img.link, // API field is 'link'
            link: img.link,
            isActive: img.status === 'ACTIVE',
            sortNo: img.sortNo
          }))
        
        console.log('Processed slider images:', images)
        return createResponse(images)
      } else {
        console.error('Slider API error:', response.status)
        return createResponse([], 'data') // Return empty array instead of error
      }
    } catch (err) {
      console.error('Slider API exception:', err)
      return createResponse([], 'data') // Return empty array instead of error
    } finally {
      loading.value = false
    }
  }

  // ==================== GAME APIs ====================

  // GET /api/game/{type}
  const getGameByType = async (type) => {
    loading.value = true

    try {
      const response = await httpClient(`/api/game/${type}`)

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        return createResponse(null, 'error', 'fetchErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/game
  const getAllGames = async () => {
    loading.value = true

    try {
      const response = await httpClient('/api/game')

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        return createResponse(null, 'error', 'fetchErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/game-setting
  const getGameSettings = async () => {
    loading.value = true
    const baseUrl = getApiBaseUrl()

    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
      
      const response = await fetch(`${baseUrl}/api/game-setting`, { headers })

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        // Return default settings if API fails
        return createResponse([
          { name: '2D', value: 85 },
          { name: '3D', value: 500 }
        ])
      }
    } catch (err) {
      return createResponse([
        { name: '2D', value: 85 },
        { name: '3D', value: 500 }
      ])
    } finally {
      loading.value = false
    }
  }

  // ==================== ANNOUNCEMENT APIs ====================

  // GET /api/all-announcements
  const getAnnouncements = async (params = {}) => {
    loading.value = true
    const baseUrl = getApiBaseUrl()

    try {
      const queryParams = new URLSearchParams()
      if (params.fromDate) queryParams.append('fromDate', params.fromDate)
      if (params.toDate) queryParams.append('toDate', params.toDate)
      if (params.status) queryParams.append('status', params.status)
      if (params.page !== undefined) queryParams.append('page', params.page)
      if (params.size !== undefined) queryParams.append('size', params.size)

      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
      
      const response = await fetch(`${baseUrl}/api/all-announcements?${queryParams.toString()}`, { headers })

      if (response.ok) {
        const data = await response.json()
        return createResponse(data.list || data || [])
      } else {
        return createResponse([], 'data') // Return empty array
      }
    } catch (err) {
      return createResponse([], 'data')
    } finally {
      loading.value = false
    }
  }

  // ==================== SOCCER BETTING APIs ====================

  // GET /api/available-soccer-game?type={type}
  const getSoccerGames = async (gameType = 'Body') => {
    loading.value = true

    try {
      const response = await httpClient(`/api/available-soccer-game?type=${gameType}`)

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        return createResponse(null, 'error', 'fetchErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/soccer-games
  const getAllSoccerGames = async (params = {}) => {
    loading.value = true

    try {
      const queryParams = new URLSearchParams()
      if (params.fromDate) queryParams.append('fromDate', params.fromDate)
      if (params.toDate) queryParams.append('toDate', params.toDate)
      if (params.token) queryParams.append('token', params.token)
      if (params.type) queryParams.append('type', params.type)
      if (params.status) queryParams.append('status', params.status)
      if (params.page !== undefined) queryParams.append('page', params.page)
      if (params.size !== undefined) queryParams.append('size', params.size)

      const response = await httpClient(`/api/soccer-games?${queryParams.toString()}`)

      if (response.ok) {
        const data = await response.json()
        return createResponse(data.list || data)
      } else {
        return createResponse(null, 'error', 'fetchErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // POST /api/soccer-bet
  const placeSoccerBet = async (betData) => {
    loading.value = true

    try {
      const response = await httpClient('/api/soccer-bet', {
        method: 'POST',
        body: JSON.stringify(betData)
      })

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        const errData = await response.json().catch(() => ({}))
        return createResponse(null, 'error', errData.message || 'betErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/soccer-bets
  const getSoccerBetHistory = async (params = {}) => {
    loading.value = true

    try {
      const queryParams = new URLSearchParams()
      if (params.fromDate) queryParams.append('fromDate', params.fromDate)
      if (params.toDate) queryParams.append('toDate', params.toDate)
      if (params.token) queryParams.append('token', params.token)
      if (params.username) queryParams.append('username', params.username)
      if (params.soccerType) queryParams.append('soccerType', params.soccerType)
      if (params.status) queryParams.append('status', params.status)

      const url = `/api/soccer-bets?${queryParams.toString()}`
      console.log('Fetching soccer bet history:', url)
      
      const response = await httpClient(url)

      if (response.ok) {
        const data = await response.json()
        console.log('Soccer bet history response:', data)
        
        // Handle both array and paginated response
        const betList = data.list || data || []
        return createResponse(betList)
      } else {
        console.error('Soccer bet history error:', response.status)
        return createResponse([], 'error', 'fetchErr')
      }
    } catch (err) {
      console.error('Soccer bet history exception:', err)
      return createResponse([], 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/soccer-bet/{id}
  const getSoccerBetDetail = async (betId) => {
    loading.value = true

    try {
      const response = await httpClient(`/api/soccer-bet/${betId}`)

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        return createResponse(null, 'error', 'fetchErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // ==================== SYSTEM SETTINGS APIs ====================

  // GET /api/system-setting/{name}
  const getSystemSettingByName = async (name) => {
    loading.value = true
    const baseUrl = getApiBaseUrl()

    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
      
      const response = await fetch(`${baseUrl}/api/system-setting/${name}`, { headers })

      if (response.ok) {
        const data = await response.json()
        return createResponse(data)
      } else {
        return createResponse(null, 'error', 'fetchErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // GET /api/system-setting/Service_PhoneNo
  const getServicePhone = async () => {
    try {
      const response = await getSystemSettingByName('Service_PhoneNo')
      if (response.msgState === 'data') {
        return createResponse(response.data.value)
      }
      return response
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    }
  }

  // ==================== BALANCE HISTORY APIs ====================

  // GET /api/histories
  const getBalanceHistories = async (params = {}) => {
    loading.value = true

    try {
      const queryParams = new URLSearchParams()
      if (params.page !== undefined) queryParams.append('page', params.page)
      if (params.size !== undefined) queryParams.append('size', params.size)

      const response = await httpClient(`/api/histories?${queryParams.toString()}`)

      if (response.ok) {
        const data = await response.json()
        return createResponse(data.list || data)
      } else {
        return createResponse(null, 'error', 'fetchErr')
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // ==================== TRANSACTION BLOCK APIs ====================

  // GET /api/transaction-block/me
  const checkTransactionBlocked = async () => {
    loading.value = true

    try {
      const response = await httpClient('/api/transaction-block/me')

      if (response.ok) {
        const text = await response.text()
        if (!text) {
          return createResponse({ blocked: false })
        }
        const data = JSON.parse(text)
        return createResponse({ blocked: true, ...data })
      } else {
        return createResponse({ blocked: false })
      }
    } catch (err) {
      return createResponse(null, 'error', 'severErr')
    } finally {
      loading.value = false
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  const isAuthenticated = () => {
    if (typeof localStorage === 'undefined') return false
    return !!localStorage.getItem('token')
  }

  const getToken = () => {
    if (typeof localStorage === 'undefined') return null
    return localStorage.getItem('token')
  }

  const logout = () => {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  // ==================== EXTERNAL RESULTS APIs (2DBoss) ====================
  // External APIs for live lottery results

  // GET https://luke.2dboss.com/api/luke/twod-result-live
  const get2DLiveResults = async () => {
    loading.value = true

    try {
      const response = await fetch('https://luke.2dboss.com/api/luke/twod-result-live')

      if (response.ok) {
        const data = await response.json()
        console.log('2D Live API response:', data)
        
        // API returns: { data: [...], result: 1, message: "success" }
        // Each item has: date, live, result_1100, result_1200, result_300, result_430,
        // set_1100, val_1100, set_1200, val_1200, set_300, val_300, set_430, val_430,
        // internet_930, modern_930, internet_200, modern_200
        
        const resultArray = data?.data || (Array.isArray(data) ? data : [])
        
        // Return raw data for processing in useResults
        return createResponse(resultArray)
      } else {
        console.error('2D Live API error:', response.status)
        return createResponse([], 'data')
      }
    } catch (err) {
      console.error('2D Live API exception:', err)
      return createResponse([], 'data')
    } finally {
      loading.value = false
    }
  }

  // GET https://api.2dboss.com/api/lv/threed-result
  const get3DResults = async () => {
    loading.value = true

    try {
      const response = await fetch('https://api.2dboss.com/api/lv/threed-result')

      if (response.ok) {
        const data = await response.json()
        console.log('3D API response:', data)
        
        // Return raw data for processing in useResults
        const resultArray = data?.data || (Array.isArray(data) ? data : [])
        return createResponse(resultArray)
      } else {
        console.error('3D API error:', response.status)
        return createResponse([], 'data')
      }
    } catch (err) {
      console.error('3D API exception:', err)
      return createResponse([], 'data')
    } finally {
      loading.value = false
    }
  }

  // GET https://api.2dboss.com/api/v2/v1/bkk/twod-result
  const get2DResultHistory = async () => {
    loading.value = true

    try {
      const response = await fetch('https://api.2dboss.com/api/v2/v1/bkk/twod-result')

      if (response.ok) {
        const data = await response.json()
        console.log('2D History API response:', data)
        
        // Return raw data for processing in useResults
        const resultArray = data?.data || (Array.isArray(data) ? data : [])
        return createResponse(resultArray)
      } else {
        console.error('2D History API error:', response.status)
        return createResponse([], 'data')
      }
    } catch (err) {
      console.error('2D History API exception:', err)
      return createResponse([], 'data')
    } finally {
      loading.value = false
    }
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
    updateUser,

    // Betting
    placeBet,
    getBetAmountByDigit,
    getBetHistory,

    // Balance Transactions
    balanceTransaction,
    getTransactionHistory,

    // Payment Methods
    getPaymentMethods,

    // Carousel/Slider
    getCarouselImages,

    // Games
    getGameByType,
    getAllGames,
    getGameSettings,

    // Announcements
    getAnnouncements,

    // Soccer Betting
    getSoccerGames,
    getAllSoccerGames,
    placeSoccerBet,
    getSoccerBetHistory,
    getSoccerBetDetail,

    // System Settings
    getSystemSettingByName,
    getServicePhone,

    // Balance History
    getBalanceHistories,

    // Transaction Block
    checkTransactionBlocked,

    // Results
    get2DLiveResults,
    get3DResults,
    get2DResultHistory,

    // Utilities
    isAuthenticated,
    getToken,
    logout
  }
}
