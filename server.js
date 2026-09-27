import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer as createViteServer } from 'vite'

// Load environment variables
dotenv.config()

// Import serverless handlers
import tasksHandler from './api/tasks/index.js'
import taskDetailHandler from './api/tasks/[id].js'
import membersHandler from './api/members/index.js'
import memberDetailHandler from './api/members/[id].js'
import activitiesHandler from './api/activities.js'
import seedHandler from './api/seed.js'

async function startServer() {
  const app = express()
  const port = process.env.PORT || 3000

  app.use(cors())
  app.use(express.json())

  // Wrap Vercel function signature (req, res) for express
  const wrap = (handler) => async (req, res) => {
    try {
      req.query = { ...req.query, ...req.params }
      await handler(req, res)
    } catch (err) {
      console.error('Unhandled server error:', err)
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || 'Internal Server Error' })
      }
    }
  }

  // API Routes
  app.all('/api/tasks', wrap(tasksHandler))
  app.all('/api/tasks/:id', wrap(taskDetailHandler))
  app.all('/api/members', wrap(membersHandler))
  app.all('/api/members/:id', wrap(memberDetailHandler))
  app.all('/api/activities', wrap(activitiesHandler))
  app.all('/api/seed', wrap(seedHandler))

  // Vite middleware in dev mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })
  app.use(vite.middlewares)

  app.listen(port, '0.0.0.0', () => {
    console.log(`TaskFlow full-stack server running at http://0.0.0.0:${port}`)
  })
}

startServer().catch(err => {
  console.error('Failed to start server:', err)
})
