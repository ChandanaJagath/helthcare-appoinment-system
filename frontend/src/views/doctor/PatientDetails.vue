<template>
  <div class="patient-details">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading patient details...</p>
    </div>

    <div v-else-if="patient" class="patient-details-content">
      <!-- Patient Header -->
      <div class="patient-header">
        <div class="back-link">
          <router-link to="/doctor/appointments" class="btn btn-secondary btn-sm">
            ← Back to Appointments
          </router-link>
        </div>
        <div class="patient-info-header">
          <div class="patient-avatar-large">
            {{ patient.name.charAt(0).toUpperCase() }}
          </div>
          <div class="patient-header-details">
            <h1>{{ patient.name }}</h1>
            <p class="patient-email">📧 {{ patient.email }}</p>
            <p class="patient-phone" v-if="patient.phone">📞 {{ patient.phone }}</p>
          </div>
          <div class="patient-stats-header">
            <div class="stat-item">
              <span class="stat-number">{{ stats.total_appointments }}</span>
              <span class="stat-label">Total Appointments</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ stats.completed_appointments }}</span>
              <span class="stat-label">Completed</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ stats.upcoming_appointments }}</span>
              <span class="stat-label">Upcoming</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button 
          @click="activeTab = 'appointments'" 
          :class="['tab', { active: activeTab === 'appointments' }]"
        >
          📅 Appointments
        </button>
        <button 
          @click="activeTab = 'records'" 
          :class="['tab', { active: activeTab === 'records' }]"
        >
          📋 Medical Records
        </button>
      </div>

      <!-- Appointments Tab -->
      <div v-if="activeTab === 'appointments'" class="tab-content">
        <div class="section-header">
          <h2>Appointment History</h2>
          <select v-model="appointmentFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div v-if="filteredAppointments.length === 0" class="empty-state">
          <div class="empty-icon">📅</div>
          <p>No appointments found</p>
        </div>

        <div v-else class="appointments-list">
          <div 
            v-for="apt in filteredAppointments" 
            :key="apt.id" 
            class="appointment-item"
            :class="apt.status"
          >
            <div class="appointment-date-badge">
              <span class="date-day">{{ formatDateDay(apt.appointment_date) }}</span>
              <span class="date-month">{{ formatDateMonth(apt.appointment_date) }}</span>
              <span class="date-year">{{ formatDateYear(apt.appointment_date) }}</span>
            </div>
            <div class="appointment-details">
              <div class="appointment-time-status">
                <span class="time">🕐 {{ apt.appointment_time }}</span>
                <span :class="['status-badge', apt.status]">{{ apt.status }}</span>
              </div>
              <p class="appointment-reason" v-if="apt.reason">
                <strong>Reason:</strong> {{ apt.reason }}
              </p>
              <p class="appointment-id">
                <strong>Appointment ID:</strong> #{{ apt.id }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Medical Records Tab -->
      <div v-if="activeTab === 'records'" class="tab-content">
        <div class="section-header">
          <h2>Medical Records</h2>
        </div>

        <div v-if="medicalRecords.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <p>No medical records found</p>
          <p class="empty-subtitle">Medical records will appear here after completed appointments</p>
        </div>

        <div v-else class="records-list">
          <div 
            v-for="record in medicalRecords" 
            :key="record.id" 
            class="record-item"
          >
            <div class="record-date">
              <span class="date-day">{{ formatDateDay(record.created_at) }}</span>
              <span class="date-month-year">{{ formatDateMonthYear(record.created_at) }}</span>
            </div>
            <div class="record-content">
              <h3>{{ record.diagnosis }}</h3>
              <p class="record-notes" v-if="record.notes">{{ record.notes }}</p>
              <p class="record-appointment-id" v-if="record.appointment_id">
                Related to Appointment #{{ record.appointment_id }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <div class="error-icon">⚠️</div>
      <p>Patient not found</p>
      <router-link to="/doctor/appointments" class="btn btn-primary">
        Back to Appointments
      </router-link>
    </div>
  </div>
