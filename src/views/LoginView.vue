<template>
  <div class="login-wrapper">
    <h1>Coffee Club Login</h1>
    <div v-if="error" class="error-msg">{{ error }}</div>
    <div class="form-group">
      <label>Email</label>
      <input v-model="email" type="email" placeholder="Enter your email" />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input v-model="password" type="password" placeholder="Enter your password" />
    </div>
    <button class="login-btn" @click="login" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { API_BASE } from '../api'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

async function login() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    if (!res.ok) {
      error.value = 'Invalid email or password'
      return
    }
    const data = await res.json()
    auth.setMember(data)
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
