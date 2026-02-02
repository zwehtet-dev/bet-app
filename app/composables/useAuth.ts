export const useAuth = () => {
  const user = useState('user', () => null)
  const token = useCookie('auth_token')
  const api = useApi()

  const login = async (identifier: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { identifier, password })
      
      if (response.success) {
        // Ensure wallet balance is a number
        if (response.data.user.wallet) {
          response.data.user.wallet.balance = Number(response.data.user.wallet.balance)
          response.data.user.wallet.locked_balance = Number(response.data.user.wallet.locked_balance)
        }
        
        user.value = response.data.user
        token.value = response.data.token
        
        // Fetch notification count after successful login
        const { fetchUnreadCount } = useNotifications()
        await fetchUnreadCount()
        
        return { success: true }
      }
      return { success: false, error: 'Login failed' }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.data?.message || error.message || 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout', {})
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      
      // Reset notification count on logout
      const { resetUnreadCount } = useNotifications()
      resetUnreadCount()
      
      navigateTo('/login')
    }
  }

  const fetchUser = async () => {
    if (!token.value) {
      console.log('🔐 fetchUser: No token, clearing user')
      user.value = null
      return
    }
    
    try {
      console.log('🔐 fetchUser: Fetching user with token')
      const response = await api.get('/api/auth/user')
      console.log('🔐 fetchUser: Response received', response)
      
      if (response.success) {
        // Ensure wallet balance is a number
        if (response.data.wallet) {
          response.data.wallet.balance = Number(response.data.wallet.balance)
          response.data.wallet.locked_balance = Number(response.data.wallet.locked_balance)
        }
        
        user.value = response.data
        console.log('🔐 fetchUser: User set', user.value)
      } else {
        console.log('🔐 fetchUser: Response not successful, clearing auth')
        user.value = null
        token.value = null
      }
    } catch (error) {
      console.error('🔐 fetchUser: Error fetching user', error)
      user.value = null
      token.value = null
    }
  }

  return {
    user,
    login,
    logout,
    fetchUser,
    isAuthenticated: computed(() => !!user.value),
    isAgent: computed(() => user.value?.role === 'agent'),
    isUser: computed(() => user.value?.role === 'user')
  }
}
