export const use3DBetting = () => {
  const api = useApi()
  const isLoading = ref(false)

  const getCurrentSession = async () => {
    isLoading.value = true
    try {
      const response: any = await api.get('/api/betting/3d/session')
      return response.data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const placeBet = async (items: Array<{ number: string, amount: number }>) => {
    isLoading.value = true
    try {
      const response: any = await api.post('/api/betting/3d/place-bet', { items })
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
    const response: any = await api.get(`/api/betting/3d/bets?${params}`)
    return response
  }

  const getBetDetails = async (betId: number) => {
    const response: any = await api.get(`/api/betting/3d/bets/${betId}`)
    return response.data
  }

  const getStatistics = async () => {
    const response: any = await api.get('/api/betting/3d/statistics')
    return response.data
  }

  const getRecentResults = async (limit = 10) => {
    const response: any = await api.get(`/api/betting/3d/recent-results?limit=${limit}`)
    return response.data
  }

  return {
    isLoading,
    getCurrentSession,
    placeBet,
    getBetHistory,
    getBetDetails,
    getStatistics,
    getRecentResults
  }
}
