<template>
  <div class="appointments-view">
    <div class="page-header">
      <h1>My Appointments</h1>
      <router-link to="/patient/book-appointment" class="btn btn-primary">
        <span>➕</span>
        Book New Appointment
      </router-link>
    </div>

    <div class="filters">
      <select v-model="filterStatus" class="form-control" style="max-width: 200px;">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <div v-if="loading" class="loading-container">
      <LoadingSpinner message="Loading appointments..." />
    </div>

    <div v-else-if="filteredAppointments.length === 0" class="empty-state">
      <div class="empty-state-icon">📅</div>
      <h3>No appointments found</h3>
      <p>You don't have any appointments yet.</p>
      <router-link to="/patient/book-appointment" class="btn btn-primary mt-3">
        Book Your First Appointment
      </router-link>
    </div>

    <div v-else class="appointments-grid">
      <div v-for="apt in filteredAppointments" :key="apt.id" class="appointment-card">
        <div class="appointment-card-header">
          <div class="appointment-date-badge">
            <div class="date-day">{{ formatDay(apt.appointment_date) }}</div>
            <div class="date-month">{{ formatMonth(apt.appointment_date) }}</div>
          </div>
          <span :class="['status-badge', apt.status]">{{ apt.status }}</span>
        </div>
        
        <div class="appointment-card-body">
          <div class="appointment-time">
            <span class="time-icon">🕐</span>
            <span>{{ formatTime(apt.appointment_time) }}</span>
          </div>
          <h3 class="doctor-name">Dr. {{ apt.doctor?.user?.name || 'Unknown Doctor' }}</h3>
          <p class="appointment-reason">{{ apt.reason || 'General consultation' }}</p>
          <div v-if="apt.notes" class="appointment-notes">
            <strong>Notes:</strong> {{ apt.notes }}
          </div>
        </div>

        <div class="appointment-card-footer">
          <button 
            v-if="apt.status === 'pending'" 
            @click="cancelAppointment(apt.id)" 
            class="btn btn-danger btn-sm"
          >
            Cancel
          </button>
          <button 
            v-if="apt.status === 'pending'" 
            @click="rescheduleAppointment(apt)" 
            class="btn btn-outline btn-sm"
          >
            Reschedule
          </button>
          <button 
            v-if="apt.status === 'confirmed'" 
            class="btn btn-success btn-sm"
            disabled
          >
            Confirmed ✓
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appointmentService from '../../services/appointmentService'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

export default {
  name: 'PatientAppointments',
  components: {
    LoadingSpinner
  },
  data() {
    return {
      appointments: [],
      filterStatus: '',
      loading: true
    }
  },
  computed: {
    filteredAppointments() {
      if (!this.filterStatus) return this.appointments
      return this.appointments.filter(apt => apt.status === this.filterStatus)
    }
  },
  async mounted() {
    await this.loadAppointments()
  },
  methods: {
    async loadAppointments() {
      this.loading = true
      try {
        const response = await appointmentService.getAll()
        this.appointments = response.data.data || response.data || []
        this.appointments.sort((a, b) => {
          const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`)
          const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`)
          return dateB - dateA
        })
      } catch (error) {
        console.error('Error loading appointments:', error)
      } finally {
        this.loading = false
      }
    },
    async cancelAppointment(id) {
      if (confirm('Are you sure you want to cancel this appointment?')) {
        try {
          await appointmentService.cancel(id)
          await this.loadAppointments()
        } catch (error) {
          alert('Failed to cancel appointment')
        }
      }
    },
    rescheduleAppointment(appointment) {
      this.$router.push({
        name: 'BookAppointment',
        query: { reschedule: appointment.id }
      })
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    formatDay(date) {
      return new Date(date).getDate()
    },
    formatMonth(date) {
      return new Date(date).toLocaleDateString('en-US', { month: 'short' })
    },
    formatTime(time) {
      if (!time) return 'N/A'
      return time.substring(0, 5)
    }
  }
}
</script>

<style scoped>
.appointments-view {
  padding: 2rem;
  max-width: 1400px;
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

.filters {
  margin-bottom: 2rem;
}

.appointments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.appointment-card {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: all 0.2s ease;
}

.appointment-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.appointment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
}

.appointment-date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
}

.date-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 0.75rem;
  text-transform: uppercase;
  opacity: 0.9;
}

.appointment-card-body {
  padding: 1.5rem;
}

.appointment-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.time-icon {
  font-size: 1rem;
}

.doctor-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.appointment-reason {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
}

.appointment-notes {
  padding: 0.75rem;
  background: var(--light-color);
  border-radius: var(--radius);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.appointment-card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--light-gray);
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.loading-container {
  padding: 4rem 2rem;
}

@media (max-width: 768px) {
  .appointments-view {
    padding: 1rem;
  }
  
  .appointments-grid {
    grid-template-columns: 1fr;
  }
}
</style>
