<template>
  <div class="patient-layout">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">🏥</span>
        <span class="brand-text">Healthcare</span>
      </div>
      <div class="nav-links">
        <router-link to="/patient/dashboard" class="nav-link">
          <span>📊</span>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/patient/appointments" class="nav-link">
          <span>📅</span>
          <span>Appointments</span>
        </router-link>
        <router-link to="/patient/book-appointment" class="nav-link">
          <span>➕</span>
          <span>Book</span>
        </router-link>
        <router-link to="/patient/medical-records" class="nav-link">
          <span>📋</span>
          <span>Records</span>
        </router-link>
        <router-link to="/patient/profile" class="nav-link">
          <span>👤</span>
          <span>Profile</span>
        </router-link>
        <div class="nav-user">
          <span class="user-name">{{ userName }}</span>
          <button @click="handleLogout" class="btn btn-outline btn-sm">
            <span>🚪</span>
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
import { mapActions } from 'vuex'

export default {
  name: 'PatientLayout',
  computed: {
    userName() {
      return this.$store.getters['auth/user']?.name || 'User'
    }
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
.patient-layout {
  min-height: 100vh;
  background-color: var(--light-color);
}

.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: var(--shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.brand-icon {
  font-size: 1.75rem;
}

.brand-text {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;
}

.nav-link:hover {
  background-color: var(--light-gray);
  color: var(--primary-color);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  box-shadow: var(--shadow-sm);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 2px solid var(--light-gray);
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.main-content {
  min-height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
  }
  
  .nav-user {
    border-left: none;
    border-top: 2px solid var(--light-gray);
    padding-left: 0;
    padding-top: 1rem;
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}
</style>
