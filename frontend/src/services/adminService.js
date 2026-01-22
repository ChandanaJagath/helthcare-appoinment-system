import api from './api'

const adminService = {
  getDashboard() {
    return api.get('/admin/dashboard')
  },
  getUsers(params = {}) {
    return api.get('/admin/users', { params })
  },
  createUser(data) {
    return api.post('/admin/users', data)
  },
  updateUser(id, data) {
    return api.put(`/admin/users/${id}`, data)
  },
  deleteUser(id) {
    return api.delete(`/admin/users/${id}`)
  },
  getAppointments(params = {}) {
    return api.get('/admin/appointments', { params })
  },
  getReports(params = {}) {
    return api.get('/admin/reports', { params })
  }
}

export default adminService
