export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser, isAuthenticated } = useAuth()
  const { fetchUnreadCount } = useNotifications()
  const token = useCookie('auth_token')
  
  console.log('🔐 Auth plugin initializing, token exists:', !!token.value)
  
  // If token exists, fetch user data on app initialization (blocking)
  if (token.value) {
    console.log('🔐 Token found, fetching user...')
    await fetchUser()
    console.log('🔐 User fetched, authenticated:', isAuthenticated.value)
    
    if (isAuthenticated.value) {
      await fetchUnreadCount()
    } else {
      console.log('🔐 User not authenticated after fetch, clearing token')
      token.value = null
    }
  }
})
