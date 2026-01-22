import axios from 'axios'
import store from '../store'

// Use environment variable or fallback to proxy for development
const getBaseURL = () => {
  // In production (Vercel), use the full API URL from environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  // In development, use proxy
  return '/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

api.interceptors.request.use(
  config => {
    const token = store.getters['auth/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      console.error('Backend API is not running. Please check your API server configuration.')
      // Don't redirect on connection errors, just show a message
      return Promise.reject({
        ...error,
        message: 'Backend server is not running. Please check your API server configuration.'
      })
    }
    if (error.response?.status === 401) {
      store.dispatch('auth/logout')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
