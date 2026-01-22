<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <p class="dashboard-subtitle">System Overview & Analytics</p>
    </div>

    <!-- Key Statistics -->
    <div class="stats-grid grid grid-cols-1 grid-cols-2 grid-cols-4">
      <div class="stat-card">
        <div class="stat-icon users">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total_users || 0 }}</div>
          <div class="stat-label">Total Users</div>
          <div class="stat-change positive">+{{ stats.total_patients || 0 }} patients</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon doctors">👨‍⚕️</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total_doctors || 0 }}</div>
          <div class="stat-label">Doctors</div>
          <div class="stat-change">{{ stats.total_doctors || 0 }} active</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon appointments">📅</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total_appointments || 0 }}</div>
          <div class="stat-label">Appointments</div>
          <div class="stat-change">{{ stats.today_appointments || 0 }} today</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue">💰</div>
        <div class="stat-content">
          <div class="stat-value">${{ stats.total_revenue || 0 }}</div>
          <div class="stat-label">Revenue</div>
          <div class="stat-change positive">This month</div>
        </div>
      </div>
    </div>

    <!-- Appointment Status Overview -->
    <div class="stats-grid grid grid-cols-1 grid-cols-4">
      <div class="status-card pending">
        <div class="status-icon">⏳</div>
        <div class="status-content">
          <div class="status-value">{{ stats.pending_appointments || 0 }}</div>
          <div class="status-label">Pending</div>
        </div>
      </div>
      <div class="status-card confirmed">
        <div class="status-icon">✅</div>
        <div class="status-content">
          <div class="status-value">{{ stats.confirmed_appointments || 0 }}</div>
          <div class="status-label">Confirmed</div>
        </div>
      </div>
      <div class="status-card completed">
        <div class="status-icon">✔️</div>
        <div class="status-content">
          <div class="status-value">{{ stats.completed_appointments || 0 }}</div>
          <div class="status-label">Completed</div>
        </div>
      </div>
      <div class="status-card cancelled">
        <div class="status-icon">❌</div>
        <div class="status-content">
          <div class="status-value">{{ stats.cancelled_appointments || 0 }}</div>
          <div class="status-label">Cancelled</div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="dashboard-grid grid grid-cols-1 grid-cols-2">
      <!-- Recent Appointments -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📋 Recent Appointments</h3>
          <router-link to="/admin/appointments" class="btn btn-outline btn-sm">
            View All
          </router-link>
        </div>
        <div class="card-body">
          <div v-if="recentAppointments.length === 0" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <p>No appointments yet</p>
          </div>
          <div v-else class="appointments-list">
            <div v-for="apt in recentAppointments" :key="apt.id" class="appointment-row">
              <div class="appointment-info">
                <div class="appointment-patient">
                  <strong>{{ apt.patient?.name || 'Unknown' }}</strong>
                  <span class="appointment-doctor">with {{ apt.doctor?.user?.name || 'Unknown Doctor' }}</span>
                </div>
                <div class="appointment-meta">
                  <span class="appointment-date">{{ formatDate(apt.appointment_date) }}</span>
                  <span class="appointment-time">{{ formatTime(apt.appointment_time) }}</span>
                </div>
              </div>
              <span :class="['status-badge', apt.status]">{{ apt.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Users -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">👥 Recent Users</h3>
          <router-link to="/admin/users" class="btn btn-outline btn-sm">
            Manage Users
          </router-link>
        </div>
        <div class="card-body">
          <div v-if="recentUsers.length === 0" class="empty-state">
            <div class="empty-state-icon">👤</div>
            <p>No users yet</p>
          </div>
          <div v-else class="users-list">
            <div v-for="user in recentUsers" :key="user.id" class="user-row">
              <div class="user-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-email">{{ user.email }}</div>
              </div>
              <span :class="['role-badge', user.role]">{{ user.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">⚡ Quick Actions</h3>
      </div>
      <div class="card-body">
        <div class="quick-actions">
          <router-link to="/admin/users" class="action-btn">
            <span class="action-icon">➕</span>
            <span class="action-text">Add New User</span>
          </router-link>
          <router-link to="/admin/appointments" class="action-btn">
            <span class="action-icon">📅</span>
            <span class="action-text">View All Appointments</span>
          </router-link>
          <router-link to="/admin/settings" class="action-btn">
            <span class="action-icon">⚙️</span>
            <span class="action-text">System Settings</span>
          </router-link>
          <button @click="generateReport" class="action-btn">
            <span class="action-icon">📊</span>
            <span class="action-text">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminService from '../../services/adminService'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {},
      recentAppointments: [],
      recentUsers: []
    }
  },
  async mounted() {
    await this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      try {
        const response = await adminService.getDashboard()
        this.stats = response.data.stats || {}
        this.recentAppointments = response.data.recent_appointments || []
        
        // Load recent users
        const usersResponse = await adminService.getUsers({ limit: 5 })
        this.recentUsers = usersResponse.data.data || usersResponse.data || []
      } catch (error) {
        console.error('Error loading dashboard:', error)
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
      return time.substring(0, 5)
    },
    generateReport() {
      alert('Report generation feature coming soon!')
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
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
  border-radius: var(--radius);
}

.stat-icon.users {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-icon.doctors {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.stat-icon.appointments {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
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
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.stat-change.positive {
  color: var(--success-color);
}

.status-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid;
}

.status-card.pending {
  border-left-color: var(--warning-color);
}

.status-card.confirmed {
  border-left-color: var(--info-color);
}

.status-card.completed {
  border-left-color: var(--success-color);
}

.status-card.cancelled {
  border-left-color: var(--danger-color);
}

.status-icon {
  font-size: 2rem;
}

.status-content {
  flex: 1;
}

.status-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.status-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dashboard-grid {
  margin-top: 2rem;
}

.appointments-list,
.users-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-row,
.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--light-color);
  border-radius: var(--radius);
  transition: all 0.2s ease;
}

.appointment-row:hover,
.user-row:hover {
  background: #f3f4f6;
}

.appointment-info {
  flex: 1;
}

.appointment-patient {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.appointment-doctor {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.appointment-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.role-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.patient {
  background-color: #dbeafe;
  color: #1e40af;
}

.role-badge.doctor {
  background-color: #d1fae5;
  color: #065f46;
}

.role-badge.admin {
  background-color: #fef3c7;
  color: #92400e;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--light-color);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s ease;
  cursor: pointer;
}

.action-btn:hover {
  background: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.action-text {
  font-weight: 500;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
