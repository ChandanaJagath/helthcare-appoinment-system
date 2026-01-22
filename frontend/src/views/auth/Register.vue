<template>
  <div class="auth-container">
    <div class="auth-background">
      <div class="auth-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
    <div class="auth-content">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <div class="logo-icon">🏥</div>
            <h1>Create Account</h1>
          </div>
          <p class="auth-subtitle">Join our healthcare platform</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div v-if="error" class="alert alert-error">
            <span>⚠️</span>
            <span>{{ error }}</span>
          </div>
          
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              required
              placeholder="John Doe"
              autocomplete="name"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              required
              placeholder="name@example.com"
              autocomplete="email"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              required
              minlength="8"
              placeholder="At least 8 characters"
              autocomplete="new-password"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input
              v-model="form.password_confirmation"
              type="password"
              class="form-control"
              required
              placeholder="Confirm your password"
              autocomplete="new-password"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">I am a</label>
            <select v-model="form.role" class="form-control" required>
              <option value="">Select your role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Phone Number <span class="optional">(Optional)</span></label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-control"
              placeholder="+1 234 567 8900"
              autocomplete="tel"
            />
          </div>
          
          <button type="submit" class="btn btn-primary btn-lg" :disabled="loading" style="width: 100%;">
            <span v-if="loading" class="spinner spinner-sm"></span>
            <span v-else>✨</span>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <router-link to="/login" class="auth-link">Sign in</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        phone: ''
      },
      loading: false,
      error: null
    }
  },
  methods: {
    ...mapActions('auth', ['register']),
    async handleRegister() {
      if (this.form.password !== this.form.password_confirmation) {
        this.error = 'Passwords do not match'
        return
      }
      this.loading = true
      this.error = null
      try {
        await this.register(this.form)
        const role = this.$store.getters['auth/userRole']
        if (role === 'patient') {
          this.$router.push('/patient/dashboard')
        } else if (role === 'doctor') {
          this.$router.push('/doctor/dashboard')
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.optional {
  color: var(--text-secondary);
  font-weight: normal;
  font-size: 0.8125rem;
}

/* Reuse auth styles from Login.vue */
.auth-container {
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  z-index: 0;
}

.auth-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: white;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: white;
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: white;
  top: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-card {
  background: white;
  padding: 3rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.logo-icon {
  font-size: 4rem;
}

.auth-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin: 0;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.auth-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--light-gray);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }
  
  .auth-header h1 {
    font-size: 1.5rem;
  }
}
</style>
