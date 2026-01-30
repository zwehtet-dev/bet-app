export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, fetchUser } = useAuth()
  const token = useCookie('auth_token')
  
  const publicRoutes = ['/login', '/signup']
  
  // If token exists but user is not loaded, fetch user first
  if (token.value && !isAuthenticated.value) {
    await fetchUser()
  }
  
  if (!isAuthenticated.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
  
  if (isAuthenticated.value && publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})
