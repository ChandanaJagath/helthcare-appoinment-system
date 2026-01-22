const state = {
  notifications: []
}

const getters = {
  notifications: state => state.notifications
}

const mutations = {
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications
  },
  ADD_NOTIFICATION(state, notification) {
    state.notifications.unshift(notification)
  }
}

const actions = {
  setNotifications({ commit }, notifications) {
    commit('SET_NOTIFICATIONS', notifications)
  },
  addNotification({ commit }, notification) {
    commit('ADD_NOTIFICATION', notification)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
