import { createStore } from 'vuex'
import auth from './modules/auth'
import appointments from './modules/appointments'
import patients from './modules/patients'
import doctors from './modules/doctors'
import notifications from './modules/notifications'

export default createStore({
  modules: {
    auth,
    appointments,
    patients,
    doctors,
    notifications
  }
})
