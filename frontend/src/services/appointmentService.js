import api from './api'

const appointmentService = {
  getAll(params = {}) {
    return api.get('/appointments', { params })
  },
  getById(id) {
    return api.get(`/appointments/${id}`)
  },
  create(data) {
    return api.post('/appointments', data)
  },
  update(id, data) {
    return api.put(`/appointments/${id}`, data)
  },
  delete(id) {
    return api.delete(`/appointments/${id}`)
  },
  reschedule(id, data) {
    return api.post(`/appointments/${id}/reschedule`, data)
  },
  cancel(id) {
    return api.post(`/appointments/${id}/cancel`)
  },
  getAvailableSlots(doctorId, date) {
    return api.get('/appointments/available-slots', {
      params: { doctor_id: doctorId, date }
    })
  }
}

export default appointmentService
