import { Router } from 'express'
import passport from 'passport'
import passportConfig from '../../config/passport.js'

import usersRoute from './users.js'
import blogsRoute from './blogs.js'

export default function (app) {
  const route = Router()
  app.use('/blog-site', route)

  app.use(passport.initialize())
  passportConfig(passport)

  usersRoute(route)
  blogsRoute(route)

  return route
}