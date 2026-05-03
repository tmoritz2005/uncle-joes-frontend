import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Array<{
      menu_item_id: string
      name: string
      size: string
      price: number
      quantity: number
    }>
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },
  actions: {
    addItem(item: { menu_item_id: string; name: string; size: string; price: number }) {
      const existing = this.items.find(i => i.menu_item_id === item.menu_item_id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...item, quantity: 1 })
      }
    },
    removeItem(menu_item_id: string) {
      this.items = this.items.filter(i => i.menu_item_id !== menu_item_id)
    },
    updateQuantity(menu_item_id: string, quantity: number) {
      const item = this.items.find(i => i.menu_item_id === menu_item_id)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(menu_item_id)
        } else {
          item.quantity = quantity
        }
      }
    },
    clearCart() {
      this.items = []
    }
  }
})
