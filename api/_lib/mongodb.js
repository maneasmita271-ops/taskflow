import { MongoClient } from 'mongodb'
import { INITIAL_TASKS, EMPLOYEES, INITIAL_ACTIVITY } from './seedData.js'

let client
let clientPromise

export function isMongoConfigured() {
  return Boolean(process.env.MONGODB_URI)
}

function getClientPromise() {
  if (clientPromise) {
    return clientPromise
  }

  const currentUri = process.env.MONGODB_URI
  if (!currentUri) {
    return null
  }

  const options = { serverSelectionTimeoutMS: 3000 }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(currentUri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(currentUri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

export default getClientPromise

// In-memory memory adapter for development/preview when MONGODB_URI is not set yet
class MemoryCollection {
  constructor(initialData = []) {
    this.data = initialData.map(d => ({ ...d }))
  }

  async countDocuments() {
    return this.data.length
  }

  async insertMany(docs) {
    this.data.push(...docs.map(d => ({ ...d })))
    return { insertedCount: docs.length }
  }

  async insertOne(doc) {
    this.data.unshift({ ...doc })
    return { insertedId: doc._id || doc.id }
  }

  find() {
    let items = [...this.data]
    return {
      sort: () => ({
        limit: (n) => ({
          toArray: async () => items.slice(0, n)
        }),
        toArray: async () => items
      }),
      limit: (n) => ({
        toArray: async () => items.slice(0, n)
      }),
      toArray: async () => items
    }
  }

  async findOneAndUpdate(query, update) {
    const itemIndex = this.data.findIndex(item => {
      if (query.$or) {
        return query.$or.some(q => {
          if (q.id !== undefined && item.id == q.id) return true
          if (q._id !== undefined && item._id == q._id) return true
          return false
        })
      }
      return false
    })

    if (itemIndex === -1) return null
    if (update.$set) {
      this.data[itemIndex] = { ...this.data[itemIndex], ...update.$set }
    }
    return this.data[itemIndex]
  }

  async deleteOne(query) {
    const prevLen = this.data.length
    this.data = this.data.filter(item => {
      if (query.$or) {
        return !query.$or.some(q => {
          if (q.id !== undefined && item.id == q.id) return true
          if (q._id !== undefined && item._id == q._id) return true
          if (q.name !== undefined && item.name == q.name) return true
          return false
        })
      }
      return true
    })
    return { deletedCount: prevLen - this.data.length }
  }

  async updateMany(query, update) {
    let count = 0
    this.data = this.data.map(item => {
      let matches = false
      if (query.assignee !== undefined && item.assignee === query.assignee) {
        matches = true
      }
      if (matches) {
        count++
        return { ...item, ...(update.$set || {}) }
      }
      return item
    })
    return { modifiedCount: count }
  }

  async deleteMany() {
    const count = this.data.length
    this.data = []
    return { deletedCount: count }
  }
}

class MemoryDatabase {
  constructor() {
    this.collections = {
      tasks: new MemoryCollection(INITIAL_TASKS.map(t => ({ ...t, _id: String(t.id) }))),
      members: new MemoryCollection(EMPLOYEES.map(m => ({ ...m, _id: m.name, id: m.name }))),
      activities: new MemoryCollection(INITIAL_ACTIVITY.map(a => ({ ...a, _id: String(a.id) }))),
    }
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new MemoryCollection([])
    }
    return this.collections[name]
  }
}

// Global memory DB across hot reloads in dev
if (!global._memoryDatabase) {
  global._memoryDatabase = new MemoryDatabase()
}

let isConnected = null

export async function getDatabase() {
  if (isConnected === false) {
    return global._memoryDatabase
  }

  const promise = getClientPromise()
  if (promise) {
    try {
      const clientInstance = await promise
      isConnected = true
      return clientInstance.db()
    } catch {
      isConnected = false
    }
  }
  return global._memoryDatabase
}
