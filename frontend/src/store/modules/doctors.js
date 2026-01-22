const state = {
  doctors: [],
  currentDoctor: null
}

const getters = {
  doctors: state => state.doctors,
  currentDoctor: state => state.currentDoctor
}

const mutations = {
  SET_DOCTORS(state, doctors) {
    state.doctors = doctors
  },
  SET_CURRENT_DOCTOR(state, doctor) {
    state.currentDoctor = doctor
  }
}

const actions = {
  setDoctors({ commit }, doctors) {
    commit('SET_DOCTORS', doctors)
  },
  setCurrentDoctor({ commit }, doctor) {
    commit('SET_CURRENT_DOCTOR', doctor)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
