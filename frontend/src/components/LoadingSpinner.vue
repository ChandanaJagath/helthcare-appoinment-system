<template>
  <div class="loading-container">
    <div :class="['spinner', size === 'sm' ? 'spinner-sm' : '']"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-message {
  margin-top: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}
</style>
