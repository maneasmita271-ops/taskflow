import { getDatabase } from '../_lib/mongodb.js'

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Member ID or name is required' })
  }

  try {
    const db = await getDatabase()

    if (req.method === 'DELETE') {
      const decodedId = decodeURIComponent(id)
      const result = await db.collection('members').deleteOne({
        $or: [{ id: decodedId }, { _id: decodedId }, { name: decodedId }]
      })

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Member not found' })
      }

      // Reassign or unassign tasks assigned to this person
      await db.collection('tasks').updateMany(
        { assignee: decodedId },
        { $set: { assignee: 'Unassigned' } }
      )

      return res.status(200).json({ success: true, id: decodedId })
    }

    res.setHeader('Allow', ['DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error(`API /api/members/${id} error:`, error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
