import { ref } from 'vue'

// Global cache store
const cache = new Map()
const pendingRequests = new Map()

// Cache configuration
const DEFAULT_TTL = 60000 // 1 minute
const CACHE_CONFIG = {
  'carousel': { ttl: 300000 }, // 5 minutes
  'gameSettings': { ttl: 300000 }, // 5 minutes
  'paymentMethods': { ttl: 300000 }, // 5 minutes
  'announcements': { ttl: 120000 }, // 2 minutes
  'live2D': { ttl: 10000 }, // 10 seconds
  '3DResults': { ttl: 60000 }, // 1 minute
  '2DHistory': { ttl: 30000 }, // 30 seconds
  'profile': { ttl: 30000 }, // 30 seconds
  'betHistory': { ttl: 30000 } // 30 seconds
}

export const useApiCache = () => {
  // Get cached data
  const get = (key) => {
    const cached = cache.get(key)
    if (!cached) return null
    
    const config = CACHE_CONFIG[key] || { ttl: DEFAULT_TTL }
    const isExpired = Date.now() - cached.timestamp > config.ttl
    
    if (isExpired) {
      cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  // Set cache data
  const set = (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
  
  // Clear specific cache
  const clear = (key) => {
    if (key) {
      cache.delete(key)
    } else {
      cache.clear()
    }
  }
  
  // Clear all user-related cache (on logout)
  const clearUserCache = () => {
    const userKeys = ['profile', 'betHistory', 'transactionHistory', 'wallet']
    userKeys.forEach(key => cache.delete(key))
  }
  
  // Request deduplication - prevent multiple identical requests
  const dedupe = async (key, requestFn) => {
    // Check cache first
    const cached = get(key)
    if (cached) {
      return { data: cached, fromCache: true }
    }
    
    // Check if request is already pending
    if (pendingRequests.has(key)) {
      return pendingRequests.get(key)
    }
    
    // Create new request promise
    const requestPromise = (async () => {
      try {
        const result = await requestFn()
        if (result && result.msgState === 'data') {
          set(key, result.data)
        }
        return { data: result?.data, fromCache: false }
      } finally {
        pendingRequests.delete(key)
      }
    })()
    
    pendingRequests.set(key, requestPromise)
    return requestPromise
  }
  
  // Invalidate cache after mutation
  const invalidate = (keys) => {
    const keysArray = Array.isArray(keys) ? keys : [keys]
    keysArray.forEach(key => cache.delete(key))
  }
  
  // Get cache stats (for debugging)
  const getStats = () => ({
    size: cache.size,
    keys: Array.from(cache.keys()),
    pendingRequests: Array.from(pendingRequests.keys())
  })
  
  return {
    get,
    set,
    clear,
    clearUserCache,
    dedupe,
    invalidate,
    getStats
  }
}
