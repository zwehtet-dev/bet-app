import { computed } from 'vue'
import { useApi } from './useApi'

// Storage keys
const STORAGE_KEYS = {
  USER: 'auth_user',
  REMEMBER: 'auth_remember'
}

// Get storage based on remember me preference
const getStorage = () => {
  if (typeof window === 'undefined') return null
  const remember = localStorage.getItem(STORAGE_KEYS.REMEMBER) === 'true'
  return remember ? localStorage : sessionStorage
}

export const useAuth = () => {
  // Use Nuxt's useState for SSR-safe state that persists across hydration
  const user = useState('auth_user', () => null)
  const isLoggedIn = useState('auth_isLoggedIn', () => false)
  const authLoading = useState('auth_loading', () => false)
  const authInitialized = useState('auth_initialized', () => false)
  
  const api = useApi()

  // Initialize auth state from storage (client-side only)
  const initAuth = async () => {
    if (authInitialized.value) return
    if (typeof window === 'undefined') return
    
    authLoading.value = true
    
    try {
      // Check if we have a token
      const token = api.getToken()
      
      // Also try to restore user from storage for faster initial load
      const storage = getStorage()
      const savedUser = storage?.getItem(STORAGE_KEYS.USER)
      
      // If we have both token and saved user, restore immediately for fast UI
      if (token && savedUser) {
        try {
          user.value = JSON.parse(savedUser)
          isLoggedIn.value = true
        } catch (e) {
          console.error('Failed to parse saved user:', e)
        }
        
        // Validate token in background (don't block UI)
        api.getUserProfile().then(response => {
          if (response.msgState === 'data') {
            user.value = {
              id: response.data.id,
              name: response.data.name,
              secretName: response.data.secretName,
              phoneNo: response.data.phoneNo,
              balance: response.data.balance || 0,
              type: response.data.type,
              status: response.data.status,
              agentCode: response.data.agentCode,
              createdAt: response.data.createdDateInMilliSeconds 
                ? new Date(response.data.createdDateInMilliSeconds).toISOString() 
                : null
            }
            saveUserToStorage()
          } else {
            // Token invalid, try refresh
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
              api.refreshToken(refreshToken).then(refreshResponse => {
                if (refreshResponse.msgState === 'data') {
                  user.value = {
                    id: refreshResponse.data.user.id,
                    name: refreshResponse.data.user.name,
                    secretName: refreshResponse.data.user.secretName,
                    phoneNo: refreshResponse.data.user.phoneNo,
                    balance: refreshResponse.data.user.balance || 0,
                    type: refreshResponse.data.user.type,
                    status: refreshResponse.data.user.status
                  }
                  saveUserToStorage()
                } else {
                  clearAuth()
                }
              })
            } else {
              clearAuth()
            }
          }
        }).catch(() => {
          // Network error - keep using cached user data
          console.log('Network error during token validation, using cached user')
        })
      } else if (token) {
        // Have token but no saved user - validate and fetch profile
        const response = await api.getUserProfile()
        if (response.msgState === 'data') {
          user.value = {
            id: response.data.id,
            name: response.data.name,
            secretName: response.data.secretName,
            phoneNo: response.data.phoneNo,
            balance: response.data.balance || 0,
            type: response.data.type,
            status: response.data.status,
            agentCode: response.data.agentCode,
            createdAt: response.data.createdDateInMilliSeconds 
              ? new Date(response.data.createdDateInMilliSeconds).toISOString() 
              : null
          }
          isLoggedIn.value = true
          saveUserToStorage()
        } else {
          clearAuth()
        }
      } else if (savedUser) {
        // Have saved user but no token - this shouldn't happen normally
        // Clear the invalid state
        clearAuth()
      } else {
        // No token and no saved user
        clearAuth()
      }
    } catch (error) {
      console.error('Auth init error:', error)
      // Don't clear auth on error if we have cached data
      if (!user.value) {
        clearAuth()
      }
    } finally {
      authLoading.value = false
      authInitialized.value = true
    }
  }
  
  // Save user to storage
  const saveUserToStorage = () => {
    if (typeof window === 'undefined' || !user.value) return
    const storage = getStorage()
    if (storage) {
      storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
    }
  }
  
  // Clear all auth data
  const clearAuth = () => {
    api.logout()
    user.value = null
    isLoggedIn.value = false
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.REMEMBER)
      sessionStorage.removeItem(STORAGE_KEYS.USER)
    }
  }

  const login = async (secretName, password, rememberMe = false) => {
    authLoading.value = true
    try {
      // Set remember me preference before login
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.REMEMBER, rememberMe.toString())
      }
      
      const response = await api.login(secretName, password)

      if (response.msgState === 'data') {
        user.value = {
          id: response.data.user.id,
          name: response.data.user.name,
          secretName: response.data.user.secretName,
          phoneNo: response.data.user.phoneNo,
          balance: response.data.user.balance || 0,
          type: response.data.user.type,
          status: response.data.user.status,
          agentCode: response.data.user.agentCode
        }
        isLoggedIn.value = true
        saveUserToStorage()
        return { success: true, data: response.data }
      } else {
        return {
          success: false,
          error: response.errState === 'userErr' ? 'Invalid credentials' : 'Login failed'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    } finally {
      authLoading.value = false
    }
  }

  const signup = async (name, secretName, password, phoneNo, rememberMe = true) => {
    authLoading.value = true
    try {
      // Set remember me preference
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.REMEMBER, rememberMe.toString())
      }
      
      const response = await api.signup(name, secretName, password, phoneNo)

      if (response.msgState === 'data') {
        user.value = {
          id: response.data.user.id,
          name: response.data.user.name,
          secretName: response.data.user.secretName,
          phoneNo: response.data.user.phoneNo,
          balance: response.data.user.balance || 0,
          type: response.data.user.type,
          status: response.data.user.status
        }
        isLoggedIn.value = true
        saveUserToStorage()
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Registration failed' }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Network error' }
    } finally {
      authLoading.value = false
    }
  }

  const logout = () => {
    clearAuth()
  }

  // Refresh user profile (to get updated balance, etc.)
  const refreshProfile = async () => {
    if (!isLoggedIn.value) return

    try {
      const response = await api.getUserProfile()
      if (response.msgState === 'data') {
        user.value = {
          ...user.value,
          balance: response.data.balance || 0,
          name: response.data.name,
          phoneNo: response.data.phoneNo,
          status: response.data.status
        }
        saveUserToStorage()
      }
    } catch (error) {
      console.error('Profile refresh error:', error)
    }
  }

  const updateBalance = (newBalance) => {
    if (user.value) {
      user.value = { ...user.value, balance: newBalance }
      saveUserToStorage()
    }
  }

  const deductBalance = (amount) => {
    if (user.value && user.value.balance >= amount) {
      user.value = { ...user.value, balance: user.value.balance - amount }
      saveUserToStorage()
      return true
    }
    return false
  }

  const addBalance = (amount) => {
    if (user.value) {
      user.value = { ...user.value, balance: user.value.balance + amount }
      saveUserToStorage()
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    authLoading.value = true
    try {
      const response = await api.changePassword(oldPassword, newPassword)
      if (response.msgState === 'data') {
        return { success: true, message: 'Password changed successfully' }
      } else {
        return { success: false, error: 'Failed to change password' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      authLoading.value = false
    }
  }

  // Computed properties
  const userBalance = computed(() => user.value?.balance || 0)
  const userName = computed(() => user.value?.name || '')
  const userPhone = computed(() => user.value?.phoneNo || user.value?.secretName || '')
  const userType = computed(() => user.value?.type || 'USER')
  const userStatus = computed(() => user.value?.status || 'ACTIVE')
  const isActive = computed(() => user.value?.status === 'ACTIVE')

  return {
    // State
    user,
    isLoggedIn,
    authLoading,
    authInitialized,

    // Actions
    initAuth,
    login,
    signup,
    logout,
    refreshProfile,
    updateBalance,
    deductBalance,
    addBalance,
    changePassword,

    // Computed
    userBalance,
    userName,
    userPhone,
    userType,
    userStatus,
    isActive
  }
}
