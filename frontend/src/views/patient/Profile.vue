<template>
  <div class="profile">
    <h1>My Profile</h1>
    <div class="card">
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input v-model="form.name" type="text" class="form-control" required />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input v-model="form.phone" type="tel" class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary">Update Profile</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientProfile',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: ''
      }
    }
  },
  mounted() {
    const user = this.$store.getters['auth/user']
    if (user) {
      this.form = { ...user }
    }
  },
  methods: {
    async updateProfile() {
      // Implementation would go here
      alert('Profile updated successfully')
    }
  }
}
</script>
