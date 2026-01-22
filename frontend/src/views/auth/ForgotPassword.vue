<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2>Forgot Password</h2>
      <form @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            required
            placeholder="Enter your email"
          />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
        <div class="auth-links">
          <router-link to="/login">Back to Login</router-link>
        </div>
      </form>
      <div v-if="message" class="success-message">{{ message }}</div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false,
      error: null,
      message: null
    }
  },
  methods: {
    async handleForgotPassword() {
      this.loading = true
      this.error = null
      this.message = null
      // Implementation would go here
      setTimeout(() => {
        this.message = 'Password reset link has been sent to your email.'
        this.loading = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.forgot-password-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-bottom: 30px;
  text-align: center;
  color: var(--dark-color);
}

.auth-links {
  margin-top: 20px;
  text-align: center;
}

.auth-links a {
  color: var(--primary-color);
  text-decoration: none;
}

.success-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #efe;
  color: var(--success-color);
  border-radius: 4px;
  text-align: center;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #fee;
  color: var(--danger-color);
  border-radius: 4px;
  text-align: center;
}
</style>
