import { Router } from "express"

import blogSiteRouter from './blog-site/index.js'

export default function () {
  const app = Router()

  blogSiteRouter(app)

  return app
}