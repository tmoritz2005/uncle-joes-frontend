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
          <div v-for="item in groupedByCategory(category)" :key="item.name" class="card menu-item">
            <h3>{{ item.name }}</h3>
            <p v-if="item.selectedSize">{{ item.selectedSize.calories }} cal</p>
            <div class="size-selector">
              <label>Size</label>
              <select v-model="item.selectedSize">
                <option v-for="size in item.sizes" :key="size.id" :value="size">
                  {{ size.size }}
                </option>
              </select>
            </div>
            <p class="price" v-if="item.selectedSize">${{ item.selectedSize.price.toFixed(2) }}</p>
            <button class="add-to-cart-btn" @click="addToCart(item)">Add to Order</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { API_BASE } from '../api'
import { useCartStore } from '../stores/cart'

const menu = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const cart = useCartStore()

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/menu`)
    if (!res.ok) throw new Error('Failed to load menu')
    const data = await res.json()

    const grouped: Record<string, any> = {}
    for (const item of data) {
      if (!grouped[item.name]) {
        grouped[item.name] = {
          name: item.name,
          category: item.category,
          sizes: [],
          selectedSize: null
        }
      }
      grouped[item.name].sizes.push(item)
    }

    for (const item of Object.values(grouped)) {
      item.selectedSize = item.sizes[0]
    }

    menu.value = Object.values(grouped)
  } catch (e) {
    error.value = 'Could not load menu. Please try again.'
  } finally {
    loading.value = false
  }
})

const categories = computed(() => [...new Set(menu.value.map((item: any) => item.category))])

function groupedByCategory(category: string) {
  return menu.value.filter((item: any) => item.category === category)
}

function addToCart(item: any) {
  cart.addItem({
    menu_item_id: item.selectedSize.id,
    name: item.name,
    size: item.selectedSize.size,
    price: item.selectedSize.price
  })
}
</script>
