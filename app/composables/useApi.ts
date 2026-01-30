export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  // Get CSRF token from cookie
  const getCsrfToken = () => {
    if (process.client) {
      const cookies = document.cookie.split(';')
      const xsrfCookie = cookies.find(c => c.trim().startsWith('XSRF-TOKEN='))
      if (xsrfCookie) {
        return decodeURIComponent(xsrfCookie.split('=')[1])
      }
    }
    return null
  }

  // Fetch CSRF cookie before making state-changing requests
  const getCsrfCookie = async () => {
    try {
      await $fetch(`${baseURL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Failed to fetch CSRF cookie:', error)
    }
  }

  const get = async (endpoint: string, options: any = {}) => {
    return await $fetch(`${baseURL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      ...options
    })
  }

  const post = async (endpoint: string, body: any, options: any = {}) => {
    // Get CSRF cookie before POST requests
    await getCsrfCookie()
    
    // Get CSRF token from cookie
    const csrfToken = getCsrfToken()
    
    return await $fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      body,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken || '',
        ...(options.headers || {})
      },
      ...options
    })
  }

  const put = async (endpoint: string, body: any, options: any = {}) => {
    // Get CSRF cookie before PUT requests
    await getCsrfCookie()
    
    // Get CSRF token from cookie
    const csrfToken = getCsrfToken()
    
    return await $fetch(`${baseURL}${endpoint}`, {
      method: 'PUT',
      body,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken || '',
        ...(options.headers || {})
      },
      ...options
    })
  }

  const del = async (endpoint: string, options: any = {}) => {
    // Get CSRF cookie before DELETE requests
    await getCsrfCookie()
    
    // Get CSRF token from cookie
    const csrfToken = getCsrfToken()
    
    return await $fetch(`${baseURL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken || '',
        ...(options.headers || {})
      },
      ...options
    })
  }

  return { get, post, put, del, getCsrfCookie }
}
