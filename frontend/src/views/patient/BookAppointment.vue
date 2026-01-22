<template>
  <div class="book-appointment">
    <div class="page-header">
      <h1>Book Appointment</h1>
      <router-link to="/patient/appointments" class="btn btn-outline">
        ← Back to Appointments
      </router-link>
    </div>

    <div class="booking-container">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Select Doctor & Time</h2>
        </div>
        
        <form @submit.prevent="bookAppointment" class="booking-form">
          <div class="form-group">
            <label class="form-label">Choose Doctor</label>
            <select v-model="form.doctor_id" class="form-control" required @change="loadAvailableSlots">
              <option value="">Select a doctor</option>
              <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                Dr. {{ doctor.user?.name || 'Unknown' }} - {{ doctor.specialization }} (${{ doctor.consultation_fee }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Select Date</label>
            <input
              v-model="form.appointment_date"
              type="date"
              class="form-control"
              required
              :min="minDate"
              @change="loadAvailableSlots"
            />
          </div>

          <div class="form-group" v-if="availableSlots.length > 0">
            <label class="form-label">Available Time Slots</label>
            <div class="time-slots-grid">
              <button
                v-for="slot in availableSlots"
                :key="slot"
                type="button"
                :class="['time-slot-btn', form.appointment_time === slot ? 'active' : '']"
                @click="form.appointment_time = slot"
              >
                {{ slot }}
              </button>
            </div>
          </div>

          <div v-else-if="form.doctor_id && form.appointment_date" class="alert alert-info">
            No available slots for this date. Please select another date.
          </div>

          <div class="form-group">
            <label class="form-label">Reason for Visit</label>
            <textarea
              v-model="form.reason"
              class="form-control"
              rows="4"
              placeholder="Briefly describe the reason for your appointment..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-lg" :disabled="loading || !form.appointment_time">
              <span v-if="loading" class="spinner spinner-sm"></span>
              <span v-else>📅</span>
              {{ loading ? 'Booking...' : 'Book Appointment' }}
            </button>
            <router-link to="/patient/appointments" class="btn btn-outline btn-lg">
              Cancel
            </router-link>
          </div>
        </form>
      </div>

      <div class="info-card card">
        <h3>📋 Booking Information</h3>
        <ul class="info-list">
          <li>Appointments are confirmed after payment</li>
          <li>You'll receive SMS and email reminders</li>
          <li>You can reschedule or cancel up to 24 hours before</li>
          <li>Consultation fee will be charged after booking</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import appointmentService from '../../services/appointmentService'
import doctorService from '../../services/doctorService'

export default {
  name: 'BookAppointment',
  data() {
    return {
      form: {
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        reason: ''
      },
      doctors: [],
      availableSlots: [],
      loading: false
    }
  },
  computed: {
    minDate() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split('T')[0]
    }
  },
  async mounted() {
    await this.loadDoctors()
  },
  methods: {
    async loadDoctors() {
      try {
        const response = await doctorService.getAll()
        this.doctors = response.data.data || response.data || []
      } catch (error) {
        console.error('Error loading doctors:', error)
        // Fallback: Use mock data if API fails
        this.doctors = [
          { id: 1, specialization: 'Cardiology', consultation_fee: 150.00, user: { name: 'Dr. Sarah Smith' } },
          { id: 2, specialization: 'Pediatrics', consultation_fee: 120.00, user: { name: 'Dr. Michael Johnson' } },
          { id: 3, specialization: 'Dermatology', consultation_fee: 130.00, user: { name: 'Dr. Emily Davis' } },
          { id: 4, specialization: 'Orthopedics', consultation_fee: 180.00, user: { name: 'Dr. Robert Wilson' } },
          { id: 5, specialization: 'Neurology', consultation_fee: 200.00, user: { name: 'Dr. Jennifer Brown' } },
          { id: 6, specialization: 'General Medicine', consultation_fee: 100.00, user: { name: 'Dr. David Martinez' } }
        ]
      }
    },
    async loadAvailableSlots() {
      if (this.form.doctor_id && this.form.appointment_date) {
        try {
          const response = await appointmentService.getAvailableSlots(
            this.form.doctor_id,
            this.form.appointment_date
          )
          this.availableSlots = response.data.slots || []
          this.form.appointment_time = ''
        } catch (error) {
          console.error('Error loading slots:', error)
          this.availableSlots = []
        }
      }
    },
    async bookAppointment() {
      if (!this.form.appointment_time) {
        alert('Please select a time slot')
        return
      }
      
      this.loading = true
      try {
        await appointmentService.create(this.form)
        this.$router.push('/patient/appointments')
      } catch (error) {
        alert('Failed to book appointment: ' + (error.response?.data?.message || 'Unknown error'))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.book-appointment {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.booking-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.booking-form {
  margin-top: 1rem;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.time-slot-btn {
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.time-slot-btn:hover {
  border-color: var(--primary-color);
  background: var(--light-color);
}

.time-slot-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  border-color: var(--primary-color);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.info-card h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.info-list {
  list-style: none;
  padding: 0;
}

.info-list li {
  padding: 0.75rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: var(--text-secondary);
}

.info-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--success-color);
  font-weight: bold;
}

@media (max-width: 968px) {
  .booking-container {
    grid-template-columns: 1fr;
  }
  
  .book-appointment {
    padding: 1rem;
  }
}
</style>
