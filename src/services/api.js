/**
 * Client-side API Service for TaskFlow
 * Calls Vercel serverless /api endpoints
 */

const API_BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    let errMsg = `Request failed with status ${res.status}`
    try {
      const err = await res.json()
      if (err?.error) errMsg = err.error
    } catch {
      // ignore json parse error
    }
    throw new Error(errMsg)
  }
  return res.json()
}

// ── Tasks API ────────────────────────────────────────────────────────────────
export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`)
  return handleResponse(res)
}

export async function createTask(taskData) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  })
  return handleResponse(res)
}

export async function updateTask(id, updates) {
  const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  return handleResponse(res)
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return handleResponse(res)
}

// ── Members API ──────────────────────────────────────────────────────────────
export async function getMembers() {
  const res = await fetch(`${API_BASE}/members`)
  return handleResponse(res)
}

export async function createMember(memberData) {
  const res = await fetch(`${API_BASE}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  })
  return handleResponse(res)
}

export async function deleteMember(id) {
  const res = await fetch(`${API_BASE}/members/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return handleResponse(res)
}

// ── Activities API ───────────────────────────────────────────────────────────
export async function getActivities() {
  const res = await fetch(`${API_BASE}/activities`)
  return handleResponse(res)
}

export async function createActivity(text, type = 'edit') {
  const res = await fetch(`${API_BASE}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, type }),
  })
  return handleResponse(res)
}

// ── Seed / Reset API ─────────────────────────────────────────────────────────
export async function seedDatabase() {
  const res = await fetch(`${API_BASE}/seed`, {
    method: 'POST',
  })
  return handleResponse(res)
}
