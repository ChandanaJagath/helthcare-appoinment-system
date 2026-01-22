<template>
  <div class="admin-settings">
    <div class="page-header">
      <h1>System Settings</h1>
      <p class="page-subtitle">Configure system preferences and options</p>
    </div>

    <div class="settings-grid grid grid-cols-1 grid-cols-2">
      <!-- General Settings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">⚙️ General Settings</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">System Name</label>
            <input v-model="settings.systemName" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Default Appointment Duration (minutes)</label>
            <input v-model="settings.defaultDuration" type="number" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Business Hours Start</label>
            <input v-model="settings.businessHoursStart" type="time" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Business Hours End</label>
            <input v-model="settings.businessHoursEnd" type="time" class="form-control" />
          </div>
          <button @click="saveSettings" class="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">🔔 Notification Settings</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="settings.emailNotifications" type="checkbox" />
              <span>Enable Email Notifications</span>
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="settings.smsNotifications" type="checkbox" />
              <span>Enable SMS Notifications</span>
            </label>
          </div>
          <div class="form-group">
            <label class="form-label">Reminder Time (hours before appointment)</label>
            <input v-model="settings.reminderHours" type="number" class="form-control" />
          </div>
          <button @click="saveSettings" class="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>

      <!-- Payment Settings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">💳 Payment Settings</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Default Payment Gateway</label>
            <select v-model="settings.paymentGateway" class="form-control">
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="settings.requirePayment" type="checkbox" />
              <span>Require Payment Before Confirmation</span>
            </label>
          </div>
          <button @click="saveSettings" class="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">🔒 Security Settings</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Session Timeout (minutes)</label>
            <input v-model="settings.sessionTimeout" type="number" class="form-control" />
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="settings.enableAuditLog" type="checkbox" />
              <span>Enable Audit Logging</span>
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="settings.enableTwoFactor" type="checkbox" />
              <span>Enable Two-Factor Authentication</span>
            </label>
          </div>
          <button @click="saveSettings" class="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSettings',
  data() {
    return {
      settings: {
        systemName: 'Healthcare Appointment System',
        defaultDuration: 30,
        businessHoursStart: '09:00',
        businessHoursEnd: '17:00',
        emailNotifications: true,
        smsNotifications: true,
        reminderHours: 24,
        paymentGateway: 'stripe',
        requirePayment: true,
        sessionTimeout: 60,
        enableAuditLog: true,
        enableTwoFactor: false
      }
    }
  },
  methods: {
    saveSettings() {
      // In a real app, this would save to backend
      alert('Settings saved successfully!')
    }
  }
}
</script>

<style scoped>
.admin-settings {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
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

.settings-grid {
  margin-top: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

@media (max-width: 968px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .admin-settings {
    padding: 1rem;
  }
}
</style>
