<template>
  <div>
    <div class="page-header">
      <h1>Find a Location</h1>
    </div>

    <div v-if="loading" class="loading">Loading locations...</div>
    <div v-if="error" class="error-msg">{{ error }}</div>

    <div v-if="!loading">
      <div class="search-bar">
        <label>Select a State</label>
        <select v-model="selectedState" @change="selectedLocation = null">
          <option disabled value="">Choose a state...</option>
          <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
        </select>
      </div>

      <div v-if="selectedState">
        <div class="search-bar" style="margin-top: 1rem;">
          <input v-model="search" type="text" placeholder="Search by city..." />
        </div>
        <p class="location-count">{{ filteredLocations.length }} locations in {{ selectedState }}</p>
        <div class="locations-grid">
          <div
            v-for="location in filteredLocations"
            :key="location.id"
            class="card location-card"
            @click="selectedLocation = selectedLocation?.id === location.id ? null : location"
          >
            <h3>{{ location.city }}, {{ location.state }}</h3>
            <div>
              <span v-if="location.drive_thru" class="badge">Drive Thru</span>
              <span v-if="location.door_dash" class="badge">DoorDash</span>
            </div>

            <div v-if="selectedLocation?.id === location.id" class="location-detail">
              <p v-if="location.address"><strong>Address:</strong> {{ location.address }}</p>
              <div class="hours-grid">
                <div v-for="day in days" :key="day.key">
                  <span class="day-label">{{ day.label }}</span>
                  <span>{{ formatHours(location[day.key + '_open'], location[day.key + '_close']) }}</span>
                </div>
              </div>
            </div>
          </div>
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
const selectedState = ref('')
const selectedLocation = ref<any>(null)

const days = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' }
]

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

const states = computed(() => [...new Set(locations.value.map((l: any) => l.state))].sort())

const filteredLocations = computed(() => {
  return locations.value.filter((l: any) => {
    const matchesState = l.state === selectedState.value
    const matchesSearch = !search.value || l.city.toLowerCase().includes(search.value.toLowerCase())
    return matchesState && matchesSearch
  })
})

function formatHours(open: number | null, close: number | null) {
  if (open === null || close === null) return 'Closed'
  const fmt = (h: number) => {
    const period = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:00 ${period}`
  }
  return `${fmt(open)} - ${fmt(close)}`
}
</script>
