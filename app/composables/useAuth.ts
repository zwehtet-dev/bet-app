export const useAuth = () => {
  const user = useState('user', () => null)
  const token = useCookie('auth_token')
  const config = useRuntimeConfig()

  const login = async (identifier: string, password: string) => {
    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        body: { identifier, password },
        credentials: 'include'
      })
      
      if (response.success) {
        user.value = response.data.user
        token.value = response.data.token
        return { success: true }
      }
    } catch (error: any) {
      return { success: false, error: error.data?.message || error.message }
    }
  }

  const logout = async () => {
    try {
      await $fetch(`${config.public.apiBaseUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      navigateTo('/login')
    }
  }

  const fetchUser = async () => {
    if (!token.value) {
      user.value = null
      return
    }
    
    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/api/auth/user`, {
        credentials: 'include'
      })
      if (response.success) {
        user.value = response.data
      } else {
        user.value = null
        token.value = null
      }
    } catch (error) {
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
