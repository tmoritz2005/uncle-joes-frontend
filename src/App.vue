<template>
  <div>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/menu">Menu</RouterLink>
      <RouterLink to="/locations">Locations</RouterLink>
      <RouterLink v-if="!auth.isLoggedIn" to="/login">Login</RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/dashboard">My Account</RouterLink>
      <RouterLink to="/cart" class="cart-link">
        🛒 <span v-if="cart.totalItems > 0" class="cart-badge">{{ cart.totalItems }}</span>
      </RouterLink>
      <button v-if="auth.isLoggedIn" @click="logout">Logout</button>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
