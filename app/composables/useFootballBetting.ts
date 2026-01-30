export const useFootballBetting = () => {
  const api = useApi()
  const isLoading = ref(false)

  const getMatches = async (status = 'upcoming') => {
    const response: any = await api.get(`/api/betting/football/matches?status=${status}`)
    return response.data
  }

  const getMatchDetails = async (matchId: number) => {
    const response: any = await api.get(`/api/betting/football/matches/${matchId}`)
    return response.data
  }

  const getAgents = async () => {
    const response: any = await api.get('/api/betting/football/agents')
    return response.data
  }

  const placeBodyBet = async (agentId: number, matchId: number, marketId: number, selection: string, amount: number) => {
    isLoading.value = true
    try {
      const response: any = await api.post('/api/betting/football/place-bet', {
        agent_id: agentId,
        bet_type: 'body',
        total_stake: amount,
        items: [{
          market_id: marketId,
          selection
        }]
      })
      return response
    } finally {
      isLoading.value = false
    }
  }

  const placeMaungBet = async (agentId: number, items: Array<any>, amount: number) => {
    isLoading.value = true
    try {
      const response: any = await api.post('/api/betting/football/place-bet', {
        agent_id: agentId,
        bet_type: 'maung',
        total_stake: amount,
        items
      })
      return response
    } finally {
      isLoading.value = false
    }
  }

  const getBetHistory = async (page = 1, perPage = 20, status?: string, betType?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(status && { status }),
      ...(betType && { bet_type: betType })
    })
    const response: any = await api.get(`/api/betting/football/bets?${params}`)
    return response
  }

  const getBetDetails = async (betId: number) => {
    const response: any = await api.get(`/api/betting/football/bets/${betId}`)
    return response.data
  }

  const cancelBet = async (betId: number) => {
    const response: any = await api.post(`/api/betting/football/bets/${betId}/cancel`)
    return response
  }

  const getStatistics = async () => {
    const response: any = await api.get('/api/betting/football/statistics')
    return response.data
  }

  return {
    isLoading,
    getMatches,
    getMatchDetails,
    getAgents,
    placeBodyBet,
    placeMaungBet,
    getBetHistory,
    getBetDetails,
    cancelBet,
    getStatistics
  }
}
