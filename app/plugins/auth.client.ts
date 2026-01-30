export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuth()
  const token = useCookie('auth_token')
  
  // If token exists, fetch user data on app initialization
  if (token.value) {
    await fetchUser()
  }
})
