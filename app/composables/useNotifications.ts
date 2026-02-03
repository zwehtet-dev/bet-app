export const useNotifications = () => {
  const unreadCount = useState('notificationUnreadCount', () => 0)
  const listenersSetup = useState('notificationListenersSetup', () => false)
  const api = useApi()

  const fetchUnreadCount = async () => {
    try {
      const response: any = await api.get('/api/notifications/unread-count')
      unreadCount.value = response.count || 0
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
      unreadCount.value = 0
    }
  }

  const incrementUnreadCount = () => {
    unreadCount.value++
  }

  const decrementUnreadCount = () => {
    if (unreadCount.value > 0) {
      unreadCount.value--
    }
  }

  const resetUnreadCount = () => {
    unreadCount.value = 0
  }

  const setupWebSocketListeners = () => {
    if (typeof window === 'undefined') return
    
    // Prevent duplicate listener setup
    if (listenersSetup.value) {
      console.log('🎧 WebSocket listeners already setup, skipping...')
      return
    }

    // Listen for new notifications
    const handleNotificationCreated = (event: any) => {
      console.log('🔔 Notification created event caught in composable!', event.detail)
      console.log('📊 Current count:', unreadCount.value, '→ Incrementing...')
      incrementUnreadCount()
      console.log('📊 New count:', unreadCount.value)
    }

    // Listen for notification read
    const handleNotificationRead = (event: any) => {
      console.log('✅ Notification read event caught, decrementing count')
      decrementUnreadCount()
    }

    window.addEventListener('notification-created', handleNotificationCreated)
    window.addEventListener('notification-read', handleNotificationRead)

    listenersSetup.value = true
    console.log('🎧 WebSocket listeners setup for notifications')

    // Cleanup function
    return () => {
      window.removeEventListener('notification-created', handleNotificationCreated)
      window.removeEventListener('notification-read', handleNotificationRead)
      listenersSetup.value = false
      console.log('🧹 WebSocket listeners cleaned up')
    }
  }

  return {
    unreadCount: readonly(unreadCount),
    fetchUnreadCount,
    incrementUnreadCount,
    decrementUnreadCount,
    resetUnreadCount,
    setupWebSocketListeners
  }
}
