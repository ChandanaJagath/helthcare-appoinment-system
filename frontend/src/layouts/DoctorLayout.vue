<template>
  <div class="doctor-layout">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">🏥</span>
        <span class="brand-text">Healthcare System</span>
        <span class="brand-role">Doctor</span>
      </div>
      <div class="nav-links">
        <router-link to="/doctor/dashboard" class="nav-link">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Dashboard</span>
        </router-link>
        <router-link to="/doctor/appointments" class="nav-link">
          <span class="nav-icon">📅</span>
          <span class="nav-text">Appointments</span>
        </router-link>
        <router-link to="/doctor/schedule" class="nav-link">
          <span class="nav-icon">⏰</span>
          <span class="nav-text">Schedule</span>
        </router-link>
        <div class="nav-user">
          <span class="user-name">{{ currentUser?.name || 'Doctor' }}</span>
          <button @click="handleLogout" class="btn btn-danger btn-sm">
            <span class="icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DoctorLayout',
  computed: {
    ...mapGetters('auth', ['currentUser'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.doctor-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  color: white;
  font-weight: 700;
  font-size: 20px;
}

.brand-icon {
  font-size: 28px;
}

.brand-text {
  font-size: 20px;
}

.brand-role {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
  padding: 4px 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
}

.nav-links {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
  position: relative;
}

.nav-link:hover {
  background: rgba(255,255,255,0.15);
}

.nav-link.router-link-active {
  background: rgba(255,255,255,0.25);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  background: white;
  border-radius: 3px 3px 0 0;
}

.nav-icon {
  font-size: 18px;
}

.nav-text {
  font-size: 15px;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid rgba(255,255,255,0.3);
}

.user-name {
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.main-content {
  padding: 30px;
  min-height: calc(100vh - 70px);
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-danger {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.btn-danger:hover {
  background: rgba(220, 38, 38, 1);
}

.icon {
  font-size: 14px;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 12px 20px;
  }
  
  .nav-brand {
    width: 100%;
    justify-content: center;
    padding: 8px 0;
  }
  
  .nav-links {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-user {
    width: 100%;
    justify-content: center;
    margin-left: 0;
    padding-left: 0;
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.3);
    padding-top: 12px;
    margin-top: 8px;
  }
  
  .main-content {
    padding: 20px;
  }
}
</style>
