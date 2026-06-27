import { reactive } from 'vue'
import api from '../api/orders'

const state = reactive({
  orders: [],
})

export default {
  async load() {
    try {
      const data = await api.fetchOrders()
      if (Array.isArray(data)) state.orders = data
    } catch (err) {
      console.error('Failed to load orders:', err)
    }
  },

  all() {
    return state.orders
  },

  async update(id, payload) {
    try {
      const order = await api.updateOrder(id, payload)
      const index = state.orders.findIndex((item) => String(item.id) === String(id))
      if (index !== -1) state.orders[index] = order
      return order
    } catch (err) {
      console.error('Failed to update order:', err)
      return null
    }
  },
}
