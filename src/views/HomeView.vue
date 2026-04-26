<template>
  <div class="home-hero">
    <h1>Welcome to Uncle Joe's Coffee</h1>
    <p>A regional coffee chain serving the upper Midwest for decades.</p>
    <div class="home-links">
      <RouterLink to="/menu" class="btn btn-primary">View Our Menu</RouterLink>
      <RouterLink to="/locations" class="btn btn-secondary">Find a Location</RouterLink>
      <RouterLink v-if="!auth.isLoggedIn" to="/login" class="btn btn-primary">Login to Coffee Club</RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/dashboard" class="btn btn-secondary">My Coffee Club</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>
