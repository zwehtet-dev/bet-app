import { onUnmounted, ref } from 'vue'

// Track all intervals and timeouts for cleanup
const activeIntervals = new Set()
const activeTimeouts = new Set()

export const usePerformance = () => {
  const localIntervals = ref([])
  const localTimeouts = ref([])

  // Create interval with automatic cleanup
  const createInterval = (callback, delay) => {
    const id = setInterval(callback, delay)
    activeIntervals.add(id)
    localIntervals.value.push(id)
    return id
  }

  // Create timeout with automatic cleanup
  const createTimeout = (callback, delay) => {
    const id = setTimeout(() => {
      callback()
      activeTimeouts.delete(id)
      const idx = localTimeouts.value.indexOf(id)
      if (idx > -1) localTimeouts.value.splice(idx, 1)
    }, delay)
    activeTimeouts.add(id)
    localTimeouts.value.push(id)
    return id
  }

  // Clear specific interval
  const clearIntervalSafe = (id) => {
    if (id) {
      clearInterval(id)
      activeIntervals.delete(id)
      const idx = localIntervals.value.indexOf(id)
      if (idx > -1) localIntervals.value.splice(idx, 1)
    }
  }

  // Clear specific timeout
  const clearTimeoutSafe = (id) => {
    if (id) {
      clearTimeout(id)
      activeTimeouts.delete(id)
      const idx = localTimeouts.value.indexOf(id)
      if (idx > -1) localTimeouts.value.splice(idx, 1)
    }
  }

  // Cleanup all local timers on unmount
  onUnmounted(() => {
    localIntervals.value.forEach(id => {
      clearInterval(id)
      activeIntervals.delete(id)
    })
    localTimeouts.value.forEach(id => {
      clearTimeout(id)
      activeTimeouts.delete(id)
    })
    localIntervals.value = []
    localTimeouts.value = []
  })

  // Debounce function for expensive operations
  const debounce = (fn, delay = 300) => {
    let timeoutId = null
    return (...args) => {
      if (timeoutId) clearTimeoutSafe(timeoutId)
      timeoutId = createTimeout(() => fn(...args), delay)
    }
  }

  // Throttle function for frequent events
  const throttle = (fn, limit = 100) => {
    let inThrottle = false
    return (...args) => {
      if (!inThrottle) {
        fn(...args)
        inThrottle = true
        createTimeout(() => { inThrottle = false }, limit)
      }
    }
  }

  // Request idle callback wrapper with fallback
  const requestIdleCallback = (callback, options = {}) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      return window.requestIdleCallback(callback, options)
    }
    return createTimeout(callback, options.timeout || 1)
  }

  // Get active timer counts (for debugging)
  const getTimerStats = () => ({
    activeIntervals: activeIntervals.size,
    activeTimeouts: activeTimeouts.size,
    localIntervals: localIntervals.value.length,
    localTimeouts: localTimeouts.value.length
  })

  return {
    createInterval,
    createTimeout,
    clearIntervalSafe,
    clearTimeoutSafe,
    debounce,
    throttle,
    requestIdleCallback,
    getTimerStats
  }
}

// Global cleanup function (call on app unmount if needed)
export const cleanupAllTimers = () => {
  activeIntervals.forEach(id => clearInterval(id))
  activeTimeouts.forEach(id => clearTimeout(id))
  activeIntervals.clear()
  activeTimeouts.clear()
}
