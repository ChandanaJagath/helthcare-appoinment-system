<template>
  <div class="admin-appointments">
    <div class="page-header">
      <div>
        <h1>All Appointments</h1>
        <p class="page-subtitle">Manage and monitor all appointments</p>
      </div>
      <button @click="exportData" class="btn btn-outline">
        <span>📥</span>
        Export
      </button>
    </div>

    <!-- Filters -->
    <div class="filters card">
      <div class="filter-group">
        <label class="form-label">Status</label>
        <select v-model="filters.status" class="form-control" @change="loadAppointments">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="form-label">Date</label>
        <input
          v-model="filters.date"
          type="date"
          class="form-control"
          @change="loadAppointments"
        />
      </div>
      <div class="filter-group">
        <label class="form-label">Doctor</label>
        <select v-model="filters.doctor_id" class="form-control" @change="loadAppointments">
          <option value="">All Doctors</option>
          <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
            {{ doctor.user?.name || 'Unknown' }}
          </option>
        </select>
      </div>
    </div>

    <!-- Appointments -->
    <div v-if="loading" class="loading-container">
      <LoadingSpinner message="Loading appointments..." />
    </div>
    <div v-else-if="appointments.length === 0" class="empty-state">
      <div class="empty-state-icon">📅</div>
      <h3>No appointments found</h3>
      <p>Try adjusting your filters.</p>
    </div>
    <div v-else class="appointments-grid">
      <div v-for="apt in appointments" :key="apt.id" class="appointment-card">
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
          <div class="appointment-people">
            <div class="person-info">
              <strong>Patient:</strong> {{ apt.patient?.name || 'Unknown' }}
            </div>
            <div class="person-info">
              <strong>Doctor:</strong> {{ apt.doctor?.user?.name || 'Unknown Doctor' }}
            </div>
          </div>
          <p v-if="apt.reason" class="appointment-reason">{{ apt.reason }}</p>
        </div>

        <div class="appointment-card-footer">
          <button 
            @click="updateStatus(apt.id, 'confirmed')" 
            v-if="apt.status === 'pending'"
            class="btn btn-success btn-sm"
          >
            Confirm
          </button>
          <button 
            @click="updateStatus(apt.id, 'completed')" 
            v-if="apt.status === 'confirmed'"
            class="btn btn-success btn-sm"
          >
            Mark Complete
          </button>
          <button 
            @click="updateStatus(apt.id, 'cancelled')" 
            v-if="apt.status !== 'cancelled'"
            class="btn btn-danger btn-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminService from '../../services/adminService'
import doctorService from '../../services/doctorService'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

export default {
  name: 'AdminAppointments',
  components: {
    LoadingSpinner
  },
  data() {
    return {
      appointments: [],
      doctors: [],
      loading: false,
      filters: {
        status: '',
        date: '',
        doctor_id: ''
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.loadAppointments(),
      this.loadDoctors()
    ])
  },
  methods: {
    async loadAppointments() {
      this.loading = true
      try {
        const params = {}
        if (this.filters.status) params.status = this.filters.status
        if (this.filters.date) params.date = this.filters.date
        if (this.filters.doctor_id) params.doctor_id = this.filters.doctor_id
        
        const response = await adminService.getAppointments(params)
        this.appointments = response.data.data || response.data || []
      } catch (error) {
        console.error('Error loading appointments:', error)
      } finally {
        this.loading = false
      }
    },
    async loadDoctors() {
      try {
        const response = await doctorService.getAll()
        this.doctors = response.data.data || response.data || []
      } catch (error) {
        console.error('Error loading doctors:', error)
      }
    },
    async updateStatus(appointmentId, status) {
      try {
        // In a real app, this would call an API endpoint
        const appointment = this.appointments.find(a => a.id === appointmentId)
        if (appointment) {
          appointment.status = status
          alert(`Appointment ${status} successfully`)
        }
      } catch (error) {
        alert('Failed to update appointment status')
      }
    },
    exportData() {
      alert('Export feature coming soon!')
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
.admin-appointments {
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
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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

.appointment-people {
  margin-bottom: 1rem;
}

.person-info {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.appointment-reason {
  padding: 0.75rem;
  background: var(--light-color);
  border-radius: var(--radius);
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.appointment-card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--light-gray);
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .admin-appointments {
    padding: 1rem;
  }
  
  .appointments-grid {
    grid-template-columns: 1fr;
  }
}
</style>
