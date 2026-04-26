<template>
  <div>
    <div class="page-header">
      <h1>Our Menu</h1>
    </div>
    <div v-if="loading" class="loading">Loading menu...</div>
    <div v-if="error" class="error-msg">{{ error }}</div>
    <div v-if="!loading">
      <div v-for="category in categories" :key="category" class="menu-category">
        <h2>{{ category }}</h2>
        <div class="menu-grid">
          <div v-for="item in itemsByCategory(category)" :key="item.id" class="card menu-item">
            <h3>{{ item.name }}</h3>
            <p v-if="item.size">Size: {{ item.size }}</p>
            <p v-if="item.calories">{{ item.calories }} cal</p>
            <p class="price" v-if="item.price">${{ item.price.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { API_BASE } from '../api'

const menu = ref<any[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/menu`)
    if (!res.ok) throw new Error('Failed to load menu')
    menu.value = await res.json()
  } catch (e) {
    error.value = 'Could not load menu. Please try again.'
  } finally {
    loading.value = false
  }
})

const categories = computed(() => [...new Set(menu.value.map((item: any) => item.category))])

function itemsByCategory(category: string) {
  return menu.value.filter((item: any) => item.category === category)
}
</script>