</template>

<script>
import doctorService from '../../services/doctorService'

export default {
  name: 'PatientDetails',
  data() {
    return {
      patient: null,
      appointments: [],
      medicalRecords: [],
      stats: {
        total_appointments: 0,
        completed_appointments: 0,
        upcoming_appointments: 0
      },
      loading: false,
      activeTab: 'appointments',
      appointmentFilter: ''
    }
  },
  computed: {
    filteredAppointments() {
      if (!this.appointmentFilter) {
        return this.appointments
      }
      return this.appointments.filter(apt => apt.status === this.appointmentFilter)
    }
  },
  async mounted() {
    await this.loadPatientDetails()
  },
  methods: {
    async loadPatientDetails() {
      this.loading = true
      try {
        const patientId = this.$route.params.id
        const response = await doctorService.getPatientDetails(patientId)
        this.patient = response.data.patient
        this.appointments = response.data.appointments || []
        this.medicalRecords = response.data.medical_records || []
        this.stats = response.data.stats || this.stats
      } catch (error) {
        console.error('Error loading patient details:', error)
        this.$toast?.error('Failed to load patient details')
      } finally {
        this.loading = false
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
    formatDateYear(date) {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { year: 'numeric' })
    },
    formatDateMonthYear(date) {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
  }
}
</script>

<style scoped>
.patient-details {
  max-width: 1200px;
  margin: 0 auto;
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

.patient-header {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 30px;
  margin-bottom: 24px;
}

.back-link {
  margin-bottom: 20px;
}

.patient-info-header {
  display: flex;
  gap: 24px;
  align-items: center;
}

.patient-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  flex-shrink: 0;
}

.patient-header-details {
  flex: 1;
}

.patient-header-details h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 8px 0;
}

.patient-email,
.patient-phone {
  font-size: 16px;
  color: var(--text-muted);
  margin: 4px 0;
}

.patient-stats-header {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
}

.tab {
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--primary-color);
}

.tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: var(--dark-color);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Appointments List */
.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid;
  transition: all 0.2s;
}

.appointment-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.appointment-item.pending {
  border-left-color: #f59e0b;
}

.appointment-item.confirmed {
  border-left-color: #10b981;
}

.appointment-item.completed {
  border-left-color: #3b82f6;
}

.appointment-item.cancelled {
  border-left-color: #ef4444;
}

.appointment-date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 12px;
  background: var(--light-color);
  border-radius: 8px;
}

.date-day {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.date-month {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-top: 4px;
}

.date-year {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.appointment-details {
  flex: 1;
}

.appointment-time-status {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.time {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-color);
}

.appointment-reason,
.appointment-id {
  font-size: 14px;
  color: var(--text-muted);
  margin: 8px 0;
}

/* Records List */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.record-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid var(--primary-color);
  transition: all 0.2s;
}

.record-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.record-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 12px;
  background: var(--light-color);
  border-radius: 8px;
}

.date-month-year {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.record-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0 0 8px 0;
}

.record-notes {
  font-size: 14px;
  color: var(--text-muted);
  margin: 8px 0;
  line-height: 1.6;
}

.record-appointment-id {
  font-size: 12px;
  color: var(--text-muted);
  margin: 8px 0 0 0;
}

/* Status Badge */
.status-badge {
  padding: 4px 12px;
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

/* Empty State */
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
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.error-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
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

.btn-secondary {
  background: var(--text-muted);
  color: white;
}

.btn-secondary:hover {
  background: #6b7280;
}

@media (max-width: 768px) {
  .patient-info-header {
    flex-direction: column;
    text-align: center;
  }
  
  .patient-stats-header {
    width: 100%;
    justify-content: space-around;
  }
  
  .appointment-item,
  .record-item {
    flex-direction: column;
  }
  
  .appointment-date-badge,
  .record-date {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 12px;
  }
}
</style>
