<template>
  <div>
    <div class="home-hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1>Uncle Joe's Coffee</h1>
        <p>Serving the upper Midwest for decades. One cup at a time.</p>
        <div class="home-links">
          <RouterLink to="/menu" class="btn btn-primary">View Our Menu</RouterLink>
          <RouterLink to="/locations" class="btn btn-secondary">Find a Location</RouterLink>
          <RouterLink v-if="!auth.isLoggedIn" to="/login" class="btn btn-secondary">Coffee Club Login</RouterLink>
          <RouterLink v-if="auth.isLoggedIn" to="/dashboard" class="btn btn-secondary">My Coffee Club</RouterLink>
        </div>
      </div>
    </div>

    <div class="home-sections">
      <div class="home-section-card">
        <img src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80" alt="Our Menu" />
        <div class="home-section-card-body">
          <h3>Our Menu</h3>
          <p>From classic drip coffee to lattes, teas, and more — crafted fresh every day.</p>
          <RouterLink to="/menu" class="btn-outline">Browse Menu</RouterLink>
        </div>
      </div>
      <div class="home-section-card">
        <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80" alt="Find a Location" />
        <div class="home-section-card-body">
          <h3>Find a Location</h3>
          <p>Nearly 500 locations across the upper Midwest. There's always one nearby.</p>
          <RouterLink to="/locations" class="btn-outline">Find a Store</RouterLink>
        </div>
      </div>
      <div class="home-section-card">
        <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80" alt="Coffee Club" />
        <div class="home-section-card-body">
          <h3>Coffee Club</h3>
          <p>Earn points with every order. Log in to check your balance and order history.</p>
          <RouterLink v-if="!auth.isLoggedIn" to="/login" class="btn-outline">Login</RouterLink>
          <RouterLink v-if="auth.isLoggedIn" to="/dashboard" class="btn-outline">My Account</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>
