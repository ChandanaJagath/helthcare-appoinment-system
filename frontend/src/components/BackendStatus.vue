<template>
  <div v-if="!backendAvailable && showWarning" class="backend-status-warning">
    <div class="warning-content">
      <h3>⚠️ Backend API Not Available</h3>
      <div v-if="isProduction">
        <p><strong>Production Deployment:</strong> The backend needs to be deployed to a hosting service.</p>
        <p>To fix this:</p>
        <ol>
          <li>Deploy backend to <a href="https://railway.app" target="_blank">Railway</a> or <a href="https://render.com" target="_blank">Render</a></li>
          <li>Get your backend URL (e.g., <code>https://your-backend.railway.app</code>)</li>
          <li>Add environment variable in Vercel: <code>VITE_API_BASE_URL</code> = <code>https://your-backend-url.com/api</code></li>
          <li>Redeploy frontend on Vercel</li>
        </ol>
        <p><strong>See:</strong> <code>QUICK_BACKEND_DEPLOY.md</code> in the repository for detailed instructions.</p>
      </div>
      <div v-else>
        <p>The backend server is not running on port 8000.</p>
        <p>To start the backend:</p>
        <ol>
          <li>Open a terminal in the <code>mock-backend</code> folder</li>
          <li>Run: <code>npm install</code> (if not already done)</li>
          <li>Run: <code>node server.js</code></li>
        </ol>
      </div>
      <p><strong>Note:</strong> The frontend UI is working, but API calls will fail until the backend is available.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackendStatus',
  data() {
    return {
      backendAvailable: true,
      showWarning: false,
      isProduction: false
    }
  },
  mounted() {
    // Check if we're in production (has VITE_API_BASE_URL set)
    this.isProduction = !!import.meta.env.VITE_API_BASE_URL
    
    // Only check backend in development (when using proxy)
    if (!this.isProduction) {
      this.checkBackend()
    } else {
      // In production, check the configured API URL
      this.checkProductionBackend()
    }
  },
  methods: {
    async checkBackend() {
      try {
        const response = await fetch('/api/health')
        this.backendAvailable = response.ok
        this.showWarning = !response.ok
      } catch (error) {
        this.backendAvailable = false
        this.showWarning = true
      }
    },
    async checkProductionBackend() {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api'
      try {
        const response = await fetch(`${apiUrl}/health`)
        this.backendAvailable = response.ok
        this.showWarning = !response.ok
      } catch (error) {
        this.backendAvailable = false
        this.showWarning = true
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
  margin-top: 0;
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

.warning-content a:hover {
  text-decoration: none;
}
</style>
