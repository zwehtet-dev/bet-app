export const use2DBetting = () => {
  const api = useApi()
  const isLoading = ref(false)

  const getCurrentSession = async () => {
    isLoading.value = true
    try {
      const response: any = await api.get('/api/betting/2d/session')
      return response.data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getAvailableDigits = async () => {
    const response: any = await api.get('/api/betting/2d/available-digits')
    return response.data
  }

  const placeBet = async (items: Array<{ number: string, amount: number }>) => {
    isLoading.value = true
    try {
      const response: any = await api.post('/api/betting/2d/place-bet', { items })
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getBetHistory = async (page = 1, perPage = 20, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(status && { status })
    })
    const response: any = await api.get(`/api/betting/2d/bets?${params}`)
    return response
  }

  const getBetDetails = async (betId: number) => {
    const response: any = await api.get(`/api/betting/2d/bets/${betId}`)
    return response.data
  }

  const getStatistics = async () => {
    const response: any = await api.get('/api/betting/2d/statistics')
    return response.data
  }

  const getHotNumbers = async () => {
    const response: any = await api.get('/api/betting/2d/hot-numbers')
    return response.data
  }

  const getRecentResults = async (limit = 10) => {
    const response: any = await api.get(`/api/betting/2d/recent-results?limit=${limit}`)
    return response.data
  }

  return {
    isLoading,
    getCurrentSession,
    getAvailableDigits,
    placeBet,
    getBetHistory,
    getBetDetails,
    getStatistics,
    getHotNumbers,
    getRecentResults
  }
}
