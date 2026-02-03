export const useToast = () => {
  const toasts = useState<Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message?: string
    duration?: number
  }>>('toasts', () => [])

  const notificationsEnabled = useState('notificationsEnabled', () => true)
  const settingsLoaded = useState('settingsLoaded', () => false)

  const api = useApi()

  // Load settings from backend
  const loadSettings = async () => {
    if (settingsLoaded.value) return

    try {
      const response: any = await api.get('/api/auth/settings')
      if (response.success) {
        notificationsEnabled.value = response.data.notifications_enabled ?? true
        settingsLoaded.value = true
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('notificationsEnabled')
        notificationsEnabled.value = stored === null ? true : stored === 'true'
      }
    }
  }

  const show = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message?: string,
    duration: number = 3000
  ) => {
    if (!notificationsEnabled.value) return

    const id = `toast-${Date.now()}-${Math.random()}`
    const toast = { id, type, title, message, duration }
    
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled.value
    notificationsEnabled.value = newValue

    // Save to backend
    try {
      await api.put('/api/auth/settings', {
        notifications_enabled: newValue
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
    }

    // Also save to localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem('notificationsEnabled', String(newValue))
    }
  }

  return {
    toasts: readonly(toasts),
    notificationsEnabled: readonly(notificationsEnabled),
    loadSettings,
    show,
    remove,
    toggleNotifications,
    success: (title: string, message?: string, duration?: number) => show('success', title, message, duration),
    error: (title: string, message?: string, duration?: number) => show('error', title, message, duration),
    info: (title: string, message?: string, duration?: number) => show('info', title, message, duration),
    warning: (title: string, message?: string, duration?: number) => show('warning', title, message, duration)
  }
}
