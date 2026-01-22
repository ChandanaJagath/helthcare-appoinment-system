import api from './api'

const doctorService = {
  getAll() {
    return api.get('/doctors')
  },
  getDashboard() {
    return api.get('/doctors/dashboard')
  },
  getAppointments(params = {}) {
    return api.get('/doctors/appointments', { params })
  },
  getPatients() {
    return api.get('/doctors/patients')
  },
  getPatientDetails(patientId) {
    return api.get(`/doctors/patients/${patientId}`)
  },
  createPrescription(data) {
    return api.post('/doctors/prescriptions', data)
  },
  createMedicalRecord(data) {
    return api.post('/doctors/medical-records', data)
  },
  updateSchedule(data) {
    return api.put('/doctors/schedule', data)
  }
}

export default doctorService
