import api from './api'

const authService = {
  login(credentials) {
    return api.post('/auth/login', credentials)
  },
  register(userData) {
    return api.post('/auth/register', userData)
  },
  logout() {
    return api.post('/auth/logout')
  },
  getCurrentUser() {
    return api.get('/auth/me')
  },
  refreshToken() {
    return api.post('/auth/refresh')
  }
}

export default authService
