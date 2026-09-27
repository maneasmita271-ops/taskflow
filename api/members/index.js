import { getDatabase } from '../_lib/mongodb.js'
import { EMPLOYEES } from '../_lib/seedData.js'

export async function ensureMembersSeed(db) {
  const membersCount = await db.collection('members').countDocuments()
  if (membersCount === 0) {
    const membersToInsert = EMPLOYEES.map(m => ({ ...m, _id: m.name, id: m.name }))
    if (membersToInsert.length > 0) {
      await db.collection('members').insertMany(membersToInsert)
    }
  }
}

export default async function handler(req, res) {
  try {
    const db = await getDatabase()
    await ensureMembersSeed(db)

    if (req.method === 'GET') {
      const members = await db.collection('members').find({}).toArray()
      const formatted = members.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id?.toString(),
      }))
      return res.status(200).json(formatted)
    }

    if (req.method === 'POST') {
      const { name, role, color } = req.body
      if (!name || !role) {
        return res.status(400).json({ error: 'Name and role are required' })
      }

      const initials = name
        .trim()
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      const newMember = {
        id: name.trim(),
        _id: name.trim(),
        name: name.trim(),
        role: role.trim(),
        initials: initials || '??',
        color: color || '#4f6ef7',
      }

      await db.collection('members').insertOne(newMember)
      return res.status(201).json(newMember)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('API /api/members error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
