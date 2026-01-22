<template>
  <div class="doctor-appointments">
    <div class="page-header">
      <h1>My Appointments</h1>
      <div class="header-actions">
        <select v-model="statusFilter" @change="filterAppointments" class="filter-select">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input 
          v-model="searchQuery" 
          @input="filterAppointments" 
          type="text" 
          placeholder="Search by patient name..." 
          class="search-input"
        />
        <button @click="loadAppointments" class="btn btn-secondary">
          <span class="icon">🔄</span> Refresh
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading appointments...</p>
    </div>

    <div v-else-if="filteredAppointments.length === 0" class="empty-state">
      <div class="empty-icon">📅</div>
      <p>{{ searchQuery || statusFilter ? 'No appointments match your filters' : 'No appointments found' }}</p>
      <button v-if="searchQuery || statusFilter" @click="clearFilters" class="btn btn-primary">
        Clear Filters
      </button>
    </div>

    <div v-else class="appointments-grid">
      <div 
        v-for="apt in filteredAppointments" 
        :key="apt.id" 
        class="appointment-card"
        :class="apt.status"
      >
        <div class="appointment-header">
          <div class="appointment-date-time">
            <div class="date-section">
              <span class="date-day">{{ formatDateDay(apt.appointment_date) }}</span>
              <span class="date-month">{{ formatDateMonth(apt.appointment_date) }}</span>
            </div>
            <div class="time-section">
              <span class="time-icon">🕐</span>
              <span class="time">{{ apt.appointment_time }}</span>
            </div>
          </div>
          <span :class="['status-badge', apt.status]">{{ apt.status }}</span>
        </div>

        <div class="appointment-body">
          <div class="patient-section">
            <div class="patient-avatar">
              {{ apt.patient?.name?.charAt(0).toUpperCase() || '?' }}
            </div>
            <div class="patient-details">
              <h3>{{ apt.patient?.name || 'Unknown Patient' }}</h3>
              <p class="patient-contact">
                <span v-if="apt.patient?.email">📧 {{ apt.patient.email }}</span>
                <span v-if="apt.patient?.phone">📞 {{ apt.patient.phone }}</span>
              </p>
            </div>
          </div>

          <div class="appointment-info">
            <div class="info-item" v-if="apt.reason">
              <span class="info-label">Reason:</span>
              <span class="info-value">{{ apt.reason }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Appointment ID:</span>
              <span class="info-value">#{{ apt.id }}</span>
            </div>
            <div class="info-item" v-if="apt.created_at">
              <span class="info-label">Booked on:</span>
              <span class="info-value">{{ formatDateTime(apt.created_at) }}</span>
            </div>
          </div>
        </div>

        <div class="appointment-actions">
          <router-link 
            :to="`/doctor/patients/${apt.patient?.id}`" 
            class="btn btn-primary btn-sm"
          >
            View Patient
          </router-link>
          <button 
            v-if="apt.status === 'pending' || apt.status === 'confirmed'"
            @click="updateStatus(apt.id, 'completed')" 
            class="btn btn-success btn-sm"
          >
            Mark Complete
          </button>
          <button 
            v-if="apt.status === 'pending'"
            @click="updateStatus(apt.id, 'confirmed')" 
            class="btn btn-info btn-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import doctorService from '../../services/doctorService'

export default {
  name: 'DoctorAppointments',
  data() {
    return {
      appointments: [],
      filteredAppointments: [],
      loading: false,
      statusFilter: '',
      searchQuery: ''
    }
  },
  async mounted() {
    await this.loadAppointments()
  },
  methods: {
    async loadAppointments() {
      this.loading = true
      try {
        const response = await doctorService.getAppointments()
        this.appointments = response.data.data || response.data || []
        this.filterAppointments()
      } catch (error) {
        console.error('Error loading appointments:', error)
        this.$toast?.error('Failed to load appointments')
      } finally {
        this.loading = false
      }
    },
    filterAppointments() {
      let filtered = [...this.appointments]
      
      if (this.statusFilter) {
        filtered = filtered.filter(apt => apt.status === this.statusFilter)
      }
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(apt => 
          apt.patient?.name?.toLowerCase().includes(query) ||
          apt.patient?.email?.toLowerCase().includes(query)
        )
      }
      
      // Sort by date and time
      filtered.sort((a, b) => {
        const dateCompare = a.appointment_date.localeCompare(b.appointment_date)
        return dateCompare !== 0 ? dateCompare : a.appointment_time.localeCompare(b.appointment_time)
      })
      
      this.filteredAppointments = filtered
    },
    clearFilters() {
      this.statusFilter = ''
      this.searchQuery = ''
      this.filterAppointments()
    },
    async updateStatus(appointmentId, newStatus) {
      try {
        // In a real app, this would call an API endpoint
        const appointment = this.appointments.find(a => a.id === appointmentId)
        if (appointment) {
          appointment.status = newStatus
          this.filterAppointments()
          this.$toast?.success(`Appointment ${newStatus} successfully`)
        }
      } catch (error) {
        console.error('Error updating status:', error)
        this.$toast?.error('Failed to update appointment status')
      }
    },
    formatDateDay(date) {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { day: 'numeric' })
    },
    formatDateMonth(date) {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { month: 'short' })
    },
    formatDateTime(dateTime) {
      if (!dateTime) return 'N/A'
      const d = new Date(dateTime)
      return d.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.doctor-appointments {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select,
.search-input {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: var(--dark-color);
}

.search-input {
  min-width: 250px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 20px;
}

.appointments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.appointment-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid;
}

.appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.appointment-card.pending {
  border-left-color: #f59e0b;
}

.appointment-card.confirmed {
  border-left-color: #10b981;
}

.appointment-card.completed {
  border-left-color: #3b82f6;
}

.appointment-card.cancelled {
  border-left-color: #ef4444;
}

.appointment-header {
  padding: 20px;
  background: var(--light-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.appointment-date-time {
  display: flex;
  gap: 16px;
  align-items: center;
}

.date-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  min-width: 50px;
}

.date-day {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.date-month {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-top: 4px;
}

.time-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-icon {
  font-size: 18px;
}

.time {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-color);
}

.appointment-body {
  padding: 20px;
}

.patient-section {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.patient-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  flex-shrink: 0;
}

.patient-details h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0 0 8px 0;
}

.patient-contact {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.appointment-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.info-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: var(--dark-color);
  text-align: right;
  flex: 1;
}

.appointment-actions {
  padding: 16px 20px;
  background: var(--light-color);
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.confirmed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.completed {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-info {
  background: #06b6d4;
  color: white;
}

.btn-info:hover {
  background: #0891b2;
}

.btn-secondary {
  background: var(--text-muted);
  color: white;
}

.btn-secondary:hover {
  background: #6b7280;
}

.icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .appointments-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
}
</style>
