import { Router } from 'express'

import HealthCheck from '../../db/healthCheckModel.js'

export default function (app) {
  const route = Router()
  app.use('/health', route)

  route.get('/', async (req, res, next) => {
    try {
      const dbHealthData = await HealthCheck.findOneAndUpdate({ "event": "check" },
        { "event": "check" }, {
        new: true,
        upsert: true,
      })

      const dbUp = dbHealthData !== undefined

      const healthCheck = {
        message: 'OK',
        uptime: process.uptime(),
        databaseUp: dbUp,
        timestamp: Date.now()
      }

      res.send(healthCheck)
    } catch (error) {
      next(error)
    }
  })

  return route
}