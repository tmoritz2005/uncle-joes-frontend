<template>
  <div>
    <div class="page-header">
      <h1>Find a Location</h1>
    </div>
    <div class="search-bar">
      <input v-model="search" type="text" placeholder="Search by city or state..." />
    </div>
    <div v-if="loading" class="loading">Loading locations...</div>
    <div v-if="error" class="error-msg">{{ error }}</div>
    <div v-if="!loading">
      <p class="location-count">{{ filteredLocations.length }} locations found</p>
      <div class="locations-grid">
        <div v-for="location in filteredLocations" :key="location.id" class="card">
          <h3>{{ location.city }}, {{ location.state }}</h3>
          <span v-if="location.drive_thru" class="badge">🚗 Drive Thru</span>
          <span v-if="location.door_dash" class="badge">🛵 DoorDash</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { API_BASE } from '../api'

const locations = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const search = ref('')

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/locations`)
    if (!res.ok) throw new Error('Failed to load locations')
    locations.value = await res.json()
  } catch (e) {
    error.value = 'Could not load locations. Please try again.'
  } finally {
    loading.value = false
  }
})

const filteredLocations = computed(() => {
  if (!search.value) return locations.value
  const s = search.value.toLowerCase()
  return locations.value.filter((l: any) =>
    l.city.toLowerCase().includes(s) || l.state.toLowerCase().includes(s)
  )
})
</script>
