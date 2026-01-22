import authService from '../../services/authService'

const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token')
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  userRole: state => state.user?.role || null,
  token: state => state.token
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },
  LOGOUT(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    localStorage.removeItem('token')
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await authService.login(credentials)
      commit('SET_TOKEN', response.data.token)
      commit('SET_USER', response.data.user)
      return response
    } catch (error) {
      throw error
    }
  },
  async register({ commit }, userData) {
    try {
      const response = await authService.register(userData)
      commit('SET_TOKEN', response.data.token)
      commit('SET_USER', response.data.user)
      return response
    } catch (error) {
      throw error
    }
  },
  async logout({ commit }) {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      commit('LOGOUT')
    }
  },
  async getCurrentUser({ commit }) {
    try {
      const response = await authService.getCurrentUser()
      commit('SET_USER', response.data)
      return response
    } catch (error) {
      commit('LOGOUT')
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
