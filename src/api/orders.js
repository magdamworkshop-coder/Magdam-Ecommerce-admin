const base = '/api/orders'

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
  async fetchOrders() {
    const res = await fetch(base, { credentials: 'include' })
    return handleResponse(res)
  },

  async updateOrder(id, payload = {}) {
    const res = await fetch(`${base}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    return handleResponse(res)
  },
}
