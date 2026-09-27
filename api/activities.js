import { getDatabase } from './_lib/mongodb.js'
import { INITIAL_ACTIVITY } from './_lib/seedData.js'

export async function ensureActivitiesSeed(db) {
  const count = await db.collection('activities').countDocuments()
  if (count === 0 && INITIAL_ACTIVITY.length > 0) {
    const actToInsert = INITIAL_ACTIVITY.map(a => ({ ...a, _id: a.id }))
    await db.collection('activities').insertMany(actToInsert)
  }
}

export default async function handler(req, res) {
  try {
    const db = await getDatabase()
    await ensureActivitiesSeed(db)

    if (req.method === 'GET') {
      const activities = await db
        .collection('activities')
        .find({})
        .sort({ createdAt: -1 })
        .limit(30)
        .toArray()

      const formatted = activities.map(({ _id, ...rest }) => ({
        id: rest.id || _id?.toString(),
        ...rest,
      }))
      return res.status(200).json(formatted)
    }

    if (req.method === 'POST') {
      const { text, type } = req.body
      if (!text) {
        return res.status(400).json({ error: 'Activity text is required' })
      }

      const id = req.body.id || 'a' + Date.now()
      const newActivity = {
        id,
        _id: id,
        text,
        time: 'Just now',
        type: type || 'edit',
        createdAt: new Date().toISOString(),
      }

      await db.collection('activities').insertOne(newActivity)
      return res.status(201).json(newActivity)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('API /api/activities error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
