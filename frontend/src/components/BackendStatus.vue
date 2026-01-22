<template>
  <div v-if="!backendAvailable && showWarning" class="backend-status-warning">
    <div class="warning-content">
      <h3>⚠️ Backend API Not Available</h3>
      <p>The backend API serverless function is not responding.</p>
      <p>This could mean:</p>
      <ol>
        <li>The serverless function at <code>frontend/api/index.js</code> is not deployed correctly</li>
        <li>Vercel needs to redeploy to detect the serverless function</li>
        <li>Check Vercel deployment logs for errors</li>
      </ol>
      <p><strong>For local development:</strong></p>
      <ol>
        <li>Open a terminal in the <code>mock-backend</code> folder</li>
        <li>Run: <code>npm install</code> (if not already done)</li>
        <li>Run: <code>node server.js</code></li>
      </ol>
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
      showWarning: false
    }
  },
  mounted() {
    // Always check backend using relative /api path
    // In development: Vite proxy handles it
    // In production: Vercel serverless function handles it
    this.checkBackend()
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
