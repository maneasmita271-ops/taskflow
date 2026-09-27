import { getDatabase } from '../_lib/mongodb.js'
import { INITIAL_TASKS, EMPLOYEES, INITIAL_ACTIVITY } from '../_lib/seedData.js'

export async function ensureSeed(db) {
  const tasksCount = await db.collection('tasks').countDocuments()
  if (tasksCount === 0) {
    const tasksToInsert = INITIAL_TASKS.map(t => ({ ...t, _id: String(t.id) }))
    const membersToInsert = EMPLOYEES.map(m => ({ ...m, _id: m.name, id: m.name }))
    const activityToInsert = INITIAL_ACTIVITY.map(a => ({ ...a, _id: String(a.id) }))

    if (tasksToInsert.length > 0) {
      await db.collection('tasks').insertMany(tasksToInsert)
    }
    const membersCount = await db.collection('members').countDocuments()
    if (membersCount === 0 && membersToInsert.length > 0) {
      await db.collection('members').insertMany(membersToInsert)
    }
    const actCount = await db.collection('activities').countDocuments()
    if (actCount === 0 && activityToInsert.length > 0) {
      await db.collection('activities').insertMany(activityToInsert)
    }
  }
}

export default async function handler(req, res) {
  try {
    const db = await getDatabase()
    await ensureSeed(db)

    if (req.method === 'GET') {
      const tasks = await db.collection('tasks').find({}).toArray()
      const memberNameMap = {
        m1: 'Sarah Chen',
        m2: 'Alex Rivera',
        m3: 'Maria Santos',
        m4: 'David Kim',
        m5: 'Emma Watson',
      }
      const formatted = tasks.map(({ _id, ...rest }) => {
        let status = rest.status || 'To Do'
        if (status === 'Done') status = 'Completed'
        if (status === 'Todo') status = 'To Do'

        return {
          ...rest,
          id: rest.id !== undefined ? rest.id : _id,
          assignee: rest.assignee || memberNameMap[rest.assigneeId] || 'Priya Sharma',
          deadline: rest.deadline || rest.dueDate || 'Today, 5:00 PM',
          priority: rest.priority || 'Medium',
          status,
        }
      })
      return res.status(200).json(formatted)
    }

    if (req.method === 'POST') {
      const taskData = req.body
      if (!taskData.title || !taskData.deadline) {
        return res.status(400).json({ error: 'Title and deadline are required' })
      }

      const id = taskData.id !== undefined ? taskData.id : Date.now()
      const newTask = {
        id,
        _id: String(id),
        title: taskData.title.trim(),
        description: taskData.description || '',
        assignee: taskData.assignee || 'Priya Sharma',
        deadline: taskData.deadline,
        priority: taskData.priority || 'Medium',
        status: taskData.status || 'To Do',
      }

      await db.collection('tasks').insertOne(newTask)
      return res.status(201).json(newTask)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('API /api/tasks error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
