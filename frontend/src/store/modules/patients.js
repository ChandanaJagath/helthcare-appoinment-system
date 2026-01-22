const state = {
  patients: [],
  currentPatient: null,
  medicalRecords: [],
  prescriptions: []
}

const getters = {
  patients: state => state.patients,
  currentPatient: state => state.currentPatient,
  medicalRecords: state => state.medicalRecords,
  prescriptions: state => state.prescriptions
}

const mutations = {
  SET_PATIENTS(state, patients) {
    state.patients = patients
  },
  SET_CURRENT_PATIENT(state, patient) {
    state.currentPatient = patient
  },
  SET_MEDICAL_RECORDS(state, records) {
    state.medicalRecords = records
  },
  SET_PRESCRIPTIONS(state, prescriptions) {
    state.prescriptions = prescriptions
  }
}

const actions = {
  setPatients({ commit }, patients) {
    commit('SET_PATIENTS', patients)
  },
  setCurrentPatient({ commit }, patient) {
    commit('SET_CURRENT_PATIENT', patient)
  },
  setMedicalRecords({ commit }, records) {
    commit('SET_MEDICAL_RECORDS', records)
  },
  setPrescriptions({ commit }, prescriptions) {
    commit('SET_PRESCRIPTIONS', prescriptions)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
