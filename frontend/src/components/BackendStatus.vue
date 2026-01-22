<template>
  <div v-if="!backendAvailable" class="backend-status-warning">
    <div class="warning-content">
      <h3>⚠️ Backend API Not Available</h3>
      <p>The backend server is not running on port 8000.</p>
      <p>To start the backend:</p>
      <ol>
        <li>Open a terminal in the <code>mock-backend</code> folder</li>
        <li>Run: <code>npm install</code> (if not already done)</li>
        <li>Run: <code>node server.js</code></li>
      </ol>
      <p><strong>Note:</strong> The frontend UI is working, but API calls will fail until the backend is running.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackendStatus',
  data() {
    return {
      backendAvailable: true
    }
  },
  mounted() {
    this.checkBackend()
  },
  methods: {
    async checkBackend() {
      try {
        const response = await fetch('/api/health')
        this.backendAvailable = response.ok
      } catch (error) {
        this.backendAvailable = false
      }
    }
  }
}
</script>

<style scoped>
.backend-status-warning {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff3cd;
  border-bottom: 2px solid #ffc107;
  padding: 15px;
  z-index: 9999;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.warning-content {
  max-width: 1200px;
  margin: 0 auto;
}

.warning-content h3 {
  margin: 0 0 10px 0;
  color: #856404;
}

.warning-content p {
  margin: 5px 0;
  color: #856404;
}

.warning-content ol {
  margin: 10px 0;
  padding-left: 25px;
}

.warning-content code {
  background: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}

.warning-content a {
  color: #0066cc;
  text-decoration: underline;
}
</style>
