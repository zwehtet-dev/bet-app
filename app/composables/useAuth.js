import { ref, computed } from 'vue'
import { useApi } from './useApi'

const user = ref(null)
const isLoggedIn = ref(false)
const authLoading = ref(false)

export const useAuth = () => {
  const api = useApi()

  // Initialize auth state from localStorage
  const initAuth = async () => {
    const token = api.getToken()
    if (token) {
      authLoading.value = true
      try {
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
        } else {
          // Token might be invalid, try refresh
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            const refreshResponse = await api.refreshToken(refreshToken)
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
              isLoggedIn.value = true
            } else {
              api.logout()
            }
          } else {
            api.logout()
          }
        }
      } catch (error) {
        console.error('Auth init error:', error)
        api.logout()
      } finally {
        authLoading.value = false
      }
    }
  }

  const login = async (secretName, password) => {
    authLoading.value = true
    try {
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

  const signup = async (name, secretName, password, phoneNo) => {
    authLoading.value = true
    try {
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
    api.logout()
    user.value = null
    isLoggedIn.value = false
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
      }
    } catch (error) {
      console.error('Profile refresh error:', error)
    }
  }

  const updateBalance = (newBalance) => {
    if (user.value) {
      user.value.balance = newBalance
    }
  }

  const deductBalance = (amount) => {
    if (user.value && user.value.balance >= amount) {
      user.value.balance -= amount
      return true
    }
    return false
  }

  const addBalance = (amount) => {
    if (user.value) {
      user.value.balance += amount
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
