import { reactive } from 'vue'
import api from '../api/products'

const state = reactive({
  products: [],
})

export default {
  async load() {
    try {
      const data = await api.fetchProducts()
      if (Array.isArray(data)) state.products = data
    } catch (err) {
      console.error('Failed to load products:', err)
    }
  },

  all() {
    return state.products
  },

  async create(payload) {
    try {
      const product = await api.createProduct(payload)
      state.products.push(product)
      return product
    } catch (err) {
      console.error('Failed to create product:', err)
      return null
    }
  },

  async update(id, payload) {
    try {
      const product = await api.updateProduct(id, payload)
      const index = state.products.findIndex((item) => String(item.id) === String(id))
      if (index !== -1) state.products[index] = product
      return product
    } catch (err) {
      console.error('Failed to update product:', err)
      return null
    }
  },

  async uploadImages(id, formData) {
    try {
      const result = await api.uploadProductImages(id, formData)
      const product = state.products.find((item) => String(item.id) === String(id))
      if (product && result.images) {
        product.images = result.images
      }
      return result
    } catch (err) {
      console.error('Failed to upload product images:', err)
      return null
    }
  },
}
