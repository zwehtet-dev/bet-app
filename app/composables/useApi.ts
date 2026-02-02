export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  const get = async (endpoint: string, options: any = {}) => {
    return await $fetch(`${baseURL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      ...options
    })
  }

  const post = async (endpoint: string, body: any, options: any = {}) => {
    return await $fetch(`${baseURL}${endpoint}`, {
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
  }

  const put = async (endpoint: string, body: any, options: any = {}) => {
    return await $fetch(`${baseURL}${endpoint}`, {
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
  }

  const del = async (endpoint: string, options: any = {}) => {
    return await $fetch(`${baseURL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      },
      ...options
    })
  }

  return { get, post, put, del }
}
