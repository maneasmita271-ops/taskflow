import { getDatabase } from '../_lib/mongodb.js'

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Task ID is required' })
  }

  try {
    const db = await getDatabase()
    const numericId = Number(id)
    const query = {
      $or: [
        { id: isNaN(numericId) ? id : numericId },
        { id: String(id) },
        { _id: String(id) },
      ]
    }

    if (req.method === 'PUT') {
      const updates = { ...req.body }
      delete updates._id
      delete updates.id

      const result = await db.collection('tasks').findOneAndUpdate(
        query,
        { $set: updates },
        { returnDocument: 'after' }
      )

      if (!result) {
        return res.status(404).json({ error: 'Task not found' })
      }

      const { _id, ...cleanTask } = result
      return res.status(200).json({ ...cleanTask, id: cleanTask.id !== undefined ? cleanTask.id : _id })
    }

    if (req.method === 'DELETE') {
      const result = await db.collection('tasks').deleteOne(query)

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Task not found' })
      }

      return res.status(200).json({ success: true, id })
    }

    res.setHeader('Allow', ['PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error(`API /api/tasks/${id} error:`, error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
