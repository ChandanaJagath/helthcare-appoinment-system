<template>
  <div class="doctor-dashboard">
    <div class="dashboard-header">
      <h1>Doctor Dashboard</h1>
      <div class="header-actions">
        <button @click="refreshDashboard" class="btn btn-secondary">
          <span class="icon">🔄</span> Refresh
        </button>
      </div>
    </div>

    <!-- Statistics Grid -->
    <div class="stats-grid">
      <div class="stat-card stat-primary">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <h3>Today's Appointments</h3>
          <p class="stat-number">{{ stats.today_count }}</p>
          <span class="stat-label">Scheduled for today</span>
        </div>
      </div>
      
      <div class="stat-card stat-success">
        <div class="stat-icon">⏭️</div>
        <div class="stat-content">
          <h3>Upcoming</h3>
          <p class="stat-number">{{ stats.upcoming_count }}</p>
          <span class="stat-label">Future appointments</span>
        </div>
      </div>
      
      <div class="stat-card stat-info">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>Completed</h3>
          <p class="stat-number">{{ stats.completed_count }}</p>
          <span class="stat-label">Total completed</span>
        </div>
      </div>
      
      <div class="stat-card stat-warning">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>Total Patients</h3>
          <p class="stat-number">{{ stats.total_patients }}</p>
          <span class="stat-label">Unique patients</span>
        </div>
      </div>
      
      <div class="stat-card stat-secondary">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>This Week</h3>
          <p class="stat-number">{{ stats.this_week_count }}</p>
          <span class="stat-label">Week appointments</span>
        </div>
      </div>
      
      <div class="stat-card stat-secondary">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3>This Month</h3>
          <p class="stat-number">{{ stats.this_month_count }}</p>
          <span class="stat-label">Month appointments</span>
        </div>
      </div>
      
      <div class="stat-card stat-danger">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <h3>Pending</h3>
          <p class="stat-number">{{ stats.pending_count }}</p>
          <span class="stat-label">Awaiting confirmation</span>
        </div>
      </div>
      
      <div class="stat-card stat-info">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <h3>Total Appointments</h3>
          <p class="stat-number">{{ stats.total_appointments }}</p>
          <span class="stat-label">All time</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="dashboard-grid">
      <!-- Today's Appointments -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>
            <span class="icon">📅</span>
            Today's Appointments Queue
          </h2>
          <span class="badge">{{ todayAppointments.length }}</span>
        </div>
        <div v-if="todayAppointments.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <p>No appointments scheduled for today</p>
          <p class="empty-subtitle">You have a free day!</p>
        </div>
        <div v-else class="appointment-queue">
          <div 
            v-for="apt in todayAppointments" 
            :key="apt.id" 
            class="appointment-queue-item"
            :class="apt.status"
          >
            <div class="queue-time">
              <span class="time">{{ formatTime(apt.appointment_time) }}</span>
              <span class="date-badge">{{ formatDateShort(apt.appointment_date) }}</span>
            </div>
            <div class="queue-patient">
              <h4>{{ apt.patient?.name || 'Unknown Patient' }}</h4>
              <p class="patient-info">
                <span v-if="apt.patient?.email">📧 {{ apt.patient.email }}</span>
                <span v-if="apt.patient?.phone">📞 {{ apt.patient.phone }}</span>
              </p>
              <p class="appointment-reason">{{ apt.reason || 'No reason specified' }}</p>
            </div>
            <div class="queue-actions">
              <span :class="['status-badge', apt.status]">{{ apt.status }}</span>
              <router-link 
                :to="`/doctor/patients/${apt.patient?.id}`" 
                class="btn btn-sm btn-primary"
              >
                View Patient
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>
            <span class="icon">⏭️</span>
            Upcoming Appointments
          </h2>
          <router-link to="/doctor/appointments" class="view-all-link">View All →</router-link>
        </div>
        <div v-if="upcomingAppointments.length === 0" class="empty-state">
          <div class="empty-icon">📅</div>
          <p>No upcoming appointments</p>
        </div>
        <div v-else class="upcoming-list">
          <div 
            v-for="apt in upcomingAppointments.slice(0, 5)" 
            :key="apt.id" 
            class="upcoming-item"
          >
            <div class="upcoming-date">
              <span class="date-day">{{ formatDateDay(apt.appointment_date) }}</span>
              <span class="date-month">{{ formatDateMonth(apt.appointment_date) }}</span>
            </div>
            <div class="upcoming-details">
              <h4>{{ apt.patient?.name || 'Unknown Patient' }}</h4>
              <p class="upcoming-time">🕐 {{ apt.appointment_time }}</p>
              <p class="upcoming-reason">{{ apt.reason || 'No reason specified' }}</p>
            </div>
            <div class="upcoming-status">
              <span :class="['status-badge', apt.status]">{{ apt.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Patients -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>
            <span class="icon">👥</span>
            Recent Patients
          </h2>
        </div>
        <div v-if="recentPatients.length === 0" class="empty-state">
          <div class="empty-icon">👤</div>
          <p>No recent patients</p>
        </div>
        <div v-else class="patients-list">
          <div 
            v-for="patient in recentPatients" 
            :key="patient.id" 
            class="patient-item"
          >
            <div class="patient-avatar">
              {{ patient.name.charAt(0).toUpperCase() }}
            </div>
            <div class="patient-info">
              <h4>{{ patient.name }}</h4>
              <p class="patient-email">📧 {{ patient.email }}</p>
              <p class="patient-meta">
                <span>{{ patient.total_appointments }} appointment{{ patient.total_appointments !== 1 ? 's' : '' }}</span>
                <span v-if="patient.last_appointment">• Last: {{ formatDateShort(patient.last_appointment) }}</span>
              </p>
            </div>
            <router-link 
              :to="`/doctor/patients/${patient.id}`" 
              class="btn btn-sm btn-outline"
            >
              View
            </router-link>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>
            <span class="icon">⚡</span>
            Quick Actions
          </h2>
        </div>
        <div class="quick-actions">
          <router-link to="/doctor/appointments" class="action-card">
            <div class="action-icon">📋</div>
            <h3>View All Appointments</h3>
            <p>Manage all your appointments</p>
          </router-link>
          <router-link to="/doctor/schedule" class="action-card">
            <div class="action-icon">📅</div>
            <h3>Manage Schedule</h3>
            <p>Set your availability</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import doctorService from '../../services/doctorService'

export default {
  name: 'DoctorDashboard',
  data() {
    return {
      stats: {
        today_count: 0,
        upcoming_count: 0,
        completed_count: 0,
        pending_count: 0,
        confirmed_count: 0,
        cancelled_count: 0,
        total_appointments: 0,
        this_week_count: 0,
        this_month_count: 0,
        total_patients: 0
      },
      todayAppointments: [],
      upcomingAppointments: [],
      recentPatients: [],
      loading: false
    }
  },
  async mounted() {
    await this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      this.loading = true
      try {
        const response = await doctorService.getDashboard()
        this.stats = response.data.stats || this.stats
        this.todayAppointments = response.data.today_appointments || []
        this.upcomingAppointments = response.data.upcoming_appointments || []
        this.recentPatients = response.data.recent_patients || []
      } catch (error) {
        console.error('Error loading dashboard:', error)
        this.$toast?.error('Failed to load dashboard data')
      } finally {
        this.loading = false
      }
    },
    async refreshDashboard() {
      await this.loadDashboard()
    },
    formatTime(time) {
      return time || 'N/A'
    },
    formatDateShort(date) {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
    }
  }
}
</script>

<style scoped>
.doctor-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.stat-card.stat-primary {
  border-left-color: #3b82f6;
}

.stat-card.stat-success {
  border-left-color: #10b981;
}

.stat-card.stat-info {
  border-left-color: #06b6d4;
}

.stat-card.stat-warning {
  border-left-color: #f59e0b;
}

.stat-card.stat-danger {
  border-left-color: #ef4444;
}

.stat-card.stat-secondary {
  border-left-color: #8b5cf6;
}

.stat-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-color);
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 4px 0;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--light-color);
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header .icon {
  font-size: 20px;
}

