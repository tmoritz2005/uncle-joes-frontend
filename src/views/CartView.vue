<template>
  <div>
    <div class="page-header">
      <h1>Your Order</h1>
    </div>

    <div v-if="cart.items.length === 0" class="empty">
      Your cart is empty. <RouterLink to="/menu">Browse the menu</RouterLink>
    </div>

    <div v-else>
      <div class="order-card" v-for="item in cart.items" :key="item.menu_item_id">
        <div class="order-item-row">
          <span><strong>{{ item.name }}</strong> — {{ item.size }}</span>
          <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="order-item-row" style="margin-top: 0.5rem;">
          <div class="quantity-controls">
            <button @click="cart.updateQuantity(item.menu_item_id, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button @click="cart.updateQuantity(item.menu_item_id, item.quantity + 1)">+</button>
          </div>
          <button class="remove-btn" @click="cart.removeItem(item.menu_item_id)">Remove</button>
        </div>
      </div>

      <div class="order-total" style="margin-top: 1.5rem;">
        <span>Total</span>
        <span>${{ cart.totalPrice.toFixed(2) }}</span>
      </div>

      <div class="form-group" style="margin-top: 2rem;">
        <label>Select Pickup Location</label>
        <select v-model="selectedStore">
          <option disabled value="">Choose a location...</option>
          <option v-for="loc in locations" :key="loc.id" :value="loc.id">
            {{ loc.city }}, {{ loc.state }}
          </option>
        </select>
      </div>

      <div v-if="!auth.isLoggedIn" class="error-msg" style="margin-top: 1rem;">
        You must be <RouterLink to="/login">logged in</RouterLink> to place an order.
      </div>

      <div v-if="error" class="error-msg" style="margin-top: 1rem;">{{ error }}</div>
      <div v-if="success" style="color: green; margin-top: 1rem; font-weight: 600;">{{ success }}</div>

      <button
        class="login-btn"
        style="margin-top: 1.5rem;"
        @click="placeOrder"
        :disabled="loading || !auth.isLoggedIn || !selectedStore"
      >
        {{ loading ? 'Placing Order...' : 'Place Order' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { API_BASE } from '../api'

const cart = useCartStore()
const auth = useAuthStore()
const locations = ref<any[]>([])
const selectedStore = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

onMounted(async () => {
  const res = await fetch(`${API_BASE}/locations`)
  locations.value = await res.json()
})

async function placeOrder() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        member_id: auth.member?.member_id || null,
        store_id: selectedStore.value,
        order_items: cart.items.map(i => ({
          menu_item_id: i.menu_item_id,
          quantity: i.quantity
        }))
      })
    })
    if (!res.ok) throw new Error('Failed to place order')
    const data = await res.json()
    success.value = `Order #${data.order_id} placed! Total: $${data.order_total.toFixed(2)}. Pay when you arrive.`
    cart.clearCart()
    selectedStore.value = ''
  } catch (e) {
    error.value = 'Could not place order. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
