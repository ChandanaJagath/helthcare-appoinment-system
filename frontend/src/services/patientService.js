import api from './api'

const patientService = {
  getAppointments() {
    return api.get('/patients/appointments')
  },
  getMedicalRecords() {
    return api.get('/patients/medical-records')
  },
  getPrescriptions() {
    return api.get('/patients/prescriptions')
  },
  getHistory() {
    return api.get('/patients/history')
  }
}

export default patientService
