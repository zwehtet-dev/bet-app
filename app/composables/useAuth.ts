export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const token = useCookie('auth_token')
  const api = useApi()

  const login = async (identifier: string, password: string) => {
    try {
      const response: any = await api.post('/api/auth/login', { identifier, password })
      
      if (response.success) {
        // Handle wallet for users
        if (response.data.user.wallet) {
          response.data.user.wallet.balance = Number(response.data.user.wallet.balance)
          response.data.user.wallet.locked_balance = Number(response.data.user.wallet.locked_balance)
        }
        
        // Handle agent data for agents
        if (response.data.user.agent) {
          response.data.user.agent.total_commission_earned = Number(response.data.user.agent.total_commission_earned)
          response.data.user.agent.payable = Number(response.data.user.agent.payable)
          response.data.user.agent.receivable = Number(response.data.user.agent.receivable)
          response.data.user.agent.used_credit = Number(response.data.user.agent.used_credit)
          response.data.user.agent.available_credit = Number(response.data.user.agent.available_credit)
          response.data.user.agent.max_credit_limit = Number(response.data.user.agent.max_credit_limit)
          response.data.user.agent.calculated_balance = Number(response.data.user.agent.calculated_balance)
        }
        
        user.value = response.data.user
        token.value = response.data.token
        
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
      const response: any = await api.get('/api/auth/user')
      console.log('🔐 fetchUser: Response received', response)
      
      if (response.success) {
        // Handle wallet for users
        if (response.data.wallet) {
          response.data.wallet.balance = Number(response.data.wallet.balance)
          response.data.wallet.locked_balance = Number(response.data.wallet.locked_balance)
        }
        
        // Handle agent data for agents
        if (response.data.agent) {
          response.data.agent.total_commission_earned = Number(response.data.agent.total_commission_earned)
          response.data.agent.payable = Number(response.data.agent.payable)
          response.data.agent.receivable = Number(response.data.agent.receivable)
          response.data.agent.used_credit = Number(response.data.agent.used_credit)
          response.data.agent.available_credit = Number(response.data.agent.available_credit)
          response.data.agent.max_credit_limit = Number(response.data.agent.max_credit_limit)
          response.data.agent.calculated_balance = Number(response.data.agent.calculated_balance)
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
