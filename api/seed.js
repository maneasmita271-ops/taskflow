import { getDatabase } from './_lib/mongodb.js'
import { INITIAL_TASKS, EMPLOYEES, INITIAL_ACTIVITY } from './_lib/seedData.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const db = await getDatabase()

    await db.collection('tasks').deleteMany({})
    await db.collection('members').deleteMany({})
    await db.collection('activities').deleteMany({})

    const tasksToInsert = INITIAL_TASKS.map(t => ({ ...t, _id: String(t.id) }))
    const membersToInsert = EMPLOYEES.map(m => ({ ...m, _id: m.name, id: m.name }))
    const activityToInsert = INITIAL_ACTIVITY.map(a => ({ ...a, _id: String(a.id) }))

    if (tasksToInsert.length > 0) await db.collection('tasks').insertMany(tasksToInsert)
    if (membersToInsert.length > 0) await db.collection('members').insertMany(membersToInsert)
    if (activityToInsert.length > 0) await db.collection('activities').insertMany(activityToInsert)

    return res.status(200).json({ success: true, message: 'Database seeded successfully' })
  } catch (error) {
    console.error('API /api/seed error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
