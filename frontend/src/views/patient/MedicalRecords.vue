<template>
  <div class="medical-records">
    <h1>Medical Records</h1>
    <div class="card">
      <div v-if="records.length === 0" class="empty-state">
        No medical records found
      </div>
      <div v-else>
        <div v-for="record in records" :key="record.id" class="record-card">
          <h3>{{ formatDate(record.created_at) }}</h3>
          <p><strong>Doctor:</strong> Dr. {{ record.doctor.user.name }}</p>
          <p v-if="record.diagnosis"><strong>Diagnosis:</strong> {{ record.diagnosis }}</p>
          <p v-if="record.symptoms"><strong>Symptoms:</strong> {{ record.symptoms }}</p>
          <p v-if="record.treatment"><strong>Treatment:</strong> {{ record.treatment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import patientService from '../../services/patientService'

export default {
  name: 'MedicalRecords',
  data() {
    return {
      records: []
    }
  },
  async mounted() {
    await this.loadRecords()
  },
  methods: {
    async loadRecords() {
      try {
        const response = await patientService.getMedicalRecords()
        this.records = response.data
      } catch (error) {
        console.error('Error loading records:', error)
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.record-card {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 15px;
}

.record-card h3 {
  margin-bottom: 10px;
  color: var(--primary-color);
}
</style>
