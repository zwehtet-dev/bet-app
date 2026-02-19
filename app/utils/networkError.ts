/**
 * Network Error Handling Utility
 * 
 * This utility provides consistent network error handling across the application.
 * It converts technical network errors into user-friendly messages with retry suggestions.
 * 
 * Validates: Requirements 10.6
 */

export interface NetworkErrorInfo {
  message: string
  isNetworkError: boolean
  shouldRetry: boolean
  technicalError?: string
}

/**
 * Determines if an error is a network-related error
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false

  const errorString = String(error).toLowerCase()
  const errorMessage = error?.message?.toLowerCase() || ''

  const networkErrorPatterns = [
    'failed to fetch',
    'network request failed',
    'connection refused',
    'econnrefused',
    'etimedout',
    'timeout',
    'timed out',
    'enotfound',
    'getaddrinfo',
    'net::err_connection_refused',
    'net::err_name_not_resolved',
    'net::err_internet_disconnected',
    'connection reset',
    'socket hang up',
  ]

  return networkErrorPatterns.some(
    pattern => errorString.includes(pattern) || errorMessage.includes(pattern)
  )
}

/**
 * Converts technical network errors to user-friendly messages
 * 
 * @param error - The error object or message
 * @returns User-friendly error message with retry suggestion
 */
export function getNetworkErrorMessage(error: any): string {
  const errorString = String(error).toLowerCase()
  const errorMessage = error?.message?.toLowerCase() || ''
  const combined = `${errorString} ${errorMessage}`

  // Timeout errors
  if (combined.includes('timeout') || combined.includes('etimedout') || combined.includes('timed out')) {
    return 'The request timed out. Please check your internet connection and try again.'
  }

  // Connection refused
  if (combined.includes('refused') || combined.includes('econnrefused')) {
    return 'Unable to connect to the server. Please check your connection and try again.'
  }

  // DNS/Not found errors
  if (combined.includes('enotfound') || combined.includes('not_resolved')) {
    return 'Unable to reach the server. Please check your internet connection and try again.'
  }

  // Generic fetch/network errors
  if (combined.includes('fetch') || combined.includes('network')) {
    return 'Connection error. Please check your internet connection and try again.'
  }

  // Connection reset
  if (combined.includes('reset') || combined.includes('hang up')) {
    return 'Connection was interrupted. Please try again.'
  }

  // Default fallback for network errors
  return 'Unable to connect to the server. Please check your internet connection and try again.'
}

/**
 * Handles network errors and returns structured error information
 * 
 * @param error - The error object
 * @returns Structured error information
 */
export function handleNetworkError(error: any): NetworkErrorInfo {
  const isNetwork = isNetworkError(error)

  if (isNetwork) {
    return {
      message: getNetworkErrorMessage(error),
      isNetworkError: true,
      shouldRetry: true,
      technicalError: error?.message || String(error),
    }
  }

  // Not a network error, return the original error message
  return {
    message: error?.message || String(error),
    isNetworkError: false,
    shouldRetry: false,
    technicalError: error?.message || String(error),
  }
}

/**
 * Checks if the browser is currently offline
 */
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

/**
 * Gets an appropriate error message when offline
 */
export function getOfflineMessage(): string {
  return 'You are currently offline. Please check your internet connection.'
}
