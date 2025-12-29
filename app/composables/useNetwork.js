import { ref, onMounted, onUnmounted } from 'vue'

// Singleton state
const isOnline = ref(true)
const connectionType = ref('unknown')
const isSlowConnection = ref(false)
const saveData = ref(false)

let initialized = false

export const useNetwork = () => {
  const updateConnectionInfo = () => {
    if (typeof navigator === 'undefined') return
    
    isOnline.value = navigator.onLine
    
    // Check Network Information API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    
    if (connection) {
      connectionType.value = connection.effectiveType || connection.type || 'unknown'
      saveData.value = connection.saveData || false
      
      // Consider slow if 2g, slow-2g, or saveData is enabled
      isSlowConnection.value = 
        connection.saveData || 
        connection.effectiveType === '2g' || 
        connection.effectiveType === 'slow-2g' ||
        (connection.downlink && connection.downlink < 1)
    }
  }
  
  const handleOnline = () => { isOnline.value = true }
  const handleOffline = () => { isOnline.value = false }
  const handleConnectionChange = () => { updateConnectionInfo() }
  
  const init = () => {
    if (initialized || typeof window === 'undefined') return
    
    updateConnectionInfo()
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection) {
      connection.addEventListener('change', handleConnectionChange)
    }
    
    initialized = true
  }
  
  const cleanup = () => {
    if (typeof window === 'undefined') return
    
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection) {
      connection.removeEventListener('change', handleConnectionChange)
    }
  }
  
  // Get recommended refresh interval based on connection
  const getRefreshInterval = (defaultInterval = 30000) => {
    if (!isOnline.value) return null // Don't refresh when offline
    if (isSlowConnection.value) return defaultInterval * 3 // 3x slower on slow connections
    if (saveData.value) return defaultInterval * 2 // 2x slower when save data is enabled
    return defaultInterval
  }
  
  // Check if we should load images
  const shouldLoadImages = () => {
    if (!isOnline.value) return false
    if (saveData.value) return false
    return true
  }
  
  // Get image quality based on connection
  const getImageQuality = () => {
    if (isSlowConnection.value || saveData.value) return 'low'
    if (connectionType.value === '3g') return 'medium'
    return 'high'
  }
  
  onMounted(init)
  onUnmounted(cleanup)
  
  return {
    isOnline,
    connectionType,
    isSlowConnection,
    saveData,
    getRefreshInterval,
    shouldLoadImages,
    getImageQuality,
    init
  }
}
