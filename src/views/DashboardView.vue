<template>
  <div>
    <div class="dashboard-header">
      <h1>Welcome, {{ auth.member?.name }}</h1>
      <p>{{ auth.member?.email }}</p>
    </div>

    <div class="points-card">
      <h2>Coffee Club Points</h2>
      <div v-if="loadingPoints" class="loading">Loading...</div>
      <div v-else class="points-number">{{ points }} pts</div>
    </div>

    <div>
      <h2 class="page-header">Order History</h2>
      <div v-if="loadingOrders" class="loading">Loading orders...</div>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="!loadingOrders && orders.length === 0" class="empty">No orders found.</div>
      <div v-for="order in orders" :key="order.order_id" class="order-card">
        <h3>Order #{{ order.order_id }}</h3>
        <div class="order-meta">
          <span>{{ new Date(order.order_date).toLocaleDateString() }}</span>
        </div>
        <div class="order-items">
          <div v-for="item in order.items" :key="item.menu_item_id" class="order-item-row">
            <span>{{ item.item_name }} x{{ item.quantity }}</span>
            <span>${{ item.price?.toFixed(2) }}</span>
          </div>
        </div>
        <div class="order-total">
          <span>Order Total</span>
          <span>${{ order.order_total?.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { API_BASE } from '../api'

const auth = useAuthStore()
const orders = ref<any[]>([])
const points = ref(0)
const loadingOrders = ref(true)
const loadingPoints = ref(true)
const error = ref('')

onMounted(async () => {
  const memberId = auth.member?.member_id

  try {
    const res = await fetch(`${API_BASE}/members/${memberId}/orders`)
    if (!res.ok) throw new Error('Failed to load orders')
    orders.value = await res.json()
  } catch (e) {
    error.value = 'Could not load order history.'
  } finally {
    loadingOrders.value = false
  }

  try {
    const res = await fetch(`${API_BASE}/members/${memberId}/points`)
    if (!res.ok) throw new Error('Failed to load points')
    const data = await res.json()
    points.value = data.total_points
  } catch (e) {
    error.value = 'Could not load points balance.'
  } finally {
    loadingPoints.value = false
  }
})
</script>
