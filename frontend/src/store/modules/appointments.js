const state = {
  appointments: [],
  currentAppointment: null,
  loading: false
}

const getters = {
  appointments: state => state.appointments,
  currentAppointment: state => state.currentAppointment,
  loading: state => state.loading
}

const mutations = {
  SET_APPOINTMENTS(state, appointments) {
    state.appointments = appointments
  },
  SET_CURRENT_APPOINTMENT(state, appointment) {
    state.currentAppointment = appointment
  },
  ADD_APPOINTMENT(state, appointment) {
    state.appointments.unshift(appointment)
  },
  UPDATE_APPOINTMENT(state, appointment) {
    const index = state.appointments.findIndex(a => a.id === appointment.id)
    if (index !== -1) {
      state.appointments[index] = appointment
    }
  },
  REMOVE_APPOINTMENT(state, appointmentId) {
    state.appointments = state.appointments.filter(a => a.id !== appointmentId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

const actions = {
  setAppointments({ commit }, appointments) {
    commit('SET_APPOINTMENTS', appointments)
  },
  setCurrentAppointment({ commit }, appointment) {
    commit('SET_CURRENT_APPOINTMENT', appointment)
  },
  addAppointment({ commit }, appointment) {
    commit('ADD_APPOINTMENT', appointment)
  },
  updateAppointment({ commit }, appointment) {
    commit('UPDATE_APPOINTMENT', appointment)
  },
  removeAppointment({ commit }, appointmentId) {
    commit('REMOVE_APPOINTMENT', appointmentId)
  },
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
