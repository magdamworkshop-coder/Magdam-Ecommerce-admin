const base = '/api/products'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(res.statusText || 'API error')
    err.status = res.status
    err.body = text
    throw err
  }
  return res.status === 204 ? null : res.json()
}

export default {
  async fetchProducts() {
    const res = await fetch(base, { credentials: 'include' })
    return handleResponse(res)
  },

  async createProduct(payload) {
    const res = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    return handleResponse(res)
  },

  async updateProduct(id, payload) {
    const res = await fetch(`${base}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    return handleResponse(res)
  },

  async uploadProductImages(id, formData) {
    const res = await fetch(`${base}/${encodeURIComponent(id)}/images`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    return handleResponse(res)
  },
}
