<template>
  <div id="app">
    <BackendStatus />
    <router-view />
  </div>
</template>

<script>
import BackendStatus from './components/BackendStatus.vue'

export default {
  name: 'App',
  components: {
    BackendStatus
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
