<template>
  <div class="patient-dashboard">
    <div class="dashboard-header">
      <div>
        <h1>Welcome back, {{ userName }}!</h1>
        <p class="dashboard-subtitle">Here's your health overview</p>
      </div>
      <router-link to="/patient/book-appointment" class="btn btn-primary">
        <span>➕</span>
        Book Appointment
      </router-link>
    </div>

    <div class="stats-grid grid grid-cols-1 grid-cols-2 grid-cols-4">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-value">{{ upcomingAppointments.length }}</div>
          <div class="stat-label">Upcoming</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ completedCount }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-value">{{ medicalRecords.length }}</div>
          <div class="stat-label">Records</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💊</div>
        <div class="stat-content">
          <div class="stat-value">{{ prescriptionsCount }}</div>
          <div class="stat-label">Prescriptions</div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid grid grid-cols-1 grid-cols-2">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📅 Upcoming Appointments</h3>
        </div>
        <div class="card-body">
          <div v-if="upcomingAppointments.length === 0" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <p>No upcoming appointments</p>
            <router-link to="/patient/book-appointment" class="btn btn-outline btn-sm mt-3">
              Book Your First Appointment
            </router-link>
          </div>
          <div v-else class="appointment-list">
            <div v-for="apt in upcomingAppointments" :key="apt.id" class="appointment-item">
              <div class="appointment-info">
                <div class="appointment-time">
                  <div class="time-badge">{{ formatTime(apt.appointment_time) }}</div>
                  <div class="date-text">{{ formatDate(apt.appointment_date) }}</div>
                </div>
                <div class="appointment-details">
                  <strong class="doctor-name">Dr. {{ apt.doctor?.user?.name || 'Unknown' }}</strong>
                  <p class="appointment-reason">{{ apt.reason || 'General consultation' }}</p>
                </div>
              </div>
              <span :class="['status-badge', apt.status]">{{ apt.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📋 Recent Medical Records</h3>
        </div>
        <div class="card-body">
          <div v-if="medicalRecords.length === 0" class="empty-state">
            <div class="empty-state-icon">📄</div>
            <p>No medical records yet</p>
          </div>
          <div v-else class="records-list">
            <div v-for="record in medicalRecords" :key="record.id" class="record-item">
              <div class="record-date">{{ formatDate(record.created_at) }}</div>
              <div class="record-content">
                <p class="record-diagnosis">{{ record.diagnosis || 'No diagnosis recorded' }}</p>
                <p v-if="record.symptoms" class="record-symptoms">{{ record.symptoms }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import patientService from '../../services/patientService'

export default {
  name: 'PatientDashboard',
  data() {
    return {
      upcomingAppointments: [],
      medicalRecords: [],
      allAppointments: []
    }
  },
  computed: {
    userName() {
      return this.$store.getters['auth/user']?.name || 'Patient'
    },
    completedCount() {
      return this.allAppointments.filter(apt => apt.status === 'completed').length
    },
    prescriptionsCount() {
      return 0 // Would come from API
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const [appointmentsRes, recordsRes] = await Promise.all([
          patientService.getAppointments(),
          patientService.getMedicalRecords()
        ])
        this.allAppointments = appointmentsRes.data || []
        this.upcomingAppointments = this.allAppointments.filter(apt => 
          ['pending', 'confirmed'].includes(apt.status)
        ).slice(0, 5)
        this.medicalRecords = (recordsRes.data || []).slice(0, 5)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    },
    formatTime(time) {
      if (!time) return 'N/A'
      return time.substring(0, 5) // Format HH:MM
    }
  }
}
</script>

<style scoped>
.patient-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.dashboard-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

.stats-grid {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dashboard-grid {
  margin-top: 2rem;
}

.appointment-list,
.records-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--light-color);
  border-radius: var(--radius);
  border-left: 4px solid var(--primary-color);
  transition: all 0.2s ease;
}

.appointment-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.appointment-info {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.appointment-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.time-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.date-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.appointment-details {
  flex: 1;
}

.doctor-name {
  display: block;
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.appointment-reason {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.record-item {
  padding: 1rem;
  background: var(--light-color);
  border-radius: var(--radius);
  border-left: 4px solid var(--success-color);
}

.record-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.record-diagnosis {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.record-symptoms {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 768px) {
  .patient-dashboard {
    padding: 1rem;
  }
  
  .dashboard-header h1 {
    font-size: 1.5rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
