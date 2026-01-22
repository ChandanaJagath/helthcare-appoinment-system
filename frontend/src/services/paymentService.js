import api from './api'

const paymentService = {
  getAll(params = {}) {
    return api.get('/payments', { params })
  },
  getById(id) {
    return api.get(`/payments/${id}`)
  },
  create(data) {
    return api.post('/payments', data)
  },
  process(id, paymentToken) {
    return api.post(`/payments/${id}/process`, { payment_token: paymentToken })
  }
}

export default paymentService
