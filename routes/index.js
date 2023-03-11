import { Router } from "express"

import blogSiteRouter from './blog-site/index.js'
import healthCheckRouter from './health/index.js'

export default function () {
  const app = Router()

  healthCheckRouter(app)
  blogSiteRouter(app)

  return app
}