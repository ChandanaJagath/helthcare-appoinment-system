import axios from 'axios'
import store from '../store'

// Use relative path - API is on same domain as frontend (Vercel serverless function)
const getBaseURL = () => {
  // Always use relative path /api
  // In development: Vite proxy handles /api -> localhost:8000
  // In production: Vercel routes /api/* to serverless function
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
