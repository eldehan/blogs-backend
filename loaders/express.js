import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import config from '../config/index.js'
import morgan from 'morgan'
import { notFoundHandler, globalErrorHandler } from '../routes/middlewares/errors.js'

import indexRouter from '../routes/index.js'

export default async function ({ app }) {

  // status checks
  app.get('/status', (req, res) => res.sendStatus(200).end())
  app.head('/status', (req, res) => res.sendStatus(200).end())

  // reveal real origin ip behind reverse proxies
  app.enable('trust proxy')

  // middlewares
  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(morgan(config.logs.morgan))

  // routes
  app.use(indexRouter())

  // error handlers
  app.use(notFoundHandler)
  app.use(globalErrorHandler)
}