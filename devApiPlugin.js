import tasksHandler from './api/tasks/index.js'
import taskDetailHandler from './api/tasks/[id].js'
import membersHandler from './api/members/index.js'
import memberDetailHandler from './api/members/[id].js'
import activitiesHandler from './api/activities.js'
import seedHandler from './api/seed.js'

export function devApiPlugin() {
  return {
    name: 'dev-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next()
        }

        // Helper to parse JSON body if needed
        const getBody = () => new Promise((resolve) => {
          if (req.method === 'GET' || req.method === 'DELETE') return resolve({})
          let data = ''
          req.on('data', chunk => { data += chunk })
          req.on('end', () => {
            try {
              resolve(data ? JSON.parse(data) : {})
            } catch {
              resolve({})
            }
          })
        })

        // Enhance res with status and json helpers matching Vercel/Express
        res.status = function (code) {
          this.statusCode = code
          return this
        }
        res.json = function (obj) {
          this.setHeader('Content-Type', 'application/json')
          this.end(JSON.stringify(obj))
          return this
        }

        try {
          const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
          req.query = Object.fromEntries(parsedUrl.searchParams.entries())
          req.body = await getBody()

          const pathname = parsedUrl.pathname

          if (pathname === '/api/tasks' || pathname === '/api/tasks/') {
            return await tasksHandler(req, res)
          }

          const taskMatch = pathname.match(/^\/api\/tasks\/([^/?]+)/)
          if (taskMatch) {
            req.query.id = decodeURIComponent(taskMatch[1])
            return await taskDetailHandler(req, res)
          }

          if (pathname === '/api/members' || pathname === '/api/members/') {
            return await membersHandler(req, res)
          }

          const memberMatch = pathname.match(/^\/api\/members\/([^/?]+)/)
          if (memberMatch) {
            req.query.id = decodeURIComponent(memberMatch[1])
            return await memberDetailHandler(req, res)
          }

          if (pathname === '/api/activities' || pathname === '/api/activities/') {
            return await activitiesHandler(req, res)
          }

          if (pathname === '/api/seed' || pathname === '/api/seed/') {
            return await seedHandler(req, res)
          }

          next()
        } catch (err) {
          console.error('Dev API middleware error:', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Server error' }))
          }
        }
      })
    }
  }
}
