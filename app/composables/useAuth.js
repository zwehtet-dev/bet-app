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
          user.value = response.data
          isLoggedIn.value = true
        } else {
          // Token might be invalid, logout
          api.logout()
        }
      } catch (error) {
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
        user.value = response.data.user
        isLoggedIn.value = true
        return { success: true, data: response.data }
      } else {
        return { 
          success: false, 
          error: response.errState === 'userErr' ? 'Invalid credentials' : 'Login failed' 
        }
      }
    } catch (error) {
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
        user.value = response.data.user
        isLoggedIn.value = true
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Registration failed' }
      }
    } catch (error) {
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
  
  // Computed properties
  const userBalance = computed(() => user.value?.balance || 0)
  const userName = computed(() => user.value?.name || '')
  const userPhone = computed(() => user.value?.phoneNo || '')
  
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
    updateBalance,
    deductBalance,
    addBalance,
    
    // Computed
    userBalance,
    userName,
    userPhone
  }
}