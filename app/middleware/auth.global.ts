export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, fetchUser } = useAuth()
  const token = useCookie('auth_token')
  
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.includes(to.path)
  
  console.log('🔐 Middleware:', { 
    to: to.path, 
    from: from?.path,
    isAuthenticated: isAuthenticated.value, 
    hasToken: !!token.value,
    isPublicRoute,
    isServer: import.meta.server
  })
  
  // On client-side, if token exists but user is not loaded, fetch user first
  if (import.meta.client && token.value && !isAuthenticated.value) {
    console.log('🔐 Fetching user...')
    await fetchUser()
    console.log('🔐 After fetch, authenticated:', isAuthenticated.value)
  }
  
  // On server-side, just check if token exists
  const hasAuth = import.meta.server ? !!token.value : isAuthenticated.value
  
  // Redirect to login if not authenticated and trying to access protected route
  if (!hasAuth && !isPublicRoute) {
    console.log('🔐 Not authenticated, redirecting to login')
    return navigateTo('/login')
  }
  
  // Redirect to home if authenticated and trying to access public route
  if (hasAuth && isPublicRoute) {
    console.log('🔐 Already authenticated, redirecting to home')
    return navigateTo('/')
  }
  
  console.log('🔐 Navigation allowed')
})
