import { handleNetworkError, isOffline, getOfflineMessage } from '~/utils/networkError'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  /**
   * Wraps fetch calls with network error handling
   */
  const handleRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
    // Check if offline before making request
    if (isOffline()) {
      throw new Error(getOfflineMessage())
    }

    try {
      return await requestFn()
    } catch (error: any) {
      // Handle API error responses (400, 422, 500, etc.)
      if (error?.data) {
        // Extract error message from API response
        const errorMessage = error.data.message || error.data.error || 'An error occurred'
        const enhancedError = new Error(errorMessage)
        ;(enhancedError as any).response = error
        ;(enhancedError as any).data = error.data
        ;(enhancedError as any).status = error.status || error.statusCode
        throw enhancedError
      }

      // Handle network errors
      const errorInfo = handleNetworkError(error)
      
      if (errorInfo.isNetworkError) {
        // Throw a new error with user-friendly message
        const enhancedError = new Error(errorInfo.message)
        ;(enhancedError as any).isNetworkError = true
        ;(enhancedError as any).shouldRetry = errorInfo.shouldRetry
        ;(enhancedError as any).originalError = error
        throw enhancedError
      }

      // Re-throw non-network errors as-is
      throw error
    }
  }

  const get = async (endpoint: string, options: any = {}) => {
    return handleRequest(() =>
      $fetch(`${baseURL}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        ...options
      })
    )
  }

  const post = async (endpoint: string, body: any, options: any = {}) => {
    return handleRequest(() =>
      $fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        body,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      })
    )
  }

  const put = async (endpoint: string, body: any, options: any = {}) => {
    return handleRequest(() =>
      $fetch(`${baseURL}${endpoint}`, {
        method: 'PUT',
        body,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      })
    )
  }

  const del = async (endpoint: string, options: any = {}) => {
    return handleRequest(() =>
      $fetch(`${baseURL}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(options.headers || {})
        },
        ...options
      })
    )
  }

  return { get, post, put, del }
}
