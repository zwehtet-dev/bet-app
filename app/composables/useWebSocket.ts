export const useWebSocket = () => {
  // Use a global singleton to prevent multiple instances
  const socket = useState<WebSocket | null>('ws-socket', () => null)
  const isConnected = useState('ws-connected', () => false)
  const isConnecting = useState('ws-connecting', () => false)
  const processedMessages = useState<Set<string>>('ws-processed', () => new Set())
  
  const config = useRuntimeConfig()
  const { user } = useAuth()
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    const currentUser = user.value as any
    if (!currentUser?.id || isConnecting.value) return
    
    // Prevent duplicate connections
    if (socket.value && (socket.value.readyState === WebSocket.CONNECTING || socket.value.readyState === WebSocket.OPEN)) {
      console.log('WebSocket already connected or connecting, skipping...')
      return
    }

    try {
      isConnecting.value = true
      const wsUrl = config.public.wsUrl || 'ws://localhost:8000/ws'
      console.log('Attempting WebSocket connection to:', wsUrl)
      
      socket.value = new WebSocket(`${wsUrl}?user_id=${currentUser.id}`)

      socket.value.onopen = () => {
        isConnected.value = true
        isConnecting.value = false
        reconnectAttempts.value = 0
        console.log('WebSocket connected successfully')
        
        // Subscribe to user channel
        const usr = user.value as any
        if (usr?.id) {
          subscribeToChannel(`user.${usr.id}`)
        }
      }

      socket.value.onclose = (event) => {
        isConnected.value = false
        isConnecting.value = false
        console.log('WebSocket disconnected', event.code, event.reason)
        
        // Reconnect with exponential backoff
        if (reconnectAttempts.value < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 30000)
          reconnectAttempts.value++
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.value}/${maxReconnectAttempts})`)
          setTimeout(() => connect(), delay)
        } else {
          console.warn('Max reconnection attempts reached. WebSocket disabled.')
        }
      }

      socket.value.onerror = (error) => {
        isConnecting.value = false
        console.warn('WebSocket connection error. This is normal if WebSocket service is not running.')
        console.debug('WebSocket error details:', error)
      }

      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📨 WebSocket RAW message:', event.data)
          console.log('📨 WebSocket PARSED:', data)
          handleMessage(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }
    } catch (error) {
      isConnecting.value = false
      console.warn('Failed to create WebSocket connection:', error)
    }
  }

  const disconnect = () => {
    reconnectAttempts.value = maxReconnectAttempts // Prevent reconnection
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
    isConnected.value = false
    isConnecting.value = false
  }

  const subscribeToChannel = (channel: string) => {
    if (socket.value && isConnected.value) {
      try {
        socket.value.send(JSON.stringify({
          type: 'subscribe',
          channel: channel
        }))
        console.log('Subscribed to channel:', channel)
      } catch (error) {
        console.error('Failed to subscribe to channel:', error)
      }
    }
  }

  // Track processed messages to prevent duplicates
  const handleMessage = (data: any) => {
    const { event, channel, data: payload } = data

    // Handle acknowledgments
    if (event === 'subscribed' || event === 'pong') {
      console.log('✅ WebSocket ack:', event, channel)
      return
    }

    // Deduplicate messages using notification ID and timestamp
    if (payload?.id) {
      const messageKey = `${event}-${payload.id}-${payload.created_at || Date.now()}`
      if (processedMessages.value.has(messageKey)) {
        console.log('⚠️ Duplicate message detected, skipping:', messageKey)
        return
      }
      processedMessages.value.add(messageKey)
      
      // Clean up old entries (keep last 100)
      if (processedMessages.value.size > 100) {
        const entries = Array.from(processedMessages.value)
        entries.slice(0, 50).forEach(key => processedMessages.value.delete(key))
      }
    }

    console.log('🔔 Handling event:', event, 'Channel:', channel, 'Payload:', payload)

    switch (event) {
      case 'bet.created':
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
      case 'notification.created':
        console.log('🔔 NOTIFICATION EVENT RECEIVED! Dispatching to window...')
        window.dispatchEvent(new CustomEvent('notification-created', { detail: payload }))
        showToast('info', payload.message || payload.title)
        break
      
      case 'notification.read':
        window.dispatchEvent(new CustomEvent('notification-read', { detail: payload }))
        break
      
      default:
        console.log('⚠️ Unknown event type:', event)
    }
  }

  const send = (event: string, payload: any) => {
    if (socket.value && isConnected.value) {
      try {
        socket.value.send(JSON.stringify({ event, payload }))
      } catch (error) {
        console.error('Failed to send WebSocket message:', error)
      }
    }
  }

  const showToast = (type: string, message: string) => {
    const toast = useToast()
    
    switch (type) {
      case 'success':
        toast.success(message)
        break
      case 'error':
        toast.error(message)
        break
      case 'warning':
        toast.warning(message)
        break
      default:
        toast.info(message)
    }
  }

  return {
    connect,
    disconnect,
    send,
    subscribeToChannel,
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting)
  }
}
