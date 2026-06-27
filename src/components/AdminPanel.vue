<template>
  <section class="admin-panel max-w-6xl mx-auto py-8 px-4">
    <div class="admin-header flex items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-semibold">Admin Dashboard</h1>
        <p class="text-sm text-gray-600">Manage products, edit orders, and upload item images.</p>
      </div>
      <button @click="resetForm" class="px-4 py-2 bg-indigo-600 text-white rounded">New product</button>
    </div>

    <div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div>
        <div class="panel bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Products</h2>
            <span class="text-sm text-gray-500">{{ products.length }} items</span>
          </div>
          <div class="space-y-3">
            <div v-for="product in products" :key="product.id" class="product-row flex items-center justify-between gap-3 p-3 border rounded hover:bg-slate-50">
              <div class="flex items-center gap-3">
                <img class="w-16 h-16 rounded object-cover border" :src="product.images?.[0] || product.image || placeholderImage" :alt="product.name" />
                <div>
                  <div class="font-medium">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.shortDescription || product.description || 'No description' }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-500">${{ product.price?.toFixed(2) || product.basePrice?.toFixed(2) || '0.00' }}</div>
                <button @click="editProduct(product)" class="mt-2 text-indigo-600">Edit</button>
              </div>
            </div>
          </div>
        </div>

        <div class="panel bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Orders</h2>
          <div class="space-y-3">
            <div v-for="order in orders" :key="order.id" class="order-row border rounded p-3">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <div class="font-medium">Order #{{ order.id }}</div>
                  <div class="text-sm text-gray-500">{{ order.status }} • {{ order.date }}</div>
                </div>
                <button @click="selectOrder(order)" class="text-indigo-600">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel bg-white rounded-lg shadow-sm p-6">
        <div class="section mb-6">
          <h2 class="text-xl font-semibold mb-4">Product editor</h2>
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input v-model="form.name" class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Price</label>
              <input v-model.number="form.price" type="number" step="0.01" class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Short description</label>
              <textarea v-model="form.shortDescription" rows="2" class="mt-1 block w-full rounded border-gray-300 shadow-sm"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Full description</label>
              <textarea v-model="form.description" rows="4" class="mt-1 block w-full rounded border-gray-300 shadow-sm"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">External image URL</label>
              <input v-model="form.image" class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Upload pictures</label>
              <input type="file" accept="image/*" multiple @change="onFilesSelected" class="mt-1 block w-full" />
            </div>
            <div class="flex items-center gap-2">
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded">Save product</button>
              <button type="button" @click="resetForm" class="px-4 py-2 border rounded">Clear</button>
            </div>
          </form>
        </div>

        <div v-if="selectedOrder" class="section mt-6">
          <h2 class="text-xl font-semibold mb-4">Order editor</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Order ID</label>
              <div class="mt-1 text-gray-600">{{ selectedOrder.id }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select v-model="selectedOrder.status" class="mt-1 block w-full rounded border-gray-300 shadow-sm">
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <input v-model="selectedOrder.address" class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
            </div>
            <div>
              <button @click="saveOrder" class="px-4 py-2 bg-green-600 text-white rounded">Update order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import ordersStore from '../../src/stores/orders'
import productsStore from '../../src/stores/products'

const placeholderImage = 'https://via.placeholder.com/120x120?text=No+image'

const form = ref({
  id: null,
  name: '',
  price: 0,
  shortDescription: '',
  description: '',
  image: '',
  images: [],
})

const selectedOrder = ref(null)
const files = ref([])

const products = computed(() => productsStore.all())
const orders = computed(() => ordersStore.all())

const loadData = async () => {
  await productsStore.load()
  await ordersStore.load()
}

loadData()

const editProduct = (product) => {
  form.value = {
    id: product.id,
    name: product.name || '',
    price: product.price || product.basePrice || 0,
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    image: product.image || '',
    images: product.images ? [...product.images] : [],
  }
}

const selectOrder = (order) => {
  selectedOrder.value = { ...order }
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    price: 0,
    shortDescription: '',
    description: '',
    image: '',
    images: [],
  }
  files.value = []
}

const onFilesSelected = (event) => {
  const selected = Array.from(event.target.files || [])
  files.value = selected
}

const saveProduct = async () => {
  const payload = {
    name: form.value.name,
    price: form.value.price,
    shortDescription: form.value.shortDescription,
    description: form.value.description,
    image: form.value.image,
  }

  let product
  if (form.value.id) {
    product = await productsStore.update(form.value.id, payload)
  } else {
    product = await productsStore.create(payload)
    if (product) form.value.id = product.id
  }

  if (product && files.value.length) {
    const formData = new FormData()
    files.value.forEach((file) => formData.append('images', file))
    await productsStore.uploadImages(product.id, formData)
  }

  resetForm()
}

const saveOrder = async () => {
  if (!selectedOrder.value) return
  const payload = {
    status: selectedOrder.value.status,
    address: selectedOrder.value.address,
  }
  await ordersStore.update(selectedOrder.value.id, payload)
  selectedOrder.value = null
}
</script>

<style scoped>
.admin-header {
  align-items: center;
}
.panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
}
.product-row img {
  width: 64px;
  height: 64px;
}
.order-row {
  background: #fafafa;
}
</style>