.badge {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.view-all-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: var(--primary-dark);
}

/* Empty State */
.empty-state {
  padding: 40px 24px;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 8px 0;
  font-size: 16px;
}

.empty-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

/* Appointment Queue */
.appointment-queue {
  padding: 16px;
}

.appointment-queue-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.appointment-queue-item:last-child {
  border-bottom: none;
}

.appointment-queue-item:hover {
  background: var(--light-color);
}

.queue-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.queue-time .time {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
}

.date-badge {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.queue-patient {
  flex: 1;
}

.queue-patient h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0 0 8px 0;
}

.patient-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--text-muted);
  margin: 4px 0;
}

.appointment-reason {
  font-size: 14px;
  color: var(--text-muted);
  margin: 8px 0 0 0;
}

.queue-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

/* Upcoming List */
.upcoming-list {
  padding: 16px;
}

.upcoming-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.upcoming-item:last-child {
  border-bottom: none;
}

.upcoming-item:hover {
  background: var(--light-color);
}

.upcoming-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 8px;
  background: var(--light-color);
  border-radius: 8px;
}

.date-day {
  font-size: 20px;
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

.upcoming-details {
  flex: 1;
}

.upcoming-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0 0 8px 0;
}

.upcoming-time {
  font-size: 13px;
  color: var(--text-muted);
  margin: 4px 0;
}

.upcoming-reason {
  font-size: 14px;
  color: var(--text-muted);
  margin: 8px 0 0 0;
}

.upcoming-status {
  display: flex;
  align-items: flex-start;
}

/* Patients List */
.patients-list {
  padding: 16px;
}

.patient-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: background-color 0.2s;
}

.patient-item:last-child {
  border-bottom: none;
}

.patient-item:hover {
  background: var(--light-color);
}

.patient-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
}

.patient-info {
  flex: 1;
}

.patient-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0 0 4px 0;
}

.patient-email {
  font-size: 13px;
  color: var(--text-muted);
  margin: 4px 0;
}

.patient-meta {
  font-size: 12px;
  color: var(--text-muted);
  margin: 4px 0 0 0;
  display: flex;
  gap: 8px;
}

/* Quick Actions */
.quick-actions {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  padding: 24px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
  background: white;
}

.action-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.action-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.action-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0 0 8px 0;
}

.action-card p {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
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

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--dark-color);
}

.btn-outline:hover {
  background: var(--light-color);
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .appointment-queue-item,
  .upcoming-item {
    flex-direction: column;
  }
  
  .queue-actions {
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
