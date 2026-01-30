export const useWebSocket = () => {
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const config = useRuntimeConfig()
  const { user } = useAuth()
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    if (!user.value) return

    const wsUrl = config.public.wsUrl || 'ws://localhost:8080'
    socket.value = new WebSocket(`${wsUrl}?user_id=${user.value.id}`)

    socket.value.onopen = () => {
      isConnected.value = true
      reconnectAttempts.value = 0
      console.log('WebSocket connected')
    }

    socket.value.onclose = () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
      
      // Reconnect with exponential backoff
      if (reconnectAttempts.value < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 30000)
        reconnectAttempts.value++
        setTimeout(() => connect(), delay)
      }
    }

    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        handleMessage(data)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
  }

  const handleMessage = (data: any) => {
    const { event, payload } = data

    switch (event) {
      case 'bet.created':
        // Emit event for components to listen
        window.dispatchEvent(new CustomEvent('bet-created', { detail: payload }))
        break
      
      case 'bet.updated':
        window.dispatchEvent(new CustomEvent('bet-updated', { detail: payload }))
        if (payload.status === 'accepted') {
          showToast('success', 'Your bet has been accepted')
        } else if (payload.status === 'rejected') {
          showToast('error', 'Your bet has been rejected')
        }
        break
      
      case 'session.resulted':
        window.dispatchEvent(new CustomEvent('session-resulted', { detail: payload }))
        showToast('info', `Result declared: ${payload.result_number}`)
        break
      
      case 'balance.updated':
        window.dispatchEvent(new CustomEvent('balance-updated', { detail: payload }))
        break
      
      case 'notification':
        window.dispatchEvent(new CustomEvent('notification', { detail: payload }))
        showToast('info', payload.message)
        break
    }
  }

  const send = (event: string, payload: any) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify({ event, payload }))
    }
  }

  const showToast = (type: string, message: string) => {
    // This will be implemented with a toast library
    console.log(`[${type}] ${message}`)
  }

  return {
    connect,
    disconnect,
    send,
    isConnected
  }
}
